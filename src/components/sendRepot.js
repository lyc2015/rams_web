/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
// 営業送信画面
import React from 'react';
import { Form, Button, Col, Row, InputGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import SendRepotAppend from './sendRepotAppend';
import DatePicker, { } from "react-datepicker";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl,faEdit,faPencilAlt ,faLevelUpAlt} from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials = true;

class sendRepot extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
	}
	//初期化
	initialState = {
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		allCustomer: [],// お客様レコード用
		customerName: '', // おきゃく名前
		positions: store.getState().dropDown[20],
		customerDepartmentNameDrop: store.getState().dropDown[22],// 部門の連想数列
		approval: store.getState().dropDown[27],//承認ステータス
		customers: store.getState().dropDown[53].slice(1),
		workReportStatus: store.getState().dropDown[60],//作業報告書送信ステータス
		sendReportOfDateSeting: store.getState().dropDown[61],//送信日付設定ステータス
		personInCharge: store.getState().dropDown[64].slice(1),
		storageList: store.getState().dropDown[69].slice(1),//報告書送信対象格納リスト
		errorsMessageShow: false,
		purchasingManagers: '',
		customerCode: '',
		sendDay: '',
		sendTime: '',
		workReportStatusCode: '',
		customerDepartmentName: '',
		allCustomerNo: [],
		currentPage: 1,// 該当page番号
		selectetRowIds: [],
		customerTemp: [],
		sendLetterBtnFlag: true,
		myToastShow: false,
		tableClickColumn: '0',
		message: '',
		type: '',
		linkDetail: '担当追加',
		selectedCustomer: {},
		daiologShowFlag: false,
		selectedEmpNos: (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') ? this.props.location.state.selectetRowIds : [],
		selectedCusInfos: [],
		listName: 1,
		salesLists: [],
		listName1: "",
		listName2: "",
		listName3: "",
		listShowFlag: true,
		oldListName1: "",
		oldListName2: "",
		oldListName3: "",
		selectedCtmNoStrs1: "",
		selectedCtmNoStrs2: "",
		selectedCtmNoStrs3: "",
		selectedlistName: "",
		storageListName:"",
		storageListNameChange:"",
		backPage: "",
		searchFlag: true,
		sendValue: {},
		projectNo:'',
		selectedCustomers: '',
		isHidden:true,
		addCustomerCode: "",
		backbackPage: "",
	};

	// 
	componentDidMount() {
		// this.getCustomers();
		// this.getLists();
		//this.getSalesPersonsLists();
		if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
			this.setState({
				sendValue: this.props.location.state.sendValue,
				projectNo: this.props.location.state.projectNo,
			})
			if(this.props.location.state.salesPersons === null || this.props.location.state.salesPersons === undefined || this.props.location.state.salesPersons === '' ||
				this.props.location.state.targetCusInfos === null || this.props.location.state.targetCusInfos === undefined || this.props.location.state.targetCusInfos === ''){
					this.setState({
						backPage: this.props.location.state.backPage,
						isHidden:false,
					})
			}
			if(this.props.location.state.salesPersons !== null && this.props.location.state.salesPersons !== undefined && this.props.location.state.salesPersons !== ''){
				this.setState({
					selectedEmpNos: this.props.location.state.salesPersons,
				})
			}
			if(this.props.location.state.targetCusInfos !== null && this.props.location.state.targetCusInfos !== undefined && this.props.location.state.targetCusInfos !== ''){
				this.setState({
					selectedCusInfos: this.props.location.state.targetCusInfos,
				})
			}
			if(this.props.location.state.backbackPage !== null && this.props.location.state.backbackPage !== undefined){
				this.setState({
					backPage: this.props.location.state.backbackPage,
					isHidden:true,
				})
			}
		}
		this.getCustomers();
		this.getLists();
	}
	//リスト取得
	getLists = () => {
		axios.post(this.state.serverIP + "sendRepot/getLists")
			.then(result => {
					this.setState({
						salesLists: result.data,
						listName:1+result.data.length,
						listName1:result.data.length>=1?result.data[0].name:'',
						listName2:result.data.length>=2?result.data[1].name:'',
						listName3:result.data.length>=3?result.data[2].name:'',
						oldListName1:result.data.length>=1?result.data[0].name:'',
						oldListName2:result.data.length>=2?result.data[1].name:'',
						oldListName3:result.data.length>=3?result.data[2].name:'',
						selectedCtmNoStrs1:result.data.length>=1?result.data[0].customerNo:'',
						selectedCtmNoStrs2:result.data.length>=2?result.data[1].customerNo:'',
						selectedCtmNoStrs3:result.data.length>=3?result.data[2].customerNo:'',
					});
				})
				.catch(function(err) {
					alert(err)
				})
	}
	//担当メールをキーにした担当リスト
	// getSalesPersonsLists = () => {
	// 	axios.post(this.state.serverIP + "sendRepot/getSalesPersonsLists")
	// 		.then(result => {
	// 	this.setState({
	// 		salesPersonsLists: result.data,
	// 	});
	// })
	// .catch(function (err) {
	// 	alert(err)
	// })
	// }
	//初期化お客様取る
	getCustomers = () => {
		axios.post(this.state.serverIP + "sendRepot/getCustomers")
			.then(result => {
				let customerNoArray = new Array([]);
				for (let i in result.data) {
					customerNoArray.push(result.data[i].customerNo);
				}
				this.setState({
					allCustomer: result.data,
					customerTemp: [...result.data],
					allCustomerNo: customerNoArray,
				},()=>{
					if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
					if (this.props.location.state.targetCusInfos !== null && this.props.location.state.targetCusInfos !== undefined && this.props.location.state.targetCusInfos !== '') {
						this.refs.customersTable.setState({
							selectedRowKeys: this.props.location.state.targetCusInfos,
						});
					}
					}
				});
			})
			.catch(function(err) {
				alert(err)
			})
	}
	// 行番号
	indexN = (cell, row, enumObject, index) => {
		let rowNumber = (this.state.currentPage - 1) * 10 + (index + 1);
		return (<div>{rowNumber}</div>);
	}
	// セレクトボックス変更
	onTagsChange = (event, values, fieldName) => {
		if (values === null) {
			switch (fieldName) {
				case 'customerCode':
				case 'customerName':
					this.setState({
						customerCode: '',
					})
					break;
				case 'customerDepartmentCode':
					this.setState({
						customerDepartmentCode: '',
					})
					break;
				case 'storageList':
					this.setState({
						storageListName: '',
						storageListNameChange: '',
						selectedCustomers: '',
					})
					break;	
				case 'personInCharge':
					this.setState({
						purchasingManagers: '',
						addCustomerCode: '',
					})
					break;
				default:
			}
		} else {
			switch (fieldName) {
				case 'customerCode':
				case 'customerName':
					this.setState({
						customerCode: values.code,
						purchasingManagers: '',
						addCustomerCode: values.code,
					})
					break;
				case 'customerDepartmentCode':
					this.setState({
						customerDepartmentCode: values.code,
					})
					break;
				case 'storageList':
					this.setState({
						storageListName:  values.name,
						storageListNameChange: values.name,
						selectedCustomers: values.code,
					})
					axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: values.code.split(','),storageListName:values.name,})
					.then(result => {
				this.setState({
					allCustomer: result.data,
					customerTemp: [...result.data],
					selectetRowIds: [],
					selectedCusInfos: [],
				});
				this.refs.customersTable.setState({
					selectedRowKeys: [],
				})
			})
			.catch(function (err) {
				alert(err)
			})
					break;	
				case 'personInCharge':
					this.setState({
						purchasingManagers: values.text,
						customerCode: '',
						addCustomerCode: values.code,
					})
					break;
				default:
			}
		}
	}
	
