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
class sendInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.searchEmployee = this.searchSendInvoiceList.bind(this);
	};
	
	getLoginUserInfo = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
			.then(result => {
				this.setState({
					loginUserInfo: result.data,
					authorityCode: result.data[0].authorityCode,
				})
			})
			.catch(function(error) {
				//alert(error);
			});
	}
	
	componentDidMount(){
    	this.getLoginUserInfo();

		/*axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
		.then(result => {
			this.setState({
				
			})
		})
		.catch(function(error) {
			//alert(error);
		});	*/
		this.searchSendInvoiceList();
	}
	//　初期化データ
	initialState = {
		yearAndMonth: new Date(),//new Date(new Date().getMonth() === 0 ? (new Date().getFullYear() - 1) + "/12" : new Date().getFullYear() + "/" + new Date().getMonth()).getTime(),
		month: new Date().getMonth() + 1,
		loginUserInfo: [],
		sendInvoiceList: [],
		rowCustomerNo: "",
		rowCustomerName: "",
		rowPurchasingManagers: "",
		rowEmployeeList: [],
		sendFlag: false,
		loading: true,
        customerAbbreviationList: store.getState().dropDown[73].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};

	//　検索
	searchSendInvoiceList = () => {
		const emp = {
				yearAndMonth: publicUtils.formateDate($("#datePicker").val(), false),
				customerNo: this.state.customerNo,
			};
		axios.post(this.state.serverIP + "sendInvoice/selectSendInvoice",emp)
		.then(result => {
			this.setState({
				sendInvoiceList: result.data,
				rowCustomerNo: "",
			})
			this.refs.table.setState({
				selectedRowKeys: []
			});
		})
		.catch(function(error) {
			//alert(error);
		});	
	}
    
	//　年月
	inactiveYearAndMonth = (date) => {
		this.setState({
			yearAndMonth: date,
			month: date.getMonth() + 1,
		});
		$("#datePicker").val(date);
		this.refs.table.setState({
			selectedRowKeys: []
		});
		this.searchSendInvoiceList();
	};
	
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState({
				rowCustomerNo: row.customerNo,
				rowCustomerName: row.customerName,
				rowPurchasingManagers: row.purchasingManagers,
				rowEmployeeList: row.sendInvoiceWorkTimeModel,
				sendFlag: row.havePDF === "false",
			});
		} else {
			this.setState({
				rowCustomerNo: "",
				rowCustomerName: "",
				rowPurchasingManagers: "",
				rowEmployeeList: [],
				sendFlag: true,
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
            case "invoicePDF":
            	path = {
                    pathname: '/subMenuManager/invoicePDF',
                    state: {
                        backPage: "sendInvoice", 
                        customerNo: this.state.rowCustomerNo,
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
	
    /**
     * 社員名連想
     * @param {} event 
     */
    getCustomer = (event, values) => {
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            let customerNo = null;
            if (values !== null) {
                customerNo = values.code;
            }
            this.setState({
                customerNo: customerNo,
                customerAbbreviation: customerNo,
            },() => {
            	this.searchSendInvoiceList();
            })
        })
    }
    
    payOffRangeFormat = (cell,row) => {
    	let payOffRange = "";
    	if(row.payOffRange1 == 0 || row.payOffRange1 == 1)
    		payOffRange = row.payOffRange1 == 0 ? "固定" : "出勤日";
    	else
    		payOffRange = row.payOffRange1 + "-" + row.payOffRange2;
    	return payOffRange;
    }
    
    unitPriceFormat = (cell,row) => {
    	if(row.unitPrice === null || row.unitPrice === "" || row.unitPrice === "0")
    		return "";
    	else	
    		return ("￥" + publicUtils.addComma(row.unitPrice));
    }
    
    costFormat = (cell,row) => {
    	if(row.deductionsAndOvertimePayOfUnitPrice === null || row.deductionsAndOvertimePayOfUnitPrice === "" || row.deductionsAndOvertimePayOfUnitPrice === "0")
    		return "";
    	else	
    		return ("￥" + publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice));
    }
    
    sendLetter = () => {
        var a = window.confirm("送信してよろしいでしょうか？");

        if(a){
        	let model;
        	let sendInvoiceList = this.state.sendInvoiceList;
        	let employeeList = this.state.rowEmployeeList;
        	let employee = "";
        	for(let i in employeeList){
        		employee += employeeList[i].employeeName + "、";
        	}
        	if(employee.length > 0)
        		employee = employee.substring(0,employee.length - 1);
        	let mailConfirmContont = this.state.rowCustomerName + `株式会社` + `
` + (this.state.rowPurchasingManagers === "" ? "" : this.state.rowPurchasingManagers + `様`) + `

いつもお世話になっております。ＬＹＣの` + this.state.loginUserInfo[0].employeeFristName + `でございます。

弊社` + employee + (this.state.yearAndMonth.getMonth() + 1) + `月分請求書類（見積書と注文書）を添付にてご送付致します。

お手数ですが、ご確認お願い致します。
＊ファイルの解凍パスワードは弊社の略称（3小文字）と現在の西暦4文字です。

引き続き何卒よろしくお願い申し上げます。
----------------------------------------
LYC株式会社　
事務担当　宋（ソウ）/唐（トウ）/莫（バク）
〒101-0032　東京都千代田区岩本町3-3-3　サザンビル3階
URL:http://www.lyc.co.jp/
TEL:03-6908-5796 
E-mail: zoeywu@lyc.co.jp 　共通mail：eigyou@lyc.co.jp
P-mark:第21004525(02)号
労働者派遣事業許可番号　派13-306371
`;
        	
        	for(let i in sendInvoiceList){
        		if(sendInvoiceList[i].customerNo === this.state.rowCustomerNo){
        			
        			model = {
        					yearAndMonth: publicUtils.formateDate($("#datePicker").val(), false),
        					customerAbbreviation: sendInvoiceList[i].customerAbbreviation,
        					mail: sendInvoiceList[i].purchasingManagersMail,
        					purchasingManagers: sendInvoiceList[i].purchasingManagers,
        					customerNo: sendInvoiceList[i].customerNo,
        					customerName: sendInvoiceList[i].customerName,
        					mailFrom: this.state.loginUserInfo[0].companyMail,
        					mailConfirmContont: mailConfirmContont,
        					mailTitle: (this.state.yearAndMonth.getMonth() + 1) + "月分請求書類",
        					nowDate: String(new Date().getFullYear()) + String(new Date().getMonth() + 1) + String(new Date().getDate())
        			}
        		}
        	}

    		axios.post(this.state.serverIP + "sendInvoice/sendLetter",model)
    		.then(result => {
    			this.searchSendInvoiceList();
    		})
        }
    }
    
    sendLetterStatusFormat = (cell) => {
    	if(cell === "1"){
    		return "送信済み";
    	}else{
    		return "未送信";
    	}
    }
	
    employeeListFormat = (cell,row) => {
        let returnItem = cell;
        const options = {
            noDataText: (<i className="" style={{ 'fontSize': '20px' }}>データなし</i>),
            expandRowBgColor: 'rgb(165, 165, 165)',
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
        };
        const selectRow = {
                mode: 'radio',
                bgColor: 'pink',
                hideSelectColumn: true,
                clickToSelect: true,
                clickToExpand: true,
            };
        returnItem = 
        <OverlayTrigger
            trigger="click"
            placement={"left"}
            overlay={
            <Popover className="popoverC">
                <Popover.Content >
                <div>
                    <Row>
						<Col style={{"padding": "0px","marginTop": "10px"}}>
							<h2>要員確認</h2>
						</Col>
					</Row>
					<Row>
		                    <BootstrapTable
		                        pagination={false}
		                        options={options}
		                        data={row.sendInvoiceWorkTimeModel}
		                		selectRow={selectRow}
		                        headerStyle={{ background: '#5599FF' }}
		                    	striped hover condensed >
		                        <TableHeaderColumn isKey={true} width='10%'　dataField='rowNo' tdStyle={{ padding: '.45em' }}>
		                        番号</TableHeaderColumn>
		                        <TableHeaderColumn dataField='employeeName' width='18%' tdStyle={{ padding: '.45em' }}>
		                        氏名</TableHeaderColumn>
		                        <TableHeaderColumn dataField='payOffRange' width='18%' dataFormat={this.payOffRangeFormat} tdStyle={{ padding: '.45em' }}>
		                        基準時間</TableHeaderColumn>
		                        <TableHeaderColumn dataField='sumWorkTime' width='18%' tdStyle={{ padding: '.45em' }}>
		                        稼働時間</TableHeaderColumn>
		                        <TableHeaderColumn dataField='unitPrice' dataFormat={this.unitPriceFormat} width='18%' tdStyle={{ padding: '.45em' }}>
		                        単価</TableHeaderColumn>
		                        <TableHeaderColumn dataField='cost' dataFormat={this.costFormat} width='18%' tdStyle={{ padding: '.45em' }}>
		                        残業・控除</TableHeaderColumn>
		                    </BootstrapTable>
					</Row>
                </div>
                </Popover.Content>
            </Popover>
            }
        >
        <div>
        	<Button variant="warning" size="sm" >要員</Button>
        </div>
      </OverlayTrigger>
      if(row.sendInvoiceWorkTimeModel.length > 0)
    	  return (<div>{returnItem}</div>);
      else 
    	  return "";
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
			sizePerPage: 12,  // which size per page you want to locate as default
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
									<h2>請求書一覧</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-2">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
												selected={this.state.yearAndMonth}
												onChange={this.inactiveYearAndMonth}
												autoComplete="off"
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												maxDate={new Date()}
												id="datePicker"
												className="form-control form-control-sm"
											/>
										</InputGroup.Prepend>
					                </InputGroup>
								</Col>
								<Col sm={3} style={{ marginLeft: "-80px" }}>
			                        <InputGroup size="sm" className="mb-3">
			                            <InputGroup.Prepend>
			                                <InputGroup.Text id="sanKanji">お客様</InputGroup.Text>
			                            </InputGroup.Prepend>
			                            <Autocomplete
			                                id="customerAbbreviation"
			                                name="customerAbbreviation"
			                                value={this.state.customerAbbreviationList.find(v => v.code === this.state.customerAbbreviation) || ""}
			                                options={this.state.customerAbbreviationList}
			                                getOptionLabel={(option) => option.text ? option.text : ""}
			                                onChange={(event, values) => this.getCustomer(event, values)}
			                                renderOption={(option) => {
			                                    return (
			                                        <React.Fragment>
			                                            {option.name}
			                                        </React.Fragment>
			                                    )
			                                }}
			                                renderInput={(params) => (
			                                    <div ref={params.InputProps.ref}>
			                                        <input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-dutyManagement"
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
				<div >
                    <Row>
						<Col sm={12}>
                            <Button size="sm" variant="info" onClick={this.shuseiTo.bind(this, "dutyManagement")}>勤務管理</Button>{' '}
							<Button size="sm" name="clickButton" variant="info" onClick={this.shuseiTo.bind(this, "customer")} disabled={this.state.rowCustomerNo === ""}>お客様情報</Button>{' '}

                            <div style={{ "float": "right" }}>
		                        <Button variant="info" size="sm" onClick={this.shuseiTo.bind(this, "invoicePDF")} disabled={this.state.rowCustomerNo === ""}>請求書確認</Button>{' '}
	                            <Button variant="info" size="sm" onClick={this.sendLetter} disabled={this.state.sendFlag || this.state.rowCustomerNo === "" || Number(String(this.state.yearAndMonth.getFullYear()) + (this.state.yearAndMonth.getMonth() + 1)) < Number(String(new Date().getFullYear()) + new Date().getMonth())}>送信</Button>{' '}
	 						</div>
						</Col>  
                    </Row>
                    <Col>
						<BootstrapTable data={sendInvoiceList} ref='table' selectRow={selectRow} pagination={true} options={options} approvalRow headerStyle={ { background: '#5599FF'} } striped hover condensed >
							<TableHeaderColumn width='5%'　tdStyle={ { padding: '.45em' } } dataField='rowNo' isKey>番号</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={ { padding: '.45em' } } dataField='customerNo' >お客様番号</TableHeaderColumn>
							<TableHeaderColumn width='24%' tdStyle={ { padding: '.45em' } } dataField='customerName' >お客様</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={ { padding: '.45em' } } dataField='purchasingManagers' >担当者</TableHeaderColumn>
							<TableHeaderColumn width='22%' tdStyle={ { padding: '.45em' } } dataField='purchasingManagersMail' >メール</TableHeaderColumn>
							<TableHeaderColumn width='7%' tdStyle={ { padding: '.45em' } }  dataField='employeeList' dataFormat={this.employeeListFormat.bind(this)} >関連要員</TableHeaderColumn>
							<TableHeaderColumn width='18%' tdStyle={ { padding: '.45em' } }  dataField='sendLetterDate' >送信日付</TableHeaderColumn>
							<TableHeaderColumn width='12%' tdStyle={ { padding: '.45em' } }  dataField='sendLetterStatus' dataFormat={this.sendLetterStatusFormat.bind(this)}>送信ステータス</TableHeaderColumn>
						</BootstrapTable>
					</Col>  
				</div>
		         <div className='loadingImage' hidden={this.state.loading} style = {{"position": "absolute","top":"60%","left":"60%","margin-left":"-200px", "margin-top":"-150px",}}></div>
			</div >
		);
	}
}
export default sendInvoice;