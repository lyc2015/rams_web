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
  faEdit,
  faUpload,
  faSearch,
  faDownload,
  faSave,
  faLevelUpAlt,
} from "@fortawesome/free-solid-svg-icons";
import * as publicUtils from "./utils/publicUtils.js";
import MyToast from "./myToast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import store from "./redux/store";
import moment from "moment";
import EditableCell from "./EditableCell/index.jsx";
import {
  DatePicker as AntdDatePicker,
  Divider,
  Button as AntdButton,
  Popconfirm,
  Modal,
  notification,
  message,
} from "antd";

registerLocale("ja", ja);
axios.defaults.withCredentials = true;

moment.locale("ja");

/**
 * 社員勤務管理画面
 */
class invoicePDF extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.searchEmployee = this.searchSendInvoiceList.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }
  componentWillMount() {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        this.setState({
          authorityCode: result.data[0].authorityCode,
        });
      })
      .catch(function (error) {
        console.error("Error - " + error);
      });

    axios
      .post(this.state.serverIP + "sendInvoice/selectBankAccountInfo")
      .then((response) => {
        this.setState({
          bankAccountInfos: response.data,
        });
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  }

  componentDidMount() {
    const { state: locationState } = this.props.location;

    if (locationState) {
      // $("#datePicker").val(locationState.yearAndMonth);
      this.setState(
        {
          yearAndMonth: locationState.yearAndMonth,
          yearAndMonthFormat: moment(locationState.yearAndMonth).format(
            "YYYYMM"
          ),
          dutyManagementSelectedEmployeeNo:
            locationState.dutyManagementSelectedEmployeeNo,
          sendInvoiceTempState: locationState.sendInvoiceTempState,
        },
        () => {
          this.getCompanyDate();
        }
      );
    } else {
      this.getCompanyDate();
    }
    this.setState({
      backPage: this.props.location.state.backPage,
    });
  }

  getCompanyDate = () => {
    axios
      .post(this.state.serverIP + "subMenu/getCompanyDate")
      .then((response) => {
        this.setState(
          {
            taxRate: response.data.taxRate,
            consumptionTax: response.data.taxRate * 100 + "%",
          },
          () => {
            this.setState(
              {
                customerNo: this.props.location.state.customerNo,
                customerName: this.state.customerNameList.find(
                  (v) => v.code === this.props.location.state.customerNo
                )?.text,
                customerAbbreviation: this.state.customerAbbreviationList.find(
                  (v) => v.code === this.props.location.state.customerNo
                )?.text,
              },
              () => {
                this.setState({ loading: false });
                this.searchSendInvoiceList();
              }
            );
          }
        );
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };
  // 初期化データ
  initialState = {
    // yearAndMonth: this.props.location?.state.yearAndMonth,
    invoiceDate: moment(new Date()).endOf("month").toDate(),
    // invoiceDate: new Date(),
    // yearAndMonthFormat:
    //   String(new Date().getFullYear()) +
    //   (new Date().getMonth() + 1 < 10
    //     ? "0" + (new Date().getMonth() + 1)
    //     : new Date().getMonth() + 1),
    sendInvoiceList: [],
    currentPage: 1,
    rowRowNo: "",
    invoiceNo: "",
    systemNameFlag: false,
    workTimeFlag: false,
    employeeNameFlag: false,
    loading: true,
    addDisabledFlag: false,
    bankAccountInfos: [],
    quantitys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    requestUnitCodes: [
      { code: "0", name: "人月" },
      { code: "1", name: "件" },
    ],
    customerNameList: store.getState().dropDown[53].slice(1),
    customerAbbreviationList: store.getState().dropDown[73].slice(1),
    employeeInfo: store.getState().dropDown[9].slice(1),
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
  };

  // onChange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // 検索
  searchSendInvoiceList = () => {
    let month = this.state.yearAndMonth.getMonth() + 1;
    let invoiceNo =
      this.state.customerAbbreviation +
      "-LYC " +
      this.state.yearAndMonth.getFullYear() +
      (Number(month) < 10 ? "0" + month : month);
    this.setState({
      invoiceNo: invoiceNo,
    });
    const emp = {
      yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
      customerNo: this.state.customerNo,
      invoiceNo: invoiceNo,
      invoiceDate: moment(this.state.invoiceDate).format("YYYYMMDD"),
    };
    axios
      .post(
        this.state.serverIP + "sendInvoice/selectSendInvoiceByCustomerNo",
        emp
      )
      .then((result) => {
        console.log(result.data, "result.data");

        if (result.data.length < 1) {
          alert("データ存在していません。");
          this.setState({ loading: true });
          return;
        }
        let subTotalAmount = 0;
        let subTotalAmountNoTax = 0;
        for (let i in result.data) {
          let quantity =
            result.data[i].quantity === undefined ||
            result.data[i].quantity === null ||
            result.data[i].quantity === ""
              ? 1
              : Number(result.data[i].quantity);
          result.data[i].quantity = quantity;
          result.data[i].updateFlag = false;
          result.data[i].workPeriod =
            result.data[i].workPeriod === null ||
            result.data[i].workPeriod === ""
              ? this.state.yearAndMonthFormat +
                "01~" +
                this.state.yearAndMonthFormat +
                new Date(
                  this.state.yearAndMonthFormat.substring(0, 4),
                  this.state.yearAndMonthFormat.substring(4, 6),
                  0
                ).getDate()
              : result.data[i].workPeriod;
          if (result.data[i].requestUnitCode === "0")
            subTotalAmount +=
              Number(result.data[i].unitPrice) * quantity +
              Number(result.data[i].deductionsAndOvertimePayOfUnitPrice);
          if (result.data[i].requestUnitCode === "1")
            subTotalAmountNoTax +=
              Number(result.data[i].unitPrice) * quantity +
              Number(result.data[i].deductionsAndOvertimePayOfUnitPrice);
        }
        this.setState({
          sendInvoiceList: result.data,
          rowRowNo: "",
          subTotalAmount: publicUtils.addComma(
            subTotalAmount + subTotalAmountNoTax
          ),
          subTotalAmountTax: publicUtils.addComma(
            parseInt(subTotalAmount * this.state.taxRate)
          ),
          totalAmount: publicUtils.addComma(
            parseInt(
              subTotalAmount +
                subTotalAmount * this.state.taxRate +
                subTotalAmountNoTax
            )
          ),
          customerName: result.data[0].customerName,
          invoiceNo:
            result.data[0].invoiceNo === null
              ? this.state.invoiceNo
              : result.data[0].invoiceNo,
          remark: result.data[0].remark,
          invoiceDate:
            publicUtils.converToLocalTime(result.data[0].invoiceDate, true) ||
            this.initialState.invoiceDate,
          deadLine: publicUtils.converToLocalTime(
            result.data[0].deadLine,
            true
          ),
          bankAccountInfo: result.data[0].bankCode,
          loading: true,
        });
        this.refs.table.setState({
          selectedRowKeys: [],
        });
      })
      .catch(function (error) {
        // message.error(error);
        // this.setState({ loading: true });
      });
  };

  // 年月
  inactiveYearAndMonth = (date) => {
    this.setState({
      invoiceDate: date,
    });
  };

  inactiveDeadLine = (date) => {
    this.setState({
      deadLine: date,
    });
  };

  // 行Selectファンクション
  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({
        rowRowNo: row.rowNo,
      });
    } else {
      this.setState({
        rowRowNo: "",
      });
    }
  };

  /**
   * 戻るボタン
   */
  back = () => {
    var path = {};
    path = {
      pathname: this.state.backPage,
      state: {
        yearAndMonth: this.state.yearAndMonth,
        dutyManagementSelectedEmployeeNo:
          this.state.dutyManagementSelectedEmployeeNo,
        sendInvoiceTempState: this.state.sendInvoiceTempState,
        // employeeNo: this.props.location.state.employeeNo,
      },
    };
    this.props.history.push(path);
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

  getEmployeeName = (event, values, cell, row) => {
    if (values != null) {
      let sendInvoiceList = this.state.sendInvoiceList;
      for (let i in sendInvoiceList) {
        if (row.employeeNo === sendInvoiceList[i].employeeNo) {
          sendInvoiceList[i]["employeeName"] = values.text;
          sendInvoiceList[i]["employeeNo"] = values.code;
          break;
        }
      }

      this.setState({
        sendInvoiceList: sendInvoiceList,
        rowRowNo: row.rowNo,
      });
    }
  };

  employeeNameFormat = (cell, row) => {
    if (row.updateFlag) {
      return (
        <div>
          <Row>
            <Col style={{ margin: "0px", padding: "0px" }} sm={7}>
              <span className={"dutyRegistration-DataTableEditingCell"}>
                <input
                  placeholder="システム名を入力してください"
                  type="text"
                  className=" form-control editor edit-text"
                  maxLength={20}
                  name="workContents"
                  value={row.workContents}
                  onChange={(event) => this.tableValueChange(event, cell, row)}
                  onBlur={(event) =>
                    this.tableValueChangeAfter(event, cell, row)
                  }
                />
              </span>
            </Col>
            <Col style={{ margin: "0px", padding: "0px" }} sm={5}>
              <span className={"dutyRegistration-DataTableEditingCell"}>
                <Autocomplete
                  id="employeeName"
                  name="employeeName"
                  value={
                    this.state.employeeInfo.find(
                      (v) => v.text === row.employeeName
                    ) || {}
                  }
                  options={this.state.employeeInfo}
                  getOptionLabel={(option) => (option.text ? option.text : "")}
                  onChange={(event, values) =>
                    this.getEmployeeName(event, values, cell, row)
                  }
                  renderOption={(option) => {
                    return <React.Fragment>{option.text}</React.Fragment>;
                  }}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-siteInfoSearch-employeeNo"
                        placeholder="作業者を選んで下さい"
                      />
                    </div>
                  )}
                />
              </span>
            </Col>
          </Row>
          <Row>
            <Col style={{ margin: "0px", padding: "0px" }} sm={7}>
              <span className={"dutyRegistration-DataTableEditingCell"}>
                <input
                  placeholder="作業期間を入力してください"
                  type="text"
                  className=" form-control editor edit-text"
                  name="workPeriod"
                  value={row.workPeriod}
                  onChange={(event) => this.tableValueChange(event, cell, row)}
                  onBlur={(event) =>
                    this.tableValueChangeAfter(event, cell, row)
                  }
                />
              </span>
            </Col>
            <Col style={{ margin: "0px", padding: "0px" }} sm={5}>
              <span className={"dutyRegistration-DataTableEditingCell"}>
                <input
                  placeholder="作業時間を入力してください"
                  type="text"
                  className=" form-control editor edit-text"
                  name="sumWorkTime"
                  value={row.sumWorkTime || ""}
                  onChange={(event) => this.tableValueChange(event, cell, row)}
                  onBlur={(event) =>
                    this.tableValueChangeAfter(event, cell, row)
                  }
                />
              </span>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <div className="df">
            <div className="wordBreak">
              {/* {this.state.systemNameFlag ? row.workContents : ""} */}
              {row.systemName === null || row.systemName === ""
                ? "技術支援"
                : this.state.systemNameFlag ||
                  row.systemName.search("出張") !== -1 ||
                  row.systemName.search("食事") !== -1 ||
                  row.systemName.search("宿泊") !== -1 ||
                  row.systemName.search("他の") !== -1
                ? row.workContents
                : "技術支援"}
              <span>
                {this.state.employeeNameFlag
                  ? this.state.systemNameFlag
                    ? `(${cell})`
                    : `(${cell})` || ""
                  : ""}
              </span>
            </div>
          </div>
          <div className="df">
            <div className="mr5" sm={9}>
              {row.workPeriod}
            </div>
            <div sm={3}>
              {this.state.workTimeFlag
                ? row.sumWorkTime === null || row.sumWorkTime === ""
                  ? ""
                  : `(${row.sumWorkTime}H)`
                : ""}
            </div>
          </div>
        </div>
      );
    }
  };

  requestUnitCodeFormat = (cell, row) => {
    let returnItem =
      cell === undefined || cell === null || cell === ""
        ? ""
        : this.state.requestUnitCodes.find((v) => v.code === cell).name;
    if (row.updateFlag) {
      returnItem = (
        <span className={"dutyRegistration-DataTableEditingCell"}>
          <select
            className=" form-control editor edit-select"
            name="requestUnitCode"
            value={cell}
            onChange={(event) => {
              this.tableValueChange(event, cell, row);
              this.tableValueChangeAfter(event, cell, row);
            }}
          >
            {this.state.requestUnitCodes.map((date) => (
              <option key={date.code} value={date.code}>
                {date.name}
              </option>
            ))}
          </select>
        </span>
      );
    }
    return returnItem;
  };

  quantityFormat = (cell, row) => {
    let returnItem = cell;
    if (row.updateFlag) {
      returnItem = (
        <span className={"dutyRegistration-DataTableEditingCell"}>
          <select
            className=" form-control editor edit-select"
            name="quantity"
            value={cell}
            onChange={(event) => {
              this.tableValueChange(event, cell, row);
              this.tableValueChangeAfter(event, cell, row);
            }}
          >
            {this.state.quantitys.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </span>
      );
    }
    return returnItem;
  };

  unitPriceFormat = (cell, row) => {
    let returnItem = cell;
    if (row.updateFlag) {
      returnItem = (
        <span className={"dutyRegistration-DataTableEditingCell"}>
          <input
            type="text"
            className=" form-control editor edit-text"
            name="unitPrice"
            value={cell}
            onChange={(event) => this.tableValueChange(event, cell, row)}
            onBlur={(event) => this.tableValueChangeAfter(event, cell, row)}
          />
        </span>
      );
    } else {
      if (cell === null || cell === "" || cell === "0") return "";
      else return "￥" + publicUtils.addComma(row.unitPrice);
    }
    return returnItem;
  };

  lowerLimitFormat = (cell, row) => {
    let payOffRange = "";
    let showSeiSanPrice = "";
    if (
      row.payOffRange1 == undefined ||
      row.payOffRange1 == null ||
      row.payOffRange1 == "" ||
      row.requestUnitCode === "1"
    )
      return payOffRange;
    else if (row.payOffRange1 == 0 || row.payOffRange1 == 1) {
      payOffRange = row.payOffRange1 == 0 ? "固定" : "出勤日";
      return (
        <div>
          <Row>
            <font>{payOffRange}</font>
          </Row>
        </div>
      );
    } else {
      payOffRange = row.payOffRange1 + "H";
      showSeiSanPrice = (
        (Number(row.unitPrice) +
          Number(row.deductionsAndOvertimePayOfUnitPrice) || 0) /
        Number(row.payOffRange1)
      ).toFixed(0);
      showSeiSanPrice =
        showSeiSanPrice.substring(0, showSeiSanPrice.length - 1) + "0";
    }
    // return
    // (<div><Row><font>{payOffRange}</font></Row><Row><font>{Number(row.showSeiSanPrice)
    // < 0 ? ("￥" +
    // publicUtils.addComma(row.showSeiSanPrice)) :
    // ""}</font></Row></div>);
    return (
      <div>
        <Row>
          <font>{payOffRange}</font>
        </Row>
        <Row>
          <font>{"￥" + publicUtils.addComma(showSeiSanPrice) + "/H"}</font>
        </Row>
      </div>
    );
  };

  upperLimitFormat = (cell, row) => {
    let payOffRange = "";
    let showSeiSanPrice = "";
    if (
      row.payOffRange2 == undefined ||
      row.payOffRange2 == null ||
      row.payOffRange2 == "" ||
      row.requestUnitCode === "1"
    )
      return payOffRange;
    else if (row.payOffRange2 == 0 || row.payOffRange2 == 1) {
      payOffRange = row.payOffRange2 == 0 ? "固定" : "出勤日";
      return (
        <div>
          <Row>
            <font>{payOffRange}</font>
          </Row>
        </div>
      );
    } else {
      payOffRange = row.payOffRange2 + "H";
      showSeiSanPrice = (
        (Number(row.unitPrice) +
          Number(row.deductionsAndOvertimePayOfUnitPrice)) /
        Number(row.payOffRange2)
      ).toFixed(0);
      showSeiSanPrice =
        showSeiSanPrice.substring(0, showSeiSanPrice.length - 1) + "0";
    }
    // return
    // (<div><Row><font>{payOffRange}</font></Row><Row><font>{Number(row.showSeiSanPrice)
    // > 0 ? ("￥" +
    // publicUtils.addComma(row.showSeiSanPrice)) :
    // ""}</font></Row></div>);
    return (
      <div>
        <Row>
          <font>{payOffRange}</font>
        </Row>
        <Row>
          <font>{"￥" + publicUtils.addComma(showSeiSanPrice) + "/H"}</font>
        </Row>
      </div>
    );
  };

  billingAmountFormat = (cell, row) => {
    let billingAmount =
      Number(row.unitPrice) * row.quantity +
      Number(row.deductionsAndOvertimePayOfUnitPrice);
    if (!Number.isNaN(billingAmount)) {
      if (row.requestUnitCode === "0")
        return "￥" + publicUtils.addComma(billingAmount);
      else return "￥" + publicUtils.addComma(billingAmount) + "(税込)";
    } else {
      return "￥0";
    }
  };

  optionsFormat = (cell, row, formatExtraData, rowIdx) => {
    return (
      <>
        <Popconfirm
          title="削除してよろしいでしょうか？"
          onConfirm={(e) => {
            this.deleteRow({ e, cell, row, formatExtraData, rowIdx });
          }}
        >
          <AntdButton
            className="fwb"
            size="small"
            type="link"
            // disabled={this.state.rowRowNo === ""}
          >
            削除
          </AntdButton>
        </Popconfirm>

        <AntdButton
          className="fwb"
          size="small"
          type="link"
          onClick={(e) => {
            this.handleUpdateRow({ e, cell, row, formatExtraData, rowIdx });
          }}
          // disabled={this.state.rowRowNo === ""}
        >
          修正
        </AntdButton>
      </>
    );
  };

  systemNameFlagChange = () => {
    this.setState({
      systemNameFlag: !this.state.systemNameFlag,
    });
  };

  workTimeFlagChange = () => {
    this.setState({
      workTimeFlag: !this.state.workTimeFlag,
    });
  };

  employeeNameFlagChange = () => {
    this.setState({
      employeeNameFlag: !this.state.employeeNameFlag,
    });
  };

  addRow = () => {
    let sendInvoiceList = this.state.sendInvoiceList;
    var newRow = {};
    if (sendInvoiceList.length > 0) {
      newRow["rowNo"] = sendInvoiceList.length + 1;
    } else {
      newRow["rowNo"] = 1;
    }

    newRow["updateFlag"] = true;
    newRow["isNewAdd"] = true;
    newRow["deductionsAndOvertimePayOfUnitPrice"] = 0;
    newRow["requestUnitCode"] = "0";
    newRow["quantity"] = 1;
    newRow["unitPrice"] = "";
    newRow["systemName"] = "";
    newRow["workPeriod"] = "";
    newRow["sumWorkTime"] = "";
    newRow["oldWorkContents"] = "";
    newRow["workContents"] = "";
    newRow["customerNo"] = "";
    newRow["employeeNo"] = "";
    newRow["workingTime"] = "";
    newRow["yearAndMonth"] = this.state.yearAndMonthFormat;

    sendInvoiceList.push(newRow);
    var currentPage = Math.ceil(sendInvoiceList.length / 5);
    this.setState({
      sendInvoiceList: sendInvoiceList,
      currentPage: currentPage,
      // addDisabledFlag: true,
      rowRowNo: "",
    });
  };

  deleteAll = async () => {
    try {
      this.setState({ sendInvoiceList: [], resetLoading: true });

      let model = {
        yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
        customerNo: this.state.customerNo,
      };

      let result = await axios.post(
        this.state.serverIP + "sendInvoice/deleteInvoiceDataAll",
        model
      );

      if (result) {
        message.success("リセット成功！");
        this.searchSendInvoiceList();
      } else {
        message.error("リセット失敗した");
      }
      this.setState({ resetLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  deleteRow = ({ e, cell, row, formatExtraData, rowIdx }) => {
    e.stopPropagation();
    let flag = false;
    let model = {};
    let { sendInvoiceList } = this.state;
    for (let i in sendInvoiceList) {
      if (sendInvoiceList[i].rowNo === row.rowNo) {
        flag = true;
        model = {
          yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
          customerNo: this.state.customerNo,
          oldWorkContents: sendInvoiceList[i].oldWorkContents || "",
          employeeNo: sendInvoiceList[i].employeeNo,
        };
        sendInvoiceList.splice(i, 1);
        break;
      }
    }
    this.setState({
      sendInvoiceList,
    });
    if (
      sendInvoiceList.length === 0 ||
      !sendInvoiceList[sendInvoiceList.length - 1].updateFlag
    ) {
      this.setState({
        addDisabledFlag: false,
      });
    }

    if (flag) {
      axios
        .post(this.state.serverIP + "sendInvoice/deleteInvoiceData", model)
        .then((result) => {
          if (result.data) {
            message.success("削除成功！");
            this.searchSendInvoiceList();
          }
        })
        .catch(function (error) {});
    }
  };

  handleUpdateRow = ({ e, cell, row, formatExtraData, rowIdx }) => {
    e.stopPropagation();
    let { sendInvoiceList } = this.state;
    for (let i in sendInvoiceList) {
      if (sendInvoiceList[i].rowNo === row.rowNo) {
        sendInvoiceList[i].updateFlag = !sendInvoiceList[i].updateFlag;
        break;
      }
    }
    this.setState({
      sendInvoiceList,
    });
    if (!sendInvoiceList[sendInvoiceList.length - 1].updateFlag) {
      this.setState({
        addDisabledFlag: false,
      });
    }
  };

  updateAll = async () => {
    try {
      this.setState({ updateLoading: true });
      let haveErr1 = await this.updateInvoiceRowData();
      if (!haveErr1) {
        let haveErr2 = await this.updateInvoiceTextData();
        if (!haveErr1 && !haveErr2) {
          message.success("登録成功！");
          this.setState({ selected: [] });
        }
        this.searchSendInvoiceList();
      }

      this.setState({ updateLoading: false });
    } catch (error) {
      console.log("SERVER ERROR:", error);
      notification.error({
        message: `サーバーエラー`,
        description: error.message,
        placement: "topLeft",
      });
    }
  };

  showErrMsg = ({ title, errorsMessage }) => {
    if (errorsMessage) {
      message.error({
        title,
        content: errorsMessage,
      });
    }
  };

  setErrRowAndShowMsg = (
    type = "error",
    data = { content: "エラー" },
    rowNo
  ) => {
    if (type === "error") {
      message.error({ ...data });
    } else if (type === "info") {
      message.info({ ...data });
    }

    if (rowNo) {
      this.setState({
        selected: [rowNo],
      });
    }
  };

  updateInvoiceRowData = async () => {
    let { sendInvoiceList } = this.state;
    let haveErr = false;
    let list = [];
    for (let index = 0; index < sendInvoiceList.length; index++) {
      const item = sendInvoiceList[index];
      if (!item.workContents) {
        this.setErrRowAndShowMsg(
          "info",
          { content: `システム名を入力してください` },
          item.rowNo
        );
        return true;
      }
      if (!item.employeeNo) {
        this.setErrRowAndShowMsg(
          "info",
          { content: `作業者を選んで下さい` },
          item.rowNo
        );
        return true;
      }
      if (!item.workPeriod) {
        this.setErrRowAndShowMsg(
          "info",
          { content: `作業期間を入力してください` },
          item.rowNo
        );
        return true;
      }

      list.push({
        yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
        customerNo: this.state.customerNo,
        oldWorkContents: item.oldWorkContents || "",
        workContents: item.workContents,
        employeeNo: item.employeeNo,
        workPeriod: item.workPeriod,
        workingTime: item.sumWorkTime,
        requestUnitCode: item.requestUnitCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        rowNo: item.rowNo,
      });
    }

    if (list.length > 0) {
      for (let index = 0; index < list.length; index++) {
        const model = list[index];
        let result = await axios.post(
          this.state.serverIP + "sendInvoice/updateInvoiceData",
          model
        );

        if (result.data?.code !== 0) {
          haveErr = true;
          this.setErrRowAndShowMsg(
            "error",
            {
              title: `修正失敗！`,
              content: result.data?.errorsMessage,
            },
            model.rowNo
          );
        }
      }
    }
    return haveErr;
  };

  updateInvoiceTextData = async () => {
    let model = {
      yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
      customerNo: this.state.customerNo,
      customerName: this.state.customerName,
      invoiceNo: this.state.invoiceNo,
      invoiceDate: publicUtils.formateDate(this.state.invoiceDate, true),
      deadLine: publicUtils.formateDate(this.state.deadLine, true),
      bankCode: this.state.bankAccountInfo,
      remark: this.state.remark,
      employeeNameFlag: this.state.employeeNameFlag,
      systemNameFlag: this.state.systemNameFlag,
      workTimeFlag: this.state.workTimeFlag,
    };
    let result = await axios.post(
      this.state.serverIP + "sendInvoice/updateAllInvoiceData",
      model
    );
    if (!result.data) {
      message.error("登録失敗！");
    }
    return !result.data;
  };

  // onChange
  tableValueChange = (event, cell, row) => {
    let sendInvoiceList = this.state.sendInvoiceList;
    for (let i in sendInvoiceList) {
      if (row.rowNo === sendInvoiceList[i].rowNo) {
        sendInvoiceList[i][event.target.name] = event.target.value;
        break;
      }
    }

    this.setState({
      sendInvoiceList: sendInvoiceList,
    });
  };
  // onChangeAfter
  tableValueChangeAfter = (event, cell, row) => {
    let sendInvoiceList = this.state.sendInvoiceList;
    let subTotalAmount = 0;
    let subTotalAmountNoTax = 0;
    for (let i in sendInvoiceList) {
      if (sendInvoiceList[i].requestUnitCode === "0")
        subTotalAmount +=
          Number(sendInvoiceList[i].unitPrice) * sendInvoiceList[i].quantity +
          Number(sendInvoiceList[i].deductionsAndOvertimePayOfUnitPrice);
      if (sendInvoiceList[i].requestUnitCode === "1")
        subTotalAmountNoTax +=
          Number(sendInvoiceList[i].unitPrice) * sendInvoiceList[i].quantity +
          Number(sendInvoiceList[i].deductionsAndOvertimePayOfUnitPrice);
    }

    this.setState({
      sendInvoiceList: sendInvoiceList,
      subTotalAmount: publicUtils.addComma(
        subTotalAmount + subTotalAmountNoTax
      ),
      subTotalAmountTax: publicUtils.addComma(
        parseInt(subTotalAmount * this.state.taxRate)
      ),
      totalAmount: publicUtils.addComma(
        parseInt(
          subTotalAmount +
            subTotalAmount * this.state.taxRate +
            subTotalAmountNoTax
        )
      ),
    });
  };

  /**
   * 社員名連想
   *
   * @param {}
   *            event
   */
  getBankAccountInfo = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let bankAccountInfo = null;
        if (values !== null) {
          bankAccountInfo = values.code;
        }
        this.setState({
          bankAccountInfo: bankAccountInfo,
        });
      }
    );
  };

  downloadPDF = () => {
    this.setState({ loading: false });
    let model = {
      yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
      customerNo: this.state.customerNo,
      invoiceNo: this.state.invoiceNo,
      taxRate: this.state.taxRate * 100,
      systemNameFlag: this.state.systemNameFlag,
      workTimeFlag: this.state.workTimeFlag,
      employeeNameFlag: this.state.employeeNameFlag,
      customerAbbreviation: this.state.customerAbbreviation,
    };
    axios
      .post(this.state.serverIP + "sendInvoice/downloadPDF", model)
      .then((result) => {
        if (result.data) {
          var a = document.createElement("a");
          a.setAttribute(
            "href",
            this.state.serverIP +
              publicUtils.formateDate(this.state.yearAndMonth, false) +
              "_" +
              this.state.customerNo +
              "_" +
              this.state.customerAbbreviation +
              ".pdf"
          );
          a.setAttribute("target", "_blank");
          document.body.appendChild(a);
          a.click();
          this.setState({ loading: true });
        } else {
          alert("更新失败");
          this.setState({ loading: true });
        }
      })
      .catch(function (error) {});
  };

  render() {
    const { sendInvoiceList } = this.state;
    // テーブルの行の選択
    const selectRow = {
      selected: this.state.selected,
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
    };
    console.log(
      {
        state: this.state,
        propsState: this.props.location.state,
        table: this.refs.table,
      },
      "render"
    );
    // テーブルの定義
    const options = {
      page: this.state.currentPage,
      sizePerPage: 5, // which size per page you want to locate as
      // default
      pageStartIndex: 1, // where to start quantitying the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or
      // function
      hideSizePerPage: true, // > You can hide the dropdown for
      // sizePerPage
      expandRowBgColor: "rgb(165, 165, 165)",
      approvalBtn: this.createCustomApprovalButton,
      onApprovalRow: this.onApprovalRow,
      handleConfirmApprovalRow: this.customConfirm,
    };
    const cellEdit = {
      mode: "click",
      blurToSave: true,
    };
    return (
      <div>
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={this.state.message}
            type={"success"}
          />
        </div>
        <Form>
          <div>
            <Form.Group>
              <Row inline="true">
                <Col className="text-center">
                  <h2>請求書</h2>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="twoKanji">御中</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      value={this.state.customerName}
                      name="customerName"
                      autoComplete="off"
                      size="sm"
                      onChange={this.valueChange}
                    />
                  </InputGroup>
                </Col>
                <Col sm={9}>
                  <div style={{ float: "right" }}>
                    <InputGroup size="sm" className="mb-2">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="fiveKanji">請求日</InputGroup.Text>
                        <AntdDatePicker
                          size="small"
                          allowClear={false}
                          suffixIcon={false}
                          value={
                            this.state.invoiceDate
                              ? moment(this.state.invoiceDate)
                              : ""
                          }
                          onChange={this.inactiveYearAndMonth}
                          format="YYYY/MM/DD"
                          locale="ja"
                          id="datePicker-invoicePDF"
                          className="form-control form-control-sm"
                        />
                      </InputGroup.Prepend>
                    </InputGroup>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">請求金額</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      value={this.state.totalAmount}
                      name="totalAmount"
                      autoComplete="off"
                      size="sm"
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fourKanji">請求番号</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      value={this.state.invoiceNo}
                      name="invoiceNo"
                      autoComplete="off"
                      size="sm"
                      onChange={this.valueChange}
                    />
                  </InputGroup>
                </Col>
                <Col sm={1}></Col>
                <Col sm={5}>
                  <div style={{ float: "right" }}>
                    <InputGroup size="sm" className="mb-2">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="fiveKanji">
                          お支払期限
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <AntdDatePicker
                        size="small"
                        allowClear={false}
                        suffixIcon={false}
                        value={
                          this.state.deadLine ? moment(this.state.deadLine) : ""
                        }
                        onChange={this.inactiveDeadLine}
                        format="YYYY/MM/DD"
                        locale="ja"
                        id="datePicker-invoicePDF"
                        className="form-control form-control-sm"
                      />
                    </InputGroup>
                  </div>
                </Col>
              </Row>
            </Form.Group>
          </div>
        </Form>
        <div>
          <Row>
            <Col sm={12}>
              <Button size="sm" variant="info" onClick={this.back}>
                <FontAwesomeIcon icon={faLevelUpAlt} />
                戻る{" "}
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                onClick={this.systemNameFlagChange}
              >
                {"システム名" +
                  (this.state.systemNameFlag ? "非" : "") +
                  "表示"}
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                onClick={this.workTimeFlagChange}
              >
                {"作業時間" + (this.state.workTimeFlag ? "非" : "") + "表示"}
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                onClick={this.employeeNameFlagChange}
              >
                {"作業者" + (this.state.employeeNameFlag ? "非" : "") + "表示"}
              </Button>{" "}
              <div style={{ float: "right" }}>
                <Button
                  variant="info"
                  size="sm"
                  onClick={this.addRow}
                  disabled={this.state.addDisabledFlag}
                >
                  追加
                </Button>{" "}
                <Button variant="info" size="sm" onClick={this.downloadPDF}>
                  PDF
                </Button>{" "}
              </div>
            </Col>
          </Row>
          <Col>
            {/* <EditableCell /> */}
            <BootstrapTable
              data={sendInvoiceList}
              ref="table"
              selectRow={selectRow}
              pagination={true}
              options={options}
              approvalRow
              headerStyle={{ background: "#5599FF" }}
              striped
              hover
              condensed
            >
              <TableHeaderColumn
                dataField="rowNo"
                isKey
                hidden
              ></TableHeaderColumn>
              <TableHeaderColumn width="5%" dataField="showNo">
                番号
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="18%"
                dataField="employeeName"
                dataFormat={this.employeeNameFormat}
              >
                {
                  <div>
                    <Row>
                      <font>作業内容(作業者)</font>
                    </Row>
                    <Row>
                      <font>作業期間(時間)</font>
                    </Row>
                  </div>
                }
              </TableHeaderColumn>
              <TableHeaderColumn
                width="8%"
                dataField="requestUnitCode"
                dataFormat={this.requestUnitCodeFormat}
              >
                単位
              </TableHeaderColumn>
              <TableHeaderColumn
                width="6%"
                dataField="quantity"
                dataFormat={this.quantityFormat}
              >
                数量
              </TableHeaderColumn>
              <TableHeaderColumn
                width="10%"
                dataField="unitPrice"
                dataFormat={this.unitPriceFormat}
              >
                単価
              </TableHeaderColumn>
              <TableHeaderColumn
                width="10%"
                dataField="lowerLimit"
                dataFormat={this.lowerLimitFormat}
              >
                {
                  <div>
                    <Row>
                      <font>下限時間</font>
                    </Row>
                    <Row>
                      <font>精算単価</font>
                    </Row>
                  </div>
                }
              </TableHeaderColumn>
              <TableHeaderColumn
                width="10%"
                dataField="upperLimit"
                dataFormat={this.upperLimitFormat}
              >
                {
                  <div>
                    <Row>
                      <font>上限時間</font>
                    </Row>
                    <Row>
                      <font>精算単価</font>
                    </Row>
                  </div>
                }
              </TableHeaderColumn>
              <TableHeaderColumn
                width="12%"
                dataField="billingAmount"
                dataFormat={this.billingAmountFormat}
              >
                請求額
              </TableHeaderColumn>
              <TableHeaderColumn width="10%" dataFormat={this.optionsFormat}>
                オプション
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </div>
        <Row>
          <Col sm={4}>
            <InputGroup size="sm" className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text id="fourKanji">銀行情報</InputGroup.Text>
              </InputGroup.Prepend>
              <Autocomplete
                id="bankAccountInfo"
                name="bankAccountInfo"
                value={
                  this.state.bankAccountInfos.find(
                    (v) => v.code === this.state.bankAccountInfo
                  ) || ""
                }
                options={this.state.bankAccountInfos}
                getOptionLabel={(option) => (option.name ? option.name : "")}
                onChange={(event, values) =>
                  this.getBankAccountInfo(event, values)
                }
                renderOption={(option) => {
                  return <React.Fragment>{option.name}</React.Fragment>;
                }}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <input
                      type="text"
                      {...params.inputProps}
                      className="auto form-control Autocompletestyle-dutyManagement"
                    />
                  </div>
                )}
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text id="fourKanji">備考</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                rows="3"
                value={this.state.remark || ""}
                onChange={this.valueChange}
                name="remark"
                as="textarea"
              ></FormControl>
            </InputGroup>
          </Col>
          <Col sm={6}></Col>
          <Col sm={2}>
            <InputGroup size="sm" className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text id="sanKanji">小計</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                value={this.state.subTotalAmount}
                name="subTotalAmount"
                autoComplete="off"
                size="sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text id="sanKanji">消費税率</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                defaultValue={this.state.consumptionTax}
                name="consumptionTax"
                autoComplete="off"
                size="sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text id="sanKanji">消費税</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                defaultValue={this.state.subTotalAmountTax}
                name="subTotalAmountTax"
                autoComplete="off"
                size="sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text id="sanKanji">合計</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                defaultValue={this.state.totalAmount}
                name="totalAmount"
                autoComplete="off"
                size="sm"
                disabled
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <AntdButton
            className="mr10"
            loading={this.state.resetLoading}
            onClick={() => {
              Modal.confirm({
                title: "リセット操作確認",
                content: "リセットしてよろしいでしょうか？",
                onOk: this.deleteAll,
                style: { top: 170 },
              });
            }}
          >
            {"リセット"}
          </AntdButton>

          <AntdButton
            type="primary"
            icon={<FontAwesomeIcon className="mr5" icon={faSave} />}
            onClick={this.updateAll}
            loading={this.state.updateLoading}
          >
            登録
          </AntdButton>
        </div>
        <div
          className="loadingImage"
          hidden={this.state.loading}
          style={{
            position: "absolute",
            top: "60%",
            left: "60%",
            marginLeft: "-200px",
            marginTop: "-150px",
          }}
        ></div>
        <br />
      </div>
    );
  }
}
export default invoicePDF;