// customerDepartmentNameFormat
	positionNameFormat = (cell) => {
		let positionsTem = this.state.positions;
		for (var i in positionsTem) {
			if (cell === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
	}

	customerDepartmentNameFormat = (cell) => {
		let customerDepartmentNameDropTem = this.state.customerDepartmentNameDrop;
		for (var i in customerDepartmentNameDropTem) {
			if (cell === customerDepartmentNameDropTem[i].code) {
				return customerDepartmentNameDropTem[i].name;
			}
		}
	}
// customerDepartmentNameFormat
	positionNameFormat = (cell) => {
		let positionsTem = this.state.positions;
		for (var i in positionsTem) {
			if (cell === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
	}
	workReportStatusChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		if (event.target.value === '0'||event.target.value === '') {
			this.setState({
				sendTime: "",
				sendDay: "",
			})
        }
	}
 	inactiveSendTime = (date) => {
 		this.setState(
 			{
 				sendTime: date,
 			}
 		);
 	};
	customerDepartmentNameFormat = (cell) => {
		let customerDepartmentNameDropTem = this.state.customerDepartmentNameDrop;
		for (var i in customerDepartmentNameDropTem) {
			if (cell === customerDepartmentNameDropTem[i].code) {
				return customerDepartmentNameDropTem[i].name;
			}
		}
	}
	// clearボタン事件
	clearLists = () => {
		var a = window.confirm("削除していただきますか？");
		if(a){
			if (this.state.storageListName !== '') {
				axios.post(this.state.serverIP + "sendRepot/deleteCustomerList", { storageListName: this.state.storageListName })
					.then(() => {
						let newStorageListArray = new Array([]);
						for (let i in this.state.storageList) {
							if(this.state.storageList[i].name === this.state.storageListName){
								let storageListTemp = {name:this.state.storageList[i].name,code:''};
								newStorageListArray.push(storageListTemp);
							}
							else{
								newStorageListArray.push(this.state.storageList[i]);
							}
						}
						this.setState({
							storageList: newStorageListArray,
							allCustomer: [],
							customerTemp: [],
							sendLetterBtnFlag: true,
						})
						this.refs.customersTable.store.selected = [];
						this.refs.customersTable.setState({
							selectedRowKeys: [],
						})
					    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
				        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
					})
			} else {
				this.setState({
					allCustomer: [],
					customerTemp: [],
					sendLetterBtnFlag: true,
				})
				this.refs.customersTable.store.selected = [];
				this.refs.customersTable.setState({
					selectedRowKeys: [],
				})
				this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
			}
		}
	}
		valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	createList = () => {
		let { selectetRowIds, customerTemp, listName } = this.state;
		let selectedArray = new Array([]);
		for (let i in selectetRowIds) {
			selectedArray.push(customerTemp.find(v => v.rowId === selectetRowIds[i]));
		}
		let name = `送信対象${listName}`;
		let selectedNoArray = new Array([]);
		for (let i in selectedArray) {
			selectedNoArray.push(selectedArray[i].customerNo);
		}
		let code = selectedNoArray.join(',');
		axios.post(this.state.serverIP + "sendRepot/creatList", { name, code })
			.then(() => {
				this.refs.customersTable.store.selected = [];
				this.refs.customersTable.setState({
					selectedRowKeys: [],
				})
				/* listName=listName+1; */
				this.setState({
					selectetRowIds: [],
				});
				this.getLists();
			})
	}
	
	addNewList = () => {
		let newAllCtmNos = "";
		for (let i in this.state.allCustomer){
			newAllCtmNos += this.state.allCustomer[i].customerNo + ",";
		}
		newAllCtmNos = newAllCtmNos.substring(0, newAllCtmNos.lastIndexOf(','));
		axios.post(this.state.serverIP + "sendRepot/addNewList", { code:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys): newAllCtmNos) })
		.then(result => {
			let newStorageListArray = this.state.storageList;
			let storageListTemp = {name:result.data,code:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys): newAllCtmNos) };
			newStorageListArray.push(storageListTemp);
			this.setState({
				storageList: newStorageListArray,
				storageListName: result.data,
				storageListNameChange: result.data,
				selectedCustomers: (this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys): newAllCtmNos),
				currentPage: 1,
			})
			axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys).split(','): newAllCtmNos.split(',')),storageListName:result.data,})
				.then(result => {
					this.setState({
						allCustomer: result.data,
					});
				    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
			        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
				})
				.catch(function (err) {
					alert(err)
				})
		})	
	}

	// deleteボタン事件
	deleteLists = () => {
		var a = window.confirm("削除していただきますか？");
		if(a){
			let selectedIndex = this.state.selectetRowIds;
			let newCustomer = this.state.allCustomer;
			for (let i in selectedIndex) {
				for (let k in newCustomer) {
					if (selectedIndex[i] === newCustomer[k].rowId) {
						newCustomer.splice(k, 1);
						break;
					}
				}
			}
			this.refs.customersTable.store.selected = [];
			this.setState({
				selectedCusInfos: [],
				allCustomer: newCustomer,
				selectetRowIds: [],
			});
			this.refs.customersTable.setState({
				selectedRowKeys: [],
			})
			if (this.state.storageListName !== '') {
				axios.post(this.state.serverIP + "sendRepot/deleteCustomerListByNo",
						{
							oldCtmNos: String(this.state.selectedCustomers).split(','),
							deleteCtmNos: String(this.refs.customersTable.state.selectedRowKeys).split(','),
							storageListName: this.state.storageListName
						})
				.then(result => {
					let newStorageListArray = new Array([]);
					for (let i in this.state.storageList) {
						if(this.state.storageList[i].name === this.state.storageListName){
							let storageListTemp = {name:this.state.storageList[i].name,code:result.data};
							newStorageListArray.push(storageListTemp);
						}
						else{
							newStorageListArray.push(this.state.storageList[i]);
						}
					}
					this.setState({
						selectedCustomers: result.data,
						storageList: newStorageListArray,
					})
				    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
			        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
				})
				.catch(function (err) {
					alert(err)
				})
			}else{
			    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
			}
		}
	}
	// 全て選択ボタン事件
	selectAllLists = () => {
		this.refs.customersTable.store.selected = [];
		this.refs.customersTable.setState({
			selectedRowKeys: this.refs.customersTable.state.selectedRowKeys.length !== this.state.allCustomerNo.length ? this.state.allCustomerNo : [],
		})
		let customerRowIdArray = new Array([]);
		for (let i in this.state.allCustomer) {
			customerRowIdArray.push(this.state.allCustomer[i].rowId);
		};
		let targetCustomer = new Array([]);
		for (let i in customerRowIdArray) {
			let rowNo = customerRowIdArray[i];
			targetCustomer.push(this.state.customerTemp[rowNo]);
		};
		this.setState({
			selectedCusInfos: targetCustomer,
			sendLetterBtnFlag: !this.state.sendLetterBtnFlag,
			selectetRowIds: [],
			currentPage: 1,// 該当page番号
		})
	}
	// addClick
	addClick = () => {
		this.setState({"errorsMessageShow": false});
		var allCustomerData = this.state.allCustomer;
		for (let k in allCustomerData) {
			if(allCustomerData[k].customerNo === this.state.addCustomerCode){
				this.setState({"errorsMessageShow": true , message: "お客様は存在しています、チェックしてください。" });
				setTimeout(() => this.setState({ "errorsMessageShow": false }), 2000);
				return;
			}
		}
		if(this.state.storageListName === null || this.state.storageListName === ""){
			let newAllCtmNos = "";
			for (let i in this.state.allCustomer){
				newAllCtmNos += this.state.allCustomer[i].customerNo + ",";
			}
			newAllCtmNos += this.state.addCustomerCode;
			axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: newAllCtmNos.split(','),storageListName:this.state.storageListName, })
			.then(result => {
				let newStorageListArray = new Array([]);
				for (let i in this.state.storageList) {
					if(this.state.storageList[i].name === this.state.storageListName){
						let storageListTemp = {name:this.state.storageList[i].name,code:this.state.storageList[i].code + ',' + this.state.addCustomerCode};
						newStorageListArray.push(storageListTemp);
					}
					else{
						newStorageListArray.push(this.state.storageList[i]);

					}
				}
				this.setState({
					storageList: newStorageListArray,
					storageListName: this.state.storageListNameChange,
					allCustomer: result.data,
				});
			    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
			})
			.catch(function (err) {
				alert(err)
			})
		}
		else{
			axios.post(this.state.serverIP + "sendRepot/customerListUpdate", 
					{
						storageListName:this.state.storageListName,
						customerList:this.state.addCustomerCode
					})
			.then(result => {
				axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: result.data.split(','),storageListName:this.state.storageListName, })
				.then(result => {
					let newStorageListArray = new Array([]);
					for (let i in this.state.storageList) {
						if(this.state.storageList[i].name === this.state.storageListName){
							let storageListTemp = {name:this.state.storageList[i].name,code:this.state.storageList[i].code + ',' + this.state.addCustomerCode};
							newStorageListArray.push(storageListTemp);
						}
						else{
							newStorageListArray.push(this.state.storageList[i]);

						}
					}
					this.setState({
						storageList: newStorageListArray,
						storageListName: this.state.storageListNameChange,
						allCustomer: result.data,
					});
				    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
			        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
				})
				.catch(function (err) {
					alert(err)
				})
			})
			.catch(function (err) {
				alert(err)
			})
		}
	}

	// plusClick
	plusClick = () => {
		let customerNo = this.state.customerCode;
		let customerDepartmentCode = this.state.customerDepartmentCode;
		let customers = this.state.allCustomer;
		let customerInfo = this.state.customerTemp;
		var sameFlag = false;
		if (customers.length !== 0) {
			for (let k in customers) {
				if (customerNo === customers[k].customerNo &&
					customerDepartmentCode === customers[k].customerDepartmentCode) {
					alert("err---the same record");
					sameFlag = true;
				}
			}
			if (!sameFlag) {
				for (let k in customerInfo) {
					if (customerNo === customerInfo[k].customerNo &&
						customerDepartmentCode === customerInfo[k].customerDepartmentCode) {
						this.setState({
							allCustomer: this.state.allCustomer.concat(customerInfo[k]).sort(function (a, b) {
								return a.rowId - b.rowId
							}),
						})
					}
				}
			}
		} else {
			for (let k in customerInfo) {
				if (customerNo === customerInfo[k].customerNo &&
					customerDepartmentCode === customerInfo[k].customerDepartmentCode) {
					this.setState({
						allCustomer: this.state.allCustomer.concat(customerInfo[k]),
					})
				}
			}
		}
	}

	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	handleRowSelect = (row, isSelected, e) => {
		if (this.refs.customersTable.state.selectedRowKeys.length === this.state.allCustomer.length) {
			this.refs.customersTable.setState({
				selectedRowKeys: [],
			})
		}
		let rowNo = row.rowId;
		if (isSelected) {
			this.setState({
				sendLetterBtnFlag: true,
				selectetRowIds: this.state.selectetRowIds.concat([rowNo]),
				selectedCusInfos: this.state.selectedCusInfos.concat(this.state.customerTemp[rowNo]),
			})
		} else {
			let index = this.state.selectetRowIds.findIndex(item => item === rowNo);
			this.state.selectetRowIds.splice(index, 1);
			let index2 = this.state.selectedCusInfos.findIndex(item => item.rowId === rowNo);
			this.state.selectedCusInfos.splice(index2, 1);
			this.setState({
				selectedCusInfos: this.state.selectedCusInfos,
				sendLetterBtnFlag: true,
				selectetRowIds: this.state.selectetRowIds,
			})
		}
	}

	CellFormatter(cell, row) {
		if (cell !== "" && cell !== null) {
			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{cell}</a>);
		} else {
			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{this.state.linkDetail}</a>);
		}
	}

	getSalesPersons = (selectedCustomer) => {
		console.log(selectedCustomer.salesPersonsAppend !== null);
		this.setState({
			selectedCustomer: selectedCustomer,
			daiologShowFlag: true,
		})
	}

	closeDaiolog = () => {
		this.setState({
			daiologShowFlag: false,
		})
	}

	saveSalesPersons = (row, appendPersonMsg) => {
/*		this.state.customerTemp[row.rowId].purchasingManagers2 = appendPersonMsg.purchasingManagers2;
		this.state.customerTemp[row.rowId].positionCode2 = appendPersonMsg.positionCode2;
		this.state.customerTemp[row.rowId].purchasingManagersMail2 = appendPersonMsg.purchasingManagersMail2;*/
		this.state.customerTemp[row.rowId].purchasingManagersOthers = appendPersonMsg.purchasingManagersOthers;
		this.setState({
			daiologShowFlag: false,
		});
		this.CellFormatter(row.salesPersonsAppend, row);
	}
	changeName = () => {
		for (let i in this.state.storageList) {
			if(this.state.storageList[i].name === this.state.storageListNameChange){
                this.setState({ "errorsMessageShow": true, message: "同名なリストが存在しています、チェックしてください。" });
                setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				return;
			}
		}
		var salesSendLettersListNames = {
				storageListName: this.state.storageListNameChange, oldStorageListName:this.state.storageListName,
			};
			axios.post(this.state.serverIP + "sendRepot/listNameUpdate", salesSendLettersListNames)
				.then(result => {
	                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
	                    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
	                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
						
						let newStorageListArray = new Array([]);
						for (let i in this.state.storageList) {
							if(this.state.storageList[i].name === this.state.storageListName){
								let storageListTemp = {name:this.state.storageListNameChange,code:this.state.storageList[i].code};
								newStorageListArray.push(storageListTemp);
							}
							else{
								newStorageListArray.push(this.state.storageList[i]);

							}
						}
						this.setState({
							storageList: newStorageListArray,
							storageListName: this.state.storageListNameChange,
						})
						
	                } else {
	                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
	                }
				})
				.catch(function (err) {
					alert(err)
				})
	}
	
	deleteList = () => {
		var a = window.confirm("削除していただきますか？");
		if(a){
			var salesSendLettersListNames = {
					storageListName: this.state.storageListNameChange
				};
			axios.post(this.state.serverIP + "sendRepot/deleteList", salesSendLettersListNames)
					.then(result => {
		                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
							let newStorageListArray = new Array([]);
							for (let i in this.state.storageList) {
								if(this.state.storageList[i].name === this.state.storageListName){
								}
								else{
									newStorageListArray.push(this.state.storageList[i]);
								}
							}
							this.setState({
								storageList: newStorageListArray,
								sendLetterBtnFlag: true,
								storageListNameChange: "",
								storageListName: "",
							})
		                    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
							store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
		                } else {
		                    this.setState({errorsMessageValue: result.data.errorsMessage });
		                }
		                this.getCustomers();
					})
					.catch(function (err) {
						alert(err)
					})
		}
	}

	showSelectedCtms = (selectedNos, flag) => {
		this.refs.customersTable.store.selected = [];
		this.setState({
			selectetRowIds: [],
		});
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
		if (flag === '1') {
			this.setState({
				selectedlistName: this.state.listName1,
			})
		} else if (flag === '2') {
			this.setState({
				selectedlistName: this.state.listName2,
			})
		} else if (flag === '3') {
			this.setState({
				selectedlistName: this.state.listName3,
			})
		}
		axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: selectedNos.split(','),storageListName:this.state.storageListName, })
			.then(result => {
				this.setState({
					allCustomer: result.data,
				});
			})
			.catch(function (err) {
				alert(err)
			})
	}

	changeListName = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	/**
	 * 戻るボタン
	 */
	back = () => {
		var path = {};
		path = {
			pathname: this.state.backPage,
			state: { searchFlag: this.state.searchFlag, sendValue: this.state.sendValue , selectedProjectNo:this.state.projectNo,projectNo:this.state.projectNo,},
		}
		this.props.history.push(path);
	}
	//作業報告書ボタン
	openFolder = () => {
				axios.post(this.state.serverIP + "sendRepot/openFolder")
	}
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = this.state.sendValue;
		switch (actionType) {
			case "sendRepotConfirm":
				path = {
					pathname: '/subMenuManager/sendRepotConfirm',
					state: {
						salesPersons: (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') ? this.state.selectedEmpNos : null,
						targetCusInfos: this.state.selectedCusInfos,
						backPage: 'salesSendLetter',
						projectNo: this.state.projectNo,
						backbackPage: this.state.backPage,
						sendValue: sendValue,
					},
				}
				break;
			case "sendLettersMatter":
				path = {
					pathname: '/subMenuManager/sendLettersMatter',
					state: {
						targetCusInfos: this.state.selectedCusInfos,
						backPage: 'salesSendLetter',
						projectNo: this.state.projectNo,
						backbackPage: this.state.backPage,
						sendValue: sendValue,
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}
	render() {
		const { backPage,message,type } = this.state;

		const selectRow = {
			mode: 'checkbox',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			clickToExpand: true,
			onSelect: this.handleRowSelect,
		};

		const options = {
			onPageChange: page => {
				this.setState({ currentPage: page });
			},
			page: this.state.currentPage,
			defaultSortOrder: 'dsc',
			sizePerPage: 10,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			hideSizePerPage: true,
			alwaysShowAllBtns: true,
			paginationShowsTotal: this.renderShowsTotal,
		};

		return (
			<div>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={message} type={"danger"} />
				</div>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog} show={this.state.daiologShowFlag} dialogClassName="modal-purchasingManagersSet">
					<Modal.Header closeButton></Modal.Header>
					<Modal.Body >
						<SendRepotAppend customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
							allState={this} positions={this.state.positions} />
					</Modal.Body>
				</Modal>
				<Row inline="true">
 					<Col className="text-center">
 						<h2>報告書送信</h2>
 					</Col>
 				</Row>
 				<br/>
 				<Form onSubmit={this.savealesSituation}>
 					<Form.Group>
 						<Row>
 							<Col sm={2}>
 								<InputGroup size="sm" className="mb-3">
 									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">送信区分</InputGroup.Text>
 									</InputGroup.Prepend>
 									<Form.Control as="select"
 										size="sm"
 										name="workReportStatusCode"
 										autoComplete="off"
 										value={this.state.workReportStatusCode}
 										onChange={this.workReportStatusChange}>
 										{this.state.workReportStatus.map(data =>
 											<option key={data.code} value={data.code}>
 												{data.name}
 											</option>
 										)}
 									</Form.Control>
 								</InputGroup>
 							</Col>
 							<Col sm={10}>
 								<InputGroup size="sm" className="mb-3">
 									<InputGroup.Prepend>
 										<InputGroup.Text id="inputGroup-sizing-sm"　style={{ width: "7rem" }}>送信日付設定</InputGroup.Text>
 									</InputGroup.Prepend>
 									<InputGroup.Prepend>
 										<Form.Control id="sendDay" as="select" size="sm" onChange={this.valueChange} name="sendDay" value={this.state.sendDay} disabled={this.state.workReportStatusCode === '1' ?  false:true } autoComplete="off" >
 											{this.state.sendReportOfDateSeting.map(data =>
 												<option key={data.code} value={data.code}>
 													{data.name}
 												</option>
 											)}
 										</Form.Control>
 									</InputGroup.Prepend>
 									<InputGroup.Prepend>
 										<DatePicker
 											disabled={this.state.workReportStatusCode=== '1' ?  false:true}
 											selected={this.state.sendTime}
 											value={this.state.sendTime}
 											onChange={this.inactiveSendTime}
 											autoComplete="off"
 											locale="ja"
 											dateFormat="HH:mm"
 											showTimeSelect
 											showTimeSelectOnly
 											id="datePicker"
 											className="form-control form-control-sm"
 										/>
 									</InputGroup.Prepend>
 								</InputGroup>
 							</Col>
 						</Row>
						<Row>
							{/*
								 * <Col sm={2}> <InputGroup size="sm"
								 * className="mb-3"> <InputGroup.Prepend>
								 * <InputGroup.Text
								 * id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
								 * </InputGroup.Prepend> <Autocomplete
								 * disabled={this.state.allCustomer.length ===
								 * this.state.customerTemp.length ? true :
								 * false} options={this.state.customers}
								 * getOptionLabel={(option) => option.code ?
								 * option.code : ""}
								 * value={this.state.customers.find(v => v.code
								 * === this.state.customerCode) || ""}
								 * onChange={(event, values) =>
								 * this.onTagsChange(event, values,
								 * 'customerCode')} renderInput={(params) => (
								 * <div ref={params.InputProps.ref}> <input
								 * type="text" {...params.inputProps}
								 * id="customerCode" className="auto
								 * form-control Autocompletestyle-salesSend" />
								 * </div> )} /> </InputGroup> </Col> <Col
								 * sm={2}> <InputGroup size="sm"
								 * className="mb-3"> <InputGroup.Prepend>
								 * <InputGroup.Text
								 * id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
								 * </InputGroup.Prepend> <Autocomplete
								 * disabled={this.state.allCustomer.length ===
								 * this.state.customerTemp.length ? true :
								 * false} options={this.state.customers}
								 * getOptionLabel={(option) => option.name ?
								 * option.name : ""}
								 * value={this.state.customers.find(v => v.code
								 * === this.state.customerCode) || ""}
								 * onChange={(event, values) =>
								 * this.onTagsChange(event, values,
								 * 'customerName')} renderInput={(params) => (
								 * <div ref={params.InputProps.ref}> <input
								 * type="text" {...params.inputProps}
								 * id="customerCode" className="auto
								 * form-control Autocompletestyle-salesSend" />
								 * </div> )} /> </InputGroup> </Col>
								 */}
							<Col sm={6}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}
									options={this.state.customers}
									getOptionLabel={(option) => option.name ? option.name : ""}
									value={this.state.customers.find(v => v.code === this.state.customerCode) || ""}
									onChange={(event, values) => this.onTagsChange(event, values, 'customerName')}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps}
												id="customerCode" className="auto form-control Autocompletestyle-salesSend-customers"
												 />
										</div>
									)}
								/>
									{/*
										 * <InputGroup.Prepend> <InputGroup.Text
										 * id="twoKanji">部門</InputGroup.Text>
										 * </InputGroup.Prepend> <Autocomplete
										 * disabled={this.state.allCustomer.length
										 * === this.state.customerTemp.length ?
										 * true : false}
										 * options={this.state.customerDepartmentNameDrop}
										 * getOptionLabel={(option) =>
										 * option.name ? option.name : ""}
										 * value={this.state.customerDepartmentNameDrop.find(v =>
										 * v.code ===
										 * this.state.customerDepartmentCode) ||
										 * ""} onChange={(event, values) =>
										 * this.onTagsChange(event, values,
										 * 'customerDepartmentCode')}
										 * renderInput={(params) => ( <div
										 * ref={params.InputProps.ref}> <input
										 * type="text" {...params.inputProps}
										 * id="customerDepartmentName"
										 * className="auto form-control
										 * Autocompletestyle-salesSend" />
										 * </div> )} />
										 */}
								<InputGroup.Prepend>
									<InputGroup.Text id="sanKanji">担当者</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
								disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}
								options={this.state.personInCharge}
								getOptionLabel={(option) => option.text ? option.text : ""}
								value={this.state.personInCharge.find(v => v.text === this.state.purchasingManagers) || ""}
								onChange={(event, values) => this.onTagsChange(event, values, 'personInCharge')}
								renderInput={(params) => (
									<div ref={params.InputProps.ref}>
										<input type="text" {...params.inputProps}
											id="personInCharge" className="auto form-control Autocompletestyle-salesSend-personInCharge"
											 />
									</div>
								)}
							/>
								<Button size="sm" variant="info" onClick={this.addClick} 
								/*
								* disabled={this.state.allCustomer.length
								* ===
								* this.state.customerTemp.length ?
								* true :
								* false}
								*/
								disabled={this.state.customerCode !== "" || this.state.purchasingManagers !== ""  ? false : true}>
									<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
									</InputGroup>
							</Col>

							{/*
								 * <Col sm={5} style={{ "display":
								 * this.state.salesLists.length >= 1 ? "block" :
								 * "none" }}> <InputGroup size="sm"
								 * className="mb-3" style={{ position:
								 * 'relative' }}> <div style={{ "display":
								 * this.state.listShowFlag ? "contents" : "none"
								 * }}> 格納リスト： <Button size="sm" variant="info"
								 * onClick={this.showSelectedCtms.bind(this,
								 * this.state.selectedCtmNoStrs1, '1')} style={{
								 * "display": this.state.salesLists.length >= 1 ?
								 * "block" : "none" }}> <FontAwesomeIcon
								 * icon={faBookmark}
								 * />{this.state.salesLists.length >= 1 ? ' ' +
								 * this.state.listName1 : ''}</Button>{' '}
								 * <Button size="sm" variant="info"
								 * onClick={this.showSelectedCtms.bind(this,
								 * this.state.selectedCtmNoStrs2, '2')} style={{
								 * "display": this.state.salesLists.length >= 2 ?
								 * "block" : "none" }}> <FontAwesomeIcon
								 * icon={faBookmark}
								 * />{this.state.salesLists.length >= 2 ? ' ' +
								 * this.state.listName2 : ''}</Button>{' '}
								 * <Button size="sm" variant="info"
								 * onClick={this.showSelectedCtms.bind(this,
								 * this.state.selectedCtmNoStrs3, '3')} style={{
								 * "display": this.state.salesLists.length >= 3 ?
								 * "block" : "none" }}> <FontAwesomeIcon
								 * icon={faBookmark}
								 * />{this.state.salesLists.length >= 3 ? ' ' +
								 * this.state.listName3 : ''}</Button> </div>
								 * <span style={{ "display":
								 * !this.state.listShowFlag ? "contents" :
								 * "none" }}>格納リスト： <FormControl
								 * autoComplete="off"
								 * value={this.state.listName1}
								 * disabled={this.state.salesLists.length >= 1 ?
								 * false : true} size="sm" name="listName1"
								 * style={{ width: "85px" }}
								 * onChange={this.changeListName} />
								 * <FormControl autoComplete="off"
								 * value={this.state.listName2} size="sm"
								 * name="listName2" style={{ width: "85px",
								 * "display": this.state.salesLists.length >= 2 ?
								 * "block" : "none" }}
								 * onChange={this.changeListName} />
								 * <FormControl autoComplete="off"
								 * value={this.state.listName3} size="sm"
								 * name="listName3" style={{ width: "85px",
								 * "display": this.state.salesLists.length >= 3 ?
								 * "block" : "none" }}
								 * onChange={this.changeListName} />{' '}</span>
								 * <Button style={{ position: 'absolute', right:
								 * '0px' }} size="sm" variant="info"
								 * onClick={this.changeName}><FontAwesomeIcon
								 * icon={faPencilAlt} />{this.state.listShowFlag ?
								 * '対象名修正' : '対象名更新'}</Button> </InputGroup>
								 * </Col>
								 */}
							<Col sm={3}>
							<div style={{position:'absolute',right:'0px'}}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="fiveKanji">格納リスト</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									options={this.state.storageList}
									getOptionLabel={(option) => option.name ? option.name : ""}
									disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? true : false}
									value={this.state.storageList.find(v => v.name === this.state.storageListName) || ""}
									onChange={(event, values) => this.onTagsChange(event, values, 'storageList')}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps}
												id="storageList" className="auto form-control Autocompletestyle-salesSend-storageList" 
												 />
										</div>
									)}
								/>

							</InputGroup>
							</div>
							</Col>
							<Col sm={3}>
							<InputGroup size="sm" className="mb-3">
								<Form.Control placeholder="データ修正" id="storageListNameChange" name="storageListNameChange" value={this.state.storageListNameChange}
                                onChange={this.valueChange} />
								<Button style={{ marginLeft: "5px", marginRight: "5px" }} size="sm" variant="info" onClick={this.changeName}><FontAwesomeIcon icon={faPencilAlt} />更新</Button>
								<Button size="sm" variant="info" onClick={this.deleteList}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>
							</InputGroup>
						</Col>
						</Row>
					</Form.Group>
					<Row>
						<Col sm={6}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists}
								disabled={0 !== this.state.allCustomer.length ? false : true}
							><FontAwesomeIcon icon={faListOl} />すべて選択</Button>{" "}
							<Button
								size="sm"
								hidden={(this.state.backPage === "" ||  this.state.backPage === null ? true : false)}
								variant="info"
								onClick={this.back.bind(this)}
							>
								<FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>
						</Col>
						<Col sm={6}>
							<div style={{ "float": "right" }}>
								<Button size="sm" variant="info" name="clickButton"
									onClick={!this.state.sendLetterBtnFlag ? this.clearLists : this.deleteLists} disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>	{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.openFolder}><FontAwesomeIcon icon={faBroom} />作業報告書</Button>{' '}
								<Button size="sm" variant="info" name="clickButton"
									onClick={this.addNewList} disabled={(this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || !(this.state.storageListName === null || this.state.storageListName === "") ? true : false}><FontAwesomeIcon icon={faEdit} />リスト保存</Button>{' '}
								<Button size="sm" onClick={this.shuseiTo.bind(this,"sendRepotConfirm")} variant="info" name="clickButton" disabled={(this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || (this.state.backPage !== "" && this.state.backPage !== "manageSituation") ? true : false}><FontAwesomeIcon icon={faEnvelope} />メール確認</Button>{' '}
								<Button size="sm" onClick={this.shuseiTo.bind(this,"sendLettersMatter")} variant="info" name="clickButton" disabled={(this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || (this.state.backPage !== "" && this.state.backPage !== "projectInfoSearch") ? true : false}><FontAwesomeIcon icon={faEnvelope} />送信</Button>{' '}
							</div>
						</Col>
					</Row>
				</Form>
				<Row>
					<Col sm={12}>
						<BootstrapTable
							ref="customersTable"
							data={this.state.allCustomer}
							pagination={true}
							options={options}
							selectRow={selectRow}
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='6%' dataField='any' dataFormat={this.indexN} autoValue editable={false}>番号</TableHeaderColumn>
							<TableHeaderColumn width='11%' dataField='customerNo' isKey>お客様番号</TableHeaderColumn>
							<TableHeaderColumn width='11%' dataField='customerName' dataFormat={this.customerNameFormat}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='9%' dataField='purchasingManagers'>担当者</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>部門</TableHeaderColumn>
							<TableHeaderColumn width='9%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
							<TableHeaderColumn width='14%' dataField='purchasingManagersMail' >メール</TableHeaderColumn>
							{/* <TableHeaderColumn width='11%' dataField='levelCode' >ランキング</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='monthCount' >取引数</TableHeaderColumn> */}
							<TableHeaderColumn width='12%' dataField='salesPersonsAppend' dataFormat={this.CellFormatter.bind(this)}>担当追加</TableHeaderColumn>
							{/* <TableHeaderColumn width='11%' dataField='monthMailCount'>月送信回数</TableHeaderColumn> */}
							<TableHeaderColumn width='12%' >対象社員</TableHeaderColumn>
							<TableHeaderColumn width='12%' >承認済み</TableHeaderColumn>
							<TableHeaderColumn width='12%' >送信済み</TableHeaderColumn>
							{/* 修正要 
							<TableHeaderColumn width='12%' dataField='targetEmployee' dataFormat={this.CellFormatter2.bind(this)}>対象社員</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='approvalStatus' >承認済み</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='sentReportStatus'>送信済み</TableHeaderColumn>*/}
							<TableHeaderColumn dataField='rowId' hidden={true} >ID</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
			</div>
		);
	}
}
// 	//お客様
// 	customerNameFormat = (cell) => {
// 		let customers = this.state.customers;
// 		for (var i in customers) {
// 			if (cell === customers[i].code) {
// 				return customers[i].name;
// 			}
// 		}
// 	}
// 	//職位
// 	positionNameFormat = (cell) => {
// 		let positionsTem = this.state.positions;
// 		for (var i in positionsTem) {
// 			if (cell === positionsTem[i].code) {
// 				return positionsTem[i].name;
// 			}
// 		}
// 	}
// 	//所属
// 	customerDepartmentNameFormat = (cell) => {
// 		let customerDepartmentNameDropTem = this.state.customerDepartmentNameDrop;
// 		for (var i in customerDepartmentNameDropTem) {
// 			if (cell === customerDepartmentNameDropTem[i].code) {
// 				return customerDepartmentNameDropTem[i].name;
// 			}
// 		}
// 	}
// 	//担当追加
// 	CellFormatter(cell, row) {
// 		if (cell !== "" && cell !== null) {
// 			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{cell}</a>);
// 		} else {
// 			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{this.state.linkDetail}</a>);
// 		}
// 	}
// 	//担当追加名前取得
// 	getSalesPersons = (selectedCustomer) => {
// 		this.setState({
// 			selectedCustomer: selectedCustomer,
// 			daiologShowFlag: true,
// 		})
// 	}
// 	//担当追加保存
// 	saveSalesPersons = (row, appendPersonMsg) => {
// 		this.state.customerTemp[row.rowId].purchasingManagers2 = appendPersonMsg.purchasingManagers2;
// 		this.state.customerTemp[row.rowId].positionCode2 = appendPersonMsg.positionCode2;
// 		this.state.customerTemp[row.rowId].purchasingManagersMail2 = appendPersonMsg.purchasingManagersMail2;
// 		this.setState({
// 			daiologShowFlag: false,
// 		});
// 		this.CellFormatter(row.salesPersonsAppend, row);
// 	}
// 	//対象社員
// 	CellFormatter2(cell, row) {
// 		if (cell !== "" && cell !== null) {
// 			return (<a href="javascript:void(0);" onClick={this.getTargetEmployees.bind(this, row)}>{cell}</a>);
// 		} else {
// 			return (<a href="javascript:void(0);" onClick={this.getTargetEmployees.bind(this, row)}>{this.state.linkDetail2}</a>);
// 		}
// 	}
// 	//対象社員名前取得
// 	getTargetEmployees = (selectedTargetEmployees) => {
// 		this.setState({
// 			selectedTargetEmployees: selectedTargetEmployees,
// 			daiologShowFlag3: true,
// 		})
// 	}
// 	//対象社員追加保存
// 	saveTargetEmployees = (row, targetEmployeesMsg) => {
// 		this.state.targetEmployeesTemp[row.rowId].purchasingManagers2 = targetEmployeesMsg.purchasingManagers2;
// 		this.state.targetEmployeesTemp[row.rowId].positionCode2 = targetEmployeesMsg.positionCode2;
// 		this.state.targetEmployeesTemp[row.rowId].purchasingManagersMail2 = targetEmployeesMsg.purchasingManagersMail2;
// 		this.setState({
// 			daiologShowFlag3: false,
// 		});
// 		this.CellFormatter(row.targetEmployee, row);
// 	}

