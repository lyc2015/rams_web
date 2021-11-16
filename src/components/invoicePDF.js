import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl, OverlayTrigger, Popover } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUpload, faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import MyToast from './myToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import store from './redux/store';
registerLocale("ja", ja);
axios.defaults.withCredentials = true;

/**
 * 社員勤務管理画面
 */
class invoicePDF extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.searchEmployee = this.searchSendInvoiceList.bind(this);
		this.valueChange = this.valueChange.bind(this);
	};
	componentDidMount(){
        this.setState({
            customerNo: this.props.location.state.customerNo,
            customerName: this.state.customerNameList.find(v => v.code === this.props.location.state.customerNo).text,
            customerAbbreviation: this.state.customerAbbreviationList.find(v => v.code === this.props.location.state.customerNo).text,
        }, () => {
    		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
    		.then(result => {
    			this.setState({
    				authorityCode: result.data[0].authorityCode,
    			})
    		})
    		.catch(function(error) {
    			//alert(error);
    		});
    		
    		axios.post(this.state.serverIP + "subMenu/getCompanyDate")
    		.then(response => {
    				this.setState({
    					taxRate: response.data.taxRate,
    				})
    		}).catch((error) => {
    			console.error("Error - " + error);
    		});

    		this.searchSendInvoiceList();
        })
	}
	//　初期化データ
	initialState = {
		yearAndMonth: new Date(),
		yearAndMonthFormat: String(new Date().getFullYear()) + ((new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)),
		sendInvoiceList: [],
		rowCustomerNo: "",
		invoiceNo: "",
		workTimeFlag: false,
		loading: true,
		bankInfoDetail: `振込先銀行　りそな銀行　秋葉原支店
普通預金
店番 　２７５
口座番号 ２０６８５０５
口座名　エルワイシー（カ）`,
        customerNameList: store.getState().dropDown[53].slice(1),
        customerAbbreviationList: store.getState().dropDown[73].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	
	// onChange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	//　検索
	searchSendInvoiceList = () => {
		const emp = {
				yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
				customerNo: this.state.customerNo,
			};
		axios.post(this.state.serverIP + "sendInvoice/selectSendInvoice",emp)
		.then(result => {
			if(result.data.length > 0){
				let subTotalAmount = 0;
				for(let i in result.data[0].sendInvoiceWorkTimeModel){
					subTotalAmount += Number(result.data[0].sendInvoiceWorkTimeModel[i].unitPrice) * 1 + Number(result.data[0].sendInvoiceWorkTimeModel[i].deductionsAndOvertimePayOfUnitPrice);
				}
				this.setState({
					sendInvoiceList: result.data[0].sendInvoiceWorkTimeModel,
					rowCustomerNo: "",
					subTotalAmount: publicUtils.addComma(subTotalAmount),
					consumptionTax: publicUtils.addComma(subTotalAmount * this.state.taxRate),
					totalAmount: publicUtils.addComma(subTotalAmount + subTotalAmount * this.state.taxRate),
				})
			}
		})
		.catch(function(error) {
			//alert(error);
		});	
		
		let month = this.state.yearAndMonth.getMonth() + 1;
    	this.setState({
    		invoiceNo: this.state.customerAbbreviation + "-LYC " + this.state.yearAndMonth.getFullYear() + (Number(month) < 10 ? "0" + month : month),
    	})
	}
    
	//　年月
	inactiveYearAndMonth = (date) => {
		this.setState({
			yearAndMonth: date,
		}, () => {

		});
	};
	
	inactiveDeadLine = (date) => {
		this.setState({
			deadLine: date,
		});
	};
	
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState({
				rowCustomerNo: row.customerNo,
			});
		} else {
			this.setState({
				rowCustomerNo: "",
			});
		}	
	}
	
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = {

		};
		switch (actionType) {
			case "dutyManagement":
				path = {
					pathname: '/subMenuManager/dutyManagement',
					state: {
						backPage: "sendInvoice",
						sendValue: sendValue,
					},
				}
				break;
            case "customer":
                path = {
                    pathname: '/subMenuManager/customerInfo',
                    state: {
                        actionType: 'update',
                        customerNo: this.state.rowCustomerNo,
                        backPage: "sendInvoice", 
                        sendValue: sendValue,
                    },
                }
                break;
			default:
		}
		this.props.history.push(path);
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
	
	employeeNameFormat = (cell,row) => {
		return (<div><Row><font>{row.systemName === null || row.systemName === "" ? cell : row.systemName + "(" + cell + ")"}</font></Row><Row><div><font>{this.state.yearAndMonthFormat + "01~" + this.state.yearAndMonthFormat + "31"}</font><font style={{ "float": "right" }}>{(this.state.workTimeFlag ? row.sumWorkTime + "H" : "")}</font></div></Row></div>);
	}
	
	manMonthFormat  = () => {
		return "人月";
	}
	
	unitPriceFormat = (cell,row) => {
		if(row.unitPrice === null || row.unitPrice === "" || row.unitPrice === "0")
    		return "";
    	else	
    		return ("￥" + publicUtils.addComma(row.unitPrice));
	}
	
	lowerLimitFormat = (cell,row) => {
		let payOffRange = "";
    	if(row.payOffRange1 == 0 || row.payOffRange1 == 1)
    		payOffRange = row.payOffRange1 == 0 ? "固定" : "出勤日";
    	else
    		payOffRange = row.payOffRange1 + "H";
		return (<div><Row><font>{payOffRange}</font></Row><Row><font>{Number(row.deductionsAndOvertimePayOfUnitPrice) < 0 ? ("￥" + publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice)) : ""}</font></Row></div>);
	}
	
	upperLimitFormat = (cell,row) => {
		let payOffRange = "";
    	if(row.payOffRange2 == 0 || row.payOffRange2 == 1)
    		payOffRange = row.payOffRange2 == 0 ? "固定" : "出勤日";
    	else
    		payOffRange = row.payOffRange2 + "H";
		return (<div><Row><font>{payOffRange}</font></Row><Row><font>{Number(row.deductionsAndOvertimePayOfUnitPrice) > 0 ? ("￥" + publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice)) : ""}</font></Row></div>);
	}
	
	billingAmountFormat = (cell,row) => {
		let billingAmount = Number(row.unitPrice) * 1 + Number(row.deductionsAndOvertimePayOfUnitPrice);
		return ("￥" + publicUtils.addComma(billingAmount));
	}
	
	workTimeFlagChange = () => {
		this.setState({
			workTimeFlag: !this.state.workTimeFlag,
		});
	}
	
	render() {
		const {sendInvoiceList} = this.state;
		//　テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		//　 テーブルの定義
		const options = {
			page: 1, 
			sizePerPage: 3,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
			expandRowBgColor: 'rgb(165, 165, 165)',
			approvalBtn: this.createCustomApprovalButton,
			onApprovalRow: this.onApprovalRow,
			handleConfirmApprovalRow: this.customConfirm,
		};
		const cellEdit = {
				mode: 'click',
				blurToSave: true
			};
		return (
			<div>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.message} type={"success"} />
				</div>
				<Form >
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
								<Col sm={12}>
	                            <div style={{ "float": "right" }}>
									<InputGroup size="sm" className="mb-2">
										<InputGroup.Prepend>
											<InputGroup.Text id="fourKanji">請求日</InputGroup.Text>
											<DatePicker
												selected={this.state.yearAndMonth}
												onChange={this.inactiveYearAndMonth}
												autoComplete="off"
												locale="ja"
												dateFormat="yyyy/MM/dd"
												id="datePicker-invoice"
												className="form-control form-control-sm"
											/>
										</InputGroup.Prepend>
					                </InputGroup>
								</div>
								</Col>
	                        </Row>
	                        <Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-2">
									<Form.Control type="text" value={this.state.customerName} name="customerName" autoComplete="off" size="sm" />
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">御中</InputGroup.Text>
									</InputGroup.Prepend>
				                </InputGroup>
							</Col>
							<Col sm={10}>
                            <div style={{ "float": "right" }}>
								<InputGroup size="sm" className="mb-2">
									<InputGroup.Prepend>
										<InputGroup.Text id="fourKanji">請求番号</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="text" style={{width:"12rem"}} value={this.state.invoiceNo} name="invoiceNo" autoComplete="off" size="sm" onChange={this.valueChange} />
				                </InputGroup>
							</div>
							</Col>
							</Row>
							<Row>
								<Col sm={9}>
								</Col>
								<Col>
								<InputGroup size="sm" className="mb-2">
									<InputGroup.Prepend>
										<font>ＬＹＣ株式会社 〒101-0032</font>
									</InputGroup.Prepend>
				                </InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-2">
									<InputGroup.Prepend>
										<InputGroup.Text id="fiveKanji">請求金額</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="text" value={this.state.totalAmount} name="totalAmount" autoComplete="off" size="sm" disabled />
				                </InputGroup>
								</Col>
								<Col sm={7}>
								</Col>
								<Col style={{marginTop :"5px"}}>
									<font>東京都千代田区岩本町3-3-3 サザンビル3階</font>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-2">
									<InputGroup.Prepend>
										<InputGroup.Text id="fiveKanji">お支払期限</InputGroup.Text>
									</InputGroup.Prepend>
									<DatePicker
										selected={this.state.deadLine}
										onChange={this.inactiveDeadLine}
										autoComplete="off"
										locale="ja"
										dateFormat="yyyy/MM/dd"
										id="datePicker"
										className="form-control form-control-sm"
									/>
				                </InputGroup>
								</Col>
								<Col sm={6}>
								</Col>
								<Col>
									<font>TEL:03-6908-5796 　 FAX: 03-6908-5741</font>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
                    <Row>
						<Col sm={12}>
                            <Button size="sm" variant="info" onClick={this.workTimeFlagChange} >{"作業時間"+ (this.state.workTimeFlag ? "非" : "") +"表示"}</Button>{' '}

                            <div style={{ "float": "right" }}>
                            	<Button variant="info" size="sm" >追加</Button>{' '}
                            	<Button variant="info" size="sm" >削除</Button>{' '}
		                        <Button variant="info" size="sm" >更新</Button>{' '}
	                            <Button variant="info" size="sm" >PDF</Button>{' '}
	 						</div>
						</Col>  
                    </Row>
                    <Col>
						<BootstrapTable data={sendInvoiceList} ref='table' selectRow={selectRow} pagination={true} options={options} approvalRow headerStyle={ { background: '#5599FF'} } striped hover condensed >
							<TableHeaderColumn dataField='rowNo' isKey hidden>番号</TableHeaderColumn>
							<TableHeaderColumn width='20%'　tdStyle={ { padding: '.45em' } } dataField='employeeName' dataFormat={this.employeeNameFormat}>{<div><Row><font>作業内容(作業者)</font></Row><Row><font>作業期間</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='8%'　tdStyle={ { padding: '.45em' } } dataField='manMonth' dataFormat={this.manMonthFormat}>単位</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='count'>数量</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='unitPrice' dataFormat={this.unitPriceFormat}>単価</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='lowerLimit' dataFormat={this.lowerLimitFormat}>{<div><Row><font>下限時間</font></Row><Row><font>単価</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='upperLimit' dataFormat={this.upperLimitFormat}>{<div><Row><font>上限時間</font></Row><Row><font>単価</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='billingAmount' dataFormat={this.billingAmountFormat}>請求額</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</div>
				<Row>
					<Col sm={3}>
					<InputGroup size="sm">
						<InputGroup.Prepend>
							<InputGroup.Text id="fourKanji">銀行情報</InputGroup.Text>
						</InputGroup.Prepend>
		            </InputGroup>
		            <InputGroup size="sm" className="mb-2">
			            <FormControl
		                    rows="5"
		                    value={this.state.bankInfoDetail}
							disabled
		                    name="bankInfoDetail"
		                    as="textarea">
						</FormControl>
		            </InputGroup>
					</Col>
					<Col sm={7}>
					</Col>
					<Col sm={2}>
					<InputGroup size="sm" className="mb-2">
						<InputGroup.Prepend>
							<InputGroup.Text id="sanKanji">小計</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control type="text" value={this.state.subTotalAmount} name="subTotalAmount" autoComplete="off" size="sm" disabled />
		            </InputGroup>
		            <InputGroup size="sm" className="mb-2">
						<InputGroup.Prepend>
							<InputGroup.Text id="sanKanji">消費税</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control type="text" value={this.state.consumptionTax} name="consumptionTax" autoComplete="off" size="sm" disabled />
		            </InputGroup>
		            <InputGroup size="sm" className="mb-2">
						<InputGroup.Prepend>
							<InputGroup.Text id="sanKanji">合計</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control type="text" value={this.state.totalAmount} name="totalAmount" autoComplete="off" size="sm" disabled />
		            </InputGroup>
					</Col>
				</Row>
				<Row>
					<Col>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="twoKanji">備考</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl
			                    rows="2"
			                    value={this.state.remark}
			                    onChange={this.valueChange}
			                    name="remark"
			                    as="textarea">
							</FormControl>
			            </InputGroup>
					</Col>
				</Row>

		         <div className='loadingImage' hidden={this.state.loading} style = {{"position": "absolute","top":"60%","left":"60%","margin-left":"-200px", "margin-top":"-150px",}}></div>
			</div >
		);
	}
}
export default invoicePDF;