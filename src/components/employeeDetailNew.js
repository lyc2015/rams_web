/* 
社員を明細
 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal, Image } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import * as publicUtils from './utils/publicUtils.js';
import BankInfo from './accountInfo';
import BpInfoModel from './bpInfo';
import PasswordSet from './passwordSetManager';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faLevelUpAlt,faDownload } from '@fortawesome/free-solid-svg-icons';

axios.defaults.withCredentials = true;
class EmployeeDetailNew extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.handleShowModal = this.handleShowModal.bind(this);
	}
	// 初期化
	initialState = {
		showBankInfoModalFlag: false,// 口座情報画面フラグ
		showpasswordSetModalFlag: false,// PW設定
		showBpInfoModalFlag: false,// bp情報
		retirementYearAndMonthDisabled: false,// 退職年月の活性フラグ
		accountInfo: null,// 口座情報のデータ
		bpInfoModel: null,// pb情報
		myToastShow: false,
		errorsMessageShow: false,
		occupationCode: "0",
		englishLevelCode: "0",
		japaneseLevelCode: "0",
		developLanguage1: "0",
		developLanguage2: "0",
		developLanguage3: "0",
		developLanguage4: "0",
		developLanguage5: "0",
		certification1: "0",
		certification2: "0",
		frameWork1: "0",
		frameWork2: "0",
		stationCode: '',
		employeeStatusFlag: true,
		backPage:"",
		sendValue:{},
		introducer: null,
		searchFlag:false,
		genderStatuss: store.getState().dropDown[0],
		intoCompanyCodes: store.getState().dropDown[1],
		employeeFormCodes: store.getState().dropDown[2],
		siteMaster: store.getState().dropDown[34],
		projectType: store.getState().dropDown[52],
		employeeStatusS: store.getState().dropDown[4].slice(1),
		japaneaseLevelCodes: store.getState().dropDown[5].slice(1),
		residenceCodes: store.getState().dropDown[6],
		nationalityCodes: store.getState().dropDown[7],
		developLanguageMaster: store.getState().dropDown[8].slice(1),
		frameWorkMaster: store.getState().dropDown[71].slice(1),
		employeeInfo: store.getState().dropDown[9].slice(1),
		occupationCodes: store.getState().dropDown[10],
		departmentCodes: store.getState().dropDown[11],
		authorityCodes: store.getState().dropDown[12].slice(1),
		englishLeveCodes: store.getState().dropDown[13].slice(1),
		station: store.getState().dropDown[14].slice(1),
		customer: store.getState().dropDown[15].slice(1),
		qualification: store.getState().dropDown[54].slice(1),
		retirementResonClassificationCodes: store.getState().dropDown[66],
		employmentInsuranceStatus: store.getState().dropDown[67],
		socialInsuranceStatus: store.getState().dropDown[68],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],// 劉林涛テスト
	};


	/**
	 * 初期化メソッド
	 */
	componentDidMount() {
		const { location } = this.props
		let employeeInfo = [];
		for(let i in this.state.employeeInfo){
			if(this.state.employeeInfo[i].code.search("BP") === -1)
				employeeInfo.push({code:this.state.employeeInfo[i].code,name:this.state.employeeInfo[i].text,text:this.state.employeeInfo[i].text,value:this.state.employeeInfo[i].value,})
		}
		this.setState(
			{
				actionType: location.state.actionType,
				backPage: location.state.backPage,
				sendValue:location.state.sendValue,
				searchFlag:location.state.searchFlag,
				backbackPage :location.state.backbackPage,
				employeeInfo: employeeInfo,
			}
		);
		this.getEmployeeByEmployeeNo(location.state.id);
	}
	getEmployeeByEmployeeNo = employeeNo => {
		const emp = {
			employeeNo: employeeNo
		};
		axios.post(this.state.serverIP + "employee/getEmployeeByEmployeeNo", emp)
			.then(response => response.data)
			.then((data) => {
				this.inactiveBirthday(publicUtils.converToLocalTime(data.birthday, true));
				this.setState({
					employeeStatus: data.employeeStatus,// 社員区分
					employeeNo: data.employeeNo,// 社員番号
					bpEmployeeNo: data.employeeNo,// 社員番号
					employeeFristName: data.employeeFristName,// 社員氏
					employeeLastName: data.employeeLastName,// 社員名
					furigana1: data.furigana1,// カタカナ
					furigana2: data.furigana2,// カタカナ
					alphabetName1: data.alphabetName1,// ローマ字
					alphabetName2: data.alphabetName2,// ローマ字
					alphabetName3: data.alphabetName3,// ローマ字
					birthday: publicUtils.converToLocalTime(data.birthday, true),// 年齢
					//temporary_age: publicUtils.converToLocalTime(data.birthday, true) === "" ? "" : Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(data.birthday, true).getTime()) / 31536000000),
					japaneseCalendar: data.japaneseCalendar,// 和暦
					genderStatus: data.genderStatus,// 性別
					intoCompanyCode: data.intoCompanyCode,// 入社区分
					employeeFormCode: data.employeeFormCode,// 社員形式
					retirementYearAndMonthDisabled: data.employeeFormCode === "3" ? true : false,
					occupationCode: data.occupationCode,// 職種
					departmentCode: data.departmentCode,// 部署
					companyMail: data.companyMail !== null && data.companyMail !== "" && data.companyMail !== undefined ? data.companyMail.match(/(\S*)@/)[1] : "",// 社内メール
																																									// data.companyMail.match(/(\S*)@/)[1]
					graduationUniversity: data.graduationUniversity,// 卒業学校
					major: data.major,// 専門
					graduationYearAndMonth: publicUtils.converToLocalTime(data.graduationYearAndMonth, false),// 卒業年月
					temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.graduationYearAndMonth, false), new Date()),
					intoCompanyYearAndMonth: publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, true),// 入社年月
					temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, true), new Date()),
					retirementYearAndMonth: publicUtils.converToLocalTime(data.retirementYearAndMonth, true),// 退職年月
					temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.retirementYearAndMonth, false), new Date()),
					retirementResonClassificationCode:  data.retirementResonClassification,//退職区分
					comeToJapanYearAndMonth: publicUtils.converToLocalTime(data.comeToJapanYearAndMonth, false),// 来日年月
					temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.comeToJapanYearAndMonth, false), new Date()),
					nationalityCode: data.nationalityCode,// 出身地
					birthplace: data.birthplace,// 出身県
					phoneNo1: publicUtils.nullToEmpty(data.phoneNo).slice(0, 3),// 携帯電話
					phoneNo2: publicUtils.nullToEmpty(data.phoneNo).slice(3, 7),// 携帯電話
					phoneNo3: publicUtils.nullToEmpty(data.phoneNo).slice(7, 11),// 携帯電話
					authorityCode: data.authorityCode,// 権限
					japaneseLevelCode: data.japaneseLevelCode,// 日本語
					englishLevelCode: data.englishLevelCode,// 英語
					certification1: data.certification1,// 資格1
					certification2: data.certification2,// 資格2
					siteRoleCode: data.siteRoleCode,// 役割
					projectTypeCode: data.projectTypeCode,// 分野
					postcode: data.postcode,// 郵便番号
					firstHalfAddress: data.firstHalfAddress,
					lastHalfAddress: data.lastHalfAddress,
					stationCode: data.stationCode,
					developLanguage1: data.developLanguage1,// スキール1
					developLanguage2: data.developLanguage2,// スキール2
					developLanguage3: data.developLanguage3,// スキール3
					developLanguage4: data.developLanguage4,// スキール4
					developLanguage5: data.developLanguage5,// スキール5
					frameWork1: data.frameWork1,
					frameWork2: data.frameWork2,
					residenceCode: data.residenceCode,// 在留資格
					residenceCardNo: data.residenceCardNo,// 在留カード
					stayPeriod: publicUtils.converToLocalTime(data.stayPeriod, true),// 在留期間
					passportStayPeriod: publicUtils.converToLocalTime(data.passportStayPeriod, true),// パスポート期間
					immigrationStartTime: publicUtils.converToLocalTime(data.immigrationStartTime, false),// 出入国開始時間
					immigrationEndTime: publicUtils.converToLocalTime(data.immigrationEndTime, false),// 出入国終了時間
					contractDeadline: publicUtils.converToLocalTime(data.contractDeadline, true),// 契約期限
					temporary_stayPeriod: publicUtils.converToLocalTime(data.stayPeriod, false) === "" ? "" : publicUtils.getFullYearMonth(new Date(), publicUtils.converToLocalTime(data.stayPeriod, false)),
					temporary_contractDeadline: publicUtils.converToLocalTime(data.contractDeadline, true) === "" ? "" : publicUtils.getFullYearMonth(new Date(), publicUtils.converToLocalTime(data.contractDeadline, true)),
					employmentInsurance: data.employmentInsuranceStatus,// 雇用保険加入
					employmentInsuranceNo: data.employmentInsuranceNo,// 雇用保険番号
					socialInsurance: data.socialInsuranceStatus,// 社会保険加入
					socialInsuranceNo: data.socialInsuranceNo,// 社会保険番号
					socialInsuranceDate: publicUtils.converToLocalTime(data.socialInsuranceDate, true),// 社会保険期間
					myNumber: data.myNumber,// マイナンバー
					passportNo: data.passportNo,// パスポート番号
					residentCardInfoURL: publicUtils.nullToEmpty(data.residentCardInfo),// 在留カード
					resumeInfo1URL: publicUtils.nullToEmpty(data.resumeInfo1),// 履歴書
					resumeName1: data.resumeName1,// 履歴書備考1
					resumeInfo2URL: publicUtils.nullToEmpty(data.resumeInfo2),// 履歴書2
					resumeName2: data.resumeName2,// 履歴書備考1
					passportInfoURL: publicUtils.nullToEmpty(data.passportInfo),// パスポート
					yearsOfExperience: publicUtils.converToLocalTime(data.yearsOfExperience, false),// 経験年数
					temporary_yearsOfExperience: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.yearsOfExperience === "" ? data.graduationYearAndMonth : data.yearsOfExperience, false), new Date()),
					image: data.picInfo,
					introducer: data.introducer,
					employeeName: this.state.employeeInfo.find((v) => (v.code === data.introducer)) === undefined ? "" : this.state.employeeInfo.find((v) => (v.code === data.introducer)).name,
				});
			}
			);
	};


	// 年月開始
	// 卒業年月
	state = {
		birthday: new Date(),
		intoCompanyYearAndMonth: new Date(),
		retirementYearAndMonth: new Date(),
		comeToJapanYearAndMonth: new Date(),
		yearsOfExperience: new Date(),
		stayPeriod: new Date(),
		contractDeadline: new Date(),
		graduationYearAndMonth: new Date(),
	};
	
	/**
	 * 年齢と和暦
	 */
	inactiveBirthday = date => {
		if (date !== undefined && date !== null && date !== "") {
			const promise = Promise.resolve(publicUtils.calApi(date));
			promise.then((data) => {
				this.setState(
					{
						birthday: date,
						japaneseCalendar: data[0][0].text,
						temporary_age: data[1],
					}
				);
			});
		} else {
			this.setState({
				temporary_age: "",
				birthday: "",
				japaneseCalendar: ""
			});
		}
	};
	
	// 卒業年月
	inactiveGraduationYearAndMonth = date => {
		this.setState(
			{
				graduationYearAndMonth: date,
				temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),
				temporary_yearsOfExperience: (this.state.yearsOfExperience === undefined) ? publicUtils.getFullYearMonth(date, new Date()) : this.state.temporary_yearsOfExperience
			}
		);
	};
	// 入社年月
	inactiveintoCompanyYearAndMonth = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonth: date,
				temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	// 退職年月
	inactiveRetirementYearAndMonth = (date) => {
		this.setState(
			{
				retirementYearAndMonth: date,
				temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),

			}
		);
	};
	// 来日年月
	inactiveComeToJapanYearAndMonth = date => {
		this.setState(
			{
				comeToJapanYearAndMonth: date,
				temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(date, new Date())

			}
		);
	};
	// 経験年数
	inactiveyearsOfExperience = date => {
		this.setState(
			{
				yearsOfExperience: date,
				temporary_yearsOfExperience: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	// 在留期間
	inactiveStayPeriod = date => {
		this.setState(
			{
				stayPeriod: date,
				temporary_stayPeriod: publicUtils.getFullYearMonth(new Date(), date)
			}
		);
	};
	
	// 契約期間
	inactiveContractDeadline = date => {
		this.setState(
			{
				contractDeadline: date,
				temporary_contractDeadline: publicUtils.getFullYearMonth(new Date(), date)
			}
		);
	};
	// 年月終了


	/*
	 * ポップアップ口座情報の取得
	 */
	accountInfoGet = (accountTokuro) => {
		this.setState({
			accountInfo: accountTokuro,
			showBankInfoModalFlag: false,
		})
	}

	/*
	 * ポップアップPW設定の取得
	 */
	passwordSetInfoGet = (passwordSetTokuro) => {
		this.setState({
			passwordSetInfo: passwordSetTokuro,
			showpasswordSetModalFlag: false,
		})
	}
	/*
	 * ポップアップpb情報の取得
	 */
	pbInfoGet = (pbInfoGetTokuro) => {
		this.setState({
			bpInfoModel: pbInfoGetTokuro,
			showBpInfoModalFlag: false,
		})
	}
	/**
	 * 小さい画面の閉め
	 */
	handleHideModal = (kbn) => {
		if (kbn === "bankInfo") {// 口座情報
			this.setState({ showBankInfoModalFlag: false })
		} else if (kbn === "passwordSet") {// PW設定
			this.setState({ showpasswordSetModalFlag: false })
		} else if (kbn === "bpInfoModel") {// pb情報
			this.setState({ showBpInfoModalFlag: false })
		}
	}

	/**
	 * 小さい画面の開き
	 */
	handleShowModal = (kbn) => {
		if (kbn === "bankInfo") {// 口座情報
			this.setState({ showBankInfoModalFlag: true })
		} else if (kbn === "passwordSet") {// PW設定
			this.setState({ showpasswordSetModalFlag: true })
		} else if (kbn === "bpInfoModel") {// pb情報
			this.setState({ showBpInfoModalFlag: true })
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

	

	changeFile = (event, name) => {
		var filePath = event.target.value;
		var arr = filePath.split('\\');
		var fileName = arr[arr.length - 1];
		if (name === "residentCardInfo") {
			this.setState({
				residentCardInfo: filePath,
				residentCardInfoName: fileName,
			})
		} else if (name === "resumeInfo1") {
			this.setState({
				resumeInfo1: filePath,
				resumeInfo1Name: fileName,
			})
		} else if (name === "resumeInfo2") {
			this.setState({
				resumeInfo2: filePath,
				resumeInfo2Name: fileName,
			})
		} else if
			(name === "passportInfo") {
			this.setState({
				passportInfo: filePath,
				passportInfoName: fileName,
			})
		}
	}
	back = () => {
        var path = {};
        path = {
            pathname: this.state.backPage,
            state: { searchFlag: this.state.searchFlag, sendValue: this.state.sendValue ,employeeNo:this.state.employeeNo , backPage:this.state.backbackPage},
        }
        this.props.history.push(path);
    }
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName1,alphabetName2,alphabetName3, temporary_age, japaneseCalendar, genderStatus, major, intoCompanyCode,
			employeeFormCode, occupationCode, departmentCode, companyMail, graduationUniversity, nationalityCode, birthplace, phoneNo1, phoneNo2, phoneNo3, authorityCode, japaneseLevelCode, englishLevelCode, residenceCode,
			residenceCardNo, employmentInsuranceNo,employmentInsurance,socialInsurance,socialInsuranceNo, myNumber, passportNo, certification1, certification2, siteRoleCode, projectTypeCode, postcode, firstHalfAddress, lastHalfAddress, resumeName1, resumeName2, temporary_stayPeriod,temporary_contractDeadline, temporary_yearsOfExperience, temporary_intoCompanyYearAndMonth, temporary_comeToJapanYearAndMonth,
			temporary_graduationYearAndMonth, temporary_retirementYearAndMonth, errorsMessageValue, employeeStatus,retirementResonClassificationCode,
		} = this.state;
		const { accountInfo, passwordSetInfo, bpInfoModel, actionType } = this.state;
		return (
			<div>
				<FormControl value={actionType} name="actionType" hidden />
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center">
						<h2>社員情報明細</h2>
					</Col>
				</Row>
				<br />
				{/* 開始 */}
				{/* 口座情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModalFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton><Col className="text-center">
						<h2>口座情報</h2>
					</Col>
					</Modal.Header>
					<Modal.Body >
						<BankInfo accountInfo={accountInfo} actionType={this.state.actionType} employeeNo={this.state.employeeNo} accountTokuro={this.accountInfoGet} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} />
					</Modal.Body>
				</Modal>
				{/* PW設定 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "passwordSet")} show={this.state.showpasswordSetModalFlag} dialogClassName="modal-passwordSet">
					<Modal.Header closeButton><Col className="text-center">
						<h2>パースワード設定</h2>
					</Col>
					</Modal.Header>
					<Modal.Body >
						<PasswordSet passwordSetInfo={passwordSetInfo} actionType={this.state.actionType} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} passwordToroku={this.passwordSetInfoGet} /></Modal.Body>
				</Modal>
				{/* pb情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bpInfoModel")} show={this.state.showBpInfoModalFlag} dialogClassName="modal-pbinfoSet">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BpInfoModel bpInfoModel={bpInfoModel} customer={this.state.customer} actionType={this.state.actionType} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} pbInfoTokuro={this.pbInfoGet} /></Modal.Body>
				</Modal>
				{/* 終了 */}
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" id="bankInfo" onClick={this.handleShowModal.bind(this, "bankInfo")} disabled={employeeStatus === "0" ? false : true} >口座情報</Button>{' '}
					<Button size="sm" id="passwordSet" onClick={this.handleShowModal.bind(this, "passwordSet")} disabled>PW設定</Button>{' '}
					<Button size="sm" id="bpInfoModel" hidden onClick={this.handleShowModal.bind(this, "bpInfoModel")} disabled={employeeStatus === "0" ? true : false}>BP情報</Button>{' '}
				</div>
				<Form onReset={this.resetBook} enctype="multipart/form-data">
					<Form.Group>
						<Row>
							<Col sm={12}>
								<Form.Label style={{ "color": "#000000" }}>基本情報</Form.Label>
							</Col>
						</Row>						
						<Row>
						<Col sm={4}>
							<Col>
								<InputGroup size="sm" className="mb-3" >
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" size="sm"
									name="employeeStatus" value={employeeStatus}
									disabled>
									{this.state.employeeStatusS.map(date =>
										<option key={date.code} value={date.code}>
											{date.name}
										</option>
									)}
								</Form.Control>
								<font className="site-mark"></font>
								</InputGroup>
								
								<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名 </InputGroup.Text></InputGroup.Prepend>
								<FormControl value={employeeFristName} size="sm" name="employeeFristName" maxlength="3" disabled />{' '}
								<FormControl value={employeeLastName} size="sm" name="employeeLastName" maxlength="3" disabled /><font color="red" className="site-mark">★</font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={furigana1}
									size="sm" name="furigana1" disabled />{' '}
								<FormControl value={furigana2}
									size="sm" name="furigana2" disabled />
								<font className="site-mark"></font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={alphabetName1}
									size="sm" name="alphabetName1" disabled />{' '}<font color="red" className="site-mark"> </font>
								<FormControl value={alphabetName2}
									size="sm" name="alphabetName2" disabled />
								<FormControl value={alphabetName3}
								size="sm" name="alphabetName3" disabled /><font color="red" className="site-mark">★</font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" size="sm"
									name="genderStatus" value={genderStatus}
									disabled>
									{this.state.genderStatuss.map(date =>
										<option key={date.code} value={date.code}>
											{date.name}
										</option>
									)}
								</Form.Control>
								<font color="red" className="site-mark">★</font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">年齢 </InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.birthday}
										onChange={this.inactiveBirthday}
										yearDropdownItemNumber={25}
										scrollableYearDropdown
										maxDate={new Date()}
										id="datePickerReadonlyDefault"
										className="form-control form-control-sm"
										showYearDropdown
										dateFormat="yyyy/MM/dd"
										disabled
									/>
								</InputGroup.Append>
								<FormControl id="temporary_age" value={temporary_age} size="sm" name="temporary_age" disabled />
								<FormControl value="歳" size="sm" disabled />
								<font className="site-mark"></font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">国籍</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" size="sm"
									name="nationalityCode" value={nationalityCode}
									disabled>
									{this.state.nationalityCodes.map(date =>
										<option key={date.code} value={date.code}>
											{date.name}
										</option>
									)}
								</Form.Control><font color="red" style={{ marginLeft: "0px", marginRight: "0px" }}>★</font>
								<FormControl value={birthplace} autoComplete="off"
									onChange={this.valueChange} size="sm" name="birthplace" disabled />
								<font className="site-mark"></font>
								</InputGroup>
							</Col>
						</Col>
						<Col sm={4}>
							<Col>
								<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend><InputGroup.Text id="fiveKanji">{employeeStatus === "2" ? "事業主番号" : (employeeStatus === "0" || employeeStatus === "3"  ? "社員番号" : (employeeStatus === "1" ? "BP番号" : ""))}</InputGroup.Text></InputGroup.Prepend>
								<FormControl value={employeeNo} disabled size="sm" name="employeeNo" />
								<font className="site-mark"></font>
								</InputGroup>
								
								<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
								<InputGroup.Text id="fiveKanji">社員形式</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChangeEmployeeFormCode}
										name="employeeFormCode" value={employeeFormCode} id="Autocompletestyle-employeeInsert-employeeFormCode"
										disabled>
										{this.state.employeeFormCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<font className="site-mark"></font>
									
									<Row></Row>

							<InputGroup.Prepend>
								<InputGroup.Text id="fiveKanji">部署 </InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control as="select" size="sm"
								name="departmentCode" value={departmentCode}
								disabled>
								{this.state.departmentCodes.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
							</Form.Control>
							<font className="site-mark"></font>
							
							<Row></Row>
							
							<InputGroup.Prepend>
								<InputGroup.Text id="fiveKanji">職種</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control as="select" size="sm"
								name="occupationCode" value={occupationCode}
								disabled>
								{this.state.occupationCodes.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
								</Form.Control>
								<font className="site-mark"></font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="fiveKanji">採用区分</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" size="sm"
									name="intoCompanyCode" value={intoCompanyCode}
									disabled>
									{this.state.intoCompanyCodes.map(date =>
										<option key={date.code} value={date.code}>
											{date.name}
										</option>
									)}
								</Form.Control>
								<InputGroup.Prepend>
									<InputGroup.Text id="sanKanji">紹介者</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									id="employeeName"
									name="employeeName"
									disabled
									value={this.state.employeeInfo.find(v => v.text === this.state.employeeName) || {}}
									options={this.state.employeeInfo}
									getOptionLabel={(option) => option.text ? option.text : ""}
									renderOption={(option) => {
										return (
											<React.Fragment>
												{option.name}
											</React.Fragment>
										)
									}}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps} className="auto"
												className="auto form-control Autocompletestyle-employeeInsertNew-employeeNo"
											/>
										</div>
									)}
								/>
								<font className="site-mark"></font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="fiveKanji">社内メール</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="email" value={companyMail} disabled
									size="sm" name="companyMail" /><FormControl value="@lyc.co.jp" size="sm" disabled />
								<font color="red" className="site-mark">★</font>
								
								<Row></Row>
								
							<InputGroup.Prepend>
								<InputGroup.Text id="fiveKanji">携帯電話</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl value={phoneNo1}
								size="sm" name="phoneNo" disabled />—
									<FormControl value={phoneNo2}
								size="sm" name="phoneNo" disabled />—
									<FormControl value={phoneNo3}
								size="sm" name="phoneNo" disabled />
								<font className="site-mark"></font>
								</InputGroup>
							</Col>
						</Col>
							{/*<Col sm={3}>
								<InputGroup size="sm" className="mb-3" style={{ visibility: "hidden" }}>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl 
										size="sm" name="alphabetName" disabled />
								</InputGroup>
								
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={japaneseCalendar} id="japaneseCalendar" size="sm" name="japaneseCalendar" disabled />
								</InputGroup>
								
							</Col>*/}
							<Col sm={4}>
								<Col>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<Image src={this.state.image} id="imageId" rounded width="220" height="240" />
									</InputGroup.Prepend>
									<Form.File id="image" hidden data-browse="添付" custom onChange={(event) => this.changeFile(event, 'image')} accept="image/png, image/jpeg"></Form.File>
									<Form.File id="resumeInfo1" hidden data-browse="添付" value={this.state.resumeInfo1} custom onChange={(event) => this.changeFile(event, 'resumeInfo1')} />
									<Form.File id="resumeInfo2" hidden data-browse="添付" value={this.state.resumeInfo2} custom onChange={(event) => this.changeFile(event, 'resumeInfo2')} />
								</InputGroup>
								</Col>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<Form.Label style={{ "color": "#000000" }}>基本情報補足</Form.Label>
							<Col>
								<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">権限</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" size="sm"
									name="authorityCode" value={authorityCode}
									disabled >
									{this.state.authorityCodes.map(date =>
										<option key={date.code} value={date.code}>
											{date.name}
										</option>
									)}
								</Form.Control>
								<font className="site-mark"></font>

								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">卒業学校</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={graduationUniversity}
									size="sm" name="graduationUniversity" disabled />
								<FormControl value={major}
									size="sm" name="major" disabled />
								<font className="site-mark"></font>

								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.graduationYearAndMonth}
										onChange={this.inactiveGraduationYearAndMonth}
										dateFormat="yyyy/MM"
										showMonthYearPicker
										showFullMonthYearPicker
										id="datePickerReadonlyDefault-empInsert-left"
										className="form-control form-control-sm"
										disabled
									/>
								</InputGroup.Append>
								<FormControl name="temporary_graduationYearAndMonth" value={temporary_graduationYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								<font className="site-mark"></font>

								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">来日年月</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.comeToJapanYearAndMonth}
										onChange={this.inactiveComeToJapanYearAndMonth}
										dateFormat="yyyy/MM"
										showMonthYearPicker
										showFullMonthYearPicker
										id="datePickerReadonlyDefault-empInsert-left"
										className="form-control form-control-sm"
										disabled
									/>
								</InputGroup.Append>
								<FormControl name="temporary_comeToJapanYearAndMonth" value={temporary_comeToJapanYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								<font className="site-mark"></font>

								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.intoCompanyYearAndMonth}
										onChange={this.inactiveintoCompanyYearAndMonth}
										dateFormat="yyyy/MM/dd"
										id="datePickerReadonlyDefault-empInsert-left"
										className="form-control form-control-sm"
										disabled
									/>
								</InputGroup.Append>
								<FormControl name="temporary_intoCompanyYearAndMonth" value={temporary_intoCompanyYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								<font color="red" className="site-mark">★</font>
								
								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.yearsOfExperience}
										onChange={this.inactiveyearsOfExperience}
										dateFormat="yyyy/MM"
										showMonthYearPicker
										showFullMonthYearPicker
										className="form-control form-control-sm"
										id="datePickerReadonlyDefault-empInsert-left"
										disabled
									/>
								</InputGroup.Append>
								<FormControl name="temporary_yearsOfExperience" value={temporary_yearsOfExperience} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								<font className="site-mark"></font>

								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" name="siteRoleCode" value={siteRoleCode} disabled>
									{this.state.siteMaster.map(date =>
										<option key={date.code} value={date.code}>
											{date.name}
										</option>
									)}
								</Form.Control>
								<Form.Control as="select" name="projectTypeCode" value={projectTypeCode} disabled>
								{this.state.projectType.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
								</Form.Control>
								<font className="site-mark"></font>

								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">契約期限</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.contractDeadline}
										onChange={this.inactiveContractDeadline}
										locale="ja"
										dateFormat="yyyy/MM/dd"
										className="form-control form-control-sm"
										autoComplete="off"
										minDate={new Date()}
										id="datePickerReadonlyDefault-empInsert-left"
										disabled
									/>
								</InputGroup.Append>
								<FormControl name="temporary_contractDeadline" value={temporary_contractDeadline} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								<font className="site-mark"></font>

								<Row></Row>
								
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm" >履歴書1</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl value={resumeName1} autoComplete="off"
								onChange={this.valueChange} size="sm" name="resumeName1" disabled />
							<Button size="sm" disabled style={this.state.resumeInfo1URL !== "" ? {backgroundColor: "#53A100",border: "none"} : {backgroundColor: "",border: "none"}}><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo1URL !== "" ? " 済み" : " 添付"}</Button>
							<font className="site-mark"></font>

							<Row></Row>
							
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">履歴書2</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl value={resumeName2} autoComplete="off"
								onChange={this.valueChange} size="sm" name="resumeName2" disabled />
							<Button size="sm" disabled style={this.state.resumeInfo2URL !== "" ? {backgroundColor: "#53A100",border: "none"} : {backgroundColor: "",border: "none"}}><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo2URL !== "" ? " 済み" : " 添付"}</Button>
							<font className="site-mark"></font>

							</InputGroup>
							</Col>
							</Col>
							<Col sm={4}>
							<Form.Label style={{ "color": "#000000" }}>スキール情報</Form.Label>
								<Col>
									<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										size="sm"
										name="japaneseLevelCode" value={japaneseLevelCode}
										disabled >
										{this.state.japaneaseLevelCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">英語 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm" name="englishLevelCode" value={englishLevelCode} disabled >
										{this.state.englishLeveCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
									<font className="site-mark"></font>
									<Row></Row>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">資格</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"　disabled name="certification1" onChange={this.valueChange} value={certification1} autoComplete="off" >
										{this.state.qualification.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<Form.Control as="select"　disabled name="certification2" onChange={this.valueChange} value={certification2} autoComplete="off" >
										{this.state.qualification.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<font className="site-mark"></font>

									<Row></Row>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage1)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage1" />
											</div>
										)}
									/>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage2)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage2" />
											</div>
										)}
									/>
									
									<Row></Row>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm"></InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage3)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage3" />
											</div>
										)}
									/>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage4)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage4" />
											</div>
										)}
									/>
									<Autocomplete disabled hidden
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage5)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage5" />
											</div>
										)}
									/>

									<Row></Row>
									
									<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">フレーム</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete disabled
									value={this.state.frameWorkMaster.find((v) => (v.code === this.state.frameWork1)) || {}}
									options={this.state.frameWorkMaster}
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="frameWork1" />
										</div>
									)}
								/>
								
								<Autocomplete disabled
									value={this.state.frameWorkMaster.find((v) => (v.code === this.state.frameWork2)) || {}}
									options={this.state.frameWorkMaster}
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="frameWork2" />
										</div>
									)}
								/>
							</InputGroup>
								</Col>
								<font style={{ "color": "#000000"}}>住所情報</font>
								<Col>
									<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">郵便番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={postcode} size="sm" name="postcode" id="postcode" maxlength="7" disabled />
									<font className="site-mark"></font>

									<Row></Row>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">都道府県</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={firstHalfAddress} size="sm" name="firstHalfAddress" id="firstHalfAddress" ref="firstHalfAddress" disabled />
									<font className="site-mark"></font>

									<Row></Row>
									
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">以降住所</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={lastHalfAddress} size="sm" name="lastHalfAddress" id="lastHalfAddress" disabled />
								<font className="site-mark"></font>

								<Row></Row>
								
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">最寄駅</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									disabled
									value={this.state.station.find((v) => (v.code === this.state.stationCode)) || {}}
									options={this.state.station}
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-emp-station" id="stationCode"
												style={{ fontSize: ".875rem"}}
												/*style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": "#e9ecef" }}*/ />
										</div>
									)}
								/>
								</InputGroup>
								</Col>
							</Col>
							<Col sm={4}>
							<Form.Label style={{ "color": "#000000" }}>個人関連情報</Form.Label>
								<Col>
									<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="sevenKanji">在留資格 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="residenceCode" value={residenceCode}
										disabled>
										{this.state.residenceCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
									<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
									
									<Row></Row>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="sevenKanji">在留カード番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={residenceCardNo}
										size="sm" name="residenceCardNo" disabled />
									<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
									
									<Row></Row>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="empinsert-right-kanji" >在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
									<DatePicker
										selected={this.state.stayPeriod}
										onChange={this.inactiveStayPeriod}
										locale="ja"
										dateFormat="yyyy/MM/dd"
										className="form-control form-control-sm"
										autoComplete="off"
										minDate={new Date()}
										disabled
										id={"datePickerReadonlyDefault-empInsert-right"}
									/>
									</InputGroup.Append>
									<Autocomplete
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
										<Button size="sm" style={this.state.residentCardInfoURL !== "" ? {backgroundColor: "#53A100",border: "none",marginLeft: "3px"} : {backgroundColor: "",border: "none",marginLeft: "3px"}} className="uploadButtom" disabled ><FontAwesomeIcon icon={faFile} /> {this.state.residentCardInfoURL !== "" ? " 済み" : " 添付"}</Button>
										<Button size="sm" style={{ marginLeft: "3px",border: "none"}} disabled={this.state.residentCardInfoURL === "" ? true:false} className="downloadButtom" onClick={publicUtils.handleDownload.bind(this, this.state.residentCardInfoURL, this.state.serverIP)} ><FontAwesomeIcon icon={faDownload} /> download</Button>
										</div>
									)}
								/>
									<Form.File id="residentCardInfo" hidden data-browse="添付" value={this.state.residentCardInfo} custom onChange={(event) => this.changeFile(event, 'residentCardInfo')} />

									<Row></Row>
									
									<InputGroup.Prepend>
										<InputGroup.Text id="empinsert-right-kanji" >パスポート</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
									<DatePicker
										selected={this.state.passportStayPeriod}
										onChange={this.passportStayPeriodChange}
										locale="ja"
										dateFormat="yyyy/MM/dd"
										className="form-control form-control-sm"
										autoComplete="off"
										minDate={new Date()}
										disabled
										id={"datePickerReadonlyDefault-empInsert-right"}
									/>
									</InputGroup.Append>
									<Autocomplete
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
										<Button size="sm" style={this.state.passportInfoURL !== "" ? {backgroundColor: "#53A100",border: "none",marginLeft: "3px"} : {backgroundColor: "",border: "none",marginLeft: "3px"}} className="uploadButtom" disabled  ><FontAwesomeIcon icon={faFile} /> {this.state.passportInfoURL !== "" ? " 済み" : " 添付"}</Button>
										<Button size="sm" style={{ marginLeft: "3px",border: "none"}} disabled={this.state.passportInfoURL === "" ? true:false} className="downloadButtom" onClick={publicUtils.handleDownload.bind(this, this.state.passportInfoURL, this.state.serverIP)} ><FontAwesomeIcon icon={faDownload} /> download</Button>
										</div>
									)}
								/>

									<Row></Row>
									
								<InputGroup.Prepend>
									<InputGroup.Text id="sevenKanji">パスポート番号</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={passportNo}
									size="sm" name="passportNo" disabled />
								<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
								
									<Row></Row>
									
								<InputGroup.Prepend>
									<InputGroup.Text id="sevenKanji">マイナンバー</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl value={myNumber}
									size="sm" name="myNumber" disabled />
								<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
								
								<Row></Row>
								
									<InputGroup.Prepend>
										<InputGroup.Text id="sevenKanji">雇用保険加入</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm" disabled
										name="employmentInsurance" value={employmentInsurance}
										autoComplete="off">
										{this.state.employmentInsuranceStatus.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={employmentInsuranceNo}
										size="sm" name="employmentInsuranceNo" disabled />
									<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
									
									<Row></Row>
									
										<InputGroup.Prepend>
											<InputGroup.Text id="sevenKanji">社会保険加入</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" disabled hidden
											name="employmentInsurance" value={socialInsurance}
											autoComplete="off">
											{this.state.socialInsuranceStatus.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
										<InputGroup.Append>
										<DatePicker
											selected={this.state.socialInsuranceDate}
											locale="ja"
											dateFormat="yyyy/MM/dd"
											className="form-control form-control-sm"
											autoComplete="off"
											disabled
											id="datePickerReadonlyDefault-empInsert-right-socialInsuranceDate"
										/>
										</InputGroup.Append>
										<InputGroup.Prepend>
											<InputGroup.Text id="twoKanji">番号</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl value={socialInsuranceNo}
											size="sm" name="socialInsuranceNo" disabled />
										<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
										
										<Row></Row>
											
										<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出入国届</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<InputGroup.Text id="startKanji">開始</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
									<DatePicker
										selected={this.state.immigrationStartTime}
										locale="ja"
										dateFormat="yyyy/MM"
										showMonthYearPicker
										showFullMonthYearPicker
										className="form-control form-control-sm"
										autoComplete="off"
										minDate={new Date()}
										disabled
										id={"datePickerReadonlyDefault-empInsert-right-immigrationTime"}
									/>
								</InputGroup.Append>
								<InputGroup.Prepend>
									<InputGroup.Text id="twoKanji">終了</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
								<DatePicker
									selected={this.state.immigrationEndTime}
									locale="ja"
									dateFormat="yyyy/MM"
									showMonthYearPicker
									showFullMonthYearPicker
									className="form-control form-control-sm"
									autoComplete="off"
									minDate={new Date()}
									disabled
									id={"datePickerReadonlyDefault-empInsert-right-immigrationTime"}
								/>
							</InputGroup.Append>
										
							<Row></Row>
									
								<InputGroup.Prepend>
									<InputGroup.Text id="sevenKanji">退職年月日</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.retirementYearAndMonth}
										onChange={this.inactiveRetirementYearAndMonth}
										dateFormat="yyyy/MM/dd"
										className="form-control form-control-sm"
										id="datePickerReadonlyDefault-empInsert-right-immigrationTime"
										disabled
									/>
								</InputGroup.Append>
								<FormControl name="temporary_retirementYearAndMonth" value={temporary_retirementYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled hidden />
											
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="retirementResonClassificationCode" value={retirementResonClassificationCode}
										autoComplete="off" disabled>
										{this.state.retirementResonClassificationCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
								</InputGroup>
								</Col>
							</Col>
						</Row>

						{/*<Row>
							<Col sm={3}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">在留期限</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Append>
									<DatePicker
										selected={this.state.stayPeriod}
										onChange={this.inactiveStayPeriod}
										dateFormat="yyyy/MM"
										showMonthYearPicker
										showFullMonthYearPicker
										id="datePickerReadonlyDefault"
										className="form-control form-control-sm"
										disabled
									/>
								</InputGroup.Append>
								<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
							</InputGroup>
						</Col>
						</Row>*/}
						<div style={{ "textAlign": "center" }}>
							<Button size="sm" variant="info" type="button" onClick={this.back} hidden={this.state.backPage === "" ? true : false}>
								<FontAwesomeIcon icon={faLevelUpAlt} /> 戻る
                        </Button>
						</div>
					</Form.Group>
				</Form>
			</div>
		);
	}
}

export default EmployeeDetailNew;