// 	// clearボタン事件
// 	clearLists = () => {
// 		if(this.state.selectedlistName!==''){
// 			axios.post(this.state.serverIP + "sendRepot/deleteList",{storageListName:this.state.selectedlistName})
// 			.then(result => {
// 				this.setState({
// 					allCustomer: this.state.customerTemp,
// 					sendLetterBtnFlag: true,
// 				})	
// 				this.refs.customersTable.store.selected = [];
// 				this.refs.customersTable.setState({
// 					selectedRowKeys: [],
// 				})
// 				this.getCustomers();
// 				this.getLists();
// 			})
// 		}else{
// 			this.setState({
// 				allCustomer: [],
// 				sendLetterBtnFlag: true,
// 			})
// 			this.refs.customersTable.store.selected = [];
// 			this.refs.customersTable.setState({
// 				selectedRowKeys: [],
// 			})}
// 	}
// 	//リスト保存ボタン
// 	createList = () => {
// 		let {selectetRowKeys,customerTemp,listName}=this.state;
// 		let selectedArray = new Array([]);
// 		let name = `送信対象`
// 		let i=1
// 		while (true) {
// 			if (name + i ==  this.state.listName1  || name + i ==  this.state.listName2 || name + i == this.state.listName3) {
// 				i =  i+1
// 			} else {
// 				name = name + i
// 				break;
// 			}
// 		}
// 		for(let i in selectetRowKeys){
// 			selectedArray.push(customerTemp.find(v => v.theKey === selectetRowKeys[i]));
// 		}
// 		let customerListArray = new Array([]);
// 		let mainChargeListArray = new Array([]);
// 		let departmentCodeListArray = new Array([]);
// 		let positionCodeListArray = new Array([]);
// 		let mainChargeMailListArray = new Array([]);
// 		let subChargeMailArray = new Array([]);
// 		for(let i in selectedArray){
// 			customerListArray.push(selectedArray[i].customerNo);//お客様番号リスト
// 			mainChargeListArray.push(selectedArray[i].responsiblePerson);//メイン担当者リスト
// 			departmentCodeListArray.push(selectedArray[i].customerDepartmentCode);//部門リスト
// 			positionCodeListArray.push(selectedArray[i].positionCode);//職位リスト
// 			mainChargeMailListArray.push(selectedArray[i].purchasingManagersMail);//メール(To)リスト
// 			subChargeMailArray.push(selectedArray[i].salesPersonsAppend);//候補担当メールリスト
// 		}
// 		let customerList = customerListArray.join(',');
// 		let mainChargeList = mainChargeListArray.join(',');
// 		let departmentCodeList = departmentCodeListArray.join(',');
// 		let positionCodeList = positionCodeListArray.join(',');
// 		let mainChargeMailList = mainChargeMailListArray.join(',');
// 		let subChargeMailList = subChargeMailArray.join(',');
// 		let Model = {
// 			name: name,
// 			customerList: customerList,
// 			mainChargeList: mainChargeList,
// 			departmentCodeList: departmentCodeList,
// 			positionCodeList: positionCodeList,
// 			mainChargeMailList: mainChargeMailList,
// 			subChargeMailList: subChargeMailList,
// 		}
// 		axios.post(this.state.serverIP + "sendRepot/creatList", Model)
// 		.then(result => {
// 			this.refs.customersTable.store.selected = [];
// 			this.refs.customersTable.setState({
// 			selectedRowKeys: [],
// 		})
// 		this.setState({
// 			selectetRowKeys:[],
// 		});
// 		this.getLists();
// 		})
// 	}
// 	// 削除ボタン
// 	deleteLists = () => {
// 		let selectetRowKeys = this.state.selectetRowKeys;
// 		let newCustomer = this.state.allCustomer;
// 		for (let i in selectetRowKeys) {
// 			for (let k in newCustomer) {
// 				if (selectetRowKeys[i] === newCustomer[k].theKey) {
// 					newCustomer.splice(k, 1);
// 					break;
// 				}
// 			}
// 		}
// 		this.refs.customersTable.store.selected = [];
// 		this.setState({
// 			selectedCusInfos: [],
// 			allCustomer: newCustomer,
// 			selectetRowKeys: [],
// 		});
// 		this.refs.customersTable.setState({
// 			selectedRowKeys: [],
// 		})
// 	}

