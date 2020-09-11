/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import ImageUploader from "react-images-upload";
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import * as publicUtils from './utils/publicUtils.js';
import BankInfo from './accountInfo';
import SubCost from './costInfo';
import BpInfoModel from './bpInfo';
import PasswordSet from './passwordSet';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';


axios.defaults.withCredentials = true;


class employee extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.insertEmployee = this.insertEmployee.bind(this);//登録
		this.onDrop = this.onDrop.bind(this);//ImageUploaderを処理
		this.radioChangeEmployeeType = this.radioChangeEmployeeType.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
	}
	//初期化
	initialState = {
		siteMaster: [],
		showBankInfoModal: false,//口座情報画面フラグ
		showSubCostModal: false,//諸費用
		showpasswordSetModal: false,//PW設定
		showPbInfoModal: false,//pb情報
		pictures: [],//ImageUploader
		genderStatuss: [],//性別
		intoCompanyCodes: [],//　　入社区分
		employeeFormCodes: [],//　　社員形式
		occupationCodes: [],//　　職種
		departmentCodes: [],//　　部署
		authorityCodes: [],//　　権限
		japaneaseLevelCodes: [],//　　日本語
		residenceCodes: [],//　　在留資格
		englishLeveCodes: [],//　　英語
		nationalityCodes: [],//　　出身地 
		retirementYearAndMonthDisabled: false,//退職年月の活性フラグ
		accountInfo: null,//口座情報のデータ
		subCostInfo: null,//諸費用のデータ
		detailDisabled: true,//明細の時、全部のインプットをリードオンリーにします
		bpInfoModel: null,//pb情報
		station: [],//駅
		myToastShow: false,
		errorsMessageShow: false,
		developLanguage1: '',
		developLanguage2: '',
		developLanguage3: '',
		developLanguage4: '',
		developLanguage5: '',
		developLanguageMaster: [],
		stationCode1: '',
	};
	//　　リセット
	resetBook = () => {
		window.location.href = window.location.href
	};
	//　　登録
	insertEmployee = () => {
		const formData = new FormData()
		const emp = {
			employeeStatus: $('input:radio[name="employeeType"]:checked').val(),//社員ステータス
			employeeNo: this.state.employeeNo,//社員番号
			bpEmployeeNo: this.state.employeeNo,//社員番号
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana1: this.state.furigana1,//　　カタカナ
			furigana2: this.state.furigana2,//　　カタカナ
			alphabetName: this.state.alphabetName,//　　ローマ字
			birthday: publicUtils.formateDate(this.state.birthday, true),//年齢
			japaneseCalendar: this.state.japaneseCalendar,//和暦
			genderStatus: this.state.genderStatus,//性別
			intoCompanyCode: this.state.intoCompanyCode,//入社区分
			employeeFormCode: this.state.employeeFormCode,//社員形式
			occupationCode: this.state.occupationCode,//職種
			departmentCode: this.state.departmentCode,//部署
			companyMail: this.state.companyMail,//社内メール
			graduationUniversity: this.state.graduationUniversity,//卒業学校
			major: this.state.major,//専門
			graduationYearAndMonth: publicUtils.formateDate(this.state.graduationYearAndMonth, false),//卒業年月
			intoCompanyYearAndMonth: publicUtils.formateDate(this.state.intoCompanyYearAndMonth, false),//入社年月
			retirementYearAndMonth: publicUtils.formateDate(this.state.retirementYearAndMonth, false),//退職年月
			comeToJapanYearAndMonth: publicUtils.formateDate(this.state.comeToJapanYearAndMonth, false),//来日年月
			nationalityCode: this.state.nationalityCode,//出身地
			birthplace: this.state.birthplace,//出身県
			phoneNo: this.state.phoneNo,//携帯電話
			authorityCode: $('input:radio[name="employeeType"]:checked').val() === "0" ? $("#authorityCodeId").val() : "0",//権限
			japaneseLevelCode: this.state.japaneseLevelCode,//日本語
			englishLevelCode: this.state.englishLevelCode,//英語
			certification1: this.state.certification1,//資格1
			certification2: this.state.certification2,//資格2
			siteRoleCode: this.state.siteRoleCode,//役割
			postcode: this.state.postcode,//郵便番号
			firstHalfAddress: this.state.firstHalfAddress,
			lastHalfAddress: this.state.lastHalfAddress,
			stationCode1: publicUtils.labelGetValue($("#nearestStationCode").val(), this.state.station),
			developLanguage1: publicUtils.labelGetValue($("#developLanguageCode1").val(), this.state.developLanguageMaster),
			developLanguage2: publicUtils.labelGetValue($("#developLanguageCode2").val(), this.state.developLanguageMaster),
			developLanguage3: publicUtils.labelGetValue($("#developLanguageCode3").val(), this.state.developLanguageMaster),
			developLanguage4: publicUtils.labelGetValue($("#developLanguageCode4").val(), this.state.developLanguageMaster),
			developLanguage5: publicUtils.labelGetValue($("#developLanguageCode5").val(), this.state.developLanguageMaster),
			residenceCode: this.state.residenceCode,//在留資格
			residenceCardNo: this.state.residenceCardNo,//在留カード
			stayPeriod: publicUtils.formateDate(this.state.stayPeriod, false),//在留期間
			employmentInsuranceNo: this.state.employmentInsuranceNo,//雇用保険番号
			myNumber: this.state.myNumber,//マイナンバー
			resumeRemark1: this.state.resumeRemark1,//履歴書備考1
			resumeRemark2: this.state.resumeRemark2,//履歴書備考1
			accountInfo: this.state.accountInfo,//口座情報
			subCostInfo: this.state.subCostInfo,//諸費用
			password: this.state.passwordSetInfo,//pw設定
			yearsOfExperience: publicUtils.formateDate(this.state.yearsOfExperience, false),//経験年数
			bpInfoModel: this.state.bpInfoModel,//pb情報
		};
		formData.append('emp', JSON.stringify(emp))
		formData.append('resumeInfo1', $('#resumeInfo1').get(0).files[0])
		formData.append('resumeInfo2', $('#resumeInfo2').get(0).files[0])
		formData.append('residentCardInfo', $('#residentCardInfo').get(0).files[0])
		formData.append('passportInfo', $('#passportInfo').get(0).files[0])
		//formData.append('pictures', $('.pi').get(0).files[0])
		axios.post("http://127.0.0.1:8080/employee/insertEmployee", formData)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
					this.getNO("LYC");//採番番号
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
	//更新ボタン
	updateEmployee = () => {
		const formData = new FormData()
		const emp = {
			employeeStatus: $('input:radio[name="employeeType"]:checked').val(),//社員ステータス
			employeeNo: this.state.employeeNo,//社員番号
			bpEmployeeNo: this.state.employeeNo,//社員番号
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana1: this.state.furigana1,//　　カタカナ
			furigana2: this.state.furigana2,//　　カタカナ
			alphabetName: this.state.alphabetName,//　　ローマ字
			birthday: publicUtils.formateDate(this.state.birthday, true),//年齢
			japaneseCalendar: this.state.japaneseCalendar,//和暦
			genderStatus: this.state.genderStatus,//性別
			intoCompanyCode: this.state.intoCompanyCode,//入社区分
			employeeFormCode: this.state.employeeFormCode,//社員形式
			occupationCode: this.state.occupationCode,//職種
			departmentCode: this.state.departmentCode,//部署
			companyMail: this.state.companyMail,//社内メール
			graduationUniversity: this.state.graduationUniversity,//卒業学校
			major: this.state.major,//専門
			graduationYearAndMonth: publicUtils.formateDate(this.state.graduationYearAndMonth, false),//卒業年月
			intoCompanyYearAndMonth: publicUtils.formateDate(this.state.intoCompanyYearAndMonth, false),//入社年月
			retirementYearAndMonth: publicUtils.formateDate(this.state.retirementYearAndMonth, false),//退職年月
			comeToJapanYearAndMonth: publicUtils.formateDate(this.state.comeToJapanYearAndMonth, false),//来日年月
			nationalityCode: this.state.nationalityCode,//出身地
			birthplace: this.state.birthplace,//出身県
			phoneNo: this.state.phoneNo,//携帯電話
			authorityCode: $("#authorityCodeId").val(),//権限
			japaneseLevelCode: this.state.japaneseLevelCode,//日本語
			englishLevelCode: this.state.englishLevelCode,//英語
			certification1: this.state.certification1,//資格1
			certification2: this.state.certification2,//資格2
			siteRoleCode: this.state.siteRoleCode,//役割
			postcode: this.state.postcode,//郵便番号
			firstHalfAddress: this.state.firstHalfAddress,
			lastHalfAddress: this.state.lastHalfAddress,
			stationCode1: publicUtils.labelGetValue($("#nearestStationCode").val(), this.state.station),
			developLanguage1: publicUtils.labelGetValue($("#developLanguageCode1").val(), this.state.developLanguageMaster),
			developLanguage2: publicUtils.labelGetValue($("#developLanguageCode2").val(), this.state.developLanguageMaster),
			developLanguage3: publicUtils.labelGetValue($("#developLanguageCode3").val(), this.state.developLanguageMaster),
			developLanguage4: publicUtils.labelGetValue($("#developLanguageCode4").val(), this.state.developLanguageMaster),
			developLanguage5: publicUtils.labelGetValue($("#developLanguageCode5").val(), this.state.developLanguageMaster),
			residenceCode: this.state.residenceCode,//在留資格
			residenceCardNo: this.state.residenceCardNo,//在留カード
			stayPeriod: publicUtils.formateDate(this.state.stayPeriod, false),//在留期間
			employmentInsuranceNo: this.state.employmentInsuranceNo,//雇用保険番号
			myNumber: this.state.myNumber,//マイナンバー
			resumeRemark1: this.state.resumeRemark1,//履歴書備考1
			resumeRemark2: this.state.resumeRemark2,//履歴書備考1
			accountInfo: this.state.accountInfo,//口座情報
			subCostInfo: this.state.subCostInfo,//諸費用
			password: this.state.passwordSetInfo,//pw設定
			yearsOfExperience: publicUtils.formateDate(this.state.yearsOfExperience, false),//経験年数
			bpInfoModel: this.state.bpInfoModel,//pb情報

		};
		formData.append('emp', JSON.stringify(emp))
		formData.append('resumeInfo1', $('#resumeInfo1').get(0).files[0])
		formData.append('resumeInfo2', $('#resumeInfo2').get(0).files[0])
		formData.append('residentCardInfo', $('#residentCardInfo').get(0).files[0])
		formData.append('passportInfo', $('#passportInfo').get(0).files[0])
		formData.append('pictures', this.state.pictures)
		axios.post("http://127.0.0.1:8080/employee/updateEmployee", formData)
			.then(response => {
				if (response.data != null) {
					this.setState({ "myToastShow": true, "method": "put" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else {
					this.setState({ "myToastShow": false });
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		var val = $('#nationalityCodeId').val();
		if (val === '3') {
			this.setState({
				japaneseLevelCode: 5,
			})
		} else if (val === '4') {
			this.setState({
				englishLevelCode: 8,
			})
		}
	}
	//初期化メソッド
	componentDidMount() {
		this.getDropDownｓ();//全部のドロップダウン
		this.radioChangeEmployeeType();
		const { location } = this.props
		var actionType = '';
		var id = '';
		if (location.state) {
			actionType = location.state.actionType;
			sessionStorage.setItem('actionType', actionType);
			id = location.state.id;
			sessionStorage.setItem('id', id);
		} else {
			actionType = sessionStorage.getItem('actionType');
			id = sessionStorage.getItem('id');
		}
		if (actionType === 'update') {
			this.getEmployeeByEmployeeNo(id);
		} else if (actionType === 'detail') {
			this.getEmployeeByEmployeeNo(id);
			this.setState(
				{
					detailDisabled: false
				}
			);
		} else {
			this.getNO('LYC');//採番番号
		}
	}

	getDropDownｓ = () => {
		var methodArray = ["getGender", "getIntoCompany", "getStaffForms", "getOccupation", "getDepartment", "getAuthority", "getJapaneseLevel",
			"getVisa", "getEnglishLevel", "getNationalitys", "getSiteMaster", "getStation", "getCustomer", "getDevelopLanguage"]
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				genderStatuss: data[0],//　性別区別
				intoCompanyCodes: data[1],//　入社区分 
				employeeFormCodes: data[2],//　 社員形式 
				occupationCodes: data[3],//　職種
				departmentCodes: data[4],//　 部署 
				authorityCodes: data[5].slice(1),//　 権限 
				japaneaseLevelCodes: data[6],//　日本語  
				residenceCodes: data[7],//　在留資格
				englishLeveCodes: data[8],//　英語
				nationalityCodes: data[9],//　 出身地国
				siteMaster: data[10],//　役割
				station: data[11].slice(1),//　駅
				customer: data[12].slice(1),//BP所属
				developLanguageMaster: data[13].slice(1),//開発言語
			}
		);
	};

	getAuthority = () => {
		var methodArray = ["getAuthority"]
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				authorityCodes: data[0].slice(1),//　 権限 
			}
		);
	};

	getEmployeeByEmployeeNo = employeeNo => {
		const emp = {
			employeeNo: employeeNo
		};
		axios.post("http://127.0.0.1:8080/employee/getEmployeeByEmployeeNo", emp)
			.then(response => response.data)
			.then((data) => {
				this.setState({
					//employeeNo: date.employeeNo,//ピクチャ
					employeeStatus: $('input:radio[name="employeeType"]:checked').val(),//社員ステータス
					employeeNo: data.employeeNo,//社員番号
					bpEmployeeNo: data.employeeNo,//社員番号
					employeeFristName: data.employeeFristName,//社員氏
					employeeLastName: data.employeeLastName,//社員名
					furigana1: data.furigana1,//　　カタカナ
					furigana2: data.furigana2,//　　カタカナ
					alphabetName: data.alphabetName,//　　ローマ字
					birthday: publicUtils.converToLocalTime(data.birthday, true),//年齢
					temporary_age: publicUtils.converToLocalTime(data.birthday, true) === "" ? "" : Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(data.birthday, true).getTime()) / 31536000000),
					japaneseCalendar: data.japaneseCalendar,//和暦
					genderStatus: data.genderStatus,//性別
					intoCompanyCode: data.intoCompanyCode,//入社区分
					employeeFormCode: data.employeeFormCode,//社員形式
					retirementYearAndMonthDisabled: data.employeeFormCode === "3" ? true : false,
					occupationCode: data.occupationCode,//職種
					departmentCode: data.departmentCode,//部署
					companyMail: data.companyMail,//社内メール
					graduationUniversity: data.graduationUniversity,//卒業学校
					major: data.major,//専門
					graduationYearAndMonth: publicUtils.converToLocalTime(data.graduationYearAndMonth, false),//卒業年月
					temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.graduationYearAndMonth, false), new Date()),
					intoCompanyYearAndMonth: publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, false),//入社年月
					temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, false), new Date()),
					retirementYearAndMonth: publicUtils.converToLocalTime(data.retirementYearAndMonth, false),//退職年月
					temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.retirementYearAndMonth, false), new Date()),
					comeToJapanYearAndMonth: publicUtils.converToLocalTime(data.comeToJapanYearAndMonth, false),//来日年月
					temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.comeToJapanYearAndMonth, false), new Date()),
					nationalityCode: data.nationalityCode,//出身地
					birthplace: data.birthplace,//出身県
					phoneNo: data.phoneNo,//携帯電話
					authorityCode: $("#authorityCodeId").val(),//権限
					japaneseLevelCode: data.japaneseLevelCode,//日本語
					englishLevelCode: data.englishLevelCode,//英語
					certification1: data.certification1,//資格1
					certification2: data.certification2,//資格2
					siteRoleCode: data.siteRoleCode,//役割
					postcode: ((data.postcode+"       ").replace("null","")).substring(0,3).replace("   ",""),//郵便番号
					postcode2: ((data.postcode+"       ").replace("null","")).substring(3,4).replace("",""),//郵便番号
					firstHalfAddress: data.firstHalfAddress,
					lastHalfAddress: data.lastHalfAddress,
					stationCode1: data.stationCode1,
					developLanguage1: data.developLanguage1,//　スキール1
					developLanguage2: data.developLanguage2,//スキール2
					developLanguage3: data.developLanguage3,//スキール3
					developLanguage4: data.developLanguage4,//スキール4
					developLanguage5: data.developLanguage5,//スキール5
					residenceCode: data.residenceCode,//在留資格
					residenceCardNo: data.residenceCardNo,//在留カード
					stayPeriod: publicUtils.converToLocalTime(data.stayPeriod, false),//在留期間
					temporary_stayPeriod: publicUtils.converToLocalTime(data.stayPeriod, false) === "" ? "" : publicUtils.getFullYearMonth(new Date(), publicUtils.converToLocalTime(data.stayPeriod, false)),
					employmentInsuranceNo: data.employmentInsuranceNo,//雇用保険番号
					myNumber: data.myNumber,//マイナンバー
					residentCardInfo: data.residentCardInfo,//在留カード
					//resumeInfo1: "rrr",//履歴書
					resumeRemark1: data.resumeRemark1,//履歴書備考1
					resumeInfo2: data.resumeInfo2,//履歴書2
					resumeRemark2: data.resumeRemark2,//履歴書備考1
					passportInfo: data.passportInfo,//パスポート
					yearsOfExperience: publicUtils.converToLocalTime(data.yearsOfExperience, false),//経験年数
					temporary_yearsOfExperience: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.yearsOfExperience, false), new Date()),
				});
			});
	};

	//　採番番号
	getNO = (ｓｔｒ) => {
		const promise = Promise.resolve(publicUtils.getNO("employeeNo", ｓｔｒ, "T001Employee"));
		promise.then((value) => {
			this.setState(
				{
					employeeNo: value
				}
			);
		});
	};

	//ImageUploaderを処理　開始
	onDrop(pictureFiles, pictureDataURLs) {
		this.setState({
			pictures: pictureFiles
		});
	}
	//ImageUploaderを処理　終了
	//　　年月開始
	//　　卒業年月
	state = {
		birthday: new Date(),
		intoCompanyYearAndMonth: new Date(),
		retirementYearAndMonth: new Date(),
		comeToJapanYearAndMonth: new Date(),
		yearsOfExperience: new Date(),
		stayPeriod: new Date(),
		graduationYearAndMonth: new Date(),
	};
	//　　年齢と和暦
	inactiveBirthday = date => {
		if (date !== undefined && date !== null && date !== "") {
			publicUtils.calApi(date);
			this.setState({
				birthday: date
			});
		} else {
			this.setState({
				temporary_age: "0",
				birthday: "",
				japaneseCalendar: ""
			});
		}
	};
	//　　卒業年月
	inactiveGraduationYearAndMonth = date => {
		this.setState(
			{
				graduationYearAndMonth: date,
				temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),
				temporary_yearsOfExperience: (this.state.yearsOfExperience === undefined) ? publicUtils.getFullYearMonth(date, new Date()) : this.state.temporary_yearsOfExperience
			}
		);
	};
	//　　入社年月
	inactiveintoCompanyYearAndMonth = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonth: date,
				temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//　　退職年月
	inactiveRetirementYearAndMonth = (date) => {
		this.setState(
			{
				retirementYearAndMonth: date,
				temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),

			}
		);
	};
	//　　来日年月
	inactiveComeToJapanYearAndMonth = date => {
		this.setState(
			{
				comeToJapanYearAndMonth: date,
				temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(date, new Date())

			}
		);
	};
	//　　経験年数
	inactiveyearsOfExperience = date => {
		this.setState(
			{
				yearsOfExperience: date,
				temporary_yearsOfExperience: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//　　在留期間
	inactiveStayPeriod = date => {
		this.setState(
			{
				stayPeriod: date,
				temporary_stayPeriod: publicUtils.getFullYearMonth(new Date(), date)
			}
		);
	};
	//　　年月終了

	//社員タイプが違う時に、色々な操作をします。
	radioChangeEmployeeType = () => {
		var val = $('input:radio[name="employeeType"]:checked').val();
		if (val === '1') {
			this.setState({ companyMail: '', authorityCodes: [] });
			$('input[type="email"]').prop('disabled', true);
			$('#authorityCodeId').prop('disabled', true);
			$('#bankInfo').prop('disabled', true);
			$('#subCost').prop('disabled', true);
			$('#passwordSet').prop('disabled', true);
			$('#bpInfoModel').prop('disabled', false);
			this.getNO("BP");
		} else {
			this.getNO("LYC");
			this.getAuthority();
			$('input[type="email"]').prop('disabled', false);
			$('#authorityCodeId').prop('disabled', false);
			$('#bankInfo').prop('disabled', false);
			$('#subCost').prop('disabled', false);
			$('#passwordSet').prop('disabled', false);
			$('#bpInfoModel').prop('disabled', true);
		}
	}

	/* 
		ポップアップ口座情報の取得
	 */

	accountInfoGet = (accountTokuro) => {
		this.setState({
			accountInfo: accountTokuro,
			showBankInfoModal: false,
		})
		console.log(accountTokuro);
	}

	/* 
	ポップアップ諸費用の取得
 　　　*/
	subCostInfoGet = (subCostInfoTokuro) => {
		this.setState({
			subCostInfo: subCostInfoTokuro,
			showSubCostModal: false,
		})
		console.log(subCostInfoTokuro);
	}
	/* 
	ポップアップPW設定の取得
 　　　*/
	passwordSetInfoGet = (passwordSetTokuro) => {
		this.setState({
			passwordSetInfo: passwordSetTokuro,
			showPasswordSetModal: false,
		})
		console.log(passwordSetTokuro);
	}
	/* 
	ポップアップpb情報の取得
 　　　*/
	pbInfoGet = (pbInfoGetTokuro) => {
		alert(pbInfoGetTokuro)
		this.setState({
			bpInfoModel: pbInfoGetTokuro,
			showPbInfoModal: false,
		})
		console.log(pbInfoGetTokuro);
	}
	/**
	* 小さい画面の閉め 
	*/
	handleHideModal = (kbn) => {
		if (kbn === "bankInfo") {//　　口座情報
			this.setState({ showBankInfoModal: false })
		} else if (kbn === "subCost") {//　　諸費用
			this.setState({ showSubCostModal: false })
		} else if (kbn === "passwordSet") {//PW設定
			this.setState({ showPasswordSetModal: false })
		} else if (kbn === "bpInfoModel") {//pb情報
			this.setState({ showPbInfoModal: false })
		}
	}

	/**
 　　　* 小さい画面の開き
    */
	handleShowModal = (kbn) => {
		if (kbn === "bankInfo") {//　　口座情報
			this.setState({ showBankInfoModal: true })
		} else if (kbn === "subCost") {//　　諸費用
			this.setState({ showSubCostModal: true })
		} else if (kbn === "passwordSet") {//PW設定
			this.setState({ showPasswordSetModal: true })
		} else if (kbn === "bpInfoModel") {//pb情報
			this.setState({ showPbInfoModal: true })
		}
	}

	valueChangeEmployeeFormCode = (event) => {
		const value = event.target.value;
		if (value === "3") {
			this.setState({ retirementYearAndMonthDisabled: true, employeeFormCode: event.target.value })
		} else {
			this.setState({ retirementYearAndMonthDisabled: false, retirementYearAndMonth: "", employeeFormCode: event.target.value, temporary_retirementYearAndMonth: "" })
		}
	}

	handleTag = ({ target }, fieldName) => {
		const { value } = target;
		switch (fieldName) {
			case 'developLanguage1':
				this.setState({
					developLanguage1: this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ? this.state.developLanguageMaster.find((v) => (v.name === value)).code : this.state.developLanguage1,
				})
				break;
				case 'developLanguage2':
				this.setState({
					developLanguage2: this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ? this.state.developLanguageMaster.find((v) => (v.name === value)).code : this.state.developLanguage2,
				})
				break;
				case 'developLanguage3':
				this.setState({
					developLanguage3: this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ? this.state.developLanguageMaster.find((v) => (v.name === value)).code : this.state.developLanguage3,
				})
				break;
				case 'developLanguage4':
				this.setState({
					developLanguage4: this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ? this.state.developLanguageMaster.find((v) => (v.name === value)).code : this.state.developLanguage4,
				})
				break;
				case 'developLanguage5':
				this.setState({
					developLanguage5: this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ? this.state.developLanguageMaster.find((v) => (v.name === value)).code : this.state.developLanguage5,
				})
				break;
				case 'stationCode1':
				this.setState({
					stationCode1: this.state.station.find((v) => (v.name === value)) !== undefined ? this.state.station.find((v) => (v.name === value)).code : this.state.stationCode1,
				})
				break;
			default:
		}
	};
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName, temporary_age, japaneseCalendar, genderStatus, major, intoCompanyCode,
			employeeFormCode, occupationCode, departmentCode, companyMail, graduationUniversity, nationalityCode, birthplace, phoneNo, authorityCode, japaneseLevelCode, englishLevelCode, residenceCode,
			residenceCardNo, employmentInsuranceNo, myNumber, certification1, certification2, siteRoleCode, postcode, firstHalfAddress, lastHalfAddress, resumeRemark1, resumeRemark2, temporary_stayPeriod, temporary_yearsOfExperience, temporary_intoCompanyYearAndMonth, temporary_comeToJapanYearAndMonth,
			retirementYearAndMonthDisabled, temporary_graduationYearAndMonth, temporary_retirementYearAndMonth, detailDisabled, errorsMessageValue
		} = this.state;
		const { accountInfo, subCostInfo, passwordSetInfo, bpInfoModel, actionType } = this.state;
		return (
			<div>
				<FormControl value={actionType} name="actionType" hidden />
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.method === "put" ? "修正成功！." : "登録成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				{/*　 開始 */}
				{/*　 口座情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModal} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BankInfo accountInfo={accountInfo} actionType={sessionStorage.getItem('actionType')} accountTokuro={this.accountInfoGet} />
					</Modal.Body>
				</Modal>
				{/*　 諸費用 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "subCost")} show={this.state.showSubCostModal} dialogClassName="modal-subCost">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<SubCost subCostInfo={subCostInfo} actionType={sessionStorage.getItem('actionType')} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} subCostTokuro={this.subCostInfoGet} />
					</Modal.Body>
				</Modal>
				{/*　 PW設定 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "passwordSet")} show={this.state.showPasswordSetModal} dialogClassName="modal-passwordSet">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<PasswordSet passwordSetInfo={passwordSetInfo} actionType={sessionStorage.getItem('actionType')} employeeNo={this.state.employeeNo} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} passwordToroku={this.passwordSetInfoGet} /></Modal.Body>
				</Modal>

				{/*　 pb情報*/}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bpInfoModel")} show={this.state.showPbInfoModal} dialogClassName="modal-pbinfoSet">>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BpInfoModel bpInfoModel={bpInfoModel} customer={this.state.customer} actionType={sessionStorage.getItem('actionType')} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} pbInfoTokuro={this.pbInfoGet} /></Modal.Body>
				</Modal>
				{/* 終了 */}
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" id="bankInfo" onClick={this.handleShowModal.bind(this, "bankInfo")}>口座情報</Button>{' '}
					<Button size="sm" id="subCost" onClick={this.handleShowModal.bind(this, "subCost")}>諸費用</Button>{' '}
					<Button size="sm" id="passwordSet" onClick={this.handleShowModal.bind(this, "passwordSet")} disabled={detailDisabled ? false : true} >PW設定</Button>{' '}
					<Button size="sm" id="bpInfoModel" onClick={this.handleShowModal.bind(this, "bpInfoModel")}>BP情報</Button>{' '}
					<div>
						<Form.Label>社員</Form.Label><Form.Check defaultChecked={true} disabled={detailDisabled ? false : true} onChange={this.radioChangeEmployeeType.bind(this)} inline type="radio" name="employeeType" value="0" />
						<Form.Label>協力</Form.Label><Form.Check disabled={detailDisabled ? false : true} onChange={this.radioChangeEmployeeType.bind(this)} inline type="radio" name="employeeType" value="1" />
					</div>
				</div>
				<Form onReset={this.resetBook} enctype="multipart/form-data">
					<Form.Label style={{ "color": "#FFD700" }}>基本情報</Form.Label>
					<Form.Group>
						<ImageUploader
							withIcon={false}
							withPreview={true}
							label=""
							buttonText="Upload Images"
							onChange={this.onDrop}
							imgExtension={[".jpg", ".gif", ".png", ".gif", ".svg"]}
							maxFileSize={1048576}
							fileSizeError=" file size is too big"
							className="pi"
						/>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text></InputGroup.Prepend>
									<FormControl value={employeeNo} autoComplete="off" disabled onChange={this.valueChange} size="sm" name="employeeNo" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text></InputGroup.Prepend>
									<FormControl placeholder="社員氏" value={employeeFristName} autoComplete="off" onChange={this.valueChange} disabled={detailDisabled ? false : true} size="sm" name="employeeFristName" maxlength="3" />{' '}
									<FormControl placeholder="社員名" value={employeeLastName} autoComplete="off" onChange={this.valueChange} disabled={detailDisabled ? false : true} size="sm" name="employeeLastName" maxlength="3" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="カタカナ" value={furigana1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana1" disabled={detailDisabled ? false : true} />{' '}
									<FormControl placeholder="カタカナ" value={furigana2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana2" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="ローマ字" value={alphabetName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="alphabetName" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.birthday}
											onChange={this.inactiveBirthday}
											autoComplete="off"
											locale="ja"
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											maxDate={new Date()}
											id="datePicker"
											className="form-control form-control-sm"
											showYearDropdown
											dateFormat="yyyy/MM/dd"
											disabled={detailDisabled ? false : true}
										/>
									</InputGroup.Append>
									<FormControl placeholder="0" id="temporary_age" value={temporary_age} autoComplete="off" onChange={this.valueChange} size="sm" name="temporary_age" readOnly />
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">歳</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="和暦" value={japaneseCalendar} id="japaneseCalendar" autoComplete="off" onChange={this.valueChange} size="sm" name="japaneseCalendar" readOnly />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="genderStatus" value={genderStatus}
										autoComplete="off" disabled={detailDisabled ? false : true}>
										{this.state.genderStatuss.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="intoCompanyCode" value={intoCompanyCode}
										autoComplete="off" disabled={detailDisabled ? false : true}>
										{this.state.intoCompanyCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChangeEmployeeFormCode}
										name="employeeFormCode" value={employeeFormCode}
										autoComplete="off" disabled={detailDisabled ? false : true}>
										{this.state.employeeFormCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">職種</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="occupationCode" value={occupationCode}
										autoComplete="off" disabled={detailDisabled ? false : true}>
										{this.state.occupationCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部署</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="departmentCode" value={departmentCode}
										autoComplete="off" disabled={detailDisabled ? false : true}>
										{this.state.departmentCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社内メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email" placeholder="社内メール" value={companyMail} autoComplete="off"
										onChange={this.valueChange} size="sm" name="companyMail" disabled={detailDisabled ? false : true} /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業学校</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="学校" value={graduationUniversity} autoComplete="off"
										onChange={this.valueChange} size="sm" name="graduationUniversity" disabled={detailDisabled ? false : true} />
									<FormControl placeholder="専門" value={major} autoComplete="off"
										onChange={this.valueChange} size="sm" name="major" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.graduationYearAndMonth}
											onChange={this.inactiveGraduationYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
											disabled={detailDisabled ? false : true}
										/>
									</InputGroup.Append>
									<FormControl name="temporary_graduationYearAndMonth" value={temporary_graduationYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />

								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.intoCompanyYearAndMonth}
											onChange={this.inactiveintoCompanyYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
											disabled={detailDisabled ? false : true}
										/>
									</InputGroup.Append>
									<FormControl name="temporary_intoCompanyYearAndMonth" value={temporary_intoCompanyYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">退職年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.retirementYearAndMonth}
											onChange={this.inactiveRetirementYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											disabled={retirementYearAndMonthDisabled ? false : true}
											autoComplete="off"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_retirementYearAndMonth" value={temporary_retirementYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">来日年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.comeToJapanYearAndMonth}
											onChange={this.inactiveComeToJapanYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
											disabled={detailDisabled ? false : true}
										/>
									</InputGroup.Append>
									<FormControl name="temporary_comeToJapanYearAndMonth" value={temporary_comeToJapanYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出身地</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="nationalityCode" value={nationalityCode}
										autoComplete="off" id="nationalityCodeId" disabled={detailDisabled ? false : true}>
										{this.state.nationalityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<FormControl placeholder="出身地" value={birthplace} autoComplete="off"
										onChange={this.valueChange} size="sm" name="birthplace" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="携帯電話" value={phoneNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phoneNo" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>

							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">権限</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="authorityCode" value={authorityCode}
										autoComplete="off" id="authorityCodeId" disabled={detailDisabled ? false : true}>
										{this.state.authorityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Label style={{ "color": "#FFD700" }}>スキール情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										onChange={this.valueChange} size="sm"
										name="japaneseLevelCode" value={japaneseLevelCode}
										autoComplete="off" id="japaneaseLevelCodeId" disabled={detailDisabled ? false : true}>
										{this.state.japaneaseLevelCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">英語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" onChange={this.valueChange} size="sm" name="englishLevelCode" value={englishLevelCode} autoComplete="off" id="englishLeveCodeId" disabled={detailDisabled ? false : true}>
										{this.state.englishLeveCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">資格</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="資格1" value={certification1} autoComplete="off" onChange={this.valueChange} size="sm" name="certification1" disabled={detailDisabled ? false : true} />
									<FormControl placeholder="資格2" value={certification2} autoComplete="off" onChange={this.valueChange} size="sm" name="certification2" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>

							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" name="siteRoleCode" onChange={this.valueChange} value={siteRoleCode} autoComplete="off" disabled={detailDisabled ? false : true}>
										{this.state.siteMaster.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>



						</Row>
						<Row>
							<Col sm={9}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										id="developLanguageCode1"
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage1)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage1')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="開発言語1" type="text" {...params.inputProps}
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguageCode2"
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage2)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage2')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="開発言語2" type="text" {...params.inputProps}
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguageCode3"
										
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage3)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage3')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="開発言語3" type="text" {...params.inputProps}
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguageCode4"
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage4)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage4')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="開発言語4" type="text" {...params.inputProps}
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguageCode5"
										name="developLanguageCode5"
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage5)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage5')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="開発言語5" type="text" {...params.inputProps}
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.yearsOfExperience}
											onChange={this.inactiveyearsOfExperience}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
											disabled={detailDisabled ? false : true}
										/>
									</InputGroup.Append>
									<FormControl name="temporary_yearsOfExperience" value={temporary_yearsOfExperience} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Label style={{ "color": "#FFD700" }}>住所情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">郵便番号：〒</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={postcode} autoComplete="off" onBlur={publicUtils.postcodeApi} size="sm" name="postcode" id="postcode" maxlength="7" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">都道府県＋市区町村：</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={firstHalfAddress} autoComplete="off" onChange={this.valueChange} size="sm" name="firstHalfAddress" id="firstHalfAddress" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">以降住所：</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={lastHalfAddress} autoComplete="off" onChange={this.valueChange} size="sm" name="lastHalfAddress" id="lastHalfAddress" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">最寄駅</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										id="nearestStationCode"
										value={this.state.station.find((v) => (v.code === this.state.stationCode1)) || {}}
										options={this.state.station}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'stationCode1')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="最寄駅" type="text" {...params.inputProps}
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>

								</InputGroup>
							</Col>
						</Row>
					</Form.Group>

					<Form.Label style={{ "color": "#FFD700" }}>個人関連情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留資格 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="residenceCode" value={residenceCode}
										autoComplete="off" disabled={detailDisabled ? false : true}>
										{this.state.residenceCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="在留カード" value={residenceCardNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceCardNo" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留期間</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.stayPeriod}
											onChange={this.inactiveStayPeriod}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
											disabled={detailDisabled ? false : true}
										/>

									</InputGroup.Append>
									<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="雇用保険番号" value={employmentInsuranceNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employmentInsuranceNo" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="マイナンバー" value={myNumber} autoComplete="off"
										onChange={this.valueChange} size="sm" name="myNumber" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text><Form.File id="residentCardInfo" name="residentCardInfo" disabled={detailDisabled ? false : true} />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<Row>


							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm" >履歴書</InputGroup.Text><input type="file" id="resumeInfo1" name="resumeInfo1" disabled={detailDisabled ? false : true}></input>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>

							<Col sm={1}>
								<InputGroup size="sm" className="mb-3">
									<FormControl placeholder="備考1" value={resumeRemark1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeRemark1" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>

							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書2</InputGroup.Text><Form.File id="resumeInfo2" name="resumeInfo2" disabled={detailDisabled ? false : true} />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>

							<Col sm={1}>
								<InputGroup size="sm" className="mb-3">
									<FormControl placeholder="備考2" value={resumeRemark2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeRemark2" disabled={detailDisabled ? false : true} />
								</InputGroup>
							</Col>

							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">パスポート</InputGroup.Text><Form.File id="passportInfo" name="passportInfo" disabled={detailDisabled ? false : true} />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					{sessionStorage.getItem('actionType') === "detail" ? "" : <div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" onClick={sessionStorage.getItem('actionType') === "update" ? this.updateEmployee : this.insertEmployee} type="button" on>
							<FontAwesomeIcon icon={faSave} /> {sessionStorage.getItem('actionType') === "update" ? "更新" : "登録"}
						</Button>{' '}
						<Button size="sm" variant="info" type="reset">
							<FontAwesomeIcon icon={faUndo} /> リセット
                        </Button>
					</div>}
				</Form>
			</div>
		);
	}
}
export default employee;
