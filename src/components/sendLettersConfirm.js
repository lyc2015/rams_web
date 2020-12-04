import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Button, Col, Row,InputGroup, Modal} from 'react-bootstrap';
import { faGlasses, faEnvelope, faUserPlus , faLevelUpAlt} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import MailConfirm from './mailConfirm';
import store from './redux/store';
import SalesEmpAddPopup from './salesEmpAddPopup';
axios.defaults.withCredentials = true;

/** 
*営業送信お客確認画面
 */
class sendLettersConfirm extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}

	initialState = ({
		resumePath: '',
		resumeName: '',
		selectedmail: '',
		selectedEmps: '',
		mailTitle: '',
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		selectedEmpNos: this.props.location.state.salesPersons,
		selectedCusInfos: this.props.location.state.targetCusInfos,
		employeeInfo: [],
		employeeName: '',
		hopeHighestPrice: '',
		nationalityName: '',
		birthday: '',
		stationName: '',
		developLanguage: '',
		yearsOfExperience: '',
		japaneseLevelName: '',
		beginMonth: '',
		salesProgressCode: '',
		remark: '',
		myToastShow: false,// 状態ダイアログ
		employeeNo: this.props.empNo,
		genderStatus: '',
		age: '',
		hopeHighestPrice: '',
		beginMonth: '',
		nearestStation: '',
		employeeStatus: '',
		japaneseLevelCode: '',
		englishLevelCode: '',
		japaneseLevellabal: '',
		englishLevellabal: '',
		siteRoleCode: '',
		unitPrice: '',
		addDevelopLanguage: '',
		developLanguageCode6: null,
		developLanguageCode7: null,
		developLanguageCode8: null,
		developLanguageCode9: null,
		developLanguageCode10: null,
		genders: store.getState().dropDown[0].slice(1),
		employees: store.getState().dropDown[4].slice(1),
		japaneseLevels: store.getState().dropDown[5].slice(1),
		englishLevels: store.getState().dropDown[13].slice(1),
		salesProgresss: store.getState().dropDown[16].slice(1),
		japaneaseConversationLevels: store.getState().dropDown[43].slice(1),
		englishConversationLevels: store.getState().dropDown[44].slice(1),
		projectPhases: store.getState().dropDown[45].slice(1),
		stations: store.getState().dropDown[14].slice(1),
		developLanguages: store.getState().dropDown[8].slice(1),
		developLanguagesShow: store.getState().dropDown[8].slice(1),
		employeeStatusS: store.getState().dropDown[4].slice(1),
		wellUseLanguagss: [],
		stationCode: '',
		disbleState: false,
		japaneaseConversationLevel: '',
		englishConversationLevel: '',
		projectPhaseCode: '0',
		empSelectedFlag: false,
		ctmSelectedFlag: false,
		selectedCustomerName: '',
		selectedPurchasingManagers: '',
		initAge: '',
		initNearestStation: '',
		initJapaneaseConversationLevel: '',
		initEnglishConversationLevel: '',
		initYearsOfExperience: '',
		initDevelopLanguageCode6: null,
		initDevelopLanguageCode7: null,
		initDevelopLanguageCode8: null,
		initDevelopLanguageCode9: null,
		initDevelopLanguageCode10: null,
		initUnitPrice: '',
		initRemark: '',
		disableFlag: true,
		initWellUseLanguagss: [],
		daiologShowFlag: false,
		empAdddaiologShowFlag: false,
		mails: [],
		loginUserInfo: [],
		appendEmps: [],
		disbleState: false,
		selectedMailCC: [],
		popupFlag: true,
		backPage: "",
		searchFlag: true,
		sendValue: {},
	})
	componentDidMount() {
		console.log(this.props.location);
		if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
			this.setState({
				sendValue: this.props.location.state.sendValue,
				backPage: this.props.location.state.backPage,
			})
		}
		this.searchEmpDetail();
		this.getMail();
		this.getLoginUserInfo();
		this.getAllEmpsWithResume();
	}
	
	onTagsChange = (event, values, fieldName) => {
		if (values.length === 2) {
			this.setState({
				disbleState: true,
			});
		} else {
			this.setState({
				disbleState: false,
			});
		}
		this.setState({
			selectedMailCC: [this.fromMailToEmp(values.length >= 1 ? values[0].companyMail : ''),
			this.fromMailToEmp(values.length >= 2 ? values[1].companyMail : '')].filter(function(s) {
				return s;
			}),
		});
	}

	fromMailToEmp = (mail) => {
		if (mail === "" || mail === null) {
			return '';
		} else {
			return this.state.mails.find((v) => (v.companyMail === mail));
		}
	}
	
	getMail = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getMail")
			.then(result => {
				this.setState({
					mails: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});

	}

	sendMailWithFile = () => {
		const mailConfirmContont = `<br/>

`+ `<br/>` +
			this.state.selectedCustomerName + `株式会社<br/>
`+ this.state.selectedPurchasingManagers + `様<br/>
<br/>
お世話になっております、`+ this.state.loginUserInfo[0].employeeFristName + `です。<br/>
<br/>
以下の要員を提案させていただきます、案件がございましたら、<br/>
ご検討の程宜しくお願い致します。<br/>
<br/>
【名　　前】：`+ this.state.employeeName + `　　　` + this.state.nationalityName + `　　　` + this.state.genderStatus + `<br/>
【所　　属】：`+ this.state.employeeStatus + `<br	/>
【年　　齢】：`+ this.state.age + `歳<br/>
【最寄り駅】：`+ (this.state.nearestStation !== "" ? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '') + `<br/>
【日本　語】：`+ (this.state.japaneaseConversationLevel !== "" ? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '') + `<br/>
【英　　語】：`+ (this.state.englishConversationLevel !== "" ? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '') + `<br/>
【業務年数】：`+ this.state.yearsOfExperience + `年<br/>
【対応工程】：`+ this.state.siteRoleCode + `<br/>
【得意言語】：`+ this.state.developLanguage + `<br/>
【単　　価】：`+ this.state.unitPrice + `万円<br/>
【稼働開始】：2020/09<br/>
【営業状況】：`+ (this.state.salesProgressCode !== "" ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') + `<br/>
【備　　考】：`+ this.state.remark + `<br/>
<br/>
以上、よろしくお願いいたします。<br/>
******************************************************************<br/>
LYC株式会社 `+ this.state.loginUserInfo[0].employeeFristName + ` ` + this.state.loginUserInfo[0].employeeLastName + `<br/>
〒:101-0032 東京都千代田区岩本町3-3-3サザンビル3F <br/> 
http://www.lyc.co.jp/   <br/>
TEL：03-6908-5796  携帯：`+ this.state.loginUserInfo[0].phoneNo + `(優先）<br/>
Email：`+ this.state.loginUserInfo[0].companyMail + ` 営業共通：eigyou@lyc.co.jp <br/>
労働者派遣事業許可番号　派遣許可番号　派13-306371<br/>
ＩＳＭＳ：MSA-IS-385<br/>
*****************************************************************`;
		const { resumeName, mailTitle, resumePath, selectedmail } = this.state;
		let selectedMailCC = [this.state.selectedMailCC.length >= 1 ? this.state.selectedMailCC[0].companyMail : '',
		this.state.selectedMailCC.length >= 2 ? this.state.selectedMailCC[1].companyMail:''].filter(function(s) {
			return s;
		});
		console.log(selectedMailCC);
		let mailFrom = this.state.loginUserInfo[0].companyMail;
		axios.post(this.state.serverIP + "sendLettersConfirm/sendMailWithFile", { resumeName, mailTitle, resumePath, mailConfirmContont, selectedmail, selectedMailCC, mailFrom })
			.then(result => {
				/*this.setState({
					mails: result.data,
				})*/
			})
			.catch(function(error) {
				alert(error);
			});
	}

	getLoginUserInfo = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
			.then(result => {
				this.setState({
					loginUserInfo: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});
	}

	getAllEmpsWithResume = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getAllEmpsWithResume")
			.then(result => {
				this.setState({
					appendEmps: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});
	}

	/**
	 * @param now 当前日期 格式:yyyy-MM
	 * @param addMonths 传-1 上个月,传1 下个月
	 */
	getNextMonth = (addMonths) => {
		var dd = new Date();
		var m = dd.getMonth() + 1;
		var y = dd.getMonth() + 1 + addMonths > 12 ? (dd.getFullYear() + 1) : dd.getFullYear();
		if (m + addMonths == 0) {
			y = y - 1;
			m = 12;
		} else {
			if (m + addMonths > 12) {
				m = '01';
			} else {
				m = m + 1 < 10 ? '0' + (m + addMonths) : (m + addMonths);
			}
		}
		return y + "/" + m;
	}
	
	fromCodeToNameLanguage = (code) => {
		if (code === "" || code === null) {
			return;
		} else {
			return this.state.developLanguages.find((v) => (v.code === code)).name;
		}
	}

	fromCodeToListLanguage = (code) => {
		if (code === "" || code === null) {
			return '';
		} else {
			return this.state.developLanguages.find((v) => (v.code === code));
		}
	}
	
	openDaiolog = () => {
		this.setState({
			daiologShowFlag: true,
		});

	}
	
	searchPersonnalDetail = (employeeNo) => {
		axios.post(this.state.serverIP + "salesSituation/getPersonalSalesInfo", { employeeNo: employeeNo })
			.then(result => {
				if (result.data[0].age === "") {
					this.setState({
						employeeName: result.data[0].employeeFullName,
						genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
						nationalityName: result.data[0].nationalityName,
						age: publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
							Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000),
						developLanguage: result.data[0].developLanguage,
						yearsOfExperience: result.data[0].yearsOfExperience,
						beginMonth: new Date("2020/09").getTime(),
						salesProgressCode: '2',
						nearestStation: result.data[0].nearestStation,
						stationCode: result.data[0].nearestStation,
						employeeStatus: this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode,
						initAge: publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
							Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000),
						initNearestStation: result.data[0].nearestStation,
						initJapaneaseConversationLevel: '',
						initEnglishConversationLevel: '',
						initYearsOfExperience: result.data[0].yearsOfExperience,
						initDevelopLanguageCode6: null,
						initDevelopLanguageCode7: null,
						initDevelopLanguageCode8: null,
						initDevelopLanguageCode9: null,
						initDevelopLanguageCode10: null,
						initUnitPrice: '',
						initRemark: '',
						initWellUseLanguagss: [],
					})
				} else {
					this.setState({
						employeeName: result.data[0].employeeFullName,
						genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
						nationalityName: result.data[0].nationalityName,
						age: result.data[0].age,
						developLanguageCode6: result.data[0].developLanguage1,
						developLanguageCode7: result.data[0].developLanguage2,
						developLanguageCode8: result.data[0].developLanguage3,
						developLanguageCode9: result.data[0].developLanguage4,
						developLanguageCode10: result.data[0].developLanguage5,
						wellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
						this.fromCodeToListLanguage(result.data[0].developLanguage2),
						this.fromCodeToListLanguage(result.data[0].developLanguage3),
						this.fromCodeToListLanguage(result.data[0].developLanguage4),
						this.fromCodeToListLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}),
						disbleState: this.fromCodeToListLanguage(result.data[0].developLanguage5) === '' ? false : true,
						developLanguage: [this.fromCodeToNameLanguage(result.data[0].developLanguage1),
						this.fromCodeToNameLanguage(result.data[0].developLanguage2),
						this.fromCodeToNameLanguage(result.data[0].developLanguage3),
						this.fromCodeToNameLanguage(result.data[0].developLanguage4),
						this.fromCodeToNameLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}).join('、'),
						yearsOfExperience: result.data[0].yearsOfExperience,
						japaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
						englishConversationLevel: result.data[0].englishConversationLevel,
						beginMonth: new Date("2020/09").getTime(),
						salesProgressCode: '1',
						//salesProgressCode: result.data[0].salesProgressCode,
						nearestStation: result.data[0].nearestStation,
						stationCode: result.data[0].nearestStation,
						employeeStatus: this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode,
						unitPrice: result.data[0].unitPrice,
						remark: result.data[0].remark,
						initAge: result.data[0].age,
						initNearestStation: result.data[0].nearestStation,
						initJapaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
						initEnglishConversationLevel: result.data[0].englishConversationLevel,
						initYearsOfExperience: result.data[0].yearsOfExperience,
						initDevelopLanguageCode6: result.data[0].developLanguage1,
						initDevelopLanguageCode7: result.data[0].developLanguage2,
						initDevelopLanguageCode8: result.data[0].developLanguage3,
						initDevelopLanguageCode9: result.data[0].developLanguage4,
						initDevelopLanguageCode10: result.data[0].developLanguage5,
						initUnitPrice: result.data[0].unitPrice,
						initRemark: result.data[0].remark,
						initWellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
						this.fromCodeToListLanguage(result.data[0].developLanguage2),
						this.fromCodeToListLanguage(result.data[0].developLanguage3),
						this.fromCodeToListLanguage(result.data[0].developLanguage4),
						this.fromCodeToListLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}),
					})
				}
			})
			.catch(function(error) {
				alert(error);
			});
	}
	
	searchEmpDetail = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getSalesEmps", { employeeNos: this.state.selectedEmpNos })
			.then(result => {
				this.setState({
					employeeInfo: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});
		this.searchPersonnalDetail(this.state.selectedEmpNos[0]);
	}

	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	closeDaiolog = () => {
		this.setState({
			daiologShowFlag: false,
		})
	}

	closeEmpAddDaiolog = () => {
		this.setState({
			empAdddaiologShowFlag: false,
		})
	}

	handleCtmSelect = (row, isSelected, e) => {
		this.setState({
			selectedCustomerName: isSelected ? row.customerName : '',
			selectedPurchasingManagers: isSelected ? row.purchasingManagers : '',
			//selectedSalesPerson: isSelected ? row.customerName : '',
			selectedmail: isSelected ? row.purchasingManagersMail : '',
		})
	}

	openEmpAddDaiolog = (flag) => {
		this.setState({
			empAdddaiologShowFlag: true,
			popupFlag: flag,
		});
	}

	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	};
	
	handleEmpSelect = (row, isSelected, e) => {
		this.setState({
			selectedEmps: row,
		})

		this.searchPersonnalDetail(row.employeeNo);
	}
	
	formatEmpStatus = (cell, row, enumObject, index) => {
		return this.state.employees.find((v) => (v.code === cell)).name;
	}
	
	formatResume(cell, row, enumObject, index) {
		return (<div>
			<Form.Control as="select" size="sm"
				onChange={this.resumeValueChange.bind(this, row)}
				name="resumeName"
				autoComplete="off">
				<option ></option>

				<option >{row.resumeInfo1.split('/')[4]}</option>
				<option >{row.resumeInfo2.split('/')[4]}</option>
			</Form.Control>
		</div>);
	}

	resumeValueChange = (row, event) => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		if (event.target.selectedIndex === 1) {
			this.setState({
				resumePath: row.resumeInfo1,
			})
		} else if (event.target.selectedIndex === 2) {
			this.setState({
				resumePath: row.resumeInfo2,
			})
		}
	};
	
	/**
	 * 戻るボタン
	 */
	back = () => {
		var path = {};
		path = {
			pathname: this.state.backPage,
			state: { 
				searchFlag: this.state.searchFlag, 
				sendValue: this.state.sendValue ,
				salesPersons: this.state.selectedEmpNos,
				targetCusInfos: this.state.selectedCusInfos,
			},
		}
		this.props.history.push(path);
	}
	render() {
		const {backPage} = this.state;
		const options = {
			noDataText: (<i className="" style={{ 'fontSize': '24px' }}>show what you want to show!</i>),
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

		const selectRow = {
			mode: "radio",
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			onSelect: this.handleEmpSelect,
		};

		const selectRow1 = {
			mode: "radio",
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			onSelect: this.handleCtmSelect,
		};
		const mailContent = `【名　　前】：` + this.state.employeeName + `　　　` + this.state.nationalityName + `　　　` + this.state.genderStatus + `
【所　　属】：`+ this.state.employeeStatus + `
【年　　齢】：`+ this.state.age + `歳
【最寄り駅】：`+ (this.state.nearestStation !== "" ? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '') + `
【日本　語】：`+ (this.state.japaneaseConversationLevel !== "" ? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '') + `
【英　　語】：`+ (this.state.englishConversationLevel !== "" ? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '') + `
【業務年数】：`+ this.state.yearsOfExperience + `年
【対応工程】：`+ this.state.siteRoleCode + `
【得意言語】：`+ this.state.developLanguage + `
【単　　価】：`+ this.state.unitPrice + `万円
【稼働開始】：2020/09
【営業状況】：`+ (this.state.salesProgressCode !== "" ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') + `
【備　　考】：`+ this.state.remark;
		return (
			<div>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog} show={this.state.daiologShowFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton><Col className="text-center">
						<h2>メール内容確認</h2>
					</Col></Modal.Header>
					<Modal.Body >
						<MailConfirm personalInfo={this} />
					</Modal.Body>
				</Modal>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeEmpAddDaiolog} show={this.state.empAdddaiologShowFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton><Col className="text-center">
						<h2>要員追加</h2>
					</Col></Modal.Header>
					<Modal.Body >
						<SalesEmpAddPopup personalInfo={this} />
					</Modal.Body>
				</Modal>
				<Row inline="true">
					<Col className="text-center">
						<h2>要員送信確認</h2>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
				<Row style={{ padding: "10px" }}>
					<Col sm={1}></Col>
					<Col sm={3}>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">タイトル</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control as="select" size="sm" onChange={this.valueChange} name="mailTitle" >
								<option></option>
								<option>{this.getNextMonth(1)}の要員提案に関して</option>
								<option>即日要員提案に関して</option>
								<option>{this.getNextMonth(2)}の要員提案に関して</option>
							</Form.Control>
						</InputGroup>
					</Col>
					<Col sm={5}>
						<InputGroup size="sm" className="mb-3">
							{/*<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">共用CCメール</InputGroup.Text>
							</InputGroup.Prepend>*/}
							<Autocomplete
								multiple
								size="small"
								id="tags-standard"
								options={this.state.mails}
								getOptionDisabled={option => this.state.disbleState}
								value={this.state.selectedMailCC}
								getOptionLabel={(option) => option.companyMail ? option.companyMail : ""}
								onChange={(event, values) => this.onTagsChange(event, values)}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="standard"
										/*label="共用CCメール"*/
										placeholder="共用CCメール"
										style={{ width: "680px", float: "right" }}
									/>
								)}
							/>
						</InputGroup>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}>
					<Col sm={1}></Col>
					<Col sm={10}>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">挨拶文章</InputGroup.Text>
							</InputGroup.Prepend>
							<textarea ref={(textarea) => this.textArea = textarea} maxLength="100"
								style={{ height: '60px', width: '84%', resize: 'none', overflow: 'hidden' }}
							/>
						</InputGroup>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={1}></Col><Col sm={2}>要員一覧</Col>
					<Col sm={2}>
						<div style={{ "float": "right" }}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.openEmpAddDaiolog.bind(this, true)}><FontAwesomeIcon icon={faUserPlus} />要員追加</Button>{" "}
						</div>
					</Col>
					<Col sm={1}></Col><Col sm={2}>{'　'}営業文章</Col></Row>
				<Row>
					<Col sm={1}></Col>
					<Col sm={4}>
						<BootstrapTable
							options={options}
							insertRow={true}
							selectRow={selectRow}
							ref='table'
							data={this.state.employeeInfo}
							className={"bg-white text-dark"}
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='8%' dataField='employeeName' autoValue dataSort={true} editable={false} isKey>名前</TableHeaderColumn>
							<TableHeaderColumn width='6%' dataField='employeeStatus' dataFormat={this.formatEmpStatus.bind(this)} editable={false} >所属</TableHeaderColumn>
							<TableHeaderColumn width='6%' dataField='hopeHighestPrice' editable={false}>単価</TableHeaderColumn>
							<TableHeaderColumn dataField='resumeInfo1' hidden={true}>履歴書1</TableHeaderColumn>
							<TableHeaderColumn dataField='resumeInfo2' hidden={true}>履歴書2</TableHeaderColumn>
							<TableHeaderColumn dataField='employeeNo' hidden={true}>employeeNo</TableHeaderColumn>
							<TableHeaderColumn width='20%' dataField='resume' dataFormat={this.formatResume.bind(this)} editable={false}>履歴書</TableHeaderColumn>
						</BootstrapTable>
					</Col>
					<Col sm={1}></Col>
					<Col sm={4}>
						<textarea ref={(textarea) => this.textArea = textarea} disabled
							style={{ height: '340px', width: '100%', resize: 'none', overflow: 'hidden' }}
							value={mailContent}
						/>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
				<Row>
					<Col sm={7}></Col>
					<Col sm={3}>
						<div style={{ "float": "right" }}>
							<Button
								size="sm"
								hidden={backPage === "" ? true : false}
								variant="info"
								onClick={this.back.bind(this)}
							>
								<FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>{" "}
							<Button onClick={this.openDaiolog} size="sm" variant="info" name="clickButton" ><FontAwesomeIcon icon={faGlasses} />メール確認</Button>{" "}
							<Button onClick={this.sendMailWithFile} size="sm" variant="info" ><FontAwesomeIcon icon={faEnvelope} /> {"送信"}</Button></div>
					</Col>
				</Row>
				<Row>
					<Col sm={1}></Col>
					<Col sm={9}>
						<BootstrapTable
							options={options}
							selectRow={selectRow1}
							ref='table1'
							data={this.state.selectedCusInfos}
							className={"bg-white text-dark"}
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='8%' dataField='customerName' dataAlign='center' autoValue dataSort={true} editable={false} isKey>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagers' editable={false}>担当者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='positionCode' editable={false}>職位</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagersMail' editable={false}>メール</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagers2' editable={false}>担当者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='positionCode2' editable={false}>職位</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagersMail2' editable={false}>メール</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='employeeName' editable={false}>追加者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='any' editable={false}>送信状況</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
			</div>
		);
	}
}
export default sendLettersConfirm;