// 	// 全て選択ボタン事件
// 	selectAllLists = () => {
// 		this.refs.customersTable.store.selected = [];
// 		this.refs.customersTable.setState({
// 			selectedRowKeys: this.refs.customersTable.state.selectedRowKeys.length !== this.state.allCustomerNo.length ? this.state.allCustomerNo : [],
// 		},()=>{
// 			console.log(this.refs.customersTable.state.selectedRowKeys);
// 		})
// 		let customerRowIdArray = new Array([]);
// 		for (let i in this.state.allCustomer) {
// 			customerRowIdArray.push(this.state.allCustomer[i].theKey);
// 		};
// 		let targetCustomer = new Array([]);
// 		for (let i in customerRowIdArray) {
// 			let theKey = customerRowIdArray[i];
// 			targetCustomer.push(this.state.customerTemp[theKey]);
// 		};
// 		this.setState({
// 			selectedCusInfos: targetCustomer,
// 			sendLetterBtnFlag: !this.state.sendLetterBtnFlag,
// 			selectetRowKeys: [],
// 			currentPage: 1,//　該当page番号
// 		})
// 	}

// 	// 追加
// 	plusClick = () => {
// 		let customerNo = this.state.customerCode;//お客様名
// 		let customerDepartmentCode = this.state.customerDepartmentCode;//部門
// 		let purchasingManagers = this.state.purchasingManagers;//担当者
// 		let customers = this.state.allCustomer;
// 		let customerInfo = this.state.customerTemp;
// 		var sameFlag = false;
// 		if (customers.length !== 0) {
// 			for (let i in customers) {
// 				if (customerNo === customers[i].customerNo &&
// 					customerDepartmentCode === customers[i].customerDepartmentCode &&
// 					purchasingManagers === customers[i].purchasingManagers) {
// 					alert("err---the same record");
// 					sameFlag = true;
// 				}
// 			}
// 			if (!sameFlag) {
// 				for (let i in customerInfo) {
// 					if (customerNo === customerInfo[i].customerNo &&
// 						customerDepartmentCode === customerInfo[i].customerDepartmentCode) {
// 						this.setState({
// 							allCustomer: this.state.allCustomer.concat(customerInfo[i]).sort(function(a, b) {
// 								return a.rowId - b.rowId
// 							}),
// 						})
// 					}
// 				}
// 			}
// 		} else {
// 			for (let i in customerInfo) {
// 				if (customerNo === customerInfo[i].customerNo &&
// 					customerDepartmentCode === customerInfo[i].customerDepartmentCode) {
// 					this.setState({
// 						allCustomer: this.state.allCustomer.concat(customerInfo[i]),
// 					})
// 				}
// 			}
// 		}
// 	}
// 	//
// 	renderShowsTotal = (start, to, total) => {
// 		return (
// 			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
// 				{start}から  {to}まで , 総計{total}
// 			</p>
// 		);
// 	}
// 		let theKey = row.theKey;
// 		if (isSelected) {
// 			this.setState({
// 				sendLetterBtnFlag: true,
// 				selectetRowKeys: this.state.selectetRowKeys.concat([theKey]),
// 				selectedCusInfos: this.state.selectedCusInfos.concat(this.state.customerTemp[theKey]),
// 			})
// 		} else {
// 			let index = this.state.selectetRowKeys.findIndex(item => item === theKey);
// 			this.state.selectetRowKeys.splice(index, 1);
// 			let index2 = this.state.selectedCusInfos.findIndex(item => item === theKey);
// 			this.state.selectedCusInfos.splice(index2, 1);
// 			this.setState({
// 				selectedCusInfos: this.state.selectedCusInfos,
// 				sendLetterBtnFlag: true,
// 				selectetRowKeys: this.state.selectetRowKeys,
// 			})
// 		}
// 	}

