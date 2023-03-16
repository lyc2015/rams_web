/* 
社員を検索
 */
import React from "react";
import {
  Button,
  Form,
  Col,
  Row,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import "../asserts/css/development.css";
import "../asserts/css/style.css";
import $ from "jquery";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faUndo,
  faSearch,
  faEdit,
  faTrash,
  faDownload,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import * as publicUtils from "./utils/publicUtils.js";
import { Link } from "react-router-dom";
import * as utils from "./utils/publicUtils.js";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import store from "./redux/store";
import { notification } from "antd";
axios.defaults.withCredentials = true;
registerLocale("ja", ja);

class salesMoneySet extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.valueChange = this.valueChange.bind(this);
    this.socialInsuranceValueChange =
      this.socialInsuranceValueChange.bind(this);
    this.ageValueChange = this.ageValueChange.bind(this);
  }

  // ageValueChange
  ageValueChange = (event) => {
    if (event.target.value > 0) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  // onchange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  socialInsuranceValueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (event.target.value !== "1") {
      this.setState({
        socialInsuranceDate: "",
      });
    }
  };

  // reset
  resetBook = () => {
    this.setState(() => this.resetStates);
  };

  employeeNameFormat = (cell) => {
    return <span title={cell}>{cell}</span>;
  };

  // 初期化データ
  initialState = {
    employeeList: [],
    employeeAdditionList: [],
    resumeInfo1: "",
    resumeName1: "",
    resumeInfo2: "",
    resumeName2: "",
    residentCardInfo: "",
    passportInfo: "",
    genderStatuss: store.getState().dropDown[0],
    intoCompanyCodes: store.getState().dropDown[1],
    employeeFormCodes: store.getState().dropDown[2],
    siteMaster: store.getState().dropDown[3],
    employeeStatuss: store.getState().dropDown[4],
    japaneaseLevelCodes: store.getState().dropDown[5].slice(1),
    residenceCodes: store.getState().dropDown[6],
    nationalityCodes: store.getState().dropDown[7],
    developLanguageMaster: store.getState().dropDown[8].slice(1),
    employeeInfoAll: store.getState().dropDown[9].slice(1),
    employeeInfo: store.getState().dropDown[9].slice(1),
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    customerMaster: store.getState().dropDown[15].slice(1),
    socialInsuranceStatus: store.getState().dropDown[68],
    additionMoneyMap:store.getState().dropDown[83],
    additionMoneyReasonMap:store.getState().dropDown[84],
    additionCountOfNumberMap:store.getState().dropDown[85],
    searchFlag: false,
    employeeNameSelect: "",
    ageFrom: "",
    ageTo: "",
    authorityCode: "",
    linkDisableFlag: true, // linkDisableFlag
    changeFlag: true, // 協力を検索する場合、入社年月->所属
  };
  // リセット reset
  resetStates = {
    employeeName: "",
    employeeFormCode: "",
    employeeStatus: "",
    genderStatus: "",
    ageFrom: "",
    ageTo: "",
    residenceCode: "",
    nationalityCode: "",
    customerNo: "",
    intoCompanyCode: "",
    japaneseLevelCode: "",
    siteRoleCode: "",
    intoCompanyYearAndMonthFrom: "",
    intoCompanyYearAndMonthTo: "",
    kadou: "",
    developLanguage1: "",
    developLanguage2: "",
    socialInsurance: "",
  };

  // 初期化メソッド
  componentDidMount() {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        this.setState({
          authorityCode: result.data[0].authorityCode,
        });
        this.searchEmployee(result.data[0].authorityCode);
      })
      .catch(function (error) {
        //alert(error);
      });
    this.clickButtonDisabled();
    if (this.props.location.state !== undefined) {
      var sendValue = this.props.location.state.sendValue;
      $("#employeeStatus").val(sendValue.employeeStatus);
      $("#genderStatus").val(sendValue.genderStatus);
      $("#customerNo").val(sendValue.customerNo);
      $("#employeeFormCode").val(sendValue.employeeFormCode);
      $("#employeeName").val(sendValue.employeeName);
      $("#ageFrom").val(sendValue.ageFromValue);
      $("#ageTo").val(sendValue.ageToValue);
      $("#intoCompanyCode").val(sendValue.intoCompanyCode);
      $("#developLanguage1").val(sendValue.developLanguage1);
      $("#developLanguage2").val(sendValue.developLanguage2);
      $("#residenceCode").val(sendValue.residenceCode);
      $("#japaneseLevelCode").val(sendValue.japaneseLevelCode);
      $("#nationalityCode").val(sendValue.nationalityCode);
      $("#siteRoleCode").val(sendValue.siteRoleCode);
      $("#kadou").val(sendValue.kadou);
      $("#socialInsurance").val(sendValue.socialInsurance);
      this.setState(
        {
          employeeStatus: sendValue.employeeStatus,
          genderStatus: sendValue.genderStatus,
          customerNo: sendValue.customerNo,
          employeeFormCode: sendValue.employeeFormCode,
          employeeName: sendValue.employeeName,
          ageFrom: sendValue.ageFromValue,
          ageTo: sendValue.ageToValue,
          intoCompanyCode: sendValue.intoCompanyCode,
          developLanguage1: sendValue.developLanguage1,
          developLanguage2: sendValue.developLanguage2,
          residenceCode: sendValue.residenceCode,
          japaneseLevelCode: sendValue.japaneseLevelCode,
          nationalityCode: sendValue.nationalityCode,
          siteRoleCode: sendValue.siteRoleCode,
          kadou: sendValue.kadou,
          socialInsurance: sendValue.socialInsurance,
          authorityCode: sendValue.authorityCode,
          intoCompanyYearAndMonthFrom: utils.converToLocalTime(
            sendValue.intoCompanyYearAndMonthFrom,
            false
          ),
          intoCompanyYearAndMonthTo: utils.converToLocalTime(
            sendValue.intoCompanyYearAndMonthTo,
            false
          ),
          currPage: sendValue.currPage,
          rowSelectEmployeeNoForPageChange:
            sendValue.rowSelectEmployeeNoForPageChange,
          linkDisableFlag: sendValue.linkDisableFlag,
          resumeInfo1: sendValue.resumeInfo1,
          resumeName1: sendValue.resumeName1,
          resumeInfo2: sendValue.resumeInfo2,
          resumeName2: sendValue.resumeName2,
          residentCardInfo: sendValue.residentCardInfo,
          passportInfo: sendValue.passportInfo,
          employeeInfo: sendValue.employeeInfo,
        },
        () => {
          this.searchEmployee(this.state.authorityCode);
        }
      );
    }

    let temp = [];
    for (let i in this.state.employeeStatuss) {
      if (i == 1) {
        let add = { name: "協力以外", code: "5" };
        temp.push(add);
      }
      temp.push(this.state.employeeStatuss[i]);
    }
    this.setState({
      employeeStatuss: temp,
    });
  }

  // 初期化の時、disabledをセットします
  clickButtonDisabled = () => {
    $('button[name="clickButton"]').attr("disabled", true);
    /*
     * this.refs.siteSearchTable.handleSort('asc', 'rowNo');
     * this.refs.siteSearchTable.handleSort('asc', 'employeeFristName');
     * this.refs.siteSearchTable.handleSort('asc', 'furigana');
     * this.refs.siteSearchTable.handleSort('asc', 'alphabetName');
     * this.refs.siteSearchTable.handleSort('asc', 'birthday');
     * this.refs.siteSearchTable.handleSort('asc', 'phoneNo');
     * this.refs.siteSearchTable.handleSort('asc', 'stationName');
     * this.refs.siteSearchTable.handleSort('asc',
     * 'intoCompanyYearAndMonth');
     * this.refs.siteSearchTable.handleSort('asc', 'admissionTime');
     * this.refs.siteSearchTable.handleSort('asc', 'stayPeriod');
     * this.refs.siteSearchTable.handleSort('asc', 'employeeNo');
     */
  };

  // 検索s
  searchEmployee = (authorityCode) => {
    if (this.state.employeeStatus === "1") {
      this.setState({
        changeFlag: false,
      });
    } else {
      this.setState({
        changeFlag: true,
      });
    }
    var age = parseInt(this.state.ageTo) + 1;
    const emp = {
      employeeName:
        this.state.employeeName === "" ? undefined : this.state.employeeName,
      employeeFormCode:
        this.state.employeeFormCode === ""
          ? undefined
          : this.state.employeeFormCode,
      employeeStatus:
        this.state.employeeStatus === ""
          ? undefined
          : this.state.employeeStatus,
      genderStatus:
        this.state.genderStatus === "" ? undefined : this.state.genderStatus,
      ageFrom:
        this.state.ageFrom === "" || this.state.ageFrom === undefined
          ? undefined
          : publicUtils.birthday_age(this.state.ageFrom),
      ageTo:
        this.state.ageTo === "" || this.state.ageTo === undefined
          ? undefined
          : publicUtils.birthday_age(age),
      residenceCode:
        this.state.residenceCode === "" ? undefined : this.state.residenceCode,
      nationalityCode:
        this.state.nationalityCode === ""
          ? undefined
          : this.state.nationalityCode,
      customer:
        this.props.location.state !== undefined
          ? this.state.customerNo
          : publicUtils.labelGetValue(
              $("#customerNo").val(),
              this.state.customerMaster
            ),
      intoCompanyCode:
        this.state.intoCompanyCode === ""
          ? undefined
          : this.state.intoCompanyCode,
      japaneseLevelCode:
        this.state.japaneseLevelCode === "" ||
        this.state.japaneseLevelCode === "0"
          ? undefined
          : this.state.japaneseLevelCode,
      siteRoleCode:
        this.state.siteRoleCode === "" ? undefined : this.state.siteRoleCode,
      developLanguage1:
        this.props.location.state !== undefined
          ? this.state.developLanguage1
          : $("#developLanguage1").val() === "" ||
            $("#developLanguage1").val() === "0"
          ? null
          : publicUtils.labelGetValue(
              $("#developLanguage1").val(),
              this.state.developLanguageMaster
            ),
      developLanguage2:
        this.props.location.state !== undefined
          ? this.state.developLanguage2
          : $("#developLanguage2").val() === "" ||
            $("#developLanguage2").val() === "0"
          ? null
          : publicUtils.labelGetValue(
              $("#developLanguage2").val(),
              this.state.developLanguageMaster
            ),
      intoCompanyYearAndMonthFrom:
        this.state.intoCompanyYearAndMonthFrom === "" ||
        this.state.intoCompanyYearAndMonthFrom === null ||
        this.state.intoCompanyYearAndMonthFrom === undefined
          ? undefined
          : publicUtils.formateDate(
              this.state.intoCompanyYearAndMonthFrom,
              false
            ),
      intoCompanyYearAndMonthTo:
        this.state.intoCompanyYearAndMonthTo === "" ||
        this.state.intoCompanyYearAndMonthTo === null ||
        this.state.intoCompanyYearAndMonthTo === undefined
          ? undefined
          : publicUtils.formateDate(
              this.state.intoCompanyYearAndMonthTo,
              false
            ),
      kadou: this.state.kadou === "" ? undefined : this.state.kadou,
      socialInsuranceStatus:
        this.state.socialInsurance === ""
          ? undefined
          : this.state.socialInsurance,
      socialInsuranceDate:
        this.state.socialInsuranceDate === "" ||
        this.state.socialInsuranceDate === null ||
        this.state.socialInsuranceDate === undefined
          ? undefined
          : publicUtils.formateDate(this.state.socialInsuranceDate, true),
      authorityCode:
        authorityCode === null ? this.state.authorityCode : authorityCode,
    };
    axios
      .post(this.state.serverIP + "/salesMoneySet/getMoneySetList", emp)
      .then((response) => {
        if (response.data.errorsMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.errorsMessage,
          });
        } else if (response.data.isNullMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.isNullMessage,
            employeeAdditionList: response.data,
          });
        } else {
          this.setState({
            employeeAdditionList: response.data,
            errorsMessageShow: false,
          });
        }
        if (
          this.state.rowSelectEmployeeNoForPageChange !== "" &&
          this.state.rowSelectEmployeeNoForPageChange !== undefined
        ) {
          this.setState({
            linkDisableFlag: this.state.linkDisableFlag,
            resumeInfo1: this.state.resumeInfo1,
            resumeName1: this.state.resumeName1,
            resumeInfo2: this.state.resumeInfo2,
            resumeName2: this.state.resumeName2,
            residentCardInfo: this.state.residentCardInfo,
            passportInfo: this.state.passportInfo,
          });

          this.refs.siteSearchTable.setState({
            selectedRowKeys: this.state.rowSelectEmployeeNoForPageChange,
            currPage: this.state.currPage,
          });
          $("#residentCardInfo").prop("disabled", false);
          $("#passportInfo").prop("disabled", false);
          $("#delete").attr("disabled", false);
          $("#update").attr("disabled", false);
          $("#detail").attr("disabled", false);
          $("#wagesInfo").attr("disabled", false);
          $("#workRepot").attr("disabled", false);
          $("#siteInfo").attr("disabled", false);
        } else {
          this.refs.siteSearchTable.setState({
            selectedRowKeys: [],
          });
          $("#resumeInfo1").prop("disabled", true);
          $("#resumeInfo2").prop("disabled", true);
          $("#residentCardInfo").prop("disabled", true);
          $("#passportInfo").prop("disabled", true);
          $("#delete").attr("disabled", true);
          $("#update").attr("disabled", true);
          $("#detail").attr("disabled", true);
          $("#wagesInfo").attr("disabled", true);
          $("#workRepot").attr("disabled", true);
          $("#siteInfo").attr("disabled", true);
        }

        this.setState({
          searchFlag: true,
          rowSelectEmployeeNo:
            this.state.rowSelectEmployeeNoForPageChange !== undefined
              ? this.state.rowSelectEmployeeNoForPageChange
              : "",
        });
      })
      .catch((error) => {
        this.props.history.push("/loginManager");
        console.error("Error - " + error);
      });
  };

  state = {
    intoCompanyYearAndMonthFrom: new Date(),
    intoCompanyYearAndMonthTo: new Date(),
  };

  // 入社年月form
  inactiveintoCompanyYearAndMonthFrom = (date) => {
    this.setState({
      intoCompanyYearAndMonthFrom: date,
    });
  };
  // 入社年月To
  inactiveintoCompanyYearAndMonthTo = (date) => {
    this.setState({
      intoCompanyYearAndMonthTo: date,
    });
  };

  socialInsuranceDateChange = (date) => {
    this.setState({
      socialInsuranceDate: date,
    });
  };

  employeeDelete = () => {
    // 将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
    var a = window.confirm("削除してもよろしいでしょうか？");
    if (a) {
      $("#deleteBtn").click();
    }
  };
  // 隠した削除ボタン
  createCustomDeleteButton = (onClick) => {
    return (
      <Button variant="info" id="deleteBtn" hidden onClick={onClick}>
        删除
      </Button>
    );
  };
  // 隠した削除ボタンの実装
  onDeleteRow = (rows) => {
    const emp = {
      employeeNo: this.state.rowSelectEmployeeNo,
      resumeInfo1: this.state.resumeInfo1,
      resumeInfo2: this.state.resumeInfo2,
      residentCardInfo: this.state.residentCardInfo,
      passportInfo: this.state.passportInfo,
    };
    const tableSize = this.state.employeeAdditionList.length;
    axios
      .post(this.state.serverIP + "employee/deleteEmployeeInfo", emp)
      .then((result) => {
        if (result.data) {
          if (tableSize > 1) {
            this.searchEmployee(this.state.authorityCode);
            // 削除の後で、rowSelectEmployeeNoの値に空白をセットする
            this.setState({
              rowSelectEmployeeNo: "",
            });
            this.setState({ myToastShow: true });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            store.dispatch({
              type: "UPDATE_STATE",
              dropName: "getEmployeeName",
            });
          } else {
            // 削除の後で、rowSelectEmployeeNoの値に空白をセットする
            this.setState({
              rowSelectEmployeeNo: "",
              employeeAdditionList: [],
            });
            this.setState({ myToastShow: true });
            setTimeout(() => this.setState({ myToastShow: false }), 300);
            window.location.reload(); // 刷新当前页面.
          }
        } else {
          this.setState({ myToastShow: false });
        }
      })
      .catch(function (error) {
        notification.error({
          message: "エラー",
          description: "删除错误，请检查程序",
          placement: "topLeft",
        });
      });
  };
  // 削除前のデフォルトお知らせの削除
  customConfirm(next, dropRowKeys) {
    const dropRowKeysStr = dropRowKeys.join(",");
    next();
  }

  // 行Selectファンクション
  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      /* alert(this.state.employeeAdditionList.length); */
      this.setState({
        rowSelectEmployeeNoForPageChange: row.employeeNo,
        rowSelectEmployeeNo: row.employeeNo,
        rowSelectEmployeeName: row.employeeName.replaceAll(" ", ""),
        residentCardInfo: row.residentCardInfo,
        passportInfo: row.passportInfo,
        resumeInfo1: row.resumeInfo1,
        resumeName1: row.resumeName1,
        resumeInfo2: row.resumeInfo2,
        linkDisableFlag: false, // linkDisableFlag
        currPage: this.refs.siteSearchTable.state.currPage,
      });
      this.state.employeeName = row.employeeName
      this.state.employeeStatus = row.employeeStatus
      console.error("employeeNameisSelected=" + this.state.employeeName + "," + row.employeeName)
      $("#residentCardInfo").prop("disabled", false);
      $("#passportInfo").prop("disabled", false);
      $("#delete").attr("disabled", false);
      $("#update").attr("disabled", false);
      $("#detail").attr("disabled", false);
      $("#wagesInfo").attr("disabled", false);
      $("#workRepot").attr("disabled", false);
      $("#siteInfo").attr("disabled", false);
    } else {
      this.state.employeeName = ""
      this.state.employeeStatus = ""
      console.error("employeeName isNotSelected=" + this.state.employeeName + "," + row.employeeName)
      this.setState({
        rowSelectEmployeeNoForPageChange: "",
        rowSelectEmployeeNo: "",
        rowSelectEmployeeName: "",
        linkDisableFlag: true, // linkDisableFlag
        currPage: "",
      });
      $("#residentCardInfo").prop("disabled", true);
      $("#passportInfo").prop("disabled", true);
      $("#delete").attr("disabled", true);
      $("#update").attr("disabled", true);
      $("#detail").attr("disabled", true);
      $("#wagesInfo").attr("disabled", true);
      $("#workRepot").attr("disabled", true);
      $("#siteInfo").attr("disabled", true);
    }
  };

  renderShowsTotal(start, to, total) {
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
  }

  formatBrthday(birthday) {
    let date = birthday;
    birthday = birthday.replace(/[/]/g, "");
    let value =
      publicUtils.converToLocalTime(birthday, true) === ""
        ? ""
        : Math.ceil(
            (new Date().getTime() -
              publicUtils.converToLocalTime(birthday, true).getTime()) /
              31536000000
          );
    date =
      publicUtils.converToLocalTime(birthday, true) === ""
        ? ""
        : date + "(" + value + ")";
    return date;
  }

  formatStayPeriod(stayPeriod) {
    let value =
      publicUtils.converToLocalTime(stayPeriod, false) === ""
        ? ""
        : publicUtils.getFullYearMonth(
            new Date(),
            publicUtils.converToLocalTime(stayPeriod, false)
          );
    return value;
  }

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
        if (values !== null) {
          employeeName = values.text;
        }
        this.setState({
          employeeName: employeeName,
        });
      }
    );
  };

  /**
   * タイプが違う時に、色々な操作をします。
   */
  employeeStatusChange = (event) => {
    const value = event.target.value;
    let employeeInfoList = this.state.employeeInfoAll;
    if (value === "0") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (
          employeeInfoList[i].code.substring(0, 2) !== "BP" &&
          employeeInfoList[i].code.substring(0, 2) !== "SP" &&
          employeeInfoList[i].code.substring(0, 2) !== "SC"
        ) {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({ employeeInfo: newEmpInfoList, employeeName: "" });
    } else if (value === "1") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (employeeInfoList[i].code.substring(0, 2) === "BP") {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({
        intoCompanyYearAndMonthFrom: "",
        intoCompanyCode: "",
        employeeFormCode: "",
        intoCompanyYearAndMonthTo: "",
        employeeInfo: newEmpInfoList,
        employeeName: "",
      });
    } else if (value === "2") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (employeeInfoList[i].code.substring(0, 2) === "SP") {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({ employeeInfo: newEmpInfoList, employeeName: "" });
    } else if (value === "3") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (employeeInfoList[i].code.substring(0, 2) === "SC") {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({ employeeInfo: newEmpInfoList, employeeName: "" });
    } else if (value === "4") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (employeeInfoList[i].code.substring(0, 3) === "BPR") {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({
        intoCompanyYearAndMonthFrom: "",
        intoCompanyCode: "",
        employeeFormCode: "",
        intoCompanyYearAndMonthTo: "",
        employeeInfo: newEmpInfoList,
        employeeName: "",
      });
    } else if (value === "5") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (!(employeeInfoList[i].code.substring(0, 2) === "BP")) {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({ employeeInfo: newEmpInfoList, employeeName: "" });
    } else {
      this.setState({ employeeInfo: employeeInfoList });
    }
    this.setState({ employeeStatus: value });
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

  downloadResume = (resumeInfo, no) => {
    let fileKey = "";
    let downLoadPath = "";
    if (resumeInfo !== null && resumeInfo.split("file/").length > 1) {
      fileKey = resumeInfo.split("file/")[1];
      downLoadPath = (
        resumeInfo.substring(0, resumeInfo.lastIndexOf("_") + 1) +
        (no === 1
          ? this.state.resumeName1.split("_").length > 1
            ? this.state.resumeName1.split("_")[1]
            : this.state.resumeName1
          : this.state.resumeName2.split("_").length > 1
          ? this.state.resumeName2.split("_")[1]
          : this.state.resumeName2) +
        "." +
        resumeInfo.split(".")[resumeInfo.split(".").length - 1]
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
          publicUtils.resumeDownload(
            path,
            this.state.serverIP,
            this.state.resumeName1.split("_").length > 1
              ? this.state.resumeName1.split("_")[1]
              : this.state.resumeName1
          );
        } else if (no === 2) {
          publicUtils.resumeDownload(
            path,
            this.state.serverIP,
            this.state.resumeName2.split("_").length > 1
              ? this.state.resumeName2.split("_")[1]
              : this.state.resumeName2
          );
        }
      })
      .catch(function (error) {
        notification.error({
          message: "エラー",
          description: "ファイルが存在しません。",
          placement: "topLeft",
        });
      });
  };

  checkEmpty = (values) => {
    return values === "" ? "" : "\t" + values;
  };

  getCustomerNo = (event, values) => {
    if (values != null) {
      this.setState({
        customerNo: values.code,
      });
    } else {
      this.setState({
        customerNo: "",
      });
    }
  };
  shuseiTo = (actionType) => {
    var path = {};
    const sendValue = {
      employeeName:
        this.state.employeeName === "" ? undefined : this.state.employeeName,
      employeeFormCode:
        this.state.employeeFormCode === ""
          ? undefined
          : this.state.employeeFormCode,
      employeeStatus:
        this.state.employeeStatus === ""
          ? undefined
          : this.state.employeeStatus,
      genderStatus:
        this.state.genderStatus === "" ? undefined : this.state.genderStatus,
      ageFromValue: this.state.ageFrom === "" ? undefined : this.state.ageFrom,
      ageFrom:
        this.state.ageFrom === ""
          ? undefined
          : publicUtils.birthday_age(this.state.ageFrom),
      ageToValue: this.state.ageFrom === "" ? undefined : this.state.ageTo,
      ageTo:
        this.state.ageTo === ""
          ? undefined
          : publicUtils.birthday_age(this.state.ageTo),
      residenceCode:
        this.state.residenceCode === "" ? undefined : this.state.residenceCode,
      nationalityCode:
        this.state.nationalityCode === ""
          ? undefined
          : this.state.nationalityCode,
      customer: publicUtils.labelGetValue(
        $("#customerNo").val(),
        this.state.customerMaster
      ),
      customerNo:
        this.state.customerMaster === "" ? undefined : this.state.customerNo,
      intoCompanyCode:
        this.state.intoCompanyCode === ""
          ? undefined
          : this.state.intoCompanyCode,
      japaneseLevelCode:
        this.state.japaneseLevelCode === ""
          ? undefined
          : this.state.japaneseLevelCode,
      siteRoleCode:
        this.state.siteRoleCode === "" ? undefined : this.state.siteRoleCode,
      developLanguage1: publicUtils.labelGetValue(
        $("#developLanguage1").val(),
        this.state.developLanguageMaster
      ),
      developLanguage2: publicUtils.labelGetValue(
        $("#developLanguage2").val(),
        this.state.developLanguageMaster
      ),
      intoCompanyYearAndMonthFrom:
        this.state.intoCompanyYearAndMonthFrom === "" ||
        this.state.intoCompanyYearAndMonthFrom === undefined
          ? undefined
          : publicUtils.formateDate(
              this.state.intoCompanyYearAndMonthFrom,
              false
            ),
      intoCompanyYearAndMonthTo:
        this.state.intoCompanyYearAndMonthTo === "" ||
        this.state.intoCompanyYearAndMonthTo === undefined
          ? undefined
          : publicUtils.formateDate(
              this.state.intoCompanyYearAndMonthTo,
              false
            ),
      kadou: this.state.kadou === "" ? undefined : this.state.kadou,
      authorityCode: this.state.authorityCode,
      socialInsurance: this.state.socialInsurance,
      linkDisableFlag: this.state.socialInsurance,
      currPage: this.state.currPage,
      rowSelectEmployeeNoForPageChange:
        this.state.rowSelectEmployeeNoForPageChange,
      resumeInfo1: this.state.resumeInfo1,
      resumeName1: this.state.resumeName1,
      resumeInfo2: this.state.resumeInfo2,
      resumeName2: this.state.resumeName2,
      residentCardInfo: this.state.residentCardInfo,
      passportInfo: this.state.passportInfo,
      employeeInfo: this.state.employeeInfo,
    };
    switch (actionType) {
      case "update":
        path = {
          pathname: "/subMenuManager/employeeUpdateNew",
          state: {
            actionType: "update",
            id: this.state.rowSelectEmployeeNo,
            backPage: "employeeSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "detail":
        path = {
          pathname: "/subMenuManager/employeeDetailNew",
          state: {
            actionType: "detail",
            id: this.state.rowSelectEmployeeNo,
            backPage: "employeeSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "insert":
        path = {
          pathname: "/subMenuManager/employeeInsertNew",
          state: {
            actionType: "insert",
            backPage: "employeeSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "wagesInfo":
        path = {
          pathname: "/subMenuManager/wagesInfo",
          state: {
            employeeNo: this.state.rowSelectEmployeeNo,
            backPage: "employeeSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "siteInfo":
        path = {
          pathname: "/subMenuManager/siteInfo",
          state: {
            employeeNo: this.state.rowSelectEmployeeNo,
            backPage: "employeeSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "workRepot":
        path = {
          pathname: "/subMenuManager/workRepot",
          state: {
            employeeNo: this.state.rowSelectEmployeeNo,
            employeeName: this.state.rowSelectEmployeeName,
            backPage: "employeeSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  };

  test = (event) => {
    if (event.keyCode === 13) {
      this.searchEmployee(this.state.authorityCode);
    }
  };

  render() {
    const {
      employeeFormCode,
      genderStatus,
      employeeStatus,
      ageFrom,
      ageTo,
      residenceCode,
      nationalityCode,
      customer,
      japaneseLevelCode,
      siteRoleCode,
      kadou,
      intoCompanyCode,
      socialInsurance,
      employeeList,
      employeeAdditionList,
      errorsMessageValue,
    } = this.state;
    // テーブルの行の選択
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.handleRowSelect,
    };
    // テーブルの定義
    const options = {
      page: 1,
      sizePerPage: 10,
      pageStartIndex: 1,
      paginationSize: 3,
      prePage: "<",
      nextPage: ">",
      firstPage: "<<",
      lastPage: ">>",
      paginationShowsTotal: this.renderShowsTotal,
      hideSizePerPage: true,
      expandRowBgColor: "rgb(165, 165, 165)",
      deleteBtn: this.createCustomDeleteButton,
      onDeleteRow: this.onDeleteRow,
      handleConfirmDeleteRow: this.customConfirm,
      sortIndicator: false, // 隐藏初始排序箭头
    };

    console.log({ state: this.state }, "render");

    return (
      <div>
        <FormControl
          id="rowSelectEmployeeNo"
          name="rowSelectEmployeeNo"
          hidden
        />
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={"削除成功！"}
            type={"danger"}
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
            <h2>營業金額特別設定</h2>
          </Col>
        </Row>
        <br />
        <Form>
          <div onKeyDown={this.test}>
            <Form.Group>
              <Row>
                <Col sm={3}>
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
                      autoComplete="off"
                    >
                      {this.state.employeeStatuss.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        社員名
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      className="fx1"
                      id="employeeName"
                      name="employeeName"
                      value={
                        this.state.employeeInfo.find(
                          (v) => v.text === this.state.employeeName
                        ) || {}
                      }
                      options={this.state.employeeInfo}
                      getOptionLabel={(option) => option.name || ""}
                      // onSelect={(event) =>
                      //   this.handleTag(event, "employeeName")
                      // }
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
                            className="auto form-control Autocompletestyle-siteInfoSearch-employeeNo w100p"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        加算金額
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      autoComplete="off"
                    >
                      {this.state.additionMoneyMap.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        回數
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      disabled={employeeStatus === "1" ? true : false}
                      name="employeeFormCode"
                      value={employeeFormCode}
                      autoComplete="off"
                    >
                      {this.state.additionCountOfNumberMap.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                </Col>
                <Col sm={3}>
	              <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        開始年月
                      
                      </InputGroup.Text>
                    </InputGroup.Prepend>
	                <DatePicker
	                  selected={this.state.businessStartDate}
	                  onChange={this.businessStartDateChange}
	                  dateFormat={"yyyy/MM"}
	                  autoComplete="off"
	                  locale="ja"
	                  showYearDropdown
	                  yearDropdownItemNumber={15}
	                  scrollableYearDropdown
	                  showMonthYearPicker
	                  showFullMonthYearPicker
	                  // minDate={new Date()}
	                  showDisabledMonthNavigation
	                  className="form-control form-control-sm"
	                  id="customerInfoDatePicker-customerInfoSearch"
	                  name="businessStartDate"
	                />
	              </InputGroup>
	            </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        加算理由
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="siteRoleCode"
                      value={siteRoleCode}
                      autoComplete="off"
                    >
                      {this.state.additionMoneyReasonMap.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
          </div>
        </Form>
        <div style={{ textAlign: "center" }}>
          <Button
            size="sm"
            onClick={this.shuseiTo.bind(this, "insert")}
            variant="info"
          >
            <FontAwesomeIcon icon={faSave} /> 登錄
          </Button>{" "}
	      <Button
	          size="sm"
	          onClick={this.employeeDelete}
	          id="delete"
	          variant="info"
	      >
	         <FontAwesomeIcon icon={faTrash} /> 削除
	      </Button>
        </div>
        <div style={{ height: "10px" }}></div>
        <div>
          <Row>
            <Col sm={12}>
              <BootstrapTable
                ref="siteSearchTable"
                data={employeeAdditionList}
                pagination={true}
                options={options}
                deleteRow
                selectRow={selectRow}
                headerStyle={{ background: "#5599FF" }}
                striped
                hover
                condensed
              >
                <TableHeaderColumn
                  width="6%"
                  tdStyle={{ padding: ".45em" }}
                  dataField="id"
                  isKey
                  dataSort
                >
                  番号
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="10%"
                  tdStyle={{ padding: ".45em" }}
                  dataField="employeeName"
                >
                  氏名
                </TableHeaderColumn>
                
                <TableHeaderColumn
                    width="10%"
                    tdStyle={{ padding: ".45em" }}
                    dataField="yearAndMonth"
                  >
                    開始年月
                </TableHeaderColumn>
                <TableHeaderColumn
                    width="6%"
                    tdStyle={{ padding: ".45em" }}
                  	dataField="additionMoneyCode"
                  >
                    金額
                </TableHeaderColumn>
                <TableHeaderColumn
                    width="20%"
                    tdStyle={{ padding: ".45em" }}
                    dataField="additionMoneyResonCode"
                  >
                    加算理由
                </TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default salesMoneySet;
