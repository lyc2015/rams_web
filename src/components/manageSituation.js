import React from "react";
import {
  Form,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import * as publicUtils from "./utils/publicUtils.js";
import "../asserts/css/style.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEnvelope,
  faIdCard,
  faListOl,
  faBuilding,
  faDownload,
  faBook,
  faBlender,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import TableSelect from "./TableSelect";
import Clipboard from "clipboard";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import SalesContent from "./salesContent";
import InterviewInformation from "./interviewInformation";
import FinishList from "./finishlist";
import SiteTermList from "./siteTermList";
import store from "./redux/store";
import { notification, message } from "antd";
axios.defaults.withCredentials = true;

const SIZE_PER_SIZE = 12;

const getProjectPhase = (siteRoleCode) => {
  if (siteRoleCode === "2") {
    return "1";
  } else if (siteRoleCode === "3") {
    return "2";
  }
};

/**
 * 営業状況画面
 */
class manageSituation extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.myRef = React.createRef();
    this.showPriority = this.showPriority.bind(this);
    this.getSalesProgressCodeName = this.getSalesProgressCodeName.bind(this);
    this.getNameByFlg = this.getNameByFlg.bind(this);
  }

  // 初期化
  initialState = {
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    rowNo: "", // 明細番号
    row: [],
    selectRow: "",
    employeeNo: "", // 社員NO
    lastEmpNo: "",
    yearMonth: new Date(
      new Date().getMonth() + 1 === 12
        ? new Date().getFullYear() + 1 + "/01"
        : new Date().getFullYear() +
        "/" +
        (new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 2)
          : new Date().getMonth() + 2)
    ).getTime(),
    interviewDate1Show: "", // 面接1日付
    interviewDate1: "", // 面接1日付
    interviewDate2Show: "", // 面接1日付
    interviewDate2: "", // 面接2日付
    stationCode1: "", // 面接1場所
    stationCode2: "", // 面接2場所
    interviewCustomer1: "", // 面接1客様
    interviewCustomer2: "", // 面接2客様
    hopeRemark: "", // 個人希望备注
    remark1: "", // 備考
    remark2: "", // 備考
    salesSituationLists: [], // 明細
    readFlag: true, // readonlyflag
    style: {
      backgroundColor: "",
    }, // 単価エラー色
    allEmpNo: [],
    allEmpNoName: [],
    allresumeInfo: [],
    allresumeInfo1: [],
    allresumeInfo2: [],
    sendLetterFalg: true,
    salesProgressCodes: store.getState().dropDown[16], // ステータス
    allCustomer: store.getState().dropDown[15], // お客様レコード用
    editFlag: false, // 確定客様編集flag
    priceEditFlag: false, // 確定単価編集flag
    updateBtnflag: false, // レコード選択flag
    salesYearAndMonth: "",
    salesPriorityStatus: "", // 優先度
    regexp: /^[0-9\b]+$/, // 数字正則式
    salesStaff: "", // 営業担当
    salesPriorityStatuss: store.getState().dropDown[41], // 全部ステータス
    salesPersons: store.getState().dropDown[56], // 全部営業
    customers: store.getState().dropDown[15], // 全部お客様 画面入力用
    getstations: store.getState().dropDown[14], // 全部場所
    genders: store.getState().dropDown[0],
    employees: store.getState().dropDown[4],
    japaneseLevels: store.getState().dropDown[5],
    japaneaseConversationLevels: store.getState().dropDown[43],
    englishConversationLevels: store.getState().dropDown[44],
    projectPhases: store.getState().dropDown[45],
    developLanguages: store.getState().dropDown[8],
    frameWorks: store.getState().dropDown[71],
    totalPersons: "", // 合計人数
    decidedPersons: "", // 確定人数
    linkDisableFlag: true, // linkDisableFlag
    checkSelect: true,
    admissionStartDate: "", // record開始時間
    customerNo: "", // 該当レコードおきゃくNO
    unitPrice: "", // 該当レコード単価
    resumeInfo1: "", // 履歴情報１
    resumeInfo2: "", // 履歴情報２
    resumeName1: "", // 履歴情報１
    resumeName2: "", // 履歴情報２
    resumeDate: "",
    admissionEndDate: "", // 現場終了情報
    myToastShow: false, // 状態ダイアログ
    myDirectoryShow: false, // 状態ダイアログ
    errorsMessageShow: false, // ERRダイアログ
    errorsMessageValue: "", // ERRメッセージ
    customerContracts: store.getState().dropDown[24],
    customerContractStatus: "",
    modeSelect: "radio",
    selectetRowIds: [],
    onSelectFlag: true,
    checkFlag: false,
    checkDisabledFlag: false,
    daiologShowFlag: false,
    interviewShowFlag: false,
    finishListShowFlag: false,
    isSelectedAll: false,
    makeDirectoryFalg: true,
    loading: true,
    siteListShowFlag: false,
    showAlphabetNameFlg: false
  };

  componentWillUnmount() {
    this.clipboard?.destroy && this.clipboard.destroy();
  }

  // 初期表示のレコードを取る
  componentDidMount() {
    this.initCopy();
    this.getLoginUserInfo();
    this.setNewDevelopLanguagesShow();
    // let sysYearMonth = new Date();
    // let searchYearMonth = sysYearMonth.getFullYear() +
    // (sysYearMonth.getMonth() + 1 < 10 ? '0' + (sysYearMonth.getMonth() +
    // 2) : (sysYearMonth.getMonth() + 2));
    if (
      this.props.location.state !== null &&
      this.props.location.state !== undefined &&
      this.props.location.state !== ""
    ) {
      this.getSalesSituation(
        this.props.location.state.sendValue.salesYearAndMonth
      );
      axios
        .post(this.state.serverIP + "salesSituation/checkDirectory", {
          salesYearAndMonth:
            this.props.location.state.sendValue.salesYearAndMonth,
        })
        .then((response) => {
          if (response.data) {
            this.setState({
              makeDirectoryFalg: true,
            });
          } else {
            this.setState({
              makeDirectoryFalg: false,
            });
          }
        })
        .catch((error) => {
          console.error("Error - " + error);
        });
      this.setState({
        salesYearAndMonth:
          this.props.location.state.sendValue.salesYearAndMonth,
        yearMonth: publicUtils.converToLocalTime(
          this.props.location.state.sendValue.salesYearAndMonth,
          false
        ),
      });
    } else {
      this.getSalesSituation(this.getNextMonth(new Date(), 1));
      axios
        .post(this.state.serverIP + "salesSituation/checkDirectory", {
          salesYearAndMonth: this.getNextMonth(new Date(), 1),
        })
        .then((response) => {
          if (response.data) {
            this.setState({
              makeDirectoryFalg: true,
            });
          } else {
            this.setState({
              makeDirectoryFalg: false,
            });
          }
        })
        .catch((error) => {
          console.error("Error - " + error);
        });
      this.setState({
        salesYearAndMonth: this.getNextMonth(new Date(), 1),
      });
    }
  }

  getNameByFlg({
    employeeFristName, alphabetName, employeeName
  }) {
    const currentRowshowAlphabetNameFlg = this.state?.showAlphabetNameFlg
    const [alphabetName1 = '', alphabetName2 = '', alphabetName3 = ''] = alphabetName.split(' ')
    let newName =
      currentRowshowAlphabetNameFlg ? `${employeeFristName} ${alphabetName2[0] ?? ''} ${alphabetName3[0] ?? ''}` : employeeName
    console.log({ currentRowshowAlphabetNameFlg, employeeFristName, alphabetName2, alphabetName3 }, alphabetName3[0], 'debug:0604')

    return newName
  }

  getSalesProgressCodeName = (salesProgressCode) => {
    return salesProgressCode !== "" && salesProgressCode !== undefined && salesProgressCode !== null ? this.state.salesProgressCodes.find(
      (v) => v.code === salesProgressCode
    )?.name ?? '' : '並行営業'
  }


  csvDownload = () => {
    let employeeNo = [];
    for (let i in this.state.salesSituationLists) {
      employeeNo.push(this.state.salesSituationLists[i].employeeNo);
    }

    axios
      .post(this.state.serverIP + "salesSituation/csvDownload", employeeNo)
      .then((response) => response.data)
      .then((data) => {
        console.log(data, 'debug:0506')
        this.downloadCsv(data);
      });
  };



  checkEmptyCsv = (values) => {
    return !values ? "" : `\t${values}`;
  };


  downloadCsv = (employeeList) => {
    // 导出
    var str =
      "番号,氏名,経験,稼動,役割,日本語,開発言語,寄り駅,単価,営業状況,備考," +
      "\n";


    for (var i = 0; i < employeeList.length; i++) {
      // 開発言語
      let developLanguageNames = [
        // this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode1),
        // this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode2),
        // this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode3),
        // this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode4),
        // this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode5),
        this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode6),
        this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode7),
        this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode8),
        this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode9),
        this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode10),
        this.fromCodeToNameLanguage(employeeList[i]?.developLanguageCode11),
      ]
        .filter(function (s) {
          return s && s.trim();
        })
        .join("、");

      // 営業状況
      let salesProgressName =
        this.getSalesProgressCodeName(employeeList[i]?.salesProgressCode ?? '')


      // 日本語
      const japaneaseConversationLevelsName = this.state.japaneaseConversationLevels.find(
        (v) => v.code === employeeList[i]?.japaneaseConversationLevel
      )?.name ?? ''

      const currentDate = (publicUtils
        .formateDate(employeeList[i]?.theMonthOfStartWork, true)
        .substring(0, 6) ?? '')
      const nextMonth = this.getNextMonth(new Date(), 0)

      // 稼働可能月
      const theMonthOfStartWork = currentDate <
        nextMonth
        ? "即日"
        : publicUtils
          .formateDate(employeeList[i]?.theMonthOfStartWork, false)
          .substring(0, 6)
          .replace(/\b(0+)/gi, "")
          .split("")
          .toSpliced(4, 0, "/")
          .join("")


      const yearsOfExperience = employeeList[i]?.yearsOfExperience

      // 単価
      const unitPrice = employeeList[i]?.unitPrice ?? ''
      const unitPriceFormatted = unitPrice ? this.checkEmptyCsv((unitPrice.replace(",", "") / 10000).toFixed(1).replace(".0", "")) : '';

      const nameByFlg = this.getNameByFlg(
        {
          employeeFristName: employeeList[i]?.employeeFristName ?? "",
          alphabetName: employeeList[i]?.alphabetName ?? "",
          employeeName: employeeList[i]?.employeeName ?? ""
        })

      str += [
        this.checkEmptyCsv(i + 1),
        this.checkEmptyCsv(nameByFlg),
        this.checkEmptyCsv(yearsOfExperience ? yearsOfExperience + "年" : ''),
        this.checkEmptyCsv(theMonthOfStartWork),
        this.checkEmptyCsv(employeeList[i]?.siteRoleCode),
        this.checkEmptyCsv(japaneaseConversationLevelsName),
        this.checkEmptyCsv(developLanguageNames),
        this.checkEmptyCsv(employeeList[i]?.stationName),
        this.checkEmptyCsv(unitPriceFormatted ? unitPriceFormatted + "万円" : ''),
        this.checkEmptyCsv(salesProgressName),
        this.checkEmptyCsv(employeeList[i]?.remark)
      ].join(",") + "\n";
    }

    str += "\n";

    console.log(str, 'debug:0606-strResult');
    const bom = "\uFEFF";
    const csvData = "data:text/csv;charset=utf-8," + encodeURIComponent(bom + str);
    const link = document.createElement("a");
    link.setAttribute("href", csvData);
    const filename =
      (publicUtils
        .formateDate(this.state.yearMonth, true)
        .substring(0, 6) ?? '') +
      "営業情報";
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showAlphabetName = () => {
    this.setState((prevState) => {
      return {
        showAlphabetNameFlg: !prevState.showAlphabetNameFlg,
      };
    });
  }

  setNewDevelopLanguagesShow = () => {
    let developLanguagesTemp = [];
    for (let i = 0; i < this.state.developLanguages.length; i++) {
      developLanguagesTemp.push(this.state.developLanguages[i]);
    }
    let frameWorkTemp = [];
    for (let i = 1; i < this.state.frameWorks.length; i++) {
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

  getLoginUserInfo = () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        this.setState({
          authorityCode: result.data[0].authorityCode,
        });
      })
      .catch(function (error) {
        //alert(error);
      });
  };

  getNextMonth = (date, addMonths) => {
    // var dd = new Date();
    var m = date.getMonth() + 1;
    var y =
      date.getMonth() + 1 + addMonths > 12
        ? date.getFullYear() + 1
        : date.getFullYear();
    if (m + addMonths == 0) {
      y = y - 1;
      m = 12;
    } else {
      if (m + addMonths > 12) {
        m = "01";
      } else {
        m = m + addMonths < 10 ? "0" + (m + addMonths) : m + addMonths;
      }
    }
    return y + "" + m;
  };

  getNextMonthTemp = (date, addMonths) => {
    // var dd = new Date();
    var m = date.getMonth() + 1;
    var y =
      date.getMonth() + 1 + addMonths > 12
        ? date.getFullYear() + 1
        : date.getFullYear();
    if (m + addMonths == 0) {
      y = y - 1;
      m = 12;
    } else {
      if (m + addMonths > 12) {
        m = "01";
      } else {
        m = m + addMonths < 10 ? "0" + (m + addMonths) : m + addMonths;
      }
    }
    return y + "/" + m;
  };

  // レコードを取る
  getSalesSituation = (searchYearMonth) => {
    axios
      .post(this.state.serverIP + "salesSituation/getSalesSituationNew", {
        salesYearAndMonth: searchYearMonth,
      })
      .then((result) => {
        if (result.data != null) {
          /*					this.refs.table.setState({
            selectedRowKeys: []
          });*/
          let empNoArray = new Array();
          let empNoNameArray = new Array();
          let resumeInfo1Array = new Array();
          let resumeInfo2Array = new Array();
          let resumeInfoArray = new Array();
          let completeCount = 0;
          for (let i in result.data) {
            empNoArray.push(result.data[i].employeeNo);
            empNoNameArray.push(
              result.data[i].employeeNo + "_" + result.data[i].employeeName
            );
            resumeInfo1Array.push(result.data[i].resumeInfo1);
            resumeInfo2Array.push(result.data[i].resumeInfo2);
            resumeInfoArray.push(result.data[i].resumeInfo1);
            resumeInfoArray.push(result.data[i].resumeInfo2);
            if (result.data[i].salesProgressCode === "0" || result.data[i].salesProgressCode === "1") {
              completeCount++;
            }
          }
          let completePercet = completeCount === 0 ? 0 : parseInt(completeCount) / parseInt(result.data.length);
          completePercet =
            (Math.round(completePercet * 10000) / 100).toFixed(1) + "%";

          var totalPersons = result.data.length;
          this.setState({
            checkDisabledFlag: totalPersons === 0 ? true : false,
            completePercet: completePercet,
          });
          var decidedPersons = 0;
          if (totalPersons !== 0) {
            for (var i = 0; i < result.data.length; i++) {
              if (result.data[i].salesProgressCode === "4") {
                decidedPersons = decidedPersons + 1;
              }
            }
          }
          /*					this.refs.table.store.selected = [];
          this.refs.table.setState({
            selectedRowKeys: []
          });*/
          this.setState(
            {
              /*						selectetRowIds: [],
               */ modeSelect: "radio",
              /*						checkSelect: true,
            onSelectFlag: true,
            checkFlag: false,*/
              salesSituationLists: result.data,
              /*						interviewDate1Show: '',　// 面接1日付
						interviewDate1: '',　// 面接1日付
						interviewDate2Show: '',　// 面接1日付
						interviewDate2: '',　// 面接2日付
						stationCode1: '',　// 面接1場所
						stationCode2: '',　// 面接2場所
						interviewCustomer1: '',　// 面接1客様
						interviewCustomer2: '',　// 面接2客様
						remark1: '',　// 備考
						remark2: '',　// 備考
						salesPriorityStatus: '',
*/ style: {
                backgroundColor: "",
              },
              /*						readFlag: true,
            updateBtnflag: false,
            linkDisableFlag: true,// linkDisableFlag
            sendLetterFalg:true,*/
              totalPersons: totalPersons, // 合計人数
              decidedPersons: decidedPersons, // 確定人数
              errorsMessageShow: false,
              errorsMessageValue: "",
              allEmpNo: empNoArray,
              allEmpNoName: empNoNameArray,
              allresumeInfo1: resumeInfo1Array,
              allresumeInfo2: resumeInfo2Array,
              allresumeInfo: resumeInfoArray,
            },
            () => {
              if (
                this.props.location.state !== null &&
                this.props.location.state !== undefined &&
                this.props.location.state !== ""
              ) {
                /*
                 * this.refs.table.setState({ selectedRowKeys:
                 * this.props.location.state.sendValue.selectetRowIds, });
                 */
                this.setState({
                  /*
                   * linkDisableFlag: this.props.location.state.sendValue.linkDisableFlag,
                   * sendLetterFalg: this.props.location.state.sendValue.sendLetterFalg,
                   */
                  linkDisableFlag: true,
                  sendLetterFalg: true,
                });
              }
            }
          );
        } else {
          alert("FAIL");
        }
      })
      .catch(function (error) {
        // alert("ERR");
      });
  };



  // レコードのステータス
  formatType = (cell) => {
    var statuss = this.state.salesProgressCodes;
    for (var i in statuss) {
      if (cell === statuss[i].code) {
        if (cell === "0" || cell === "1") {
          return (
            <div>
              <font color="grey">{statuss[i].name}</font>
            </div>
          );
        } else {
          return <div>{statuss[i].name}</div>;
        }
        //return statuss[i].name;
      }
    }
  };

  // 契約区分
  formatcustomerContract = (cell, row) => {
    var customerContracts = this.state.customerContracts;
    for (var i in customerContracts) {
      if (cell === customerContracts[i].code) {
        if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
          return (
            <div>
              <font color="grey">{customerContracts[i].name}</font>
            </div>
          );
        } else {
          return <div>{customerContracts[i].name}</div>;
        }
        //return customerContracts[i].name;
      }
    }
  };

  // レコードおきゃく表示
  formatCustome = (cell, row) => {
    var allCustomers = this.state.allCustomer;
    if (cell === "") {
      return "";
    } else {
      for (var i in allCustomers) {
        if (cell === allCustomers[i].code) {
          if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
            return (
              <div>
                <font color="grey">{allCustomers[i].name}</font>
              </div>
            );
          } else {
            return <div>{allCustomers[i].name}</div>;
          }
        }
      }
    }
  };

  // 明細選択したCustomerNoを設定する
  getCustomerNo = (no) => {
    this.state.salesSituationLists[this.state.rowNo - 1].customer = no;
    this.formatCustome(
      no,
      this.state.salesSituationLists[this.state.rowNo - 1]
    );
    this.afterSaveCell(this.state.salesSituationLists[this.state.rowNo - 1]);
  };

  // 明細選択したSalesProgressCodeを設定する
  getSalesProgressCode = (no) => {
    this.state.salesSituationLists[this.state.rowNo - 1].salesProgressCode = no;
    if (!(no === "0" || no === "1")) {
      this.state.salesSituationLists[this.state.rowNo - 1].customer = "";
      this.state.salesSituationLists[this.state.rowNo - 1].price = "";
      this.state.salesSituationLists[this.state.rowNo - 1].salesStaff = "";
      this.formatCustome(
        no,
        this.state.salesSituationLists[this.state.rowNo - 1]
      );
    }
    if (no === "0") {
      this.state.salesSituationLists[this.state.rowNo - 1].customer =
        this.state.salesSituationLists[this.state.rowNo - 1].nowCustomer;
    }
    this.formatType(no);

    // データが変更する時、ajaxを呼び出す
    // this.changeDataStatus(this.state.salesSituationLists[this.state.rowNo - 1]);
  };

  // 明細選択したSalesStaffを設定する
  getSalesStaff = (no) => {
    this.state.salesSituationLists[this.state.rowNo - 1].salesStaff = no;
    this.formatStaff(no, this.state.salesSituationLists[this.state.rowNo - 1]);
    this.setState({
      salesStaff: no,
    });
    // データが変更する時、ajaxを呼び出す
    // this.changeDataStatus(this.state.salesSituationLists[this.state.rowNo - 1]);
  };

  // 明細選択したCustomerContractを設定する
  getCustomerContract = (no) => {
    this.state.salesSituationLists[
      this.state.rowNo - 1
    ].customerContractStatus = no;
    this.formatcustomerContract(
      no,
      this.state.salesSituationLists[this.state.rowNo - 1]
    );
    this.setState({
      customerContractStatus: no,
    });
  };

  // レコードおきゃく表示
  formatStaff = (cell, row) => {
    var salesPersons = this.state.salesPersons;
    for (var i in salesPersons) {
      if (cell === salesPersons[i].code) {
        if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
          return (
            <div>
              <font color="grey">
                {salesPersons[i].name.replace(/\(.*?\)/g, "")}
              </font>
            </div>
          );
        } else {
          return <div>{salesPersons[i].name.replace(/\(.*?\)/g, "")}</div>;
        }
        //return {salesPersons[i].name.replace(/\(.*?\)/g, '' )}
      }
    }
  };

  // changeData レコードのステータス
  changeDataStatus = (salesSituationList, admissionEndDate) => {
    salesSituationList.admissionEndDate = admissionEndDate;
    axios
      .post(
        this.state.serverIP + "salesSituation/changeDataStatus",
        salesSituationList
      )
      .then((response) => {
        if (response.data.errorsMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.errorsMessage,
          });
        } else {
          this.getSalesSituation(
            salesSituationList.admissionEndDate.substring(0, 6)
          );
          this.setState({
            myToastShow: true,
            errorsMessageShow: false,
            errorsMessageValue: "",
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);

          store.dispatch({ type: "UPDATE_STATE", dropName: "getEmployeeName" });
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getEmployeeNameNoBP",
          });
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getEmployeeNameByOccupationName",
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };

  // table編集保存
  afterSaveCell = (row) => {
    if (
      row.salesProgressCode === "1" ||
      row.salesProgressCode === "0" ||
      row.salesProgressCode === "2"
    ) {
      if (row.customer === "" || row.customer === undefined) {
        row.customer = "";
      }
      this.setState({
        customerNo: row.customer,
      });
      // ステータスは確定の場合、確定お客様入力可能です、フォーカスが外に移動すれば、更新処理されている。現場情報(T006EmployeeSiteInfo)を使われます
      // table表数据更新暂时不用以下写法,注释掉的代码可供参考
      if (
        row.customer !== "" &&
        row.price !== "" &&
        row.customer !== undefined &&
        row.price !== undefined &&
        row.customer !== null &&
        row.price !== null
      ) {
        row.customerNo = row.customer;
        row.salesYearAndMonth = this.state.salesYearAndMonth;
        row.admissionStartDate = this.state.admissionStartDate;
        // axios.post(this.state.serverIP + "salesSituation/updateEmployeeSiteInfo",
        // row)
        // .then(result => {
        // if (result.data != null) {
        // this.getSalesSituation(this.state.salesYearAndMonth)
        // this.setState({ myToastShow: true });
        // setTimeout(() => this.setState({ myToastShow: false }), 3000);
        // } else {
        // alert("FAIL");
        // }
        // })
        // .catch(function (error) {
        // alert("ERR");
        // });
      }
    } else {
      row.customer = "noedit";
    }
  };

  // メモ INDEX取る方法
  /*
   * indexN(cell, row, enumObject, index) { return (<div>{index + 1}</div>); }
   */

  // 優先度表示
  showGreyNo(cell, row, enumObject, index) {
    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      return (
        <div>
          <font color="grey">{row.rowNo}</font>
        </div>
      );
    } else {
      return <div>{row.rowNo}</div>;
    }
  }

  showGreySiteRoleCodeAndJapanese(cell, row, enumObject, index) {
    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      if ((row.siteRoleCode === "" || row.siteRoleCode === null) && (row.japaneaseLevelDesc === "" || row.japaneaseLevelDesc === null)) {
        return <div></div>;
      } else if (row.japaneaseLevelDesc === "" || row.japaneaseLevelDesc === null) {
        return (
          <div>
            <font color="grey">{row.siteRoleCode}</font>
          </div>
        );
      } else if (row.siteRoleCode === "" || row.siteRoleCode === null) {
        return (
          <div>
            <font color="grey">{row.japaneaseLevelDesc}</font>
          </div>
        );
      } else {
        return (
          <div>
            <font color="grey">{row.siteRoleCode} · {row.japaneaseLevelDesc}</font>
          </div>
        );
      }
    } else {
      if ((row.siteRoleCode === "" || row.siteRoleCode === null) && (row.japaneaseLevelDesc === "" || row.japaneaseLevelDesc === null)) {
        return <div></div>;
      } else if (row.japaneaseLevelDesc === "" || row.japaneaseLevelDesc === null) {
        return <div>{row.siteRoleCode}</div>;
      } else if (row.siteRoleCode === "" || row.siteRoleCode === null) {
        return <div>{row.japaneaseLevelDesc}</div>;
      } else {
        return <div>{row.siteRoleCode} · {row.japaneaseLevelDesc}</div>;
      }
    }
  }
  showGreyYearsOfExperience(cell, row, enumObject, index) {
    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      return (
        <div>
          <font color="grey">
            {row.yearsOfExperience === "" || row.yearsOfExperience === null
              ? publicUtils.getYear(
                publicUtils.converToLocalTime(
                  row.intoCompanyYearAndMonth,
                  false
                ),
                new Date()
              )
              : row.yearsOfExperience}
          </font>
        </div>
      );
    } else {
      return (
        <div>
          {row.yearsOfExperience === "" || row.yearsOfExperience === null
            ? publicUtils.getYear(
              publicUtils.converToLocalTime(
                row.intoCompanyYearAndMonth,
                false
              ),
              new Date()
            )
            : row.yearsOfExperience}
        </div>
      );
    }
  }
  showGreyDevelopLanguage(cell, row, enumObject, index) {
    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      return (
        <div>
          <font color="grey">{row.developLanguage}</font>
        </div>
      );
    } else {
      return <div>{row.developLanguage}</div>;
    }
  }
  showGreyNearestStation(cell, row, enumObject, index) {
    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      return (
        <div>
          <font color="grey">{row.nearestStation}</font>
        </div>
      );
    } else {
      return <div>{row.nearestStation}</div>;
    }
  }
  showGreyUnitPrice(cell, row, enumObject, index) {
    let unitPrice;
    /*if(row.employeeNo.indexOf("BP") != -1){
      unitPrice = row.unitPrice;
    }else{*/
    let num = (cell?.replace(",", "") / 10000).toFixed(1).replace(".0", "");
    unitPrice = cell === "" ? "" : Number(num) === 0 ? cell : num;
    /*}*/
    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      if (row.bpUnitPrice !== null)
        return (
          <div>
            <font color="grey">{row.bpUnitPrice}</font>
          </div>
        );
      else
        return (
          <div>
            <font color="grey">{unitPrice}</font>
          </div>
        );
    } else {
      return <div>{unitPrice}</div>;
    }
  }
  showGreyPrice(cell, row, enumObject, index) {
    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      return (
        <div>
          <font color="grey">{publicUtils.addComma(row.price)}</font>
        </div>
      );
    } else {
      return <div>{publicUtils.addComma(row.price)}</div>;
    }
  }

  // 優先度表示
  showPriority(cell, row, enumObject, index) {
    // ローマ名の表示非表示：
    const { alphabetName = '', employeeName = '', employeeFristName = '' } = row
    const nameByFlg = this.getNameByFlg({ employeeFristName, alphabetName, employeeName })


    let nameAndCompany = nameByFlg + (row.customerAbbreviation ? `(${row.customerAbbreviation})` : "");

    if (row.salesProgressCode === "0" || row.salesProgressCode === "1") {
      return (
        <div>
          <font color="grey">{nameAndCompany}</font>
        </div>
      );
    } else {
      if (row.salesPriorityStatus === "1") {
        return (
          <div>
            {nameAndCompany}
            <font color="red">★</font>
          </div>
        );
      } else if (row.salesPriorityStatus === "2") {
        return (
          <div>
            {nameAndCompany}
            <font color="black">★</font>
          </div>
        );
      } else {
        return <div>{nameAndCompany}</div>;
      }
    }
  }

  // 更新ボタン
  changeState = () => {
    this.state.employeeNo = String(this.refs.table.state.selectedRowKeys);
    axios
      .post(
        this.state.serverIP + "salesSituation/updateSalesSituation",
        this.state
      )
      .then((result) => {
        if (result.data != null) {
          if (result.data.errorsMessage != null) {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: result.data.errorsMessage,
              style: {
                backgroundColor: "red",
              },
            });
          } else {
            this.getSalesSituation(this.state.salesYearAndMonth);
            this.setState({
              myToastShow: true,
              errorsMessageShow: false,
              errorsMessageValue: "",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
          }
        } else {
          alert("FAIL");
        }
      })
      .catch(function (error) {
        alert("ERR");
      });
  };

  // onchange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // AUTOSELECT select事件
  handleTag = ({ target }, fieldName) => {
    const { value, id } = target;
    if (value === "") {
      this.setState({
        [id]: "",
      });
    } else {
      if (
        fieldName === "station" &&
        this.state.getstations.find((v) => v.name === value) !== undefined
      ) {
        switch (id) {
          case "stationCode1":
            this.setState({
              stationCode1: this.state.getstations.find((v) => v.name === value)
                .code,
            });
            break;
          case "stationCode2":
            this.setState({
              stationCode2: this.state.getstations.find((v) => v.name === value)
                .code,
            });
            break;
          default:
        }
      } else if (
        fieldName === "interviewCustomer" &&
        this.state.customers.find((v) => v.name === value) !== undefined
      ) {
        switch (id) {
          case "interviewCustomer1":
            this.setState({
              interviewCustomer1: this.state.customers.find(
                (v) => v.name === value
              ).code,
            });
            break;
          case "interviewCustomer2":
            this.setState({
              interviewCustomer2: this.state.customers.find(
                (v) => v.name === value
              ).code,
            });
            break;
          default:
        }
      }
    }
  };

  // numbre only
  valueChangeNUmberOnly = (event) => {
    // 全角ー＞半角に変更
    var val = event.target.value;
    var han = val.replace(
      /[Ａ-Ｚａ-ｚ０-９－！”＃＄％＆’（）＝＜＞，．？＿［］｛｝＠＾～￥]/g,
      function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      }
    );
    if (han === "" || this.state.regexp.test(han)) {
      if (han.length > 3) {
        this.setState({
          [event.target.name]: han.substring(0, 3),
        });
      } else {
        this.setState({
          [event.target.name]: han,
        });
      }
    } else {
      alert("ONLY NUMBER");
    }
  };

  // 年月変更後、レコ＾ド再取る
  setEndDate = (date) => {
    axios
      .post(this.state.serverIP + "salesSituation/checkDirectory", {
        salesYearAndMonth: publicUtils.formateDate(date, false),
      })
      .then((response) => {
        if (response.data) {
          this.setState({
            makeDirectoryFalg: true,
          });
        } else {
          this.setState({
            makeDirectoryFalg: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
    this.setState({
      yearMonth: date,
      salesYearAndMonth: publicUtils.formateDate(date, false),
    });
    this.getSalesSituation(this.getNextMonth(date, 0));
  };

  // setinterviewDate1
  setinterviewDate1 = (date) => {
    this.setState({
      interviewDate1Show: date,
      interviewDate1: publicUtils.timeToStr(date),
    });
  };

  // setinterviewDate2
  setinterviewDate2 = (date) => {
    this.setState({
      interviewDate2Show: date,
      interviewDate2: publicUtils.timeToStr(date),
    });
  };

  // レコードselect事件
  handleRowSelect = (row, isSelected, e) => {
    console.log(this.refs.table);
    this.refs.table.setState({
      selectedRowKeys: [],
    });
    var ctrlKey = window.event === undefined ? false : window.event.ctrlKey;
    if (ctrlKey) {
      this.setState(
        {
          modeSelect: "checkbox",
        },
        () => {
          if (isSelected) {
            this.setState({
              row: this.state.row,
              selectetRowIds:
                row.employeeNo === null
                  ? []
                  : this.state.selectetRowIds.concat([row.employeeNo]),
              rowNo: row.rowNo === null ? "" : row.rowNo,
              salesDateUpdate:
                row.salesDateUpdate === null ? "" : row.salesDateUpdate,
              employeeNo: row.employeeNo === null ? "" : row.employeeNo,
              interviewDate1:
                row.interviewDate1 === null ? "" : row.interviewDate1,
              interviewDate1Show:
                row.interviewDate1 === null
                  ? ""
                  : new Date(
                    publicUtils.strToTime(row.interviewDate1)
                  ).getTime(),
              interviewDate2:
                row.interviewDate2 === null ? "" : row.interviewDate2,
              interviewDate2Show:
                row.interviewDate2 === null
                  ? ""
                  : new Date(
                    publicUtils.strToTime(row.interviewDate2)
                  ).getTime(),
              stationCode1: row.stationCode1 === null ? "" : row.stationCode1,
              stationCode2: row.stationCode2 === null ? "" : row.stationCode2,
              interviewCustomer1:
                row.interviewCustomer1 === null ? "" : row.interviewCustomer1,
              interviewCustomer2:
                row.interviewCustomer2 === null ? "" : row.interviewCustomer2,
              hopeRemark:
                row.hopeRemark === null ? "" : row.hopeRemark,
              salesPriorityStatus:
                row.salesPriorityStatus === null ? "" : row.salesPriorityStatus,
              salesProgressCode:
                row.salesProgressCode === null ? "" : row.salesProgressCode,
              remark1: row.remark1 === null ? "" : row.remark1,
              remark2: row.remark2 === null ? "" : row.remark2,
              editFlag:
                row.salesProgressCode === "0" || row.salesProgressCode === "1"
                  ? {
                    type: "select",
                    readOnly: false,
                    options: { values: this.state.allCustomer },
                  }
                  : false,
              priceEditFlag:
                row.salesProgressCode === "0" || row.salesProgressCode === "1"
                  ? true
                  : false, // 確定単価編集flag
              updateBtnflag: isSelected,
              salesStaff: row.salesStaff === null ? "" : row.salesStaff,
              readFlag:
                row.employeeNo === this.state.employeeNo && !this.state.readFlag
                  ? false
                  : true,
              linkDisableFlag:
                this.refs.table.state.selectedRowKeys.length === 0
                  ? false
                  : true,
              sendLetterFalg:
                this.refs.table.state.selectedRowKeys.length >= 0
                  ? false
                  : true,
              admissionStartDate:
                row.admissionStartDate === null
                  ? publicUtils.formateDate(new Date(), true)
                  : row.admissionStartDate,
              customerNo: row.customer === null ? "" : row.customer,
              unitPrice: row.price === null ? row.unitPrice : row.price,
              resumeInfo1: row.resumeInfo1 === null ? "" : row.resumeInfo1,
              resumeInfo2: row.resumeInfo2 === null ? "" : row.resumeInfo2,
              resumeName1: row.resumeName1 === null ? "" : row.resumeName1,
              resumeName2: row.resumeName2 === null ? "" : row.resumeName2,
              resumeDate: row.resumeDate === null ? "" : row.resumeDate,
              customerContractStatus:
                row.customerContractStatus === null
                  ? ""
                  : row.customerContractStatus,
              admissionEndDate:
                row.admissionEndDate === null || row.admissionEndDate === ""
                  ? row.scheduledEndDate === null || row.scheduledEndDate === ""
                    ? row.bpOtherCompanyAdmissionEndDate
                    : row.scheduledEndDate
                  : row.admissionEndDate.substring(0, 6),
            });
          } else {
            if (this.refs.table.state.selectedRowKeys.length === 2) {
              let employeeNo;
              for (
                let i = 0;
                i < this.refs.table.state.selectedRowKeys.length;
                i++
              ) {
                if (
                  String(row.employeeNo) !==
                  String(this.refs.table.state.selectedRowKeys[i])
                ) {
                  employeeNo = this.refs.table.state.selectedRowKeys[i];
                }
              }
              for (let i = 0; i < this.state.salesSituationLists.length; i++) {
                if (
                  String(employeeNo) ===
                  String(this.state.salesSituationLists[i].employeeNo)
                ) {
                  row = this.state.salesSituationLists[i];
                }
              }
              this.setState({
                row: [],
                selectetRowIds:
                  row.employeeNo === null
                    ? []
                    : this.state.selectetRowIds.concat([row.employeeNo]),
                rowNo: row.rowNo === null ? "" : row.rowNo,
                salesDateUpdate:
                  row.salesDateUpdate === null ? "" : row.salesDateUpdate,
                employeeNo: row.employeeNo === null ? "" : row.employeeNo,
                interviewDate1:
                  row.interviewDate1 === null ? "" : row.interviewDate1,
                interviewDate1Show:
                  row.interviewDate1 === null
                    ? ""
                    : new Date(
                      publicUtils.strToTime(row.interviewDate1)
                    ).getTime(),
                interviewDate2:
                  row.interviewDate2 === null ? "" : row.interviewDate2,
                interviewDate2Show:
                  row.interviewDate2 === null
                    ? ""
                    : new Date(
                      publicUtils.strToTime(row.interviewDate2)
                    ).getTime(),
                stationCode1: row.stationCode1 === null ? "" : row.stationCode1,
                stationCode2: row.stationCode2 === null ? "" : row.stationCode2,
                interviewCustomer1:
                  row.interviewCustomer1 === null ? "" : row.interviewCustomer1,
                interviewCustomer2:
                  row.interviewCustomer2 === null ? "" : row.interviewCustomer2,
                hopeRemark:
                  row.hopeRemark === null ? "" : row.hopeRemark,
                salesPriorityStatus:
                  row.salesPriorityStatus === null
                    ? ""
                    : row.salesPriorityStatus,
                salesProgressCode:
                  row.salesProgressCode === null ? "" : row.salesProgressCode,
                remark1: row.remark1 === null ? "" : row.remark1,
                remark2: row.remark2 === null ? "" : row.remark2,
                editFlag:
                  row.salesProgressCode === "0" || row.salesProgressCode === "1"
                    ? {
                      type: "select",
                      readOnly: false,
                      options: { values: this.state.allCustomer },
                    }
                    : false,
                priceEditFlag:
                  row.salesProgressCode === "0" || row.salesProgressCode === "1"
                    ? true
                    : false, // 確定単価編集flag
                updateBtnflag: isSelected,
                salesStaff: row.salesStaff === null ? "" : row.salesStaff,
                readFlag:
                  row.employeeNo === this.state.employeeNo &&
                    !this.state.readFlag
                    ? false
                    : true,
                linkDisableFlag:
                  this.refs.table.state.selectedRowKeys.length === 2
                    ? false
                    : true,
                sendLetterFalg:
                  !this.state.isSelectedAll &&
                    this.refs.table.state.selectedRowKeys.length > 1
                    ? false
                    : true,
                admissionStartDate:
                  row.admissionStartDate === null
                    ? publicUtils.formateDate(new Date(), true)
                    : row.admissionStartDate,
                customerNo: row.customer === null ? "" : row.customer,
                unitPrice: row.price === null ? row.unitPrice : row.price,
                resumeInfo1: row.resumeInfo1 === null ? "" : row.resumeInfo1,
                resumeInfo2: row.resumeInfo2 === null ? "" : row.resumeInfo2,
                resumeName1: row.resumeName1 === null ? "" : row.resumeName1,
                resumeName2: row.resumeName2 === null ? "" : row.resumeName2,
                resumeDate: row.resumeDate === null ? "" : row.resumeDate,
                customerContractStatus:
                  row.customerContractStatus === null
                    ? ""
                    : row.customerContractStatus,
                admissionEndDate:
                  row.admissionEndDate === null || row.admissionEndDate === ""
                    ? row.scheduledEndDate === null ||
                      row.scheduledEndDate === ""
                      ? row.bpOtherCompanyAdmissionEndDate
                      : row.scheduledEndDate
                    : row.admissionEndDate.substring(0, 6),
              });
            } else {
              this.setState({
                selectetRowIds: [],
                employeeNo: "",
                interviewDate1: "",
                interviewDate1Show: "",
                interviewDate2: "",
                interviewDate2Show: "",
                stationCode1: "",
                stationCode2: "",
                interviewCustomer1: "",
                interviewCustomer2: "",
                hopeRemark: "",
                salesPriorityStatus: "",
                admissionEndDate: "",
                remark1: "",
                remark2: "",
                editFlag:
                  row.salesProgressCode === "4"
                    ? {
                      type: "select",
                      readOnly: false,
                      options: { values: this.state.allCustomer },
                    }
                    : false,
                updateBtnflag: isSelected,
                readFlag: true,
                linkDisableFlag:
                  this.refs.table.state.selectedRowKeys.length === 2
                    ? false
                    : true,
                sendLetterFalg:
                  !this.state.isSelectedAll &&
                    this.refs.table.state.selectedRowKeys.length > 1
                    ? false
                    : true,
                isSelectedAll: false,
              });
            }
          }
        }
      );
    } else {
      this.setState(
        {
          modeSelect: "radio",
        },
        () => {
          if (isSelected) {
            this.setState({
              selectRow: row,
              selectetRowIds:
                row.employeeNo === null
                  ? []
                  : this.state.selectetRowIds.concat([row.employeeNo]),
              rowNo: row.rowNo === null ? "" : row.rowNo,
              salesDateUpdate:
                row.salesDateUpdate === null ? "" : row.salesDateUpdate,
              employeeNo: row.employeeNo === null ? "" : row.employeeNo,
              interviewDate1:
                row.interviewDate1 === null ? "" : row.interviewDate1,
              interviewDate1Show:
                row.interviewDate1 === null
                  ? ""
                  : new Date(
                    publicUtils.strToTime(row.interviewDate1)
                  ).getTime(),
              interviewDate2:
                row.interviewDate2 === null ? "" : row.interviewDate2,
              interviewDate2Show:
                row.interviewDate2 === null
                  ? ""
                  : new Date(
                    publicUtils.strToTime(row.interviewDate2)
                  ).getTime(),
              stationCode1: row.stationCode1 === null ? "" : row.stationCode1,
              stationCode2: row.stationCode2 === null ? "" : row.stationCode2,
              interviewCustomer1:
                row.interviewCustomer1 === null ? "" : row.interviewCustomer1,
              interviewCustomer2:
                row.interviewCustomer2 === null ? "" : row.interviewCustomer2,
              hopeRemark:
                row.hopeRemark === null ? "" : row.hopeRemark,
              salesPriorityStatus:
                row.salesPriorityStatus === null ? "" : row.salesPriorityStatus,
              salesProgressCode:
                row.salesProgressCode === null ? "" : row.salesProgressCode,
              remark1: row.remark1 === null ? "" : row.remark1,
              remark2: row.remark2 === null ? "" : row.remark2,
              editFlag:
                row.salesProgressCode === "0" || row.salesProgressCode === "1"
                  ? {
                    type: "select",
                    readOnly: false,
                    options: { values: this.state.allCustomer },
                  }
                  : false,
              priceEditFlag:
                row.salesProgressCode === "0" || row.salesProgressCode === "1"
                  ? true
                  : false, // 確定単価編集flag
              updateBtnflag: isSelected,
              salesStaff: row.salesStaff === null ? "" : row.salesStaff,
              readFlag:
                row.employeeNo === this.state.employeeNo && !this.state.readFlag
                  ? false
                  : true,
              /*				linkDisableFlag: this.refs.table.state.selectedRowKeys.length === 0 ? false : true,
            sendLetterFalg: this.refs.table.state.selectedRowKeys.length >= 0 ? false : true,*/
              linkDisableFlag: false,
              sendLetterFalg: false,
              admissionStartDate:
                row.admissionStartDate === null
                  ? publicUtils.formateDate(new Date(), true)
                  : row.admissionStartDate,
              customerNo: row.customer === null ? "" : row.customer,
              unitPrice: row.price === null ? row.unitPrice : row.price,
              resumeInfo1: row.resumeInfo1 === null ? "" : row.resumeInfo1,
              resumeInfo2: row.resumeInfo2 === null ? "" : row.resumeInfo2,
              resumeName1: row.resumeName1 === null ? "" : row.resumeName1,
              resumeName2: row.resumeName2 === null ? "" : row.resumeName2,
              resumeDate: row.resumeDate === null ? "" : row.resumeDate,
              customerContractStatus:
                row.customerContractStatus === null
                  ? ""
                  : row.customerContractStatus,
              admissionEndDate:
                row.admissionEndDate === null || row.admissionEndDate === ""
                  ? row.scheduledEndDate === null || row.scheduledEndDate === ""
                    ? row.bpOtherCompanyAdmissionEndDate
                    : row.scheduledEndDate
                  : row.admissionEndDate.substring(0, 6),
              lastEmpNo: row.employeeNo === null ? "" : row.employeeNo,
            });
          } else {
            if (this.refs.table.state.selectedRowKeys.length === 2) {
              let employeeNo;
              for (
                let i = 0;
                i < this.refs.table.state.selectedRowKeys.length;
                i++
              ) {
                if (
                  String(row.employeeNo) !==
                  String(this.refs.table.state.selectedRowKeys[i])
                ) {
                  employeeNo = this.refs.table.state.selectedRowKeys[i];
                }
              }
              for (let i = 0; i < this.state.salesSituationLists.length; i++) {
                if (
                  String(employeeNo) ===
                  String(this.state.salesSituationLists[i].employeeNo)
                ) {
                  row = this.state.salesSituationLists[i];
                }
              }
              this.setState({
                selectRow: row,
                selectetRowIds:
                  row.employeeNo === null
                    ? []
                    : this.state.selectetRowIds.concat([row.employeeNo]),
                rowNo: row.rowNo === null ? "" : row.rowNo,
                salesDateUpdate:
                  row.salesDateUpdate === null ? "" : row.salesDateUpdate,
                employeeNo: row.employeeNo === null ? "" : row.employeeNo,
                interviewDate1:
                  row.interviewDate1 === null ? "" : row.interviewDate1,
                interviewDate1Show:
                  row.interviewDate1 === null
                    ? ""
                    : new Date(
                      publicUtils.strToTime(row.interviewDate1)
                    ).getTime(),
                interviewDate2:
                  row.interviewDate2 === null ? "" : row.interviewDate2,
                interviewDate2Show:
                  row.interviewDate2 === null
                    ? ""
                    : new Date(
                      publicUtils.strToTime(row.interviewDate2)
                    ).getTime(),
                stationCode1: row.stationCode1 === null ? "" : row.stationCode1,
                stationCode2: row.stationCode2 === null ? "" : row.stationCode2,
                interviewCustomer1:
                  row.interviewCustomer1 === null ? "" : row.interviewCustomer1,
                interviewCustomer2:
                  row.interviewCustomer2 === null ? "" : row.interviewCustomer2,
                hopeRemark:
                  row.hopeRemark === null ? "" : row.hopeRemark,
                salesPriorityStatus:
                  row.salesPriorityStatus === null
                    ? ""
                    : row.salesPriorityStatus,
                salesProgressCode:
                  row.salesProgressCode === null ? "" : row.salesProgressCode,
                remark1: row.remark1 === null ? "" : row.remark1,
                remark2: row.remark2 === null ? "" : row.remark2,
                editFlag:
                  row.salesProgressCode === "0" || row.salesProgressCode === "1"
                    ? {
                      type: "select",
                      readOnly: false,
                      options: { values: this.state.allCustomer },
                    }
                    : false,
                priceEditFlag:
                  row.salesProgressCode === "0" || row.salesProgressCode === "1"
                    ? true
                    : false, // 確定単価編集flag
                updateBtnflag: isSelected,
                salesStaff: row.salesStaff === null ? "" : row.salesStaff,
                readFlag:
                  row.employeeNo === this.state.employeeNo &&
                    !this.state.readFlag
                    ? false
                    : true,
                linkDisableFlag:
                  this.refs.table.state.selectedRowKeys.length === 2
                    ? false
                    : true,
                sendLetterFalg:
                  !this.state.isSelectedAll &&
                    this.refs.table.state.selectedRowKeys.length > 1
                    ? false
                    : true,
                admissionStartDate:
                  row.admissionStartDate === null
                    ? publicUtils.formateDate(new Date(), true)
                    : row.admissionStartDate,
                customerNo: row.customer === null ? "" : row.customer,
                unitPrice: row.price === null ? row.unitPrice : row.price,
                resumeInfo1: row.resumeInfo1 === null ? "" : row.resumeInfo1,
                resumeInfo2: row.resumeInfo2 === null ? "" : row.resumeInfo2,
                resumeDate: row.resumeDate === null ? "" : row.resumeDate,
                resumeName1: row.resumeName1 === null ? "" : row.resumeName1,
                resumeName2: row.resumeName2 === null ? "" : row.resumeName2,
                customerContractStatus:
                  row.customerContractStatus === null
                    ? ""
                    : row.customerContractStatus,
                admissionEndDate:
                  row.admissionEndDate === null || row.admissionEndDate === ""
                    ? row.scheduledEndDate === null ||
                      row.scheduledEndDate === ""
                      ? row.bpOtherCompanyAdmissionEndDate
                      : row.scheduledEndDate
                    : row.admissionEndDate.substring(0, 6),
              });
            } else {
              this.setState({
                selectRow: "",
                selectetRowIds: [],
                employeeNo: "",
                interviewDate1: "",
                interviewDate1Show: "",
                interviewDate2: "",
                interviewDate2Show: "",
                stationCode1: "",
                stationCode2: "",
                interviewCustomer1: "",
                interviewCustomer2: "",
                hopeRemark: "",
                salesPriorityStatus: "",
                admissionEndDate: "",
                remark1: "",
                remark2: "",
                editFlag:
                  row.salesProgressCode === "0"
                    ? {
                      type: "select",
                      readOnly: false,
                      options: { values: this.state.allCustomer },
                    }
                    : false,
                updateBtnflag: isSelected,
                readFlag: true,
                linkDisableFlag:
                  this.refs.table.state.selectedRowKeys.length === 2
                    ? false
                    : true,
                sendLetterFalg:
                  !this.state.isSelectedAll &&
                    this.refs.table.state.selectedRowKeys.length > 1
                    ? false
                    : true,
                isSelectedAll: false,
              });
            }
          }
        }
      );
    }
  };

  // 全て選択ボタン事件
  selectAllLists = () => {
    this.refs.table.store.selected = [];
    this.refs.table.setState(
      {
        selectedRowKeys:
          this.refs.table.state.selectedRowKeys.length !==
            this.state.allEmpNo.length
            ? this.state.allEmpNo
            : [],
      },
      () => {
        this.setState({
          linkDisableFlag:
            this.refs.table.state.selectedRowKeys.length === 1 ? false : true,
          sendLetterFalg:
            this.refs.table.state.selectedRowKeys.length > 0 ? false : true,
          isSelectedAll: !this.state.isSelectedAll,
        });
      }
    );
  };

  // 明細多選処理
  handleCheckModeSelect = (row, isSelected, e) => {
    if (isSelected) {
      let tempSelectetRowIds = this.state.selectetRowIds.concat([
        row.employeeNo,
      ]);
      this.setState({
        selectetRowIds: tempSelectetRowIds,
        checkSelect: false,
      });
    } else {
      let index = this.state.selectetRowIds.findIndex(
        (item) => item === row.employeeNo
      );
      this.state.selectetRowIds.splice(index, 1);
      this.setState({
        selectetRowIds: this.state.selectetRowIds,
        checkSelect: this.state.selectetRowIds.length === 0 ? true : false,
      });
    }
  };

  // サブ画面消す
  closeDaiolog = () => {
    this.setState({
      daiologShowFlag: false,
    });
  };

  // // サブ画面表示
  openDaiolog = () => {
    this.setState({
      employeeNo: String(this.refs.table.state.selectedRowKeys),
      daiologShowFlag: true,
    });
  };

  // サブ画面消す
  closeInterviewlog = () => {
    this.setState({
      interviewShowFlag: false,
    });
  };

  // // サブ画面表示
  openInterviewlog = () => {
    this.setState({
      employeeNo: String(this.refs.table.state.selectedRowKeys),
      interviewShowFlag: true,
    });
  };

  // // サブ画面表示
  openFinishList = () => {
    this.setState({
      employeeNo: String(this.refs.table.state.selectedRowKeys),
      finishListShowFlag: true,
    });
  };


  // サブ画面消す
  closeFinishList = () => {
    this.setState({
      finishListShowFlag: false,
    });
  };

  // 現場期限サブ画面表示
  openSiteList = () => {
    this.setState({
      employeeNo: String(this.refs.table.state.selectedRowKeys),
      siteListShowFlag: true,
    });
  };

  // 現場期限サブ画面消す
  closeSiteList = () => {
    this.setState({
      siteListShowFlag: false,
    });
  };

  initCopy = () => {
    this.clipboard = new Clipboard("#copyId");
    this.clipboard.on("success", function (e) {
      message.success("コピー成功しました");
      // console.log(e);
    });
    this.clipboard.on("error", function (e) {
      message.error("コピー失敗しました");
      console.log(e);
    });
  };

  getCopyText = async () => {
    let text = "";
    const { selectRow: row } = this.state;
    let result = await axios.post(
      this.state.serverIP + "salesSituation/getPersonalSalesInfo",
      {
        employeeNo: row.employeeNo,
      }
    );
    if (result.data.length < 0) {
      notification.error({
        message: "エラー",
        description: "データ存在していません",
        placement: "topLeft",
      });
      return;
    }
    let employeeStatus =
      this.state.employees.find(
        (v) => v.code === result.data[0]?.employeeStatus
      )?.name || "";
    let developLanguage = [
      this.fromCodeToNameLanguage(result.data[0].developLanguage1),
      this.fromCodeToNameLanguage(result.data[0].developLanguage2),
      this.fromCodeToNameLanguage(result.data[0].developLanguage3),
      this.fromCodeToNameLanguage(result.data[0].developLanguage4),
      this.fromCodeToNameLanguage(result.data[0].developLanguage5),
      this.fromCodeToNameLanguage(result.data[0].developLanguage6),
    ]
      .filter(function (s) {
        return s && s.trim();
      })
      .join("、");
    let admissionEndDate =
      row.admissionEndDate === null || row.admissionEndDate === ""
        ? row.scheduledEndDate
        : row.admissionEndDate.substring(0, 6);
    let beginMonth =
      result.data[0].theMonthOfStartWork === null ||
        result.data[0].theMonthOfStartWork === ""
        ? new Date(
          this.getNextMonthTemp(
            admissionEndDate === null || admissionEndDate === ""
              ? new Date()
              : publicUtils.converToLocalTime(admissionEndDate, false),
            1
          )
        ).getTime()
        : new Date(result.data[0].theMonthOfStartWork).getTime();
    let salesProgressCode = row.salesProgressCode;
    let interviewDate =
      row.interviewDate1 !== "" &&
        row.interviewDate1 !== null &&
        row.interviewDate2 !== "" &&
        row.interviewDate2 !== null
        ? row.interviewDate1 < row.interviewDate2
          ? row.interviewDate1
          : row.interviewDate2
        : row.interviewDate1 !== "" && row.interviewDate1 !== null
          ? row.interviewDate1
          : row.interviewDate2 !== "" && row.interviewDate2 !== null
            ? row.interviewDate2
            : "";
    let remark =
      result.data[0].remark === null ||
        result.data[0].remark === "" ||
        result.data[0].remark === undefined
        ? (row.remark1 === null ? "" : row.remark1 + " ") +
        (row.remark2 === null ? "" : row.remark2)
        : result.data[0].remark;
    if (interviewDate !== "") {
      var myDate = new Date();
      myDate =
        myDate.getFullYear() +
        this.padding1(myDate.getMonth() + 1, 2) +
        this.padding1(myDate.getDate(), 2);
      if (interviewDate.substring(0, 8) >= myDate) {
        interviewDate =
          " " +
          interviewDate.substring(4, 6) +
          "/" +
          interviewDate.substring(6, 8) +
          " " +
          interviewDate.substring(8, 10) +
          ":" +
          interviewDate.substring(10, 12);
      } else {
        interviewDate = "";
      }
    }

    let projectPhase = result.data?.[0]?.projectPhase,
      unitPrice = result.data?.[0]?.unitPrice;

    if (projectPhase !== 0 && !projectPhase) {
      projectPhase = getProjectPhase(result.data?.[0]?.siteRoleCode);
    }
    if (unitPrice === null | unitPrice === "" | unitPrice === undefined) {
      unitPrice = this.state.unitPrice;
    }

    text =
      "【名　　前】：" +
      result.data[0].employeeFullName +
      "　" +
      result.data[0].nationalityName +
      "　" +
      this.state.genders.find((v) => v.code === result.data[0].genderStatus)
        .name +
      "\n" +
      "【所　　属】：" +
      (employeeStatus === "子会社社員" ? "社員" : employeeStatus) +
      "\n" +
      (result.data[0].age === null ||
        result.data[0].age === undefined ||
        result.data[0].age === ""
        ? ""
        : "【年　　齢】：" + result.data[0].age + "歳\n") +
      (result.data[0].nearestStation === "" ||
        result.data[0].nearestStation === null ||
        result.data[0].nearestStation === undefined
        ? ""
        : "【最寄り駅】：" +
        this.state.getstations.find(
          (v) => v.code === result.data[0].nearestStation
        ).name +
        "\n") +
      (result.data[0].japaneaseConversationLevel === "" ||
        result.data[0].japaneaseConversationLevel === null ||
        result.data[0].japaneaseConversationLevel === undefined
        ? ""
        : "【日本　語】：" +
        this.state.japaneaseConversationLevels.find(
          (v) => v.code === result.data[0].japaneaseConversationLevel
        ).name +
        "\n") +
      (result.data[0].englishConversationLevel === "" ||
        result.data[0].englishConversationLevel === null ||
        result.data[0].englishConversationLevel === undefined
        ? ""
        : "【英　　語】：" +
        this.state.englishConversationLevels.find(
          (v) => v.code === result.data[0].englishConversationLevel
        ).name +
        "\n") +
      (result.data[0].yearsOfExperience === null ||
        result.data[0].yearsOfExperience === undefined ||
        result.data[0].yearsOfExperience === ""
        ? ""
        : "【経験年数】：" + result.data[0].yearsOfExperience + "年\n") +
      (result.data[0].comeToJapanYearAndMonth === null ||
        result.data[0].comeToJapanYearAndMonth === undefined ||
        result.data[0].comeToJapanYearAndMonth === ""
        ? ""
        : "【来日年数】：" + result.data[0].comeToJapanYearAndMonth + "年\n") +
      (projectPhase !== 0 && !projectPhase
        ? ""
        : "【対応工程】：" +
        this.state.projectPhases.find(
          (v) => v.code === projectPhase
        )?.name +
        "から\n") +
      (developLanguage === null ||
        developLanguage === undefined ||
        developLanguage === ""
        ? ""
        : "【得意言語】：" + developLanguage + "\n") +
      (unitPrice === null ||
        unitPrice === undefined ||
        unitPrice === ""
        ? ""
        : "【単　　価】：" + unitPrice / 10000 + "万円\n") +
      "【稼働開始】：" +
      /** 修复12月 + 1 变成了13月的问题 */
      (Number(admissionEndDate) <
        this.getNextMonth(new Date(), 0).replace("/", "")
        ? "即日\n"
        : publicUtils
          .formateDate(beginMonth, false)
          .substring(0, 6)
          .replace(/\b(0+)/gi, "")
          .split("")
          .toSpliced(4, 0, "/")
          .join("") + "\n") +
      ("【営業状況】：" +
        (this.getSalesProgressCodeName(salesProgressCode) + '\n'
        )) +
      (remark === "" || remark === " " ? "" : "【備　　考】：" + remark + "\n");
    this.setState(
      {
        copyText: text,
      },
      () => {
        setTimeout(() => {
          this.myRef.current.click(); // 模拟点击事件，实现复制
        }, 100);
      }
    );
  };

  formatDate = (time) => {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();

    return `${year}-${this.padZero(month)}-${this.padZero(day)} ${this.padZero(hours)}:${this.padZero(minutes)}`;
  };

  padZero = (value) => {
    return value.toString().padStart(2, '0');
  };

  downloadResume = (resumeInfo, no) => {
    let fileKey = "";
    let downLoadPath = "";
    if (resumeInfo !== null && resumeInfo.split("file/").length > 1) {
      fileKey = resumeInfo.split("file/")[1];
      downLoadPath = (
        resumeInfo.substring(0, resumeInfo.lastIndexOf("/") + 1) +
        (no === 1 ? this.state.resumeName1 : this.state.resumeName2)
      ).replaceAll("/", "//");
    }
    axios
      .post(this.state.serverIP + "s3Controller/downloadFile", {
        fileKey: fileKey,
        downLoadPath: downLoadPath,
      })
      .then((result) => {
        let path = downLoadPath.replaceAll("//", "/");
        if (no === 1) {
          publicUtils.resumeDownload(path, this.state.serverIP, null);
        } else if (no === 2) {
          publicUtils.resumeDownload(path, this.state.serverIP, null);
        }
      })
      .catch(function (error) {
        notification.error({
          message: "サーバーエラー",
          description: "ファイルが存在しません。",
          placement: "topLeft",
        });
      });
  };

  makeDirectoryOld = () => {
    axios
      .post(this.state.serverIP + "salesSituation/makeDirectory", {
        salesYearAndMonth: this.state.salesYearAndMonth,
        employeeNoList: this.state.allEmpNoName,
        resumeInfo1List: this.state.allresumeInfo1,
        resumeInfo2List: this.state.allresumeInfo2,
      })
      .then((response) => {
        if (response.data.errorsMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.errorsMessage,
          });
        } else {
          this.setState({
            myDirectoryShow: true,
            errorsMessageShow: false,
            errorsMessageValue: "",
          });
          setTimeout(() => this.setState({ myDirectoryShow: false }), 3000);
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
    this.setState({
      makeDirectoryFalg: false,
    });
  };

  folderDownload = () => {
    publicUtils.folderDownload(
      "C:/file/salesFolder/" + this.state.salesYearAndMonth + ".rar",
      this.state.serverIP
    );
  };

  fromCodeToNameLanguage = (code) => {
    if (
      this.state.developLanguages.find((v) => v.code === code) === undefined ||
      this.state.developLanguages.find((v) => v.code === code) === null
    ) {
      return;
    } else {
      return this.state.developLanguages.find((v) => v.code === code).name;
    }
  };

  padding1 = (num, length) => {
    for (var len = (num + "").length; len < length; len = num.length) {
      num = "0" + num;
    }
    return num;
  };

  toCircled = (num) => {
    if (num <= 20) {
      const base = "①".charCodeAt(0);
      return String.fromCharCode(base + num - 1);
    }
    if (num <= 35) {
      const base = "㉑".charCodeAt(0);
      return String.fromCharCode(base + num - 21);
    }
    const base = "㊱".charCodeAt(0);
    return String.fromCharCode(base + num - 36);
  };

  makeDirectory = () => {
    var text = "";
    var promiseList = [];
    this.setState({ loading: false });
    for (let i = 0; i < this.state.salesSituationLists.length; i++) {
      promiseList.push(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            axios
              .post(
                this.state.serverIP + "salesSituation/getPersonalSalesInfo",
                { employeeNo: this.state.salesSituationLists[i].employeeNo }
              )
              .then((result) => {
                let employeeStatus =
                  this.state.employees.find(
                    (v) => v.code === result.data[0].employeeStatus
                  ).name || "";
                let developLanguage = [
                  this.fromCodeToNameLanguage(result.data[0].developLanguage1),
                  this.fromCodeToNameLanguage(result.data[0].developLanguage2),
                  this.fromCodeToNameLanguage(result.data[0].developLanguage3),
                  this.fromCodeToNameLanguage(result.data[0].developLanguage4),
                  this.fromCodeToNameLanguage(result.data[0].developLanguage5),
                ]
                  .filter(function (s) {
                    return s && s.trim();
                  })
                  .join("、");
                let admissionEndDate =
                  this.state.salesSituationLists[i].admissionEndDate === null ||
                    this.state.salesSituationLists[i].admissionEndDate === ""
                    ? this.state.salesSituationLists[i].scheduledEndDate
                    : this.state.salesSituationLists[
                      i
                    ].admissionEndDate.substring(0, 6);
                let beginMonth =
                  result.data[0].theMonthOfStartWork === null ||
                    result.data[0].theMonthOfStartWork === ""
                    ? new Date(
                      this.getNextMonthTemp(
                        admissionEndDate === null || admissionEndDate === ""
                          ? new Date()
                          : publicUtils.converToLocalTime(
                            admissionEndDate,
                            false
                          ),
                        1
                      )
                    ).getTime()
                    : new Date(result.data[0].theMonthOfStartWork).getTime();
                let salesProgressCode =
                  this.state.salesSituationLists[i].salesProgressCode;
                let interviewDate =
                  this.state.salesSituationLists[i].interviewDate1 !== "" &&
                    this.state.salesSituationLists[i].interviewDate1 !== null &&
                    this.state.salesSituationLists[i].interviewDate2 !== "" &&
                    this.state.salesSituationLists[i].interviewDate2 !== null
                    ? this.state.salesSituationLists[i].interviewDate1 <
                      this.state.salesSituationLists[i].interviewDate2
                      ? this.state.salesSituationLists[i].interviewDate1
                      : this.state.salesSituationLists[i].interviewDate2
                    : this.state.salesSituationLists[i].interviewDate1 !== "" &&
                      this.state.salesSituationLists[i].interviewDate1 !== null
                      ? this.state.salesSituationLists[i].interviewDate1
                      : this.state.salesSituationLists[i].interviewDate2 !== "" &&
                        this.state.salesSituationLists[i].interviewDate2 !== null
                        ? this.state.salesSituationLists[i].interviewDate2
                        : "";
                let remark =
                  result.data[0].remark === null ||
                    result.data[0].remark === "" ||
                    result.data[0].remark === undefined
                    ? (this.state.salesSituationLists[i].remark1 === null
                      ? ""
                      : this.state.salesSituationLists[i].remark1 + " ") +
                    (this.state.salesSituationLists[i].remark2 === null
                      ? ""
                      : this.state.salesSituationLists[i].remark2)
                    : result.data[0].remark;
                if (interviewDate !== "") {
                  var myDate = new Date();
                  myDate =
                    myDate.getFullYear() +
                    this.padding1(myDate.getMonth() + 1, 2) +
                    this.padding1(myDate.getDate(), 2);
                  if (interviewDate.substring(0, 8) >= myDate) {
                    interviewDate =
                      " " +
                      interviewDate.substring(4, 6) +
                      "/" +
                      interviewDate.substring(6, 8) +
                      " " +
                      interviewDate.substring(8, 10) +
                      ":" +
                      interviewDate.substring(10, 12);
                  } else {
                    interviewDate = "";
                  }
                }
                resolve(
                  this.toCircled(i + 1) +
                  "\n" +
                  "【名　　前】：" +
                  result.data[0].employeeFullName +
                  "　" +
                  result.data[0].nationalityName +
                  "　" +
                  this.state.genders.find(
                    (v) => v.code === result.data[0].genderStatus
                  ).name +
                  "\n" +
                  "【所　　属】：" +
                  (employeeStatus === "子会社社員"
                    ? "社員"
                    : employeeStatus) +
                  "\n" +
                  (result.data[0].age === null ||
                    result.data[0].age === undefined ||
                    result.data[0].age === ""
                    ? ""
                    : "【年　　齢】：" + result.data[0].age + "歳\n") +
                  (result.data[0].nearestStation === "" ||
                    result.data[0].nearestStation === null ||
                    result.data[0].nearestStation === undefined
                    ? ""
                    : "【最寄り駅】：" +
                    this.state.getstations.find(
                      (v) => v.code === result.data[0].nearestStation
                    ).name +
                    "\n") +
                  (result.data[0].japaneaseConversationLevel === "" ||
                    result.data[0].japaneaseConversationLevel === null ||
                    result.data[0].japaneaseConversationLevel === undefined
                    ? ""
                    : "【日本　語】：" +
                    this.state.japaneaseConversationLevels.find(
                      (v) =>
                        v.code === result.data[0].japaneaseConversationLevel
                    ).name +
                    "\n") +
                  (result.data[0].englishConversationLevel === "" ||
                    result.data[0].englishConversationLevel === null ||
                    result.data[0].englishConversationLevel === undefined
                    ? ""
                    : "【英　　語】：" +
                    this.state.englishConversationLevels.find(
                      (v) =>
                        v.code === result.data[0].englishConversationLevel
                    ).name +
                    "\n") +
                  (result.data[0].yearsOfExperience === null ||
                    result.data[0].yearsOfExperience === undefined ||
                    result.data[0].yearsOfExperience === ""
                    ? ""
                    : "【業務年数】：" +
                    result.data[0].yearsOfExperience +
                    "年\n") +
                  (result.data[0].projectPhase === "" ||
                    result.data[0].projectPhase === null ||
                    result.data[0].projectPhase === undefined
                    ? ""
                    : "【対応工程】：" +
                    this.state.projectPhases.find(
                      (v) => v.code === result.data[0].projectPhase
                    ).name +
                    "から\n") +
                  (developLanguage === null ||
                    developLanguage === undefined ||
                    developLanguage === ""
                    ? ""
                    : "【得意言語】：" + developLanguage + "\n") +
                  (result.data[0].unitPrice === null ||
                    result.data[0].unitPrice === undefined ||
                    result.data[0].unitPrice === ""
                    ? ""
                    : "【単　　価】：" +
                    result.data[0].unitPrice +
                    "万円\n") +
                  "【稼働開始】：" +
                  (Number(admissionEndDate) + 1 <
                    this.getNextMonth(new Date(), 1).replace("/", "")
                    ? "即日\n"
                    : publicUtils
                      .formateDate(beginMonth, false)
                      .substring(4, 6)
                      .replace(/\b(0+)/gi, "") + "月\n") +
                  (salesProgressCode === "" ||
                    salesProgressCode === null ||
                    salesProgressCode === undefined
                    ? ""
                    : "【営業状況】：" +
                    this.state.salesProgressCodes.find(
                      (v) => v.code === salesProgressCode
                    ).name +
                    (salesProgressCode === "6" ? interviewDate : "") +
                    "\n") +
                  (remark === "" || remark === " "
                    ? ""
                    : "【備　　考】：" + remark + "\n")
                );
              });
          }, Math.random() * 3000);
        })
      );
    }
    Promise.all(promiseList).then((rspList) => {
      rspList.map((val) => {
        text += " " + val + "\n";
        if (val.split("\n")[0] === this.toCircled(rspList.length))
          axios
            .post(this.state.serverIP + "salesSituation/makeDirectory", {
              salesYearAndMonth: this.state.salesYearAndMonth,
              employeeNoList: this.state.allEmpNoName,
              resumeInfo1List: this.state.allresumeInfo1,
              resumeInfo2List: this.state.allresumeInfo2,
              text: text,
            })
            .then((response) => {
              if (response.data.errorsMessage != null) {
                this.setState({
                  errorsMessageShow: true,
                  errorsMessageValue: response.data.errorsMessage,
                });
                this.setState({ loading: true });
              } else {
                this.setState({
                  myDirectoryShow: true,
                  errorsMessageShow: false,
                  errorsMessageValue: "",
                });
                setTimeout(
                  () => this.setState({ myDirectoryShow: false }),
                  3000
                );
                this.setState({ loading: true });
                this.folderDownload();
              }
            })
            .catch((error) => {
              this.setState({ loading: true });
              console.error("Error - " + error);
            });
        this.setState({
          makeDirectoryFalg: false,
        });
      });
    });
  };

  setValue = (unitPrice, yearsOfExperience, japaneaseConversationLevel, nearestStation, developLanguage) => {
    let salesSituationLists = this.state.salesSituationLists;
    salesSituationLists[Number(this.state.rowNo) - 1].unitPrice = unitPrice;
    salesSituationLists[Number(this.state.rowNo) - 1].yearsOfExperience =
      yearsOfExperience;
    if (japaneaseConversationLevel === "" || japaneaseConversationLevel === null) {
      let japaneseLevelCode = salesSituationLists[Number(this.state.rowNo) - 1].japaneseLevelCode
      salesSituationLists[Number(this.state.rowNo) - 1].japaneaseLevelDesc = this.state.japaneseLevels.find((v) => v.code === japaneseLevelCode).name;
    } else {
      let temp = this.state.japaneaseConversationLevels.find((v) => v.code === japaneaseConversationLevel).name
      if (temp.endsWith('業務確認')) {
        temp = temp.substring(0, temp.length - 5);
      }
      salesSituationLists[Number(this.state.rowNo) - 1].japaneaseLevelDesc = temp;
    }

    salesSituationLists[Number(this.state.rowNo) - 1].nearestStation = this.state.getstations.find((v) => v.code === nearestStation).name;
    let developLanguageArry = developLanguage.split("、");
    if (developLanguageArry.length - 1 > 3) {
      developLanguage = developLanguageArry.slice(0, 4).join();
    }

    salesSituationLists[Number(this.state.rowNo) - 1].developLanguage = developLanguage;
    this.setState({
      salesSituationLists: salesSituationLists,
      unitPrice: unitPrice
    });
  };

  download = (filename, text) => {
    var pom = document.createElement("a");
    pom.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    pom.setAttribute("download", filename);
    if (document.createEvent) {
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  };

  // TABLE共通
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

  // react download Excel-----------メモ
  /*
   * handleDownload = (resumeInfo) => { var resumeInfos= new Array();
   * console.log(resumeInfo); resumeInfos=resumeInfo.split("/");
   * console.log(resumeInfos); axios({ method: "POST", //请求方式 url:
   * "http://IP/download", //下载地址 data: { name: resumeInfos[6] }, //请求内容
   * responseType: 'arraybuffer' }) .then((response) => {
   * console.log(response); if (response.data.byteLength === 0) { alert('no
   * resume'); } else { let blob = new Blob([response.data], { type:
   * 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   * let downloadElement = document.createElement('a'); let href =
   * window.URL.createObjectURL(blob); // 创建下载的链接 downloadElement.href = href;
   * downloadElement.download = resumeInfos[6]; // 下载后文件名
   * document.body.appendChild(downloadElement); downloadElement.click(); //
   * 点击下载 document.body.removeChild(downloadElement); // 下载完成移除元素
   * window.URL.revokeObjectURL(href); // 释放掉blob对象 } }).catch((error) => {
   * alert('文件下载失败', error); }); }
   */

  shuseiTo = (actionType) => {
    var path = {};
    const sendValue = {
      salesYearAndMonth: this.state.salesYearAndMonth,
      selectetRowIds: this.refs.table.state.selectedRowKeys,
      linkDisableFlag: this.state.linkDisableFlag, // linkDisableFlag
      sendLetterFalg: this.state.sendLetterFalg,
      proposeClassificationCode: "2",
    };
    switch (actionType) {
      case "selectAll":
        break;
      case "detailUpdate":
        this.changeDataStatus(
          this.state.salesSituationLists[this.state.rowNo - 1],
          this.state.salesYearAndMonth
        );
        break;
      case "detail":
        path = {
          pathname: "/subMenuManager/employeeUpdateNew",
          state: {
            actionType: "update",
            id: String(this.refs.table.state.selectedRowKeys),
            backPage: "manageSituation",
            sendValue: sendValue,
          },
        };
        break;
      case "salesSendLetter":
        path = {
          pathname: "/subMenuManager/salesSendLetter",
          state: {
            backPage: "manageSituation",
            sendValue: sendValue,
            selectetRowIds: this.refs.table.state.selectedRowKeys,
          },
        };
        break;
      case "siteInfo":
        path = {
          pathname: "/subMenuManager/siteInfo",
          state: {
            employeeNo: String(this.refs.table.state.selectedRowKeys),
            backPage: "manageSituation",
            sendValue: sendValue,
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  };

  render() {
    const selectRow = {
      mode: this.state.modeSelect,
      bgColor: "pink",
      clickToSelectAndEditCell: true,
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.state.onSelectFlag
        ? this.handleRowSelect
        : this.handleCheckModeSelect,
    };

    const cellEdit = {
      mode: "click",
      blurToSave: true,
      afterSaveCell: this.afterSaveCell,
    };

    const options = {
      noDataText: (
        <i className="" style={{ fontSize: "24px" }}>
          show what you want to show!
        </i>
      ),
      defaultSortOrder: "dsc",
      sizePerPage: SIZE_PER_SIZE,
      pageStartIndex: 1,
      paginationSize: 3,
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      hideSizePerPage: true,
      alwaysShowAllBtns: true,
      paginationShowsTotal: this.renderShowsTotal,
    };

    const tableSelect1 = (onUpdate, props) => (
      <TableSelect dropdowns={this} flag={1} onUpdate={onUpdate} {...props} />
    );
    const tableSelect2 = (onUpdate, props) => (
      <TableSelect dropdowns={this} flag={2} onUpdate={onUpdate} {...props} />
    );
    const tableSelect3 = (onUpdate, props) => (
      <TableSelect dropdowns={this} flag={3} onUpdate={onUpdate} {...props} />
    );
    const tableSelect4 = (onUpdate, props) => (
      <TableSelect dropdowns={this} flag={4} onUpdate={onUpdate} {...props} />
    );

    return (
      <div>
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={"更新成功！"}
            type={"success"}
          />
        </div>
        <div style={{ display: this.state.myDirectoryShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myDirectoryShow}
            message={"作成完了！"}
            type={"success"}
          />
        </div>
        <div
          style={{ display: this.state.errorsMessageShow ? "block" : "none" }}
        >
          <ErrorsMessageToast
            errorsMessageShow={this.state.errorsMessageShow}
            message={this.state.errorsMessageValue}
            type={"success"}
          />
        </div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.closeDaiolog}
          show={this.state.daiologShowFlag}
          dialogClassName="modal-bankInfo"
        >
          <Modal.Header closeButton>
            <Col className="text-center">
              <h2>営業文章</h2>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <SalesContent
              allState={this}
              sendValue={{
                empNo: this.state.employeeNo,
                salesProgressCode: this.state.salesProgressCode,
                unitPrice:
                  Number(this.state.unitPrice) < 1000
                    ? Number(this.state.unitPrice) * 10000
                    : Number(this.state.unitPrice),
                remark:
                  (this.state.remark1 === "" || this.state.remark2 === ""
                    ? ""
                    : "①") +
                  this.state.remark1 +
                  " " +
                  (this.state.remark1 === "" || this.state.remark2 === ""
                    ? ""
                    : "②") +
                  this.state.remark2,
                interviewDate:
                  this.state.interviewDate1 !== "" &&
                    this.state.interviewDate2 !== ""
                    ? this.state.interviewDate1 < this.state.interviewDate2
                      ? this.state.interviewDate1
                      : this.state.interviewDate2
                    : this.state.interviewDate1 !== ""
                      ? this.state.interviewDate1
                      : this.state.interviewDate2,
                admissionEndDate: this.state.admissionEndDate,
              }}
            />
          </Modal.Body>
        </Modal>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.closeInterviewlog}
          show={this.state.interviewShowFlag}
          dialogClassName="modal-interviewInfo"
        >
          <Modal.Header closeButton>
            <Col className="text-center">
              <h2>面談情報</h2>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <InterviewInformation
              allState={this}
              sendValue={{
                interviewLists: this.state.salesSituationLists,
                yearMonth: this.state.yearMonth,
              }}
            />
          </Modal.Body>
        </Modal>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.closeFinishList}
          show={this.state.finishListShowFlag}
          dialogClassName="modal-finish"
        >
          <Modal.Header closeButton>
            <Col className="text-center">
              <h2>終了リスト</h2>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <FinishList
              allState={this}
              sendValue={{
                interviewLists: this.state.salesSituationLists,
                yearMonth: this.state.yearMonth,
                history: this.props.history,
              }}
            />
          </Modal.Body>
        </Modal>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={this.closeSiteList}
          show={this.state.siteListShowFlag}
          dialogClassName="modal-finish"
        >
          <Modal.Header closeButton>
            <Col className="text-center">
              <h2>現場期限</h2>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <SiteTermList
              allState={this}
              sendValue={{
                interviewLists: this.state.salesSituationLists,
                yearMonth: this.state.yearMonth,
                history: this.props.history,
              }}
            />
          </Modal.Body>
        </Modal>
        <Row inline="true">
          <Col className="text-center">
            <h2>営業状況確認一覧</h2>
          </Col>
        </Row>
        <Form onSubmit={this.savealesSituation}>
          <Row hidden>
            <Col sm={4}>
              <InputGroup size="sm" className="mb-3">
                <FormControl
                  placeholder="社員NO"
                  autoComplete="off"
                  defaultValue={this.state.employeeNo}
                  size="sm"
                  name="employeeNo"
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    年月
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Append>
                  <DatePicker
                    selected={this.state.yearMonth}
                    onChange={this.setEndDate}
                    autoComplete="off"
                    locale="ja"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    className="form-control form-control-sm"
                    dateFormat="yyyy/MM"
                    id="datePicker"
                  />
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Label style={{ color: "#000000" }}>営業情報設定</Form.Label>
            </Col>
            <Col sm={6}>
              <div style={{ float: "right" }}>
                {/*<Form.Label style={{ "color": "#000000" }}>面談情報</Form.Label>*/}
                <Button
                  size="sm"
                  variant="info"
                  onClick={this.changeState}
                  disabled={this.state.linkDisableFlag}
                >
                  <FontAwesomeIcon icon={faSave} />{" "}
                  {" 更新"}
                </Button>
                <font style={{ marginLeft: "2px", marginRight: "2px" }}></font>
                <Button
                  onClick={this.openInterviewlog}
                  size="sm"
                  variant="info"
                  name="clickButton"
                >
                  <FontAwesomeIcon icon={faBook} /> 面談情報
                </Button>
                <font style={{ marginLeft: "2px", marginRight: "2px" }}></font>
                <Button
                  onClick={this.openFinishList}
                  size="sm"
                  variant="info"
                  name="clickButton"
                >
                  <FontAwesomeIcon icon={faBlender} /> 終了リスト
                </Button>
                {/*<font style={{ marginLeft: "2px", marginRight: "2px" }}></font>
                <Button
                  onClick={this.makeDirectory}
                  size="sm"
                  variant="info"
                  name="clickButton"
                >
                  <FontAwesomeIcon icon={faDownload} />{" "}
                  {this.state.makeDirectoryFalg
                    ? "営業フォルダ作成"
                    : "営業フォルダ更新"}
                </Button>*/}
                <font style={{ marginLeft: "2px", marginRight: "2px" }}></font>
                <Button
                  onClick={this.openSiteList}
                  size="sm"
                  variant="info"
                  name="clickButton"
                >
                  <FontAwesomeIcon icon={faBlender} /> 現場期限
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    優先度
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={this.valueChange}
                  name="salesPriorityStatus"
                  value={this.state.salesPriorityStatus}
                  autoComplete="off"
                  disabled={
                    false
                  }
                >
                  {this.state?.salesPriorityStatuss.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </InputGroup>
            </Col>
            <Col sm={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    個人希望
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.hopeRemark}
                  autoComplete="off"
                  name="hopeRemark"
                  style={this.state.style}
                  onChange={this.valueChange.bind(this)}
                  size="sm"
                  maxLength="100"
                  readOnly={
                    false
                  }
                />
              </InputGroup>
            </Col>

            <Col sm={2} hidden>
              <InputGroup
                size="sm"
                className="mb-3"
                style={{ flexFlow: "nowrap", width: "200%" }}
              >
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    日付
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Append>
                  <DatePicker
                    selected={this.state.interviewDate1Show}
                    onChange={this.setinterviewDate1}
                    autoComplete="off"
                    locale="ja"
                    showTimeSelect
                    className="form-control form-control-sm"
                    dateFormat="MM/dd HH:mm"
                    minDate={new Date()}
                    id={
                      this.state.readFlag ? "datePickerReadonly" : "datePicker2"
                    }
                    readOnly={this.state.readFlag}
                  />
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col sm={2} hidden>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    場所
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  disabled={this.state.readFlag}
                  name="stationCode1"
                  options={this.state.getstations}
                  getOptionLabel={(option) => (option.name ? option.name : "")}
                  value={
                    this.state.getstations.find(
                      (v) => v.code === this.state.stationCode1
                    ) || ""
                  }
                  onSelect={(event) => this.handleTag(event, "station")}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        id="stationCode1"
                        className="auto form-control Autocompletestyle-situation"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>
            <Col sm={2} hidden>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    お客様
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  disabled={this.state.readFlag}
                  name="interviewCustomer1"
                  options={this.state.customers}
                  getOptionLabel={(option) => (option.name ? option.name : "")}
                  value={
                    this.state.customers.find(
                      (v) => v.code === this.state.interviewCustomer1
                    ) || ""
                  }
                  onSelect={(event) =>
                    this.handleTag(event, "interviewCustomer")
                  }
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        id="interviewCustomer1"
                        className="auto form-control Autocompletestyle-situation"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>
            <Col sm={6}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    備考
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.remark1}
                  autoComplete="off"
                  name="remark1"
                  onChange={this.valueChange}
                  size="sm"
                  maxLength="30"
                  readOnly={false}
                />
                <font className="site-mark"></font>
                <FormControl
                  value={this.state.remark2}
                  autoComplete="off"
                  name="remark2"
                  onChange={this.valueChange}
                  size="sm"
                  maxLength="30"
                  readOnly={false}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row hidden>
            <Col sm={2}>
              <InputGroup
                size="sm"
                className="mb-3"
                style={{ flexFlow: "nowrap", width: "200%" }}
              >
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    日付
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Append>
                  <DatePicker
                    selected={this.state.interviewDate2Show}
                    onChange={this.setinterviewDate2}
                    autoComplete="off"
                    locale="ja"
                    showTimeSelect
                    className="form-control form-control-sm"
                    dateFormat="MM/dd HH:mm"
                    minDate={new Date()}
                    id={
                      this.state.readFlag ? "datePickerReadonly" : "datePicker2"
                    }
                    readOnly={this.state.readFlag}
                  />
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col sm={2}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    場所
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  disabled={this.state.readFlag}
                  name="stationCode2"
                  options={this.state.getstations}
                  getOptionLabel={(option) => (option.name ? option.name : "")}
                  value={
                    this.state.getstations.find(
                      (v) => v.code === this.state.stationCode2
                    ) || ""
                  }
                  onSelect={(event) => this.handleTag(event, "station")}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        id="stationCode2"
                        className="auto form-control Autocompletestyle-situation"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>
            <Col sm={2}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    お客様
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  disabled={this.state.readFlag}
                  name="interviewCustomer2"
                  options={this.state.customers}
                  getOptionLabel={(option) => (option.name ? option.name : "")}
                  value={
                    this.state.customers.find(
                      (v) => v.code === this.state.interviewCustomer2
                    ) || ""
                  }
                  onSelect={(event) =>
                    this.handleTag(event, "interviewCustomer")
                  }
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        id="interviewCustomer2"
                        className="auto form-control Autocompletestyle-situation"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>
          </Row>
          <div hidden>
            <div style={{ textAlign: "center" }}></div>
          </div>
          <Row>
            <Col sm={3}>
              <div style={{ float: "left" }}>
                {/*<Button onClick={this.selectAllLists} size="sm" variant="info" name="clickButton"><FontAwesomeIcon icon={faListOl} /> すべて選択</Button>{' '}*/}
                <Button
                  onClick={this.shuseiTo.bind(this, "detail")}
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={this.state.linkDisableFlag}
                >
                  <FontAwesomeIcon icon={faIdCard} /> 個人情報
                </Button>{" "}
                <Button
                  onClick={this.shuseiTo.bind(this, "siteInfo")}
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={this.state.linkDisableFlag}
                >
                  <FontAwesomeIcon icon={faBuilding} /> 現場情報
                </Button>{" "}
                <Button
                  onClick={this.shuseiTo.bind(this, "salesSendLetter")}
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={this.state.sendLetterFalg}
                >
                  <FontAwesomeIcon icon={faEnvelope} /> お客様送信
                </Button>{" "}
                {/*<Button onClick={this.folderDownload} size="sm" variant="info" name="clickButton" disabled={this.state.makeDirectoryFalg}><FontAwesomeIcon icon={faDownload} /> 営業フォルダ</Button>{' '}*/}
              </div>
            </Col>
            <Col sm={2}>
              <InputGroup size="sm">
                <InputGroup.Prepend>
                  <InputGroup.Text
                    id="inputGroup-sizing-sm"
                    className="input-group-indiv"
                  >
                    完成率
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={this.state.completePercet} disabled />
              </InputGroup>
            </Col>
            <Col sm={1}>
            </Col>
            <Col sm={6}>
              <div style={{ float: "right" }}>
                <Button
                  onClick={this.shuseiTo.bind(this, "detailUpdate")}
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={
                    !this.state.linkDisableFlag || !this.state.checkSelect
                      ? false
                      : true
                  }
                >
                  <FontAwesomeIcon icon={faBuilding} /> 明細更新
                </Button>{" "}
                <Button
                  size="sm"
                  variant="info"
                  name="clickButton"
                  id="csvDownload"
                  onClick={this.csvDownload.bind(this)}
                  disabled={this.state.salesSituationLists.length > 0 ? false : true}
                >
                  <FontAwesomeIcon icon={faDownload} /> CSV
                </Button>{" "}
                <Button
                  onClick={this.showAlphabetName}
                  size="sm"
                  variant="info"
                >
                  ローマ字
                </Button>{" "}
                <Button
                  id="copyUrl"
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={this.state.linkDisableFlag}
                  onClick={() => {
                    this.getCopyText();
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} /> コピー
                </Button>{" "}
                <Button
                  onClick={this.openDaiolog}
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={this.state.linkDisableFlag}
                >
                  <FontAwesomeIcon icon={faBook} /> 営業文章
                </Button>{" "}
                <Button
                  onClick={this.downloadResume.bind(
                    this,
                    this.state.resumeInfo1,
                    1
                  )}
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={
                    this.state.linkDisableFlag ||
                      this.state.resumeInfo1 === null ||
                      this.state.resumeInfo1 === ""
                      ? true
                      : false
                  }
                >
                  <FontAwesomeIcon icon={faDownload} />
                  {this.state.linkDisableFlag ||
                    this.state.resumeInfo1 === null ||
                    this.state.resumeInfo1 === ""
                    ? "履歴書1"
                    : this.state.resumeName1.split("_")[1]}
                  {" " + this.state.resumeDate.slice(0, 10)}
                </Button>{" "}
                {/* <Button
                  onClick={this.downloadResume.bind(
                    this,
                    this.state.resumeInfo2,
                    2
                  )}
                  size="sm"
                  variant="info"
                  name="clickButton"
                  disabled={
                    this.state.linkDisableFlag ||
                    this.state.resumeInfo2 === null ||
                    this.state.resumeInfo2 === ""
                      ? true
                      : false
                  }
                >
                  <FontAwesomeIcon icon={faDownload} />
                  {this.state.linkDisableFlag ||
                  this.state.resumeInfo2 === null ||
                  this.state.resumeInfo2 === ""
                    ? "履歴書2"
                    : this.state.resumeName2.split("_")[1]}
                </Button> */}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div
              // style={{ overflowX: "scroll" }}
              >
                <BootstrapTable
                  ref="table"
                  data={this.state.salesSituationLists}
                  pagination
                  options={options}
                  selectRow={selectRow}
                  cellEdit={cellEdit}
                  trClassName="customClass"
                  headerStyle={{ background: "#5599FF" }}
                  striped
                  hover
                  condensed
                >
                  <TableHeaderColumn
                    hidden={true}
                    width="0%"
                    dataField="salesDateUpdate"
                    autoValue
                    dataSort={true}
                    editable={false}
                  >
                    salesDateUpdateHid
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="5%"
                    dataField="rowNo"
                    autoValue
                    dataFormat={this.showGreyNo}
                    editable={false}
                  >
                    {<div onClick={this.selectAllLists}>番号</div>}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="employeeNo"
                    editable={false}
                    hidden={true}
                    isKey
                  >
                    社員番号
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="10%"
                    dataField="employeeName"
                    dataFormat={this.showPriority}
                    editable={false}
                  // overflowX
                  >
                    氏名
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="interviewDate1" hidden={true}>
                    面接1日付
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="stationCode1" hidden={true}>
                    面接1場所
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="interviewCustomer1"
                    hidden={true}
                  >
                    面接1客様
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="interviewDate2" hidden={true}>
                    {" "}
                    面接2日付
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="stationCode2" hidden={true}>
                    面接2場所
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="interviewCustomer2"
                    hidden={true}
                  >
                    面接2客様
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="hopeRemark" hidden={true}>
                    個人希望
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="remark1" hidden={true}>
                    備考1
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="remark2" hidden={true}>
                    備考2
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="salesPriorityStatus"
                    hidden={true}
                  >
                    優先度
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="admissionStartDate"
                    hidden={true}
                  >
                    開始時間
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="resumeInfo1" hidden={true}>
                    履歴書1
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="resumeDate" hidden={true}>
                    履歴書1時間
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="resumeInfo2" hidden={true}>
                    履歴書2
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="resumeName1" hidden={true}>
                    履歴書名前1
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="resumeName2" hidden={true}>
                    履歴書名前2
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="10%"
                    dataField="siteRoleCode"
                    dataFormat={this.showGreySiteRoleCodeAndJapanese}
                    editable={false}
                  >
                    役割 · 日本語
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="5%"
                    dataField="yearsOfExperience"
                    dataFormat={this.showGreyYearsOfExperience}
                    editable={false}
                  >
                    年数
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="19%"
                    dataField="developLanguage"
                    dataFormat={this.showGreyDevelopLanguage}
                    editable={false}
                  >
                    開発言語
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="8%"
                    dataField="nearestStation"
                    dataFormat={this.showGreyNearestStation}
                    editable={false}
                  >
                    寄り駅
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="6%"
                    dataField="unitPrice"
                    dataFormat={this.showGreyUnitPrice}
                    editable={false}
                  >
                    単価
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="9%"
                    dataField="salesProgressCode"
                    dataFormat={this.formatType.bind(this)}
                    customEditor={{ getElement: tableSelect2 }}
                  >
                    進捗
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="7%"
                    dataField="customerContractStatus"
                    dataFormat={this.formatcustomerContract}
                    customEditor={{ getElement: tableSelect4 }}
                    hidden
                    editable={
                      this.state.salesProgressCode === "" ||
                        this.state.salesProgressCode === "0" ||
                        this.state.salesProgressCode === "1"
                        ? false
                        : true
                    }
                  >
                    契約区分
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="10%"
                    dataField="customer"
                    dataFormat={this.formatCustome}
                    customEditor={{ getElement: tableSelect1 }}
                    editable={
                      this.state.salesProgressCode === "1" ||
                        this.state.salesProgressCode === "2"
                        ? true
                        : false
                    }
                  >
                    確定客様
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="8%"
                    dataField="price"
                    // editable={
                    //   this.state.salesProgressCode === "0" ||
                    //     this.state.salesProgressCode === "1"
                    //     ? true
                    //     : false
                    // }
                    editColumnClassName="dutyRegistration-DataTableEditingCell"
                    dataFormat={this.showGreyPrice}
                    editable={this.state.priceEditFlag}
                  >
                    確定単価
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="8%"
                    dataField="salesStaff"
                    dataFormat={this.formatStaff}
                    customEditor={{ getElement: tableSelect3 }}
                  >
                    営業担当
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </Col>
          </Row>
        </Form>
        <input type="text" id="snippet" defaultValue="" hidden></input>
        <div className="loadingImageContainer">
          <div className="loadingImage" hidden={this.state.loading}></div>
        </div>
        <span
          style={{ opacity: 0 }}
          id="copyId"
          ref={this.myRef}
          data-clipboard-text={this.state.copyText}
        ></span>
      </div>
    );
  }
}
export default manageSituation;
