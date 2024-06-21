import React from "react";
import {
  Form,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl,
  Container,
} from "react-bootstrap";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import * as publicUtils from "./utils/publicUtils.js";
import "../asserts/css/style.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import store from "./redux/store";
import "../asserts/css/interviewInformation.css";
import moment from "moment";
axios.defaults.withCredentials = true;

/**
 * 営業状況画面
 */
class interviewInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.columnClassNameFormat = this.columnClassNameFormat.bind(this);
    this.getInterviewResultAwaitingOption = this.getInterviewResultAwaitingOption.bind(this);
  }

  // 初期化
  initialState = {
    yearMonth: "",
    interviewLists: [],
    interviewClassificationCode: "0",
    interviewNumbers: "", // 面接1回数
    interviewDateShow: "", // 面接1日付
    interviewDate: "", // 面接1日付
    stationCode: "", // 面接1場所
    interviewCustomer: "", // 面接1客様
    interviewInfo: "",
    employeeNo: "",
    row: "",
    interviewInfoNum: "1",
    getstations: store.getState().dropDown[14], // 全部場所
    customers: store.getState().dropDown[15], // 全部お客様 画面入力用
    interviewClassification: store.getState().dropDown[76].slice(1), // 全部お客様 画面入力用
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    customerDrop: store.getState().dropDown[56]?.filter((item) => item.employeeFormCode !== '4')?.slice(1),
    successRate: "",
    successRateDrop: store
      .getState()
      .dropDown[48].filter(
        (value) => value.name === "非常に高い" || value.name === ""
      ),
    salesStaff: "",
    selectedRowIndex: "",
    interviewResultAwaiting: "",
  };

  // 初期表示のレコードを取る
  componentDidMount() {
    this.getInterviewLists();
  }

  getInterviewLists = () => {
    let employeeNoList = [];
    for (let i = 0; i < this.props.sendValue.interviewLists.length; i++) {
      if (
        this.props.sendValue.interviewLists[i].salesProgressCode !== "0" &&
        this.props.sendValue.interviewLists[i].salesProgressCode !== "1"
      )
        employeeNoList.push(this.props.sendValue.interviewLists[i].employeeNo);
    }
    if (employeeNoList.length > 0) {
      axios
        .post(
          this.state.serverIP + "salesSituation/getInterviewLists",
          employeeNoList
        )
        .then((result) => {
          if (result.data != null) {
            this.setState({
              interviewLists: result.data,
              yearMonth: this.getNextMonth(new Date(), 1),
            });
          } else {
            alert("FAIL");
          }
        })
        .catch(function (error) {
          alert("ERR");
        });
    }
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
    return y + "" + m;
  };

  update = () => {
    let interviewModel = {};
    interviewModel["employeeNo"] = this.state.employeeNo;
    interviewModel["salesYearAndMonth"] = this.state.yearMonth;

    interviewModel["interviewResultAwaiting1"] =
      this.state.interviewLists?.[this.state.selectedRowIndex]?.interviewResultAwaiting1 ?? "";
    interviewModel["interviewResultAwaiting2"] =
      this.state.interviewLists?.[this.state.selectedRowIndex]?.interviewResultAwaiting2 ?? "";

    if (!!this.state.interviewResultAwaiting
      && !!interviewModel["interviewResultAwaiting1"]
      && !!interviewModel["interviewResultAwaiting2"]) {
      alert("【結果待ち】2件以上は追加できません。");
      return;
    }

    if (!!this.state.interviewResultAwaiting) {
      const interviewCustomer = this.state.customers.find(v => v.code === this.state.interviewCustomer)?.name ?? "";
      const salesStaff = this.state.customerDrop.find(v => v.code === this.state.salesStaff)?.name ?? "";
      const interviewDate = moment(this.state.interviewDate, "YYYYMMDDHHmm").format("YYYY/MM/DD");

      if (!!interviewModel["interviewResultAwaiting1"]) {
        interviewModel["interviewResultAwaiting2"] = `${interviewCustomer}(${interviewDate}, ${salesStaff})`;
      } else {
        interviewModel["interviewResultAwaiting1"] = `${interviewCustomer}(${interviewDate}, ${salesStaff})`;
      }
    }

    if (this.state.interviewInfoNum === "1") {
      interviewModel["interviewClassificationCode1"] =
        this.state.interviewClassificationCode;
      interviewModel["interviewDate1"] = this.state.interviewDate;
      interviewModel["stationCode1"] = this.state.stationCode;
      interviewModel["interviewCustomer1"] = this.state.interviewCustomer;
      interviewModel["interviewInfo1"] = this.state.interviewInfo;
      interviewModel["successRate1"] = this.state.successRate;
      interviewModel["salesStaff1"] = this.state.salesStaff;

      interviewModel["interviewClassificationCode2"] =
        this.state.row.interviewClassificationCode2 === null
          ? ""
          : this.state.row.interviewClassificationCode2;
      interviewModel["interviewDate2"] =
        this.state.row.interviewDate2 === null
          ? ""
          : this.state.row.interviewDate2;
      interviewModel["stationCode2"] =
        this.state.row.stationCode2 === null ? "" : this.state.row.stationCode2;
      interviewModel["interviewCustomer2"] =
        this.state.row.interviewCustomer2 === null
          ? ""
          : this.state.row.interviewCustomer2;
      interviewModel["interviewInfo2"] =
        this.state.row.interviewInfo2 === null
          ? ""
          : this.state.row.interviewInfo2;
      interviewModel["successRate2"] =
        this.state.row.successRate2 === null ? "" : this.state.row.successRate2;
      interviewModel["salesStaff2"] =
        this.state.row.salesStaff2 === null ? "" : this.state.row.salesStaff2;
    } else if (this.state.interviewInfoNum === "2") {
      interviewModel["interviewClassificationCode1"] =
        this.state.row.interviewClassificationCode1;
      interviewModel["interviewDate1"] = this.state.row.interviewDate1;
      interviewModel["stationCode1"] = this.state.row.stationCode1;
      interviewModel["interviewCustomer1"] = this.state.row.interviewCustomer1;
      interviewModel["interviewInfo1"] = this.state.row.interviewInfo1;
      interviewModel["successRate1"] = this.state.row.successRate1;
      interviewModel["salesStaff1"] = this.state.row.salesStaff1;

      interviewModel["interviewClassificationCode2"] =
        this.state.interviewClassificationCode;
      interviewModel["interviewDate2"] = this.state.interviewDate;
      interviewModel["stationCode2"] = this.state.stationCode;
      interviewModel["interviewCustomer2"] = this.state.interviewCustomer;
      interviewModel["interviewInfo2"] = this.state.interviewInfo;
      interviewModel["successRate2"] = this.state.successRate;
      interviewModel["salesStaff2"] = this.state.salesStaff;
    }

    axios
      .post(
        this.state.serverIP + "salesSituation/updateInterviewLists",
        interviewModel
      )
      .then((result) => {
        if (result.data != null) {
          if (result.data.errorsMessage != null) {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: result.data.errorsMessage,
            });
          } else {
            this.setState({
              myToastShow: true,
              message: "更新成功!",
              errorsMessageShow: false,
              errorsMessageValue: "",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            this.getInterviewLists();
          }
        } else {
          alert("FAIL");
        }
      })
      .catch(function (error) {
        alert("ERR");
      });
  };

  clear = () => {
    var a = window.confirm("削除してもよろしいでしょうか？");
    if (a) {
      let interviewModel = {};
      interviewModel["employeeNo"] = this.state.employeeNo;
      interviewModel["salesYearAndMonth"] = this.state.yearMonth;
      if (this.state.interviewInfoNum === "1") {
        interviewModel["interviewClassificationCode1"] = "";
        interviewModel["interviewDate1"] = "";
        interviewModel["stationCode1"] = "";
        interviewModel["interviewCustomer1"] = "";
        interviewModel["interviewInfo1"] = "";
        interviewModel["successRate1"] = "";
        interviewModel["salesStaff1"] = "";

        interviewModel["interviewClassificationCode2"] =
          this.state.row.interviewClassificationCode2 === null
            ? ""
            : this.state.row.interviewClassificationCode2;
        interviewModel["interviewDate2"] =
          this.state.row.interviewDate2 === null
            ? ""
            : this.state.row.interviewDate2;
        interviewModel["stationCode2"] =
          this.state.row.stationCode2 === null
            ? ""
            : this.state.row.stationCode2;
        interviewModel["interviewCustomer2"] =
          this.state.row.interviewCustomer2 === null
            ? ""
            : this.state.row.interviewCustomer2;
        interviewModel["interviewInfo2"] =
          this.state.row.interviewInfo2 === null
            ? ""
            : this.state.row.interviewInfo2;
        interviewModel["successRate2"] =
          this.state.row.successRate2 === null
            ? ""
            : this.state.row.successRate2;
        interviewModel["salesStaff2"] =
          this.state.row.salesStaff2 === null ? "" : this.state.row.salesStaff2;

        interviewModel["interviewResultAwaiting1"] =
          this.state.row.interviewResultAwaiting1 ?? ""
        interviewModel["interviewResultAwaiting2"] =
          this.state.row.interviewResultAwaiting2 ?? ""
      } else if (this.state.interviewInfoNum === "2") {
        interviewModel["interviewClassificationCode1"] =
          this.state.row.interviewClassificationCode1;
        interviewModel["interviewDate1"] = this.state.row.interviewDate1;
        interviewModel["stationCode1"] = this.state.row.stationCode1;
        interviewModel["interviewCustomer1"] =
          this.state.row.interviewCustomer1;
        interviewModel["interviewInfo1"] = this.state.row.interviewInfo1;
        interviewModel["successRate1"] = this.state.row.successRate1;
        interviewModel["salesStaff1"] = this.state.row.salesStaff1;

        interviewModel["interviewClassificationCode2"] = "";
        interviewModel["interviewDate2"] = "";
        interviewModel["stationCode2"] = "";
        interviewModel["interviewCustomer2"] = "";
        interviewModel["interviewInfo2"] = "";
        interviewModel["successRate2"] = "";
        interviewModel["salesStaff2"] = "";

        interviewModel["interviewResultAwaiting1"] =
          this.state.row.interviewResultAwaiting1 ?? ""
        interviewModel["interviewResultAwaiting2"] =
          this.state.row.interviewResultAwaiting2 ?? ""
      } else if (this.state.interviewInfoNum === "3") {
        interviewModel["interviewClassificationCode1"] =
          this.state.row.interviewClassificationCode1 ?? "";
        interviewModel["interviewDate1"] = this.state.row.interviewDate1 ?? "";
        interviewModel["stationCode1"] = this.state.row.stationCode1 ?? "";
        interviewModel["interviewCustomer1"] =
          this.state.row.interviewCustomer1 ?? "";
        interviewModel["interviewInfo1"] = this.state.row.interviewInfo1 ?? "";
        interviewModel["successRate1"] = this.state.row.successRate1 ?? "";
        interviewModel["salesStaff1"] = this.state.row.salesStaff1 ?? "";
        interviewModel["interviewClassificationCode2"] =
          this.state.row.interviewClassificationCode2 ?? "";
        interviewModel["interviewDate2"] = this.state.row.interviewDate2 ?? "";
        interviewModel["stationCode2"] = this.state.row.stationCode2 ?? "";
        interviewModel["interviewCustomer2"] =
          this.state.row.interviewCustomer2 ?? "";
        interviewModel["interviewInfo2"] = this.state.row.interviewInfo2 ?? "";
        interviewModel["successRate2"] = this.state.row.successRate2 ?? "";
        interviewModel["salesStaff2"] = this.state.row.salesStaff2 ?? "";

        interviewModel["interviewResultAwaiting1"] = "";
        interviewModel["interviewResultAwaiting2"] =
          this.state.row.interviewResultAwaiting2 ?? "";
      } else if (this.state.interviewInfoNum === "4") {
        interviewModel["interviewClassificationCode1"] =
          this.state.row.interviewClassificationCode1 ?? "";
        interviewModel["interviewDate1"] = this.state.row.interviewDate1 ?? "";
        interviewModel["stationCode1"] = this.state.row.stationCode1 ?? "";
        interviewModel["interviewCustomer1"] =
          this.state.row.interviewCustomer1 ?? "";
        interviewModel["interviewInfo1"] = this.state.row.interviewInfo1 ?? "";
        interviewModel["successRate1"] = this.state.row.successRate1 ?? "";
        interviewModel["salesStaff1"] = this.state.row.salesStaff1 ?? "";
        interviewModel["interviewClassificationCode2"] =
          this.state.row.interviewClassificationCode2 ?? "";
        interviewModel["interviewDate2"] = this.state.row.interviewDate2 ?? "";
        interviewModel["stationCode2"] = this.state.row.stationCode2 ?? "";
        interviewModel["interviewCustomer2"] =
          this.state.row.interviewCustomer2 ?? "";
        interviewModel["interviewInfo2"] = this.state.row.interviewInfo2 ?? "";
        interviewModel["successRate2"] = this.state.row.successRate2 ?? "";
        interviewModel["salesStaff2"] = this.state.row.salesStaff2 ?? "";

        interviewModel["interviewResultAwaiting1"] =
          this.state.row.interviewResultAwaiting1 ?? "";
        interviewModel["interviewResultAwaiting2"] = "";
      }
      axios
        .post(
          this.state.serverIP + "salesSituation/deleteInterviewLists",
          interviewModel
        )
        .then((result) => {
          if (result.data != null) {
            if (result.data.errorsMessage != null) {
              this.setState({
                errorsMessageShow: true,
                errorsMessageValue: result.data.errorsMessage,
              });
            } else {
              this.setState({
                myToastShow: true,
                message: "削除成功!",
                errorsMessageShow: false,
                errorsMessageValue: "",
              });
              setTimeout(() => this.setState({ myToastShow: false }), 3000);
              this.getInterviewLists();
            }
          } else {
            alert("FAIL");
          }
        })
        .catch(function (error) {
          alert("ERR");
        });
    }
  };

  // onchange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // setinterviewDate1
  setinterviewDate = (date) => {
    this.setState({
      interviewDateShow: date,
      interviewDate: publicUtils.timeToStr(date),
    });
  };

  // レコードselect事件
  handleRowSelect = (row, isSelected, event, rowIndex) => {
    let columnIndex = 0;
    let interviewInfoNum = 1;

    if (event.target?.tabIndex === -1) {
      const tabIndex = event.target?.parentNode?.tabIndex;
      columnIndex = (tabIndex % 13) - 2;
    } else {
      const tabIndex = event.target?.tabIndex;
      columnIndex = (tabIndex % 13) - 2;
    }

    if (columnIndex >= 0 && columnIndex < 5) {
      interviewInfoNum = 1;
    } else if (columnIndex >= 5 && columnIndex < 10) {
      interviewInfoNum = 2;
    } else if (columnIndex === 10) {
      interviewInfoNum = 3;
    } else {
      // current columnIndex is -2
      interviewInfoNum = 4;
    }

    if (isSelected) {
      if (interviewInfoNum === 1) {
        this.setState({
          row: row,
          selectedRowIndex: rowIndex,
          employeeNo: row.employeeNo,
          interviewClassificationCode:
            row.interviewClassificationCode1 === null ||
              row.interviewClassificationCode1 === ""
              ? "0"
              : row.interviewClassificationCode1,
          interviewDateShow:
            row.interviewDate1 === null
              ? ""
              : new Date(publicUtils.strToTime(row.interviewDate1)).getTime(),
          interviewDate: row.interviewDate1 === null ? "" : row.interviewDate1,
          stationCode: row.stationCode1 === null ? "" : row.stationCode1,
          interviewCustomer:
            row.interviewCustomer1 === null ? "" : row.interviewCustomer1,
          interviewInfo: row.interviewInfo1 === null ? "" : row.interviewInfo1,
          successRate: row.successRate1 === null ? "" : row.successRate1,
          salesStaff: row.salesStaff1 === null ? "" : row.salesStaff1,
          interviewInfoNum: interviewInfoNum.toString(),
        });
      } else if (interviewInfoNum === 2) {
        this.setState({
          row: row,
          selectedRowIndex: rowIndex,
          employeeNo: row.employeeNo,
          interviewClassificationCode:
            row.interviewClassificationCode2 === null ||
              row.interviewClassificationCode2 === ""
              ? "0"
              : row.interviewClassificationCode2,
          interviewDateShow:
            row.interviewDate2 === null
              ? ""
              : new Date(publicUtils.strToTime(row.interviewDate2)).getTime(),
          interviewDate: row.interviewDate2 === null ? "" : row.interviewDate2,
          stationCode: row.stationCode2 === null ? "" : row.stationCode2,
          interviewCustomer:
            row.interviewCustomer2 === null ? "" : row.interviewCustomer2,
          interviewInfo: row.interviewInfo2 === null ? "" : row.interviewInfo2,
          successRate: row.successRate2 === null ? "" : row.successRate2,
          salesStaff: row.salesStaff2 === null ? "" : row.salesStaff2,
          interviewInfoNum: interviewInfoNum.toString(),
        });
      } else {
        this.setState({
          row: row,
          selectedRowIndex: rowIndex,
          employeeNo: row.employeeNo,
          interviewClassificationCode: "0",
          interviewDateShow: "",
          interviewDate: "",
          stationCode: "",
          interviewCustomer: "",
          interviewInfo: "",
          successRate: "",
          salesStaff: "",
          interviewInfoNum: interviewInfoNum.toString(),
        });
      }
    } else {
      this.setState({
        row: "",
        employeeNo: "",
        interviewClassificationCode: "0",
        interviewDateShow: "",
        interviewDate: "",
        stationCode: "",
        interviewCustomer: "",
        interviewInfo: "",
        successRate: "",
        salesStaff: "",
        selectedRowIndex: "",
      });
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

  // 面談回数
  formatInterviewClassificationCode = (cell, row) => {
    var interviewClassification = this.state.interviewClassification;
    for (var i in interviewClassification) {
      if (cell === interviewClassification[i].code) {
        return interviewClassification[i].name;
      }
    }
  };

  // 日付
  formatInterviewDate = (cell, row) => {
    if (cell != undefined && cell != null && cell != "") {
      return (
        cell.substring(0, 4) +
        "/" +
        cell.substring(4, 6) +
        "/" +
        cell.substring(6, 8) +
        " " +
        cell.substring(8, 10) +
        ":" +
        cell.substring(10, 12)
      );
    }
  };

  // お客様
  formatInterviewCustomer = (cell, row) => {
    var customers = this.state.customers;
    for (var i in customers) {
      if (cell === customers[i].code) {
        return customers[i].name;
      }
    }
  };

  // 場所
  formatStationCode = (cell, row) => {
    var getstations = this.state.getstations;
    for (var i in getstations) {
      if (cell === getstations[i].code) {
        return getstations[i].name;
      }
    }
  };

  // 営業担当
  formatSalesStaff = (cell) => {
    const targetCustomer = this.state.customerDrop.find((v) => v.code === cell);
    return targetCustomer?.name;
  };

  // 結果待ち
  formatInterviewResultAwaiting = (cell) => {
    if (!cell) {
      return "";
    }

    const tooltip = (
      <Tooltip id="tooltip">
        {cell}
      </Tooltip>
    );

    return (
      <OverlayTrigger
        placement="bottom"
        overlay={tooltip}
        trigger={"hover"}
      >
        <div>{cell}</div>
      </OverlayTrigger>
    );
  }

  /**
   * 社員名連想
   * @param {} event
   */
  getCustomer = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let interviewCustomer = null;
        if (values !== null) {
          interviewCustomer = values.code;
        }
        this.setState({
          interviewCustomer: interviewCustomer,
        });
      }
    );
  };

  /**
   * 営業担当連想
   */
  getSalesStaff = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let salesStaff = null;
        if (values !== null) {
          salesStaff = values.code;
        }
        this.setState({
          salesStaff,
        });
      }
    );
  };

  getStation = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let stationCode = null;
        if (values !== null) {
          stationCode = values.code;
        }
        this.setState({
          stationCode: stationCode,
        });
      }
    );
  };

  columnClassNameFormat(_fieldValue, row, rowIdx, colIdx) {
    let columnInterviewInfoNum = "1";

    if (colIdx >= 1 && colIdx < 6) {
      columnInterviewInfoNum = "1";
    } else if (colIdx >= 6 && colIdx < 11) {
      columnInterviewInfoNum = "2";
    } else if (colIdx === 11) {
      columnInterviewInfoNum = "3";
    } else {
      columnInterviewInfoNum = "4";
    }

    if (
      this.state.selectedRowIndex === rowIdx &&
      columnInterviewInfoNum === this.state.interviewInfoNum
    ) {
      return "selected";
    }

    if (row.successRate1 === "0" && colIdx >= 1 && colIdx <= 5) {
      return "highSuccessRate";
    }

    if (row.successRate2 === "0" && colIdx >= 6 && colIdx <= 10) {
      return "highSuccessRate";
    }
  }

  // 結果待ちオプション
  getInterviewResultAwaitingOption() {
    if ((this.state.interviewInfoNum === "1" && !this.state.interviewLists[this.state.selectedRowIndex]?.interviewDate1)
      || (this.state.interviewInfoNum === "2" && !this.state.interviewLists[this.state.selectedRowIndex]?.interviewDate2)) {
      return [{
        name: "",
      }];
    } else {
      return [
        {
          name: "",
        },
        {
          name: "設定"
        }
      ];
    }
  }

  render() {
    const selectRow = {
      mode: "radio",
      clickToSelectAndEditCell: true,
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.handleRowSelect,
    };

    const options = {
      noDataText: (
        <i className="" style={{ fontSize: "24px" }}>
          show what you want to show!
        </i>
      ),
      defaultSortOrder: "dsc",
      sizePerPage: 10,
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

    return (
      <div className="interviewInformation">
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={this.state.message}
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

        <Container fluid>
          <Row className="rowContainer">
            <Col sm={15}>
              <Row className="rowContainer1">
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        面談回数
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="interviewClassificationCode"
                      value={this.state.interviewClassificationCode}
                      autoComplete="off"
                    >
                      {this.state.interviewClassification.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup
                    size="sm"
                    className="mb-3 flexWrapNoWrap"
                    style={{ flexFlow: "nowrap", width: "200%" }}
                  >
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        日付
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <DatePicker
                        selected={this.state.interviewDateShow}
                        onChange={this.setinterviewDate}
                        autoComplete="off"
                        locale="ja"
                        showTimeSelect
                        timeIntervals={15}
                        className="form-control form-control-sm"
                        dateFormat="MM/dd HH:mm"
                        minDate={new Date()}
                        id={"datePicker-interview"}
                      />
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        場所
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      name="stationCode"
                      options={this.state.getstations}
                      getOptionLabel={(option) =>
                        option.name ? option.name : ""
                      }
                      value={
                        this.state.getstations.find(
                          (v) => v.code === this.state.stationCode
                        ) || ""
                      }
                      onChange={(event, values) =>
                        this.getStation(event, values)
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            id="stationCode"
                            className="auto form-control Autocompletestyle-interview"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        お客様
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      name="interviewCustomer"
                      options={this.state.customers}
                      getOptionLabel={(option) =>
                        option.name ? option.name : ""
                      }
                      value={
                        this.state.customers.find(
                          (v) => v.code === this.state.interviewCustomer
                        ) || ""
                      }
                      onChange={(event, values) =>
                        this.getCustomer(event, values)
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            id="interviewCustomer"
                            className="auto form-control Autocompletestyle-interview"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        営業担当
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      name="salesStaff"
                      value={
                        this.state.customerDrop.find(
                          (v) => v.code === this.state.salesStaff
                        ) || {}
                      }
                      options={this.state.customerDrop}
                      getOptionLabel={(option) => option.text || ""}
                      onChange={(event, values) => {
                        this.getSalesStaff(event, values);
                      }}
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
                            className="auto form-control Autocompletestyle-customerInfo w100p"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className="rowContainer1">
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        確率
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      value={this.state.successRate}
                      name="successRate"
                      onChange={this.valueChange}
                    >
                      {this.state.successRateDrop.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
                <Col sm={9}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        面談情報
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <textarea
                      ref={(textarea) => (this.textArea = textarea)}
                      maxLength="300"
                      value={this.state.interviewInfo}
                      id="interviewInfo"
                      name="interviewInfo"
                      onChange={this.valueChange}
                      className="auto form-control Autocompletestyle-interview-text"
                      style={{
                        resize: "vertical",
                        overflow: "auto",
                        height: `calc(1.5em + 0.5rem + 2px)`,
                        marginRight: "1em",
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col sm={2}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        結果待ち
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      options={this.getInterviewResultAwaitingOption()}
                      getOptionLabel={(option) =>
                        option.name ? option.name : ""
                      }
                      value={{ name: this.state.interviewResultAwaiting }}
                      onChange={(_event, values) => {
                        this.setState({ interviewResultAwaiting: values?.name ?? "" });
                      }}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            id="stationCode"
                            className="auto form-control Autocompletestyle-interview"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

        <div className="df justify-between">
          <p className="warningInfo">
            ※面接の予定が3日を超えると、自動的に削除されます
          </p>
          <div >
            <Button
              size="sm"
              variant="info"
              name="clickButton"
              onClick={this.update}
              disabled={
                this.state.employeeNo === "" ||
                  this.state.interviewInfoNum === "3" ||
                  this.state.interviewInfoNum === "4"
                  ? true
                  : false
              }
            >
              <FontAwesomeIcon icon={faSave} />更新
            </Button>{" "}
            <Button
              size="sm"
              variant="info"
              name="clickButton"
              onClick={this.clear}
              disabled={this.state.employeeNo === "" ? true : false}
              style={{ marginRight: 30 }}
            >
              <FontAwesomeIcon icon={faTrash} />削除
            </Button>
          </div>
        </div>

        <Form onSubmit={this.savealesSituation}>
          <Row>
            <Col>
              <Col sm={12}>
                <BootstrapTable
                  ref="table"
                  data={this.state.interviewLists}
                  pagination
                  options={options}
                  selectRow={selectRow}
                  trClassName="customClass"
                  headerStyle={{ background: "#5599FF" }}
                  striped
                  hover
                  condensed
                >
                  <TableHeaderColumn dataField="employeeNo" hidden isKey>
                    社員番号
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="10%"
                    row="0"
                    rowSpan="2"
                    dataField="employeeName"
                  >
                    {<div style={{ textAlign: "center" }}>氏名</div>}
                  </TableHeaderColumn>
                  <TableHeaderColumn row="0" colSpan="5">
                    {<div style={{ textAlign: "center" }}>面談情報1</div>}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="5%"
                    row="1"
                    dataField="interviewClassificationCode1"
                    dataFormat={this.formatInterviewClassificationCode}
                    columnClassName={this.columnClassNameFormat}
                  >
                    回数
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="12%"
                    row="1"
                    dataField="interviewDate1"
                    dataFormat={this.formatInterviewDate}
                    columnClassName={this.columnClassNameFormat}
                  >
                    日付
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="15%"
                    row="1"
                    dataField="interviewCustomer1"
                    dataFormat={this.formatInterviewCustomer}
                    columnClassName={this.columnClassNameFormat}
                  >
                    お客様
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="6%"
                    row="1"
                    dataField="stationCode1"
                    dataFormat={this.formatStationCode}
                    columnClassName={this.columnClassNameFormat}
                  >
                    場所
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="5%"
                    row="1"
                    dataField="salesStaff1"
                    dataFormat={this.formatSalesStaff}
                    columnClassName={this.columnClassNameFormat}
                  >
                    担当
                  </TableHeaderColumn>
                  <TableHeaderColumn row="0" colSpan="5">
                    {<div style={{ textAlign: "center" }}>面談情報2</div>}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="5%"
                    row="1"
                    dataField="interviewClassificationCode2"
                    dataFormat={this.formatInterviewClassificationCode}
                    columnClassName={this.columnClassNameFormat}
                  >
                    回数
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="12%"
                    row="1"
                    dataField="interviewDate2"
                    dataFormat={this.formatInterviewDate}
                    columnClassName={this.columnClassNameFormat}
                  >
                    日付
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="15%"
                    row="1"
                    dataField="interviewCustomer2"
                    dataFormat={this.formatInterviewCustomer}
                    columnClassName={this.columnClassNameFormat}
                  >
                    お客様
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="6%"
                    row="1"
                    dataField="stationCode2"
                    dataFormat={this.formatStationCode}
                    columnClassName={this.columnClassNameFormat}
                  >
                    場所
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="5%"
                    row="1"
                    dataField="salesStaff2"
                    dataFormat={this.formatSalesStaff}
                    columnClassName={this.columnClassNameFormat}
                  >
                    担当
                  </TableHeaderColumn>
                  <TableHeaderColumn row="0" colSpan="2">
                    {<div style={{ textAlign: "center" }}>結果待ち</div>}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="19%"
                    row="1"
                    colSpan="1"
                    dataField="interviewResultAwaiting1"
                    dataFormat={this.formatInterviewResultAwaiting.bind(this)}
                    columnClassName={this.columnClassNameFormat}
                  >
                    結果待ち１
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="19%"
                    row="1"
                    colSpan="1"
                    dataFormat={this.formatInterviewResultAwaiting.bind(this)}
                    dataField="interviewResultAwaiting2"
                    columnClassName={this.columnClassNameFormat}
                  >
                    結果待ち2
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default interviewInformation;
