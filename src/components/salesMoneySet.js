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
import moment from "moment";
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
  faBuilding,
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
    this.getTableRowStyle = this.getTableRowStyle.bind(this);
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
    tableRowStyle: { color: "#a0a3a1" },
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
    salesStaffDrop: store.getState().dropDown[56]?.slice(1).filter((item) => /^LYC.*/.test(item.code)), // 営業担当
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    customerMaster: store.getState().dropDown[15].slice(1),
    socialInsuranceStatus: store.getState().dropDown[68],
    additionMoneyMap: store.getState().dropDown[83],
    additionMoneyResonCodeMap: store.getState().dropDown[84],
    additionCountOfNumberMap: store.getState().dropDown[85],
    searchFlag: false,
    employeeName: "",
    id: "",
    employeeNo: "",
    additionMoneyCode: "0",
    additionMoneyResonCode: "0",
    additionNumberOfTimesStatus: "0",
    startYearAndMonth: new Date(
      new Date().getMonth() + 1 === 12
        ? new Date().getFullYear() + 1 + "/01"
        : new Date().getFullYear() +
        "/" +
        (new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 2)
          : new Date().getMonth() + 2)
    ).getTime(),
    message: "",
    type: "",
    isUpdateFlag: false,
    myMessageShow: false,
    myUpdateShow: false,
    myDeleteShow: false,
    errorsMessageShow: false,
    isFinalSiteFinish: false,
    errorsMessageValue: "",
    ageFrom: "",
    ageTo: "",
    authorityCode: "",
    linkDisableFlag: true, // linkDisableFlag
    changeFlag: true, // 協力を検索する場合、入社年月->所属
    salesStaff: '', // 営業担当
  };
  // リセット reset
  resetStates = {
    id: "",
    salesStaff: '',
    employeeName: "",
    employeeNo: "",
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
    isUpdateFlag: false,
    isFinalSiteFinish: false,
    additionMoneyCode: "0",
    additionMoneyResonCode: "0",
    additionNumberOfTimesStatus: "0",
    startYearAndMonth: new Date(
      new Date().getMonth() + 1 === 12
        ? new Date().getFullYear() + 1 + "/01"
        : new Date().getFullYear() +
        "/" +
        (new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 2)
          : new Date().getMonth() + 2)
    ).getTime(),
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
            employeeAdditionList: response.data
          });
        } else {
          this.setState({
            employeeAdditionList: response.data,
            errorsMessageShow: false,
          });
        }
        /*if (
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
        }*/

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


  // 削除前のデフォルトお知らせの削除
  customConfirm(next, dropRowKeys) {
    const dropRowKeysStr = dropRowKeys.join(",");
    next();
  }

  // 行Selectファンクション
  handleRowSelect = (row, isSelected, e) => {
    console.log("handleRowSelect isSelected=" + isSelected)
    if (isSelected) {
      this.setState({
        isUpdateFlag: true,
        rowSelectEmployeeNoForPageChange: row.employeeNo,
        rowSelectEmployeeNo: row.employeeNo,
        rowSelectEmployeeName: row.employeeName.replaceAll(" ", ""),
        residentCardInfo: row.residentCardInfo,
        passportInfo: row.passportInfo,
        resumeInfo1: row.resumeInfo1,
        employeeNo: row.employeeNo,
        resumeName1: row.resumeName1,
        resumeInfo2: row.resumeInfo2,
        startYearAndMonth: new Date(row.startYearAndMonth.substring(0, 4), row.startYearAndMonth.substring(5, 6), 0),
        linkDisableFlag: false, // linkDisableFlag
        currPage: this.refs.siteSearchTable.state.currPage,
      });
      this.state.id = row.id
      this.state.isFinalSiteFinish = row.isFinalSiteFinish
      this.state.employeeNo = row.employeeNo
      this.state.employeeName = row.employeeName
      this.state.additionMoneyCode = row.additionMoneyCode
      this.state.additionMoneyResonCode = row.additionMoneyResonCode
      this.state.startYearAndMonth = row.startYearAndMonth
      this.state.additionNumberOfTimesStatus = row.additionNumberOfTimesStatus
      this.state.salesStaff = row.salesStaff

      console.log("handleRowSelect isSelected=" + row.employeeNo + ", " + row.employeeName + ", row.startYearAndMonth=" + row.startYearAndMonth)
      if (row.additionNumberOfTimesStatus == 1) {
        console.log("handleRowSelect startYearAndMonthFix=" + $("#startYearAndMonthFix").val() + ", " + utils.converToYYYYMM($("#startYearAndMonthFix").val()))
        if (utils.converToYYYYMM($("#startYearAndMonthFix").val()) != row.startYearAndMonth) {
          //	$("#startYearAndMonthFix").prop("value", utils.converToYYYY_MM(row.startYearAndMonth));
          this.setState({
            startYearAndMonth: ""
          })
          console.log("handleRowSelect isSelected=" + this.state.startYearAndMonth)
        }
        $("#startYearAndMonthFix").prop("value", utils.converToYYYY_MM(row.startYearAndMonth));
      }
      if (row.employeeNo.substring(0, 3) == "BPR") {
        $("#employeeStatus").prop("value", 4);
        this.state.employeeStatus = 4

      } else if (row.employeeNo.substring(0, 2) == "BP") {
        $("#employeeStatus").prop("value", 1);
        this.state.employeeStatus = 1

      } else if (row.employeeNo.substring(0, 2) == "SP") {
        $("#employeeStatus").prop("value", 2);
        this.state.employeeStatus = 2

      } else if (row.employeeNo.substring(0, 2) == "SC") {
        $("#employeeStatus").prop("value", 3);
        this.state.employeeStatus = 3

      } else {
        $("#employeeStatus").prop("value", 0);
        this.state.employeeStatus = 0
      }

      this.employeeStatusValueChange(this.state.employeeStatus)
      $("#additionMoneyCode").prop("value", row.additionMoneyCode);
      $("#additionMoneyResonCode").prop("value", row.additionMoneyResonCode);
      $("#salesStaff").prop("value", row.salesStaff);
      $("#additionNumberOfTimesStatus").prop("value", row.additionNumberOfTimesStatus);
      if (row.isFinalSiteFinish == true) {
        $("#addOrUpdate").attr("disabled", true);
      } else {
        $("#addOrUpdate").attr("disabled", false);
      }
      $("#residentCardInfo").prop("disabled", false);
      $("#passportInfo").prop("disabled", false);
      $("#delete").attr("disabled", false);
      $("#update").attr("disabled", false);
      $("#detail").attr("disabled", false);
      $("#wagesInfo").attr("disabled", false);
      $("#workRepot").attr("disabled", false);
      $("#siteInfo").attr("disabled", false);
    } else {

      this.state.id = ""
      this.state.isFinalSiteFinish = false
      this.state.employeeNo = ""
      this.state.employeeName = ""
      this.state.employeeStatus = ""
      console.log("handleRowSelect isNotSelected=" + row.employeeNo)

      $("#employeeStatus").prop("value", "");

      this.setState(() => this.resetStates);
      $("#addOrUpdate").attr("disabled", false);
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
        let employeeNo = null;
        let employeeName = null;
        if (values !== null) {
          employeeNo = values.code;
          employeeName = values.text;
        }
        this.setState({
          employeeName: employeeName,
          employeeNo: employeeNo,
        });
      }
    );
  };

  onAdditionMoneyChange = (event) => {
    console.log("onAdditionMoneyChange=" + event.target.value)
    this.setState({
      additionMoneyCode: event.target.value,
    });
  };

  onAdditionMoneyReasonChange = (event) => {
    console.log("onAdditionMoneyReasonChange=" + event.target.value)
    this.setState({
      additionMoneyResonCode: event.target.value,
    });
  };

  getAdditionNumberOfTimesList() {
    var today = new Date();
    var year = today.getFullYear()
    var month = today.getMonth()
    month += 1
    console.log("year=" + year + "， month=" + month)
    if (month <= 6) {
      return [year + "/06", year + "/11"]
    }
    if (month <= 11) {
      return [year + "/11", (year + 1) + "/06"]
    }
    if (month > 11) {
      return [(year + 1) + "/06", (year + 1) + "/11"]
    }
    return ""
  };

  onAdditionNumberOfTimesChange = (event) => {
    console.log("onAdditionNumberOfTimesChange=" + event.target.value)
    this.setState({
      additionNumberOfTimesStatus: event.target.value,
    });

    if (event.target.value == 1) {
      console.log("startYearAndMonthFix=" + utils.convertDate($("#startYearAndMonthFix").val()))
      this.state.startYearAndMonth = utils.convertDate($("#startYearAndMonthFix").val())
    } else {
      console.log("startYearAndMonthFix=" + $("#startYearAndMonth").val())
      this.state.startYearAndMonth = new Date(
        new Date().getMonth() + 1 === 12
          ? new Date().getFullYear() + 1 + "/01"
          : new Date().getFullYear() +
          "/" +
          (new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 2)
            : new Date().getMonth() + 2)
      ).getTime()
    }
    /*$("#startYearAndMonthFix").attr("value", "");*/
  };

  onAdditionNumberOfTimesChangeFix = (event) => {
    console.log("onAdditionNumberOfTimesChangeFix=" + event.target.value + "," + utils.convertDate(event.target.value))
    if (event.target.value !== null) {
      this.setState({
        startYearAndMonth: utils.convertDate(event.target.value)
      });
    } else {
      this.setState({
        startYearAndMonth: "",
      });
    }
  };


  onStartYearAndMonthChange = (date) => {
    console.log("onStartYearAndMonthChange=" + date)
    if (date !== null) {
      this.setState({
        startYearAndMonth: date
      });
    } else {
      this.setState({
        startYearAndMonth: "",
      });
    }
  };

  /**
   * タイプが違う時に、色々な操作をします。
   */
  employeeStatusChange = (event) => {
    const value = event.target.value;
    this.employeeStatusValueChange(value)
  };


  employeeStatusValueChange(value) {
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
  }

  checkEmpty = (values) => {
    return values === "" ? "" : "\t" + values;
  };

  addMoneySet = () => {
    var requestModel = {};
    requestModel["employeeNo"] = this.state.employeeNo;
    requestModel["employeeName"] = this.state.employeeName;
    requestModel["additionMoneyCode"] = this.state.additionMoneyCode;
    requestModel["additionMoneyResonCode"] = this.state.additionMoneyResonCode;
    requestModel["salesStaff"] = this.state.salesStaff;
    requestModel["additionNumberOfTimesStatus"] = this.state.additionNumberOfTimesStatus;
    requestModel["startYearAndMonth"] = utils.formateDate(
      this.state.startYearAndMonth,
      false
    );

    axios
      .post(this.state.serverIP + "salesMoneySet/insertMoneySet", requestModel)
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.setState({
            myMessageShow: true,
            type: "success",
            errorsMessageShow: false,
            myUpdateShow: false,
            myDeleteShow: false,
            isUpdateFlag: false,
            message: "登錄成功",
            employeeStatus: "",
            employeeNo: "",
            employeeName: "",

          });
          setTimeout(() => this.setState({ myMessageShow: false }), 3000);

          $("#employeeStatus").val("");
          $("#employeeName").val("");

          this.setState(() => this.resetStates);
          this.searchEmployee(this.state.authorityCode);
        } else {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue:
            "エラーが発生してしまいました、画面をリフレッシュしてください",
        });
      });
  };

  updateMoneySet = () => {
    var requestModel = {};
    requestModel["id"] = this.state.id;
    requestModel["employeeNo"] = this.state.employeeNo;
    requestModel["employeeName"] = this.state.employeeName;
    requestModel["additionMoneyCode"] = this.state.additionMoneyCode;
    requestModel["additionMoneyResonCode"] = this.state.additionMoneyResonCode;
    requestModel["salesStaff"] = this.state.salesStaff;
    requestModel["additionNumberOfTimesStatus"] = this.state.additionNumberOfTimesStatus;
    requestModel["startYearAndMonth"] = utils.formateDate(
      this.state.startYearAndMonth,
      false
    );

    axios
      .post(this.state.serverIP + "salesMoneySet/updateMoneySet", requestModel)
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.setState({
            myMessageShow: true,
            type: "success",
            errorsMessageShow: false,
            myUpdateShow: false,
            myDeleteShow: false,
            message: "更新成功",

          });
          setTimeout(() => this.setState({ myMessageShow: false }), 3000);

          this.searchEmployee(this.state.authorityCode);
        } else {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue:
            "エラーが発生してしまいました、画面をリフレッシュしてください",
        });
      });
  };

  deleteMoneySet = () => {
    if (this.state.isFinalSiteFinish == true) {
      var confirmDelete = window.confirm("現場終了しました");
      console.log("deleteMoneySet isFinalSiteFinish=" + confirmDelete);
      if (confirmDelete != true) {
        return
      }
    } else {
      var confirmDelete = window.confirm("削除してもよろしいでしょうか？");
      console.log("deleteMoneySet=" + confirmDelete);
      if (confirmDelete != true) {
        return
      }
    }
    var requestModel = {};
    requestModel["id"] = this.state.id;
    axios
      .post(this.state.serverIP + "salesMoneySet/deleteMoneySet", requestModel)
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.setState({
            myMessageShow: true,
            type: "success",
            errorsMessageShow: false,
            myUpdateShow: false,
            myDeleteShow: false,
            isUpdateFlag: false,
            message: "削除成功",
            employeeStatus: "",
            employeeNo: "",
            employeeName: "",
            additionMoneyCode: "",
            additionMoneyResonCode: "",
            salesStaff: "",
            additionNumberOfTimesStatus: "0",
            startYearAndMonth: "",

          });
          setTimeout(() => this.setState({ myMessageShow: false }), 3000);

          $("#employeeStatus").val("");
          $("#employeeName").val("");

          this.setState(() => this.resetStates);
          this.searchEmployee(this.state.authorityCode);
        } else {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue:
            "エラーが発生してしまいました、画面をリフレッシュしてください",
        });
      });
  };

  test = (event) => {
    if (event.keyCode === 13) {
      this.searchEmployee(this.state.authorityCode);
    }
  };


  startYearAndMonthFormat = (cell, row, formatExtraData, index) => {
    if (cell === "") {
      return "";
    }
    if (row.additionNumberOfTimesStatus === "1") {
      return utils.dateFormate(cell) + " (1回)";
    } else {
      console.log("cell ");
      return utils.dateFormate(cell);
    }
  };


  rowNoFormat = (cell) => {
    if (cell === "") {
      return "";
    } else {
      return cell;
    }
  };

  employeeNameFormat = (cell, row) => {
    if (cell === "") {
      return "";
    } else {
      return cell + row.employeeNameTitle;
    }
  };

  additionMoneyCodeFormat = (cell) => {
    var additionMoneyMap = this.state.additionMoneyMap;
    if (cell === "") {
      return "";
    } else {
      for (var i in additionMoneyMap) {
        if (cell === additionMoneyMap[i].code) {
          return additionMoneyMap[i].name;
        }
      }
    }
  };

  additionMoneyResonCodeFormat = (cell) => {
    var additionMoneyResonCodeMap = this.state.additionMoneyResonCodeMap;
    if (cell === "") {
      return "";
    } else {
      for (var i in additionMoneyResonCodeMap) {
        if (cell === additionMoneyResonCodeMap[i].code) {
          return additionMoneyResonCodeMap[i].name;
        }
      }
    }
  };

  salesStaffFormat = (cell) => {
    const { salesStaffDrop } = this.state
    if (cell === "") {
      return "";
    } else {
      for (var i in salesStaffDrop) {
        if (cell === salesStaffDrop[i].code) {
          return salesStaffDrop[i].name || '';
        }
      }
    }
  }

  getTableRowStyle(row, rowIndex) {
    // admissionEndDate 有值且admissionEndDate　 < 现在时间 或者  startYearAndMonth < admissionStartDate的时候置灰
    if (!row) {
      return
    }
    var chooseDate = moment(new Date()).format("YYYYMMDD") ?? '';
    // var chooseDate = utils.formateDate(new Date())

    const { admissionEndDate = "",
      admissionStartDate = "",
      startYearAndMonth = "" } = row

    console.log({
      admissionEndDate,
      admissionStartDate: admissionStartDate?.substring(0, 6),
      startYearAndMonth: startYearAndMonth,
      chooseDate
    }, "getTableRowStyle")


    if ((admissionEndDate && (chooseDate > admissionEndDate)) ||
      (startYearAndMonth < admissionStartDate?.substring(0, 6) ?? '')) {
      // 置灰
      return { color: "#a0a3a1" }
    }
    return { color: "#000000" }
  }

  shuseiTo = (actionType) => {
    var path = {};
    const sendValue = {
      employeeName: this.state.employeeName,
      employeeInfo: this.state.employeeInfo,
    };
    switch (actionType) {
      case "siteInfo":
        path = {
          pathname: "/subMenuManager/siteInfo",
          state: {
            employeeNo: this.state.employeeNo,
            backPage: "salesMoneySet",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  };

  render() {
    console.log(this.state.salesStaff, 'salesStaff')
    const {
      employeeFormCode,
      genderStatus,
      employeeStatus,
      ageFrom,
      ageTo,
      residenceCode,
      nationalityCode,
      customer,
      message,
      type,
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

        <div style={{ display: this.state.myMessageShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myMessageShow}
            message={message}
            type={type}
          />
        </div>
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
                        営業担当
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      className="fx1"
                      id="salesStaff"
                      name="salesStaff"
                      value={
                        this.state.salesStaffDrop.find(
                          (v) => v.code === this.state.salesStaff
                        ) || {}
                      }
                      options={this.state.salesStaffDrop}
                      getOptionLabel={(option) => option.name || ""}
                      onChange={(event, values) => {
                        this.setState({ salesStaff: values.code })
                      }
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
                      id="additionNumberOfTimesStatus"
                      name="additionNumberOfTimesStatus"
                      value={this.state.additionNumberOfTimesStatus}
                      onChange={this.onAdditionNumberOfTimesChange.bind(this)}
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
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap" hidden={this.state.additionNumberOfTimesStatus == 1}>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm" style={{ width: '6rem' }}>
                        加算開始年月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={this.state.startYearAndMonth}
                      onChange={this.onStartYearAndMonthChange}
                      dateFormat={"yyyy/MM"}
                      autoComplete="off"
                      locale="ja"
                      showYearDropdown
                      yearDropdownItemNumber={15}
                      scrollableYearDropdown
                      showMonthYearPicker
                      showFullMonthYearPicker
                      showDisabledMonthNavigation
                      className="form-control form-control-sm"
                      id="startYearAndMonth"
                      name="startYearAndMonth"
                    />
                  </InputGroup>
                  <InputGroup size="sm" className="mb-3" hidden={this.state.additionNumberOfTimesStatus != 1}>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        加算年月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      id="startYearAndMonthFix"
                      name="startYearAndMonthFix"
                      onChange={this.onAdditionNumberOfTimesChangeFix.bind(this)}
                      autoComplete="off"
                    >
                      {this.getAdditionNumberOfTimesList().map((data) => (
                        <option key={data} value={data}>
                          {data}
                        </option>
                      ))}
                    </Form.Control>
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
                      id="additionMoneyCode"
                      name="additionMoneyCode"
                      value={this.state.additionMoneyCode}
                      onChange={this.onAdditionMoneyChange.bind(this)}
                    >
                      {this.state.additionMoneyMap.map((data) => (
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
                        加算理由
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      autoComplete="off"
                      value={this.state.additionMoneyResonCode}
                      id="additionMoneyResonCode"
                      name="additionMoneyResonCode"
                      onChange={this.onAdditionMoneyReasonChange.bind(this)}
                    >
                      {this.state.additionMoneyResonCodeMap.map((data) => (
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
        <div style={{ textAlign: "left" }}>
          <Col sm={3}>
            <div style={{ float: "left" }}>
              <Button
                onClick={this.shuseiTo.bind(this, "siteInfo")}
                size="sm"
                variant="info"
                name="clickButton"
                disabled={this.state.isUpdateFlag != true}
              >
                <FontAwesomeIcon icon={faBuilding} /> 現場情報
              </Button>{" "}
            </div>
          </Col>
        </div>
        <div style={{ textAlign: "center" }}>
          <Button
            size="sm"
            onClick={this.state.isUpdateFlag === true ? this.updateMoneySet : this.addMoneySet}
            id="addOrUpdate"
            variant="info"
          >
            <FontAwesomeIcon icon={faSave} /> {this.state.isUpdateFlag === true ? "更新" : "登録"}
          </Button>{" "}
          <Button
            size="sm"
            onClick={this.deleteMoneySet}
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
                trStyle={this.getTableRowStyle}
              >
                <TableHeaderColumn
                  width="6%"
                  dataFormat={this.rowNoFormat.bind(this)}
                  dataField="rowNo"
                  isKey
                  dataSort
                >
                  番号
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="10%"
                  dataField="employeeName"
                  dataFormat={this.employeeNameFormat.bind(this)}
                >
                  氏名
                </TableHeaderColumn>

                <TableHeaderColumn
                  width="10%"
                  dataField="startYearAndMonth"
                  dataFormat={this.startYearAndMonthFormat.bind(this)}
                >
                  加算開始年月
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="6%"
                  dataField="additionMoneyCode"
                  dataFormat={this.additionMoneyCodeFormat.bind(this)}
                >
                  金額
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="20%"
                  dataField="additionMoneyResonCode"
                  dataFormat={this.additionMoneyResonCodeFormat.bind(this)}
                >
                  加算理由
                </TableHeaderColumn>
                <TableHeaderColumn
                  width="20%"
                  dataField="salesStaff"
                  dataFormat={this.salesStaffFormat.bind(this)}
                >
                  営業担当
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
