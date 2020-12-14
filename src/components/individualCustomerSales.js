import React, { Component } from 'react';
import { Row, Col, InputGroup, Button, FormControl, Popover, OverlayTrigger, Table } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
axios.defaults.withCredentials = true;

class IndividualCustomerSales extends React.Component {
    state = {
        fiscalYear: '',
        customerName: '',
        totalworkPeoSum:'',
    }
    constructor(props) {
        super(props);
        this.state = this.initialState;//初期化
        this.options = {
            sizePerPage: 12,
            pageStartIndex: 1,
            paginationSize: 2,
            prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            hideSizePerPage: true,
            alwaysShowAllBtns: true,
            paginationShowsTotal: this.renderShowsTotal,
        }
        
    }
    componentDidMount() {
        var date = new Date();
        var year = date.getFullYear();
        $('#fiscalYear').append('<option value="">' + "" + '</option>');
        for (var i = 2019; i <= year; i++) {
            $('#fiscalYear').append('<option value="' + i + '">' + i + '</option>');
        }
    }
    initialState = {
        customerInfo: store.getState().dropDown[53].slice(1),
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
        customerName:'',
        individualCustomerSales_startYearAndMonth:'',
        individualCustomerSales_endYearAndMonth:'',
        fiscalYear:'',
    }
    yearAndMonthChange = event => {
        if(this.state.customerName!==''){          
            this.setState({ individualCustomerSales_endYearAndMonth: '' })
            this.setState({ individualCustomerSales_startYearAndMonth: '' })
            this.setState({
                [event.target.name]: event.target.value
            },()=>this.searchCustomer())
        }
        else{
            this.setState({ individualCustomerSales_endYearAndMonth: '' })
            this.setState({ individualCustomerSales_startYearAndMonth: '' })
            this.setState({
                [event.target.name]: event.target.value
            })
        }
       

    }

    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })

    }
    individualCustomerSalesStartYearAndMonthChange = date => {
        if(this.state.customerName!==''&&this.state.individualCustomerSales_endYearAndMonth!==''){
        if (date !== null) {
            this.setState({
                individualCustomerSales_startYearAndMonth: date,
                fiscalYear: '',
            },()=>this.searchCustomer());
        } else {
            this.setState({
                individualCustomerSales_startYearAndMonth: '',
            });
        }
    }else{
        if (date !== null) {
            this.setState({
                individualCustomerSales_startYearAndMonth: date,
                fiscalYear: '',
            });
        } else {
            this.setState({
                individualCustomerSales_startYearAndMonth: '',
            });
        }

    }


    };

    individualCustomerSalesEndYearAndMonthChange = date => {
        if(this.state.customerName!==''&&this.state.individualCustomerSales_startYearAndMonth!==''){
            if (date !== null) {
                this.setState({
                    individualCustomerSales_endYearAndMonth: date,
                    fiscalYear: '',
                },()=> this.searchCustomer());
           
            }else{
                this.setState({
                    individualCustomerSales_endYearAndMonth: '',
                });
            }          
        } else {
            if (date !== null) {
                this.setState({
                    individualCustomerSales_endYearAndMonth: date,
                    fiscalYear: '',
                });
            }
                else{
                    this.setState({
                        individualCustomerSales_endYearAndMonth: '',
                    });
                }
            
        }

    };

    handleTag = (event, values) => {
        if(this.state.fiscalYear!==''||(this.state.individualCustomerSales_startYearAndMonth!==''&&this.state.individualCustomerSales_endYearAndMonth!=='')){
            if (values != null) {
                this.setState({
                    customerName: values.code,
                },()=>this.searchCustomer())
    
            } else {
                this.setState({
                    customerName: '',
                })
            }
        }else{
        if (values != null) {
            this.setState({
                customerName: values.code,
            })

        } else {
            this.setState({
                customerName: '',
            })
        }
    }
    }

    searchCustomer = () => {
        const customerInfo = {
            customerName: this.state.customerName,
            fiscalYear: this.state.fiscalYear,
            startYear: publicUtils.formateDate(this.state.individualCustomerSales_startYearAndMonth, false),
            endYear: publicUtils.formateDate(this.state.individualCustomerSales_endYearAndMonth, false),

        };
        axios.post(this.state.serverIP + "customerSales/searchCustomerSales", customerInfo)
            .then(response => {
                if (response.data.errorsMessage != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
                } else if (response.data.noData != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.noData });
                    this.setState({ CustomerSaleslListInfoList:[]});
                    // this.setState({workMonthCount:''})
                    // this.setState({unitPriceTotal:''})
                    // this.setState({paymentTotal:''})
                    // this.setState({totalgrosProfits:''})
                }
                else {
                     this.setState({ "errorsMessageShow": false })
                     this.setState({ CustomerSaleslListInfoList: response.data.data })
                     this.setState({ totalworkPeoSum: this.state.CustomerSaleslListInfoList[0].totalworkPeoSum })
                    // this.feeTotal();
                    // this.unitPriceTotalCal(response.data.data);
                }
            }).catch((error) => {
                console.error("Error - " + error);
            });
    }

    grossProfitAddComma(cell ,row){
        if(row. grossProfit===null||row. grossProfit==="0"){
            return 
        }else{
         let formatmGrosProfits = publicUtils.addComma(row. grossProfit,false)
         return formatmGrosProfits;
        }
    }

    totalAmountAddComma(cell ,row){
        if(row. totalAmount===null||row. totalAmount==="0"){
            return 
        }else{
         let formattotalAmount = publicUtils.addComma(row. totalAmount,false)
         return formattotalAmount;
        }
    }

    totalUnitPriceFormat(cell,row){
        if(row. totalUnitPrice===null||row. totalUnitPrice==="0"){
            return 
        }else{
            let formatTotalUnitPrice = row.totalUnitPrice+"万円"
         return formatTotalUnitPrice;
        }
    }

    maxUnitPriceFormat(cell,row){
        if(row. maxUnitPrice===null||row. maxUnitPrice==="0"){
            return 
        }else{
            let formatTotalUnitPrice = row. maxUnitPrice.split('.')[0];
            formatTotalUnitPrice = formatTotalUnitPrice+"万円"
         return formatTotalUnitPrice;
        } 
    }

    minUnitPriceFormat(cell,row){
        if(row. minUnitPrice===null||row. minUnitPrice==="0"){
            return 
        }else{
            let formatTotalUnitPrice = row. minUnitPrice.split('.')[0];
            formatTotalUnitPrice = formatTotalUnitPrice+"万円"
         return formatTotalUnitPrice;
        }  
    }

    averUnitPriceFormat(cell ,row){
        if(row. averUnitPrice===null||row. averUnitPrice==="0"||row. averUnitPrice===NaN){
            return 
        }else{
            let averageUnitP ;
            let formatTotalUnitPrice = row. averUnitPrice.split('.')[1];
            if(formatTotalUnitPrice!=="0"){
                averageUnitP= row. averUnitPrice+"万円"
            }
            else{
                averageUnitP= row. averUnitPrice.split('.')[0]+"万円"
            }
         return averageUnitP;
        } 
    }

    workPeoSumFormat(cell ,row){
        if(row.workPeoSum===null||row.workPeoSum==="0"){
            return
        }
        else{
            return row.workPeoSum;
        }
    }

    overTimeFeeAddComma(cell,row){
        if(row.overTimeFee===null||row.overTimeFee==="0"){
            return
        }
        else{
            let formatoverTimeFee = publicUtils.addComma(row. overTimeFee,false)
            return formatoverTimeFee;
        }
    }
    expectFeeAddComma(cell,row){
        if(row.expectFee===null||row.expectFee==="0"){
            return
        }
        else{
            let formatexpectFee = publicUtils.addComma(row. expectFee,false)
            return formatexpectFee;
        }
    }

    empDetailCheck=(cell,row)=>{

        let returnItem = cell;
        const options = {
            noDataText: (<i className="" style={{ 'fontSize': '20px' }}>データなし</i>),
            expandRowBgColor: 'rgb(165, 165, 165)',
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
            expandRowBgColor: 'rgb(165, 165, 165)',
        };
        returnItem = 
        <OverlayTrigger 
            trigger="focus"
            placement={"left"}
            overlay={
            <Popover className="popoverC">
                <Popover.Content >
                <div >
                    <BootstrapTable 
                        pagination={false}
                        options={options}
                        data={row.empDetail}
                        headerStyle={{ background: '#5599FF' }}
                        striped
                        hover
                        condensed>
                        <TableHeaderColumn isKey={true} dataField='employeeName'tdStyle={{ padding: '.45em' }} width="30%">
                        氏名</TableHeaderColumn>
                        <TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }}>
                        役割</TableHeaderColumn>
                        <TableHeaderColumn dataField='stationName'tdStyle={{ padding: '.45em' }} width="30%" >
                        現場先</TableHeaderColumn>
                        <TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }}>
                        単価(万)</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                </Popover.Content>
            </Popover>
            }
        >
        <Button variant="warning" size="sm" className="empCheck">要員確認</Button>
      </OverlayTrigger>
        return returnItem;
    }
   

    render() {
        const { errorsMessageValue, customerInfo,totalworkPeoSum } = this.state;
        return (

            <div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <Row inline="true">
                    <Col className="text-center">
                        <h2>お客様個別売上</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">年度</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="fiscalYear" name="fiscalYear" value={this.state.fiscalYear} as="select" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.yearAndMonthChange.bind(this)} />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <p id="individualCustomerSalesErrmsg" style={{ visibility: "hidden" }} class="font-italic font-weight-light text-danger"></p>
                    </Col>
                </Row>
                <Row>
                    <Col >
                        <InputGroup size="sm" >
                            <InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text></InputGroup.Prepend>
                            <Autocomplete
                                id="customerName"
                                name="customerName"
                                options={customerInfo}
                                getOptionLabel={(option) => option.name}
                                value={customerInfo.find(v => v.code === this.state.customerName) || {}}
                                onChange={(event, values) => this.handleTag(event, values)}
                                renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                        <input placeholder="  お客様名" type="text" {...params.inputProps} className="auto"
                                            style={{ width: 140, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
                                    </div>
                                )}
                            />
                            <font color="red" style={{ marginLeft: "15px" }}>★</font>
                            <InputGroup.Prepend style={{ marginLeft: "30px" }}>
                                <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
                                    selected={this.state.individualCustomerSales_startYearAndMonth}
                                    onChange={this.individualCustomerSalesStartYearAndMonthChange}
                                    dateFormat={"yyyy MM"}
                                    autoComplete="off"
                                    locale="pt-BR"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="personalsalesSearchDatePicker"
                                    dateFormat={"yyyy/MM"}
                                    name="individualCustomerSales_startYearAndMonth"
                                    locale="ja" />
                                <font id="mark">～</font><DatePicker
                                    selected={this.state.individualCustomerSales_endYearAndMonth}
                                    onChange={this.individualCustomerSalesEndYearAndMonthChange}
                                    dateFormat={"yyyy MM"}
                                    autoComplete="off"
                                    locale="pt-BR"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="personalsalesSearchBackDatePicker"
                                    dateFormat={"yyyy/MM"}
                                    name="individualCustomerSales_endYearAndMonth"
                                    locale="ja" />
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                    <Col sm={3}>
                        <label>取引人数：</label>
                                <label>{totalworkPeoSum}</label>
                    </Col>

                    <Col sm={3}>
                        <label>単価合計：</label>
                        <label> </label>
                    </Col>
                    <Col sm={3}>
                        <label>売上合計：</label>
                        <label> </label>
                    </Col>
                    <Col sm={3}>
                        <label>粗利合計：</label>
                        <label> </label>
                    </Col>
                </Row>
                <div >
                    <BootstrapTable data={this.state.CustomerSaleslListInfoList} pagination={true} headerStyle={{ background: '#5599FF' }} options={this.options} striped hover condensed >
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='yearAndMonth' isKey>年月</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='totalUnitPrice' dataFormat={this.totalUnitPriceFormat}>単価合計</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='maxUnitPrice'　dataFormat={this.maxUnitPriceFormat}>最高単価</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='minUnitPrice' dataFormat={this.minUnitPriceFormat}>最低単価</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='averUnitPrice'dataFormat={this.averUnitPriceFormat} >平均単価</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='workPeoSum'dataFormat={this.workPeoSumFormat}>稼働人数</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='empDetailCheck'  dataFormat={this.empDetailCheck.bind(this)}>要員確認</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='overTimeFee' dataFormat={this.overTimeFeeAddComma}>残業代</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='expectFee' dataFormat={this.expectFeeAddComma}>控除</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='totalAmount' dataFormat={this.totalAmountAddComma}>コスト合計</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='grossProfit' dataFormat={this.grossProfitAddComma}>粗利</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}
export default IndividualCustomerSales;