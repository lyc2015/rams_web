import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import {
  Row,
  Form,
  Col,
  InputGroup,
  Button,
  FormControl,
} from "react-bootstrap";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import axios from "axios";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import store from "./redux/store";
import * as utils from "./utils/publicUtils.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as publicUtils from "./utils/publicUtils.js";
import moment from "moment";
import { message } from "antd";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
axios.defaults.withCredentials = true;

registerLocale("ja", ja);
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const defaultData = {
  startDate: moment().date(1).toDate(),
  endDate: moment().add(1, "month").date(1).toDate(),
};

// 営業個別売上
class salesProfit extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.onchange = this.onchange.bind(this);
    this.getAdmissionDate = this.getAdmissionDate.bind(this);
    this.getSalesInfo = this.getSalesInfo.bind(this);
  }

  initialState = {
    admissionStartDate: defaultData.startDate,
    admissionEndDate: defaultData.endDate,
    no: "",
    employee: "",
    employeeNo: "",
    newMember: "",
    customerNo: null, // 選択した列のお客様番号
    customerContract: "",
    siteRoleNameAll: "",
    bpSiteRoleNameAll: "",
    profitAll: "",
    updateFlag: true,
    insertFlag: false,
    currentPage: 1, // 今のページ
    insertNo: "",
    salesPointData: [],
    authorityCode: "",
    occupationCode: "",
    employeeStatus: store.getState().dropDown[4].slice(1),
    employeeStatusS: store.getState().dropDown[4].slice(1),
    newMemberStatus: store.getState().dropDown[23].slice(1),
    customerContractStatus: store.getState().dropDown[24].slice(1),
    levelStatus: store.getState().dropDown[18].slice(1),
    salesPutternStatus: store.getState().dropDown[25].slice(1),
    specialPointStatus: store.getState().dropDown[26].slice(1),
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1], // 劉林涛
    // テスト
    customerDrop: store.getState().dropDown[56].slice(1),
  };

  // 页面加载
  componentDidMount() {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        if (result.data[0].occupationCode === "5") {
          let customerDrop = this.state.customerDrop;
          let newCustomerDrop = [];
          let customerNo = "";
          for (let i in customerDrop) {
            if (
              customerDrop[i].name ===
              result.data[0].employeeFristName + result.data[0].employeeLastName
            ) {
              newCustomerDrop.push(customerDrop[i]);
              customerNo = customerDrop[i].code;
            }
          }
          this.setState({
            customerDrop: newCustomerDrop,
            customerNo: customerNo,
          });
        }
        this.setState({
          authorityCode: result.data[0].authorityCode,
          occupationCode: result.data[0].occupationCode,
          loginEmpNo: result.data[0].employeeNo,
        });
      })
      .catch(function (error) {
        // alert(error);
      });
    if (this.props.location.state !== undefined) {
      var sendValue = this.props.location.state.sendValue;
      this.setState(
        {
          customerNo: sendValue.customerNo,
          employeeSearch: sendValue.employeeSearch,
          admissionStartDate: sendValue.admissionStartDate,
          admissionEndDate: sendValue.admissionEndDate,
        },
        () => {
          this.select();
        }
      );
      return;
    }
    this.select();
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
          },
          () => {
            this.select();
          }
        );
      }
    );
  };

  // 明细查询
  onchange = (event) => {
    this.refs.table.setState({
      selectedRowKeys: [],
    });
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        this.select();
      }
    );
  };

  // 时间入力框初始值
  state = {
    admissionStartDate: new Date(),
    admissionEndDate: new Date(),
    no: 0,
    siteRoleNameAll: 0,
    bpSiteRoleNameAll: 0,
    profitAll: 0,
  };
  // 入場年月
  admissionStartDate = (date) => {
    this.setState(
      {
        admissionStartDate: date,
      },
      () => {
        // this.getAdmissionDate("start", date);
        this.getSalesInfo();
      }
    );
  };
  // 退場年月
  admissionEndDate = (date) => {
    this.setState(
      {
        admissionEndDate: date,
      },
      () => {
        // this.getAdmissionDate("end", date);
        this.getSalesInfo();
      }
    );
  };

  // 年月を取得する
  getAdmissionDate = (str, date) => {
    switch (str) {
      case "start":
        if (typeof this.state.admissionEndDate !== "undefined") {
          this.getSalesInfo(date, this.state.admissionEndDate);
        }
        break;
      case "end":
        if (typeof this.state.admissionStartDate !== "undefined") {
          this.getSalesInfo(this.state.admissionStartDate, date);
        }
        break;
      default:
        break;
    }
  };

  // 現場情報を取得する
  getSalesInfo = () => {
    if (this.state.admissionEndDate < this.state.admissionStartDate) {
      message.error("開始年月は終了年月より小さい!");
      return;
    }
    var salesPointSetModel = {
      employeeName: this.state.customerNo,
      employeeStatus: this.state.employeeSearch,
      startDate: this.state.admissionStartDate,
      endDate: this.state.admissionEndDate,
      startTime: publicUtils.formateDate(this.state.admissionStartDate, false),
      endTime: publicUtils.formateDate(this.state.admissionEndDate, false),
    };

    axios
      .post(this.state.serverIP + "getSalesInfo", salesPointSetModel)
      .then((response) => {
        if (response.data != null) {
          if (response.data[0] != null) {
            let salesPointData = response.data;
            let siteRoleNameAll = 0;
            for (let i in salesPointData) {
              if (
                salesPointData[i].employeeNo.search("BP") === -1 &&
                this.state.authorityCode !== "4"
              ) {
                if (salesPointData[i].employeeNo.search("SP") !== -1) {
                  if (this.state.loginEmpNo === salesPointData[i].introducer) {
                    siteRoleNameAll += Number(
                      utils.deleteComma(salesPointData[i].siteRoleName)
                    );
                  } else {
                    salesPointData[i].siteRoleName = "";
                  }
                } else {
                  salesPointData[i].siteRoleName = "";
                }
              } else {
                siteRoleNameAll += Number(
                  utils.deleteComma(salesPointData[i].siteRoleName)
                );
              }
              if (
                salesPointData[i].employeeNo.search("BP") === -1 &&
                salesPointData[i].employeeNo.search("SP") === -1 &&
                (this.state.occupationCode === "1" ||
                  this.state.occupationCode === "5")
              ) {
                salesPointData[i].salary = "";
              }
            }
            this.setState({
              salesPointData: salesPointData,
              no: response.data.length,
              siteRoleNameAll: utils.addComma(siteRoleNameAll),
              bpSiteRoleNameAll: response.data[0].bpSiteRoleNameAll,
              profitAll: response.data[0].profitAll,
            });
          } else {
            this.setState({
              salesPointData: response.data,
              no: "",
              siteRoleNameAll: "",
              bpSiteRoleNameAll: "",
              profitAll: "",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };

  remarkFormat = (cell) => {
    return <span title={cell}>{cell}</span>;
  };

  // 页面跳转
  shuseiTo(actionType) {
    var path = {};
    var startTime = null;
    var endTime = null;
    if (
      this.state.admissionStartDate != null &&
      this.state.admissionEndDate != null
    ) {
      startTime = this.state.admissionStartDate;
      endTime = this.state.admissionEndDate;
    }
    const sendValue = {
      customerNo: this.state.customerNo,
      employeeSearch: this.state.employeeSearch,
      admissionStartDate: this.state.admissionStartDate,
      admissionEndDate: this.state.admissionEndDate,
    };
    switch (actionType) {
      case "wagesInfo":
        path = {
          pathname: "/subMenuManager/wagesInfo",
          state: {
            employeeNo: this.state.employeeNo,
            backPage: "salesProfit",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "siteInfo":
        path = {
          pathname: "/subMenuManager/siteInfo",
          state: {
            employeeNo: this.state.employeeNo,
            backPage: "salesProfit",
            sendValue: sendValue,
            searchFlag: this.state.searchFlag,
          },
        };
        break;
      case "salesPoint":
        path = {
          pathname: "/subMenuManager/salesPoint",
          state: {
            customerNo: this.state.customerNo,
            startTime: startTime,
            endTime: endTime,
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  }

  select = () => {
    var salesPointSetModel = {};
    salesPointSetModel["employeeName"] = this.state.customerNo;
    salesPointSetModel["employeeStatus"] = this.state.employeeSearch;

    salesPointSetModel["startDate"] =
      this.state.admissionStartDate || defaultData.startDate;
    salesPointSetModel["endDate"] =
      this.state.admissionEndDate || defaultData.endDate;
    salesPointSetModel["startTime"] = publicUtils.formateDate(
      this.state.admissionStartDate || defaultData.startDate,
      false
    );
    salesPointSetModel["endTime"] = publicUtils.formateDate(
      this.state.admissionEndDate || defaultData.endDate,
      false
    );
    axios
      .post(this.state.serverIP + "getSalesInfo", salesPointSetModel)
      .then((response) => {
        if (response.data != null) {
          if (response.data[0] != null) {
            this.setState({
              salesPointData: response.data,
              no: response.data.length,
              siteRoleNameAll: response.data[0].siteRoleNameAll,
              bpSiteRoleNameAll: response.data[0].bpSiteRoleNameAll,
              profitAll: response.data[0].profitAll,
            });
          } else {
            this.setState({
              salesPointData: response.data,
              no: "",
              siteRoleNameAll: "",
              bpSiteRoleNameAll: "",
              profitAll: "",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };
  /**
   * 行Selectファンクション
   */
  handleRowSelect = (row, isSelected) => {
    if (isSelected) {
      this.setState({
        // no: row.no,
        employeeNo: row.employeeNo,
        updateFlag: false,
      });
    } else {
      this.setState({
        employeeNo: "",
        updateFlag: true,
      });
    }
  };

  renderShowsTotal = () => {
    return (
      <p
        hidden={!this.state.salesPointData.length > 0}
        style={{ color: "dark", float: "left" }}
      >
        入場人数：{this.state.no}
      </p>
    );
  };

  eiGyoFormat = (cell, row, enumObject, index) => {
    return (
      (row.salesEmployeeName || "") +
      (row.salesOccupationCode === "5" ? "(BP営業)" : "")
    );
  };

  employeeNameFormat = (cell, row, enumObject, index) => {
    let employeeName = row.employeeName;
    if (row.employeeNo.search("BP") !== -1) {
      employeeName += "(" + row.employeeFrom + ")";
    }
    // let employeeStatusName = utils.findItemByKey(
    //   this.state.employeeStatusS,
    //   "code",
    //   row.employeeStatus
    // )?.name;
    return <div title={employeeName}>{employeeName}</div>;
  };

  siteRoleNameFormat = (cell, row, enumObject, index) => {
    let renderMark = row.bpSiteRoleName > 0 ? "(+)" : "";

    if (Number(utils.deleteComma(row.siteRoleName)) < 0) {
      return <font color="red">{row.siteRoleName + "  " + renderMark}</font>;
    }
    return (
      <>
        {row.siteRoleName + "  "}
        <font color="red">{renderMark}</font>
      </>
    );
  };

  profitFormat = (cell, row, enumObject, index) => {
    let profitFormat = row.profit + "(" + row.month + ")";
    return profitFormat;
  };

  grayRow = (cell, row, cb) => {
    const style = {
      fontSize: "15px",
      textOverflow: "ellipsis",
      overflow: "hidden",
    };
    if (row.endFlag === "0") style.color = "#9495aa";
    else if (row.successRate === "0" || row.successRate === "1")
      style.color = "red";

    return (
      <LightTooltip
        title={typeof cb === "function" ? cb(cell, row, true) : cell}
      >
        <div id="projectInfoSearchCol" style={style}>
          {typeof cb === "function" ? cb(cell, row) : cell}
        </div>
      </LightTooltip>
    );
  };

  render() {
    // 表格样式设定
    this.options = {
      onPageChange: (page) => {
        this.setState({ currentPage: page });
      },
      page: this.state.currentPage,
      sizePerPage: 10, // which size per page you want to locate as
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
    };
    const {
      employeeSearch,
      newMemberSearch,
      customerContractSearch,
      errorsMessageValue,
    } = this.state;
    // テーブルの列の選択
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      clickToSelectAndEditCell: true,
      hideSelectColumn: true,
      clickToExpand: true, // click to expand row, default is false
      onSelect: this.handleRowSelect,
    };
    const cellEdit = {
      mode: "click",
      blurToSave: true,
    };

    console.log({ state: this.state }, "render");

    return (
      <div>
        <div
          style={{ display: this.state.errorsMessageShow ? "block" : "none" }}
        >
          <ErrorsMessageToast
            errorsMessageShow={this.state.errorsMessageShow}
            message={errorsMessageValue}
            type={"danger"}
          />
        </div>
        <div>
          <Form id="siteForm">
            <Form.Group>
              <Row inline="true">
                <Col className="text-center">
                  <h2>営業個別売上</h2>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        営業担当
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      className="fx1"
                      id="customerNo"
                      name="customerNo"
                      value={
                        this.state.customerDrop.find(
                          (v) => v.code === this.state.customerNo
                        ) || {}
                      }
                      options={this.state.customerDrop}
                      getOptionLabel={(option) => option.text || ""}
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
                            className="auto form-control Autocompletestyle-customerInfo w100p"
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
                        社員区分
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      as="select"
                      size="sm"
                      onChange={this.onchange}
                      name="employeeSearch"
                      value={employeeSearch}
                      autoComplete="off"
                    >
                      <option value="">選択ください</option>
                      <option value="0">社員</option>
                      <option value="1">協力</option>
                      <option value="2">個人事業主</option>
                    </Form.Control>
                  </InputGroup>
                </Col>
                <Col sm={5}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        年月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={this.state.admissionStartDate}
                      onChange={this.admissionStartDate}
                      dateFormat="yyyy/MM"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      maxDate={
                        new Date(
                          new Date().getFullYear(),
                          parseInt(new Date().getMonth() + 1) + 1,
                          0
                        )
                      }
                      name="admissionStartDate"
                      className="form-control form-control-sm"
                      id="datePicker"
                      locale="ja"
                      autoComplete="off"
                    />
                    〜
                    <DatePicker
                      selected={this.state.admissionEndDate}
                      onChange={this.admissionEndDate}
                      dateFormat="yyyy/MM"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      maxDate={
                        new Date(
                          new Date().getFullYear(),
                          parseInt(new Date().getMonth() + 1) + 1,
                          0
                        )
                      }
                      name="admissionEndDate"
                      className="form-control form-control-sm"
                      id="datePicker"
                      locale="ja"
                      autoComplete="off"
                    />
                  </InputGroup>
                </Col>
              </Row>
              <div>
                <Row>
                  <Col sm={2}>
                    {/*
                     * <font style={{ whiteSpace:
                     * 'nowrap' }}>入場人数：{this.state.no}</font>
                     */}
                    <Button
                      size="sm"
                      onClick={this.shuseiTo.bind(this, "siteInfo")}
                      disabled={this.state.employeeNo === "" ? true : false}
                      className="individualSalesButtom"
                      name="clickButton"
                      variant="info"
                      id="siteInfo"
                    >
                      現場情報
                    </Button>{" "}
                    <Button
                      size="sm"
                      onClick={this.shuseiTo.bind(this, "wagesInfo")}
                      disabled={this.state.employeeNo === "" ? true : false}
                      hidden={this.state.authorityCode !== "4"}
                      className="individualSalesButtom"
                      name="clickButton"
                      variant="info"
                      id="wagesInfo"
                    >
                      給料情報
                    </Button>
                  </Col>
                  <Col sm={1}></Col>
                  <Col>
                    <InputGroup size="sm">
                      <InputGroup.Prepend>
                        <InputGroup.Text
                          id="inputGroup-sizing-sm"
                          className="input-group-indiv"
                        >
                          売上合計
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl value={this.state.profitAll} disabled />
                    </InputGroup>
                  </Col>

                  <Col
                    hidden={
                      this.state.occupationCode !== "5" &&
                      this.state.authorityCode !== "4"
                    }
                  >
                    <InputGroup size="sm">
                      <InputGroup.Prepend>
                        <InputGroup.Text
                          id="inputGroup-sizing-sm"
                          className="input-group-indiv"
                        >
                          粗利合計
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        value={this.state.siteRoleNameAll}
                        disabled
                      />
                    </InputGroup>
                  </Col>

                  <Col>
                    <InputGroup size="sm">
                      <InputGroup.Prepend>
                        <InputGroup.Text className="input-group-indiv width-auto">
                          担当者粗利合計
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        value={this.state.bpSiteRoleNameAll}
                        disabled
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={2}>
                    <div style={{ float: "right" }}>
                      <Button
                        size="sm"
                        name="clickButton"
                        variant="info"
                        id="syounin"
                        onClick={this.shuseiTo.bind(this, "salesPoint")}
                        disabled={this.state.customerNo === null ? true : false}
                        className="individualSalesButtom btn btn-primary btn-sm"
                      >
                        営業ポイント明細
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <BootstrapTable
                      selectRow={selectRow}
                      data={this.state.salesPointData}
                      ref="table"
                      pagination={true}
                      options={this.options}
                      headerStyle={{ background: "#5599FF" }}
                      striped
                      hover
                      condensed
                    >
                      <TableHeaderColumn
                        dataField="rowNo"
                        width="57"
                        tdStyle={{ padding: ".45em" }}
                        isKey
                      >
                        番号
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="employeeStatus"
                        width="90"
                        tdStyle={{ padding: ".45em" }}
                        hidden
                      >
                        社員区分
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="employeeName"
                        tdStyle={{ padding: ".45em" }}
                        width="160"
                        dataFormat={this.employeeNameFormat}
                      >
                        氏名
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="employeeFrom"
                        tdStyle={{ padding: ".45em" }}
                        hidden
                      >
                        所属
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width="120"
                        dataField="customerName"
                        tdStyle={{ padding: ".45em" }}
                      >
                        お客様
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        width="200"
                        dataField="workDate"
                        tdStyle={{ padding: ".45em" }}
                      >
                        入場期間
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="unitPrice"
                        tdStyle={{ padding: ".45em" }}
                        width="120"
                        hidden
                      >
                        単価
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="salesStaff"
                        width="150"
                        tdStyle={{ padding: ".45em" }}
                        dataFormat={this.eiGyoFormat}
                        hidden
                      >
                        営業担当
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="introducerEmployeeName"
                        width="120"
                        tdStyle={{ padding: ".45em" }}
                        hidden
                      >
                        紹介者
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="profit"
                        tdStyle={{ padding: ".45em" }}
                        width="150"
                        dataFormat={this.profitFormat}
                      >
                        売上
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="salary"
                        tdStyle={{ padding: ".45em" }}
                        width="150"
                      >
                        給料(発注)合計
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="siteRoleName"
                        tdStyle={{ padding: ".45em" }}
                        width="150"
                        dataFormat={this.siteRoleNameFormat}
                        hidden={
                          this.state.occupationCode !== "5" &&
                          this.state.authorityCode !== "4"
                        }
                      >
                        粗利
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="bpSiteRoleName"
                        width="130"
                        tdStyle={{ padding: ".45em" }}
                        dataFormat={(cell) => parseFloat(cell)}
                      >
                        担当者粗利
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="remarks"
                        width="240"
                        dataFormat={this.grayRow}
                        tdStyle={{ padding: ".45em" }}
                      >
                        備考
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </Col>
                </Row>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default salesProfit;
