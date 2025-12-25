import React　from "react";
import {
  Row,
  Col,
  InputGroup,
  Button,
  FormControl,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import "../asserts/css/style.css";
import DatePicker from "react-datepicker";
import * as publicUtils from "./utils/publicUtils.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import axios from "axios";
import ErrorsMessageToast from "./errorsMessageToast";
import store from "./redux/store";
axios.defaults.withCredentials = true;

class partnerCompaniesInfoSearch extends React.Component {
  state = {
    perCal: [],
    totalHidden: "",
  };
  curAllData=[];
  constructor(props) {
    super(props);
    this.state = this.initialState; //初期化
    this.options = {
      sizePerPage: 12,
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
  }
  initialState = {
    customerSalesListYearAndMonth: new Date(),
    customerCode: '',
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    perCal: [],
    CustomerSaleslListInfoList: [],
    totalGrossProfitAdd: 0,
    countPeo: 0,
    allData:[],
    manMonths: 0,//稼動人月
    customerList: []
  };

  getAuthorityCode = async () => {
    axios
      .post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
      .then((result) => {
        this.setState({
          authorityCode: result.data[0].authorityCode,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    console.log(1111,store.getState().dropDown[53].slice(1))
    this.getAuthorityCode();
    this.searchCustomer();
  }

  renderShowsTotal = () => {
    // return (
    //   <p
    //     hidden={!1 > 0}
    //     style={{ color: "dark", float: "left" }}
    //   >
    //     稼働人数：{this.state.countPeo}
    //   </p>
    // );
    return ''
  };

  customerNoChange = (event, newValue)=>{
    if (newValue && newValue.hasOwnProperty('code') && newValue.code !== null) {
      this.setState(
        {
          customerCode: newValue.code,
        },
        () => this.searchCustomer()
      );
    }

  }

  customerSalesListYearAndMonth = (date) => {
    if (date !== null) {
      this.setState(
        {
          customerSalesListYearAndMonth: date,
        },
        () => this.searchCustomer()
      );
    } else {
      this.setState({
        customerSalesListYearAndMonth: "",
      });
    }
  };
  toNumber = (v) => Number(v) || 0;

  displayInfo = (isAll = true) => {
    let data = isAll ? this.state.allData : this.curAllData; 
    console.log('displayInfo===>',isAll,data)
    let manMonths = data.reduce((sum, item) => {
                    return sum + (item.countPeo || 0);
                  }, 0);
    let averUnitPrice = data.reduce((sum, item) => {
                    return sum + (this.toNumber(item.averUnitPrice));
                  }, 0);
    let allDataverUnitPrice = this.state.allData.reduce((sum, item) => {
                    return sum + (this.toNumber(item.averUnitPrice));
                  }, 0);
    let unitPTotal = averUnitPrice/manMonths
    unitPTotal = unitPTotal.toFixed(2);
    const percentages = `${(averUnitPrice/allDataverUnitPrice).toFixed(2) * 100}%`;
    let totalpercent = isAll ? '100%': percentages;
    this.setState({
        manMonths,
        grossProfitPercent : averUnitPrice,
        unitPTotal,
        totalpercent
    });

  }

  searchCustomer = () => {
    const customerSalesListInfo = {
      unitPriceStartMonth: publicUtils.formateDate(
        this.state.customerSalesListYearAndMonth,
        false
      ),
      customerCode : this.state.customerCode
    };
    console.log(this.state.customerCode, customerSalesListInfo)
    axios
      .post(
        this.state.serverIP + "bpInfo/getPartnerBpInfo",
        customerSalesListInfo
      )
      .then((response) => {

        if (response.data.errorsMessage != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.errorsMessage,
          });
        } else if (response.data.noData != null) {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: response.data.noData,
          });
        } else {
       
          console.log('loading data =>',response.data.bpInfoList);
          console.log('loading data =>',response.data.allbpInfoList);
          //this.curAllData = [...response.data.bpInfoList]
          let custList = new Map(
              response.data.bpInfoCusList.map(item => [
                item.adminCustomerAbbCode,                  
                { name: item.adminCustomerAbb+'('+item.adminCustomerAbbCode+')', code: item.adminCustomerAbbCode }
              ])
            ).values()
          

          this.setState(
            { customerList: Array.from(custList) },
            () => {
              console.log('111111 =>',this.state.customerList);
            }
          );
          
          this.setState(
            { allData: response.data.bpInfoList },
            () => {
              this.displayInfo()
            }
          );

          this.setState({ errorsMessageShow: false });
          this.setState({ CustomerSaleslListInfoList: response.data.bpInfoList });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };

  averUnitPriceFormat(cell, row) {
    if (
      row.averUnitPrice === null ||
      row.averUnitPrice === "0" ||
      row.averUnitPrice === NaN
    ) {
      return;
    } else {
      let averageUnitP;
      let formatTotalUnitPrice = row.averUnitPrice.split(".")[1];
      if (formatTotalUnitPrice !== "0") {
        averageUnitP = row.averUnitPrice;
      } else {
        averageUnitP = row.averUnitPrice.split(".")[0];
      }
      return publicUtils.addComma(averageUnitP, false);
    }
  }

  totalUnitPriceFormat(cell, row) {
    if (row.totalUnitPrice === null || row.totalUnitPrice === "0") {
      return;
    } else {
      let formatTotalUnitPrice = row.totalUnitPrice;
      return publicUtils.addComma(formatTotalUnitPrice, false);
    }
  }

  costChange = (cell, row) => {
    if (cell === "0") return "";
    if (Number(row.cost) > Number(row.unitPrice))
      return <div style={{ color: "red" }}>{cell}</div>;
    return cell;
  };

  empDetailCheck = (cell, row) => {
    let returnItem = cell;
    const options = {
      noDataText: (
        <i className="" style={{ fontSize: "20px" }}>
          データなし
        </i>
      ),
      expandRowBgColor: "rgb(165, 165, 165)",
      hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
      expandRowBgColor: "rgb(165, 165, 165)",
    };
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
    };
    returnItem = (
      <OverlayTrigger
        trigger="click"
        placement={"left"}
        overlay={
          <Popover className="popoverC">
            <Popover.Content>
              <div>
                <BootstrapTable
                  pagination={false}
                  options={options}
                  data={row.empDetail}
                  selectRow={selectRow}
                  headerStyle={{ background: "#5599FF" }}
                  striped
                  hover
                  condensed
                >
                  <TableHeaderColumn
                    isKey={true}
                    dataField="employeeName"
                    tdStyle={{ padding: ".45em" }}
                    width="30%"
                  >
                    氏名
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="siteRoleName"
                    tdStyle={{ padding: ".45em" }}
                  >
                    役割
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="stationName"
                    tdStyle={{ padding: ".45em" }}
                    width="30%"
                  >
                    現場先
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="unitPrice"
                    tdStyle={{ padding: ".45em" }}
                  >
                    単価
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="cost"
                    dataFormat={this.costChange}
                    tdStyle={{ padding: ".45em" }}
                  >
                    費用
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="warning" size="sm">
          要員確認
        </Button>
      </OverlayTrigger>
    );
    return returnItem;
  };

  overTimeFeeAddComma(cell, row) {
    if (row.overTimeFee === null || row.overTimeFee === "0") {
      return;
    } else {
      let formatoverTimeFee = publicUtils.addComma(row.overTimeFee, false);
      return formatoverTimeFee;
    }
  }
  expectFeeAddComma(cell, row) {
    if (row.expectFee === null || row.expectFee === "0") {
      return "";
    } else {
      let formatexpectFee = publicUtils.addComma(row.expectFee, false);
      return <div style={{ color: "red" }}>{formatexpectFee}</div>;
    }
  }

  totalAmountAddComma(cell, row) {
    if (row.totalAmount === null || row.totalAmount === "0") {
      return "";
    } else {
      let formattotalAmount = publicUtils.addComma(row.totalAmount, false);
      return formattotalAmount;
    }
  }

  grossProfitAddComma(cell, row) {
    if (row.grossProfit === null /*||row.grossProfit==="0"*/) {
      return "";
    } else {
      if (row.grossProfit < 0) {
        let formatgrossProfit = publicUtils.addComma(row.grossProfit, false);
        return <div style={{ color: "red" }}>{formatgrossProfit}</div>;
      }
      let formatgrossProfit = publicUtils.addComma(row.grossProfit, false);
      return formatgrossProfit;
    }
  }

  renderHtml = (cell)=> {
    return (
      <span dangerouslySetInnerHTML={{ __html: cell }} />
    );
  }


  // 鼠标悬停显示全文
  customerNameFormat = (cell) => {
    return <span title={cell}>{cell}</span>;
  };

  handleRowSelect = (row, isSelected, e) => {
    console.log('handleRowSelect=>',isSelected)

    if (isSelected) {
      if(this.state.allData.length == this.curAllData.length) {
        this.displayInfo();
      }else{
        this.curAllData.push(row);
        this.displayInfo(false)
      }
    } else {
        console.log('handleRowSelect=>',row.bpBelongCustomerCode)

        this.curAllData = this.curAllData.filter(item => item.bpBelongCustomerCode != row.bpBelongCustomerCode);
        this.displayInfo(this.curAllData.length == 0)
    }
  };

  render() {
    const { errorsMessageValue } = this.state;
    const selectRow = {
      mode: "checkbox",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
      singleSelect: false,
      onSelect: this.handleRowSelect.bind(this),
    };
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
        <Row inline="true">
          <Col className="text-center">
            <h2>協力会社売上一覧</h2>
          </Col>
        </Row>
        <Row style={{ paddingTop: '15px' }}>
          <Col>
            <InputGroup size="sm"  className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  年月
                </InputGroup.Text>
                <DatePicker
                  selected={this.state.customerSalesListYearAndMonth}
                  onChange={this.customerSalesListYearAndMonth}
                  autoComplete="off"
                  showMonthYearPicker
                  showFullMonthYearPicker
                  showDisabledMonthNavigation
                  className="form-control form-control-sm"
                  id="customerSalesListDatePicker"
                  dateFormat={"yyyy/MM"}
                  name="customerSalesListYearAndMonth"
                  locale="ja"
                />
              </InputGroup.Prepend>
            </InputGroup>
          </Col>

          <Col>
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text>お客様名</InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  id="customerNo"
                  name="customerNo"
                  // value={
                  //   store
                  //     .getState()
                  //     .dropDown[53].slice(1)
                  //     .find((v) => v.code === this.state.customerCode) || ""
                  // }
                  value={
                    this.state.customerList
                      .find((v) => v.code === this.state.customerCode) || ""
                  }
                  //options={store.getState().dropDown[53].slice(1)}
                  options={this.state.customerList}
                  
                  // options={[
                  //       { code: "", name: "" },
                  //       ...store.getState().dropDown[53].slice(1)
                  //     ]}
                  getOptionLabel={(option) => (option.name ? option.name : "")}
                  renderOption={(option) => {
                    return <React.Fragment>{option.name || ""}</React.Fragment>;
                  }}
                  onChange={this.customerNoChange}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-customerInfoSearch w100p"
                      />
                    </div>
                  )}
                />
              </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text
                  id="inputGroup-sizing-sm"
                  className="input-group-indiv"
                >
                  全体比率
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.totalpercent} disabled />
            </InputGroup>
          </Col>

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
              <FormControl value={this.state.grossProfitPercent} disabled />
            </InputGroup>
          </Col>


          <Col>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text
                  id="inputGroup-sizing-sm"
                  className="input-group-indiv"
                >
                  平均単価
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.unitPTotal} disabled />
            </InputGroup>
          </Col>

          <Col>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text
                  id="inputGroup-sizing-sm"
                  className="input-group-indiv"
                >
                  稼動人月
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.manMonths} disabled />
            </InputGroup>
          </Col>
        </Row>
        <Col>
          <BootstrapTable
            data={this.state.CustomerSaleslListInfoList}
            ref="CustomerSaleslListInfoListTable"
            pagination={true}
            selectRow={selectRow}
            headerStyle={{ background: "#5599FF" }}
            options={this.options}
            striped
            hover
            condensed
          >
            <TableHeaderColumn
              tdStyle={{ padding: ".45em" }}
              dataField="rowNo"
              isKey
              width="40"
            >
              番号
            </TableHeaderColumn>
            <TableHeaderColumn
              tdStyle={{ padding: ".45em" }}
              dataField="customerName"
              width="130"
              dataFormat={this.customerNameFormat.bind(this)}
            >
              協力会社
            </TableHeaderColumn>
            <TableHeaderColumn
              tdStyle={{ padding: ".45em" }}
              dataField="totalUnitPrice"
              dataFormat={this.totalUnitPriceFormat}
              width="60"
            >
              単価合計
            </TableHeaderColumn>
            <TableHeaderColumn
              tdStyle={{ padding: ".45em" }}
              dataField="averUnitPrice"
              dataFormat={this.averUnitPriceFormat}
              width="70"
            >
              粗利
            </TableHeaderColumn>
            <TableHeaderColumn
              tdStyle={{ padding: ".45em" }}
              dataField="countPeo"
              width="50"
            >
              稼働人数
            </TableHeaderColumn>
            {/* <TableHeaderColumn
              tdStyle={{ padding: ".45em" }}
              dataField="lastMonthCountPeo"
              width="100"
            >
              先月稼働人数
            </TableHeaderColumn> */}
            <TableHeaderColumn
              tdStyle={{ padding: ".45em" }}
              dataField="employeeStr"
              width="360"
              dataFormat={this.renderHtml}
            >
              要員リスト
            </TableHeaderColumn>
          </BootstrapTable>
        </Col>
      </div>
    );
  }
}
export default partnerCompaniesInfoSearch;
