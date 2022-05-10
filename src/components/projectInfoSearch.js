import React, { Component } from "react";
import {
  Row,
  Form,
  Col,
  InputGroup,
  Button,
  FormControl,
  Modal,
} from "react-bootstrap";
import MyToast from "./myToast";
import $ from "jquery";
import ErrorsMessageToast from "./errorsMessageToast";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faUndo,
  faSearch,
  faList,
  faEdit,
  faTrash,
  faEnvelope,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import * as utils from "./utils/publicUtils.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import store from "./redux/store";
import ProjectContent from "./projectContent";
axios.defaults.withCredentials = true;

class ProjectInfoSearch extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; //初期化
  }
  initialState = {
    //パラメータ
    actionType: "insert",
    backPage: "", //遷移元
    message: "", //toastのメッセージ
    type: "", //成功や失敗
    myToastShow: false, //toastのフラグ
    errorsMessageShow: false, ///エラーのメッセージのフラグ
    errorsMessageValue: "", //エラーのメッセージ
    torokuText: "登録", //登録ボタンの文字
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1], //バックエンドのリンク
    selectedProjectNo: "", //選択した案件番号
    searchFlag: false, //検索フラグ
    showProjectContentModal: false, //案件文章表示フラグ
    //項目
    theSelectProjectperiodStatus: "0",
    projectNo: "",
    keyWordOfLanagurue1: "",
    keyWordOfLanagurue2: "",
    keyWordOfLanagurue3: "",
    successRate: "",
    projectType: "",
    admissionPeriod: "",
    unitPriceRangeLowest: "",
    unitPriceRangeHighest: "",
    nationalityCode: "",
    japaneaseConversationLevel: "",
    experienceYear: "",
    projectPhaseStart: "",
    projectPhaseEnd: "",
    noOfInterviewCode: "",
    projectInfoList: [],
    endFlag: "1",
    //Drop
    projectNoDrop: store.getState().dropDown[51].slice(1),
    theSelectProjectperiodStatusDrop: store.getState().dropDown[58].slice(1),
    projectTypeDrop: store.getState().dropDown[52],
    payOffRangeDrop: store.getState().dropDown[33].slice(1),
    nationalityDrop: store.getState().dropDown[7],
    japaneaseConversationLevelDrop: store.getState().dropDown[43],
    projectPhaseDrop: store.getState().dropDown[45],
    noOfInterviewDrop: store.getState().dropDown[50],
    customerDrop: store.getState().dropDown[15].slice(1),
    personInChargeDrop: [],
    stationDrop: store.getState().dropDown[14].slice(1),
    successRateDrop: store.getState().dropDown[48],
    developLanguageDrop: store.getState().dropDown[8].slice(1),
    ageClassificationDrop: store.getState().dropDown[49],
    admissionPeriodDrop: store.getState().dropDown[51],
    typeOfIndustryDrop: store.getState().dropDown[36],
    salesStaffDrop: store.getState().dropDown[9].slice(1),
  };
  //onchange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  //リセット
  resetValue = () => {
    this.setState({
      theSelectProjectperiodStatus: "",
      projectNo: "",
      keyWordOfLanagurue1: "",
      keyWordOfLanagurue2: "",
      keyWordOfLanagurue3: "",
      successRate: "",
      projectType: "",
      admissionPeriod: "",
      unitPriceRangeLowest: "",
      unitPriceRangeHighest: "",
      nationalityCode: "",
      japaneaseConversationLevel: "",
      experienceYear: "",
      projectPhaseStart: "",
      projectPhaseEnd: "",
      noOfInterviewCode: "",
    });
  };
  /**
   * 値を設定
   */
  giveValue = (projectInfoMod) => {
    this.setState({
      theSelectProjectperiodStatus: projectInfoMod.theSelectProjectperiodStatus,
      projectNo: projectInfoMod.projectNo,
      nationalityCode: projectInfoMod.nationalityCode,
      admissionPeriod: utils.converToLocalTime(
        projectInfoMod.admissionPeriod,
        false
      ),
      projectType: projectInfoMod.projectType,
      successRate: projectInfoMod.successRate,
      keyWordOfLanagurue1: projectInfoMod.keyWordOfLanagurue1,
      keyWordOfLanagurue2: projectInfoMod.keyWordOfLanagurue2,
      keyWordOfLanagurue3: projectInfoMod.keyWordOfLanagurue3,
      japaneaseConversationLevel: projectInfoMod.japaneaseConversationLevel,
      unitPriceRangeLowest: projectInfoMod.unitPriceRangeLowest,
      unitPriceRangeHighest: projectInfoMod.unitPriceRangeHighest,
      projectPhaseStart: projectInfoMod.projectPhaseStart,
      projectPhaseEnd: projectInfoMod.projectPhaseEnd,
      experienceYear: projectInfoMod.experienceYear,
      noOfInterviewCode: projectInfoMod.noOfInterviewCode,
    });
  };
  /**
   * 開発言語の自動提示
   * @param {*} event
   * @param {*} values
   */
  getJapanese1 = (event, values) => {
    if (values != null) {
      this.setState({
        keyWordOfLanagurue1: values.code,
      });
    } else {
      this.setState({
        keyWordOfLanagurue1: "",
      });
    }
  };
  getJapanese2 = (event, values) => {
    if (values != null) {
      this.setState({
        keyWordOfLanagurue2: values.code,
      });
    } else {
      this.setState({
        keyWordOfLanagurue2: "",
      });
    }
  };
  getJapanese3 = (event, values) => {
    if (values != null) {
      this.setState({
        keyWordOfLanagurue3: values.code,
      });
    } else {
      this.setState({
        keyWordOfLanagurue3: "",
      });
    }
  };
  getProjectNo = (event, values) => {
    if (values != null) {
      this.setState({
        projectNo: values.code,
      });
    } else {
      this.setState({
        projectNo: "",
      });
    }
  };
  /**
   * 数字のみ入力
   */
  vNumberChange = (e, key) => {
    const { value } = e.target;
    var num = value;
    const reg = /^[0-9]*$/;
    var keyLength = 3;
    if (key === "unitPriceRangeLowest" || key === "unitPriceRangeHighest") {
      keyLength = 4;
    }
    if (reg.test(num) && num.length < keyLength) {
      this.setState({
        [key]: num,
      });
    }
  };
  componentDidMount() {
    let stationDrop = this.state.stationDrop;
    stationDrop.push({ code: String(stationDrop.length), name: "テレワーク" });
    this.setState({ stationDrop: stationDrop });

    $('button[name="clickButton"]').attr("disabled", true);
    if (this.props.location.state !== undefined) {
      var sendValue = this.props.location.state.sendValue;
      var searchFlag = this.props.location.state.searchFlag;
      this.giveValue(sendValue);
      this.setState({
        selectedProjectNo: this.props.location.state.selectedProjectNo,
      });
      this.search(sendValue);
    } else {
      this.search();
    }
  }

  endFlagChange = () => {
    const projectInfoModel = {
      projectNo: this.state.selectedProjectNo,
    };
    axios
      .post(
        this.state.serverIP + "projectInfoSearch/endFlagChange",
        projectInfoModel
      )
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          let projectInfoList = this.state.projectInfoList;
          for (let i in projectInfoList) {
            if (projectInfoList[i].projectNo === this.state.selectedProjectNo) {
              projectInfoList[i].endFlag =
                this.state.endFlag === "0" ? "1" : "0";
            }
          }
          this.setState({
            endFlag: this.state.endFlag === "0" ? "1" : "0",
            projectInfoList: projectInfoList,
          });
          this.setState({
            myToastShow: true,
            type: "success",
            message: result.data.message,
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
        } else {
          this.setState({
            myToastShow: false,
            errorsMessageShow: true,
            errorsMessage: result.data.errorsMessage,
          });
        }
      })
      .catch((error) => {
        alert("删除错误，请检查程序");
      });
  };

  shuseiTo = (actionType) => {
    var path = {};
    const sendValue = {
      theSelectProjectperiodStatus: this.state.theSelectProjectperiodStatus,
      projectNo: this.state.projectNo,
      nationalityCode: this.state.nationalityCode,
      admissionPeriod: this.state.admissionPeriod,
      projectType: this.state.projectType,
      successRate: this.state.successRate,
      keyWordOfLanagurue1: this.state.keyWordOfLanagurue1,
      keyWordOfLanagurue2: this.state.keyWordOfLanagurue2,
      keyWordOfLanagurue3: this.state.keyWordOfLanagurue3,
      japaneaseConversationLevel: this.state.japaneaseConversationLevel,
      unitPriceRangeLowest: this.state.unitPriceRangeLowest,
      unitPriceRangeHighest: this.state.unitPriceRangeHighest,
      projectPhaseStart: this.state.projectPhaseStart,
      projectPhaseEnd: this.state.projectPhaseEnd,
      experienceYear: this.state.experienceYear,
      noOfInterviewCode: this.state.noOfInterviewCode,
      proposeClassificationCode: "1",
    };
    switch (actionType) {
      case "update":
        path = {
          pathname: "/subMenuManager/projectInfo",
          state: {
            actionType: "update",
            projectNo: this.state.selectedProjectNo,
            backPage: "projectInfoSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "detail":
        path = {
          pathname: "/subMenuManager/projectInfo",
          state: {
            actionType: "detail",
            projectNo: this.state.selectedProjectNo,
            backPage: "projectInfoSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "insert":
        path = {
          pathname: "/subMenuManager/projectInfo",
          state: {
            actionType: "insert",
            projectNo: this.state.selectedProjectNo,
            backPage: "projectInfoSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "customer":
        path = {
          pathname: "/subMenuManager/salesSendLetter",
          state: {
            projectNo: this.state.selectedProjectNo,
            backPage: "projectInfoSearch",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  };
  //行Selectファンクション
  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({
        selectedProjectNo: row.projectNo,
        endFlag: row.endFlag === null ? "1" : row.endFlag,
      });
      $('button[name="clickButton"]').attr("disabled", false);
    } else {
      this.setState({
        selectedProjectNo: "",
      });
      $('button[name="clickButton"]').attr("disabled", true);
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
  //隠した削除ボタン
  createCustomDeleteButton = (onClick) => {
    return (
      <Button variant="info" id="deleteBtn" hidden onClick={onClick}>
        删除
      </Button>
    );
  };
  //隠した削除ボタンの実装
  onDeleteRow = (rows) => {
    const projectInfoModel = {
      projectNo: this.state.selectedProjectNo,
    };
    var id = this.state.selectedProjectNo;
    var projectInfoList = this.state.projectInfoList;
    for (let i = projectInfoList.length - 1; i >= 0; i--) {
      if (projectInfoList[i].projectNo === id) {
        projectInfoList.splice(i, 1);
      }
    }
    if (projectInfoList.length !== 0) {
      for (let i = projectInfoList.length - 1; i >= 0; i--) {
        projectInfoList[i].rowNo = i + 1;
      }
    }
    this.setState({
      projectInfoList: projectInfoList,
    });
    axios
      .post(this.state.serverIP + "projectInfoSearch/delete", projectInfoModel)
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.search(null);
          //削除の後で、rowSelectEmployeeNoの値に空白をセットする
          this.setState({
            rowSelectEmployeeNo: "",
          });
          this.setState({
            myToastShow: true,
            type: "success",
            message: result.data.message,
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
        } else {
          this.setState({
            myToastShow: false,
            errorsMessageShow: true,
            errorsMessage: result.data.errorsMessage,
          });
        }
      })
      .catch((error) => {
        alert("删除错误，请检查程序");
      });
  };
  //　　削除前のデフォルトお知らせの削除
  customConfirm(next, dropRowKeys) {
    const dropRowKeysStr = dropRowKeys.join(",");
    next();
  }
  search = (sendValues) => {
    var projectInfoModel = {
      theSelectProjectperiodStatus: this.state.theSelectProjectperiodStatus,
      projectNo: this.state.projectNo,
      nationalityCode: this.state.nationalityCode,
      admissionPeriod: utils.formateDate(this.state.admissionPeriod, false),
      projectType: this.state.projectType,
      successRate: this.state.successRate,
      keyWordOfLanagurue1: this.state.keyWordOfLanagurue1,
      keyWordOfLanagurue2: this.state.keyWordOfLanagurue2,
      keyWordOfLanagurue3: this.state.keyWordOfLanagurue3,
      japaneaseConversationLevel: this.state.japaneaseConversationLevel,
      unitPriceRangeLowest: this.state.unitPriceRangeLowest,
      unitPriceRangeHighest: this.state.unitPriceRangeHighest,
      projectPhaseStart: this.state.projectPhaseStart,
      projectPhaseEnd: this.state.projectPhaseEnd,
      experienceYear: this.state.experienceYear,
      noOfInterviewCode: this.state.noOfInterviewCode,
    };
    if (sendValues !== null && sendValues !== undefined) {
      projectInfoModel = sendValues;
    }
    axios
      .post(this.state.serverIP + "projectInfoSearch/search", projectInfoModel)
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.setState(
            {
              projectInfoList: result.data.projectInfoList,
              errorsMessageShow: false,
            },
            () => {
              if (
                this.props.location.state !== undefined &&
                sendValues !== null &&
                sendValues !== undefined
              ) {
                let index = this.state.projectInfoList.findIndex(
                  (projectInfo) =>
                    projectInfo.projectNo ===
                    this.props.location.state.selectedProjectNo
                );
                var currentPage = Math.ceil((index + 1) / 5);
                this.refs.projectInfoSearchTable.setState({
                  selectedRowKeys: this.props.location.state.selectedProjectNo,
                  currPage: currentPage,
                });
                $('button[name="clickButton"]').attr("disabled", false);
              } else {
                $('button[name="clickButton"]').attr("disabled", true);
                this.refs.projectInfoSearchTable.setState({
                  selectedRowKeys: [],
                });
              }
            }
          );
        } else {
          this.setState({
            projectInfoList: [],
          });
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
        this.setState({
          searchFlag: true,
        });
      })
      .catch((error) => {
        alert("检索错误，请检查程序");
      });
  };
  admissionPeriodChange = (date) => {
    if (date !== null) {
      this.setState({
        admissionPeriod: date,
      });
    } else {
      this.setState({
        admissionPeriod: "",
      });
    }
  };
  /**
   * 削除ボタン
   */
  delete = () => {
    var a = window.confirm("削除していただきますか？");
    if (a) {
      $("#deleteBtn").click();
    }
  };
  /**
   * 小さい画面の閉め
   */
  handleHideModal = (Kbn) => {
    this.setState({ showProjectContentModal: false });
  };
  /**
   *  小さい画面の開き
   */
  handleShowModal = (Kbn) => {
    this.setState({ showProjectContentModal: true });
  };
  successRateNameData = (cell, row) => {
    if (row.endFlag === "0") {
      return <div style={{ color: "gray" }}>{row.successRateName}</div>;
    } else {
      var successRate = row.successRate;
      if (successRate === "0" || successRate === "1") {
        return <i style={{ color: "red" }}>{row.successRateName}</i>;
      } else {
        return row.successRateName;
      }
    }
  };

  showSiteLocation = (cell, row) => {
    if (row.siteLocation !== null && row.siteLocation !== "") {
      if (row.endFlag === "0") {
        return (
          <div style={{ color: "gray" }}>
            {this.state.stationDrop.find((v) => v.code === row.siteLocation)
              .name || {}}
          </div>
        );
      } else {
        return (
          this.state.stationDrop.find((v) => v.code === row.siteLocation)
            .name || {}
        );
      }
    }
  };

  showExperienceYear = (cell, row) => {
    if (row.experienceYear !== null && row.experienceYear !== "") {
      if (row.endFlag === "0") {
        return (
          <div style={{ color: "gray" }}>{row.experienceYear + "年～"}</div>
        );
      } else {
        return row.experienceYear + "年～";
      }
    }
  };

  showProjectPhaseNameStart = (cell, row) => {
    if (
      row.projectPhaseNameStart !== null &&
      row.projectPhaseNameStart !== ""
    ) {
      if (row.endFlag === "0") {
        return (
          <div style={{ color: "gray" }}>
            {row.projectPhaseNameStart + "～"}
          </div>
        );
      } else {
        return row.projectPhaseNameStart + "～";
      }
    }
  };

  showSalesStaff = (cell, row) => {
    if (row.salesStaff !== null && row.salesStaff !== "") {
      return (
        this.state.salesStaffDrop.find((v) => v.code === row.salesStaff).text ||
        {}
      );
    }
  };

  grayRow = (cell, row) => {
    if (row.endFlag === "0") {
      return <div style={{ color: "gray" }}>{cell}</div>;
    } else {
      return cell;
    }
  };

  render() {
    const {
      actionType,
      message, //toastのメッセージ
      type, //成功や失敗
      myToastShow, //toastのフラグ
      errorsMessageShow, ///エラーのメッセージのフラグ
      errorsMessageValue, //エラーのメッセージ
      //項目
      theSelectProjectperiodStatus,
      projectNo,
      keyWordOfLanagurue1,
      keyWordOfLanagurue2,
      keyWordOfLanagurue3,
      successRate,
      projectType,
      admissionPeriod,
      unitPriceRangeLowest,
      unitPriceRangeHighest,
      nationalityCode,
      japaneaseConversationLevel,
      experienceYear,
      projectPhaseStart,
      noOfInterviewCode,
      projectInfoList,
      selectedProjectNo,
      //Drop
      projectNoDrop,
      projectTypeDrop,
      nationalityDrop,
      japaneaseConversationLevelDrop,
      projectPhaseDrop,
      noOfInterviewDrop,
      successRateDrop,
      developLanguageDrop,
      theSelectProjectperiodStatusDrop,
    } = this.state;
    //テーブルの定義
    const options = {
      noDataText: <i>データなし</i>,
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
      deleteBtn: this.createCustomDeleteButton,
      onDeleteRow: this.onDeleteRow,
      handleConfirmDeleteRow: this.customConfirm,
    };
    //テーブルの行の選択
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.handleRowSelect,
    };
    return (
      <div>
        <div style={{ display: myToastShow ? "block" : "none" }}>
          <MyToast myToastShow={myToastShow} message={message} type={type} />
        </div>
        <div style={{ display: errorsMessageShow ? "block" : "none" }}>
          <ErrorsMessageToast
            errorsMessageShow={errorsMessageShow}
            message={errorsMessageValue}
            type={"danger"}
          />
        </div>
        <div id="Home">
          <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            dialogClassName="modal-projectContent"
            onHide={this.handleHideModal.bind(this)}
            show={this.state.showProjectContentModal}
          >
            <Modal.Header closeButton>
              <h2>案件文章</h2>
            </Modal.Header>
            <Modal.Body>
              <ProjectContent projectNo={selectedProjectNo} />
            </Modal.Body>
          </Modal>
          <Row inline="true">
            <Col className="text-center">
              <h2>案件検索</h2>
            </Col>
          </Row>
          <br />
          <Form id="projectInfoConditionForm">
            <Form.Group>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>選択期間</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={theSelectProjectperiodStatus}
                      name="theSelectProjectperiodStatus"
                      onChange={this.valueChange}
                    >
                      {theSelectProjectperiodStatusDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>案件番号</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      id="projectNo"
                      name="projectNo"
                      value={
                        projectNoDrop.find((v) => v.code === projectNo) || {}
                      }
                      options={projectNoDrop}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, values) =>
                        this.getProjectNo(event, values)
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="例：20200101"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-projectInfo"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>開発言語</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      id="keyWordOfLanagurue1"
                      name="keyWordOfLanagurue1"
                      value={
                        developLanguageDrop.find(
                          (v) => v.code === keyWordOfLanagurue1
                        ) || {}
                      }
                      options={developLanguageDrop}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, values) =>
                        this.getJapanese1(event, values)
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="例：JAVA"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-projectInfo-keyWordOfLanagurue"
                          />
                        </div>
                      )}
                    />
                    <Autocomplete
                      id="keyWordOfLanagurue2"
                      name="keyWordOfLanagurue2"
                      value={
                        developLanguageDrop.find(
                          (v) => v.code === keyWordOfLanagurue2
                        ) || {}
                      }
                      options={developLanguageDrop}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, values) =>
                        this.getJapanese2(event, values)
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="例：JAVA"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-projectInfo-keyWordOfLanagurue"
                          />
                        </div>
                      )}
                    />
                    <Autocomplete
                      hidden
                      id="keyWordOfLanagurue3"
                      name="keyWordOfLanagurue3"
                      value={
                        developLanguageDrop.find(
                          (v) => v.code === keyWordOfLanagurue3
                        ) || {}
                      }
                      options={developLanguageDrop}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, values) =>
                        this.getJapanese3(event, values)
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="例：JAVA"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-projectInfo-keyWordOfLanagurue"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>確率</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={successRate}
                      name="successRate"
                      onChange={this.valueChange}
                    >
                      {successRateDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>案件種別</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={projectType}
                      name="projectType"
                      onChange={this.valueChange}
                    >
                      {projectTypeDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>入場時期</InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={admissionPeriod}
                      onChange={this.admissionPeriodChange}
                      autoComplete="off"
                      locale="pt-BR"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      minDate={new Date()}
                      showDisabledMonthNavigation
                      className="form-control form-control-sm"
                      id="projectInfoSearchDatePicker"
                      dateFormat={"yyyy/MM"}
                      name="admissionPeriod"
                      locale="ja"
                      disabled={actionType === "detail" ? true : false}
                    />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>単価範囲</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      maxLength="3"
                      value={unitPriceRangeLowest}
                      placeholder="例：123"
                      name="unitPriceRangeLowest"
                      onChange={(e) =>
                        this.vNumberChange(e, "unitPriceRangeLowest")
                      }
                    ></FormControl>
                    {"~"}
                    <FormControl
                      maxLength="3"
                      value={unitPriceRangeHighest}
                      placeholder="例：123"
                      name="unitPriceRangeHighest"
                      onChange={(e) =>
                        this.vNumberChange(e, "unitPriceRangeHighest")
                      }
                    ></FormControl>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>国籍制限</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={nationalityCode}
                      name="nationalityCode"
                      onChange={this.valueChange}
                    >
                      {nationalityDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>日本語</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={japaneaseConversationLevel}
                      name="japaneaseConversationLevel"
                      onChange={this.valueChange}
                    >
                      {japaneaseConversationLevelDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>年数要求</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      maxLength="2"
                      placeholder="例：10"
                      value={experienceYear}
                      name="experienceYear"
                      onChange={(e) => this.vNumberChange(e, "experienceYear")}
                    ></FormControl>
                    <font
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        marginTop: "5px",
                      }}
                    >
                      年以上
                    </font>
                  </InputGroup>
                </Col>
                <Col sm={6}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>作業工程</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={projectPhaseStart}
                      name="projectPhaseStart"
                      onChange={this.valueChange}
                    >
                      {projectPhaseDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                    <font style={{ marginTop: "5px" }}>から</font>

                    <InputGroup.Prepend>
                      <InputGroup.Text>面談回数</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={noOfInterviewCode}
                      name="noOfInterviewCode"
                      onChange={this.valueChange}
                    >
                      {noOfInterviewDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          <div style={{ textAlign: "center" }}>
            <Button
              size="sm"
              variant="info"
              onClick={this.search.bind(this, null)}
            >
              <FontAwesomeIcon icon={faSearch} /> 検索
            </Button>{" "}
            <Button
              size="sm"
              onClick={this.shuseiTo.bind(this, "insert")}
              variant="info"
            >
              <FontAwesomeIcon icon={faSave} /> 追加
            </Button>{" "}
            <Button
              size="sm"
              variant="info"
              type="reset"
              onClick={this.resetValue}
            >
              <FontAwesomeIcon icon={faUndo} /> Reset
            </Button>
          </div>
          <div>
            <Row>
              <Col sm={7}>
                <Button
                  size="sm"
                  variant="info"
                  name="clickButton"
                  id="selectCustomer"
                  variant="info"
                  onClick={this.shuseiTo.bind(this, "customer")}
                >
                  <FontAwesomeIcon icon={faEnvelope} /> お客様選択
                </Button>{" "}
              </Col>
              <Col sm={5}>
                <div style={{ float: "right" }}>
                  <Button
                    size="sm"
                    onClick={this.endFlagChange}
                    name="clickButton"
                    id="endFlag"
                    variant="info"
                  >
                    <FontAwesomeIcon icon={faList} />
                    {this.state.endFlag === "0" ? " 再開" : " 終了"}
                  </Button>{" "}
                  <Button
                    size="sm"
                    onClick={this.shuseiTo.bind(this, "detail")}
                    name="clickButton"
                    id="detail"
                    variant="info"
                  >
                    <FontAwesomeIcon icon={faList} /> 詳細
                  </Button>{" "}
                  <Button
                    size="sm"
                    onClick={this.shuseiTo.bind(this, "update")}
                    name="clickButton"
                    id="update"
                    variant="info"
                  >
                    <FontAwesomeIcon icon={faEdit} /> 修正
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="info"
                    name="clickButton"
                    id="delete"
                    variant="info"
                    onClick={this.delete}
                  >
                    <FontAwesomeIcon icon={faTrash} /> 削除
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="info"
                    name="clickButton"
                    id="projectContent"
                    variant="info"
                    onClick={this.handleShowModal.bind(this)}
                  >
                    <FontAwesomeIcon icon={faBook} /> 案件文章
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col sm={12}>
                <BootstrapTable
                  ref="projectInfoSearchTable"
                  data={projectInfoList}
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
                    row="0"
                    rowSpan="2"
                    width="70"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataField="rowNo"
                  >
                    番号
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataField="projectNo"
                    isKey
                  >
                    案件番号
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="120"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.successRateNameData.bind(this)}
                    dataField="successRateName"
                  >
                    確率
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="150"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataField="admissionPeriodReset"
                  >
                    入場時期
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.showSiteLocation}
                    dataField="siteLocation"
                  >
                    場所
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="110"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataField="japaneaseConversationName"
                  >
                    日本語
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="95"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.showExperienceYear}
                    dataField="experienceYear"
                  >
                    経験年数
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                    hidden
                    dataField="unitPriceRangeHighest"
                  >
                    単価上限
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="125"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.showProjectPhaseNameStart}
                    dataField="projectPhaseNameStart"
                  >
                    作業工程
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="130"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataField="customerName"
                  >
                    お客様
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    colSpan="2"
                    rowSpan="1"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                  >
                    開発言語
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row="1"
                    rowSpan="1"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataField="keyWordOfLanagurueName1"
                  ></TableHeaderColumn>
                  <TableHeaderColumn
                    row="1"
                    rowSpan="1"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataField="keyWordOfLanagurueName2"
                  ></TableHeaderColumn>
                  <TableHeaderColumn
                    row="1"
                    rowSpan="1"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                    hidden
                    dataField="keyWordOfLanagurueName3"
                  ></TableHeaderColumn>
                  <TableHeaderColumn
                    row="0"
                    rowSpan="2"
                    width="90"
                    tdStyle={{ padding: ".45em" }}
                    dataFormat={this.grayRow}
                    dataFormat={this.showSalesStaff}
                    dataField="salesStaff"
                  >
                    営業担当
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectInfoSearch;
