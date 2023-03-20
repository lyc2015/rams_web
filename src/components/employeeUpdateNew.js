/* 
社員を修正
 */
import React from "react";
import {
  Form,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl,
  Modal,
  Image,
} from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import "react-datepicker/dist/react-datepicker.css";
import * as publicUtils from "./utils/publicUtils.js";
import BankInfo from "./accountInfo";
import BpInfoModel from "./bpInfo";
import PasswordSet from "./passwordSetManager";
import "../asserts/css/style.css";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUndo,
  faFile,
  faLevelUpAlt,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import MyToast from "./myToast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ErrorsMessageToast from "./errorsMessageToast";
import store from "./redux/store";

axios.defaults.withCredentials = true;
class employeeUpdateNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.valueChange = this.valueChange.bind(this);
    this.departmentCodeChange = this.departmentCodeChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
  }
  // 初期化
  initialState = {
    showBankInfoModalFlag: false, // 口座情報画面フラグ
    showpasswordSetModalFlag: false, // PW設定
    showBpInfoModalFlag: false, // bp情報
    retirementYearAndMonthDisabled: false, // 退職年月の活性フラグ
    residenceTimeDisabled: false, // 在留期間の活性フラグ
    isBp: false,
    bpNo: "",
    bpDisabled: false,
    accountInfo: null, // 口座情報のデータ
    bpInfoModel: null, // pb情報
    myToastShow: false,
    errorsMessageShow: false,
    occupationChangeFlag: false,
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
    stationCode: "",
    sendValue: {},
    loading: true,
    residentCardInfoName: "",
    passportInfoName: "",
    introducer: null,
    genderStatuss: store.getState().dropDown[0],
    intoCompanyCodes: store.getState().dropDown[1],
    employeeFormCodes: store.getState().dropDown[2],
    employeeFormCodesAll: store.getState().dropDown[2],
    siteMaster: store.getState().dropDown[34],
    employeeStatusS: store.getState().dropDown[4].slice(1),
    japaneaseLevelCodes: store.getState().dropDown[5].slice(1),
    residenceCodes: store.getState().dropDown[6],
    nationalityCodes: store.getState().dropDown[7],
    developLanguageMaster: store.getState().dropDown[8].slice(1),
    frameWorkMaster: store.getState().dropDown[71].slice(1),
    employeeInfo: store.getState().dropDown[9].slice(1),
    occupationCodes: store.getState().dropDown[10].slice(1),
    departmentCodes: store.getState().dropDown[11],
    authorityCodes: store.getState().dropDown[12].slice(1),
    englishLeveCodes: store.getState().dropDown[13].slice(1),
    station: store.getState().dropDown[14].slice(1),
    customer: store.getState().dropDown[15].slice(1),
    qualification: store.getState().dropDown[54].slice(1),
    retirementResonClassificationCodes: store.getState().dropDown[66],
    employmentInsuranceStatus: store.getState().dropDown[67],
    socialInsuranceStatus: store.getState().dropDown[68],
    projectType: store.getState().dropDown[52],
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1], // 劉林涛テスト
  };
  // リセット
  resetBook = () => {
    window.location.href = window.location.href;
  };

  // 更新ボタン
  updateEmployee = () => {
    this.setState({ loading: false });
    const formData = new FormData();
    let obj = document.getElementById("imageId");
    let imgSrc = obj.getAttribute("src");
    const emp = {
      employeeStatus: this.state.employeeStatus, // 社員区分
      newEmployeeNo: this.state.employeeNo, // 社員番号
      employeeNo: this.state.oldEmployeeNo, // 社員番号
      bpEmployeeNo: this.state.employeeNo, // 社員番号
      employeeFristName: publicUtils.trim(this.state.employeeFristName), // 社員氏
      employeeLastName: publicUtils.trim(this.state.employeeLastName), // 社員名
      furigana1: publicUtils.nullToEmpty(this.state.furigana1), // カタカナ
      furigana2: publicUtils.nullToEmpty(this.state.furigana2), // カタカナ
      alphabetName1: publicUtils.nullToEmpty(this.state.alphabetName1), // ローマ字
      alphabetName2: publicUtils.nullToEmpty(this.state.alphabetName2), // ローマ字
      alphabetName3: publicUtils.nullToEmpty(this.state.alphabetName3), // ローマ字
      birthday: publicUtils.formateDate(this.state.birthday, true), // 年齢
      japaneseCalendar: publicUtils.nullToEmpty(this.state.japaneseCalendar), // 和暦
      genderStatus: publicUtils.nullToEmpty(this.state.genderStatus), // 性別
      intoCompanyCode: publicUtils.nullToEmpty(this.state.intoCompanyCode), // 入社区分
      employeeFormCode: publicUtils.nullToEmpty(this.state.employeeFormCode), // 社員形式
      occupationCode: publicUtils.nullToEmpty(this.state.occupationCode), // 職種
      departmentCode: publicUtils.nullToEmpty(this.state.departmentCode), // 部署
      companyMail:
        publicUtils.nullToEmpty(this.state.companyMail) === ""
          ? ""
          : this.state.companyMail + "@lyc.co.jp", // 社内メール
      graduationUniversity: publicUtils.nullToEmpty(
        this.state.graduationUniversity
      ), // 卒業学校
      major: publicUtils.nullToEmpty(this.state.major), // 専門
      graduationYearAndMonth: publicUtils.formateDate(
        this.state.graduationYearAndMonth,
        false
      ), // 卒業年月
      intoCompanyYearAndMonth:
        this.state.employeeStatus === "1" || this.state.employeeStatus === "4"
          ? " "
          : publicUtils.formateDate(this.state.intoCompanyYearAndMonth, true), // 入社年月
      retirementYearAndMonth: publicUtils.formateDate(
        this.state.retirementYearAndMonth,
        true
      ), // 退職年月
      retirementResonClassification: publicUtils.nullToEmpty(
        this.state.retirementResonClassificationCode
      ), //退職区分
      comeToJapanYearAndMonth: publicUtils.formateDate(
        this.state.comeToJapanYearAndMonth,
        false
      ), // 来日年月
      nationalityCode: publicUtils.nullToEmpty(this.state.nationalityCode), // 出身地
      birthplace: publicUtils.nullToEmpty(this.state.birthplace), // 出身県
      phoneNo:
        publicUtils.nullToEmpty(this.state.phoneNo1) +
        publicUtils.nullToEmpty(this.state.phoneNo2) +
        publicUtils.nullToEmpty(this.state.phoneNo3), // 携帯電話
      authorityCode: this.state.authorityCode, // 権限
      japaneseLevelCode: publicUtils.nullToEmpty(this.state.japaneseLevelCode), // 日本語
      englishLevelCode: publicUtils.nullToEmpty(this.state.englishLevelCode), // 英語
      certification1: publicUtils.nullToEmpty(this.state.certification1), // 資格1
      certification2: publicUtils.nullToEmpty(this.state.certification2), // 資格2
      siteRoleCode: publicUtils.nullToEmpty(this.state.siteRoleCode), // 役割
      projectTypeCode: publicUtils.nullToEmpty(this.state.projectTypeCode), // 分野
      postcode: publicUtils.nullToEmpty(this.state.postcode), // 郵便番号
      firstHalfAddress: publicUtils.nullToEmpty(
        this.refs.firstHalfAddress.value
      ),
      lastHalfAddress: publicUtils.nullToEmpty(this.state.lastHalfAddress),
      stationCode: publicUtils.labelGetValue(
        $("#stationCode").val(),
        this.state.station
      ),
      developLanguage1: publicUtils.nullToEmpty(
        publicUtils.labelGetValue(
          $("#developLanguage1").val(),
          this.state.developLanguageMaster
        )
      ),
      developLanguage2: publicUtils.nullToEmpty(
        publicUtils.labelGetValue(
          $("#developLanguage2").val(),
          this.state.developLanguageMaster
        )
      ),
      developLanguage3: publicUtils.nullToEmpty(
        publicUtils.labelGetValue(
          $("#developLanguage3").val(),
          this.state.developLanguageMaster
        )
      ),
      developLanguage4: publicUtils.nullToEmpty(
        publicUtils.labelGetValue(
          $("#developLanguage4").val(),
          this.state.developLanguageMaster
        )
      ),
      developLanguage5: publicUtils.nullToEmpty(
        publicUtils.labelGetValue(
          $("#developLanguage5").val(),
          this.state.developLanguageMaster
        )
      ),
      frameWork1: publicUtils.nullToEmpty(
        publicUtils.labelGetValue(
          $("#frameWork1").val(),
          this.state.frameWorkMaster
        )
      ),
      frameWork2: publicUtils.nullToEmpty(
        publicUtils.labelGetValue(
          $("#frameWork2").val(),
          this.state.frameWorkMaster
        )
      ),
      residenceCode: publicUtils.nullToEmpty(this.state.residenceCode), // 在留資格
      residenceCardNo: publicUtils.nullToEmpty(this.state.residenceCardNo), // 在留カード
      stayPeriod: publicUtils.formateDate(this.state.stayPeriod, true), // 在留期間
      passportStayPeriod: publicUtils.formateDate(
        this.state.passportStayPeriod,
        true
      ), // パスポート期間
      immigrationStartTime: publicUtils.formateDate(
        this.state.immigrationStartTime,
        false
      ), // 出入国開始時間
      immigrationEndTime: publicUtils.formateDate(
        this.state.immigrationEndTime,
        false
      ), // 出入国終了時間
      contractDeadline: publicUtils.formateDate(
        this.state.contractDeadline,
        true
      ), // 契約期間
      employmentInsuranceStatus: publicUtils.nullToEmpty(
        this.state.employmentInsurance
      ), // 雇用保険加入
      employmentInsuranceNo: publicUtils.nullToEmpty(
        this.state.employmentInsuranceNo
      ), // 雇用保険番号
      socialInsuranceStatus: publicUtils.nullToEmpty(
        this.state.socialInsurance
      ), // 社会保険加入
      socialInsuranceNo: publicUtils.nullToEmpty(this.state.socialInsuranceNo), // 社会保険番号
      socialInsuranceDate: publicUtils.formateDate(
        this.state.socialInsuranceDate,
        true
      ), // 社会保険期間
      myNumber: publicUtils.nullToEmpty(this.state.myNumber), // マイナンバー
      passportNo: publicUtils.nullToEmpty(this.state.passportNo), // パスポート番号
      resumeName1: publicUtils.nullToEmpty(this.state.resumeName1), // 履歴書備考1
      resumeName2: publicUtils.nullToEmpty(this.state.resumeName2), // 履歴書備考1
      accountInfo: this.state.accountInfo, // 口座情報
      password: publicUtils.nullToEmpty(this.state.passwordSetInfo), // pw設定
      yearsOfExperience: publicUtils.formateDate(
        this.state.yearsOfExperience,
        false
      ), // 経験年数
      bpInfoModel: this.state.bpInfoModel, // pb情報
      picInfo: imgSrc, // pb情報
      residentCardInfoName: this.state.residentCardInfoName,
      passportInfoName: this.state.passportInfoName,
      introducer: this.state.introducer,
    };
    formData.append("emp", JSON.stringify(emp));
    formData.append(
      "resumeInfo1",
      publicUtils.nullToEmpty($("#resumeInfo1").get(0).files[0])
    );
    formData.append(
      "resumeInfo2",
      publicUtils.nullToEmpty($("#resumeInfo2").get(0).files[0])
    );

    if (this.state.residentCardInfo != undefined)
      formData.append(
        "residentCardInfo",
        publicUtils.nullToEmpty($("#residentCardInfo").get(0).files[0])
      );
    if (this.state.passportInfo != undefined)
      formData.append(
        "passportInfo",
        publicUtils.nullToEmpty($("#passportInfo").get(0).files[0])
      );

    formData.append(
      "resumeInfo1URL",
      publicUtils.nullToEmpty(this.state.resumeName1) === ""
        ? ""
        : this.state.resumeInfo1URL
    );
    formData.append("resumeInfo1Key", this.state.resumeInfo1URL);
    formData.append(
      "resumeInfo2URL",
      publicUtils.nullToEmpty(this.state.resumeName2) === ""
        ? ""
        : this.state.resumeInfo2URL
    );
    formData.append("resumeInfo2Key", this.state.resumeInfo2URL);
    formData.append("residentCardInfoURL", this.state.residentCardInfoURL);
    formData.append("passportInfoURL", this.state.passportInfoURL);
    /*		if(this.state.isBp && this.state.employeeNo.substring(0,2)!=="BP"){
			axios.post(this.state.serverIP + "employee/insertEmployee", formData)
			.then(result => {
				this.setState({ loading: true, });
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
					setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				} else {
					const emp = {
							employeeNo: this.state.bpNo,
						};
					axios.post(this.state.serverIP + "employee/deleteEmployeeInfo", emp)
					.then(result => {
						this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false,isBp:false });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						store.dispatch({type:"UPDATE_STATE",dropName:"getEmployeeName"});
						store.dispatch({type:"UPDATE_STATE",dropName:"getEmployeeNameNoBP"});
						store.dispatch({type:"UPDATE_STATE",dropName:"getEmployeeNameByOccupationName"});
					})
					.catch(function (error) {
						alert("删除错误，请检查程序");
					});
				}
			}).catch((error) => {
				this.setState({ loading: true, });
				console.error("Error - " + error);
				this.setState({ "errorsMessageShow": true, errorsMessageValue: "アップデートするファイル大きすぎる。" });
				setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
			});
		}else{*/
    axios
      .post(this.state.serverIP + "employee/updateEmployee", formData)
      .then((response) => {
        this.setState({ loading: true });
        /*
      	console.log("old 1=" + this.state.oldEmployeeNo + ", =" + this.state.employeeNo)
        this.setState({
          oldEmployeeNo: this.state.employeeNo,
        });
      	console.log("old 2=" + this.state.oldEmployeeNo + ", =" + this.state.employeeNo)*/
        if (response.data.errorsMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.errorsMessage,
          });
          setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
        } else {
          let sendValue = this.state.sendValue;
          if (response.data.residentCardInfo != null) {
            sendValue.residentCardInfo = response.data.residentCardInfo;
          }
          if (response.data.passportInfo != null) {
            sendValue.passportInfo = response.data.passportInfo;
          }
          if (response.data.resumeInfo1 != null) {
            sendValue.resumeInfo1 = response.data.resumeInfo1;
          }
          if (response.data.resumeInfo2 != null) {
            sendValue.resumeInfo2 = response.data.resumeInfo2;
          }
          sendValue.resumeName1 = this.state.resumeName1;
          sendValue.resumeName2 = this.state.resumeName2;

          if (this.state.resumeName1 === "") {
            this.setState({
              resumeInfo1: undefined,
              resumeInfo1URL: "",
            });
            sendValue.resumeInfo1 = "";
          }
          if (this.state.resumeName2 === "") {
            this.setState({
              resumeInfo2: undefined,
              resumeInfo2URL: "",
            });
            sendValue.resumeInfo2 = "";
          }
          this.setState({ sendValue: sendValue });
          this.setState({ myToastShow: true, errorsMessageShow: false });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
          this.setState({
            employeeFristName: publicUtils.trim(this.state.employeeFristName), // 社員氏
            employeeLastName: publicUtils.trim(this.state.employeeLastName), // 社員名
          });
          store.dispatch({ type: "UPDATE_STATE", dropName: "getEmployeeName" });
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getEmployeeNameNoBP",
          });
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getEmployeeNameByOccupationName",
          });
          //window.location.reload();
          //this.getNO(this.state.empNoHead);// 採番番号
          this.getEmployeeByEmployeeNo(this.state.employeeNo)
        }
      })
      .catch((error) => {
        this.setState({ loading: true });
        console.error("Error - " + error);
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue: "ファイルアップデートエラー発生",
        });
        setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
        window.location.reload();
      });
    /*}*/
  };

  // onchange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  departmentCodeChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
	console.log("old=" + this.state.oldEmployeeNo + " target.value=" + event.target.value + " this.state.empNoHead=" + this.state.empNoHead)
    if (event.target.value === "12") {
		if(null != this.state.oldEmployeeNo && this.state.oldEmployeeNo.substring(0,4) === "LYCG"){
			this.setState({
			        employeeNo: this.state.oldEmployeeNo,
			      });
		} else {
      		this.getNO(this.state.empNoHead + "G"); // 採番番号
		}
      this.setState({
        siteRoleCode: "",
        projectTypeCode: "",
        contractDeadline: "",
        temporary_contractDeadline: "",
        resumeName1: "",
        resumeName2: "",
      });
    } else {
		if(null != this.state.oldEmployeeNo && this.state.oldEmployeeNo.substring(0,3) === "LYC" && this.state.oldEmployeeNo.substring(0,4) !== "LYCG"){
			this.setState({
			        employeeNo: this.state.oldEmployeeNo,
			      });
		} else {
			this.getNO(this.state.empNoHead); // 採番番号
		}
    }
  };

  /**
   * 出身地に変更する時、日本語ラベルとEnglishラベルを変更する
   */
  changeNationalityCodes = (event) => {
    let value = event.target.value;
    this.setState({
      nationalityCode: value,
    });
    if (value === "5") {
      this.setState({
        japaneseLevelCode: "5",
        residenceCode: "6",
        residenceCardNo: "",
        stayPeriod: "",
      });
    } else if (value === "0" || value === "1" || value === "7") {
      this.setState({
        englishLevelCode: "8",
      });
    }
  };
  /**
   * 初期化メソッド
   */
  componentDidMount() {
    const { state: locationState } = this.props.location;
    if (locationState) {
      this.setState({
        dutyManagementTempState: locationState.dutyManagementTempState,
      });
    }

    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        let authorityCodes = this.state.authorityCodes;
        let occupationChangeFlag = this.state.occupationChangeFlag;
        if (result.data[0].authorityCode !== "4") {
          authorityCodes = new Array();
          for (let i = 0; i < this.state.authorityCodes.length; i++) {
            if (this.state.authorityCodes[i].code !== "4") {
              authorityCodes.push({
                code: this.state.authorityCodes[i].code,
                name: this.state.authorityCodes[i].name,
              });
              occupationChangeFlag = true;
            }
          }
        }
        this.setState(
          {
            authorityCodes: authorityCodes,
            occupationChangeFlag: occupationChangeFlag,
          },
          () => {
            const { location } = this.props;
            let employeeInfo = [];
            for (let i in this.state.employeeInfo) {
              if (this.state.employeeInfo[i].code.search("BP") === -1)
                employeeInfo.push({
                  code: this.state.employeeInfo[i].code,
                  name: this.state.employeeInfo[i].text,
                  text: this.state.employeeInfo[i].text,
                  value: this.state.employeeInfo[i].value,
                });
            }
            this.setState({
              actionType: location.state.actionType,
              backPage: location.state.backPage,
              sendValue: this.props.location.state.sendValue,
              employeeInfo: employeeInfo,
            });
            this.getEmployeeByEmployeeNo(location.state.id);
          }
        );
      })
      .catch(function (error) {
        //alert(error);
      });
    axios
      .post(this.state.serverIP + "subMenu/getCompanyDate")
      .then((response) => {
        this.setState({
          empNoHead: response.data.empNoHead,
        });
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  }

  getEmployeeByEmployeeNo = (employeeNo) => {
    const emp = {
      employeeNo: employeeNo,
    };
    axios
      .post(this.state.serverIP + "employee/getEmployeeByEmployeeNo", emp)
      .then((response) => response.data)
      .then((data) => {
        $("#firstHalfAddress").val(data.firstHalfAddress);
        this.inactiveBirthday(
          publicUtils.converToLocalTime(data.birthday, true)
        );
        this.setState({
          employeeStatus: data.employeeStatus, // 社員区分
          isBp: employeeNo.substring(0, 2) === "BP" ? true : false,
          bpNo: employeeNo.substring(0, 2) === "BP" ? employeeNo : "",
          oldEmployeeNo: data.employeeNo, // 社員番号
          employeeNo: data.employeeNo, // 社員番号
          bpEmployeeNo: data.employeeNo, // 社員番号
          employeeFristName: data.employeeFristName, // 社員氏
          employeeLastName: data.employeeLastName, // 社員名
          furigana1: data.furigana1, // カタカナ
          furigana2: data.furigana2, // カタカナ
          alphabetName1: data.alphabetName1, // ローマ字
          alphabetName2: data.alphabetName2, // ローマ字
          alphabetName3: data.alphabetName3, // ローマ字
          birthday: publicUtils.converToLocalTime(data.birthday, true), // 年齢
          //temporary_age: publicUtils.converToLocalTime(data.birthday, true) === "" ? "" : Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(data.birthday, true).getTime()) / 31536000000),
          japaneseCalendar: data.japaneseCalendar, // 和暦
          genderStatus: data.genderStatus, // 性別
          intoCompanyCode: data.intoCompanyCode, // 入社区分
          employeeFormCode: data.employeeFormCode, // 社員形式
          retirementYearAndMonthDisabled:
            data.employeeFormCode === "4" ? true : false,
          residenceTimeDisabled:
            data.residenceCode === "5" || data.employeeStatus !== "0"
              ? true
              : false,
          bpDisabled: data.employeeStatus === "0" ? false : true,
          occupationCode: data.occupationCode, // 職種
          departmentCode: data.departmentCode, // 部署
          companyMail:
            data.companyMail !== null && data.companyMail !== ""
              ? data.companyMail.match(/(\S*)@/)[1]
              : "", // 社内メール
          // data.companyMail.match(/(\S*)@/)[1]
          graduationUniversity: data.graduationUniversity, // 卒業学校
          major: data.major, // 専門
          graduationYearAndMonth: publicUtils.converToLocalTime(
            data.graduationYearAndMonth,
            false
          ), // 卒業年月
          temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(
            publicUtils.converToLocalTime(data.graduationYearAndMonth, false),
            new Date()
          ),
          intoCompanyYearAndMonth: publicUtils.converToLocalTime(
            data.intoCompanyYearAndMonth,
            true
          ), // 入社年月
          temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(
            publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, true),
            new Date()
          ),
          retirementYearAndMonth: publicUtils.converToLocalTime(
            data.retirementYearAndMonth,
            true
          ), // 退職年月
          temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(
            publicUtils.converToLocalTime(data.retirementYearAndMonth, false),
            new Date()
          ),
          retirementResonClassificationCode: data.retirementResonClassification, //退職区分
          comeToJapanYearAndMonth: publicUtils.converToLocalTime(
            data.comeToJapanYearAndMonth,
            false
          ), // 来日年月
          temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(
            publicUtils.converToLocalTime(data.comeToJapanYearAndMonth, false),
            new Date()
          ),
          nationalityCode: data.nationalityCode, // 出身地
          birthplace: data.birthplace, // 出身県
          phoneNo1: publicUtils.nullToEmpty(data.phoneNo).slice(0, 3), // 携帯電話
          phoneNo2: publicUtils.nullToEmpty(data.phoneNo).slice(3, 7), // 携帯電話
          phoneNo3: publicUtils.nullToEmpty(data.phoneNo).slice(7, 11), // 携帯電話
          authorityCode: data.authorityCode, // 権限
          japaneseLevelCode: data.japaneseLevelCode, // 日本語
          englishLevelCode: data.englishLevelCode, // 英語
          certification1: data.certification1, // 資格1
          certification2: data.certification2, // 資格2
          siteRoleCode: data.siteRoleCode, // 役割
          projectTypeCode: data.projectTypeCode, // 分野
          postcode: data.postcode, // 郵便番号
          lastHalfAddress: data.lastHalfAddress,
          stationCode: data.stationCode,
          developLanguage1: data.developLanguage1, // スキール1
          developLanguage2: data.developLanguage2, // スキール2
          developLanguage3: data.developLanguage3, // スキール3
          developLanguage4: data.developLanguage4, // スキール4
          developLanguage5: data.developLanguage5, // スキール5
          frameWork1: data.frameWork1,
          frameWork2: data.frameWork2,
          residenceCode: data.residenceCode, // 在留資格
          residenceCardNo: data.residenceCardNo, // 在留カード
          stayPeriod: publicUtils.converToLocalTime(data.stayPeriod, true), // 在留期間
          passportStayPeriod: publicUtils.converToLocalTime(
            data.passportStayPeriod,
            true
          ), // パスポート期間
          immigrationStartTime: publicUtils.converToLocalTime(
            data.immigrationStartTime,
            false
          ), // 出入国開始時間
          immigrationEndTime: publicUtils.converToLocalTime(
            data.immigrationEndTime,
            false
          ), // 出入国終了時間
          contractDeadline: publicUtils.converToLocalTime(
            data.contractDeadline,
            true
          ), // 契約期間
          temporary_stayPeriod:
            publicUtils.converToLocalTime(data.stayPeriod, false) === ""
              ? ""
              : publicUtils.getFullYearMonth(
                  new Date(),
                  publicUtils.converToLocalTime(data.stayPeriod, false)
                ),
          temporary_contractDeadline:
            publicUtils.converToLocalTime(data.contractDeadline, true) === ""
              ? ""
              : publicUtils.getFullYearMonth(
                  new Date(),
                  publicUtils.converToLocalTime(data.contractDeadline, true)
                ),
          employmentInsurance: data.employmentInsuranceStatus, // 雇用保険加入
          employmentInsuranceNo: data.employmentInsuranceNo, // 雇用保険番号
          socialInsurance: data.socialInsuranceStatus, // 社会保険加入
          socialInsuranceNo: data.socialInsuranceNo, // 社会保険番号
          socialInsuranceDate: publicUtils.converToLocalTime(
            data.socialInsuranceDate,
            true
          ), // 社会保険期間
          myNumber: data.myNumber, // マイナンバー
          passportNo: data.passportNo, //パスポート番号
          residentCardInfoURL: publicUtils.nullToEmpty(data.residentCardInfo), // 在留カード
          resumeInfo1URL: publicUtils.nullToEmpty(data.resumeInfo1), // 履歴書
          resumeName1: data.resumeName1, // 履歴書備考1
          resumeInfo2URL: publicUtils.nullToEmpty(data.resumeInfo2), // 履歴書2
          resumeName2: data.resumeName2, // 履歴書備考1
          passportInfoURL: publicUtils.nullToEmpty(data.passportInfo), // パスポート
          yearsOfExperience: publicUtils.converToLocalTime(
            data.yearsOfExperience,
            false
          ), // 経験年数
          temporary_yearsOfExperience: publicUtils.getFullYearMonth(
            publicUtils.converToLocalTime(
              data.yearsOfExperience === ""
                ? data.graduationYearAndMonth
                : data.yearsOfExperience,
              false
            ),
            new Date()
          ),
          image: data.picInfo,
          introducer: data.introducer,
          employeeName:
            this.state.employeeInfo.find((v) => v.code === data.introducer) ===
            undefined
              ? ""
              : this.state.employeeInfo.find((v) => v.code === data.introducer)
                  .name,
        });
      });
  };

  /**
   * 漢字をカタカナに変更する
   */
  katakanaApiChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let promise = Promise.resolve(publicUtils.katakanaApi(value));
    promise.then((date) => {
      switch (name) {
        case "employeeFristName":
          this.setState({
            furigana1: date,
            employeeFristName: value,
          });
          break;
        case "employeeLastName":
          this.setState({
            furigana2: date,
            employeeLastName: value,
          });
          break;
        default:
      }
    });
  };

  /**
   * 採番番号
   */
  getNO = (NO) => {
    const promise = Promise.resolve(
      publicUtils.getNO("employeeNo", NO, "T001Employee", this.state.serverIP)
    );
    promise.then((value) => {
      this.setState({
        employeeNo: value,
      });
    });
  };

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
  inactiveBirthday = (date) => {
    if (date !== undefined && date !== null && date !== "") {
      const promise = Promise.resolve(publicUtils.calApi(date));
      promise.then((data) => {
        this.setState({
          birthday: date,
          japaneseCalendar: data[0][0].text,
          temporary_age: data[1],
        });
      });
    } else {
      this.setState({
        temporary_age: "",
        birthday: "",
        japaneseCalendar: "",
      });
    }
  };
  // 卒業年月
  inactiveGraduationYearAndMonth = (date) => {
    this.setState({
      graduationYearAndMonth: date,
      temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(
        date,
        new Date()
      ),
      temporary_yearsOfExperience:
        this.state.yearsOfExperience === ""
          ? publicUtils.getFullYearMonth(date, new Date())
          : this.state.temporary_yearsOfExperience,
    });
  };
  // 入社年月
  inactiveintoCompanyYearAndMonth = (date) => {
    this.setState({
      intoCompanyYearAndMonth: date,
      temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(
        date,
        new Date()
      ),
    });
  };
  // 退職年月
  inactiveRetirementYearAndMonth = (date) => {
    this.setState({
      retirementYearAndMonth: date,
      temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(
        date,
        new Date()
      ),
    });
  };
  // 来日年月
  inactiveComeToJapanYearAndMonth = (date) => {
    this.setState({
      comeToJapanYearAndMonth: date,
      temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(
        date,
        new Date()
      ),
    });
  };
  // 経験年数
  inactiveyearsOfExperience = (date) => {
    this.setState({
      yearsOfExperience: date,
      temporary_yearsOfExperience: publicUtils.getFullYearMonth(
        date,
        new Date()
      ),
    });
  };
  // 在留期間
  inactiveStayPeriod = (date) => {
    this.setState({
      stayPeriod: date,
      temporary_stayPeriod: publicUtils.getFullYearMonth(new Date(), date),
    });
  };

  passportStayPeriodChange = (date) => {
    this.setState({
      passportStayPeriod: date,
    });
  };

  socialInsuranceDateChange = (date) => {
    this.setState({
      socialInsuranceDate: date,
    });
    if (date !== "" && date !== null) {
      this.setState({
        socialInsurance: "1",
      });
    } else {
      this.setState({
        socialInsurance: "0",
        socialInsuranceNo: "",
      });
    }
  };

  immigrationStartTimeChange = (date) => {
    this.setState({
      immigrationStartTime: date,
    });
  };

  immigrationEndTimeChange = (date) => {
    this.setState({
      immigrationEndTime: date,
    });
  };

  // 契約期間
  inactiveContractDeadline = (date) => {
    this.setState({
      contractDeadline: date,
      temporary_contractDeadline: publicUtils.getFullYearMonth(
        new Date(),
        date
      ),
    });
  };
  // 年月終了

  /**
   * タイプが違う時に、色々な操作をします。
   */
  employeeStatusChange = (event) => {
    const value = event.target.value;
    this.setState({ employeeStatus: value });
	console.log("old=" + this.state.oldEmployeeNo + " target.value=" + event.target.value)
    if (value === "1" || value === "4") {
      if (value === "1") {
		if(null != this.state.oldEmployeeNo && this.state.oldEmployeeNo.substring(0,3) !== "BPR" && this.state.oldEmployeeNo.substring(0,2) === "BP"){
			this.setState({employeeNo: this.state.oldEmployeeNo,});
		} else {
    		this.getNO("BP");
		}
      } else {
		if(null != this.state.oldEmployeeNo && this.state.oldEmployeeNo.substring(0,3) === "BPR"){
			this.setState({employeeNo: this.state.oldEmployeeNo,});
		} else {
    		this.getNO("BPR");
		}
      }
      this.setState({
        contractDeadline: "",
        temporary_contractDeadline: "",
        companyMail: "",
        authorityCode: "0",
        intoCompanyCode: "",
        departmentCode: "",
        retirementYearAndMonth: "",
        retirementResonClassificationCode: "",
        occupationCode: "3",
        employeeNo: this.state.bpNo,
        bpDisabled: true,
        residenceTimeDisabled: true,
        intoCompanyYearAndMonth: "",
        temporary_intoCompanyYearAndMonth: "",
        employeeFormCode: "",
        temporary_retirementYearAndMonth: "",
        retirementYearAndMonthDisabled: false,
        residenceCode: "",
        residenceCardNo: "",
        stayPeriod: "",
        passportStayPeriod: "",
        passportNo: "",
        myNumber: "",
        employmentInsurance: "",
        employmentInsuranceNo: "",
        socialInsuranceDate: "",
        socialInsuranceNo: "",
        immigrationStartTime: "",
        immigrationEndTime: "",
        socialInsurance: "",
      });
    } else if (value === "0") {
		if(null != this.state.oldEmployeeNo && this.state.oldEmployeeNo.substring(0,3) === "LYC"){
			this.setState({employeeNo: this.state.oldEmployeeNo,});
		} else {
      		this.getNO(this.state.empNoHead);
		}
      this.setState({
        bpDisabled: false,
        residenceTimeDisabled: this.state.residenceCode === "5" ? true : false,
        authorityCode: "1",
        employeeFormCodes: this.state.employeeFormCodesAll,
      });
    } else if (value === "2") {
      let employeeFormCodes = [];
      for (let i in this.state.employeeFormCodesAll) {
        if (
          this.state.employeeFormCodesAll[i].code === "" ||
          this.state.employeeFormCodesAll[i].code === "4" ||
          this.state.employeeFormCodesAll[i].code === "5"
        ) {
          employeeFormCodes.push(this.state.employeeFormCodesAll[i]);
        }
      }
      this.setState({
        authorityCode: "1",
        departmentCode: "",
        retirementYearAndMonth: "",
        retirementResonClassificationCode: "",
        employeeFormCodes: employeeFormCodes,
        employeeFormCode:
          this.state.employeeFormCode === "4" ||
          this.state.employeeFormCode === "5"
            ? this.state.employeeFormCode
            : "",
        temporary_retirementYearAndMonth: "",
        retirementYearAndMonthDisabled: false,
        socialInsuranceDate: "",
        employmentInsurance: "",
        residenceTimeDisabled: true,
        employmentInsuranceNo: "",
        socialInsuranceNo: "",
        socialInsurance: "0",
      });
      
		if(null != this.state.oldEmployeeNo && this.state.oldEmployeeNo.substring(0,2) === "SP"){
			this.setState({employeeNo: this.state.oldEmployeeNo,});
		} else {
      		this.getNO("SP");
		}
    } else if (value === "3") {
      this.setState({
        authorityCode: "1",
        employeeFormCodes: this.state.employeeFormCodesAll,
      });
		if(null != this.state.oldEmployeeNo && this.state.oldEmployeeNo.substring(0,2) === "SC"){
			this.setState({employeeNo: this.state.oldEmployeeNo,});
		} else {
      		this.getNO("SC");
		}
    }
  };

  /*
   * ポップアップ口座情報の取得
   */
  accountInfoGet = (accountTokuro) => {
    this.setState({
      accountInfo: accountTokuro,
      showBankInfoModalFlag: false,
    });
  };

  /*
   * ポップアップPW設定の取得
   */
  passwordSetInfoGet = (passwordSetTokuro) => {
    this.setState({
      passwordSetInfo: passwordSetTokuro,
      showpasswordSetModalFlag: false,
    });
    const formData = new FormData();
    const emp = {
      employeeNo: this.state.employeeNo, // 社員番号
      password: publicUtils.nullToEmpty(passwordSetTokuro), // pw設定
    };
    formData.append("emp", JSON.stringify(emp));
    axios
      .post(this.state.serverIP + "employee/updatePassWord", formData)
      .then((response) => {
        if (response.data.errorsMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.errorsMessage,
          });
          setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
        } else {
          this.setState({ myToastShow: true, errorsMessageShow: false });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };
  /*
   * ポップアップpb情報の取得
   */
  pbInfoGet = (pbInfoGetTokuro) => {
    this.setState({
      bpInfoModel: pbInfoGetTokuro,
      showBpInfoModalFlag: false,
    });
  };
  /**
   * 小さい画面の閉め
   */
  handleHideModal = (kbn) => {
    if (kbn === "bankInfo") {
      // 口座情報
      this.setState({ showBankInfoModalFlag: false });
    } else if (kbn === "passwordSet") {
      // PW設定
      this.setState({ showpasswordSetModalFlag: false });
    } else if (kbn === "bpInfoModel") {
      // pb情報
      this.setState({ showBpInfoModalFlag: false });
    }
  };

  /**
   * 小さい画面の開き
   */
  handleShowModal = (kbn) => {
    if (kbn === "bankInfo") {
      // 口座情報
      this.setState({ showBankInfoModalFlag: true });
    } else if (kbn === "passwordSet") {
      // PW設定
      this.setState({ showpasswordSetModalFlag: true });
    } else if (kbn === "bpInfoModel") {
      // pb情報
      this.setState({ showBpInfoModalFlag: true });
    }
  };

  valueChangeEmployeeFormCode = (event) => {
    const value = event.target.value;
    if (value === "4") {
      this.setState({
        retirementYearAndMonthDisabled: true,
        employeeFormCode: event.target.value,
      });
    } else {
      this.setState({
        retirementYearAndMonthDisabled: false,
        retirementYearAndMonth: "",
        retirementResonClassificationCode: "",
        employeeFormCode: event.target.value,
        temporary_retirementYearAndMonth: "",
      });
    }
  };

  valueChangeEmployeeInsuranceStatus = (event) => {
    const value = event.target.value;
    if (value !== "1") {
      this.setState({ employmentInsuranceNo: "" });
    }
    this.setState({ employmentInsurance: value });
  };

  valueChangesocialInsuranceStatus = (event) => {
    const value = event.target.value;
    if (value !== "1") {
      this.setState({ socialInsuranceNo: "" });
    }
    this.setState({ socialInsurance: value });
  };

  valueChangeResidenceCodeFormCode = (event) => {
    const value = event.target.value;
    if (value === "3") {
      this.setState({
        residenceTimeDisabled: false,
        residenceCardNo: "",
        stayPeriod: "",
      });
    } else if (value === "6") {
      this.setState({
        residenceTimeDisabled: false,
        residenceCardNo: "",
        stayPeriod: "",
      });
    } else if (value === "7") {
      this.setState({
        residenceTimeDisabled: true,
        stayPeriod: "",
        passportStayPeriod: "",
        temporary_stayPeriod: "",
      });
    } else {
      this.setState({ residenceTimeDisabled: false });
    }
    this.setState({ residenceCode: event.target.value });
  };

  changeFile = (event, name) => {
    var filePath = event.target.value;
    var arr = filePath.split("\\");
    var fileName = arr[arr.length - 1];
    if (name === "residentCardInfo") {
      this.setState({
        residentCardInfo: filePath,
        residentCardInfoName: fileName,
        residentCardInfoURL: filePath,
      });
    } else if (name === "resumeInfo1") {
      this.setState({
        resumeInfo1: filePath,
        resumeInfo1Name: fileName,
      });
    } else if (name === "resumeInfo2") {
      this.setState({
        resumeInfo2: filePath,
        resumeInfo2Name: fileName,
      });
    } else if (name === "passportInfo") {
      this.setState({
        passportInfo: filePath,
        passportInfoName: fileName,
        passportInfoURL: filePath,
      });
    } else if (name === "image") {
      if (publicUtils.nullToEmpty($("#image").get(0).files[0]) === "") {
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(
        publicUtils.nullToEmpty($("#image").get(0).files[0])
      );
      reader.onload = function () {
        document.getElementById("imageId").src = reader.result;
      };
    }
  };

  /**
   * ファイルを処理
   *
   * @param {*}
   *            event
   * @param {*}
   *            name
   */
  addFile = (event, name) => {
    $("#" + name).click();
  };

  deleteFile = (name) => {
    switch (name) {
      case "residentCardInfo":
        this.setState({
          residentCardInfoURL: "",
          residentCardInfo: undefined,
          residentCardInfoName: null,
        });
        break;
      case "passportInfo":
        this.setState({
          passportInfoURL: "",
          passportInfo: undefined,
          passportInfoName: null,
        });
        break;
      default:
        break;
    }
  };

  back = () => {
    let backPage = this.state.backPage;
    if (backPage !== null && backPage !== undefined && backPage !== "") {
      var path = {};
      path = {
        pathname: "/subMenuManager/" + backPage,
        state: {
          sendValue: this.state.sendValue,
          employeeNo: this.state.employeeNo,
        },
      };
      if (this.state.dutyManagementTempState) {
        path.state.dutyManagementTempState = this.state.dutyManagementTempState;
      }
      return this.props.history.push(path);
    } else {
      return this.props.history.push("/subMenuManager/employeeInsertNew");
    }
  };

  getStationCode = (event, values) => {
    if (values != null) {
      this.setState({
        stationCode: values.code,
      });
    } else {
      this.setState({
        stationCode: "",
      });
    }
  };
  getDevelopLanguage1 = (event, values) => {
    if (values != null) {
      this.setState({
        developLanguage1: values.code,
      });
    } else {
      this.setState({
        developLanguage1: "",
      });
    }
  };
  getDevelopLanguage2 = (event, values) => {
    if (values != null) {
      this.setState({
        developLanguage2: values.code,
      });
    } else {
      this.setState({
        developLanguage2: "",
      });
    }
  };
  getDevelopLanguage3 = (event, values) => {
    if (values != null) {
      this.setState({
        developLanguage3: values.code,
      });
    } else {
      this.setState({
        developLanguage3: "",
      });
    }
  };
  getDevelopLanguage4 = (event, values) => {
    if (values != null) {
      this.setState({
        developLanguage4: values.code,
      });
    } else {
      this.setState({
        developLanguage4: "",
      });
    }
  };
  getDevelopLanguage5 = (event, values) => {
    if (values != null) {
      this.setState({
        developLanguage5: values.code,
      });
    } else {
      this.setState({
        developLanguage5: "",
      });
    }
  };

  getFrameWork1 = (event, values) => {
    if (values != null) {
      this.setState({
        frameWork1: values.code,
      });
    } else {
      this.setState({
        frameWork1: "",
      });
    }
  };

  getFrameWork2 = (event, values) => {
    if (values != null) {
      this.setState({
        frameWork2: values.code,
      });
    } else {
      this.setState({
        frameWork2: "",
      });
    }
  };

  // AUTOSELECT select事件
  handleTag = ({ target }, fieldName) => {
    const { value, id } = target;
    if (value === "") {
      this.setState({
        [id]: "",
      });
    } else {
      if (this.state.employeeInfo.find((v) => v.name === value) !== undefined) {
        switch (fieldName) {
          case "employeeName":
            this.setState({
              employeeName: value,
            });
            break;
        }
      }
    }
  };

  /**
   * 社員名連想
   *
   * @param {}
   *            event
   */
  getEmployeeName = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let employeeName = null;
        let introducer = null;
        if (values !== null) {
          employeeName = values.text;
          introducer = values.code;
        }
        this.setState({
          employeeName: employeeName,
          introducer: introducer,
        });
      }
    );
  };

  /**
   * 郵便番号API
   */
  postApi = (event) => {
    let value = event.target.value;
    const promise = Promise.resolve(publicUtils.postcodeApi(value));
    promise.then((data) => {
      if (data !== undefined && data !== null && data !== "") {
        this.setState({ firstHalfAddress: data });
      } else {
        this.setState({ firstHalfAddress: "", lastHalfAddress: "" });
      }
    });
  };
  render() {
    const {
      employeeNo,
      employeeFristName,
      employeeLastName,
      furigana1,
      furigana2,
      alphabetName1,
      alphabetName2,
      alphabetName3,
      temporary_age,
      japaneseCalendar,
      genderStatus,
      major,
      intoCompanyCode,
      employeeFormCode,
      occupationCode,
      departmentCode,
      companyMail,
      graduationUniversity,
      nationalityCode,
      birthplace,
      phoneNo1,
      phoneNo2,
      phoneNo3,
      authorityCode,
      japaneseLevelCode,
      englishLevelCode,
      residenceCode,
      residenceCardNo,
      employmentInsuranceNo,
      socialInsuranceNo,
      retirementResonClassificationCode,
      myNumber,
      passportNo,
      certification1,
      certification2,
      siteRoleCode,
      projectTypeCode,
      postcode,
      lastHalfAddress,
      resumeName1,
      resumeName2,
      temporary_stayPeriod,
      temporary_contractDeadline,
      temporary_yearsOfExperience,
      temporary_intoCompanyYearAndMonth,
      temporary_comeToJapanYearAndMonth,
      retirementYearAndMonthDisabled,
      residenceTimeDisabled,
      bpDisabled,
      temporary_graduationYearAndMonth,
      temporary_retirementYearAndMonth,
      errorsMessageValue,
      employeeStatus,
      firstHalfAddress,
      employmentInsurance,
      socialInsurance,
    } = this.state;
    const { accountInfo, passwordSetInfo, bpInfoModel, actionType } =
      this.state;
    return (
      <div>
        <FormControl value={actionType} name="actionType" hidden />
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={"修正成功！"}
            type={"success"}
          />
        </div>
        <div
          style={{ display: this.state.errorsMessageShow ? "block" : "none" }}
        >
          <ErrorsMessageToast
            errorsMessageShow={this.state.errorsMessageShow}
            message={errorsMessageValue}
            type={"danger"}
          />
        </div>
        <Row inline="true">
          <Col className="text-center">
            <h2>社員情報修正</h2>
          </Col>
        </Row>
        <br />
        {/* 開始 */}
        {/* 口座情報 */}
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.handleHideModal.bind(this, "bankInfo")}
          show={this.state.showBankInfoModalFlag}
          dialogClassName="modal-bankInfo"
        >
          <Modal.Header closeButton>
            <Col className="text-center">
              <h2>口座情報</h2>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <BankInfo
              accountInfo={accountInfo}
              actionType={this.state.actionType}
              employeeNo={this.state.employeeNo}
              accountTokuro={this.accountInfoGet}
              employeeFristName={this.state.employeeFristName}
              employeeLastName={this.state.employeeLastName}
            />
          </Modal.Body>
        </Modal>
        {/* PW設定 */}
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.handleHideModal.bind(this, "passwordSet")}
          show={this.state.showpasswordSetModalFlag}
          dialogClassName="modal-passwordSet"
        >
          <Modal.Header closeButton>
            <Col className="text-center">
              <h2>パースワード設定</h2>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <PasswordSet
              passwordSetInfo={passwordSetInfo}
              actionType={this.state.actionType}
              employeeNo={this.state.employeeNo}
              employeeFristName={this.state.employeeFristName}
              employeeLastName={this.state.employeeLastName}
              passwordToroku={this.passwordSetInfoGet}
            />
          </Modal.Body>
        </Modal>
        {/* bp情報 */}
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.handleHideModal.bind(this, "bpInfoModel")}
          show={this.state.showBpInfoModalFlag}
          dialogClassName="modal-pbinfoSet"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <BpInfoModel
              bpInfoModel={bpInfoModel}
              customer={this.state.customer}
              actionType={this.state.actionType}
              employeeNo={this.state.employeeNo}
              employeeFristName={this.state.employeeFristName}
              employeeLastName={this.state.employeeLastName}
              pbInfoTokuro={this.pbInfoGet}
            />
          </Modal.Body>
        </Modal>
        {/* 終了 */}
        <div style={{ textAlign: "center" }}>
          <Button
            size="sm"
            id="bankInfo"
            onClick={this.handleShowModal.bind(this, "bankInfo")}
            disabled={
              employeeStatus === "0" ||
              employeeStatus === "2" ||
              employeeStatus === "3"
                ? false
                : true
            }
          >
            口座情報
          </Button>{" "}
          <Button
            size="sm"
            id="passwordSet"
            onClick={this.handleShowModal.bind(this, "passwordSet")}
            disabled={
              employeeStatus === "0" ||
              employeeStatus === "2" ||
              employeeStatus === "3"
                ? false
                : true
            }
          >
            PW設定
          </Button>{" "}
          <Button
            size="sm"
            id="bpInfoModel"
            hidden
            onClick={this.handleShowModal.bind(this, "bpInfoModel")}
            disabled={
              employeeStatus === "0" ||
              employeeStatus === "2" ||
              employeeStatus === "3"
                ? true
                : false
            }
          >
            BP情報
          </Button>{" "}
        </div>
        <Form onReset={this.resetBook} enctype="multipart/form-data">
          <Form.Group>
            <Row>
              <Col sm={12}>
                <Form.Label style={{ color: "#000000" }}>基本情報</Form.Label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        社員区分
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.employeeStatusChange.bind(this)}
                      name="employeeStatus"
                      value={employeeStatus}
                      autoComplete="off" /*disabled={this.state.isBp?false:true}*/
                    >
                      {this.state.employeeStatusS.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font className="site-mark"></font>
                  </InputGroup>

                  <InputGroup size="sm" className="">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        社員名
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="社員氏"
                      value={employeeFristName}
                      autoComplete="off"
                      onChange={this.valueChange}
                      onBlur={this.katakanaApiChange.bind(this)}
                      size="sm"
                      name="employeeFristName"
                      maxlength="8"
                    />{" "}
                    <FormControl
                      placeholder="社員名"
                      value={employeeLastName}
                      autoComplete="off"
                      onChange={this.valueChange}
                      onBlur={this.katakanaApiChange.bind(this)}
                      size="sm"
                      name="employeeLastName"
                      maxlength="8"
                    />
                    <font color="red" className="site-mark">
                      ★
                    </font>
                  </InputGroup>

                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        カタカナ
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="カタカナ"
                      value={furigana1}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="furigana1"
                    />{" "}
                    <FormControl
                      placeholder="カタカナ"
                      value={furigana2}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="furigana2"
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        ローマ字
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={alphabetName1}
                      autoComplete="off"
                      placeholder="first"
                      onChange={this.valueChange}
                      size="sm"
                      name="alphabetName1"
                    />{" "}
                    <font color="red" className="site-mark">
                      {" "}
                    </font>
                    <FormControl
                      value={alphabetName2}
                      autoComplete="off"
                      placeholder=" last"
                      onChange={this.valueChange}
                      size="sm"
                      name="alphabetName2"
                    />
                    <FormControl
                      value={alphabetName3}
                      autoComplete="off"
                      placeholder=" last"
                      onChange={this.valueChange}
                      size="sm"
                      name="alphabetName3"
                    />
                    <font color="red" className="site-mark">
                      ★
                    </font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        性別
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="genderStatus"
                      value={genderStatus}
                      autoComplete="off"
                    >
                      {this.state.genderStatuss.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font color="red" className="site-mark">
                      ★
                    </font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        年齢
                      </InputGroup.Text>
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
                      />
                    </InputGroup.Append>
                    <FormControl
                      id="temporary_age"
                      value={temporary_age}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="temporary_age"
                      disabled
                    />
                    <FormControl value="歳" size="sm" disabled />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        国籍
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.changeNationalityCodes}
                      name="nationalityCode"
                      value={nationalityCode}
                      autoComplete="off"
                    >
                      {this.state.nationalityCodes.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font
                      color="red"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      ★
                    </font>
                    <FormControl
                      placeholder="県"
                      value={birthplace}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="birthplace"
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                </Col>
              </Col>

              <Col sm={4}>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">
                        {employeeStatus === "2"
                          ? "事業主番号"
                          : employeeStatus === "0" || employeeStatus === "3"
                          ? "社員番号"
                          : employeeStatus === "1" || employeeStatus === "4"
                          ? "BP番号"
                          : ""}
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={employeeNo}
                      autoComplete="off"
                      disabled
                      onChange={this.valueChange}
                      size="sm"
                      name="employeeNo"
                    />
                    <font className="site-mark"></font>
                  </InputGroup>

                  <InputGroup size="sm" className="">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">社員形式</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChangeEmployeeFormCode}
                      name="employeeFormCode"
                      value={employeeFormCode}
                      autoComplete="off"
                      id="Autocompletestyle-employeeInsert-employeeFormCode"
                      disabled={
                        employeeStatus === "0" ||
                        employeeStatus === "2" ||
                        employeeStatus === "3"
                          ? false
                          : true
                      }
                    >
                      {this.state.employeeFormCodes.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">部署</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.departmentCodeChange}
                      name="departmentCode"
                      value={departmentCode}
                      autoComplete="off"
                      disabled={
                        employeeStatus === "0" || employeeStatus === "3"
                          ? false
                          : true
                      }
                    >
                      {this.state.departmentCodes.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">職種</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="occupationCode"
                      value={occupationCode}
                      autoComplete="off"
                      disabled={
                        departmentCode === "0" ||
                        employeeStatus === "1" ||
                        this.state.occupationChangeFlag
                          ? true
                          : false
                      }
                    >
                      {this.state.occupationCodes.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">採用区分</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="intoCompanyCode"
                      value={intoCompanyCode}
                      autoComplete="off"
                      disabled={
                        employeeStatus === "0" ||
                        employeeStatus === "2" ||
                        employeeStatus === "3"
                          ? false
                          : true
                      }
                    >
                      {this.state.intoCompanyCodes.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sanKanji">紹介者</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      id="employeeName"
                      name="employeeName"
                      value={
                        this.state.employeeInfo.find(
                          (v) => v.text === this.state.employeeName
                        ) || {}
                      }
                      options={this.state.employeeInfo}
                      getOptionLabel={(option) =>
                        option.text ? option.text : ""
                      }
                      onSelect={(event) =>
                        this.handleTag(event, "employeeName")
                      }
                      onChange={(event, values) =>
                        this.getEmployeeName(event, values)
                      }
                      renderOption={(option) => {
                        return (
                          <React.Fragment>{option.name || ""}</React.Fragment>
                        );
                      }}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            className="auto"
                            className="auto form-control Autocompletestyle-employeeInsertNew-employeeNo"
                          />
                        </div>
                      )}
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">
                        社内メール
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="email"
                      placeholder="メール"
                      value={companyMail}
                      autoComplete="off"
                      disabled={
                        employeeStatus === "0" ||
                        employeeStatus === "2" ||
                        employeeStatus === "3"
                          ? false
                          : true
                      }
                      onChange={this.valueChange}
                      size="sm"
                      name="companyMail"
                    />
                    <FormControl value="@lyc.co.jp" size="sm" disabled />
                    <font color="red" className="site-mark">
                      ★
                    </font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">携帯電話</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={phoneNo1}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="phoneNo1"
                      maxlength="3"
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text className="width-auto bdr0">
                        —
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={phoneNo2}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="phoneNo2"
                      maxlength="4"
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text className="width-auto bdr0">
                        —
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={phoneNo3}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="phoneNo3"
                      maxlength="4"
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                </Col>
              </Col>
              <Col sm={4}>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <Image
                        src={this.state.image}
                        id="imageId"
                        rounded
                        width="220"
                        height="240"
                        onClick={(event) => this.addFile(event, "image")}
                      />
                    </InputGroup.Prepend>
                    <Form.File
                      id="image"
                      hidden
                      data-browse="添付"
                      custom
                      onChange={(event) => this.changeFile(event, "image")}
                      accept="image/png, image/jpeg"
                    ></Form.File>
                    <Form.File
                      id="resumeInfo1"
                      hidden
                      data-browse="添付"
                      value={this.state.resumeInfo1}
                      custom
                      onChange={(event) =>
                        this.changeFile(event, "resumeInfo1")
                      }
                    />
                    <Form.File
                      id="resumeInfo2"
                      hidden
                      data-browse="添付"
                      value={this.state.resumeInfo2}
                      custom
                      onChange={(event) =>
                        this.changeFile(event, "resumeInfo2")
                      }
                    />
                  </InputGroup>
                </Col>
              </Col>
              {/*<Col sm={0}>
								<InputGroup size="sm" className="mb-3" style={{ visibility: "hidden" }}>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl
										size="sm" disabled />
								</InputGroup>
								
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="和暦" value={japaneseCalendar} id="japaneseCalendar" autoComplete="off" onChange={this.valueChange} size="sm" name="japaneseCalendar" disabled />
								</InputGroup>
								
							</Col>*/}
            </Row>
            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ color: "#000000" }}>
                  基本情報補足
                </Form.Label>
                <Col>
                  <InputGroup size="sm" className="">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        権限
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="authorityCode"
                      value={authorityCode}
                      autoComplete="off"
                      id="authorityCodeId"
                      disabled={
                        employeeStatus === "1" || employeeStatus === "4"
                          ? true
                          : false
                      }
                    >
                      {this.state.authorityCodes.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        卒業学校
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="学校"
                      value={graduationUniversity}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="graduationUniversity"
                    />
                    <FormControl
                      placeholder="専門"
                      value={major}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="major"
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        卒業年月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.graduationYearAndMonth}
                        onChange={this.inactiveGraduationYearAndMonth}
                        locale="ja"
                        dateFormat="yyyy/MM"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        id="datePicker-empInsert-left"
                        className="form-control form-control-sm"
                        autoComplete="off"
                      />
                    </InputGroup.Append>
                    <FormControl
                      name="temporary_graduationYearAndMonth"
                      value={temporary_graduationYearAndMonth}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      disabled
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        来日年月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.comeToJapanYearAndMonth}
                        onChange={this.inactiveComeToJapanYearAndMonth}
                        locale="ja"
                        dateFormat="yyyy/MM"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        id="datePicker-empInsert-left"
                        className="form-control form-control-sm"
                        autoComplete="off"
                      />
                    </InputGroup.Append>
                    <FormControl
                      name="temporary_comeToJapanYearAndMonth"
                      value={temporary_comeToJapanYearAndMonth}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      disabled
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        入社年月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.intoCompanyYearAndMonth}
                        onChange={this.inactiveintoCompanyYearAndMonth}
                        locale="ja"
                        dateFormat="yyyy/MM/dd"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        disabled={
                          employeeStatus === "1" || employeeStatus === "4"
                            ? true
                            : false
                        }
                        id={
                          employeeStatus === "1" || employeeStatus === "4"
                            ? "datePickerReadonlyDefault-empInsert-left"
                            : "datePicker-empInsert-left"
                        }
                      />
                    </InputGroup.Append>
                    <FormControl
                      name="temporary_intoCompanyYearAndMonth"
                      value={temporary_intoCompanyYearAndMonth}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      disabled
                    />
                    <font color="red" className="site-mark">
                      ★
                    </font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        経験年数
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.yearsOfExperience}
                        onChange={this.inactiveyearsOfExperience}
                        locale="ja"
                        dateFormat="yyyy/MM"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        className="form-control form-control-sm"
                        autoComplete="off"
                        id="datePicker-empInsert-left"
                      />
                    </InputGroup.Append>
                    <FormControl
                      name="temporary_yearsOfExperience"
                      value={temporary_yearsOfExperience}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      disabled
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        役割
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      name="siteRoleCode"
                      onChange={this.valueChange}
                      value={siteRoleCode}
                      autoComplete="off"
                      disabled={departmentCode === "0" ? true : false}
                    >
                      {this.state.siteMaster.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      name="projectTypeCode"
                      onChange={this.valueChange}
                      value={projectTypeCode}
                      autoComplete="off"
                      disabled={departmentCode === "0" ? true : false}
                    >
                      {this.state.projectType.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        契約期限
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.contractDeadline}
                        onChange={this.inactiveContractDeadline}
                        locale="ja"
                        dateFormat="yyyy/MM/dd"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        id={
                          employeeStatus === "1" ||
                          employeeStatus === "4" ||
                          departmentCode === "0"
                            ? "datePickerReadonlyDefault-empInsert-left"
                            : "datePicker-empInsert-left"
                        }
                        disabled={
                          employeeStatus === "1" ||
                          employeeStatus === "4" ||
                          departmentCode === "0"
                            ? true
                            : false
                        }
                      />
                    </InputGroup.Append>
                    <FormControl
                      name="temporary_contractDeadline"
                      value={temporary_contractDeadline}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      disabled
                    />
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        履歴書1
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="履歴書1名"
                      value={resumeName1}
                      autoComplete="off"
                      maxlength="30"
                      onChange={this.valueChange}
                      size="sm"
                      name="resumeName1"
                      disabled={departmentCode === "0" ? true : false}
                    />
                    <Button
                      size="sm"
                      style={
                        this.state.resumeInfo1URL !== "" ||
                        this.state.resumeInfo1 !== undefined
                          ? { backgroundColor: "#53A100", border: "none" }
                          : { backgroundColor: "", border: "none" }
                      }
                      onClick={(event) => this.addFile(event, "resumeInfo1")}
                      disabled={departmentCode === "0" ? true : false}
                    >
                      <FontAwesomeIcon icon={faFile} />{" "}
                      {this.state.resumeInfo1URL !== "" ||
                      this.state.resumeInfo1 !== undefined
                        ? "済み"
                        : "添付"}
                    </Button>
                    <font className="site-mark"></font>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        履歴書2
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="履歴書2名"
                      value={resumeName2}
                      autoComplete="off"
                      disabled={
                        employeeStatus === "0" || employeeStatus === "3"
                          ? false
                          : true
                      }
                      maxlength="30"
                      onChange={this.valueChange}
                      size="sm"
                      name="resumeName2"
                      disabled={departmentCode === "0" ? true : false}
                    />
                    <Button
                      size="sm"
                      style={
                        this.state.resumeInfo2URL !== "" ||
                        this.state.resumeInfo2 !== undefined
                          ? { backgroundColor: "#53A100", border: "none" }
                          : { backgroundColor: "", border: "none" }
                      }
                      onClick={(event) => this.addFile(event, "resumeInfo2")}
                      disabled={
                        (employeeStatus === "0" || employeeStatus === "3"
                          ? false
                          : true) || departmentCode === "0"
                          ? true
                          : false
                      }
                    >
                      <FontAwesomeIcon icon={faFile} />{" "}
                      {this.state.resumeInfo2URL !== "" ||
                      this.state.resumeInfo2 !== undefined
                        ? "済み"
                        : "添付"}
                    </Button>
                    <font className="site-mark"></font>
                  </InputGroup>
                </Col>
              </Col>
              <Col sm={4}>
                <Form.Label style={{ color: "#000000" }}>
                  スキール情報
                </Form.Label>
                <Col>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        日本語
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      onChange={this.valueChange}
                      size="sm"
                      name="japaneseLevelCode"
                      value={japaneseLevelCode}
                      autoComplete="off"
                      id="japaneaseLevelCodeId"
                    >
                      {this.state.japaneaseLevelCodes.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        英語
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      onChange={this.valueChange}
                      size="sm"
                      name="englishLevelCode"
                      value={englishLevelCode}
                      autoComplete="off"
                      id="englishLeveCodeId"
                    >
                      {this.state.englishLeveCodes.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        資格
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      name="certification1"
                      onChange={this.valueChange}
                      value={certification1}
                      autoComplete="off"
                    >
                      {this.state.qualification.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      name="certification2"
                      onChange={this.valueChange}
                      value={certification2}
                      autoComplete="off"
                    >
                      {this.state.qualification.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        開発言語
                      </InputGroup.Text>
                    </InputGroup.Prepend>

                    <Autocomplete
                      className="fx1"
                      id="developLanguage1"
                      name="developLanguage1"
                      value={
                        this.state.developLanguageMaster.find(
                          (v) => v.code === this.state.developLanguage1
                        ) || {}
                      }
                      onChange={(event, values) =>
                        this.getDevelopLanguage1(event, values)
                      }
                      options={this.state.developLanguageMaster}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="  開発言語1"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-employeeInsert-developLanguage w100p"
                            id="developLanguage1"
                          />
                        </div>
                      )}
                    />

                    <Autocomplete
                      className="fx1"
                      id="developLanguage2"
                      name="developLanguage2"
                      value={
                        this.state.developLanguageMaster.find(
                          (v) => v.code === this.state.developLanguage2
                        ) || {}
                      }
                      onChange={(event, values) =>
                        this.getDevelopLanguage2(event, values)
                      }
                      options={this.state.developLanguageMaster}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="  開発言語2"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-employeeInsert-developLanguage w100p"
                            id="developLanguage2"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm"></InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      className="fx1"
                      id="developLanguage3"
                      name="developLanguage3"
                      value={
                        this.state.developLanguageMaster.find(
                          (v) => v.code === this.state.developLanguage3
                        ) || {}
                      }
                      onChange={(event, values) =>
                        this.getDevelopLanguage3(event, values)
                      }
                      options={this.state.developLanguageMaster}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="  開発言語3"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-employeeInsert-developLanguage w100p"
                            id="developLanguage3"
                          />
                        </div>
                      )}
                    />
                    <Autocomplete
                      className="fx1"
                      id="developLanguage4"
                      name="developLanguage4"
                      value={
                        this.state.developLanguageMaster.find(
                          (v) => v.code === this.state.developLanguage4
                        ) || {}
                      }
                      onChange={(event, values) =>
                        this.getDevelopLanguage4(event, values)
                      }
                      options={this.state.developLanguageMaster}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="  開発言語4"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-employeeInsert-developLanguage w100p"
                            id="developLanguage4"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        フレーム
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      className="fx1"
                      id="frameWork1"
                      name="frameWork1"
                      value={
                        this.state.frameWorkMaster.find(
                          (v) => v.code === this.state.frameWork1
                        ) || {}
                      }
                      onChange={(event, values) =>
                        this.getFrameWork1(event, values)
                      }
                      options={this.state.frameWorkMaster}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="  フレームワーク1"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-employeeInsert-developLanguage w100p"
                            id="frameWork1"
                          />
                        </div>
                      )}
                    />
                    <Autocomplete
                      className="fx1"
                      id="frameWork2"
                      name="frameWork2"
                      value={
                        this.state.frameWorkMaster.find(
                          (v) => v.code === this.state.frameWork2
                        ) || {}
                      }
                      onChange={(event, values) =>
                        this.getFrameWork2(event, values)
                      }
                      options={this.state.frameWorkMaster}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="  フレームワーク2"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-employeeInsert-developLanguage w100p"
                            id="frameWork2"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Form.Label style={{ color: "#000000" }}>住所情報</Form.Label>
                <Col>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        郵便番号
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={postcode}
                      autoComplete="off"
                      onChange={this.valueChange}
                      onBlur={this.postApi.bind(this)}
                      size="sm"
                      name="postcode"
                      id="postcode"
                      maxlength="7"
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        都道府県
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      autoComplete="off"
                      size="sm"
                      id="firstHalfAddress"
                      value={firstHalfAddress}
                      ref="firstHalfAddress"
                      disabled
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        以降住所
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="以降住所"
                      value={lastHalfAddress}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="lastHalfAddress"
                      maxlength="50"
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        最寄駅
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      className="fx1"
                      id="stationCode"
                      name="stationCode"
                      value={
                        this.state.station.find(
                          (v) => v.code === this.state.stationCode
                        ) || {}
                      }
                      onChange={(event, values) =>
                        this.getStationCode(event, values)
                      }
                      options={this.state.station}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder=" 例：秋葉原駅"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-emp-station w100p"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Autocomplete
                  id="developLanguage5"
                  name="developLanguage5"
                  hidden
                  value={
                    this.state.developLanguageMaster.find(
                      (v) => v.code === this.state.developLanguage5
                    ) || {}
                  }
                  onChange={(event, values) =>
                    this.getDevelopLanguage5(event, values)
                  }
                  options={this.state.developLanguageMaster}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder="  開発言語5"
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-employeeInsert-developLanguage"
                        id="developLanguage5"
                      />
                    </div>
                  )}
                />
              </Col>
              <Col sm={4}>
                <Form.Label style={{ color: "#000000" }}>
                  個人関連情報
                </Form.Label>
                <Col>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sevenKanji">
                        在留資格{" "}
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChangeResidenceCodeFormCode}
                      name="residenceCode"
                      value={residenceCode}
                      autoComplete="off"
                      disabled={
                        employeeStatus === "1" ||
                        employeeStatus === "4" ||
                        nationalityCode === "5"
                          ? true
                          : false
                      }
                    >
                      {this.state.residenceCodes.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sevenKanji">
                        在留カード番号
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="在留カード番号"
                      value={residenceCardNo}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="residenceCardNo"
                      maxlength="12"
                      disabled={
                        this.state.residenceCode === "3" ||
                        this.state.residenceCode === "6" ||
                        employeeStatus === "1" ||
                        employeeStatus === "4"
                          ? true
                          : false
                      }
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="empinsert-right-kanji">
                        在留カード
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={this.state.stayPeriod}
                      onChange={this.inactiveStayPeriod}
                      locale="ja"
                      dateFormat="yyyy/MM/dd"
                      className="form-control form-control-sm"
                      yearDropdownItemNumber={10}
                      scrollableYearDropdown
                      showYearDropdown
                      autoComplete="off"
                      minDate={new Date()}
                      disabled={
                        residenceTimeDisabled ||
                        this.state.residenceCode === "3" ||
                        this.state.residenceCode === "6" ||
                        employeeStatus === "1" ||
                        employeeStatus === "4"
                          ? true
                          : false
                      }
                      id={
                        residenceTimeDisabled ||
                        this.state.residenceCode === "3" ||
                        this.state.residenceCode === "6" ||
                        employeeStatus === "1" ||
                        employeeStatus === "4"
                          ? "datePickerReadonlyDefault-empInsert-right-stayPeriod"
                          : "datePicker-empInsert-right-stayPeriod"
                      }
                    />
                    <Button
                      size="sm"
                      style={
                        this.state.residentCardInfoURL !== "" ||
                        this.state.residentCardInfo !== undefined
                          ? {
                              backgroundColor: "#53A100",
                              border: "none",
                              marginLeft: "3px",
                            }
                          : {
                              backgroundColor: "",
                              border: "none",
                              marginLeft: "3px",
                            }
                      }
                      onClick={(event) => this.addFile(event, "resumeInfo2")}
                      className="uploadButtom"
                      onClick={(event) =>
                        this.addFile(event, "residentCardInfo")
                      }
                      disabled={
                        employeeStatus === "1" || employeeStatus === "4"
                          ? true
                          : false
                      }
                    >
                      <FontAwesomeIcon icon={faFile} />{" "}
                      {this.state.residentCardInfoURL !== "" ||
                      this.state.residentCardInfo !== undefined
                        ? "済み"
                        : "添付"}
                    </Button>
                    {/*<Button size="sm" style={{ marginLeft: "3px"}} disabled={this.state.residentCardInfoURL === "" ? true:false} className="downloadButtom" onClick={publicUtils.handleDownload.bind(this, this.state.residentCardInfoURL, this.state.serverIP)} ><FontAwesomeIcon icon={faDownload} /> download</Button>*/}
                    <Button
                      size="sm"
                      style={{ marginLeft: "3px", border: "none" }}
                      disabled={
                        this.state.residentCardInfoURL !== "" ||
                        this.state.residentCardInfo !== undefined
                          ? false
                          : true
                      }
                      className="uploadButtom"
                      onClick={this.deleteFile.bind(this, "residentCardInfo")}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      削除
                    </Button>
                    <Form.File
                      className="hidden-item "
                      id="residentCardInfo"
                      hidden
                      data-browse="添付"
                      value={this.state.residentCardInfo}
                      custom
                      onChange={(event) =>
                        this.changeFile(event, "residentCardInfo")
                      }
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="empinsert-right-kanji">
                        パスポート
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={this.state.passportStayPeriod}
                      onChange={this.passportStayPeriodChange}
                      locale="ja"
                      dateFormat="yyyy/MM/dd"
                      className="form-control form-control-sm"
                      yearDropdownItemNumber={10}
                      scrollableYearDropdown
                      showYearDropdown
                      autoComplete="off"
                      minDate={new Date()}
                      disabled={
                        residenceTimeDisabled ||
                        employeeStatus === "1" ||
                        employeeStatus === "4"
                          ? true
                          : false
                      }
                      id={
                        residenceTimeDisabled ||
                        employeeStatus === "1" ||
                        employeeStatus === "4"
                          ? "datePickerReadonlyDefault-empInsert-right-stayPeriod"
                          : "datePicker-empInsert-right-stayPeriod"
                      }
                    />
                    <Button
                      size="sm"
                      style={
                        this.state.passportInfoURL !== "" ||
                        this.state.passportInfo !== undefined
                          ? {
                              backgroundColor: "#53A100",
                              border: "none",
                              marginLeft: "3px",
                            }
                          : {
                              backgroundColor: "",
                              border: "none",
                              marginLeft: "3px",
                            }
                      }
                      className="uploadButtom"
                      onClick={(event) => this.addFile(event, "passportInfo")}
                      disabled={
                        employeeStatus === "1" || employeeStatus === "4"
                          ? true
                          : false
                      }
                    >
                      <FontAwesomeIcon icon={faFile} />{" "}
                      {this.state.passportInfoURL !== "" ||
                      this.state.passportInfo !== undefined
                        ? "済み"
                        : "添付"}
                    </Button>
                    {/*<Button size="sm" style={{ marginLeft: "3px"}} disabled={this.state.passportInfoURL === "" ? true:false} className="downloadButtom" onClick={publicUtils.handleDownload.bind(this, this.state.passportInfoURL, this.state.serverIP)} ><FontAwesomeIcon icon={faDownload} /> download</Button>*/}
                    <Button
                      size="sm"
                      style={{ marginLeft: "3px", border: "none" }}
                      disabled={
                        this.state.passportInfoURL !== "" ||
                        this.state.passportInfo !== undefined
                          ? false
                          : true
                      }
                      className="uploadButtom"
                      onClick={this.deleteFile.bind(this, "passportInfo")}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      削除
                    </Button>
                    <Form.File
                      className="hidden-item "
                      id="passportInfo"
                      hidden
                      data-browse="添付"
                      value={this.state.passportInfo}
                      custom
                      onChange={(event) =>
                        this.changeFile(event, "passportInfo")
                      }
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sevenKanji">
                        パスポート番号
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="パスポート番号"
                      value={passportNo}
                      autoComplete="off"
                      disabled={
                        employeeStatus === "1" || employeeStatus === "4"
                          ? true
                          : false
                      }
                      onChange={this.valueChange}
                      size="sm"
                      name="passportNo"
                      maxlength="9"
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sevenKanji">
                        マイナンバー
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="マイナンバー"
                      value={myNumber}
                      autoComplete="off"
                      disabled={
                        employeeStatus === "1" || employeeStatus === "4"
                          ? true
                          : false
                      }
                      onChange={this.valueChange}
                      size="sm"
                      name="myNumber"
                      maxlength="12"
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sevenKanji">
                        雇用保険加入
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChangeEmployeeInsuranceStatus}
                      name="employmentInsurance"
                      value={employmentInsurance}
                      disabled={
                        employeeStatus === "2" ||
                        employeeStatus === "1" ||
                        employeeStatus === "4"
                          ? true
                          : false
                      }
                      autoComplete="off"
                    >
                      {this.state.employmentInsuranceStatus.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="twoKanji">番号</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="雇用保険番号"
                      value={employmentInsuranceNo}
                      autoComplete="off"
                      disabled={employmentInsurance === "1" ? false : true}
                      onChange={this.valueChange}
                      size="sm"
                      name="employmentInsuranceNo"
                      maxlength="13"
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sevenKanji">
                        社会保険加入
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      hidden
                      onChange={this.valueChangesocialInsuranceStatus}
                      name="socialInsurance"
                      value={socialInsurance}
                      autoComplete="off"
                    >
                      {this.state.socialInsuranceStatus.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.socialInsuranceDate}
                        onChange={this.socialInsuranceDateChange}
                        locale="ja"
                        dateFormat="yyyy/MM/dd"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        disabled={
                          residenceTimeDisabled ||
                          employeeStatus === "2" ||
                          employeeStatus === "1" ||
                          employeeStatus === "4"
                            ? true
                            : false
                        }
                        id={
                          residenceTimeDisabled ||
                          employeeStatus === "2" ||
                          employeeStatus === "1" ||
                          employeeStatus === "4"
                            ? "datePickerReadonlyDefault-empInsert-right-socialInsuranceDate"
                            : "datePicker-empInsert-right-socialInsuranceDate"
                        }
                      />
                    </InputGroup.Append>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="twoKanji">番号</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="整理番号"
                      value={socialInsuranceNo}
                      autoComplete="off"
                      onChange={this.valueChange}
                      size="sm"
                      name="socialInsuranceNo"
                      maxlength="13"
                      disabled={socialInsurance === "1" ? false : true}
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        出入国届
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="startKanji">開始</InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.immigrationStartTime}
                        onChange={this.immigrationStartTimeChange}
                        locale="ja"
                        dateFormat="yyyy/MM"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        className="form-control form-control-sm"
                        autoComplete="off"
                        disabled={
                          employeeStatus === "1" || employeeStatus === "4"
                            ? true
                            : false
                        }
                        id={
                          employeeStatus === "1" || employeeStatus === "4"
                            ? "datePickerReadonlyDefault-empInsert-right-socialInsuranceDate"
                            : "datePicker-empInsert-right-socialInsuranceDate"
                        }
                      />
                    </InputGroup.Append>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="twoKanji">終了</InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={this.state.immigrationEndTime}
                      onChange={this.immigrationEndTimeChange}
                      locale="ja"
                      dateFormat="yyyy/MM"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      className="form-control form-control-sm w100p"
                      autoComplete="off"
                      disabled={
                        employeeStatus === "1" || employeeStatus === "4"
                          ? true
                          : false
                      }
                      id={
                        employeeStatus === "1" || employeeStatus === "4"
                          ? "datePickerReadonlyDefault-empInsert-right-immigrationTime"
                          : "datePicker-empInsert-right-immigrationTime"
                      }
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sevenKanji">
                        退職年月日
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.retirementYearAndMonth}
                        onChange={this.inactiveRetirementYearAndMonth}
                        locale="ja"
                        dateFormat="yyyy/MM/dd"
                        className="form-control form-control-sm"
                        disabled={
                          !retirementYearAndMonthDisabled ||
                          employeeStatus === "1" ||
                          employeeStatus === "4"
                            ? true
                            : false
                        }
                        autoComplete="off"
                        id={
                          !retirementYearAndMonthDisabled ||
                          employeeStatus === "1" ||
                          employeeStatus === "4"
                            ? "datePickerReadonlyDefault-empInsert-right-immigrationTime"
                            : "datePicker-empInsert-right-immigrationTime"
                        }
                      />
                    </InputGroup.Append>
                    <FormControl
                      name="temporary_retirementYearAndMonth"
                      value={temporary_retirementYearAndMonth}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      disabled
                      hidden
                    />

                    <InputGroup.Prepend>
                      <InputGroup.Text id="twoKanji">区分</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="retirementResonClassificationCode"
                      value={retirementResonClassificationCode}
                      autoComplete="off"
                      disabled={
                        !retirementYearAndMonthDisabled ||
                        employeeStatus === "1" ||
                        employeeStatus === "4"
                          ? true
                          : false
                      }
                    >
                      {this.state.retirementResonClassificationCodes.map(
                        (date) => (
                          <option key={date.code} value={date.code}>
                            {date.name}
                          </option>
                        )
                      )}
                    </Form.Control>
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
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											className="form-control form-control-sm"
											autoComplete="off"
											minDate={new Date()}
											disabled={residenceTimeDisabled ? true : false}
											id={residenceTimeDisabled ? "datePickerReadonlyDefault" : "datePicker"}
										/>
									</InputGroup.Append>
									<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
						</Row>*/}

            <div style={{ textAlign: "center" }}>
              <Button
                size="sm"
                variant="info"
                onClick={this.updateEmployee}
                type="button"
                on
              >
                <FontAwesomeIcon icon={faEdit} /> 更新
              </Button>{" "}
              <Button size="sm" variant="info" type="reset">
                <FontAwesomeIcon icon={faUndo} /> リセット
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                type="button"
                onClick={this.back}
              >
                <FontAwesomeIcon icon={faLevelUpAlt} /> 戻る
              </Button>
            </div>
            <div className="loadingImageContainer">
              <div className="loadingImage" hidden={this.state.loading}></div>
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default employeeUpdateNew;
