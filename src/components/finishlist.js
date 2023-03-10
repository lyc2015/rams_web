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
  faCopy,
  faSync,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import TableSelect from "./TableSelect";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import store from "./redux/store";
axios.defaults.withCredentials = true;
/**
 *终了List画面
 */
class finishList extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
  }

  // 初期化
  initialState = {
    yearMonth: "",
    salesYearAndMonth: "",
    salesSituationFinishLists: [],
    allCustomer: store.getState().dropDown[15], // お客様レコード用
    interviewClassificationCode: "0",
    interviewNumbers: "", // 面接1回数
    interviewDateShow: "", // 面接1日付
    interviewDate: "", // 面接1日付
    stationCode: "", // 面接1場所
    interviewCustomer: "", // 面接1客様
    interviewInfo: "",
    interviewURL: "",
    employeeNo: "",
    row: "",
    makeDirectoryFalg: true,
    interviewInfoNum: "1",
    getstations: store.getState().dropDown[14], // 全部場所
    customers: store.getState().dropDown[15], // 全部お客様 画面入力用
    interviewClassification: store.getState().dropDown[76].slice(1), // 全部お客様 画面入力用
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
  };

  // 初期表示のレコードを取る
  componentDidMount() {
	this.state.yearMonth = publicUtils.dateFormate(this.props.sendValue.yearMonth)
    this.getSalesSituationFinish(publicUtils.formateDate(this.props.sendValue.yearMonth, false));
  }

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
    if (this.state.interviewInfoNum === "1") {
      interviewModel["interviewClassificationCode1"] =
        this.state.interviewClassificationCode;
      interviewModel["interviewDate1"] = this.state.interviewDate;
      interviewModel["stationCode1"] = this.state.stationCode;
      interviewModel["interviewCustomer1"] = this.state.interviewCustomer;
      interviewModel["interviewInfo1"] = this.state.interviewInfo;
      interviewModel["interviewUrl1"] = this.state.interviewURL;

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
      interviewModel["interviewUrl2"] =
        this.state.row.interviewURL2 === null
          ? ""
          : this.state.row.interviewURL2;
    } else if (this.state.interviewInfoNum === "2") {
      interviewModel["interviewClassificationCode1"] =
        this.state.row.interviewClassificationCode1;
      interviewModel["interviewDate1"] = this.state.row.interviewDate1;
      interviewModel["stationCode1"] = this.state.row.stationCode1;
      interviewModel["interviewCustomer1"] = this.state.row.interviewCustomer1;
      interviewModel["interviewInfo1"] = this.state.row.interviewInfo1;
      interviewModel["interviewUrl1"] = this.state.row.interviewURL1;

      interviewModel["interviewClassificationCode2"] =
        this.state.interviewClassificationCode;
      interviewModel["interviewDate2"] = this.state.interviewDate;
      interviewModel["stationCode2"] = this.state.stationCode;
      interviewModel["interviewCustomer2"] = this.state.interviewCustomer;
      interviewModel["interviewInfo2"] = this.state.interviewInfo;
      interviewModel["interviewUrl2"] = this.state.interviewURL;
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
            this.getSalesSituationFinish();
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
        interviewModel["interviewUrl1"] = "";

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
        interviewModel["interviewUrl2"] =
          this.state.row.interviewURL2 === null
            ? ""
            : this.state.row.interviewURL2;
      } else if (this.state.interviewInfoNum === "2") {
        interviewModel["interviewClassificationCode1"] =
          this.state.row.interviewClassificationCode1;
        interviewModel["interviewDate1"] = this.state.row.interviewDate1;
        interviewModel["stationCode1"] = this.state.row.stationCode1;
        interviewModel["interviewCustomer1"] =
          this.state.row.interviewCustomer1;
        interviewModel["interviewInfo1"] = this.state.row.interviewInfo1;
        interviewModel["interviewUrl1"] = this.state.row.interviewURL1;

        interviewModel["interviewClassificationCode2"] = "";
        interviewModel["interviewDate2"] = "";
        interviewModel["stationCode2"] = "";
        interviewModel["interviewCustomer2"] = "";
        interviewModel["interviewInfo2"] = "";
        interviewModel["interviewUrl2"] = "";
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
              this.getSalesSituationFinish();
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


  // レコードselect事件
  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({
        row: row,
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
        interviewURL: row.interviewUrl1 === null ? "" : row.interviewUrl1,
        interviewInfoNum: "1",
      });
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
        interviewURL: "",
        interviewInfoNum: "1",
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

  // 年月変更後、レコ＾ド再取る
  setEndDate = (date) => {
    this.setState({
      yearMonth: date,
      salesYearAndMonth: publicUtils.formateDate(date, false),
    });
    console.error("error = " + date + ", " + this.getNextMonth(date, 0))
    this.getSalesSituationFinish(this.getNextMonth(date, 0));
  };
  
  // レコードを取る
  getSalesSituationFinish = (searchYearMonth) => {
    axios
      .post(this.state.serverIP + "salesSituation/getSalesSituationFinish", {
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
            if(result.data[i].salesProgressCode === "0" || result.data[i].salesProgressCode === "1"){
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
          this.setState(
            {
              modeSelect: "radio",
              salesSituationFinishLists: result.data,
              style: {
                backgroundColor: "",
              },
              totalPersons: totalPersons, // 合計人数
              decidedPersons: decidedPersons, // 確定人数
              errorsMessageShow: false,
              errorsMessageValue: "",
              allEmpNo: empNoArray,
              allEmpNoName: empNoNameArray,
              allresumeInfo1: resumeInfo1Array,
              allresumeInfo2: resumeInfo2Array,
              allresumeInfo: resumeInfoArray,
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
  
  
  workDateFormat = (cell, row) => {
    let str = cell;
    if (row.admissionStartDate) {
      str = publicUtils.convertDayToMonth(row.admissionStartDate)
    }
	
	if (row.admissionPeriodDate !== null || row.admissionPeriodDate !== "") {
		str = str + " (" + row.admissionPeriodDate + ")"
	}

    return str;
  };
  
    // 優先度表示
  showPriority(cell, row, enumObject, index) {
    let nameAndCompany =
      row.employeeName +
      (row.customerAbbreviation ? `(${row.customerAbbreviation})` : "");

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
  
  showGreyUnitPrice(cell, row, enumObject, index) {
    let unitPrice;
    /*if(row.employeeNo.indexOf("BP") != -1){
			unitPrice = row.unitPrice;
		}else{*/
    let num = (cell / 10000).toFixed(1).replace(".0", "");
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
  
  render() {
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
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
    
    
    const tableSelect1 = (onUpdate, props) => (
      <TableSelect dropdowns={this} flag={1} onUpdate={onUpdate} {...props} />
    );
    
    return (
      <div>
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

        <Form>
        <Row>
            <Col>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    終了年月
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
            <Col>
              <Col sm={16}>
                <BootstrapTable
                  ref="table"
                  data={this.state.salesSituationFinishLists}
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
                    width="5%"
                    dataField="rowNo"
                    autoValue
                    dataFormat={this.showGreyNo}
                    editable={false}
                  >
                    {<div onClick={this.selectAllLists}>番号</div>}
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    width="13%"
                    dataField="employeeName"
                    dataFormat={this.showPriority}
                  >
                    {<div style={{ textAlign: "center" }}>氏名</div>}
                  </TableHeaderColumn>
                  
                
                  <TableHeaderColumn
                    width="5%"
                    dataField="unitPrice"
                    dataFormat={this.showGreyUnitPrice}
                  >
                    {<div style={{ textAlign: "center" }}>単価</div>}
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
                    お客様
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    width="10%"
                    dataField="admissionStartDate"
                 	dataFormat={this.workDateFormat}
                  >
                    {<div style={{ textAlign: "center" }}>現場開始月</div>}
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    width="10%"
                    dataField="finishReason"
                  >
                    {<div style={{ textAlign: "center" }}>終了理由</div>}
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
export default finishList;
