import React, { Component } from 'react';
import { Row, Col, ListGroup, Accordion, Button, Navbar, Container } from 'react-bootstrap';
import title from '../asserts/images/LYCmark.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PasswordSetEmployee from './passwordSetEmployee';
import WorkRepot from './workRepot';
import DataShareEmployee from './dataShareEmployee';
import WorkTimeSearch from './workTimeSearch';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faFile, faUser, faFileExcel, faFileWord, faSearch, faSave, faThList , faCaretSquareLeft , faCogs,
faAddressCard, faFolderOpen, faFileContract, faFileAlt, faMoneyCheckAlt, faUserEdit , faUserClock} from '@fortawesome/free-solid-svg-icons';
import '../asserts/css/subMenu.css';
import DutyRegistration from './dutyRegistration';
import CostRegistration from './costRegistration';
import Resume from './resume';
import store from './redux/store';
import BreakTime from './breakTime';
import ReactTooltip from 'react-tooltip';
axios.defaults.withCredentials = true;

/**
 * サブメニュー画面（社員用）
 */
class SubMenu extends Component {
    state = {
        nowDate: '',//今の期日
		hover: '',
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }
    
    async componentWillMount() {
        await axios.post(this.state.serverIP + "subMenuEmployee/init")
            .then(resultMap => {
                if (resultMap.data !== null && resultMap.data !== '') {
                    document.getElementById("kanriSha").innerHTML = "社員" + "：" + resultMap.data["employeeName"];
                } else {
                    this.props.history.push("/");
                }
            })
    }
    /**
     * 画面の初期化
     */
    componentDidMount() {
        var dateNow = new Date();
        let month = dateNow.getMonth() + 1;
        let day = dateNow.getDate();
        this.setState({
            nowDate: (dateNow.getFullYear() + '年' + (month < 10 ? '0' + month : month) + '月' + (day < 10 ? '0' + day : day) + "日"),
            hover: '',click: "",
        })
    }
    logout = () => {
        axios.post(this.state.serverIP + "subMenuEmployee/logout")
            .then(resultMap => {
                alert("ログアウトしました");
            })
    }
	shuseiTo = (path) => {
		this.props.history.push(path);
	}
	toggleHover = (num) => {
		this.setState({
			hover: num,
		})
	}
	click = (name) =>{
		this.setState({
			click:name,
		})
	}
    render() {
        //お客様情報画面の追加パラメータ
        var customerInfoPath = {
            pathname: '/subMenuEmployee/customerInfo', state: { actionType: 'insert' },
        }
		const menuStyle = {
    			borderBottom: "0.1px solid #167887",
    			backgroundColor: "#17a2b8"
    		}
    		const menuStyleHover = {
    			borderBottom: "0.1px solid #167887",
    			backgroundColor: "#188596"
    		}
    		
    		const subMenu = {
    			borderBottom: "0.1px solid #4a4a4a",
    			backgroundColor: "#ffffff"
    		}
    		const subMenuHover = {
    			borderBottom: "0.1px solid #4a4a4a",
    			backgroundColor: "#4a4a4a"
    		}
        
        return (
            <div className="mainBody">
                <Row style={{ "backgroundColor": "#FFFAF0" }}>
                    <Navbar inline>
                        <img className="titleImg" alt="title" src={title} /><a className="loginMark" inline>LYC株式会社</a>{" "}
                    </Navbar>
                    <div style={{ "marginTop": "2%", "marginLeft": "auto", }}>
                        <font className="loginPeople">{this.state.nowDate}{" "}<FontAwesomeIcon className="fa-fw" size="lg" icon={faUser} /><a id="kanriSha"></a></font>{" "}
                        <Link as="button" className="logout" to="/" id="logout" onClick={this.logout}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCaretSquareLeft} />sign out</Link>
                    </div>

                </Row>
                <Row>
                    <Col sm={2}>
                        <br />
                        <Row>
                            <Container>
                                <h1 className="title-font">
                                    社員勤務
                            </h1>
                                <br />
                            </Container>
                        </Row>
                        <Row>
                            <Col>
                            <ListGroup >
							<Accordion className="menuCol">
									
									<ListGroup.Item style={this.state.hover.search("勤務登録") !== -1 ? menuStyleHover : menuStyle} block data-place="right" data-type="info" data-tip="" data-for="勤務登録" data-class="my-tabcolor" data-effect="solid"
										onMouseEnter={this.toggleHover.bind(this,"勤務登録")} onMouseLeave={this.toggleHover.bind(this,"")}>
										<Accordion.Toggle as={Button} variant="link" eventKey="0"><font
										className={this.state.hover.search("勤務登録") !== -1 ? "linkFont-click":"linkFont"} ><FontAwesomeIcon className="fa-fw" size="lg" icon={faAddressCard} /> 勤務登録</font></Accordion.Toggle>
										<ReactTooltip id="勤務登録"  delayUpdate={1000} getContent={() => {
											return <div>
											<ListGroup>
												<Accordion className="menuCol">
													{/*<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"勤務登録-1")} onMouseLeave={this.toggleHover.bind(this,"勤務登録")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/breakTime'})} block>
														<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/breakTime', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faUserClock}/> 休憩時間</Link></div>
													</ListGroup.Item>*/}
													<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"勤務登録-1")} onMouseLeave={this.toggleHover.bind(this,"勤務登録")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/workRepot'})} block>
														<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/workRepot', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faFileExcel}/> 作業報告書</Link></div>
													</ListGroup.Item>
													<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"勤務登録-2")} onMouseLeave={this.toggleHover.bind(this,"勤務登録")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/dutyRegistration'})} block>
														<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/dutyRegistration', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faUserEdit}/> 勤務時間入力</Link></div>
													</ListGroup.Item>
													<ListGroup.Item style={this.state.hover.search("3") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"勤務登録-3")} onMouseLeave={this.toggleHover.bind(this,"勤務登録")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/costRegistration'})} block>
														<div><Link className={this.state.hover.search("3") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/costRegistration', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faMoneyCheckAlt}/> 費用登録</Link></div>
													</ListGroup.Item>
													<ListGroup.Item style={this.state.hover.search("4") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"勤務登録-4")} onMouseLeave={this.toggleHover.bind(this,"勤務登録")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/workTimeSearch'})} block>
														<div><Link className={this.state.hover.search("4") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/workTimeSearch', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faFileAlt}/> 作業時間検索</Link></div>
													</ListGroup.Item>
												</Accordion>
											</ListGroup>
											</div>
											}}/>
									</ListGroup.Item>
										
										<ListGroup.Item style={this.state.hover.search("ファイル管理") !== -1 ? menuStyleHover : menuStyle} block data-place="right" data-type="info" data-tip="" data-for="ファイル管理" data-class="my-tabcolor" data-effect="solid"
											onMouseEnter={this.toggleHover.bind(this,"ファイル管理")} onMouseLeave={this.toggleHover.bind(this,"")}>
											<Accordion.Toggle as={Button} variant="link" eventKey="0"><font
											className={this.state.hover.search("ファイル管理") !== -1 ? "linkFont-click":"linkFont"} ><FontAwesomeIcon className="fa-fw" size="lg" icon={faFolderOpen} /> ファイル管理</font></Accordion.Toggle>
											<ReactTooltip id="ファイル管理"  delayUpdate={1000} getContent={() => {
												return <div>
												<ListGroup>
													<Accordion className="menuCol">
														<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"ファイル管理-1")} onMouseLeave={this.toggleHover.bind(this,"ファイル管理")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/dataShareEmployee'})} block>
															<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/dataShareEmployee', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faFileContract}/> ファイル共有</Link></div>
														</ListGroup.Item>
														<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"ファイル管理-2")} onMouseLeave={this.toggleHover.bind(this,"ファイル管理")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/resume'})} block>
															<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/resume', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faFileWord}/> 履歴書</Link></div>
														</ListGroup.Item>


													</Accordion>
												</ListGroup>
												</div>
												}}/>
										</ListGroup.Item>
											
										<ListGroup.Item style={this.state.hover.search("ほかの設定") !== -1 ? menuStyleHover : menuStyle} block data-place="right" data-type="info" data-tip="" data-for="ほかの設定" data-class="my-tabcolor" data-effect="solid"
											onMouseEnter={this.toggleHover.bind(this,"ほかの設定")} onMouseLeave={this.toggleHover.bind(this,"")}>
											<Accordion.Toggle as={Button} variant="link" eventKey="0"><font
											className={this.state.hover.search("ほかの設定") !== -1 ? "linkFont-click":"linkFont"} ><FontAwesomeIcon className="fa-fw" size="lg" icon={faCogs} /> ほかの設定</font></Accordion.Toggle>
											<ReactTooltip id="ほかの設定"  delayUpdate={1000} getContent={() => {
												return <div>
												<ListGroup>
													<Accordion className="menuCol">
														<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"ほかの設定-1")} onMouseLeave={this.toggleHover.bind(this,"ほかの設定")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuEmployee/passwordSetEmployee'})} block>
															<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuEmployee/passwordSetEmployee', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faHistory}/> PWリセット</Link></div>
														</ListGroup.Item>
													</Accordion>
												</ListGroup>
												</div>
												}}/>
										</ListGroup.Item>
								</Accordion>
								</ListGroup>
                                {/*<ListGroup >
                                    <Accordion className="menuCol">
                                        <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }} block>
                                            <Accordion.Toggle as={Link} to="/subMenuEmployee/passwordSetEmployee" style={{ "marginLeft": "6%" }}>
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faHistory} />ほかの設定</font></Accordion.Toggle>
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faFile} />勤務登録</font></Accordion.Toggle>
                                            <Accordion.Collapse eventKey="0">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
                                                        <Link className="linkFont" to="/subMenuEmployee/breakTime/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faThList} />休憩時間</Link></ListGroup.Item>
                                                    <ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
                                                        <Link className="linkFont" to="/subMenuEmployee/dutyRegistration/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faThList} />勤務時間入力</Link></ListGroup.Item>
                                                    <ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
                                                        <Link className="linkFont" to="/subMenuEmployee/costRegistration/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />費用登録</Link></ListGroup.Item>
                                                    <ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
                                                        <Link className="linkFont" to="/subMenuEmployee/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />履歴検索</Link></ListGroup.Item>
                                                </ListGroup>
                                            </Accordion.Collapse>
                                        </ListGroup.Item>
                                        

											
                                        <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faFile} />ファイル管理</font></Accordion.Toggle>
                                            <Accordion.Collapse eventKey="1">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
                                                        <Link className="linkFont" to="/subMenuEmployee/workRepot/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faFileExcel} />作業報告書</Link></ListGroup.Item>
                                                    <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
                                                        <Link className="linkFont" to="/subMenuEmployee/resume/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faFileWord} />履歴書</Link></ListGroup.Item>
                                                    <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
                                                        <Link className="linkFont" to="/subMenuEmployee/workTimeSearch/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faFileWord} />作業時間検索</Link></ListGroup.Item>
                                                </ListGroup>
                                            </Accordion.Collapse>
                                        </ListGroup.Item>
                                    </Accordion>
                                </ListGroup>*/}
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={9} id="page">
                        <div key={this.props.location.key}>
                            <br />
                            <Router>
                                <Route exact path={`${this.props.match.url}/`} component={WorkRepot} />
                                <Route exact path={`${this.props.match.url}/passwordSetEmployee`} component={PasswordSetEmployee} />
                                <Route exact path={`${this.props.match.url}/dutyRegistration`} component={DutyRegistration} />
                                <Route exact path={`${this.props.match.url}/costRegistration`} component={CostRegistration} />
                                <Route exact path={`${this.props.match.url}/breakTime`} component={BreakTime} />
                                <Route exact path={`${this.props.match.url}/workRepot`} component={WorkRepot} />
                                <Route exact path={`${this.props.match.url}/resume`} component={Resume} />
                                <Route exact path={`${this.props.match.url}/workTimeSearch`} component={WorkTimeSearch} />
                                <Route exact path={`${this.props.match.url}/dataShareEmployee`} component={DataShareEmployee} />
                            </Router>
                        </div>
                    </Col>
                </Row>
                <br />
            </div>
        );
    }
}
export default SubMenu;
