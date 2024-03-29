import React from "react";
import {
  Button,
  Form,
  Col,
  Row,
  InputGroup,
  FormControl,
  Modal,
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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  faEdit,
  faUpload,
  faSearch,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import * as publicUtils from "./utils/publicUtils.js";
import MyToast from "./myToast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import store from "./redux/store";
import SendInvoiceLetter from "./sendInvoiceLetter";
import { faLevelUpAlt } from "@fortawesome/free-solid-svg-icons";
import { Popover, Modal as AntdModal, message, Tag } from "antd";
registerLocale("ja", ja);
axios.defaults.withCredentials = true;

const SIZE_PRE_PAGE = 12;

/**
 * 社員勤務管理画面
 */
class sendInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      this.props.location?.state?.sendInvoiceTempState || this.initialState; // 初期化
    this.searchEmployee = this.searchSendInvoiceList.bind(this);
  }

  getLoginUserInfo = () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        this.setState({
          loginUserInfo: result.data,
          authorityCode: result.data[0].authorityCode,
        });
      })
      .catch(function (error) {
        // alert(error);
      });
  };

  componentDidMount() {
    console.log(
      { propsState: this.props.location.state, state: this.state },
      "componentDidMount"
    );
    this.getLoginUserInfo();

    const { state: locationState } = this.props.location;
    if (locationState) {
      this.setState(
        {
          dutyManagementSelectedEmployeeNo:
            locationState.dutyManagementSelectedEmployeeNo ||
            this.state.dutyManagementSelectedEmployeeNo,
          dutyManagementTempState:
            locationState.dutyManagementTempState ||
            this.state.dutyManagementTempState,
          yearAndMonth: locationState?.yearAndMonth || this.state.yearAndMonth,
        },
        () => {
          this.searchSendInvoiceList();
        }
      );
    } else {
      this.searchSendInvoiceList();
    }
  }
  // 初期化データ
  initialState = {
    dutyManagementSelectedEmployeeNo:
      this.props.location.state?.dutyManagementSelectedEmployeeNo || "",
    yearAndMonth: new Date(), // new Date(new Date().getMonth() === 0 ?
    // (new Date().getFullYear() - 1) + "/12" :
    // new Date().getFullYear() + "/" + new
    // Date().getMonth()).getTime(),
    selected: [],
    month: new Date().getMonth() + 1,
    loginUserInfo: [],
    sendInvoiceList: [],
    rowCustomerNo: "",
    rowCustomerName: "",
    rowPurchasingManagers: "",
    rowEmployeeList: [],
    sendFlag: false,
    loading: true,
    showSendInvoiceLetter: false,
    customerAbbreviationList: store.getState().dropDown[73].slice(1),
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
  };

  // 検索
  searchSendInvoiceList = () => {
    const emp = {
      yearAndMonth: publicUtils.formateDate($("#datePicker").val(), false),
      customerNo: this.state.customerNo,
      customerName: this.state.customerName,
    };

    if (this.state.dutyManagementSelectedEmployeeNo) {
      emp.employeeNo = this.state.dutyManagementSelectedEmployeeNo;
    }
    axios
      .post(this.state.serverIP + "sendInvoice/selectSendInvoice", emp)
      .then((response) => {
        this.setState(
          {
            sendInvoiceList: response.data,
          },
          () => {
            let { selected } = this.state;
            let rowNo;
            // 当前employeeNo对应response.data中的下标
            response.data.forEach((item) => {
              if (item.employeeNo === selected?.[0]) rowNo = item.rowNo;
            });

            if (!rowNo || rowNo > response.data.length) {
              this.setState({
                selected: [],
                currentPage: 1,
              });
            } else {
              this.setState({
                currentPage: Math.ceil(rowNo / SIZE_PRE_PAGE),
                sendFlag: response.data.havePDF === "false",
              });
            }
          }
        );
      })
      .catch(function (error) {
        // alert(error);
      });
  };

  // 年月
  inactiveYearAndMonth = (date) => {
    this.setState({
      yearAndMonth: date,
      month: date.getMonth() + 1,
      selected: [],
    });
    $("#datePicker").val(date);
    this.searchSendInvoiceList();
  };

  // 行Selectファンクション
  handleRowSelect = async (row, isSelected, e) => {
    if (isSelected) {
      this.setState(
        {
          selected: [row.employeeNo],
          rowCustomerNo: row.customerNo,
          rowCustomerName: row.customerName,
          rowPurchasingManagers: row.purchasingManagers,
          rowEmployeeList: row.sendInvoiceWorkTimeModel,
          rowPurchasingManagersMail: row.purchasingManagersMail,
          sendFlag: row.havePDF === "false",
          reportRowNo: row.rowNo,
        },
        async () => {
          let { mailCC, customerNo } = await this.getSalesPersonsCC();
          if (mailCC.length > 0) {
            const { sendInvoiceList } = this.state;
            for (let i in sendInvoiceList) {
              if (sendInvoiceList[i].customerNo === customerNo) {
                sendInvoiceList[i].mailCC = mailCC;
                break;
              }
            }

            this.setState({
              sendInvoiceList,
            });
          }
        }
      );
    } else {
      this.setState({
        selected: [],
        rowCustomerNo: "",
        rowCustomerName: "",
        rowPurchasingManagers: "",
        rowEmployeeList: [],
        rowPurchasingManagersMail: "",
        sendFlag: true,
      });
    }
  };

  shuseiTo = (actionType) => {
    var path = {};
    const sendValue = {};
    switch (actionType) {
      case "dutyManagement":
        path = {
          pathname: "/subMenuManager/dutyManagement",
          state: {
            yearAndMonth: this.state.yearAndMonth,
            backPage: "sendInvoice",
            sendValue: sendValue,
            dutyManagementTempState: this.state.dutyManagementTempState,
          },
        };
        break;
      case "customer":
        path = {
          pathname: "/subMenuManager/customerInfo",
          state: {
            actionType: "update",
            customerNo: this.state.rowCustomerNo,
            backPage: "sendInvoice",
            sendValue: sendValue,
            employeeNo: this.state.selected.length
              ? this.state.selected[0]
              : "",
            yearAndMonth: this.state.yearAndMonth,
            sendInvoiceTempState: this.state,
          },
        };
        break;
      case "invoicePDF":
        path = {
          pathname: "/subMenuManager/invoicePDF",
          state: {
            backPage: "sendInvoice",
            yearAndMonth: this.state.yearAndMonth,
            customerNo: this.state.rowCustomerNo,
            sendValue: sendValue,
            employeeNo: this.state.selected.length
              ? this.state.selected[0]
              : "",
            dutyManagementSelectedEmployeeNo:
              this.state.dutyManagementSelectedEmployeeNo,
            sendInvoiceTempState: this.state,
          },
        };
        break;
      default:
    }
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

  /**
   * 社員名連想
   *
   * @param {}
   *            event
   */
  getCustomer = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let customerNo = null;
        if (values !== null) {
          customerNo = values.code;
        }
        this.setState(
          {
            customerNo: customerNo,
            customerAbbreviation: customerNo,
          },
          () => {
            this.searchSendInvoiceList();
          }
        );
      }
    );
  };

  payOffRangeFormat = (cell, row) => {
    let payOffRange = "";
    if (row.payOffRange1 == 0 || row.payOffRange1 == 1)
      payOffRange = row.payOffRange1 == 0 ? "固定" : "出勤日";
    else payOffRange = row.payOffRange1 + "-" + row.payOffRange2;
    return payOffRange;
  };

  unitPriceFormat = (cell, row) => {
    if (row.unitPrice === null || row.unitPrice === "" || row.unitPrice === "0")
      return "";
    else return "￥" + publicUtils.addComma(row.unitPrice);
  };

  costFormat = (cell, row) => {
    if (
      row.deductionsAndOvertimePayOfUnitPrice === null ||
      row.deductionsAndOvertimePayOfUnitPrice === "" ||
      row.deductionsAndOvertimePayOfUnitPrice === "0"
    )
      return "";
    else
      return (
        "￥" + publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice)
      );
  };

  reportFormat = (cell, row) => {
    if (
      row.workingTimeReport === undefined ||
      row.workingTimeReport === null ||
      row.workingTimeReport === ""
    ) {
      return "";
    }
    return (
      <div>
        <font
          onClick={(event) => {
            this.setReport(row);
          }}
        >
          あり
        </font>
        <input
          type="checkbox"
          onChange={(event) => {
            this.setReport(row);
          }}
          checked={cell ? true : false}
        />
      </div>
    );
  };

  setReport = (row) => {
    const { sendInvoiceList } = this.state;
    const { sendInvoiceWorkTimeModel } =
      sendInvoiceList[this.state.reportRowNo - 1];
    sendInvoiceWorkTimeModel[row.rowNo - 1].report =
      !sendInvoiceWorkTimeModel[row.rowNo - 1].report;
    this.setState({
      sendInvoiceList,
    });
    this.reportDownload(
      sendInvoiceWorkTimeModel[row.rowNo - 1].workingTimeReport,
      sendInvoiceWorkTimeModel[row.rowNo - 1].employeeName
    );
  };

  getNowDate = () => {
    return (
      String(new Date().getFullYear()) +
      "/" +
      (new Date().getMonth() + 1 < 10
        ? "0" + String(new Date().getMonth() + 1)
        : String(new Date().getMonth() + 1)) +
      "/" +
      (new Date().getDate() < 10
        ? "0" + String(new Date().getDate())
        : String(new Date().getDate())) +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
    );
  };

  getMailContent = () => {
    let flag = true;
    let sendInvoiceList = this.state.sendInvoiceList;
    let employeeList = this.state.rowEmployeeList;
    let employee = "";
    for (let i in employeeList) {
      employee += employeeList[i].employeeName + "、";
    }
    if (employee.length > 0)
      employee = employee.substring(0, employee.length - 1);
    let mailConfirmContont;
    let reportFlag = false;

    for (let i in sendInvoiceList) {
      if (sendInvoiceList[i].customerName === this.state.rowCustomerName) {
        if (
          !(
            sendInvoiceList[i].mailConfirmContont === undefined ||
            sendInvoiceList[i].mailConfirmContont === null ||
            sendInvoiceList[i].mailConfirmContont === ""
          )
        ) {
          flag = false;
          mailConfirmContont = sendInvoiceList[i].mailConfirmContont;
        }
        for (let j in this.state.sendInvoiceList[i].sendInvoiceWorkTimeModel) {
          if (
            this.state.selectAllFlag ||
            this.state.sendInvoiceList[i].sendInvoiceWorkTimeModel[j].report
          ) {
            reportFlag = true;
          }
        }
      }
    }
    if (flag) {
      mailConfirmContont =
        (this.state.rowCustomerName.search("会社") === -1
          ? this.state.rowCustomerName + `株式会社`
          : this.state.rowCustomerName) +
        `
` +
        (this.state.rowPurchasingManagers === ""
          ? ""
          : (this.state.rowPurchasingManagers.search(" ") !== -1 ||
            this.state.rowPurchasingManagers.search("　") !== -1
              ? this.state.rowPurchasingManagers.search(" ") !== -1
                ? this.state.rowPurchasingManagers.split(" ")[0]
                : this.state.rowPurchasingManagers.split("　")[0]
              : this.state.rowPurchasingManagers) + `様`) +
        `

いつもお世話になっております。ＬＹＣの` +
        this.state.loginUserInfo[0].employeeFristName +
        `でございます。

弊社` +
        employee +
        (this.state.yearAndMonth.getMonth() + 1) +
        `月分請求書類` +
        (reportFlag ? `、作業報告書` : "") +
        `を添付にてご送付致します。

お手数ですが、ご確認お願い致します。

引き続き何卒よろしくお願い申し上げます。
----------------------------------------
LYC株式会社　
事務担当　宋（ソウ）/莫（バク）
〒101-0032　東京都千代田区岩本町3-3-3　サザンビル3階
URL:http://www.lyc.co.jp/　TEL:03-6908-5796 
事務共通:jimu@lyc.co.jp
P-mark:第21004525(02)号
労働者派遣事業許可番号　派13-306371
`;
    }
    return mailConfirmContont;
  };

  getMailTitle = () => {
    return (
      "請求書_" +
      this.state.yearAndMonth.getFullYear() +
      "年" +
      (this.state.yearAndMonth.getMonth() + 1) +
      "月分_" +
      "LYC 株式会社"

      // (this.state.rowCustomerName.search("会社") === -1
      //   ? this.state.rowCustomerName + `株式会社`
      //   : this.state.rowCustomerName)
    );
  };

  checkMail = () => {
    let mailConfirmContont = this.getMailContent();
    this.setState(
      {
        mailConfirmContont,
      },
      () => {
        this.handleShowModal();
      }
    );
  };

  sendLetter = () => {
    AntdModal.confirm({
      title: "送信してよろしいでしょうか？",
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        let model = {};
        let sendInvoiceList = this.state.sendInvoiceList;
        for (let i in sendInvoiceList) {
          if (sendInvoiceList[i].customerNo === this.state.rowCustomerNo) {
            let reportFile = "";
            for (let j in this.state.sendInvoiceList[i]
              .sendInvoiceWorkTimeModel) {
              if (
                this.state.selectAllFlag ||
                this.state.sendInvoiceList[i].sendInvoiceWorkTimeModel[j].report
              ) {
                reportFile +=
                  this.state.sendInvoiceList[i].sendInvoiceWorkTimeModel[j]
                    .workingTimeReport + ";;";
              }
            }

            let selectedMailCC = sendInvoiceList[i]?.mailCC?.join(",");
            if (selectedMailCC) {
              model = { ...model, selectedMailCC };
            }

            model = {
              yearAndMonth: publicUtils.formateDate(
                $("#datePicker").val(),
                false
              ),
              // mailCC:this.state.mailCC
              customerAbbreviation: sendInvoiceList[i].customerAbbreviation,
              mail: sendInvoiceList[i].purchasingManagersMail,
              purchasingManagers: sendInvoiceList[i].purchasingManagers,
              customerNo: sendInvoiceList[i].customerNo,
              customerName: sendInvoiceList[i].customerName,
              mailFrom: this.state.loginUserInfo[0].companyMail,
              reportFile: reportFile,
              mailConfirmContont: this.getMailContent(),
              mailTitle: this.getMailTitle(),
              nowDate: this.getNowDate(),
            };
          }
        }

        axios
          .post(this.state.serverIP + "sendInvoice/sendLetter", model)
          .then(({ data }) => {
            if (data.result) {
              message.success("送信成功しました");
            } else {
              message.error(data.errMsg);
            }
            this.searchSendInvoiceList();
          });
      },
      centered: true,
      className: this.state.isMobileDevice ? "confirmModalBtnCenterClass" : "",
    });
  };

  reportDownload = (report, employeeName) => {
    if (report === undefined || report === null || report === "") {
      let dataInfo = {};
      dataInfo["yearMonth"] =
        String(this.state.yearAndMonth.getFullYear()) +
        (this.state.yearAndMonth.getMonth() + 1 < 10
          ? "0" + String(this.state.yearAndMonth.getMonth() + 1)
          : String(this.state.yearAndMonth.getMonth() + 1));
      dataInfo["employeeName"] = employeeName;
      dataInfo.customerNo = this.state.customerNo;
      axios
        .post(this.state.serverIP + "dutyRegistration/downloadPDF", dataInfo)
        .then((resultMap) => {})
        .catch(function () {
          alert("送信错误，请检查程序");
        });
    } else {
      let fileKey = "";
      let downLoadPath = "";
      if (report !== null) {
        let path = report.replace(/\\/g, "/");
        if (path.split("file/").length > 1) {
          fileKey = path.split("file/")[1];
          downLoadPath = path.replaceAll("/", "//");
        }
      }
      axios
        .post(this.state.serverIP + "s3Controller/downloadFile", {
          fileKey: fileKey,
          downLoadPath: downLoadPath,
        })
        .then((result) => {
          //let path = downLoadPath.replaceAll("//","/");
          //publicUtils.handleDownload(path, this.state.serverIP);
        })
        .catch(function (error) {
          alert("ファイルが存在しません。");
        });
    }
  };

  sendLetterDateFormat = (cell) => {
    /*if(cell === null || cell === undefined || cell.length < 8){
    		return "";
    	}else{
    		return cell.substring(0,4) + "/" + cell.substring(4,6) + "/" + cell.substring(6,8)
    	}*/
    if (cell !== null) return cell;
    else return "";
  };

  sendLetterStatusFormat = (cell, row) => {
    if (cell === "1") {
      return "送信済み";
    } else {
      if (row.havePDF === "true") {
        return "未送信";
      } else {
        return "送信不可";
      }
    }
  };

  selectAll = (flag) => {
    const { sendInvoiceList, reportRowNo } = this.state;
    let sendInvoiceWorkTimeModel =
      sendInvoiceList[reportRowNo - 1].sendInvoiceWorkTimeModel;
    for (let i in sendInvoiceWorkTimeModel) {
      if (flag) {
        this.reportDownload(
          sendInvoiceWorkTimeModel[i].workingTimeReport,
          sendInvoiceWorkTimeModel[i].employeeName
        );
      }
      sendInvoiceWorkTimeModel[i].report = flag;
    }

    this.setState({
      selectAllFlag: flag,
      sendInvoiceList: sendInvoiceList,
    });
  };

  customerNameFormat = (cell, row) => {
    return `${cell}(${row.customerNo})`;
  };
  employeeNameFormat = (cell, row) => {
    let text = cell;

    if (row.employeeNo?.startsWith("BP")) {
      text += row.bpBelongCustomerAbbreviation
        ? `(${row.bpBelongCustomerAbbreviation})`
        : "(BP)";
    }
    return text;
  };

  employeeListFormat = (cell, row) => {
    let returnItem = cell;
    const options = {
      noDataText: (
        <i className="" style={{ fontSize: "20px" }}>
          データなし
        </i>
      ),
      expandRowBgColor: "rgb(165, 165, 165)",
      hideSizePerPage: true, // > You can hide the dropdown for
      // sizePerPage
    };
    const selectRow1 = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
    };
    returnItem = (
      <Popover
        overlayClassName={"w50p"}
        placement="leftBottom"
        content={
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Row>
              <Col style={{ padding: "0px", marginTop: "10px" }}>
                <h2>要員確認</h2>
              </Col>
            </Row>
            <Row>
              <Col style={{ padding: "0px" }}>
                <div style={{ float: "right" }}>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={this.selectAll.bind(this, true)}
                  >
                    すべて選択
                  </Button>{" "}
                  <Button
                    variant="info"
                    size="sm"
                    onClick={this.selectAll.bind(this, false)}
                  >
                    取消
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <BootstrapTable
                pagination={false}
                options={options}
                data={row.sendInvoiceWorkTimeModel}
                // selectRow={selectRow1}
                headerStyle={{ background: "#5599FF" }}
                striped
                hover
                condensed
              >
                <TableHeaderColumn
                  isKey={true}
                  width="10%"
                  dataField="rowNo"
                  tdStyle={{ padding: ".45em" }}
                >
                  番号
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="employeeName"
                  width="18%"
                  tdStyle={{ padding: ".45em" }}
                >
                  氏名
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="payOffRange"
                  width="14%"
                  dataFormat={this.payOffRangeFormat}
                  tdStyle={{ padding: ".45em" }}
                >
                  基準時間
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="sumWorkTime"
                  width="14%"
                  tdStyle={{ padding: ".45em" }}
                >
                  稼働時間
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="unitPrice"
                  dataFormat={this.unitPriceFormat}
                  width="16%"
                  tdStyle={{ padding: ".45em" }}
                >
                  単価
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="cost"
                  dataFormat={this.costFormat}
                  width="16%"
                  tdStyle={{ padding: ".45em" }}
                >
                  残業・控除
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="report"
                  dataFormat={this.reportFormat}
                  width="12%"
                  tdStyle={{ padding: ".45em" }}
                >
                  報告書
                </TableHeaderColumn>
              </BootstrapTable>
            </Row>
          </div>
        }
        title=""
        trigger="click"
      >
        <Button id="popoverEmployeeBtn" variant="warning" size="sm">
          要員
        </Button>
      </Popover>
    );

    if (row.sendInvoiceWorkTimeModel.length > 0) return <div>{returnItem}</div>;
    else return "";
  };

  /**
   * 小さい画面の閉め
   */
  handleHideModal = (Kbn) => {
    this.setState({ showSendInvoiceLetter: false });
  };
  /**
   *  小さい画面の開き
   */
  handleShowModal = async (Kbn) => {
    this.setState({ showSendInvoiceLetter: true });
  };

  getSalesPersonsCC = async () => {
    try {
      const { rowCustomerNo, rowPurchasingManagersMail } = this.state;
      let res = await axios.post(
        this.state.serverIP + "salesSendLetters/getSalesPersonsCC",
        {
          customerNo: rowCustomerNo,
        }
      );
      if (res.data.length > 0) {
        let mailCC = res.data.filter(
          (item) => item.customerDepartmentCode === "7"
        );
        mailCC = mailCC
          ?.map((item) => item.customerDepartmentMail)
          .filter((value) => value !== rowPurchasingManagersMail);
        return { mailCC, customerNo: rowCustomerNo };
      }
      return { mailCC: [], customerNo: rowCustomerNo };
    } catch (error) {
      console.log(error);
    }
  };

  setNewMail = (mailConfirmContont) => {
    let sendInvoiceList = this.state.sendInvoiceList;
    for (let i in sendInvoiceList) {
      if (sendInvoiceList[i].customerName === this.state.rowCustomerName) {
        sendInvoiceList[i].mailConfirmContont = mailConfirmContont;
      }
    }
    this.setState({
      showSendInvoiceLetter: false,
      sendInvoiceList: sendInvoiceList,
    });
  };

  render() {
    const { sendInvoiceList, customerAbbreviationList } = this.state;
    console.log(
      {
        state: this.state,
        propsState: this.props.location.state,
        table: this.refs.table,
      },
      "render"
    );
    // テーブルの行の選択
    const selectRow2 = {
      mode: "radio",
      bgColor: "pink",
      clickToSelectAndEditCell: true,
      hideSelectColumn: true,
      clickToSelect: true, // click to select, default is false
      clickToExpand: true, // click to expand row, default is false
      onSelect: this.handleRowSelect,
      selected: this.state.selected,
    };
    // テーブルの定義
    const options = {
      onPageChange: (page) => {
        this.setState({ currentPage: page });
      },
      page: this.state.currentPage,
      sizePerPage: SIZE_PRE_PAGE, // which size per page you want to locate as
      // default
      pageStartIndex: 1, // where to start counting the pages
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
    let filteredCustomerAbbreviationList = [];
    if (sendInvoiceList?.length > 0) {
      let customerNoList = sendInvoiceList.map((item) => item.customerNo);
      filteredCustomerAbbreviationList = customerAbbreviationList.filter(
        (item) => customerNoList.includes(item.code)
      );
    }

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
            <Modal
              aria-labelledby="contained-modal-title-vcenter"
              centered
              backdrop="static"
              dialogClassName="modal-projectContent"
              onHide={this.handleHideModal.bind(this)}
              show={this.state.showSendInvoiceLetter}
            >
              <Modal.Header closeButton>
                <Col className="text-center">
                  <h2>メール確認</h2>
                </Col>
              </Modal.Header>
              <Modal.Body>
                <SendInvoiceLetter
                  returnMail={this}
                  mailConfirmContont={this.state.mailConfirmContont}
                  mailTO={this.state.rowPurchasingManagersMail}
                  mailCC={this.state.sendInvoiceList[
                    this.state.reportRowNo - 1
                  ]?.mailCC?.join(",")}
                  mailTitle={this.getMailTitle()}
                  customerNo={this.state.rowCustomerNo}
                />
              </Modal.Body>
            </Modal>
            <Form.Group>
              <Row inline="true">
                <Col className="text-center">
                  <h2>請求書一覧</h2>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Row>
                <Col sm={2}>
                  <InputGroup size="sm" className="mb-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        年月
                      </InputGroup.Text>
                      <DatePicker
                        selected={this.state.yearAndMonth}
                        onChange={this.inactiveYearAndMonth}
                        autoComplete="off"
                        locale="ja"
                        dateFormat="yyyy/MM"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        maxDate={new Date()}
                        id="datePicker"
                        className="form-control form-control-sm w100p"
                      />
                    </InputGroup.Prepend>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ width: "auto" }} id="sanKanji">
                        お客様
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      id="customerAbbreviation"
                      name="customerAbbreviation"
                      value={
                        filteredCustomerAbbreviationList.find(
                          (v) => v.code === this.state.customerAbbreviation
                        ) || ""
                      }
                      options={filteredCustomerAbbreviationList}
                      getOptionLabel={(option) =>
                        option.text ? option.text : ""
                      }
                      onChange={(event, values) =>
                        this.getCustomer(event, values)
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
                            className="auto form-control Autocompletestyle-dutyManagement"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
          </div>
        </Form>
        <div>
          <Row>
            <Col sm={12}>
              {/* <Button
                size="sm"
                variant="info"
                onClick={this.shuseiTo.bind(this, "dutyManagement")}
              >
                勤務管理
              </Button>{" "} */}
              <Button
                size="sm"
                name="clickButton"
                variant="info"
                onClick={this.shuseiTo.bind(this, "customer")}
                disabled={this.state.rowCustomerNo === ""}
              >
                お客様情報
              </Button>{" "}
              <Button
                size="sm"
                variant="info"
                onClick={this.shuseiTo.bind(this, "dutyManagement")}
              >
                <FontAwesomeIcon icon={faLevelUpAlt} />
                戻る
              </Button>{" "}
              <div style={{ float: "right" }}>
                <Button
                  variant="info"
                  size="sm"
                  onClick={this.shuseiTo.bind(this, "invoicePDF")}
                  disabled={this.state.rowCustomerNo === ""}
                >
                  請求書確認
                </Button>{" "}
                <Button
                  variant="info"
                  size="sm"
                  onClick={this.checkMail}
                  disabled={this.state.rowCustomerNo === ""}
                >
                  メール確認
                </Button>{" "}
                <Button
                  variant="info"
                  size="sm"
                  onClick={this.sendLetter}
                  title={"PDFの請求書を確認出来たら送信ボタンが押せます。"}
                  disabled={
                    this.state.sendFlag ||
                    this.state.rowCustomerNo === "" ||
                    Number(
                      String(this.state.yearAndMonth.getFullYear()) +
                        (this.state.yearAndMonth.getMonth() + 1)
                    ) <
                      Number(
                        String(new Date().getFullYear()) + new Date().getMonth()
                      )
                  }
                >
                  送信
                </Button>{" "}
              </div>
            </Col>
          </Row>
          <Col>
            <BootstrapTable
              data={sendInvoiceList}
              selectRow={selectRow2}
              pagination={true}
              options={options}
              approvalRow
              headerStyle={{ background: "#5599FF" }}
              striped
              hover
              condensed
            >
              <TableHeaderColumn
                width="60"
                tdStyle={{ padding: ".45em" }}
                dataField="rowNo"
              >
                番号
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="10%"
                tdStyle={{ padding: ".45em" }}
                dataField="employeeName"
                dataFormat={this.employeeNameFormat.bind(this)}
              >
                社員氏名
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="10%"
                isKey
                hidden={true}
                tdStyle={{ padding: ".45em" }}
                dataField="employeeNo"
              >
                社員番号
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="24%"
                tdStyle={{ padding: ".45em" }}
                dataField="customerName"
                dataFormat={this.customerNameFormat.bind(this)}
              >
                お客様
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="10%"
                tdStyle={{ padding: ".45em" }}
                dataField="purchasingManagers"
              >
                担当者
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="22%"
                tdStyle={{ padding: ".45em" }}
                dataField="purchasingManagersMail"
              >
                メール
              </TableHeaderColumn>
              <TableHeaderColumn
                width="100"
                tdStyle={{ padding: ".45em" }}
                dataField="employeeList"
                dataFormat={this.employeeListFormat.bind(this)}
              >
                関連要員
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="18%"
                tdStyle={{ padding: ".45em" }}
                dataField="sendLetterDate"
                dataFormat={this.sendLetterDateFormat.bind(this)}
              >
                送信日付
              </TableHeaderColumn>
              <TableHeaderColumn
                // width="12%"
                width="140"
                dataAlign="center"
                tdStyle={{ padding: ".45em" }}
                dataField="sendLetterStatus"
                dataFormat={this.sendLetterStatusFormat.bind(this)}
              >
                送信ステータス
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </div>
        <div className="loadingImageContainer">
          <div className="loadingImage" hidden={this.state.loading}></div>
        </div>
      </div>
    );
  }
}
export default sendInvoice;
