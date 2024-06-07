import React from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { faSave, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as publicUtils from "./utils/publicUtils.js";
import * as utils from "./utils/publicUtils.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import Clipboard from "clipboard";
import TextField from "@material-ui/core/TextField";
import MyToast from "./myToast";
import store from "./redux/store";
import ErrorsMessageToast from "./errorsMessageToast";
import { message } from "antd";
axios.defaults.withCredentials = true;

/**
 * 営業文章画面
 */
class salesContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initState;
  }

  initState = {
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    myToastShow: false, // 状態ダイアログ
    employeeNo: this.props.sendValue.empNo,
    employeeName: "",
    genderStatus: "",
    nationalityName: "",
    age: "",
    developLanguage: "",
    yearsOfExperience: "",
    comeToJapanYearAndMonth: "",
    japaneseLevelName: "",
    hopeHighestPrice: "",
    beginMonth: "",
    salesProgressCode: this.props.sendValue.salesProgressCode,
    nearestStation: "",
    employeeStatus: "",
    japaneseLevelCode: "",
    englishLevelCode: "",
    japaneseLevellabal: "",
    englishLevellabal: "",
    siteRoleCode: "",
    unitPrice: this.props.sendValue.unitPrice,
    unitPriceShow: utils.addComma(this.props.sendValue.unitPrice),
    addDevelopLanguage: "",
    developLanguageCode6: null,
    developLanguageCode7: null,
    developLanguageCode8: null,
    developLanguageCode9: null,
    developLanguageCode10: null,
    developLanguageCode11: null,
    genders: store.getState().dropDown[0],
    employees: store.getState().dropDown[4],
    japaneseLevels: store.getState().dropDown[5],
    englishLevels: store.getState().dropDown[13],
    salesProgresss: store.getState().dropDown[16],
    japaneaseConversationLevels: store.getState().dropDown[43],
    englishConversationLevels: store.getState().dropDown[44],
    projectPhases: store.getState().dropDown[45],
    stations: store.getState().dropDown[14],
    developLanguages: store.getState().dropDown[8],
    developLanguagesShow: store.getState().dropDown[8],
    frameWorkShow: store.getState().dropDown[71],
    wellUseLanguagss: [],
    stationCode: "",
    disbleState: false,
    japaneaseConversationLevel: "",
    englishConversationLevel: "",
    projectPhaseCode: "0",
    remark: this.props.sendValue.remark,
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
    initDevelopLanguageCode11: null,
    initUnitPrice: "",
    initRemark: "",
    disableFlag: true,
    initWellUseLanguagss: [],
    projectPhase: "",
    errorsMessageShow: false,
    errorsMessageValue: "",
    message: "",
    type: "",
    tempDate: "",
    interviewDate:
      this.props.sendValue.salesProgressCode === "3"
        ? this.props.sendValue.interviewDate
        : "",
    admissionEndDate: this.props.sendValue.admissionEndDate,
  };

  componentWillUnmount() {
    this.clipboard?.destroy && this.clipboard.destroy();
  }

  componentDidMount() {
    this.setNewDevelopLanguagesShow();
    this.copyToClipboard();

    if (this.state.interviewDate !== "") {
      var myDate = new Date();
      myDate =
        myDate.getFullYear() +
        this.padding1(myDate.getMonth() + 1, 2) +
        this.padding1(myDate.getDate(), 2);
      if (this.state.interviewDate.substring(0, 8) >= myDate) {
        this.setState({
          interviewDate:
            " " +
            this.state.interviewDate.substring(4, 6) +
            "/" +
            this.state.interviewDate.substring(6, 8) +
            " " +
            this.state.interviewDate.substring(8, 10) +
            ":" +
            this.state.interviewDate.substring(10, 12),
        });
      } else {
        this.setState({
          interviewDate: "",
        });
      }
    }
  }

  setNewDevelopLanguagesShow = () => {
    let developLanguagesTemp = [];
    for (let i = 0; i < this.state.developLanguagesShow.length; i++) {
      developLanguagesTemp.push(this.state.developLanguagesShow[i]);
    }
    let frameWorkTemp = [];
    for (let i = 1; i < this.state.frameWorkShow.length; i++) {
      developLanguagesTemp.push({
        code: String((Number(this.state.frameWorkShow[i].code) + 1) * -1),
        name: this.state.frameWorkShow[i].name,
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

    this.setState(
      {
        developLanguagesShow: developLanguagesTemp,
        employees: employees,
      },
      () => {
        this.getPersonalSalesInfo();
      }
    );
  };

  padding1 = (num, length) => {
    for (var len = (num + "").length; len < length; len = num.length) {
      num = "0" + num;
    }
    return num;
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
        m = m + 1 < 10 ? "0" + (m + addMonths) : m + addMonths;
      }
    }
    return y + "/" + m;
  };

  // valueChange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getText = () => {
    let employeeStatusName =
      this.state.employees.find((v) => v.code === this.state.employeeStatus)
        .name || "";
    let text =
      `【名　　前】：` +
      this.state.employeeName +
      `　` +
      this.state.nationalityName +
      `　` +
      this.state.genderStatus +
      `
【所　　属】：` +
      (employeeStatusName === "子会社社員" ? "社員" : employeeStatusName) +
      (this.state.age === ""
        ? ""
        : `
【年　　齢】：` +
        this.state.age +
        `歳`) +
      (this.state.nearestStation === "" || this.state.nearestStation === null
        ? ""
        : `
【最寄り駅】：` +
        (this.state.nearestStation !== "" &&
          this.state.nearestStation !== null
          ? this.state.stations.find(
            (v) => v.code === this.state.nearestStation
          ).name
          : "")) +
      (this.state.japaneaseConversationLevel === "" ||
        this.state.japaneaseConversationLevel === null
        ? ""
        : `
【日本　語】：` +
        (this.state.japaneaseConversationLevel !== "" &&
          this.state.japaneaseConversationLevel !== null
          ? this.state.japaneaseConversationLevels.find(
            (v) => v.code === this.state.japaneaseConversationLevel
          ).name
          : "")) +
      (this.state.englishConversationLevel === "" ||
        this.state.englishConversationLevel === null
        ? ""
        : `
【英　　語】：` +
        (this.state.englishConversationLevel !== "" &&
          this.state.englishConversationLevel !== null
          ? this.state.englishConversationLevels.find(
            (v) => v.code === this.state.englishConversationLevel
          ).name
          : "")) +
      (this.state.yearsOfExperience === ""
        ? ""
        : `
【経験年数】：` +
        this.state.yearsOfExperience +
        `年`) +
      (this.state.comeToJapanYearAndMonth === ""
        ? ""
        : `
【来日年数】：` +
        this.state.comeToJapanYearAndMonth +
        `年`) +
      (this.state.projectPhase === "" ||
        this.state.projectPhase === null ||
        this.state.projectPhase === undefined
        ? ""
        : `
【対応工程】：` +
        (this.state.projectPhase !== "" &&
          this.state.projectPhase !== null &&
          this.state.projectPhase !== undefined
          ? this.state.projectPhases.find(
            (v) => v.code === this.state.projectPhase
          ).name
          : "") +
        `から`) +
      (this.state.developLanguage === ""
        ? ""
        : `
【得意言語】：` + this.state.developLanguage) +
      (this.state.unitPriceShow === ""
        ? ""
        : `
【単　　価】：` +
        utils.enToManEn(utils.deleteComma(this.state.unitPriceShow))) +
      `
【稼働開始】：` /*(this.state.beginMonth !== "" && this.state.beginMonth !== null ? publicUtils.formateDate(this.state.beginMonth, false).substring(0,4) + "/" + */ +
      (Number(this.state.admissionEndDate) <
        this.getNextMonth(new Date(), 0).replace("/", "")
        ? "即日"
        : publicUtils
          .formateDate(this.state.beginMonth, false)
          .substring(0, 6)
          .replace(/\b(0+)/gi, "")
          .split("")
          .toSpliced(4, 0, "/")
          .join("")) +
      `
【営業状況】：` +
      (this.state.salesProgressCode + ""
        ? this.state.salesProgresss.find(
          (v) => v.code === this.state.salesProgressCode
        ).name
        : "並行営業") +
      //               (this.state.salesProgressCode === "" ||
      //               this.state.salesProgressCode === null
      //                 ? ""
      //                 : `
      // 【営業状況】：` +
      //                   (this.state.salesProgressCode !== "" &&
      //                   this.state.salesProgressCode !== null
      //                     ? this.state.salesProgresss.find(
      //                         (v) => v.code === this.state.salesProgressCode
      //                       ).name
      //                     : "並行営業") +
      //                   this.state.interviewDate)
      (this.state.remark === " "
        ? ""
        : `
【備　　考】：` +
        (this.state.remark !== " " && this.state.remark !== null
          ? this.state.remark
          : ""));
    return text;
  };

  // コピー
  copyToClipboard = async () => {
    let myThis = this;
    if (!this.clipboard) {
      this.clipboard = new Clipboard("#copyUrl2", {
        text: function () {
          return myThis.getText();
        },
      });
      this.clipboard.on("success", function () {
        message.success("コピー成功しました");
        console.log("已复制到剪贴板！");
      });
      this.clipboard.on("error", function () {
        message.error("コピー失敗しました");
        console.log("err！");
      });
    }
  };

  // 更新ボタン
  updateSalesSentence = () => {
    this.setState(
      { tempDate: publicUtils.formateDate(this.state.beginMonth, false) },
      () => {
        axios
          .post(
            this.state.serverIP + "salesSituation/updateSalesSentence",
            this.state
          )
          .then((result) => {
            this.setNewDevelopLanguagesShow();
            this.setState({
              beginMonth: new Date(this.state.beginMonth).getTime(),
              myToastShow: true,
              unitPrice: this.state.unitPriceShow,
              type: "success",
              errorsMessageShow: false,
              message: "処理成功",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
          })
          .catch(function (error) {
            alert(error);
          });
      }
    );
    setTimeout(
      () =>
        this.props.allState.setValue(
          this.state.unitPrice,
          this.state.yearsOfExperience,
          this.state.japaneaseConversationLevel,
          this.state.nearestStation,
          this.state.developLanguage
        ),
      1000
    );
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

  // 駅LOST FOCUS
  updateAddress = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      stationCode: event.target.value,
    });
    axios
      .post(this.state.serverIP + "salesSituation/updateEmployeeAddressInfo", {
        employeeNo: this.props.sendValue.empNo,
        stationCode: event.target.value,
      })
      .then((result) => {
        this.setState({ myToastShow: true });
        setTimeout(() => this.setState({ myToastShow: false }), 3000);
      })
      .catch(function (error) {
        alert(error);
      });
  };

  fromCodeToNameLanguage = (code) => {
    if (
      code === "" ||
      code === null ||
      this.state.developLanguagesShow.find((v) => v.code === code) === undefined
    ) {
      return;
    } else {
      return this.state.developLanguagesShow.find((v) => v.code === code).name;
    }
  };

  fromCodeToListLanguage = (code) => {
    if (code === "" || code === null) {
      return "";
    } else {
      return this.state.developLanguagesShow.find((v) => v.code === code);
    }
  };

  getProjectPhase = (siteRoleCode) => {
    if (siteRoleCode === "2") {
      return "1";
    } else if (siteRoleCode === "3") {
      return "2";
    }
  };

  setResDataToState = (data, callback) => {
    this.setState(
      {
        employeeName: data.employeeFullName,
        projectPhase:
          data.projectPhase === null ||
            data.projectPhase === "" ||
            data.projectPhase === undefined
            ? this.getProjectPhase(data.siteRoleCode)
            : data.projectPhase,
        genderStatus: this.state.genders.find(
          (v) => v.code === data.genderStatus
        ).name,
        nationalityName: data.nationalityName,
        age: data.age === null || data.age === undefined ? "" : data.age,
        developLanguageCode6: data.developLanguage1,
        developLanguageCode7: data.developLanguage2,
        developLanguageCode8: data.developLanguage3,
        developLanguageCode9: data.developLanguage4,
        developLanguageCode10: data.developLanguage5,
        developLanguageCode11: data.developLanguage6,
        wellUseLanguagss: [
          this.fromCodeToListLanguage(data.developLanguage1),
          this.fromCodeToListLanguage(data.developLanguage2),
          this.fromCodeToListLanguage(data.developLanguage3),
          this.fromCodeToListLanguage(data.developLanguage4),
          this.fromCodeToListLanguage(data.developLanguage5),
          this.fromCodeToListLanguage(data.developLanguage6),
        ].filter(function (s) {
          return s && s.code !== "0"; // 注：IE9(不包含IE9)以下的版本没有trim()方法
        }),
        disbleState:
          this.fromCodeToListLanguage(data.developLanguage6) === ""
            ? false
            : true,
        developLanguage: [
          this.fromCodeToNameLanguage(data.developLanguage1),
          this.fromCodeToNameLanguage(data.developLanguage2),
          this.fromCodeToNameLanguage(data.developLanguage3),
          this.fromCodeToNameLanguage(data.developLanguage4),
          this.fromCodeToNameLanguage(data.developLanguage5),
          this.fromCodeToNameLanguage(data.developLanguage6),
        ]
          .filter(function (s) {
            return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
          })
          .join("、"),
        yearsOfExperience:
          data.yearsOfExperience === null ||
            data.yearsOfExperience === undefined
            ? ""
            : data.yearsOfExperience,
        comeToJapanYearAndMonth: data.comeToJapanYearAndMonth === null ||
          data.comeToJapanYearAndMonth === undefined
          ? ""
          : data.comeToJapanYearAndMonth,
        japaneaseConversationLevel: data.japaneaseConversationLevel,
        englishConversationLevel: data.englishConversationLevel,
        beginMonth:
          data.theMonthOfStartWork === null || data.theMonthOfStartWork === ""
            ? !(
              this.state.admissionEndDate === null ||
              this.state.admissionEndDate === undefined ||
              this.state.admissionEndDate === ""
            )
              ? new Date(
                this.getNextMonth(
                  publicUtils.converToLocalTime(
                    this.state.admissionEndDate,
                    false
                  ),
                  1
                )
              ).getTime()
              : new Date(data.theMonthOfStartWork).getTime()
            : new Date(data.theMonthOfStartWork).getTime(),
        nearestStation: data.nearestStation,
        stationCode: data.nearestStation,
        employeeStatus: data.employeeStatus,
        japaneseLevelCode:
          this.state.japaneseLevels.find(
            (v) => v.code === data.japaneseLevelCode
          ) === undefined
            ? ""
            : this.state.japaneseLevels.find(
              (v) => v.code === data.japaneseLevelCode
            ).name,
        englishLevelCode:
          this.state.englishLevels.find(
            (v) => v.code === data.englishLevelCode
          ) === undefined
            ? ""
            : this.state.englishLevels.find(
              (v) => v.code === data.englishLevelCode
            ).name,
        siteRoleCode: data.siteRoleCode,
        unitPrice:
          data.unitPrice === null ||
            data.unitPrice === "" ||
            data.unitPrice === undefined
            ? this.state.unitPrice
            : data.unitPrice,
        unitPriceShow:
          data.unitPrice === null ||
            data.unitPrice === "" ||
            data.unitPrice === undefined
            ? utils.addComma(this.state.unitPrice)
            : utils.addComma(data.unitPrice),
        remark:
          data.remark === null ||
            data.remark === "" ||
            data.remark === undefined
            ? this.state.remark
            : data.remark,
        initAge: data.age,
        initNearestStation: data.nearestStation,
        initJapaneaseConversationLevel: data.japaneaseConversationLevel,
        initEnglishConversationLevel: data.englishConversationLevel,
        initYearsOfExperience: data.yearsOfExperience,
        initDevelopLanguageCode6: data.developLanguage1,
        initDevelopLanguageCode7: data.developLanguage2,
        initDevelopLanguageCode8: data.developLanguage3,
        initDevelopLanguageCode9: data.developLanguage4,
        initDevelopLanguageCode10: data.developLanguage5,
        initDevelopLanguageCode11: data.developLanguage6,
        initUnitPrice: data.unitPrice,
        initRemark: data.remark,
        initWellUseLanguagss: [
          this.fromCodeToListLanguage(data.developLanguage1),
          this.fromCodeToListLanguage(data.developLanguage2),
          this.fromCodeToListLanguage(data.developLanguage3),
          this.fromCodeToListLanguage(data.developLanguage4),
          this.fromCodeToListLanguage(data.developLanguage5),
          this.fromCodeToListLanguage(data.developLanguage6),
        ].filter(function (s) {
          return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
        }),
      },
      () => {
        if (callback instanceof Function) callback();
      }
    );
  };

  getPersonalSalesInfo = async (callback) => {
    let result = await axios.post(
      this.state.serverIP + "salesSituation/getPersonalSalesInfo",
      {
        employeeNo: this.props.sendValue.empNo,
      }
    );
    if (result.data.length < 0) {
      alert("データ存在していません");
      return {};
    }
    this.setResDataToState(result.data[0], callback);
    return result.data[0];
  };

  setEndDate = (date) => {
    this.setState({
      beginMonth: date,
    });
  };

  onTagsChange = (event, values, fieldName) => {
    if (values.length >= 6) {
      this.setState({
        disbleState: true,
      });
    } else {
      this.setState({
        disbleState: false,
      });
    }
    this.setState({
      developLanguageCode6: values.length >= 1 ? values[0].code : null,
      developLanguageCode7: values.length >= 2 ? values[1].code : null,
      developLanguageCode8: values.length >= 3 ? values[2].code : null,
      developLanguageCode9: values.length >= 4 ? values[3].code : null,
      developLanguageCode10: values.length >= 5 ? values[4].code : null,
      developLanguageCode11: values.length >= 6 ? values[5].code : null,
      wellUseLanguagss: [
        this.fromCodeToListLanguage(values.length >= 1 ? values[0].code : ""),
        this.fromCodeToListLanguage(values.length >= 2 ? values[1].code : ""),
        this.fromCodeToListLanguage(values.length >= 3 ? values[2].code : ""),
        this.fromCodeToListLanguage(values.length >= 4 ? values[3].code : ""),
        this.fromCodeToListLanguage(values.length >= 5 ? values[4].code : ""),
        this.fromCodeToListLanguage(values.length >= 6 ? values[5].code : ""),
      ].filter(function (s) {
        return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
      }),
    });
  };

  valueChangeMoney = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        this.setState({
          [name]: utils.addComma(value),
          unitPrice: utils.deleteComma(value),
        });
      }
    );
  };

  render() {
    const {
      topCustomerInfo,
      stationCode,
      customerDepartmentList,
      accountInfo,
      actionType,
      topCustomer,
      errorsMessageValue,
      message,
      type,
      positionDrop,
      customerNo,
      backPage,
    } = this.state;

    console.log({ state: this.state }, "render");
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
        {
          <ListGroup>
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              【名　　前】：{this.state.employeeName}
              {"　"}
              {this.state.nationalityName}
              {"　"}
              {this.state.genderStatus}
            </ListGroup.Item>
            {/*<ListGroup.Item style={{padding:".3rem 1.25rem"}}>【所　　属】：{this.state.employeeStatus === "子会社社員" ? "社員" : this.state.employeeStatus}</ListGroup.Item>*/}
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              <span style={{ flexFlow: "nowrap" }}>
                【所　　属】：
                <Form.Control
                  as="select"
                  style={{ display: "inherit", width: "150px" }}
                  onChange={this.valueChange}
                  name="employeeStatus"
                  value={this.state.employeeStatus}
                >
                  {this.state.employees.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </span>
            </ListGroup.Item>
            <span style={{ flexFlow: "nowrap" }}>
              <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
                【年　　齢】：
                <input
                  value={this.state.age}
                  name="age"
                  style={{ width: "45px" }}
                  onChange={this.valueChange}
                  className="inputWithoutBorder"
                />
                歳
              </ListGroup.Item>
            </span>
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              <span style={{ flexFlow: "nowrap" }}>
                【最寄り駅】：
                <Autocomplete
                  id="nearestStation"
                  name="nearestStation"
                  value={
                    this.state.stations.find(
                      (v) => v.code === this.state.nearestStation
                    ) || {}
                  }
                  onChange={(event, values) => this.getStation(event, values)}
                  options={this.state.stations}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-salesContent-station"
                      />
                    </div>
                  )}
                />
              </span>
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              <span style={{ flexFlow: "nowrap" }}>
                【日本　語】：
                <Form.Control
                  as="select"
                  style={{ display: "inherit", width: "150px" }}
                  onChange={this.valueChange}
                  name="japaneaseConversationLevel"
                  value={this.state.japaneaseConversationLevel || ""}
                >
                  {this.state.japaneaseConversationLevels.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </span>
              &nbsp;&nbsp;{this.state.japaneseLevelCode}
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              <span style={{ flexFlow: "nowrap" }}>
                【英　　語】：
                <Form.Control
                  as="select"
                  style={{ display: "inherit", width: "150px" }}
                  onChange={this.valueChange}
                  name="englishConversationLevel"
                  value={this.state.englishConversationLevel || ""}
                >
                  {this.state.englishConversationLevels.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </span>
              &nbsp;&nbsp;{this.state.englishLevelCode}
            </ListGroup.Item>
            <span style={{ flexFlow: "nowrap" }}>
              <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
                【経験年数】：
                <input
                  value={this.state.yearsOfExperience}
                  name="yearsOfExperience"
                  style={{ width: "45px" }}
                  onChange={this.valueChange}
                  className="inputWithoutBorder"
                />
                年
              </ListGroup.Item>
            </span>
            <span style={{ flexFlow: "nowrap" }}>
              <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
                【来日年数】：
                <input
                  value={this.state.comeToJapanYearAndMonth}
                  name="comeToJapanYearAndMonth"
                  style={{ width: "45px" }}
                  onChange={this.valueChange}
                  className="inputWithoutBorder"
                />
                年
              </ListGroup.Item>
            </span>
            {
              <ListGroup.Item style={{ padding: ".3rem 1.25rem" }} hidden>
                【対応工程】：{this.state.projectPhase}
              </ListGroup.Item>
            }
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              <span style={{ flexFlow: "nowrap" }}>
                【対応工程】：
                <Form.Control
                  as="select"
                  style={{ display: "inherit", width: "150px" }}
                  onChange={this.valueChange}
                  name="projectPhase"
                  value={this.state.projectPhase}
                >
                  {this.state.projectPhases.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </span>
              &nbsp;&nbsp;{"から"}
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              【得意言語】：{this.state.developLanguage}
              <Autocomplete
                multiple
                id="tags-standard"
                options={this.state.developLanguagesShow}
                getOptionDisabled={(option) => this.state.disbleState}
                // getOptionDisabled={(option) => option ===
                // this.state.developLanguagesShow[0] || option ===
                // this.state.developLanguagesShow[2]}
                value={this.state.wellUseLanguagss}
                getOptionLabel={(option) => (option.name ? option.name : "")}
                onChange={(event, values) =>
                  this.onTagsChange(event, values, "customerName")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="言語追加"
                    placeholder="言語追加"
                    style={{ float: "right" }}
                  />
                )}
              />
            </ListGroup.Item>
            <span style={{ flexFlow: "nowrap" }}>
              <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
                【単　　価】：
                <input
                  value={this.state.unitPriceShow}
                  name="unitPriceShow"
                  style={{ width: "80px" }}
                  onChange={this.valueChangeMoney}
                  className="inputWithoutBorder"
                />
                円
              </ListGroup.Item>
            </span>
            <span style={{ flexFlow: "nowrap", flexWrap: "nowrap" }}>
              <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
                <span>【稼働開始】：</span>
                <div style={{ display: "inline-block" }}>
                  {(!this.state.admissionEndDate
                    ? 0
                    : this.state.admissionEndDate.substring(4, 6) === "12"
                      ? Number(
                        Number(this.state.admissionEndDate.substring(0, 4)) +
                        1 +
                        "01"
                      )
                      : Number(this.state.admissionEndDate) + 1) < Number(this.getNextMonth(new Date(), 1).replace("/", "")) ? ("即日") : (
                    <DatePicker
                      selected={this.state.beginMonth}
                      onChange={this.setEndDate}
                      autoComplete="off"
                      locale="ja"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      className="form-control form-control-sm"
                      dateFormat="yyyy/MM"
                      id="datePicker"
                    //disabled
                    />
                  )}
                </div>
              </ListGroup.Item>
            </span>
            <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
              <span style={{ flexFlow: "nowrap" }}>
                【営業状況】：
                <Form.Control
                  as="select"
                  disabled
                  style={{ display: "inherit", width: "145px" }}
                  onChange={this.valueChange}
                  name="salesProgressCode"
                  value={this.state.salesProgressCode + "" || "5"}
                >
                  {/* 如果salesProgressCode为空，则显示并行营业 */}
                  {this.state.salesProgresss.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </span>
              {this.state.interviewDate}
            </ListGroup.Item>
            <span style={{ flexFlow: "nowrap" }}>
              <ListGroup.Item style={{ padding: ".3rem 1.25rem" }}>
                【備　　考】：
                <input
                  value={this.state.remark}
                  name="remark"
                  style={{ width: "60%" }}
                  onChange={this.valueChange}
                  className="inputWithoutBorder"
                />
              </ListGroup.Item>
            </span>
          </ListGroup>
        }
        <div id="snippet" style={{ display: "none" }}>
          555
        </div>
        <div>
          <div style={{ textAlign: "center" }}>
            <Button
              size="sm"
              variant="info"
              onClick={this.updateSalesSentence.bind(this)}
              disabled={
                this.state.age !== this.state.initAge ||
                  this.state.nearestStation !== this.state.initNearestStation ||
                  this.state.japaneaseConversationLevel !==
                  this.state.initJapaneaseConversationLevel ||
                  this.state.englishConversationLevel !==
                  this.state.initEnglishConversationLevel ||
                  this.state.yearsOfExperience !==
                  this.state.initYearsOfExperience ||
                  this.state.unitPrice !== this.state.initUnitPrice ||
                  this.state.remark !== this.state.initRemark ||
                  this.state.wellUseLanguagss.sort().toString() !==
                  this.state.initWellUseLanguagss.sort().toString()
                  ? false
                  : false
              }
            >
              <FontAwesomeIcon icon={faSave} /> {"更新"}
            </Button>{" "}
            <Button
              id="copyUrl2"
              size="sm"
              variant="info" /* onClick={this.copyToClipboard} */
            >
              <FontAwesomeIcon icon={faCopy} /> {"コピー"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default salesContent;