// 	//サブ画面
// 	closeDaiolog = () => {
// 		this.setState({
// 			daiologShowFlag: false,
// 		})
// 	}
// 	closeDaiolog2 = () => {
// 		this.setState({
// 			daiologShowFlag2: false,
// 		})
// 	}
// 	closeDaiolog3 = () => {
// 		this.setState({
// 			daiologShowFlag3: false,
// 		})
// 	}

// 	changeName=()=>{
// 		if(this.state.listShowFlag){
// 					this.setState({
// 			listShowFlag:!this.state.listShowFlag})
// 		}else{
// 			var sendRepotListNames={storageListName1:this.state.listName1,oldStorageListName1:this.state.oldListName1,
// 			storageListName2:this.state.listName2,oldStorageListName2:this.state.oldListName2,
// 			storageListName3:this.state.listName3,oldStorageListName3:this.state.oldListName3};
// 			if((this.state.listName1===''&&this.state.oldListName1!=="")||
// 			(this.state.listName2===''&&this.state.oldListName2!=="")||
// 			(this.state.listName3===''&&this.state.oldListName3!=="")){
// 				alert("対象名を入力してください")
// 				return;
// 			}
// 			axios.post(this.state.serverIP + "sendRepot/listNameUpdate",sendRepotListNames)
// 			.then(result => {
// 				this.getLists();
// 				this.setState({
// 					listShowFlag:true,
// 				})
// 			})
// 			.catch(function(err) {
// 				alert(err)
// 			})
// 		}
// 	}

