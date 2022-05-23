import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Form,
  Button,
  Col,
  Row,
  InputGroup,
  Modal,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import {
  faGlasses,
  faEnvelope,
  faUserPlus,
  faLevelUpAlt,
  faTrash,
  faFile,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import * as publicUtils from "./utils/publicUtils.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DatePicker from "react-datepicker";
import MailConfirm from "./mailConfirm";
import store from "./redux/store";
import SalesEmpAddPopup from "./salesEmpAddPopup";
import $ from "jquery";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import "./autocompleteInput.css";
import { message as myMessage, Select } from "antd";
axios.defaults.withCredentials = true;
/**
 * 営業送信お客確認画面
 */
class sendLettersConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.valueChange = this.valueChange.bind(this);
    this.titleValueChange = this.titleValueChange.bind(this);
    this.state = this.initialState; // 初期化
  }

  // 初期化変数
  initialState = {
    selectedCusInfoIndex: "",
    confirmModalData: {},
    inputEmployeeName: "",
    resumePath: "",
    resumeName: "",
    selectedmail: "",
    selectedEmps: "",
    mailTitle: "",
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    selectedEmpNos: this.props.location.state?.salesPersons,
    selectedCusInfos: this.props.location.state?.targetCusInfos,
    employeeInfo: [],
    employeeInfoAdd: [],
    employeeName: "",
    hopeHighestPrice: "",
    nationalityName: "",
    greetinTtext:
      "弊社営業中要員をご提案致します。見合う案件が御座いましたら、ご連絡頂けますと幸いです。",
    birthday: "",
    stationName: "",
    developLanguage: "",
    yearsOfExperience: "",
    japaneseLevelName: "",
    beginMonth: "",
    salesProgressCode: "",
    remark: "",
    myToastShow: false, // 状態ダイアログ
    employeeNo: this.props.empNo,
    genderStatus: "",
    age: "",
    nearestStation: "",
    employeeStatus: "",
    japaneseLevelCode: "",
    englishLevelCode: "",
    japaneseLevellabal: "",
    englishLevellabal: "",
    siteRoleCode: "",
    siteRoleName: "",
    unitPrice: "",
    addDevelopLanguage: "",
    developLanguageCode6: null,
    developLanguageCode7: null,
    developLanguageCode8: null,
    developLanguageCode9: null,
    developLanguageCode10: null,
    genders: store.getState().dropDown[0].slice(1),
    employees: store.getState().dropDown[4].slice(1),
    japaneseLevels: store.getState().dropDown[5].slice(1),
    englishLevels: store.getState().dropDown[13].slice(1),
    salesProgresss: store.getState().dropDown[16].slice(1),
    japaneaseConversationLevels: store.getState().dropDown[43].slice(1),
    englishConversationLevels: store.getState().dropDown[44].slice(1),
    projectPhases: store.getState().dropDown[45].slice(1),
    stations: store.getState().dropDown[14].slice(1),
    developLanguages: store.getState().dropDown[8].slice(1),
    developLanguagesShow: store.getState().dropDown[8].slice(1),
    frameWorks: store.getState().dropDown[71].slice(1),
    employeeStatusS: store.getState().dropDown[4].slice(1),
    positions: store.getState().dropDown[20],
    wellUseLanguagss: [],
    resumeInfoList: [],
    stationCode: "",
    disbleState: false,
    japaneaseConversationLevel: "",
    englishConversationLevel: "",
    projectPhaseCode: "0",
    empSelectedFlag: false,
    ctmSelectedFlag: false,
    selectedCustomerName: "",
    selectedPurchasingManagers: "",
    projectPhaseName: "",
    initAge: "",
    initNearestStation: "",
    initJapaneaseConversationLevel: "",
    initEnglishConversationLevel: "",
    initYearsOfExperience: "",
    initDevelopLanguageCode6: null,
    initDevelopLanguageCode7: null,
    initDevelopLanguageCode8: null,
    initDevelopLanguageCode9: null,
    initDevelopLanguageCode10: null,
    initUnitPrice: "",
    initRemark: "",
    disableFlag: true,
    initWellUseLanguagss: [],
    dialogShowFlag: false,
    selectRow1Flag: false,
    selectRowFlag: false,
    mails: [],
    loginUserInfo: [],
    appendEmps: [],
    selectedMailCC: [],
    popupFlag: true,
    backPage: "",
    searchFlag: true,
    sendValue: {},
    mailContent: "",
    /* 要員追加機能の新規 20201216 張棟 START */
    // 全部要員名前集合
    allEmployeeName: [],
    // 全部要員集合
    allEmployeeNameInfo: [],
    // 画面遷移初期化:true,要員追加ボタンを押下した:false
    initFlg: true,
    // 要員一覧テーブルのindex
    EmployeeNameIndex: 0,
    // ページ数
    currentPage: 1,
    currentPage2: 1,
    // 選択されたのindex
    selectedColumnId: 0,
    // 提示情報
    errorsMessageShow: false,
    errorsMessageValue: "",
    message: "",
    type: "",
    // 履歴書のパス
    resumeInfo1: "",
    // 履歴書のテキスト名
    resumeInfo1Name: "",
    //
    employeeFlag: true,
    // 送信ボタン活性
    sendLetterButtonDisFlag: true,
    /* 要員追加機能の新規 20201216 張棟 END */
    sendLetterOverFlag: false,
    titleFlag: false,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.setNewDevelopLanguagesShow();
    if (
      this.props.location.state !== null &&
      this.props.location.state !== undefined &&
      this.props.location.state !== ""
    ) {
      this.setState({
        sendValue: this.props.location.state.sendValue,
        backPage: this.props.location.state.backPage,
        backbackPage: this.props.location.state.backbackPage,
        projectNo: this.props.location.state.projectNo,
      });
    }
    /* 要員追加機能の新規 20201216 張棟 START */
    // 営業状況確認一覧画面から選択された送信要員がある
    if (
      this.state.selectedEmpNos !== "" &&
      this.state.selectedEmpNos !== null &&
      this.state.selectedEmpNos !== undefined
    ) {
      // 選択された送信要員の詳細データを取る
      this.searchEmpDetail();
    }
    /* 要員追加機能の新規 20201216 張棟 END */
    // メールデータが取る
    this.getMail();
    this.getLoginUserInfo();
    this.getAllEmpsWithResume();
    /* 要員追加機能の新規 20201216 張棟 START */
    // 画面初期化する時、全部要員のデータを取る
    this.getAllEmployInfoName();
    /* 要員追加機能の新規 20201216 張棟 END */
    $("#deleteButton").attr("disabled", true);
    $("#bookButton").attr("disabled", true);

    if (this.state.employeeInfo.length === 0) {
      this.setState({
        employeeFlag: false,
      });
    }
    this.setSelectedCusInfos("未");
  }

  setSelectedCusInfos = (text) => {
    let selectedCusInfos = this.props.location.state?.targetCusInfos;
    for (let i = 0; i < selectedCusInfos?.length; i++) {
      selectedCusInfos[i].rowNo = i + 1;
      selectedCusInfos[i].sendOver = text;
    }
    this.setState({
      selectedCusInfos: selectedCusInfos,
    });
  };

  setNewDevelopLanguagesShow = () => {
    let developLanguagesTemp = [];
    for (let i = 0; i < this.state.developLanguagesShow.length; i++) {
      developLanguagesTemp.push(this.state.developLanguagesShow[i]);
    }
    let frameWorkTemp = [];
    for (let i = 0; i < this.state.frameWorks.length; i++) {
      developLanguagesTemp.push({
        code: String((Number(this.state.frameWorks[i].code) + 1) * -1),
        name: this.state.frameWorks[i].name,
      });
    }
    let employees = [];
    for (let i in this.state.employees) {
      if (this.state.employees[i].name === "協力") {
        employees.push({
          code: this.state.employees[i].code,
          name: "1社先の社員",
        });
      } else {
        employees.push(this.state.employees[i]);
      }
    }
    this.setState({
      developLanguages: developLanguagesTemp,
      employees: employees,
    });
  };

  /* 要員追加機能の新規 20201216 張棟 START */
  getAllEmployInfoName = () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getAllEmployInfoName")
      .then((result) => {
        // 全部要員名前集合
        let arr = [];
        if (result.data.length !== 0) {
          arr[0] = "入力";
          for (let i = 0; i < result.data.length; i++) {
            arr[i + 1] = result.data[i].employeeName;
          }
        }
        this.setState({
          // 全部所属
          allEmployeeName: arr,
          allEmployeeNameInfo: result.data,
          // 履歴書
        });
      })
      .catch(function (error) {
        alert(error);
      });
  };
  /* 要員追加機能の新規 20201216 張棟 END */

  // 共用CCメールを操作
  onTagsChange = (event, values, fieldName) => {
    if (values.length === 2) {
      this.setState({
        disbleState: true,
      });
    } else {
      this.setState({
        disbleState: false,
      });
    }
    this.setState({
      selectedMailCC: [
        this.fromMailToEmp(values.length >= 1 ? values[0].companyMail : ""),
        this.fromMailToEmp(values.length >= 2 ? values[1].companyMail : ""),
      ].filter(function (s) {
        return s;
      }),
    });
  };

  fromMailToEmp = (mail) => {
    if (mail === "" || mail === null) {
      return "";
    } else {
      return this.state.mails.find((v) => v.companyMail === mail);
    }
  };

  getMail = () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getMail")
      .then((result) => {
        this.setState({
          mails: result.data,
        });
      })
      .catch(function (error) {
        //alert(error);
      });
  };

  getFinalResume = ({
    resumeInfoName,
    resumeName1,
    resumeName2,
    resumeInfo1,
    resumeInfo2,
    newResumeName,
    index,
  }) => {
    let obj = { name: resumeInfoName };

    switch (resumeInfoName) {
      case resumeName1:
        obj.type = "url";
        obj.value = resumeInfo1;
        break;
      case resumeName2:
        obj.type = "url";
        obj.value = resumeInfo2;
        break;
      case newResumeName:
        obj.type = "file";
        obj.value = publicUtils.nullToEmpty(
          $(`#newResume${index - 1}`)?.get(0)?.files[0]
        );
        break;

      default:
        break;
    }
    return obj;
  };

  // 获取mailText resumeNameList resumePathList resumeFileList（调用接口）
  getMailTextAndList = async () => {
    const {
      employeeInfo,
      englishConversationLevels,
      salesProgresss,
      japaneaseConversationLevels,
      genders,
      serverIP,
      employees,
      stations,
    } = this.state;
    let mailText = ``; // 技术人员信息
    let resumeNameList = []; // 简历名称列表
    let resumePathList = []; // 简历路径列表
    let resumeFileList = []; // 新上传的简历file列表
    let resumeResults = [];
    for (let i = 0; i < employeeInfo.length; i++) {
      const item = employeeInfo[i];
      let resumeResult = this.getFinalResume(item);
      resumeResults.push(resumeResult);
      resumeNameList.push(resumeResult.name);
      if (resumeResult.type === "url") {
        resumePathList.push(resumeResult.value);
      } else {
        resumeFileList.push(resumeResult.value);
      }

      // 生成mailText
      if (item.employeeNo) {
        // 系统中要员
        let result = await axios.post(
          serverIP + "salesSituation/getPersonalSalesInfo",
          {
            employeeNo: String(item.employeeNo),
          }
        );
        // 如果编辑过了就用编辑的
        if (!item.mailContent) {
          mailText +=
            `
【名　　前】：` +
            result.data[0].employeeFullName +
            `　` +
            result.data[0].nationalityName +
            `　` +
            genders.find((v) => v.code === result.data[0].genderStatus).name +
            `
【所　　属】：` +
            (result.data[0].employeeStatus === null ||
            result.data[0].employeeStatus === ""
              ? ""
              : employees.find((v) => v.code === result.data[0].employeeStatus)
                  .name) +
            (result.data[0].age === null || result.data[0].age === ""
              ? publicUtils.converToLocalTime(result.data[0].birthday, true) ===
                ""
                ? ""
                : `
【年　　齢】：`
              : `
【年　　齢】：`) +
            (result.data[0].age === null || result.data[0].age === ""
              ? publicUtils.converToLocalTime(result.data[0].birthday, true) ===
                ""
                ? ""
                : Math.ceil(
                    (new Date().getTime() -
                      publicUtils
                        .converToLocalTime(result.data[0].birthday, true)
                        .getTime()) /
                      31536000000
                  ) + `歳`
              : result.data[0].age + `歳`) +
            (result.data[0].nearestStation === null ||
            result.data[0].nearestStation === ""
              ? ""
              : `
【最寄り駅】：`) +
            (result.data[0].nearestStation === null ||
            result.data[0].nearestStation === ""
              ? ""
              : stations.find((v) => v.code === result.data[0].nearestStation)
                  .name) +
            (result.data[0].japaneaseConversationLevel === null ||
            result.data[0].japaneaseConversationLevel === ""
              ? ""
              : `
【日本　語】：`) +
            (result.data[0].japaneaseConversationLevel === null ||
            result.data[0].japaneaseConversationLevel === ""
              ? ""
              : japaneaseConversationLevels.find(
                  (v) => v.code === result.data[0].japaneaseConversationLevel
                ).name) +
            (result.data[0].englishConversationLevel === null ||
            result.data[0].englishConversationLevel === ""
              ? ""
              : `
【英　　語】：`) +
            (result.data[0].englishConversationLevel === null ||
            result.data[0].englishConversationLevel === ""
              ? ""
              : englishConversationLevels.find(
                  (v) => v.code === result.data[0].englishConversationLevel
                ).name) +
            (result.data[0].yearsOfExperience === null ||
            result.data[0].yearsOfExperience === ""
              ? ""
              : `
【業務年数】：`) +
            (result.data[0].yearsOfExperience === null ||
            result.data[0].yearsOfExperience === ""
              ? ""
              : result.data[0].yearsOfExperience + `年`) +
            (result.data[0].projectPhase === null ||
            result.data[0].projectPhase === ""
              ? ""
              : `
【対応工程】：`) +
            (result.data[0].projectPhase === null ||
            result.data[0].projectPhase === ""
              ? ""
              : result.data[0].projectPhaseName + " から") +
            (result.data[0].developLanguage === null ||
            result.data[0].developLanguage === ""
              ? ""
              : `
【得意言語】：`) +
            (result.data[0].developLanguage === null ||
            result.data[0].developLanguage === ""
              ? ""
              : result.data[0].developLanguage) +
            ((item.hopeHighestPrice === null || item.hopeHighestPrice === "") &&
            (result.data[0].unitPrice === null ||
              result.data[0].unitPrice === "")
              ? ""
              : `
【単　　価】：`) +
            ((item.hopeHighestPrice === null || item.hopeHighestPrice === ""
              ? ""
              : this.formatUnitePrice(item.hopeHighestPrice)) === ""
              ? result.data[0].unitPrice === null ||
                result.data[0].unitPrice === ""
                ? ""
                : this.formatUnitePrice(result.data[0].unitPrice)
              : this.formatUnitePrice(item.hopeHighestPrice)) +
            (result.data[0].theMonthOfStartWork === undefined ||
            result.data[0].theMonthOfStartWork === "" ||
            result.data[0].theMonthOfStartWork === null
              ? ""
              : `
【稼働開始】：`) +
            (result.data[0].theMonthOfStartWork === undefined ||
            result.data[0].theMonthOfStartWork === "" ||
            result.data[0].theMonthOfStartWork === null
              ? ""
              : result.data[0].theMonthOfStartWork) +
            (result.data[0].salesProgressCode === null ||
            result.data[0].salesProgressCode === ""
              ? ""
              : `
【営業状況】：`) +
            (result.data[0].salesProgressCode === null ||
            result.data[0].salesProgressCode === ""
              ? ""
              : salesProgresss.find(
                  (v) => v.code === result.data[0].salesProgressCode
                ).name) +
            (result.data[0].remark === null || result.data[0].remark === ""
              ? ""
              : `
【備　　考】：`) +
            (result.data[0].remark === null || result.data[0].remark === ""
              ? ""
              : result.data[0].remark) +
            `
`;
        } else {
          mailText +=
            `
` +
            item.mailContent +
            `
`;
        }
      } else {
        // 新增的要员
        if (!item.mailContent) {
          mailText +=
            `
` +
            this.newEmployeeMailContent(item) +
            `
`;
        } else {
          // 如果编辑过了就用编辑的
          mailText +=
            `
` +
            item.mailContent +
            `
`;
        }
      }
    }
    return {
      mailText,
      resumeNameList,
      resumePathList,
      resumeFileList,
      resumeResults,
    };
  };

  // 获取确认邮件文本
  getMailConfirmContont = ({ selectedCusInfo, mailText }) => {
    let { loginUserInfo, greetinTtext } = this.state;
    return (
      (selectedCusInfo.customerName.split("(")[0].search("株式会社") === -1
        ? selectedCusInfo.customerName.split("(")[0] + `株式会社`
        : selectedCusInfo.customerName.split("(")[0]) +
      ` 
` +
      (selectedCusInfo.purchasingManagers === ""
        ? "ご担当者"
        : selectedCusInfo.purchasingManagers.split("　")[0]) +
      ` 様

お世話になっております、LYC` +
      loginUserInfo[0].employeeFristName +
      `です。

` +
      greetinTtext +
      `
` +
      mailText +
      `以上、よろしくお願いいたします。

*****************************************************************
LYC株式会社 ` +
      loginUserInfo[0].employeeFristName +
      ` ` +
      loginUserInfo[0].employeeLastName +
      `
〒:101-0032 東京都千代田区岩本町3-3-3サザンビル3F
http://www.lyc.co.jp/
TEL：03-6908-5796  携帯：` +
      loginUserInfo[0].phoneNo +
      `(優先）
Email：` +
      loginUserInfo[0].companyMail +
      ` 営業共通：eigyou@lyc.co.jp
労働者派遣事業許可番号　派遣許可番号　派13-306371
ＩＳＭＳ：MSA-IS-385
*****************************************************************`
    );
  };

  // 送信処理请求数据整理 emailModel,resumeFileList
  getSendMailWithFileRequestParams = async (selectedCusInfo) => {
    let {
      mailText,
      resumeNameList,
      resumePathList,
      resumeFileList,
      resumeResults,
    } = await this.getMailTextAndList();
    let { loginUserInfo, mailTitle, selectedMailCC } = this.state;

    let selectedMailCCs = [];
    // 公用CC
    if (selectedMailCC.length !== 0) {
      for (let index = 0; index < selectedMailCC.length; index++) {
        const item = selectedMailCC[index];
        selectedMailCCs.push(item.companyMail);
      }
    }
    // 客户CC
    if (selectedCusInfo?.selectedTanTou?.length > 0) {
      selectedMailCCs = selectedMailCCs.concat(
        selectedCusInfo.selectedTanTou.map(
          (item) => item.customerDepartmentMail
        )
      );
    }
    let emailModel = {
      names: resumeNameList,
      mailTitle,
      paths: resumePathList,
      selectedMailCC: selectedMailCCs,
      mailFrom: loginUserInfo[0].companyMail,
      mailConfirmContont: this.getMailConfirmContont({
        selectedCusInfo: selectedCusInfo,
        mailText,
      }),
      selectedmail: selectedCusInfo.purchasingManagersMail,
      selectedCustomer: selectedCusInfo.customerNo,
    };
    console.log(
      { emailModel, resumeFileList },
      "getSendMailWithFileRequestParams"
    );
    return {
      emailModel,
      resumeFileList,
      resumeResults,
    };
  };

  checkCanSendEmail = () => {
    const { employeeInfo } = this.state;
    for (let index = 0; index < employeeInfo.length; index++) {
      const item = employeeInfo[index];
      if (!item.employeeName) {
        return {
          status: false,
          msg: "要員の名前を入力してください！",
        };
      }
      if (!item.resumeInfoName) {
        return {
          status: false,
          msg: `要員${item.employeeName}の履歴書を選択してください！`,
        };
      }
    }
    return {
      status: true,
    };
  };

  handleSendMailWithFile = async () => {
    try {
      let checkCanSendEmailRes = this.checkCanSendEmail();
      if (!checkCanSendEmailRes.status) {
        myMessage.error(checkCanSendEmailRes.msg);
        return;
      }

      const { selectedCusInfos } = this.state;
      this.setSelectedCusInfos("○");

      // 遍历selectedCusInfos，发送邮件
      for (let i = 0; i < selectedCusInfos.length; i++) {
        let { emailModel, resumeFileList } =
          await this.getSendMailWithFileRequestParams(selectedCusInfos[i]);
        const formData = new FormData();
        if (resumeFileList?.length > 0) {
          resumeFileList.forEach((file, i) => {
            formData.append(`myfiles`, file);
          });
        }

        formData.append(`emailModel`, JSON.stringify(emailModel));
        let result = await axios.post(
          this.state.serverIP + "sendLettersConfirm/sendMailWithFile",
          formData
        );

        if (result.data.errorsMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
          setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
          this.setSelectedCusInfos("X");
        } else {
          this.setSelectedCusInfos("済み");
          this.setState({
            sendLetterOverFlag: true,
          });
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  getLoginUserInfo = () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        this.setState({
          loginUserInfo: result.data,
        });
      })
      .catch(function (error) {
        //myMessage.error(error);
      });
  };

  getAllEmpsWithResume = () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getAllEmpsWithResume")
      .then((result) => {
        this.setState({
          appendEmps: result.data,
        });
      })
      .catch(function (error) {
        //myMessage.error(error);
      });
  };

  /**
   * @param now
   *            当前日期 格式:yyyy-MM
   * @param addMonths
   *            传-1 上个月,传1 下个月
   */
  getNextMonth = (addMonths) => {
    let dd = new Date();
    let m = dd.getMonth() + 1;
    let y =
      dd.getMonth() + 1 + addMonths > 12
        ? dd.getFullYear() + 1
        : dd.getFullYear();
    if (m + addMonths == 0) {
      y = y - 1;
      m = 12;
    } else {
      if (m + addMonths > 12) {
        m = "01";
      } else {
        m = m + 1 < 10 ? "0" + (m + addMonths) : m + addMonths;
      }
    }
    return y + "/" + m;
  };

  fromCodeToNameLanguage = (code) => {
    if (code === "" || code === null) {
      return;
    } else {
      return this.state.developLanguages.find((v) => v.code === code).name;
    }
  };

  fromCodeToListLanguage = (code) => {
    if (code === "" || code === null) {
      return "";
    } else {
      return this.state.developLanguages.find((v) => v.code === code);
    }
  };

  openDaiolog = async () => {
    let { emailModel, resumeResults } =
      await this.getSendMailWithFileRequestParams(
        this.state.selectedCusInfos[this.state.selectedCusInfoIndex]
      );
    this.setState({
      confirmModalData: { emailModel, resumeResults },
      dialogShowFlag: true,
    });
  };

  beforeSaveCell = (row, cellName, cellValue) => {
    if (cellValue.length > 7 || Number.isNaN(cellValue)) {
      myMessage.error("入力された単価は合理的ではありません！");
      return false;
    }
  };

  onAfterSaveCell = (row, cellName, cellValue) => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/updateSalesSentence", {
        employeeNo: row.employeeNo,
        unitPrice: cellValue,
      })
      .then((result) => {
        const { employeeInfo } = this.state;
        employeeInfo[row.index - 1].unitPrice = cellValue;
        this.setState({
          employeeInfo,
          unitPrice: cellValue,
        });
      })
      .catch(function (error) {
        alert(error);
      });
  };

  getHopeHighestPrice = (result) => {
    let { employeeInfo } = this.state;
    for (let i = 0; i < employeeInfo.length; i++) {
      employeeInfo[i].hopeHighestPrice = result.data[i].unitPrice;
    }

    this.setState({
      employeeInfo,
    });
  };

  customerNameFormat = (cell) => {
    return <div title={cell}>{cell}</div>;
  };

  positionNameFormat = (cell) => {
    let positionsTem = this.state.positions;
    for (let i in positionsTem) {
      if (cell === positionsTem[i].code) {
        return positionsTem[i].name;
      }
    }
  };
  purchasingManagersOthersFormat = (cell, row, enumObject, index) => {
    return row.storageListName
      ? row.salesPersonsAppend
      : row.purchasingManagersOthers;
  };

  sendOverFormat = (cell) => {
    if (cell === "○") return <div className="donut"></div>;
    else if (cell === "X")
      return <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />;
    else if (cell === "済み")
      return <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />;
    return cell;
  };

  // 根据employeeNo获取要员信息。
  searchPersonnalDetail = (
    employeeNo,
    hopeHighestPrice,
    index,
    mailContent
  ) => {
    let { employeeInfo } = this.state;
    if (!employeeNo) {
      return;
    }
    axios
      .post(this.state.serverIP + "salesSituation/getPersonalSalesInfo", {
        employeeNo: employeeNo,
      })
      .then((result) => {
        if (index != undefined) {
          employeeInfo[index - 1].resumeInfo1 = result.data[0].resumeInfo1;
          employeeInfo[index - 1].resumeName1 = result.data[0].resumeName1;
          employeeInfo[index - 1].resumeInfo2 = result.data[0].resumeInfo2;
          employeeInfo[index - 1].resumeName2 = result.data[0].resumeName2;
          employeeInfo[index - 1].hopeHighestPrice = result.data[0].unitPrice;
          employeeInfo[index - 1].resumeInfoList =
            result.data[0].resumeInfoList;
          if (result.data[0].resumeInfoList.length > 0) {
            employeeInfo[index - 1].resumeInfoName =
              result.data[0].resumeInfoList[0];
          } else {
            employeeInfo[index - 1].resumeInfoName = "";
          }
        }
        if (result.data.length === 0 || result.data[0].age === "") {
          this.setState(
            {
              employeeName: result.data[0].employeeFullName,
              genderStatus: this.state.genders.find(
                (v) => v.code === result.data[0].genderStatus
              ).name,
              nationalityName: result.data[0].nationalityName,
              age:
                publicUtils.converToLocalTime(result.data[0].birthday, true) ===
                ""
                  ? ""
                  : Math.ceil(
                      (new Date().getTime() -
                        publicUtils
                          .converToLocalTime(result.data[0].birthday, true)
                          .getTime()) /
                        31536000000
                    ),
              developLanguage: result.data[0].developLanguage,
              yearsOfExperience: result.data[0].yearsOfExperience,
              beginMonth: new Date("2020/09").getTime(),
              salesProgressCode:
                result.data[0].salesProgressCode === null
                  ? ""
                  : result.data[0].salesProgressCode,
              nearestStation:
                result.data[0].employeeStatus === null
                  ? ""
                  : result.data[0].nearestStation,
              stationCode:
                result.data[0].employeeStatus === null
                  ? ""
                  : result.data[0].nearestStation,
              employeeStatus:
                result.data[0].employeeStatus === null ||
                result.data[0].employeeStatus === ""
                  ? ""
                  : this.state.employees.find(
                      (v) => v.code === result.data[0].employeeStatus
                    ).name,
              japaneseLevelCode:
                result.data[0].japaneseLevelCode === null ||
                result.data[0].japaneseLevelCode === ""
                  ? ""
                  : this.state.japaneseLevels.find(
                      (v) => v.code === result.data[0].japaneseLevelCode
                    ).name,
              englishLevelCode:
                result.data[0].englishLevelCode === null ||
                result.data[0].englishLevelCode === ""
                  ? ""
                  : this.state.englishLevels.find(
                      (v) => v.code === result.data[0].englishLevelCode
                    ).name,
              siteRoleCode:
                result.data[0].siteRoleCode === null ||
                result.data[0].siteRoleCode === ""
                  ? ""
                  : result.data[0].siteRoleCode,
              siteRoleName:
                result.data[0].siteRoleCode === null ||
                result.data[0].siteRoleCode === ""
                  ? ""
                  : result.data[0].siteRoleName,
              projectPhaseName:
                result.data[0].projectPhase === null ||
                result.data[0].projectPhase === ""
                  ? ""
                  : result.data[0].projectPhaseName,
              initAge:
                publicUtils.converToLocalTime(result.data[0].birthday, true) ===
                ""
                  ? ""
                  : Math.ceil(
                      (new Date().getTime() -
                        publicUtils
                          .converToLocalTime(result.data[0].birthday, true)
                          .getTime()) /
                        31536000000
                    ),
              initNearestStation: result.data[0].nearestStation,
              initJapaneaseConversationLevel: "",
              initEnglishConversationLevel: "",
              initYearsOfExperience: result.data[0].yearsOfExperience,
              initDevelopLanguageCode6: null,
              initDevelopLanguageCode7: null,
              initDevelopLanguageCode8: null,
              initDevelopLanguageCode9: null,
              initDevelopLanguageCode10: null,
              initUnitPrice: "",
              initRemark: "",
              initWellUseLanguagss: [],
              unitPrice:
                hopeHighestPrice !== null &&
                hopeHighestPrice !== "" &&
                hopeHighestPrice !== undefined
                  ? hopeHighestPrice
                  : result.data[0].unitPrice,
              employeeInfo:
                index !== undefined ? employeeInfo : this.state.employeeInfo,
              theMonthOfStartWork:
                result.data[0].theMonthOfStartWork === undefined ||
                result.data[0].theMonthOfStartWork === null ||
                result.data[0].theMonthOfStartWork === ""
                  ? ""
                  : result.data[0].theMonthOfStartWork,
              resumeInfoList: result.data[0].resumeInfoList,
              remark: result.data[0].remark,
            },
            () => {
              this.setMailContent(mailContent);
            }
          );
        } else {
          this.setState(
            {
              employeeName: result.data[0].employeeFullName,
              genderStatus: this.state.genders.find(
                (v) => v.code === result.data[0].genderStatus
              ).name,
              nationalityName: result.data[0].nationalityName,
              age: result.data[0].age,
              developLanguageCode6: result.data[0].developLanguage1,
              developLanguageCode7: result.data[0].developLanguage2,
              developLanguageCode8: result.data[0].developLanguage3,
              developLanguageCode9: result.data[0].developLanguage4,
              developLanguageCode10: result.data[0].developLanguage5,
              wellUseLanguagss: [
                this.fromCodeToListLanguage(result.data[0].developLanguage1),
                this.fromCodeToListLanguage(result.data[0].developLanguage2),
                this.fromCodeToListLanguage(result.data[0].developLanguage3),
                this.fromCodeToListLanguage(result.data[0].developLanguage4),
                this.fromCodeToListLanguage(result.data[0].developLanguage5),
              ].filter(function (s) {
                return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
              }),
              // disbleState:
              // this.fromCodeToListLanguage(result.data[0].developLanguage5)
              // === '' ? false : true,
              developLanguage: [
                this.fromCodeToNameLanguage(result.data[0].developLanguage1),
                this.fromCodeToNameLanguage(result.data[0].developLanguage2),
                this.fromCodeToNameLanguage(result.data[0].developLanguage3),
                this.fromCodeToNameLanguage(result.data[0].developLanguage4),
                this.fromCodeToNameLanguage(result.data[0].developLanguage5),
              ]
                .filter(function (s) {
                  return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                })
                .join("、"),
              yearsOfExperience: result.data[0].yearsOfExperience,
              japaneaseConversationLevel:
                result.data[0].japaneaseConversationLevel,
              englishConversationLevel: result.data[0].englishConversationLevel,
              beginMonth: new Date("2020/09").getTime(),
              salesProgressCode:
                result.data[0].salesProgressCode === null
                  ? ""
                  : result.data[0].salesProgressCode,
              // salesProgressCode: result.data[0].salesProgressCode,
              nearestStation:
                result.data[0].employeeStatus === null
                  ? ""
                  : result.data[0].nearestStation,
              stationCode:
                result.data[0].employeeStatus === null
                  ? ""
                  : result.data[0].nearestStation,
              employeeStatus:
                result.data[0].employeeStatus === null ||
                result.data[0].employeeStatus === ""
                  ? ""
                  : this.state.employees.find(
                      (v) => v.code === result.data[0].employeeStatus
                    ).name,
              japaneseLevelCode:
                result.data[0].japaneseLevelCode === null ||
                result.data[0].japaneseLevelCode === ""
                  ? ""
                  : this.state.japaneseLevels.find(
                      (v) => v.code === result.data[0].japaneseLevelCode
                    ).name,
              englishLevelCode:
                result.data[0].englishLevelCode === null ||
                result.data[0].englishLevelCode === ""
                  ? ""
                  : this.state.englishLevels.find(
                      (v) => v.code === result.data[0].englishLevelCode
                    ).name,
              siteRoleCode:
                result.data[0].siteRoleCode === null ||
                result.data[0].siteRoleCode === ""
                  ? ""
                  : result.data[0].siteRoleCode,
              siteRoleName:
                result.data[0].siteRoleCode === null ||
                result.data[0].siteRoleCode === ""
                  ? ""
                  : result.data[0].siteRoleName,
              projectPhaseName:
                result.data[0].projectPhase === null ||
                result.data[0].projectPhase === ""
                  ? ""
                  : result.data[0].projectPhaseName,
              unitPrice:
                hopeHighestPrice !== null &&
                hopeHighestPrice !== "" &&
                hopeHighestPrice !== undefined
                  ? hopeHighestPrice
                  : result.data[0].unitPrice,
              remark: result.data[0].remark,
              initAge: result.data[0].age,
              employeeInfo:
                index !== undefined ? employeeInfo : this.state.employeeInfo,
              initNearestStation: result.data[0].nearestStation,
              initJapaneaseConversationLevel:
                result.data[0].japaneaseConversationLevel,
              initEnglishConversationLevel:
                result.data[0].englishConversationLevel,
              initYearsOfExperience: result.data[0].yearsOfExperience,
              initDevelopLanguageCode6: result.data[0].developLanguage1,
              initDevelopLanguageCode7: result.data[0].developLanguage2,
              initDevelopLanguageCode8: result.data[0].developLanguage3,
              initDevelopLanguageCode9: result.data[0].developLanguage4,
              initDevelopLanguageCode10: result.data[0].developLanguage5,
              initUnitPrice: result.data[0].unitPrice,
              initRemark: result.data[0].remark,
              resumeInfoList: result.data[0].resumeInfoList,
              theMonthOfStartWork:
                result.data[0].theMonthOfStartWork === null ||
                result.data[0].theMonthOfStartWork === ""
                  ? ""
                  : result.data[0].theMonthOfStartWork,
              initWellUseLanguagss: [
                this.fromCodeToListLanguage(result.data[0].developLanguage1),
                this.fromCodeToListLanguage(result.data[0].developLanguage2),
                this.fromCodeToListLanguage(result.data[0].developLanguage3),
                this.fromCodeToListLanguage(result.data[0].developLanguage4),
                this.fromCodeToListLanguage(result.data[0].developLanguage5),
              ].filter(function (s) {
                return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
              }),
            },
            () => {
              this.setMailContent(mailContent);
            }
          );
        }
      })
      .catch(function (error) {
        alert(error);
      });
  };

  initPersonnalDetail = () => {
    this.setState({
      employeeName: "empty",
      genderStatus: "",
      nationalityName: "",
      age: "",
      developLanguage: "",
      yearsOfExperience: "",
      beginMonth: "",
      salesProgressCode: "",
      nearestStation: "",
      stationCode: "",
      employeeStatus: "",
      japaneseLevelCode: "",
      englishLevelCode: "",
      siteRoleCode: "",
      siteRoleName: "",
      initAge: "",
      initNearestStation: "",
      initJapaneaseConversationLevel: "",
      initEnglishConversationLevel: "",
      initYearsOfExperience: "",
      initDevelopLanguageCode6: null,
      initDevelopLanguageCode7: null,
      initDevelopLanguageCode8: null,
      initDevelopLanguageCode9: null,
      initDevelopLanguageCode10: null,
      initUnitPrice: "",
      initRemark: "",
      initWellUseLanguagss: [],
    });
  };

  searchEmpDetail = () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getSalesEmps", {
        employeeNos: this.state.selectedEmpNos,
      })
      .then((result) => {
        this.setState({
          employeeInfo: result.data,
          /* 要員追加機能の新規 20201216 張棟 START */
          // 営業状況確認一覧画面から遷移した後で、要員画面初期化して要員一覧のindex初期化
          EmployeeNameIndex: result.data.length,
          /* 要員追加機能の新規 20201216 張棟 END */
        });
        this.getHopeHighestPrice(result);
      })
      .catch(function (error) {
        alert(error);
      });
    this.searchPersonnalDetail(this.state.selectedEmpNos[0]);
  };

  renderShowsTotal = (start, to, total) => {
    return (
      <p
        style={{
          color: "dark",
          float: "left",
          display: total > 0 ? "block" : "none",
        }}
      >
        {start}から {to}まで , 総計{total}
      </p>
    );
  };

  closeDaiolog = () => {
    this.setState({
      confirmModalData: {},
      dialogShowFlag: false,
    });
  };

  handleCtmSelect = (row, isSelected, e) => {
    this.setState({
      selectedCusInfoIndex: row.rowId,
      selectedCustomerName: isSelected ? row.customerName : "",
      selectedPurchasingManagers: isSelected ? row.purchasingManagers : "",
      // selectedSalesPerson: isSelected ? row.customerName : '',
      selectedmail: isSelected ? row.purchasingManagersMail : "",
    });
    if (isSelected) {
      this.setState({
        selectRow1Flag: true,
      });
    } else {
      this.setState({
        selectRow1Flag: false,
      });
    }
  };

  handleEmpSelect = (row, isSelected, e) => {
    this.setState({
      selectedEmps: row,
    });

    this.searchPersonnalDetail(row.employeeNo);
  };

  setMailContent = (mailContent) => {
    if (mailContent === undefined || mailContent === null) {
      mailContent =
        `【名　　前】：` +
        this.state.employeeName +
        `　` +
        this.state.nationalityName +
        `　` +
        this.state.genderStatus +
        `
【所　　属】：` +
        this.state.employeeStatus +
        (this.state.age !== null && this.state.age !== ""
          ? `
【年　　齢】：`
          : "") +
        (this.state.age !== null && this.state.age !== ""
          ? this.state.age
          : "") +
        (this.state.age !== null && this.state.age !== "" ? `歳` : "") +
        (this.state.nearestStation !== "" && this.state.nearestStation !== null
          ? `
【最寄り駅】：`
          : "") +
        (this.state.nearestStation !== "" && this.state.nearestStation !== null
          ? this.state.stations.find(
              (v) => v.code === this.state.nearestStation
            ).name
          : "") +
        (this.state.japaneaseConversationLevel !== "" &&
        this.state.japaneaseConversationLevel !== null
          ? `
【日本　語】：`
          : "") +
        (this.state.japaneaseConversationLevel !== "" &&
        this.state.japaneaseConversationLevel !== null
          ? this.state.japaneaseConversationLevels.find(
              (v) => v.code === this.state.japaneaseConversationLevel
            ).name
          : "") +
        (this.state.englishConversationLevel !== "" &&
        this.state.englishConversationLevel !== null
          ? `
【英　　語】：`
          : "") +
        (this.state.englishConversationLevel !== "" &&
        this.state.englishConversationLevel !== null
          ? this.state.englishConversationLevels.find(
              (v) => v.code === this.state.englishConversationLevel
            ).name
          : "") +
        (this.state.yearsOfExperience !== null &&
        this.state.yearsOfExperience !== ""
          ? `
【業務年数】：`
          : "") +
        (this.state.yearsOfExperience !== null &&
        this.state.yearsOfExperience !== ""
          ? this.state.yearsOfExperience
          : "") +
        (this.state.yearsOfExperience !== null &&
        this.state.yearsOfExperience !== ""
          ? `年`
          : "") +
        (this.state.projectPhaseName !== "" &&
        this.state.projectPhaseName !== null
          ? `
【対応工程】：`
          : "") +
        (this.state.projectPhaseName !== "" &&
        this.state.projectPhaseName !== null
          ? this.state.projectPhaseName + "から"
          : "") +
        (this.state.developLanguage !== "" &&
        this.state.developLanguage !== null
          ? `
【得意言語】：`
          : "") +
        (this.state.developLanguage !== "" &&
        this.state.developLanguage !== null
          ? this.state.developLanguage
          : "") +
        (this.state.unitPrice !== "" && this.state.unitPrice !== null
          ? `
【単　　価】：`
          : "") +
        (this.state.unitPrice !== "" && this.state.unitPrice !== null
          ? `${this.formatUnitePrice(this.state.unitPrice)}`
          : "") +
        (this.state.theMonthOfStartWork !== "" &&
        this.state.theMonthOfStartWork !== null
          ? `
【稼働開始】：`
          : "") +
        (this.state.theMonthOfStartWork !== "" &&
        this.state.theMonthOfStartWork !== null
          ? this.state.theMonthOfStartWork
          : "") +
        (this.state.salesProgressCode === "" ||
        this.state.salesProgressCode === null ||
        this.state.salesProgressCode === undefined
          ? ""
          : `
【営業状況】：`) +
        (this.state.salesProgressCode !== "" &&
        this.state.salesProgressCode !== null
          ? this.state.salesProgresss.find(
              (v) => v.code === this.state.salesProgressCode
            ).name
          : "") +
        (this.state.remark !== "" && this.state.remark !== null
          ? `
【備　　考】：`
          : "") +
        (this.state.remark !== "" && this.state.remark !== null
          ? this.state.remark
          : "");
    }
    this.setState({
      mailContent: mailContent,
    });
  };

  newEmployeeMailContent = (item) => {
    let str = ``;
    if (item.employeeName)
      str += `【名　　前】：${item.employeeName}
`;
    if (item?.hopeHighestPrice)
      str += `【単　　価】：${this.formatUnitePrice(item?.hopeHighestPrice)}
`;
    console.log(
      +item?.employeeStatus,
      "item?.employeeStatusitem?.employeeStatus"
    );
    if (item?.employeeStatus + "")
      str += `【所　　属】：${
        this.state.employeeStatusS.find((v) => v.code === item.employeeStatus)
          ?.name
      }
`;
    return str;
  };

  /* 要員追加機能の新規 20201216 張棟 START */

  handleRowSelect = (row, isSelected, e) => {
    let { employeeInfo } = this.state;
    if (row.employeeNo !== "" && row.employeeNo !== null) {
      this.searchPersonnalDetail(
        row.employeeNo,
        row.hopeHighestPrice,
        null,
        row.mailContent
      );
    } else {
      this.setState({
        mailContent:
          employeeInfo[row.index - 1]?.mailContent ||
          this.newEmployeeMailContent(row),
        // resumeName: this.state.employeeInfo[row.index - 1].resumeInfoName,
      });
    }

    let file = publicUtils.nullToEmpty(
      $(`#newResume${this.state.selectedColumnId - 1}`)?.get(0)?.files[0]
    );
    if (isSelected) {
      this.setState({
        file,
        selectedColumnId: row.index,
        employeeFlag: true,
        selectRowFlag: true,
        unitPriceShow: row.hopeHighestPrice,
        resumeName: this.state.employeeInfo[row.index - 1].resumeInfoName,
        selectedEmployeeInfo: this.state.employeeInfo[row.index - 1],
      });
      $("#bookButton").attr("disabled", false);
      $("#deleteButton").attr("disabled", false);
    } else {
      $("#deleteButton").attr("disabled", true);
      $("#bookButton").attr("disabled", true);
      this.setState({
        selectRowFlag: false,
        mailContent: "",
      });
    }
  };

  handleEmpStatusChange = (value, row) => {
    const { employeeInfo } = this.state;
    employeeInfo[row.index - 1].employeeStatus = value;
    this.setState({ employeeInfo });
  };

  formatUnitePrice = (value) => {
    let num = (value / 10000).toFixed(1).replace(".0", "") + "万円";
    return value === "" ? "" : num;
  };

  formatPrice = (cell, row, enumObject, index) => {
    return this.formatUnitePrice(cell);
  };

  formatEmpStatus = (cell, row, enumObject, index) => {
    if (row.employeeNo) {
      let name = this.state.employees.find((v) => v.code === cell).name;
      return name === "1社先の社員" ? "協力" : name;
    }
    return (
      <Select
        // labelInValue
        onChange={(value) => this.handleEmpStatusChange(value, row)}
        showArrow
        style={{ width: "100%" }}
        fieldNames={{ label: "name", value: "code" }}
        options={this.state.employeeStatusS}
      />
    );
    // employeeStatusS
  };
  /* 要員追加機能の新規 20201216 張棟 END */
  // formatResume(cell, row, enumObject, index) {
  // return (<div>
  // <Form.Control as="select" size="sm"
  // onChange={this.resumeValueChange.bind(this, row)}
  // name="resumeName"
  // autoComplete="off">
  // <option ></option>
  //
  // <option >{row.resumeInfo1 == null ? "" :
  // row.resumeInfo1.split('/')[4]}</option>
  // <option >{row.resumeInfo2 == null ? "" :
  // row.resumeInfo2.split('/')[4]}</option>
  // </Form.Control>
  // </div>);
  // }

  formatNewResume(cell, row, enumObject, index) {
    return (
      <Form.Control
        type="file"
        id={`newResume${row.index - 1}`}
        data-browse="添付"
        onChange={(event) =>
          this.changeFile(event, `newResume${row.index - 1}`)
        }
      />
    );
  }
  formatResumeInfoList(cell, row, enumObject, index) {
    let { resumeInfoList, newResumeName } = row;
    if (!resumeInfoList && !newResumeName) {
      return resumeInfoList;
    }
    let allResumeList = [];
    if (resumeInfoList && resumeInfoList.length > 0) {
      allResumeList = resumeInfoList;
    }

    if (newResumeName) {
      allResumeList = allResumeList.concat([newResumeName]);
    }
    return (
      <Form.Control
        as="select"
        size="sm"
        onChange={this.resumeInfoListChange.bind(this, row)}
        name="resumeInfoList"
        autoComplete="off"
        value={this.state.employeeInfo[row.index - 1].resumeInfoName}
      >
        {allResumeList.length > 0 &&
          allResumeList.map((data) => (
            <option key={data} value={data}>
              {data.split("_").length > 1
                ? data.split("_")[data.split("_").length - 1]
                : data}
            </option>
          ))}
      </Form.Control>
    );
  }

  //onChange
  tableValueChange = (event, cell, row) => {
    let employeeInfo = this.state.employeeInfo;
    employeeInfo[row.index - 1][event.target.name] = event.target.value;

    this.setState({
      employeeInfo: employeeInfo,
    });
  };

  onInputEmployeeNameBlur = (event, row) => {
    let { employeeInfo } = this.state,
      index = row.index - 1;
    if (event.target.value === employeeInfo[index].employeeName) {
      return;
    }
    employeeInfo[index] = {
      ...employeeInfo[index],
      employeeName: event.target.value,
      newResumeName: "",
      inputFlag: true,
    };

    if (row.employeeNo && row.employeeStatus) {
      employeeInfo[index] = {
        ...employeeInfo[index],
        employeeName: event.target.value,
        inputFlag: true,
        employeeStatus: "",
        employeeNo: "",
        hopeHighestPrice: "",
        resumeInfo1: "",
        resumeInfo1Name: "",
        resumeInfo2: "",
        resumeInfo2Name: "",
        resumeInfoList: [],
        resumeInfoName: "",
        newResumeName: "",
        resumeName1: "",
        resumeName2: "",
      };
    }

    this.setState({
      employeeInfo,
      employeeFlag: true,
      mailContent: "",
    });
    $("#addButton").attr("disabled", false);
  };

  /* 要員追加機能の新規 20201216 張棟 START */
  // 要員名前処理
  formatEmployeeName(cell, row, enumObject, index) {
    let flg = true;
    let name = cell;

    for (let v = 0; v < this.state.employeeInfo.length; v++) {
      if (this.state.employeeInfo[v].employeeName === cell) {
        flg =
          this.state.employeeInfo[v].initFlg === undefined
            ? true
            : this.state.employeeInfo[v].initFlg;
        name = this.state.employeeInfo[v].employeeName;
      }
    }
    if (flg) {
      return name;
    }

    return (
      <Autocomplete
        disableClearable
        freeSolo
        size="small"
        id="employeeName"
        onChange={(event, value, reason, details) =>
          this.myCodeEmployeeNameChange(event, value, reason, details, row)
        }
        options={this.state.allEmployeeNameInfo}
        value={this.state.employeeInfo[row.index - 1] || {}}
        getOptionLabel={(option) =>
          option.employeeName ? option.employeeName : ""
        }
        renderInput={(params) => (
          <TextField
            className="autocompleteInput"
            {...params}
            onBlur={(event) => this.onInputEmployeeNameBlur(event, row)}
            // variant="standard"
            placeholder="名前"
          />
        )}
      />
    );
  }

  resumeInfoListChange = (row, event) => {
    let employeeInfo = this.state.employeeInfo;

    employeeInfo[row.index - 1].resumeInfoName = event.target.value;
    this.setState({
      employeeInfo: employeeInfo,
    });
  };

  employeeNameInputChange = (row, event) => {
    let employeeInfo = this.state.employeeInfo;
    employeeInfo[row.index - 1].employeeName = event.target.value;
  };
  employeeNameInputBlur = (row, event) => {
    let employeeInfo = this.state.employeeInfo;
    employeeInfo[row.index - 1].employeeName = event.target.value;
    this.setState({
      employeeInfo: employeeInfo,
      employeeFlag: true,
    });
  };

  // 要員名前触発されるイベント
  myCodeEmployeeNameChange = (event, value, reason, details, row) => {
    if (reason === "select-option") {
      // 选择
      let { employeeInfo } = this.state;

      // 看是否已经重复添加过了（下标不同但名字相同，证明已经选择过了）
      for (let i = 0; i < employeeInfo.length; i++) {
        if (
          employeeInfo[i].index !== row.index &&
          employeeInfo[i].employeeName === value.employeeName
        ) {
          this.setState({
            myToastShow: true,
            type: false,
            errorsMessageShow: false,
            message: "同じ名前は選択されている。",
            sendLetterButtonDisFlag: true,
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
          // window.location.reload();
          return;
        }
      }
      // 没重复
      // 修改employeeName
      employeeInfo[row.index - 1].employeeName = value.employeeName;
      employeeInfo[row.index - 1].employeeNo = value.employeeNo;
      employeeInfo[row.index - 1].newResumeName = "";
      employeeInfo[row.index - 1].resumeInfoName = "";
      if (value.employeeNo.match("LYC")) {
        // 社員
        employeeInfo[row.index - 1].employeeStatus = "0";
      } else if (value.employeeNo.match("BP")) {
        // 協力
        employeeInfo[row.index - 1].employeeStatus = "1";
      }
      this.setState({
        employeeInfo,
        employeeFlag: true,
      });

      this.searchPersonnalDetail(
        value.employeeNo,
        employeeInfo[row.index - 1].hopeHighestPrice,
        row.index
      );

      // 检查是否都选择了，如果没有都选择则禁用添加按钮
      let disabledFlg = true;
      for (let j = 0; j < this.state.employeeInfo.length; j++) {
        if (
          this.state.employeeInfo[j].employeeName === "" ||
          this.state.employeeInfo[j].employeeName === null
        ) {
          disabledFlg = false;
          break;
        }
      }
      if (disabledFlg) {
        // 全ての要員明細の名前を入力した後で、追加ボタンが活性になる
        $("#addButton").attr("disabled", false);
      }
      if (this.state.mailTitle !== "") {
        this.setState({
          sendLetterButtonDisFlag: false,
        });
      }
    }
  };

  /* 要員追加機能の新規 20201216 張棟 END */

  // resumeValueChange = (row, event) => {
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //   });
  //   if (event.target.selectedIndex === 1) {
  //     this.setState({
  //       resumePath: row.resumeInfo1,
  //     });
  //   } else if (event.target.selectedIndex === 2) {
  //     this.setState({
  //       resumePath: row.resumeInfo2,
  //     });
  //   }
  // };

  // 要員追加機能の新規 20201216 張棟 START
  /**
   * 行追加処理
   */
  insertRow = () => {
    let { employeeInfo } = this.state;
    let employeeInfoModel = {
      employeeNo: "",
      employeeName: "",
      employeeStatus: "",
      hopeHighestPrice: "",
      resumeInfo1: "",
      resumeInfo1Name: "",
      resumeInfo2: "",
      resumeInfo2Name: "",
      resumeInfoName: "",
      initFlg: false,
      index: this.state.employeeInfo.length + 1,
    };

    employeeInfo.push(employeeInfoModel);
    let currentPage = Math.ceil(employeeInfo.length / 5);
    this.setState({
      employeeInfo,
      currentPage,
    });
    this.refs.table.setState({
      selectedRowKeys: [],
    });
    // 追加した後で、追加ボタンが非活性になる
    $("#addButton").attr("disabled", true);
    // for (let m = 0; m < this.state.employeeInfo.length; m++) {
    // for (let i = 0; i< this.state.allEmployeeName.length; i++) {
    // if (this.state.allEmployeeName[i] ===
    // this.state.employeeInfo[m].employeeName) {
    // this.state.allEmployeeName.splice(i,1);
    // break;
    // }
    // }
    // }
  };

  setEndDate = (date) => {
    this.setState({
      beginMonth: date,
    });
  };

  getStation = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let nearestStation = null;
        if (values !== null) {
          nearestStation = values.code;
        }
        this.setState({
          nearestStation: nearestStation,
          stationCode: nearestStation,
        });
      }
    );
  };

  /**
   * 行削除処理
   */

  // 削除前のデフォルトお知らせの削除
  customConfirm(next, dropRowKeys) {
    const dropRowKeysStr = dropRowKeys.join(",");
    next();
  }
  deleteRow = () => {
    let deleteFlg = window.confirm("削除してもよろしいでしょうか？");
    if (deleteFlg) {
      $("#delectBtn").click();
    }
  };

  // 隠した削除ボタン
  createCustomDeleteButton = (onClick) => {
    return (
      <Button variant="info" id="delectBtn" hidden onClick={onClick}>
        删除
      </Button>
    );
  };

  // 隠した削除ボタンの実装
  onDeleteRow = (row) => {
    let id = this.state.selectedColumnId;
    let employeeInfoList = this.state.employeeInfo;
    for (let i = employeeInfoList.length - 1; i >= 0; i--) {
      if (employeeInfoList[i].index === id) {
        employeeInfoList.splice(i, 1);
      }
    }
    if (employeeInfoList.length !== 0) {
      for (let i = employeeInfoList.length - 1; i >= 0; i--) {
        employeeInfoList[i].index = i + 1;
      }
    }
    this.setState({
      employeeInfo: employeeInfoList,
      selectRowFlag: false,
      // rowNo: '',
      // customerDepartmentNameValue: '',
      // customerDepartmentName: '',
    });
    // TODO 要員を削除した後で、営業文章の表示について
    // this.searchPersonnalDetail("");
    $("#deleteButton").attr("disabled", true);
    $("#bookButton").attr("disabled", true);
    this.setState({
      myToastShow: true,
      type: "success",
      errorsMessageShow: false,
      message: "削除成功",
    });
    setTimeout(() => this.setState({ myToastShow: false }), 3000);

    let disabledFlg = true;
    for (let j = 0; j < this.state.employeeInfo.length; j++) {
      if (
        this.state.employeeInfo[j].employeeName === "" ||
        this.state.employeeInfo[j].employeeName === null
      ) {
        disabledFlg = false;
        break;
      }
    }
    if (this.state.employeeInfo.length === 0 || disabledFlg) {
      // 全ての要員明細の名前を入力した後で、追加ボタンが活性になる
      $("#addButton").attr("disabled", false);
    }

    if (
      this.state.employeeInfo.length === 0 ||
      this.state.employeeInfo[0].employeeNo === ""
    ) {
      this.setState({
        EmployeeNameIndex: 0,
        employeeFlag: false,
        sendLetterButtonDisFlag: true,
      });
      this.initPersonnalDetail();
    } else {
      this.searchPersonnalDetail(this.state.employeeInfo[0].employeeNo);
    }

    --this.state.EmployeeNameIndex;
  };

  /**
   * ファイルを処理
   *
   * @param {*}
   *            event
   * @param {*}
   *            name
   */
  addFile = (event) => {
    $(`#newResume${this.state.selectedColumnId - 1}`).click();
  };

  changeFile = (event, name) => {
    let filePath = event.target.value;
    let arr = filePath.split("\\");
    let fileName = arr[arr.length - 1];
    let { employeeInfo, selectedColumnId } = this.state;
    // 除了两个本来就有的简历外，本地新增的简历只能新增一个。

    employeeInfo[selectedColumnId - 1].newResumeName = fileName;
    employeeInfo[selectedColumnId - 1].resumeInfoName = fileName;
    this.setState({
      employeeInfo,
    });
  };

  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  mailContentChange = (event) => {
    let { employeeInfo } = this.state;
    employeeInfo[this.state.selectedColumnId - 1].mailContent =
      event.target.value;
    this.setState({
      [event.target.name]: event.target.value,
      employeeInfo,
    });
  };

  titleValueChange = (event) => {
    if (event.target.value === "input") {
      this.titleChange();
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (event.target.value !== "") {
      this.setState({
        sendLetterButtonDisFlag: false,
      });
    } else {
      this.setState({
        sendLetterButtonDisFlag: true,
      });
    }
  };

  titleChange = () => {
    this.setState({
      titleFlag: !this.state.titleFlag,
      mailTitle: "",
      sendLetterButtonDisFlag: true,
    });
  };

  // 要員追加機能の新規 20201216 張棟 END
  /**
   * 戻るボタン
   */
  back = () => {
    let path = {};
    path = {
      pathname: this.state.backPage,
      state: {
        searchFlag: this.state.searchFlag,
        sendValue: this.state.sendValue,
        salesPersons: this.state.selectedEmpNos,
        targetCusInfos: this.props.location.state.storageListName
          ? undefined
          : this.props.location.state.targetCusInfos,
        currPage: this.props.location.state.storageListName
          ? ""
          : this.props.location.state.currPage,
        backbackPage: this.state.backbackPage,
        projectNo: this.state.projectNo,
      },
    };
    this.props.history.push(path);
  };

  render() {
    const {
      backPage,
      errorsMessageValue,
      message,
      type,
      confirmModalData,
      selectedmail,
      selectedPurchasingManagers,
      selectedCustomerName,
    } = this.state;

    console.log(
      { state: this.state, propsState: this.props.location.state },
      "render"
    );

    // ページネーション
    const options = {
      onPageChange: (page) => {
        this.setState({ currentPage: page });
      },
      page: this.state.currentPage,
      noDataText: (
        <i className="" style={{ fontSize: "24px" }}>
          データなし
        </i>
      ),
      defaultSortOrder: "dsc",
      sizePerPage: 5,
      pageStartIndex: 1,
      paginationSize: 3,
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      hideSizePerPage: true,
      paginationShowsTotal: this.renderShowsTotal,
      //
      expandRowBgColor: "rgb(165, 165, 165)",
      deleteBtn: this.createCustomDeleteButton,
      onDeleteRow: this.onDeleteRow,
      handleConfirmDeleteRow: this.customConfirm,
      //
    };

    const options2 = {
      onPageChange: (page) => {
        this.setState({ currentPage2: page });
      },
      page: this.state.currentPage2,
      noDataText: (
        <i className="" style={{ fontSize: "24px" }}>
          データなし
        </i>
      ),
      defaultSortOrder: "dsc",
      sizePerPage: 5,
      pageStartIndex: 1,
      paginationSize: 3,
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      hideSizePerPage: true,
      paginationShowsTotal: this.renderShowsTotal,
      //
      expandRowBgColor: "rgb(165, 165, 165)",
      deleteBtn: this.createCustomDeleteButton,
      onDeleteRow: this.onDeleteRow,
      handleConfirmDeleteRow: this.customConfirm,
      //
    };

    // 要員一覧表の入力框
    const cellEdit = {
      mode: "click",
      blurToSave: true,
      afterSaveCell: this.onAfterSaveCell,
      beforeSaveCell: this.beforeSaveCell,
    };

    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      // clickToExpand: true,
      // onSelect: this.handleEmpSelect,
      onSelect: this.handleRowSelect,
      clickToSelectAndEditCell: true,
    };

    const selectRow1 = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      onSelect: this.handleCtmSelect,
    };
    return (
      <div>
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={message}
            type={type}
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

        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.closeDaiolog}
          show={this.state.dialogShowFlag}
          dialogClassName="w40p h70p"
          contentClassName="h100p"
        >
          <Modal.Header closeButton>
            <Col className="text-center">
              {/* <h2>メール内容確認</h2> */}
              <h2>{`送信先(TO):${selectedmail}`}</h2>
            </Col>
          </Modal.Header>
          <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
            {confirmModalData ? (
              <MailConfirm
                data={{
                  ...confirmModalData,
                  selectedmail,
                  selectedPurchasingManagers,
                  selectedCustomerName,
                }}
              />
            ) : null}
          </Modal.Body>
        </Modal>
        <Row inline="true">
          <Col className="text-center">
            <h2>要員送信確認</h2>
          </Col>
        </Row>
        <Row style={{ padding: "10px" }}>
          <Col sm={12}></Col>
        </Row>
        <Row style={{ padding: "10px" }}>
          <Col sm={1}></Col>
          <Col sm={3}>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text
                  id="inputGroup-sizing-sm"
                  onClick={this.titleChange}
                >
                  タイトル
                </InputGroup.Text>
              </InputGroup.Prepend>
              {this.state.titleFlag ? (
                <FormControl
                  value={this.state.mailTitle}
                  name="mailTitle"
                  onChange={this.valueChange}
                ></FormControl>
              ) : (
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={this.titleValueChange}
                  name="mailTitle"
                >
                  <option></option>
                  <option>{this.getNextMonth(1)}の要員提案に関して</option>
                  <option>即日要員提案に関して</option>
                  <option>{this.getNextMonth(2)}の要員提案に関して</option>
                  <option value="input">手動入力</option>
                </Form.Control>
              )}
            </InputGroup>
          </Col>
          <Col sm={7}>
            <InputGroup size="sm" className="mb-3">
              {/*
               * <InputGroup.Prepend> <InputGroup.Text
               * id="inputGroup-sizing-sm">共用CCメール</InputGroup.Text>
               * </InputGroup.Prepend>
               */}
              <Autocomplete
                style={{ width: "100%" }}
                multiple
                size="small"
                id="tags-standard"
                options={this.state.mails}
                getOptionDisabled={(option) => this.state.disbleState}
                value={this.state.selectedMailCC}
                getOptionLabel={(option) =>
                  option.companyMail ? option.companyMail : ""
                }
                onChange={(event, values) => this.onTagsChange(event, values)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    /* label="共用CCメール" */
                    placeholder="共用CCメール"
                  />
                )}
              />
            </InputGroup>
          </Col>
          <Col sm={1}></Col>
        </Row>
        <Row style={{ padding: "10px" }}>
          <Col sm={1}></Col>
          <Col sm={10}>
            <InputGroup
              style={{ flexWrap: "noWrap" }}
              size="sm"
              className="mb-3"
            >
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  挨拶文章
                </InputGroup.Text>
              </InputGroup.Prepend>
              <textarea
                ref={(textarea) => (this.textArea = textarea)}
                maxLength="100"
                value={this.state.greetinTtext}
                id="greetinTtext"
                name="greetinTtext"
                onChange={this.valueChange}
                style={{
                  height: "60px",
                  width: "100%",
                  resize: "none",
                  overflow: "hidden",
                }}
              />
            </InputGroup>
          </Col>
          <Col sm={1}></Col>
        </Row>
        <Row>
          <Col sm={1}></Col>
          <Col sm={6}>
            <Button
              size="sm"
              hidden={backPage === "" ? true : false}
              variant="info"
              onClick={this.back.bind(this)}
            >
              <FontAwesomeIcon icon={faLevelUpAlt} />
              戻る
            </Button>{" "}
            <div style={{ float: "right" }}>
              <Button
                size="sm"
                variant="info"
                id="bookButton"
                name="bookButton"
                onClick={(event) => this.addFile(event)}
              >
                <FontAwesomeIcon icon={faFile} />
                履歴書
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                id="addButton"
                name="addButton"
                onClick={this.insertRow}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                要員追加
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                id="deleteButton"
                name="deleteButton"
                onClick={this.deleteRow}
              >
                <FontAwesomeIcon icon={faTrash} />
                要員削除
              </Button>{" "}
            </div>
          </Col>
          <Col sm={4}>{"　"}営業文章</Col>
          <Col sm={1}></Col>
        </Row>
        {/* 技術者table */}
        <Row>
          <Col sm={1}></Col>
          <Col sm={6}>
            <BootstrapTable
              options={options}
              insertRow={true}
              deleteRow
              data={this.state.employeeInfo}
              selectRow={selectRow}
              ref="table"
              pagination={true}
              cellEdit={cellEdit}
              trClassName="customClass"
              headerStyle={{ background: "#5599FF" }}
              striped
              hover
              condensed
            >
              <TableHeaderColumn
                width="10%"
                dataField="employeeName"
                dataFormat={this.formatEmployeeName.bind(this)}
                autoValue
                editable={false}
                isKey
                columnClassName="verticalAlignMiddle"
              >
                名前
              </TableHeaderColumn>
              <TableHeaderColumn
                width="12%"
                dataField="employeeStatus"
                dataFormat={this.formatEmpStatus.bind(this)}
                editable={false}
                columnClassName="verticalAlignMiddle"
              >
                所属
              </TableHeaderColumn>
              <TableHeaderColumn
                width="8%"
                dataField="hopeHighestPrice"
                dataFormat={this.formatPrice.bind(this)}
                editColumnClassName="dutyRegistration-DataTableEditingCell"
                columnClassName="verticalAlignMiddle"
              >
                単価
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="employeeNo"
                hidden={true}
              ></TableHeaderColumn>
              <TableHeaderColumn
                placeholder="履歴書名"
                width="15%"
                dataFormat={this.formatResumeInfoList.bind(this)}
                editable={false}
                columnClassName="verticalAlignMiddle"
              >
                履歴書
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden={true}
                dataField="employeeName"
                dataFormat={this.formatNewResume.bind(this)}
              >
                本地简历
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>

          <Col sm={4}>
            <textarea
              ref={(textarea) => (this.textArea = textarea)}
              onChange={this.mailContentChange}
              name="mailContent"
              style={{
                height: "340px",
                width: "100%",
                resize: "none",
                overflow: "hidden",
              }}
              // value={mailContent}
              value={
                this.state.employeeName === "empty" ||
                this.state.employeeName === ""
                  ? "要員追加してください。"
                  : this.state.employeeFlag
                  ? this.state.mailContent
                  : "要員追加してください。"
              }
            />
          </Col>
          <Col sm={1}></Col>
        </Row>
        <Row style={{ padding: "10px" }}>
          <Col sm={12}></Col>
        </Row>
        {/* メール確認，送信 Button */}
        <Row>
          <Col sm={1}></Col>
          <Col sm={5}></Col>
          <Col sm={5}>
            <div style={{ float: "right" }}>
              <Button
                onClick={this.openDaiolog}
                size="sm"
                variant="info"
                name="clickButton"
                disabled={!this.state.selectRow1Flag}
              >
                <FontAwesomeIcon icon={faGlasses} />
                メール確認
              </Button>{" "}
              <Button
                onClick={this.handleSendMailWithFile}
                size="sm"
                variant="info"
                disabled={
                  this.state.mailTitle === "" ||
                  this.state.sendLetterOverFlag ||
                  this.state.employeeInfo.length === 0
                    ? true
                    : false
                }
              >
                <FontAwesomeIcon icon={faEnvelope} /> {"送信"}
              </Button>
            </div>
          </Col>
          <Col sm={1}></Col>
        </Row>
        {/* お客様table */}
        <Row>
          <Col sm={1}></Col>
          <Col sm={10}>
            <BootstrapTable
              options={options2}
              selectRow={selectRow1}
              ref="table1"
              data={this.state.selectedCusInfos}
              pagination={true}
              trClassName="customClass"
              tdClass
              headerStyle={{ background: "#5599FF" }}
              striped
              hover
              condensed
            >
              <TableHeaderColumn
                width="8%"
                dataField="rowNo"
                editable={false}
                isKey
              >
                番号
              </TableHeaderColumn>
              <TableHeaderColumn
                width="15%"
                dataField="customerName"
                dataFormat={this.customerNameFormat}
                autoValue
                editable={false}
              >
                お客様名
              </TableHeaderColumn>
              <TableHeaderColumn
                width="15%"
                dataField="purchasingManagers"
                editable={false}
              >
                担当者
              </TableHeaderColumn>
              <TableHeaderColumn
                hidden
                dataField="positionCode"
                dataFormat={this.positionNameFormat}
                editable={false}
              >
                職位
              </TableHeaderColumn>
              <TableHeaderColumn
                width="25%"
                dataField="purchasingManagersMail"
                editable={false}
              >
                送信先(TO)
              </TableHeaderColumn>
              {/*<TableHeaderColumn width='8%' dataField='purchasingManagers2' editable={false}>担当者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='positionCode2' dataFormat={this.positionNameFormat} editable={false}>職位</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagersMail2' editable={false}>メール</TableHeaderColumn>*/}
              {/* <TableHeaderColumn
                width="25%"
                dataFormat={this.toCCFormat}
                editable={false}
              >
                送信先(CC)
              </TableHeaderColumn> */}
              <TableHeaderColumn
                width="25%"
                dataField="selectedTanTou"
                dataFormat={this.purchasingManagersOthersFormat}
                editable={false}
              >
                送信先(CC)
              </TableHeaderColumn>
              <TableHeaderColumn
                width="10%"
                dataField="sendOver"
                dataFormat={this.sendOverFormat}
                editable={false}
              >
                送信状況
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>
          <Col sm={1}></Col>
        </Row>
        <Row style={{ padding: "10px" }}>
          <Col sm={12}></Col>
        </Row>
      </div>
    );
  }
}
export default sendLettersConfirm;
