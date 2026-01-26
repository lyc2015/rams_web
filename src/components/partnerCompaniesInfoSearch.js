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
    // 处理空选项或取消选择的情况
    if (newValue === null || (newValue && newValue.code === "")) {
      this.setState(
        {
          customerCode: "",
        },
        () => this.searchCustomer()
      );
    } else if (newValue && newValue.hasOwnProperty('code') && newValue.code !== null) {
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
    let unitPTotal = averUnitPrice/manMonths;
    // 去掉小数部分，转换为整数
    unitPTotal = Math.floor(unitPTotal);
    // 添加千位分隔符
    unitPTotal = publicUtils.addComma(unitPTotal.toString());
    
    // 売上合計：去掉小数部分，转换为整数，并添加千位分隔符
    let grossProfitPercentFormatted = Math.floor(averUnitPrice);
    grossProfitPercentFormatted = publicUtils.addComma(grossProfitPercentFormatted.toString());
    
    const percentages = `${((averUnitPrice/allDataverUnitPrice) * 100).toFixed(2)}%`;
    let totalpercent = isAll ? '100%': percentages;
    this.setState({
        manMonths,
        grossProfitPercent : grossProfitPercentFormatted,
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
          

          // 在列表开头添加空选项，表示不筛选
          const customerListWithEmpty = [
            { code: "", name: "" },
            ...Array.from(custList)
          ];
          this.setState(
            { customerList: customerListWithEmpty },
            () => {
              console.log('111111 =>',this.state.customerList);
            }
          );
          
          // 按照稼働人数（countPeo）从大到小排序
          const sortedList = [...response.data.bpInfoList].sort((a, b) => {
            const countPeoA = Number(a.countPeo) || 0;
            const countPeoB = Number(b.countPeo) || 0;
            return countPeoB - countPeoA; // 从大到小排序
          });

          // 为每行添加rowNo，从1开始累加
          const listWithRowNo = sortedList.map((item, index) => ({
            ...item,
            rowNo: index + 1
          }));

          this.setState(
            { allData: listWithRowNo },
            () => {
              this.displayInfo()
            }
          );

          this.setState({ errorsMessageShow: false });
          this.setState({ CustomerSaleslListInfoList: listWithRowNo });
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
    if (!cell) return null;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cell;
    const text = tempDiv.textContent || cell;
    
    const pattern = /(\d+\([^)]+\))/g;
    const matches = text.match(pattern);
    
    if (!matches || matches.length === 0) {
      return <span dangerouslySetInnerHTML={{ __html: cell }} />;
    }
    
    const rows = [];
    for (let i = 0; i < matches.length; i += 3) {
      const rowItems = matches.slice(i, i + 3);
      rows.push(
        <div key={i} style={{ marginBottom: i + 3 < matches.length ? '4px' : '0', lineHeight: '1.4' }}>
          {rowItems.join(' ')}
        </div>
      );
    }
    
    return <div style={{ whiteSpace: 'normal' }}>{rows}</div>;
  }


  customerNameFormat = (cell, row) => {
    const displayText = row.levelName ? `${cell}(${row.levelName})` : cell;
    return <span title={displayText}>{displayText}</span>;
  };

  handleRowSelect = (row, isSelected, e) => {
    console.log('handleRowSelect=>',isSelected)

    if (isSelected) {
      // 单选模式：只保存当前选中的一行
      this.curAllData = [row];
      this.displayInfo(false);
    } else {
      // 取消选中：清空选中的数据
      this.curAllData = [];
      this.displayInfo(true);
    }
  };

  render() {
    const { errorsMessageValue } = this.state;
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
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
        <br />
        <Row>
          <Col sm={3}>
            <InputGroup size="sm"  className="mb-3 flexWrapNoWrap">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                  年月
                </InputGroup.Text>
              </InputGroup.Prepend>
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
            </InputGroup>
          </Col>

          <Col sm={3}>
            <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
              <InputGroup.Prepend>
                <InputGroup.Text style={{ width: "90px" }}>お客様名</InputGroup.Text>
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
                if (option.code === "" && option.name === "") {
                  return (
                    <div style={{ padding: "8px 14px", minHeight: "24px", display: "flex", alignItems: "center" }}>
                      {option.name || ""}
                    </div>
                  );
                }
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
          <Col sm={3}>
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

          <Col sm={3}>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text
                  id="inputGroup-sizing-sm"
                  className="input-group-indiv"
                  style={{ width: "90px" }}
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
                  style={{ width: "90px" }}
                >
                  全体比率
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.totalpercent} disabled />
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
              width="30"
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
              width="50"
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