// 	valueChange = event => {
// 		this.setState({
// 			[event.target.name]: event.target.value,
// 		})
// 	}


// 	showSelectedCtms = (selectedNos, name)=>{
// 		this.refs.customersTable.store.selected = [];
// 		this.setState({
// 			selectetRowKeys: [],
// 		});
// 		this.refs.customersTable.setState({
// 			selectedRowKeys: [],
// 		})
// 		this.setState({
// 			name: name,
// 		})
// 		let Model = {
// 			name:name,
// 		}
// 		axios.post(this.state.serverIP + "sendRepot/getListByName",Model)
// 			.then(result => {
// 				let TheList = result.data;
// 				let allCustomer = new Array([]);
// 				let customerList = new Array([]);
// 				let mainChargeList = new Array([]);
// 				let departmentCodeList = new Array([]);
// 				let positionCodeList = new Array([]);
// 				let mainChargeMailList = new Array([]);
// 				let subChargeMailList = new Array([]);
// 			//	let targetEmployeeList = new Array([]);
// 				customerList = TheList.customerList.split(',')
// 				mainChargeList = TheList.mainChargeList.split(',')
// 				departmentCodeList = TheList.departmentCodeList.split(',')
// 				positionCodeList = TheList.positionCodeList.split(',')
// 				mainChargeMailList = TheList.mainChargeMailList.split(',')
// 				subChargeMailList = TheList.subChargeMailList.split(',')
// 				//targetEmployeeList = TheList.targetEmployeeList.split(',')
// 				//theKey設定
// 				for (var i = 0; i < customerList.length; i++) {
// 					allCustomer[i] = {
// 						"theKey": customerList[i] + departmentCodeList[i] + mainChargeList[i],
// 						"rowId": i + 1,
// 						"customerNo": customerList[i],
// 						"responsiblePerson": mainChargeList[i],
// 						"customerDepartmentCode": departmentCodeList[i],
// 						"positionCode": positionCodeList[i],
// 						"purchasingManagersMail": mainChargeMailList[i],
// 						"salesPersonsAppend": subChargeMailList[i],
// 					//	"targetEmployee": targetEmployeeList[i]
// 					};
// 				}
// 				this.setState({
// 					allCustomer: allCustomer,
// 					customerTemp: [...allCustomer],
// 					selectedlistName: name,
// 				});
// 			})
// 			.catch(function(err) {
// 				alert(err)
// 			})
// 	}
	
