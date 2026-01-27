/* Bp情報を追加 */
import React from "react";
import {
  Form,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../asserts/css/style.css";
import DatePicker from "react-datepicker";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUndo, faTrash, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as utils from "./utils/publicUtils.js";
import store from "./redux/store";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import { InputNumber } from "antd";
import $ from "jquery";
axios.defaults.withCredentials = true;

class bpInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.valueChange = this.valueChange.bind(this);
    this.bpSalesProgressCodeChange = this.bpSalesProgressCodeChange.bind(this);
  }
  // 初期化
  initialState = {
    // salesProgressCodes: [],
    bpBelongCustomerCode: "", // 選択中のBP所属
    bpUnitPrice: "", // 単価
    bpSalesProgressCode:
      String(this.props.employeeNo).substring(0, 3) === "BPR" ? "3" : "4", // 選択中の営業状況
    bpRemark: "", // 備考
    bpOtherCompanyAdmissionEndDate: "",
    oldUnitPriceStartMonth: null,
    myToastShow: false,
    errorsMessageShow: false, // 错误消息显示标志
    errorsMessageValue: "", // 错误消息内容
    bpInfoTable: [], // 初始化列表为空数组，避免undefined
    customer: store.getState().dropDown[15].slice(1),
    salesProgressCodes: store.getState().dropDown[16].slice(1),
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    actionType: this.props.actionType
  };
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleValueChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  bpSalesProgressCodeChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (event.target.value === "4") {
      this.setState({
        bpOtherCompanyAdmissionEndDate: "",
      });
    }
  };
  // リセット
  resetButton = (BP) => {
    !BP && this.setState({
        bpBelongCustomerCode: "" // 選択中のBP所属
    })
    this.setState({
      bpUnitPrice: "", // 単価
      bpSalesProgressCode:
        String(this.props.employeeNo).substring(0, 3) === "BPR" ? "3" : "4", // 選択中の営業状況
      bpOtherCompanyAdmissionEndDate: "", // 所属現場終年月
      bpRemark: "", // 備考
      oldUnitPriceStartMonth: null,
      actionType: this.props.actionType,
      unitPriceStartMonth: ''
    });
    this.refs.bpInfoTable.reset(); 
  };

  deleteRow = () => {
    var a = window.confirm("削除してもよろしいでしょうか？");
    if (a) {
      const bpInfoModel = {
        bpEmployeeNo: this.props.employeeNo,
        oldUnitPriceStartMonth: this.state.oldUnitPriceStartMonth,
      };
      axios
        .post(this.state.serverIP + "employee/deletebpInfo", bpInfoModel)
        .then((response) => {
          if (response.data.errorsMessage != null) {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: response.data.errorsMessage,
            });
            setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
          } else {
            this.setState({ myToastShow: true, errorsMessageShow: false });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
          }
          // 重新加载数据，会自动选中新的最后一条数据并填充表单字段
          this.getbpInfoList();
        })
        .catch((error) => {
          console.error("Error - " + error);
        });
    }
  };

  // 初期化メソッド
  componentDidMount() {
    this.setEmployeeName();
    this.getbpInfoList();
    /*		if (this.props.actionType !== "insert") {
      this.getbpInfoList();
    }
    var bpInfoModel = this.props.bpInfoModel;// 父画面のパラメータ（画面既存口座情報）
    if (!$.isEmptyObject(bpInfoModel)) {
      this.setState({
        bpBelongCustomerCode: bpInfoModel["bpBelongCustomerCode"],
        bpUnitPrice: bpInfoModel["bpUnitPrice"],
        bpSalesProgressCode: bpInfoModel["bpSalesProgressCode"],
        bpOtherCompanyAdmissionEndDate: utils.converToLocalTime(bpInfoModel["bpOtherCompanyAdmissionEndDate"], false),
        bpRemark: bpInfoModel["bpRemark"],
      });

    }*/
  }

  getbpInfoList = () => {
    const formData = new FormData();
    formData.append("bpEmployeeNo", this.props.employeeNo);
    axios
      .post(this.state.serverIP + "bpInfo/getBpInfo", formData)
      .then((response) => response.data)
      .then((data) => {
        //let monthList = data.bpInfoList.map(item =>
        //    !!item.unitPriceStartMonth && utils.converToLocalTime(item.unitPriceStartMonth, false)
        //)
        // 过滤掉空数据行（如果unitPriceStartMonth为空或null，则认为该行为空数据）
        const filteredList = (data.bpInfoList || []).filter(item => {
          if (!item) return false;
          const unitPriceStartMonth = item.unitPriceStartMonth;
          return unitPriceStartMonth !== null && 
                 unitPriceStartMonth !== undefined && 
                 unitPriceStartMonth !== "" &&
                 String(unitPriceStartMonth).trim() !== "";
        });
        // 为每行添加rowNo，从1开始
        const listWithRowNo = filteredList.map((item, index) => ({
          ...item,
          rowNo: index + 1
        }));
        
        // 找到単価開始月最大的那条数据（列表最下面的数据）
        // 按unitPriceStartMonth排序，找到最大的
        let maxUnitPriceStartMonthRow = null;
        if (listWithRowNo.length > 0) {
          // 找到unitPriceStartMonth最大的那条数据
          maxUnitPriceStartMonthRow = listWithRowNo.reduce((max, current) => {
            if (!max || !max.unitPriceStartMonth) return current;
            if (!current || !current.unitPriceStartMonth) return max;
            // 比较日期字符串，格式应该是YYYY-MM-DD或类似
            return current.unitPriceStartMonth > max.unitPriceStartMonth ? current : max;
          });
        }
        
        // 初始化数据
        const initialState = {
          bpInfoTable: listWithRowNo,
          bpBelongCustomerCode:
            data.model === null ? "" : data.model.bpBelongCustomerCode, // 選択中のBP所属
          bpSalesProgressCode:
            data.model === null ? "1" : data.model.bpSalesProgressCode, // 選択中の営業状況
          bpOtherCompanyAdmissionEndDate:
            data.model === null
              ? ""
              : utils.converToLocalTime(
                data.model.bpOtherCompanyAdmissionEndDate,
                false
              ),
          //monthList: monthList.filter(item => !!item)
        };
        
        this.setState(initialState, () => {
          // 自动选中最大単価開始月的那条数据（最后一条数据）
          if (maxUnitPriceStartMonthRow && maxUnitPriceStartMonthRow.unitPriceStartMonth && this.refs.bpInfoTable) {
            const key = maxUnitPriceStartMonthRow.unitPriceStartMonth;
            this.refs.bpInfoTable.store.selected = [key];
            this.refs.bpInfoTable.setState({
              selectedRowKeys: [key],
            });
            // 触发handleRowSelect来自动填充表单字段（包括単価開始年月和BP単価）
            this.handleRowSelect(maxUnitPriceStartMonthRow, true, null);
          }
        });
      });
  };

  setEmployeeName = () => {
    if (!this.props.employeeName) {
      this.setState({
        pbInfoEmployeeName: "",
      });
    } else {
      this.setState({
        pbInfoEmployeeName: this.props.employeeName,
      });
    }
  };

  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({
        oldUnitPriceStartMonth: row.unitPriceStartMonth,
        unitPriceStartMonth:
          !row.unitPriceStartMonth ? "" : utils.converToLocalTime(row.unitPriceStartMonth, false),
        bpUnitPrice: !row.bpUnitPrice  ? "" : row.bpUnitPrice,
        bpRemark: !row.bpRemark ? "" : row.bpRemark,
        bpSalesProgressCode: row.bpSalesProgressCode,
        actionType: this.props.actionType === 'updateInsert' ? 'update' : this.props.actionType,
        bpBelongCustomerCode: row.bpBelongCustomerCode,
        bpOtherCompanyAdmissionEndDate: utils.converToLocalTime(row.bpOtherCompanyAdmissionEndDate, false)
      });
    } else {
      this.setState({
        oldUnitPriceStartMonth: null,
        unitPriceStartMonth: "",
        bpUnitPrice: "",
        bpRemark: "",
        bpOtherCompanyAdmissionEndDate: "",
        actionType: this.props.actionType === 'updateInsert' ? 'updateInsert' : this.props.actionType
      });
    }
  };

  bpOtherCompanyAdmissionEndDateChange = (date) => {
    this.setState({
      bpOtherCompanyAdmissionEndDate: date,
    });
  };

  unitPriceStartMonthChange = (date) => {
    this.setState({
      unitPriceStartMonth: date,
    });
  };

  insertOrUpdateBpInfo = () => {
    // 验证単価開始年月是否为必填项
    if (!this.state.unitPriceStartMonth || 
        this.state.unitPriceStartMonth === "" || 
        this.state.unitPriceStartMonth === null) {
      this.setState({
        errorsMessageShow: true,
        errorsMessageValue: "単価開始年月は必須項目です。",
      });
      setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
      return;
    }
    // 验证BP単価是否为必填项
    if (!this.state.bpUnitPrice || 
        this.state.bpUnitPrice === "" || 
        this.state.bpUnitPrice === null ||
        this.state.bpUnitPrice === 0) {
      this.setState({
        errorsMessageShow: true,
        errorsMessageValue: "BP単価は必須項目です。",
      });
      setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
      return;
    }
    
    // 如果是更新操作，必须要有oldUnitPriceStartMonth来标识要更新的记录
    if ((this.state.actionType === "update" || this.state.actionType === 'updateInsert') && 
        (!this.state.oldUnitPriceStartMonth || this.state.oldUnitPriceStartMonth === null || this.state.oldUnitPriceStartMonth === "")) {
      this.setState({
        errorsMessageShow: true,
        errorsMessageValue: "更新するデータを選択してください。",
      });
      setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
      return;
    }

    // 构建更新模型，确保oldUnitPriceStartMonth存在（用于标识要更新的记录）
    const bpInfoModel = {
      bpEmployeeNo: this.props.employeeNo,
      bpBelongCustomerCode: this.state.bpBelongCustomerCode,
      bpUnitPrice: this.state.bpUnitPrice,
      bpSalesProgressCode: this.state.bpSalesProgressCode,
      unitPriceStartMonth: utils.formateDate(
        this.state.unitPriceStartMonth,
        false
      ),
      bpRemark: this.state.bpRemark,
      oldUnitPriceStartMonth: this.state.oldUnitPriceStartMonth,
    };
    
    // 只有在有值时才包含bpOtherCompanyAdmissionEndDate
    if (this.state.bpOtherCompanyAdmissionEndDate && 
        this.state.bpOtherCompanyAdmissionEndDate !== "" && 
        this.state.bpOtherCompanyAdmissionEndDate !== null) {
      bpInfoModel.bpOtherCompanyAdmissionEndDate = utils.formateDate(
        this.state.bpOtherCompanyAdmissionEndDate,
        false
      );
    }
    
    // 添加调试日志，确认发送的数据
    console.log("更新BP信息 - 发送的数据:", {
      oldUnitPriceStartMonth: bpInfoModel.oldUnitPriceStartMonth,
      unitPriceStartMonth: bpInfoModel.unitPriceStartMonth,
      bpOtherCompanyAdmissionEndDate: bpInfoModel.bpOtherCompanyAdmissionEndDate,
      actionType: this.state.actionType
    });
    
    if (this.state.actionType === "update" || this.state.actionType === 'updateInsert') {
      // 再次确认oldUnitPriceStartMonth存在
      if (!bpInfoModel.oldUnitPriceStartMonth) {
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue: "更新するデータを選択してください。",
        });
        setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
        return;
      }
      
      axios
        .post(this.state.serverIP + "employee/updatebpInfo", bpInfoModel)
        .then((response) => {
          if (response.data.errorsMessage != null) {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: response.data.errorsMessage,
            });
            setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
          } else {
            this.setState({ myToastShow: true, errorsMessageShow: false });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
          }
          this.getbpInfoList();
          this.setState({ oldUnitPriceStartMonth: null });
        })
        .catch((error) => {
          console.error("Error - " + error);
        });
    }
    //this.props.pbInfoTokuro(bpInfoModel);
  };

  getCustomer = (event, values) => {
    if (values != null) {
      this.setState({
        bpBelongCustomerCode: values.code,
      });
    } else {
      this.setState({
        bpBelongCustomerCode: "",
      });
    }
  };
  render() {
    const { bpUnitPrice, bpSalesProgressCode, bpRemark, pbInfoEmployeeName } = this.state;

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
      sizePerPage: 5,
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
    return (
      <div>
        <Form>
          <Form.Group>
            <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
              <MyToast
                myToastShow={this.state.myToastShow}
                message={"修正成功！"}
                type={"success"}
              />
            </div>
            <div style={{ display: this.state.errorsMessageShow ? "block" : "none" }}>
              <ErrorsMessageToast
                errorsMessageShow={this.state.errorsMessageShow}
                message={this.state.errorsMessageValue}
                type={"danger"}
              />
            </div>
            <Row>
              <Col sm={6}>
                <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                  BP名：{pbInfoEmployeeName}
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">
                      BP所属
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Autocomplete
                    className="fx1"
                    id="bpBelongCustomerCode"
                    name="bpBelongCustomerCode"
                    value={
                      this.state.customer.find(
                        (v) => v.code === this.state.bpBelongCustomerCode
                      ) || {}
                    }
                    onChange={(event, values) =>
                      this.getCustomer(event, values)
                    }
                    options={this.state.customer}
                    disabled={!!(this.state.actionType === "detail")}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <input
                          placeholder="  BP所属"
                          type="text"
                          {...params.inputProps}
                          className="auto form-control Autocompletestyle-bpInfo-bpBelongCustomerCode w100p"
                          id="bpBelongCustomerCode"
                          style={{
                            backgroundColor:
                              this.state.actionType === "detail"
                                ? "#e9ecef"
                                : "",
                          }}
                        />
                      </div>
                    )}
                  />
                </InputGroup>
              </Col>
              <Col sm={6}>
                <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">
                      営業状況
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    className="w100p"
                    as="select"
                    size="sm"
                    onChange={this.bpSalesProgressCodeChange}
                    name="bpSalesProgressCode"
                    value={bpSalesProgressCode}
                    autoComplete="off"
                    disabled={!!(this.state.actionType === "detail")}
                  >
                    {this.state.salesProgressCodes.map((date) => (
                      <option key={date.code} value={date.code}>
                        {date.name}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sixKanji">
                        単価開始年月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={this.state.unitPriceStartMonth}
                      onChange={this.unitPriceStartMonthChange}
                      autoComplete="off"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      //minDate={utils.getMonthFirstDay()}
                      //excludeDates={this.state.monthList}
                      showDisabledMonthNavigation
                      className="form-control form-control-sm"
                      id={
                        this.state.actionType === "detail" ||
                          bpSalesProgressCode === "4"
                          ? "datePickerReadonlyDefault-bpInfo"
                          : "datePicker-bpInfo"
                      }
                      dateFormat={"yyyy/MM"}
                      locale="ja"
                      disabled={
                        this.state.actionType === "detail" ||
                          !!(bpSalesProgressCode === "4")
                      }
                    />
                  </InputGroup>
                  <font color="red" style={{ position: "absolute", right: "-15px", top: "38%", transform: "translateY(-50%)", marginLeft: "5px", lineHeight: "1", fontSize: "14px" }}>
                    ★
                  </font>
                </div>
              </Col>
              <Col sm={6}>
                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        BP単価
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputNumber
                      className="w100p form-control"
                      placeholder="BP単価"
                      value={bpUnitPrice}
                      autoComplete="off"
                      onChange={(value) =>
                        this.handleValueChange(value, "bpUnitPrice")
                      }
                      size="sm"
                      name="bpUnitPrice"
                      disabled={!!(this.props.actionType === "detail")}
                      maxLength="3"
                      controls={false}
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text id="twoKanji">万円</InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                  <font color="red" style={{ position: "absolute", right: "-15px", top: "38%", transform: "translateY(-50%)", marginLeft: "5px", lineHeight: "1", fontSize: "14px" }}>
                    ★
                  </font>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="sixKanji">
                      所属終了年月
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <DatePicker
                    selected={this.state.bpOtherCompanyAdmissionEndDate}
                    onChange={this.bpOtherCompanyAdmissionEndDateChange}
                    autoComplete="off"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    showDisabledMonthNavigation
                    //minDate={utils.getMonthFirstDay(this.state.unitPriceStartMonth)}
                    className="form-control form-control-sm"
                    id={
                      this.state.actionType === "detail" ||
                        bpSalesProgressCode === "4"
                        ? "datePickerReadonlyDefault-bpInfo"
                        : "datePicker-bpInfo"
                    }
                    dateFormat={"yyyy/MM"}
                    locale="ja"
                    disabled={
                      this.state.actionType === "detail" ||
                        !!(bpSalesProgressCode === "4")
                    }
                  />
                </InputGroup>
              </Col>
              <Col sm={6}>
                <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="twoKanji">備考</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    className="w100p"
                    placeholder="例：XXXXX"
                    name="bpRemark"
                    value={bpRemark}
                    autoComplete="off"
                    disabled={!!(this.state.actionType === "detail")}
                    onChange={this.valueChange}
                    type="text"
                    aria-label="Small"
                    size="sm"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </InputGroup>
              </Col>
            </Row>
          </Form.Group>
          <div
            style={{ textAlign: "center" }}
            hidden={this.state.actionType === "detail"}
          >
            <Button
              size="sm"
              variant="info"
              onClick={this.insertOrUpdateBpInfo}
              type="button"
              on="true"
            >
              <FontAwesomeIcon icon={faSave} />{" "}
              {this.state.actionType === "update" ? "更新" : "登録"}
            </Button>{" "}
            <Button size="sm" variant="info" onClick={this.resetButton}>
              <FontAwesomeIcon icon={faUndo} /> リセット
            </Button>
          </div>
          <div
            style={{ textAlign: "right" }}
            hidden={this.state.actionType === "detail"}
          >
            <Col>
              <Button
                size="sm"
                variant="info"
                type="button"
                disabled={this.state.oldUnitPriceStartMonth === null}
                onClick={this.deleteRow}
              >
                <FontAwesomeIcon icon={faTrash} /> 削除
              </Button>
            </Col>
          </div>
          <div>
            <Row>
              <Col sm={12}>
                <BootstrapTable
                  ref="bpInfoTable"
                  data={this.state.bpInfoTable}
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
                    width="15%"
                    tdStyle={{ padding: ".45em" }}
                    dataField="rowNo"
                  >
                    番号
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="25%"
                    tdStyle={{ padding: ".45em" }}
                    dataField="unitPriceStartMonth"
                    isKey
                  >
                    単価開始月
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="20%"
                    tdStyle={{ padding: ".45em" }}
                    dataField="bpUnitPrice"
                  >
                    単価
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="40%"
                    tdStyle={{ padding: ".45em" }}
                    dataField="bpRemark"
                  >
                    備考
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    );
  }
}

export default bpInfo;
