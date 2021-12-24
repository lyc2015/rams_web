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
import { faEdit, faUpload, faSearch, faDownload, faSave } from '@fortawesome/free-solid-svg-icons';
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
	componentWillMount() {
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
		.then(result => {
			this.setState({
				authorityCode: result.data[0].authorityCode,
			})
		})
		.catch(function(error) {
			console.error("Error - " + error);
		});
		
		axios.post(this.state.serverIP + "sendInvoice/selectBankAccountInfo")
		.then(response => {
				this.setState({
					bankAccountInfos: response.data,
				})
		}).catch((error) => {
			console.error("Error - " + error);
		});
	}
	
	componentDidMount(){
		axios.post(this.state.serverIP + "subMenu/getCompanyDate")
		.then(response => {
				this.setState({
					taxRate: response.data.taxRate,
					consumptionTax: response.data.taxRate * 100 + "%",
				}, () => {
			        this.setState({
			            customerNo: this.props.location.state.customerNo,
			            customerName: this.state.customerNameList.find(v => v.code === this.props.location.state.customerNo).text,
			            customerAbbreviation: this.state.customerAbbreviationList.find(v => v.code === this.props.location.state.customerNo).text,
			        }, () => {
			    		this.setState({ loading: false, });
			    		this.searchSendInvoiceList();
			        })
				})
		}).catch((error) => {
			console.error("Error - " + error);
		});
	}
	//　初期化データ
	initialState = {
		yearAndMonth: new Date(),
		invoiceDate: new Date(),
		yearAndMonthFormat: String(new Date().getFullYear()) + ((new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)),
		sendInvoiceList: [],
		currentPage: 1,
		rowRowNo: "",
		invoiceNo: "",
		workTimeFlag: false,
		employeeNameFlag: false,
		loading: true,
		addDisabledFlag: false,
		bankAccountInfos: [],
		quantitys: [1,2,3,4,5,6,7,8,9,10],
		requestUnitCodes: [{code: "0",name: "人月"},{code: "1",name :"件"}],
        customerNameList: store.getState().dropDown[53].slice(1),
        customerAbbreviationList: store.getState().dropDown[73].slice(1),
		employeeInfo: store.getState().dropDown[9].slice(1),
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
		axios.post(this.state.serverIP + "sendInvoice/selectSendInvoiceByCustomerNo",emp)
		.then(result => {
			if(result.data.length > 0){
				let subTotalAmount = 0;
				let subTotalAmountNoTax = 0;
				for(let i in result.data){
					let quantity = result.data[i].quantity === undefined || result.data[i].quantity === null || result.data[i].quantity === "" ? 1 : Number(result.data[i].quantity);
					result.data[i].quantity = quantity;
					result.data[i].updateFlag = false;
					result.data[i].workPeriod = result.data[i].workPeriod === null || result.data[i].workPeriod === "" ? (this.state.yearAndMonthFormat + "01~" + this.state.yearAndMonthFormat + new Date(this.state.yearAndMonthFormat.substring(0,4),this.state.yearAndMonthFormat.substring(4,6),0).getDate()) : result.data[i].workPeriod;
					if(result.data[i].requestUnitCode === "0")
						subTotalAmount += Number(result.data[i].unitPrice) * quantity + Number(result.data[i].deductionsAndOvertimePayOfUnitPrice);
					if(result.data[i].requestUnitCode === "1")
						subTotalAmountNoTax += Number(result.data[i].unitPrice) * quantity + Number(result.data[i].deductionsAndOvertimePayOfUnitPrice);
				}
				this.setState({
					sendInvoiceList: result.data,
					rowRowNo: "",
					subTotalAmount: publicUtils.addComma(subTotalAmount + subTotalAmountNoTax),
					subTotalAmountTax: publicUtils.addComma(parseInt(subTotalAmount * this.state.taxRate)),
					totalAmount: publicUtils.addComma(parseInt(subTotalAmount + subTotalAmount * this.state.taxRate + subTotalAmountNoTax)),
					customerName: result.data[0].customerName,
					remark: result.data[0].remark,
					invoiceDate: publicUtils.converToLocalTime(result.data[0].invoiceDate, true),
					deadLine: publicUtils.converToLocalTime(result.data[0].deadLine, true),
					bankAccountInfo: result.data[0].bankCode,
					loading: true,
				})
				this.refs.table.setState({
					selectedRowKeys: []
				});
			}
		})
		.catch(function(error) {
			this.setState({ loading: true, });
		});	
		
		let month = this.state.yearAndMonth.getMonth() + 1;
    	this.setState({
    		invoiceNo: this.state.customerAbbreviation + "-LYC " + this.state.yearAndMonth.getFullYear() + (Number(month) < 10 ? "0" + month : month),
    	})
	}
    
	//　年月
	inactiveYearAndMonth = (date) => {
		this.setState({
			invoiceDate: date,
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
				rowRowNo: row.rowNo,
			});
		} else {
			this.setState({
				rowRowNo: "",
			});
		}	
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
	
	getEmployeeName = (event, values, cell, row) => {
		if(values != null){
			let sendInvoiceList = this.state.sendInvoiceList;
			for(let i in sendInvoiceList){
				if(row.employeeNo === sendInvoiceList[i].employeeNo){
					sendInvoiceList[i]["employeeName"] = values.text;
					sendInvoiceList[i]["employeeNo"] = values.code;
					break;
				}
			}

			this.setState({
				sendInvoiceList: sendInvoiceList,
				rowRowNo: row.rowNo,
			})
		}
	}
	
	employeeNameFormat = (cell,row) => {
		if(row.updateFlag){
			return (
				<div>
					<Row>
						<Col style={{margin: "0px",padding: "0px"}} sm={7}>
							<span class={"dutyRegistration-DataTableEditingCell"}><input type="text" class=" form-control editor edit-text" name="systemName" 
							value={row.systemName} onChange={(event) => this.tableValueChange(event, cell, row)} onBlur={(event) => this.tableValueChangeAfter(event, cell, row)} /></span>
						</Col>
						<Col style={{margin: "0px",padding: "0px"}} sm={5}>
							<span class={"dutyRegistration-DataTableEditingCell"}>
							<Autocomplete
								id="employeeName"
								name="employeeName"
								value={this.state.employeeInfo.find(v => v.text === row.employeeName) || {}}
								options={this.state.employeeInfo}
								getOptionLabel={(option) => option.text ? option.text : ""}
								onChange={(event, values) => this.getEmployeeName(event, values, cell, row)}
								renderOption={(option) => {
									return (
										<React.Fragment>
											{option.text}
										</React.Fragment>
									)
								}}
								renderInput={(params) => (
									<div ref={params.InputProps.ref}>
										<input type="text" {...params.inputProps} className="auto"
											className="auto form-control Autocompletestyle-siteInfoSearch-employeeNo"
										/>
									</div>
								)}
							/>
							</span>
						</Col>
					</Row>
					<Row>
						<Col style={{margin: "0px",padding: "0px"}} sm={7}>
							<span class={"dutyRegistration-DataTableEditingCell"}><input type="text" class=" form-control editor edit-text" name="workPeriod" 
							value={row.workPeriod} onChange={(event) => this.tableValueChange(event, cell, row)} onBlur={(event) => this.tableValueChangeAfter(event, cell, row)} /></span>
						</Col>
						<Col style={{margin: "0px",padding: "0px"}} sm={5}>
							<span class={"dutyRegistration-DataTableEditingCell"}><input type="text" class=" form-control editor edit-text" name="sumWorkTime" 
							value={row.sumWorkTime} onChange={(event) => this.tableValueChange(event, cell, row)} onBlur={(event) => this.tableValueChangeAfter(event, cell, row)} /></span>
						</Col>
					</Row>
				</div>
			);
		}else{
			return (<div><Row><font>{row.systemName === null || row.systemName === "" ? (this.state.employeeNameFlag ? (cell === null ? "" : cell) : "") : row.systemName + (this.state.employeeNameFlag ? (cell === null ? "" : "(" + cell + ")") : "")}</font></Row><Row><Col style={{margin: "0px",padding: "0px"}} sm={9}>{row.workPeriod}</Col><Col sm={3}>{(this.state.workTimeFlag ? (row.sumWorkTime === null || row.sumWorkTime === "" ? "" : row.sumWorkTime + "H") : "")}</Col></Row></div>);
		}
	}
	
	requestUnitCodeFormat  = (cell,row) => {
		let returnItem = cell === undefined || cell === null || cell === "" ? "" : this.state.requestUnitCodes.find(v => v.code === cell).name ;
		if(row.updateFlag){
			returnItem = (
					<span class={"dutyRegistration-DataTableEditingCell"} >
					<select class=" form-control editor edit-select" name="requestUnitCode" value={cell} onChange={(event) => { this.tableValueChange(event, cell, row); this.tableValueChangeAfter(event, cell, row) }} >
						{this.state.requestUnitCodes.map(date =>
						<option key={date.code} value={date.code}>
							{date.name}
						</option>)}
					</select>
				</span>
			);
		}
		return returnItem;
	}
	
	quantityFormat = (cell,row) => {
		let returnItem = cell;
		if(row.updateFlag){
			returnItem = (
					<span class={"dutyRegistration-DataTableEditingCell"} >
					<select class=" form-control editor edit-select" name="quantity" value={cell} onChange={(event) => { this.tableValueChange(event, cell, row); this.tableValueChangeAfter(event, cell, row) }} >
						{this.state.quantitys.map(date =>
						<option key={date} value={date}>
							{date}
						</option>)}
					</select>
				</span>
			);
		}
		return returnItem;
	}
	
	unitPriceFormat = (cell,row) => {
		let returnItem = cell;
		if(row.updateFlag){
			returnItem = (
					<span class={"dutyRegistration-DataTableEditingCell"}><input type="text" class=" form-control editor edit-text" name="unitPrice" value={cell} onChange={(event) => this.tableValueChange(event, cell, row)} onBlur={(event) => this.tableValueChangeAfter(event, cell, row)} /></span>
			);
		}else {
			if(cell === null || cell === "" || cell === "0")
	    		return "";
	    	else	
	    		return ("￥" + publicUtils.addComma(row.unitPrice));
		}
		return returnItem;
	}
	
	lowerLimitFormat = (cell,row) => {
		let payOffRange = "";
		if(row.payOffRange1 == undefined || row.payOffRange1 == null || row.payOffRange1 == "" || row.requestUnitCode === "1")
			return payOffRange;
		else if(row.payOffRange1 == 0 || row.payOffRange1 == 1)
    		payOffRange = row.payOffRange1 == 0 ? "固定" : "出勤日";
    	else
    		payOffRange = row.payOffRange1 + "H";
		return (<div><Row><font>{payOffRange}</font></Row><Row><font>{Number(row.deductionsAndOvertimePayOfUnitPrice) < 0 ? ("￥" + publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice)) : ""}</font></Row></div>);
	}
	
	upperLimitFormat = (cell,row) => {
		let payOffRange = "";
		if(row.payOffRange2 == undefined || row.payOffRange2 == null || row.payOffRange2 == "" || row.requestUnitCode === "1")
			return payOffRange;
		else if(row.payOffRange2 == 0 || row.payOffRange2 == 1)
    		payOffRange = row.payOffRange2 == 0 ? "固定" : "出勤日";
    	else
    		payOffRange = row.payOffRange2 + "H";
		return (<div><Row><font>{payOffRange}</font></Row><Row><font>{Number(row.deductionsAndOvertimePayOfUnitPrice) > 0 ? ("￥" + publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice)) : ""}</font></Row></div>);
	}
	
	billingAmountFormat = (cell,row) => {
		let billingAmount = Number(row.unitPrice) * row.quantity + Number(row.deductionsAndOvertimePayOfUnitPrice);
		if(billingAmount != "NaN"){
			if(row.requestUnitCode === "0")
				return ("￥" + publicUtils.addComma(billingAmount));
			else 
				return ("￥" + publicUtils.addComma(billingAmount) + "(税込)");
		}
	}
	
	workTimeFlagChange = () => {
		this.setState({
			workTimeFlag: !this.state.workTimeFlag,
		});
	}
	
	employeeNameFlagChange = () => {
		this.setState({
			employeeNameFlag: !this.state.employeeNameFlag,
		});
	}
	
	addRow = () => {
		let sendInvoiceList = this.state.sendInvoiceList;
		var newRow = {};
		if(sendInvoiceList.length > 0){
			newRow["rowNo"] = sendInvoiceList.length + 1;
		}else{
			newRow["rowNo"] = 1;
		}
		
		newRow["updateFlag"] = true;
		newRow["deductionsAndOvertimePayOfUnitPrice"] = 0;
		newRow["requestUnitCode"] = "0";
		newRow["quantity"] = 1;
		newRow["unitPrice"] = "";
		newRow["systemName"] = "";
		newRow["workPeriod"] = "";
		newRow["sumWorkTime"] = "";
		newRow["oldWorkContents"] = null;
		
		sendInvoiceList.push(newRow);
		var currentPage = Math.ceil(sendInvoiceList.length / 5);
		this.setState({
			sendInvoiceList: sendInvoiceList,
			currentPage: currentPage,
			addDisabledFlag: true,
			rowRowNo: "",
		});
	}
	
	deleteRow = () => {
        var a = window.confirm("削除してよろしいでしょうか？");
        if(a){
			let flag = false;
			let model = {};
			let sendInvoiceList = this.state.sendInvoiceList;
			for(let i in sendInvoiceList){
				if(sendInvoiceList[i].rowNo === this.state.rowRowNo){
					if(sendInvoiceList[i].oldWorkContents !== null){
						flag = true;
						model = {
								yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
								customerNo: this.state.customerNo,
								oldWorkContents: sendInvoiceList[i].oldWorkContents,	
						}
					}
					sendInvoiceList.splice(i,1);
					break;
				}
			}
			this.setState({
				sendInvoiceList: sendInvoiceList,
				rowRowNo: "",
			});
			if(sendInvoiceList.length === 0 || !sendInvoiceList[sendInvoiceList.length - 1].updateFlag){
				this.setState({
					addDisabledFlag: false,
				});
			}

			if(flag){
				axios.post(this.state.serverIP + "sendInvoice/deleteInvoiceData",model)
				.then(result => {
					if(result.data){
						this.setState({ "myToastShow": true, message: "削除成功！"  });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			    		this.searchSendInvoiceList();
					}
				})
				.catch(function(error) {
				});
			}
        }
	}
	
	updateRow = () => {
		let flag = false;
		let model = {};
		let sendInvoiceList = this.state.sendInvoiceList;
		for(let i in sendInvoiceList){
			if(sendInvoiceList[i].rowNo === this.state.rowRowNo){
				flag = sendInvoiceList[i].updateFlag;
				sendInvoiceList[i].updateFlag = !sendInvoiceList[i].updateFlag;
				model = {
						yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
						customerNo: this.state.customerNo,
						oldWorkContents: sendInvoiceList[i].oldWorkContents,
						workContents: sendInvoiceList[i].systemName,
						employeeNo: sendInvoiceList[i].employeeNo,
						workPeriod: sendInvoiceList[i].workPeriod,
						workingTime: sendInvoiceList[i].sumWorkTime,
						requestUnitCode: sendInvoiceList[i].requestUnitCode,
						quantity: sendInvoiceList[i].quantity,
						unitPrice: sendInvoiceList[i].unitPrice,
				};
				break;
			}
		}
		this.setState({
			sendInvoiceList: sendInvoiceList,
		});
		if(!sendInvoiceList[sendInvoiceList.length - 1].updateFlag){
			this.setState({
				addDisabledFlag: false,
			});
		}
		if(flag){
			axios.post(this.state.serverIP + "sendInvoice/updateInvoiceData",model)
			.then(result => {
				if(result.data){
					this.setState({ "myToastShow": true, message: "修正成功！"  });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		    		this.searchSendInvoiceList();
				}
			})
			.catch(function(error) {
			});
		}
	}
	
	updateAll = () => {
		let model = {
				yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
				customerNo: this.state.customerNo,
				customerName: this.state.customerName,
				invoiceDate: publicUtils.formateDate(this.state.yearAndMonth, true),
				deadLine: publicUtils.formateDate(this.state.deadLine, true),
				bankCode: this.state.bankAccountInfo,
				remark: this.state.remark,
		}
		axios.post(this.state.serverIP + "sendInvoice/updateAllInvoiceData",model)
		.then(result => {
			if(result.data){
				this.setState({ "myToastShow": true, message: "登録成功！"  });
				setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			}
		})
		.catch(function(error) {
		});
	}
	
	// onChange
	tableValueChange = (event, cell, row) => {
		let sendInvoiceList = this.state.sendInvoiceList;
		for(let i in sendInvoiceList){
			if(row.rowNo === sendInvoiceList[i].rowNo){
				sendInvoiceList[i][event.target.name] = event.target.value;
				break;
			}
		}

		this.setState({
			sendInvoiceList: sendInvoiceList
		})
	}
	// onChangeAfter
	tableValueChangeAfter = (event, cell, row) => {
		let sendInvoiceList = this.state.sendInvoiceList;
		let subTotalAmount = 0;
		let subTotalAmountNoTax = 0;
		for(let i in sendInvoiceList){
			if(sendInvoiceList[i].requestUnitCode=== "0")
				subTotalAmount += Number(sendInvoiceList[i].unitPrice) * sendInvoiceList[i].quantity + Number(sendInvoiceList[i].deductionsAndOvertimePayOfUnitPrice);
			if(sendInvoiceList[i].requestUnitCode=== "1")
				subTotalAmountNoTax += Number(sendInvoiceList[i].unitPrice) * sendInvoiceList[i].quantity + Number(sendInvoiceList[i].deductionsAndOvertimePayOfUnitPrice);
		}

		this.setState({
			sendInvoiceList: sendInvoiceList,
			subTotalAmount: publicUtils.addComma(subTotalAmount + subTotalAmountNoTax),
			subTotalAmountTax: publicUtils.addComma(parseInt(subTotalAmount * this.state.taxRate)),
			totalAmount: publicUtils.addComma(parseInt(subTotalAmount + subTotalAmount * this.state.taxRate + subTotalAmountNoTax)),
		})
	}
	
    /**
     * 社員名連想
     * @param {} event 
     */
    getBankAccountInfo = (event, values) => {
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            let bankAccountInfo = null;
            if (values !== null) {
            	bankAccountInfo = values.code;
            }
            this.setState({
            	bankAccountInfo: bankAccountInfo,
            })
        })
    }
    
    downloadPDF = () => {
		this.setState({ loading: false, });
		let model = {
				yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
				customerNo: this.state.customerNo,
				invoiceNo: this.state.invoiceNo,
				taxRate: this.state.taxRate * 100,
				workTimeFlag: this.state.workTimeFlag,
				employeeNameFlag: this.state.employeeNameFlag,
				customerAbbreviation: this.state.customerAbbreviation,
		}
		axios.post(this.state.serverIP + "sendInvoice/downloadPDF",model)
		.then(result => {
			if (result.data) {
				var a = document.createElement("a");
				a.setAttribute("href",this.state.serverIP + publicUtils.formateDate(this.state.yearAndMonth, false) + "_" + this.state.customerNo + "_" + this.state.customerAbbreviation + ".pdf");
				a.setAttribute("target","_blank");
				document.body.appendChild(a);
				a.click();
				this.setState({ loading: true, });
			} else {
				alert("更新失败");
				this.setState({ loading: true, });
			}
		})
		.catch(function(error) {
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
			page: this.state.currentPage, 
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start quantitying the pages
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
								<Col sm={3}>
									<InputGroup size="sm" className="mb-2">
										<InputGroup.Prepend>
											<InputGroup.Text id="twoKanji">御中</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control type="text" value={this.state.customerName} name="customerName" autoComplete="off" size="sm" onChange={this.valueChange} />
					                </InputGroup>
								</Col>
								<Col sm={9}>
	                            <div style={{ "float": "right" }}>
									<InputGroup size="sm" className="mb-2">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">請求日</InputGroup.Text>
											<DatePicker
												selected={this.state.invoiceDate}
												onChange={this.inactiveYearAndMonth}
												autoComplete="off"
												locale="ja"
												dateFormat="yyyy/MM/dd"
												id="datePicker-invoicePDF"
												className="form-control form-control-sm"
											/>
										</InputGroup.Prepend>
					                </InputGroup>
								</div>
								</Col>
	                        </Row>
	                        <Row>
	                        <Col sm={3}>
								<InputGroup size="sm" className="mb-2">
								<InputGroup.Prepend>
									<InputGroup.Text id="fiveKanji">請求金額</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="text" value={this.state.totalAmount} name="totalAmount" autoComplete="off" size="sm" disabled />
			                </InputGroup>
			                </Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-2">
									<InputGroup.Prepend>
										<InputGroup.Text id="fourKanji">請求番号</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="text" value={this.state.invoiceNo} name="invoiceNo" autoComplete="off" size="sm" disabled />
				                </InputGroup>
							</Col>
			                <Col sm={1}>
							</Col>
							<Col sm={5}>
	                            <div style={{ "float": "right" }}>
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
										id="datePicker-invoicePDF"
										className="form-control form-control-sm"
									/>
									</InputGroup>
								</div>
							</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
                    <Row>
						<Col sm={12}>
                            <Button size="sm" variant="info" onClick={this.workTimeFlagChange} >{"作業時間"+ (this.state.workTimeFlag ? "非" : "") +"表示"}</Button>{' '}
                            <Button size="sm" variant="info" onClick={this.employeeNameFlagChange} >{"作業者"+ (this.state.employeeNameFlag ? "非" : "") +"表示"}</Button>{' '}

                            <div style={{ "float": "right" }}>
                            	<Button variant="info" size="sm" onClick={this.addRow} disabled={this.state.addDisabledFlag}>追加</Button>{' '}
                            	<Button variant="info" size="sm" onClick={this.deleteRow} disabled={this.state.rowRowNo === ""}>削除</Button>{' '}
		                        <Button variant="info" size="sm" onClick={this.updateRow} disabled={this.state.rowRowNo === ""}>修正</Button>{' '}
	                            <Button variant="info" size="sm" onClick={this.downloadPDF} >PDF</Button>{' '}
	 						</div>
						</Col>  
                    </Row>
                    <Col>
						<BootstrapTable data={sendInvoiceList} ref='table' selectRow={selectRow} pagination={true} options={options} approvalRow headerStyle={ { background: '#5599FF'} } striped hover condensed >
							<TableHeaderColumn dataField='rowNo' isKey hidden></TableHeaderColumn>
							<TableHeaderColumn width='5%'　tdStyle={ { padding: '.45em' } } dataField='showNo' >番号</TableHeaderColumn>
							<TableHeaderColumn width='18%'　tdStyle={ { padding: '.45em' } } dataField='employeeName' dataFormat={this.employeeNameFormat}>{<div><Row><font>作業内容(作業者)</font></Row><Row><font>作業期間</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='7%'　tdStyle={ { padding: '.45em' } } dataField='requestUnitCode' dataFormat={this.requestUnitCodeFormat}>単位</TableHeaderColumn>
							<TableHeaderColumn width='10%'　tdStyle={ { padding: '.45em' } } dataField='quantity' dataFormat={this.quantityFormat}>数量</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='unitPrice' dataFormat={this.unitPriceFormat}>単価</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='lowerLimit' dataFormat={this.lowerLimitFormat}>{<div><Row><font>下限時間</font></Row><Row><font>単価</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='upperLimit' dataFormat={this.upperLimitFormat}>{<div><Row><font>上限時間</font></Row><Row><font>単価</font></Row></div>}</TableHeaderColumn>
							<TableHeaderColumn width='14%'　tdStyle={ { padding: '.45em' } } dataField='billingAmount' dataFormat={this.billingAmountFormat}>請求額</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</div>
				<Row>
					<Col sm={4}>
					<InputGroup size="sm" className="mb-2">
						<InputGroup.Prepend>
							<InputGroup.Text id="fourKanji">銀行情報</InputGroup.Text>
						</InputGroup.Prepend>
						<Autocomplete
	                        id="bankAccountInfo"
	                        name="bankAccountInfo"
	                        value={this.state.bankAccountInfos.find(v => v.code === this.state.bankAccountInfo) || ""}
	                        options={this.state.bankAccountInfos}
	                        getOptionLabel={(option) => option.name ? option.name : ""}
	                        onChange={(event, values) => this.getBankAccountInfo(event, values)}
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
					<InputGroup size="sm" className="mb-2">
						<InputGroup.Prepend>
							<InputGroup.Text id="fourKanji">備考</InputGroup.Text>
						</InputGroup.Prepend>
							<FormControl
			                    rows="3"
			                    value={this.state.remark}
			                    onChange={this.valueChange}
			                    name="remark"
			                    as="textarea">
							</FormControl>
		            </InputGroup>
					</Col>
					<Col sm={6}>
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
							<InputGroup.Text id="sanKanji">消費税率</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control type="text" value={this.state.consumptionTax} name="consumptionTax" autoComplete="off" size="sm" disabled />
		            </InputGroup>
		            <InputGroup size="sm" className="mb-2">
						<InputGroup.Prepend>
							<InputGroup.Text id="sanKanji">消費税</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control type="text" value={this.state.subTotalAmountTax} name="subTotalAmountTax" autoComplete="off" size="sm" disabled />
		            </InputGroup>
		            <InputGroup size="sm" className="mb-2">
						<InputGroup.Prepend>
							<InputGroup.Text id="sanKanji">合計</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control type="text" value={this.state.totalAmount} name="totalAmount" autoComplete="off" size="sm" disabled />
		            </InputGroup>
					</Col>
				</Row>
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" variant="info" type="button" onClick={this.updateAll}>
						<FontAwesomeIcon icon={faSave} /> 登録
					</Button>
				</div>
		         <div className='loadingImage' hidden={this.state.loading} style = {{"position": "absolute","top":"60%","left":"60%","margin-left":"-200px", "margin-top":"-150px",}}></div>
		         <br />
			</div >
		);
	}
}
export default invoicePDF;