// 	changeListName=(event)=>{
// 		this.setState({
// 			[event.target.name]:event.target.value})
// 	}

// 	render() {
// 		const selectRow = {
// 			mode: 'checkbox',
// 			bgColor: 'pink',
// 			hideSelectColumn: true,
// 			clickToSelect: true,
// 			clickToExpand: true,
// 			onSelect: this.handleRowSelect,
// 		};

// 		const options = {
// 			onPageChange: page => {
// 				this.setState({ currentPage: page });
// 			},
// 			page: this.state.currentPage,
// 			defaultSortOrder: 'dsc',
// 			sizePerPage: 10,
// 			pageStartIndex: 1,
// 			paginationSize: 2,
// 			prePage: '<', // Previous page button text
// 			nextPage: '>', // Next page button text
// 			firstPage: '<<', // First page button text
// 			lastPage: '>>', // Last page button text
// 			hideSizePerPage: true,
// 			alwaysShowAllBtns: true,
// 			paginationShowsTotal: this.renderShowsTotal,
// 		};

// 		return (
// 			<div>
// 				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
// 					onHide={this.closeDaiolog} show={this.state.daiologShowFlag} dialogClassName="modal-pbinfoSet">
// 					<Modal.Header closeButton></Modal.Header>
// 					<Modal.Body >
// 						<SendRepotAppend customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
// 							allState={this} positions={this.state.positions} />
// 					</Modal.Body>
// 				</Modal>
// 				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
// 					onHide={this.closeDaiolog2} show={this.state.daiologShowFlag2} dialogClassName="modal-pbinfoSet">
// 					<Modal.Header closeButton></Modal.Header>
// 					<Modal.Body >
// 						<SendRepotAppend2 customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
// 							allState={this} positions={this.state.positions} />
// 					</Modal.Body>
// 				</Modal>
// 				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
// 					onHide={this.closeDaiolog3} show={this.state.daiologShowFlag3} dialogClassName="modal-pbinfoSet">
// 					<Modal.Header closeButton></Modal.Header>
// 					<Modal.Body >
// 						<SendRepotAppend3 customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
// 							allState={this} positions={this.state.positions} />
// 					</Modal.Body>
// 				</Modal>
// 				<Row inline="true">
// 					<Col className="text-center">
// 						<h2>報告書送信</h2>
// 					</Col>
// 				</Row>
// 				<br/>
// 				<Form onSubmit={this.savealesSituation}>
// 					<Form.Group>
// 						<Row>
// 							<Col sm={2}>
// 								<InputGroup size="sm" className="mb-3">
// 									<InputGroup.Prepend>
// 										<InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
// 									</InputGroup.Prepend>
// 									<Autocomplete
// 										options={this.state.customers}
// 										getOptionLabel={(option) => option.name ? option.name : ""}
// 										value={this.state.customers.find(v => v.code === this.state.customerCode) || ""}
// 										onChange={(event, values) => this.onTagsChange(event, values, 'customerCode')}
// 										renderInput={(params) => (
// 											<div ref={params.InputProps.ref}>
// 												<input type="text" {...params.inputProps}
// 													id="customerCode" className="auto form-control Autocompletestyle-salesSend"
// 												/>
// 											</div>
// 										)}
// 									/>
// 								</InputGroup>
// 							</Col>
// 							<Col sm={2}>
// 								<InputGroup size="sm" className="mb-3">
// 									<InputGroup.Prepend>
// 										<InputGroup.Text id="inputGroup-sizing-sm">部門</InputGroup.Text>
// 									</InputGroup.Prepend>
// 									<Autocomplete
// 										disabled={this.state.customerCode == "" ? true: false}
// 										options={this.state.customerDepartments}
// 										getOptionLabel={(option) => option.name ? option.name : ""}
// 										value={this.state.customerDepartments.find(v => v.code === this.state.customerDepartmentCode) || ""}
// 										onChange={(event, values) => this.onTagsChange(event, values, 'customerDepartmentCode')}
// 										renderInput={(params) => (
// 											<div ref={params.InputProps.ref}>
// 												<input type="text" {...params.inputProps}
// 													id="customerDepartmentName" className="auto form-control Autocompletestyle-salesSend"
// 													/>
// 											</div>
// 										)}
// 									/>
// 								</InputGroup>
// 							</Col>
// 							<Col sm={2}>
// 								<InputGroup size="sm" className="mb-3">
// 									<InputGroup.Prepend>
// 										<InputGroup.Text id="inputGroup-sizing-sm">担当者</InputGroup.Text>
// 									</InputGroup.Prepend>
// 									<Autocomplete
// 										disabled={this.state.customerDepartmentCode == "" ? true : false}
// 										options={this.state.purchasingManagers}
// 										getOptionLabel={(option) => option.name ? option.name : ""}
// 										value={this.state.purchasingManagers.find(v => v.code === this.state.purchasingManagersCode) || ""}
// 										onChange={(event, values) => this.onTagsChange(event, values, 'purchasingManagersCode')}
// 										renderInput={(params) => (
// 											<div ref={params.InputProps.ref}>
// 												<input type="text" {...params.inputProps}
// 													id="customerDepartmentName" className="auto form-control Autocompletestyle-salesSend"
// 												/>
// 											</div>
// 										)}
// 									/>
// 									</InputGroup>
// 							</Col>
// 							<Col sm={1}>
// 								<Button size="sm" variant="info" onClick={this.plusClick} disabled={this.state.customerCode == ""? true : false}>
// 									<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
// 							</Col>
// 							<Col sm={5} style={{ "display": this.state.salesLists.length>=1 ? "block" : "none" }}>
// 								<InputGroup size="sm" className="mb-3" style={{position: 'relative'}}>
// 									<div style={{  "display": this.state.listShowFlag ? "contents" : "none" }}>
// 										格納リスト：
// 									<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this, this.state.selectedCtmNoStrs1, this.state.listName1)} style={{"display": this.state.salesLists.length>=1? "block" : "none" }}>
// 									<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length>=1?' '+this.state.listName1:''}</Button>{'　'}
// 										<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this, this.state.selectedCtmNoStrs2, this.state.listName2)} style={{"display": this.state.salesLists.length>=2? "block" : "none" }}>
// 									<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length>=2?' '+this.state.listName2:''}</Button>{'　'}
// 										<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this, this.state.selectedCtmNoStrs3, this.state.listName3)} style={{"display": this.state.salesLists.length>=3? "block" : "none" }}>
// 										<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length >= 3 ? ' ' + this.state.listName3 : ''}</Button>{'　'}
// 									</div>
// 										<span style={{ "display": !this.state.listShowFlag ? "contents" : "none" }}>格納リスト： <FormControl   autoComplete="off" value={this.state.listName1}
// 										disabled={this.state.salesLists.length>=1?false:true} 
// 										size="sm" name="listName1" style={{ width: "85px" }} onChange={this.changeListName}/>
// 										<FormControl   autoComplete="off" value={this.state.listName2}
// 										size="sm" name="listName2" style={{width:"85px","display": this.state.salesLists.length>=2? "block" : "none" }} onChange={this.changeListName}/>
// 										<FormControl   autoComplete="off" value={this.state.listName3}
// 										size="sm" name="listName3" style={{width:"85px","display": this.state.salesLists.length>=3? "block" : "none"}} onChange={this.changeListName}/>{'　　　'}</span>
// 									<Button style={{position:'absolute',right:'0px'}} size="sm" variant="info"  onClick={this.changeName}><FontAwesomeIcon icon={faPencilAlt} />{this.state.listShowFlag?'対象名修正':'対象名更新'}</Button>
// 									</InputGroup>

