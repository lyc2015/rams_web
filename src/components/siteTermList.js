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
 *现场11个月List画面
 */
class siteTermList extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
  }

  // 初期化
  initialState = {
    yearMonth: "",
    history: "",
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
    linkDisableFlag: true, // linkDisableFlag
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
	this.state.salesYearAndMonth = publicUtils.dateFormate(this.props.sendValue.yearMonth)
    this.state.history = this.props.sendValue.history
    this.getEmployeeSiteWorkTermList(publicUtils.formateDate(this.props.sendValue.yearMonth, false));
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
      	linkDisableFlag: false,
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
        linkDisableFlag: true,
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
  
  // レコードを取る
  getEmployeeSiteWorkTermList = (searchYearMonth) => {
    axios
      .post(this.state.serverIP + "salesSituation/getEmployeeSiteWorkTermList", {
        salesYearAndMonth: searchYearMonth,
      })
      .then((result) => {
        if (result.data != null) {
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
    
    if(row.admissionPeriodDate === null &&  row.admissionPeriodDate === ""){
		return str;
	}

	if(row.admissionPeriodDate == 11){
		str = str + " (" + row.admissionPeriodDate + ")"
		return str;
	}

	return (
        <div>
          {str}
          <font color="red"> ({row.admissionPeriodDate})</font>
        </div>
      );

    //return str;
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
  
  shuseiTo = (actionType) => {
    var path = {};
    const sendValue = {
      salesYearAndMonth: publicUtils.formateDate(this.state.yearMonth, false),
      selectetRowIds: this.refs.table.state.selectedRowKeys,
      linkDisableFlag: this.state.linkDisableFlag, // linkDisableFlag
      sendLetterFalg: true,
      proposeClassificationCode: "2",
    };

    switch (actionType) {
      case "siteInfo":
        path = {
          pathname: "/subMenuManager/siteInfo",
          state: {
            employeeNo: this.state.employeeNo,
            backPage: "manageSituation",
            sendValue: sendValue,
          },
        };
        break;
      default:
    }
    this.state.history.push(path)
  };
  
  render() {
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
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
	            <div>
	            	<Button
                  	  onClick={this.shuseiTo.bind(this, "siteInfo")}
	                  size="sm"
	                  variant="info"
	                  name="clickButton"
	                  disabled={this.state.linkDisableFlag}
	                >
	                  <FontAwesomeIcon icon={faBuilding} /> 現場情報
	                </Button>{" "}
	            </div>
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
                  <TableHeaderColumn dataField="employeeNo" hidden>
                    社員番号
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    width="5%"
                    dataField="rowNo"
                    autoValue
                    dataFormat={this.showGreyNo}
                    editable={false}
                    isKey
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
                    editable={
                      this.state.salesProgressCode === "1" ||
                      this.state.salesProgressCode === "2"
                        ? true
                        : false
                    }
                  >
                    {<div style={{ textAlign: "center" }}>お客様</div>}
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    width="10%"
                    dataField="admissionStartDate"
                 	dataFormat={this.workDateFormat}
                  >
                    {<div style={{ textAlign: "center" }}>直近入場年月日</div>}
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    width="10%"
                    dataField="salesStaff"
                  >
                    {<div style={{ textAlign: "center" }}>営業担当 </div>}
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
export default siteTermList;