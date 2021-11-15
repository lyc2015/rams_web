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
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
		.then(result => {
			this.setState({
				authorityCode: result.data[0].authorityCode,
			})
		})
		.catch(function(error) {
			//alert(error);
		});	
		this.searchSendInvoiceList();
	}
	//　初期化データ
	initialState = {
		yearAndMonth: new Date(),
		month: new Date().getMonth() + 1,
		sendInvoiceList: [],
		rowCustomerNo: "",
		invoiceNo: "",
		loading: true,
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
		/*const emp = {
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
		});	*/
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
												id="datePicker"
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
									<Form.Control type="text" value={this.state.customerName} name="customerName" autoComplete="off" size="sm" disabled />
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
									<Form.Control type="text" style={{width:"8rem"}} value={this.state.invoiceNo} name="invoiceNo" autoComplete="off" size="sm" onChange={this.valueChange} />
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
									<Form.Control type="text" value={this.state.customerName} name="customerName" autoComplete="off" size="sm" disabled />
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
										selected={this.state.yearAndMonth}
										onChange={this.inactiveYearAndMonth}
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
                            <Button size="sm" variant="info" >作業時間表示</Button>{' '}

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
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='customerName'>{<div><Row><font>作業内容(作業者)</font></Row><Row><font>作業期間</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='customerName'>単位</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='customerName'>数量</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='customerName'>単価</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='customerName'>{<div><Row><font>下限時間</font></Row><Row><font>単価</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='customerName'>{<div><Row><font>上限時間</font></Row><Row><font>単価</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='customerName'>請求額</TableHeaderColumn>
						</BootstrapTable>
					</Col>  
				</div>
		         <div className='loadingImage' hidden={this.state.loading} style = {{"position": "absolute","top":"60%","left":"60%","margin-left":"-200px", "margin-top":"-150px",}}></div>
			</div >
		);
	}
}
export default invoicePDF;