// 							</Col>
							
// 						</Row>
// 					</Form.Group>

// 				</Form>
// 				<Row>
// 					<Col sm={12}>
// 						<BootstrapTable
// 							ref="customersTable"
// 							data={this.state.allCustomer}
// 							pagination={true}
// 							options={options}
// 							selectRow={selectRow}
// 							trClassName="customClass"
// 							headerStyle={{ background: '#5599FF' }} striped hover condensed>
// 							<TableHeaderColumn width='10%' dataField='theKey' isKey></TableHeaderColumn>
// 							<TableHeaderColumn width='8%' dataField='rowId' >番号</TableHeaderColumn>
// 							<TableHeaderColumn width='10%' dataField='customerNo' dataFormat={this.customerNameFormat}>お客様名</TableHeaderColumn>
// 							<TableHeaderColumn width='7%' dataField='responsiblePerson'>担当者</TableHeaderColumn>
// 							<TableHeaderColumn width='7%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>部門</TableHeaderColumn>
// 							<TableHeaderColumn width='7%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
// 							<TableHeaderColumn width='15%' dataField='purchasingManagersMail' >メール(To)</TableHeaderColumn>
// 							<TableHeaderColumn width='12%' dataField='salesPersonsAppend' dataFormat={this.CellFormatter.bind(this)}>担当追加</TableHeaderColumn>
// 							<TableHeaderColumn width='12%' dataField='targetEmployee' dataFormat={this.CellFormatter2.bind(this)}>対象社員</TableHeaderColumn>
// 							<TableHeaderColumn width='12%' dataField='approvalStatus' >承認済み</TableHeaderColumn>
// 							<TableHeaderColumn width='12%' dataField='sentReportStatus'>送信済み</TableHeaderColumn>
// 						</BootstrapTable>
// 					</Col>
// 				</Row>
// 			</div>
// 		);
// 	}
// }
export default sendRepot;
