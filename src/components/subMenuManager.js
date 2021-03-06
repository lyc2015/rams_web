import React, { Component } from "react";
import {
  Row,
  Col,
  ListGroup,
  Accordion,
  Button,
  Navbar,
  Container,
} from "react-bootstrap";
import $ from "jquery";
import title from "../asserts/images/LYCmark.png";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import EmployeeInsert from "./employeeInsert";
import EmployeeInsertNew from "./employeeInsertNew";
import EmployeeInformation from "./employeeInformation";
import CertificatePrinting from "./certificatePrinting";
import EnvelopePrinting from "./envelopePrinting";
import EmployeeSearch from "./employeeSearch";
import CustomerInfo from "./customerInfo";
import masterInsert from "./masterInsert";
import masterUpdate from "./masterUpdate";
import dataShare from "./dataShare";
import systemSet from "./systemSet";
import profitChartist from "./profitChartist";
import CustomerInfoSearch from "./customerInfoSearch";
import siteInfo from "./siteInfo";
import sendInvoice from "./sendInvoice";
import invoicePDF from "./invoicePDF";
import ManageSituation from "./manageSituation";
import salaryDetailSend from "./salaryDetailSend";
import SendRepot from "./sendRepot";
import siteSearch from "./siteSearch";
import salesPointSet from "./salesPointSet";
import salesProfit from "./salesProfit";
import salesPoint from "./salesPoint";
import WagesInfo from "./wagesInfo";
import workRepot from "./workRepot";
import costRegistration from "./costRegistration";
import DutyRegistration from "./dutyRegistration";
import BreakTime from "./breakTime";
import axios from "axios";
import salesSendLetter from "./salesSendLetter";
import dutyManagement from "./dutyManagement";
import individualSales from "./individualSales";
import monthlySalesSearch from "./monthlySalesSearch";
import EnterPeriodSearch from "./enterPeriodSearch";
import sendLettersConfirm from "./sendLettersConfirm";
import sendLettersMatter from "./sendLettersMatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import situationChange from "./situationChange";
import EmployeeUpdate from "./employeeUpdate";
import EmployeeUpdateNew from "./employeeUpdateNew";
import EmployeeDetail from "./employeeDetail";
import EmployeeDetailNew from "./employeeDetailNew";
import ProjectInfoSearch from "./projectInfoSearch";
import IndividualCustomerSales from "./individualCustomerSales";
import projectInfo from "./projectInfo";
import sendRepotConfirm from "./sendRepotConfirm";
import customerSalesList from "./customerSalesList";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import EventEmitter from "./utils/EventEmitter";

import {
  faAddressBook,
  faHome,
  faUser,
  faUsers,
  faYenSign,
  faPaperPlane,
  faBuilding,
  faCalendar,
  faCalendarAlt,
  faThList,
  faCogs,
  faCloudUploadAlt,
  faSearch,
  faSave,
  faFileExcel,
  faCommentDollar,
  faList,
  faSearchMinus,
  faNewspaper,
  faDownload,
  faFilePowerpoint,
  faChartPie,
  faTable,
  faCog,
  faUpload,
  faCheckSquare,
  faBars,
  faCaretSquareLeft,
  faFileContract,
  faChartBar,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import "../asserts/css/subMenu.css";
import store from "./redux/store";
import { message } from "antd";
axios.defaults.withCredentials = true;

/**
 * ?????????????????????????????????????????? 20201019 ?????????
 */
class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileDevice: store.getState().isMobileDevice,
      serverIP: store.getState().dropDown[store.getState().dropDown.length - 1], // ?????????
      // ?????????
      companyName: "",
      nowDate: "", // ????????????
      authorityCode: "",
      hover: "",
      className: "",
    };
  }

  async componentWillMount() {
    await axios.post(this.state.serverIP + "subMenu/init").then((resultMap) => {
      if (resultMap.data !== null && resultMap.data !== "") {
        if (resultMap.data["authorityCode"] === "0") {
          this.props.history.push("/");
          alert("????????????");
          return;
        }
        this.props.updateInitEmployee(resultMap.data);

        this.setState({
          authorityCode: resultMap.data["authorityCode"],
        });
        document.getElementById("kanriSha").innerHTML =
          resultMap.data["authorityName"] +
          "???" +
          resultMap.data["employeeName"];
      } else {
        this.props.history.push("/");
      }
    });
  }

  /**
   * ??????????????????
   */
  componentDidMount() {
    var dateNow = new Date();
    let month = dateNow.getMonth() + 1;
    let day = dateNow.getDate();
    axios
      .post(this.state.serverIP + "subMenu/getCompanyDate")
      .then((response) => {
        this.setState({
          companyName: response.data.companyName,
          pic: response.data.companyLogo,
          backgroundColor: response.data.backgroundColor,
        });
      })
      .catch((error) => {
        console.error("Error - " + error);
      });

    this.setState({
      nowDate:
        dateNow.getFullYear() +
        "???" +
        (month < 10 ? "0" + month : month) +
        "???" +
        (day < 10 ? "0" + day : day) +
        "???",
      click: "",
    });
  }

  componentWillUnmount() {
    EventEmitter.remove("updateWorkRepot");
  }

  logout = () => {
    axios.post(this.state.serverIP + "subMenu/logout").then((resultMap) => {
      message.success("?????????????????????");
      this.props.updateInitEmployee({});
    });
  };
  click = (name) => {
    this.setState({
      click: name,
    });
  };
  checkSession = () => {
    axios
      .post(this.state.serverIP + "subMenu/checkSession")
      .then((resultMap) => {
        if (resultMap.data === null || resultMap.data === "") {
          alert(
            "??????????????????????????????????????????????????????????????????????????????????????????????????????"
          );
          this.props.history.push("/loginManager");
        }
      });
  };

  shuseiTo = (path) => {
    this.props.history.push(path);
  };

  toggleHover = (num) => {
    this.setState({
      hover: num,
    });
  };

  setClassName = (className) => {
    this.setState({
      className: className,
    });
  };

  changePage = (name) => {
    switch (name) {
      case "?????????BP":
        this.setClassName("?????????BP");
        this.shuseiTo({
          pathname: "/subMenuManager/employeeInsertNew",
          state: { actionType: "insert" },
        });
        break;
      case "??????":
        this.setClassName("??????");
        this.shuseiTo({ pathname: "/subMenuManager/siteInfo" });
        break;
      case "?????????":
        this.setClassName("?????????");
        this.shuseiTo({
          pathname: "/subMenuManager/customerInfo",
          state: { actionType: "insert" },
        });
        break;
      case "???????????????":
        this.setClassName("???????????????");
        this.shuseiTo({ pathname: "/subMenuManager/wagesInfo" });
        break;
      case "????????????":
        this.setClassName("????????????");
        this.shuseiTo({ pathname: "/subMenuManager/manageSituation" });
        break;
      case "????????????":
        this.setClassName("????????????");
        this.shuseiTo({ pathname: "/subMenuManager/salesPointSet" });
        break;
      case "??????":
        this.setClassName("??????");
        this.shuseiTo({ pathname: "/subMenuManager/dutyManagement" });
        break;
      case "????????????":
        this.setClassName("????????????");
        this.shuseiTo({ pathname: "/subMenuManager/situationChange" });
        break;
      case "????????????":
        this.setClassName("????????????");
        this.shuseiTo({ pathname: "/subMenuManager/masterInsert" });
        break;
      case "???????????????":
        this.setClassName("???????????????");
        this.shuseiTo({ pathname: "/subMenuManager/dataShare" });
        break;
      default:
        break;
    }
  };

  renderTop = () => {
    const { isMobileDevice } = this.state;
    return (
      <>
        <div className="df justify-between">
          <Navbar inline="true">
            <img
              className={"titleImg " + (isMobileDevice ? "w40" : "")}
              alt="title"
              src={title}
            />
            <span className={"loginMark " + (isMobileDevice ? "fz30" : "")}>
              LYC????????????
            </span>
          </Navbar>
        </div>
        <div className="df justify-end">
          <div
            className={"loginPeople df mr5 " + (isMobileDevice ? "fz12" : "")}
          >
            {this.state.nowDate}{" "}
            <FontAwesomeIcon className="fa-fw" size="lg" icon={faUser} />
            <div id="kanriSha"></div>
          </div>
          <Link
            as="button"
            className={"loginPeople " + (isMobileDevice ? "fz12" : "")}
            to="/"
            id="logout"
            onClick={this.logout}
          >
            <FontAwesomeIcon
              className="fa-fw"
              size="lg"
              icon={faCaretSquareLeft}
            />
            sign out
          </Link>
        </div>
      </>
    );
  };

  render() {
    // ?????????????????????????????????????????????
    var customerInfoPath = {
      pathname: "/subMenuManager/customerInfo",
      state: { actionType: "insert" },
    };
    var projectInfoPath = {
      pathname: "/subMenuManager/projectInfo",
      state: { actionType: "insert", backPage: "" },
    };
    const { authorityCode } = this.state;
    const menuStyle = {
      borderBottom: "0.1px solid #167887",
      backgroundColor: "#17a2b8",
    };
    const menuStyleHover = {
      borderBottom: "0.1px solid #167887",
      backgroundColor: "#188596",
    };

    const subMenu = {
      borderBottom: "0.1px solid #4a4a4a",
      backgroundColor: "#ffffff",
    };
    const subMenuHover = {
      borderBottom: "0.1px solid #4a4a4a",
      backgroundColor: "#4a4a4a",
    };

    const { isMobileDevice } = this.state;

    return (
      <div className={isMobileDevice ? "" : " mainBodyMinWidth"}>
        <div className="mainBody"></div>
        <Row className="myCss employeeNavBar">
          <Col sm={11}>{this.renderTop()}</Col>
          <Col sm={1}></Col>
        </Row>
        <Row onClick={() => this.checkSession()}>
          <Col sm={2}>
            <br />
            <Row>
              <Container>
                <h1 className="title-font">?????????????????????</h1>
                <br />
              </Container>
            </Row>
            <Row>
              <Col>
                <ListGroup>
                  <Accordion className="menuCol">
                    <ListGroup.Item
                      style={
                        this.state.hover.search("?????????BP") !== -1
                          ? menuStyleHover
                          : menuStyle
                      }
                      data-place="right"
                      data-type="info"
                      data-tip=""
                      data-for="?????????BP"
                      data-class="my-tabcolor"
                      data-effect="solid"
                      onMouseEnter={this.toggleHover.bind(this, "?????????BP")}
                      onMouseLeave={this.toggleHover.bind(this, "")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="0"
                        onClick={this.changePage.bind(this, "?????????BP")}
                      >
                        <font
                          className={
                            this.state.hover.search("?????????BP") !== -1 ||
                            this.state.className.search("?????????BP") !== -1
                              ? "linkFont-click"
                              : "linkFont"
                          }
                        >
                          <FontAwesomeIcon
                            className="fa-fw"
                            size="lg"
                            icon={faAddressBook}
                          />{" "}
                          ?????????BP
                        </font>
                      </Accordion.Toggle>
                      <ReactTooltip
                        id="?????????BP"
                        delayUpdate={1000}
                        getContent={() => {
                          return (
                            <div
                              onClick={this.setClassName.bind(this, "?????????BP")}
                            >
                              <ListGroup>
                                <Accordion className="menuCol">
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("1") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????BP-1"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????BP"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname:
                                        "/subMenuManager/employeeInsertNew",
                                      state: { actionType: "insert" },
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("1") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to={{
                                          pathname:
                                            "/subMenuManager/employeeInsertNew",
                                          state: { actionType: "insert" },
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faSave}
                                        />{" "}
                                        ?????????BP??????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("2") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????BP-2"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????BP"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname:
                                        "/subMenuManager/employeeSearch",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("2") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/employeeSearch"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faSearch}
                                        />{" "}
                                        ?????????BP??????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("3") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????BP-3"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????BP"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname:
                                        "/subMenuManager/employeeInformation",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("3") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/employeeInformation"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faSearchMinus}
                                        />{" "}
                                        ??????????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("4") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????BP-4"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????BP"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname:
                                        "/subMenuManager/certificatePrinting",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("4") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/certificatePrinting"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faDownload}
                                        />{" "}
                                        ???????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("5") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????BP-5"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????BP"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname:
                                        "/subMenuManager/envelopePrinting",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("5") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/envelopePrinting"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faDownload}
                                        />{" "}
                                        ????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("6") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????BP-6"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????BP"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname:
                                        "/subMenuManager/salaryDetailSend",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("6") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/salaryDetailSend"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faPaperPlane}
                                        />{" "}
                                        ??????????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("7") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????BP-7"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????BP"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname: "/subMenuManager/sendInvoice",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("7") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/sendInvoice"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faFileInvoiceDollar}
                                        />{" "}
                                        ???????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                </Accordion>
                              </ListGroup>
                            </div>
                          );
                        }}
                      />
                      {/*<Accordion.Collapse eventKey="0">
												<ListGroup>
													<ListGroup.Item style={menuStyle}>
														<Link className={this.state.click==="?????????BP??????"?"linkFont-click":"linkFont"} onClick={() => this.click('?????????BP??????')} to={{ pathname: '/subMenuManager/employeeInsertNew', state: { actionType: 'insert' } }}>
															<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave}/>?????????BP??????</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="?????????BP??????"?"linkFont-click":"linkFont"} onClick={() => this.click('?????????BP??????')} to="/subMenuManager/employeeSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />?????????BP??????</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/employeeInformation">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />??????????????????</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="???????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('???????????????')} to="/subMenuManager/certificatePrinting">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faDownload} />???????????????</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>*/}
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={
                        this.state.hover.search("??????") !== -1
                          ? menuStyleHover
                          : menuStyle
                      }
                      data-place="right"
                      data-type="info"
                      data-tip=""
                      data-for="??????"
                      data-class="my-tabcolor"
                      data-effect="solid"
                      onMouseEnter={this.toggleHover.bind(this, "??????")}
                      onMouseLeave={this.toggleHover.bind(this, "")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="1"
                        onClick={this.changePage.bind(this, "??????")}
                      >
                        <font
                          className={
                            this.state.hover.search("??????") !== -1 ||
                            this.state.className.search("??????") !== -1
                              ? "linkFont-click"
                              : "linkFont"
                          }
                          onClick={() => this.click("??????")}
                        >
                          <FontAwesomeIcon
                            className="fa-fw"
                            size="lg"
                            icon={faHome}
                          />{" "}
                          ??????
                        </font>
                      </Accordion.Toggle>
                      <ReactTooltip
                        id="??????"
                        delayUpdate={1000}
                        getContent={() => {
                          return (
                            <div onClick={this.setClassName.bind(this, "??????")}>
                              <ListGroup>
                                <Accordion className="menuCol">
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("1") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "??????-1"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "??????"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname: "/subMenuManager/siteInfo",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("1") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/siteInfo"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faSave}
                                        />{" "}
                                        ??????????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("2") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "??????-2"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "??????"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname: "/subMenuManager/siteSearch",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("2") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/siteSearch"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faSearch}
                                        />{" "}
                                        ??????????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                </Accordion>
                              </ListGroup>
                            </div>
                          );
                        }}
                      />
                      {/*<Accordion.Collapse eventKey="1">
												<ListGroup >
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/siteInfo">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />??????????????????</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/siteSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />??????????????????</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>*/}
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={
                        this.state.hover.search("?????????") !== -1
                          ? menuStyleHover
                          : menuStyle
                      }
                      data-place="right"
                      data-type="info"
                      data-tip=""
                      data-for="?????????"
                      data-class="my-tabcolor"
                      data-effect="solid"
                      onMouseEnter={this.toggleHover.bind(this, "?????????")}
                      onMouseLeave={this.toggleHover.bind(this, "")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="2"
                        onClick={this.changePage.bind(this, "?????????")}
                      >
                        <font
                          className={
                            this.state.hover.search("?????????") !== -1 ||
                            this.state.className.search("?????????") !== -1
                              ? "linkFont-click"
                              : "linkFont"
                          }
                          onClick={() => this.click("?????????")}
                        >
                          <FontAwesomeIcon
                            className="fa-fw"
                            size="lg"
                            icon={faUsers}
                          />{" "}
                          ?????????
                        </font>
                      </Accordion.Toggle>
                      <ReactTooltip
                        id="?????????"
                        delayUpdate={1000}
                        getContent={() => {
                          return (
                            <div
                              onClick={this.setClassName.bind(this, "?????????")}
                            >
                              <ListGroup>
                                <Accordion className="menuCol">
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("1") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????-1"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????"
                                    )}
                                    onClick={this.shuseiTo.bind(
                                      this,
                                      customerInfoPath
                                    )}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("1") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to={customerInfoPath}
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faSave}
                                        />{" "}
                                        ?????????????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item
                                    style={
                                      this.state.hover.search("2") !== -1
                                        ? subMenuHover
                                        : subMenu
                                    }
                                    onMouseEnter={this.toggleHover.bind(
                                      this,
                                      "?????????-2"
                                    )}
                                    onMouseLeave={this.toggleHover.bind(
                                      this,
                                      "?????????"
                                    )}
                                    onClick={this.shuseiTo.bind(this, {
                                      pathname:
                                        "/subMenuManager/customerInfoSearch",
                                    })}
                                  >
                                    <div>
                                      <Link
                                        className={
                                          this.state.hover.search("2") !== -1
                                            ? "my-tabcolor-font-hover"
                                            : "my-tabcolor-font"
                                        }
                                        to="/subMenuManager/customerInfoSearch"
                                      >
                                        <FontAwesomeIcon
                                          className="fa-fw"
                                          size="lg"
                                          icon={faSearch}
                                        />{" "}
                                        ?????????????????????
                                      </Link>
                                    </div>
                                  </ListGroup.Item>
                                </Accordion>
                              </ListGroup>
                            </div>
                          );
                        }}
                      />
                      {/*<Accordion.Collapse eventKey="2">
												<ListGroup variant="flush">
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="?????????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('?????????????????????')} to={customerInfoPath}>
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />?????????????????????</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="?????????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('?????????????????????')} to="/subMenuManager/customerInfoSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />?????????????????????</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>*/}
                    </ListGroup.Item>
                    {authorityCode !== "2" ? (
                      authorityCode !== "3" ? (
                        <ListGroup.Item
                          style={
                            this.state.hover.search("???????????????") !== -1
                              ? menuStyleHover
                              : menuStyle
                          }
                          data-place="right"
                          data-type="info"
                          data-tip=""
                          data-for="???????????????"
                          data-class="my-tabcolor"
                          data-effect="solid"
                          onMouseEnter={this.toggleHover.bind(
                            this,
                            "???????????????"
                          )}
                          onMouseLeave={this.toggleHover.bind(this, "")}
                        >
                          <Accordion.Toggle
                            as={Button}
                            variant="link"
                            eventKey="3"
                            onClick={this.changePage.bind(this, "???????????????")}
                          >
                            <font
                              className={
                                this.state.hover.search("???????????????") !== -1 ||
                                this.state.className.search("???????????????") !== -1
                                  ? "linkFont-click"
                                  : "linkFont"
                              }
                              onClick={() => this.click("???????????????")}
                            >
                              <FontAwesomeIcon
                                className="fa-fw"
                                size="lg"
                                icon={faYenSign}
                              />{" "}
                              ???????????????
                            </font>
                          </Accordion.Toggle>
                          <ReactTooltip
                            id="???????????????"
                            delayUpdate={1000}
                            getContent={() => {
                              return (
                                <div
                                  onClick={this.setClassName.bind(
                                    this,
                                    "???????????????"
                                  )}
                                >
                                  <ListGroup>
                                    <Accordion className="menuCol">
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("1") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "???????????????-1"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "???????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname: "/subMenuManager/wagesInfo",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("1") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/wagesInfo"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faCommentDollar}
                                            />{" "}
                                            ????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("2") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "???????????????-2"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "???????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname:
                                            "/subMenuManager/individualSales",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("2") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/individualSales"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faList}
                                            />{" "}
                                            ??????????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("3") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "???????????????-3"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "???????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname:
                                            "/subMenuManager/monthlySalesSearch",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("3") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/monthlySalesSearch"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faSearchMinus}
                                            />{" "}
                                            ??????????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("4") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "???????????????-4"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "???????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname:
                                            "/subMenuManager/individualCustomerSales",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("4") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/individualCustomerSales"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faSearch}
                                            />{" "}
                                            ?????????????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("5") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "???????????????-5"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "???????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname:
                                            "/subMenuManager/customerSalesList",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("5") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/customerSalesList"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faSearchMinus}
                                            />{" "}
                                            ?????????????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("6") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "???????????????-6"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "???????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname:
                                            "/subMenuManager/profitChartist",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("6") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/profitChartist"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faChartBar}
                                            />{" "}
                                            ???????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                    </Accordion>
                                  </ListGroup>
                                </div>
                              );
                            }}
                          />
                          {/*<Accordion.Collapse eventKey="3">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('????????????')} to="/subMenuManager/wagesInfo">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCommentDollar} />????????????</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/individualSales">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faList} />??????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/monthlySalesSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />??????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="?????????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('?????????????????????')} to="/subMenuManager/individualCustomerSales">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />?????????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="?????????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('?????????????????????')} to="/subMenuManager/customerSalesList">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />?????????????????????</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
                        </ListGroup.Item>
                      ) : null
                    ) : null}
                    {authorityCode !== "2" ? (
                      <ListGroup.Item
                        style={
                          this.state.hover.search("????????????") !== -1
                            ? menuStyleHover
                            : menuStyle
                        }
                        data-place="right"
                        data-type="info"
                        data-tip=""
                        data-for="????????????"
                        data-class="my-tabcolor"
                        data-effect="solid"
                        onMouseEnter={this.toggleHover.bind(this, "????????????")}
                        onMouseLeave={this.toggleHover.bind(this, "")}
                      >
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="4"
                          onClick={this.changePage.bind(this, "????????????")}
                        >
                          <font
                            className={
                              this.state.hover.search("????????????") !== -1 ||
                              this.state.className.search("????????????") !== -1
                                ? "linkFont-click"
                                : "linkFont"
                            }
                            onClick={() => this.click("????????????")}
                          >
                            <FontAwesomeIcon
                              className="fa-fw"
                              size="lg"
                              icon={faPaperPlane}
                            />{" "}
                            ????????????
                          </font>
                        </Accordion.Toggle>
                        <ReactTooltip
                          id="????????????"
                          delayUpdate={1000}
                          getContent={() => {
                            return (
                              <div
                                onClick={this.setClassName.bind(
                                  this,
                                  "????????????"
                                )}
                              >
                                <ListGroup>
                                  <Accordion className="menuCol">
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("1") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-1"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname:
                                          "/subMenuManager/manageSituation",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("1") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/manageSituation"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faNewspaper}
                                          />{" "}
                                          ??????????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("2") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-2"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname:
                                          "/subMenuManager/salesSendLetter",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("2") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/salesSendLetter"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faCheckSquare}
                                          />{" "}
                                          ???????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("3") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-3"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(
                                        this,
                                        projectInfoPath
                                      )}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("3") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to={projectInfoPath}
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faSave}
                                          />{" "}
                                          ????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("4") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-4"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname:
                                          "/subMenuManager/projectInfoSearch",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("4") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/projectInfoSearch"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faSearchMinus}
                                          />{" "}
                                          ????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                  </Accordion>
                                </ListGroup>
                              </div>
                            );
                          }}
                        />
                        {/*<Accordion.Collapse eventKey="4">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/manageSituation">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faNewspaper} />??????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="???????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('???????????????')} to="/subMenuManager/salesSendLetter">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} />???????????????</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('????????????')} to={projectInfoPath}>
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />????????????</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('????????????')} to="/subMenuManager/projectInfoSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />????????????</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
                      </ListGroup.Item>
                    ) : null}
                    {authorityCode !== "2" ? (
                      <ListGroup.Item
                        style={
                          this.state.hover.search("????????????") !== -1
                            ? menuStyleHover
                            : menuStyle
                        }
                        data-place="right"
                        data-type="info"
                        data-tip=""
                        data-for="????????????"
                        data-class="my-tabcolor"
                        data-effect="solid"
                        onMouseEnter={this.toggleHover.bind(this, "????????????")}
                        onMouseLeave={this.toggleHover.bind(this, "")}
                      >
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="5"
                          onClick={this.changePage.bind(this, "????????????")}
                        >
                          <font
                            className={
                              this.state.hover.search("????????????") !== -1 ||
                              this.state.className.search("????????????") !== -1
                                ? "linkFont-click"
                                : "linkFont"
                            }
                            onClick={() => this.click("????????????")}
                          >
                            <FontAwesomeIcon
                              className="fa-fw"
                              size="lg"
                              icon={faBuilding}
                            />{" "}
                            ????????????
                          </font>
                        </Accordion.Toggle>
                        <ReactTooltip
                          id="????????????"
                          delayUpdate={1000}
                          getContent={() => {
                            return (
                              <div
                                onClick={this.setClassName.bind(
                                  this,
                                  "????????????"
                                )}
                              >
                                <ListGroup>
                                  <Accordion className="menuCol">
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("1") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-1"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname:
                                          "/subMenuManager/salesPointSet",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("1") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/salesPointSet"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faFilePowerpoint}
                                          />{" "}
                                          ??????????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("2") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-2"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname: "/subMenuManager/salesProfit",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("2") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/salesProfit"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faChartPie}
                                          />{" "}
                                          ??????????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("3") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-3"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname: "/subMenuManager/salesPoint",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("3") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/salesPoint"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faBars}
                                          />{" "}
                                          ??????????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                  </Accordion>
                                </ListGroup>
                              </div>
                            );
                          }}
                        />
                        {/*<Accordion.Collapse eventKey="5">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/salesPointSet">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faFilePowerpoint} color="rgb(247, 226, 248)"/>??????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/salesProfit">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faChartPie} />??????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/salesPoint">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faBars} />??????????????????</Link></ListGroup.Item>										</ListGroup>
													</Accordion.Collapse>*/}
                      </ListGroup.Item>
                    ) : null}
                    {authorityCode !== "2" ? (
                      <ListGroup.Item
                        style={
                          this.state.hover.search("??????") !== -1
                            ? menuStyleHover
                            : menuStyle
                        }
                        data-place="right"
                        data-type="info"
                        data-tip=""
                        data-for="??????"
                        data-class="my-tabcolor"
                        data-effect="solid"
                        onMouseEnter={this.toggleHover.bind(this, "??????")}
                        onMouseLeave={this.toggleHover.bind(this, "")}
                      >
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="6"
                          onClick={this.changePage.bind(this, "??????")}
                        >
                          <font
                            className={
                              this.state.hover.search("??????") !== -1 ||
                              this.state.className.search("??????") !== -1
                                ? "linkFont-click"
                                : "linkFont"
                            }
                            onClick={() => this.click("??????")}
                          >
                            <FontAwesomeIcon
                              className="fa-fw"
                              size="lg"
                              icon={faCalendar}
                            />{" "}
                            ??????
                          </font>
                        </Accordion.Toggle>
                        <ReactTooltip
                          id="??????"
                          delayUpdate={1000}
                          getContent={() => {
                            return (
                              <div
                                onClick={this.setClassName.bind(this, "??????")}
                              >
                                <ListGroup>
                                  <Accordion className="menuCol">
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("1") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "??????-1"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "??????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname:
                                          "/subMenuManager/dutyManagement",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("1") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/dutyManagement"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faSave}
                                          />{" "}
                                          ????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("2") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "??????-2"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "??????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname: "/subMenuManager/sendRepot",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("2") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/sendRepot"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faCheckSquare}
                                          />{" "}
                                          ???????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                  </Accordion>
                                </ListGroup>
                              </div>
                            );
                          }}
                        />
                        {/*<Accordion.Collapse eventKey="6">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('????????????')} to="/subMenuManager/dutyManagement">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />????????????</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="???????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('???????????????')} to="/subMenuManager/sendRepot">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} />???????????????</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
                      </ListGroup.Item>
                    ) : null}
                    {authorityCode !== "2" ? (
                      authorityCode !== "3" ? (
                        <ListGroup.Item
                          style={
                            this.state.hover.search("????????????") !== -1
                              ? menuStyleHover
                              : menuStyle
                          }
                          data-place="right"
                          data-type="info"
                          data-tip=""
                          data-for="????????????"
                          data-class="my-tabcolor"
                          data-effect="solid"
                          onMouseEnter={this.toggleHover.bind(this, "????????????")}
                          onMouseLeave={this.toggleHover.bind(this, "")}
                        >
                          <Accordion.Toggle
                            as={Button}
                            variant="link"
                            eventKey="7"
                            onClick={this.changePage.bind(this, "????????????")}
                          >
                            <font
                              className={
                                this.state.hover.search("????????????") !== -1 ||
                                this.state.className.search("????????????") !== -1
                                  ? "linkFont-click"
                                  : "linkFont"
                              }
                              onClick={() => this.click("????????????")}
                            >
                              <FontAwesomeIcon
                                className="fa-fw"
                                size="lg"
                                icon={faCalendarAlt}
                              />{" "}
                              ????????????
                            </font>
                          </Accordion.Toggle>
                          <ReactTooltip
                            id="????????????"
                            delayUpdate={1000}
                            getContent={() => {
                              return (
                                <div
                                  onClick={this.setClassName.bind(
                                    this,
                                    "????????????"
                                  )}
                                >
                                  <ListGroup>
                                    <Accordion className="menuCol">
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("1") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "????????????-1"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname:
                                            "/subMenuManager/situationChange",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("1") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/situationChange"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faSearchMinus}
                                            />{" "}
                                            ??????????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                      <ListGroup.Item
                                        style={
                                          this.state.hover.search("2") !== -1
                                            ? subMenuHover
                                            : subMenu
                                        }
                                        onMouseEnter={this.toggleHover.bind(
                                          this,
                                          "????????????-2"
                                        )}
                                        onMouseLeave={this.toggleHover.bind(
                                          this,
                                          "????????????"
                                        )}
                                        onClick={this.shuseiTo.bind(this, {
                                          pathname:
                                            "/subMenuManager/enterPeriodSearch",
                                        })}
                                      >
                                        <div>
                                          <Link
                                            className={
                                              this.state.hover.search("2") !==
                                              -1
                                                ? "my-tabcolor-font-hover"
                                                : "my-tabcolor-font"
                                            }
                                            to="/subMenuManager/enterPeriodSearch"
                                          >
                                            <FontAwesomeIcon
                                              className="fa-fw"
                                              size="lg"
                                              icon={faSearchMinus}
                                            />{" "}
                                            ????????????
                                          </Link>
                                        </div>
                                      </ListGroup.Item>
                                    </Accordion>
                                  </ListGroup>
                                </div>
                              );
                            }}
                          />
                          {/*<Accordion.Collapse eventKey="7">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/situationChange">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />??????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('????????????')} to="/subMenuManager/enterPeriodSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />????????????</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
                        </ListGroup.Item>
                      ) : null
                    ) : null}
                    {authorityCode !== "2" ? (
                      <ListGroup.Item
                        style={
                          this.state.hover.search("????????????") !== -1
                            ? menuStyleHover
                            : menuStyle
                        }
                        data-place="right"
                        data-type="info"
                        data-tip=""
                        data-for="????????????"
                        data-class="my-tabcolor"
                        data-effect="solid"
                        onMouseEnter={this.toggleHover.bind(this, "????????????")}
                        onMouseLeave={this.toggleHover.bind(this, "")}
                      >
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="8"
                          onClick={this.changePage.bind(this, "????????????")}
                        >
                          <font
                            className={
                              this.state.hover.search("????????????") !== -1 ||
                              this.state.className.search("????????????") !== -1
                                ? "linkFont-click"
                                : "linkFont"
                            }
                            onClick={() => this.click("????????????")}
                          >
                            <FontAwesomeIcon
                              className="fa-fw"
                              size="lg"
                              icon={faThList}
                            />{" "}
                            ????????????
                          </font>
                        </Accordion.Toggle>
                        <ReactTooltip
                          id="????????????"
                          delayUpdate={1000}
                          getContent={() => {
                            return (
                              <div
                                onClick={this.setClassName.bind(
                                  this,
                                  "????????????"
                                )}
                              >
                                <ListGroup>
                                  <Accordion className="menuCol">
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("1") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-1"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname:
                                          "/subMenuManager/masterInsert",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("1") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/masterInsert"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faSave}
                                          />{" "}
                                          ??????????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("2") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "????????????-2"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname:
                                          "/subMenuManager/masterUpdate",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("2") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/masterUpdate"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faSearch}
                                          />{" "}
                                          ??????????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                  </Accordion>
                                </ListGroup>
                              </div>
                            );
                          }}
                        />
                        {/*<Accordion.Collapse eventKey="8">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/masterInsert">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />??????????????????</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/masterUpdate">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />??????????????????</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
                      </ListGroup.Item>
                    ) : null}
                    {authorityCode !== "2" ? (
                      <ListGroup.Item
                        style={
                          this.state.hover.search("???????????????") !== -1
                            ? menuStyleHover
                            : menuStyle
                        }
                        data-place="right"
                        data-type="info"
                        data-tip=""
                        data-for="???????????????"
                        data-class="my-tabcolor"
                        data-effect="solid"
                        onMouseEnter={this.toggleHover.bind(this, "???????????????")}
                        onMouseLeave={this.toggleHover.bind(this, "")}
                      >
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="9"
                          onClick={this.changePage.bind(this, "???????????????")}
                        >
                          <font
                            className={
                              this.state.hover.search("???????????????") !== -1 ||
                              this.state.className.search("???????????????") !== -1
                                ? "linkFont-click"
                                : "linkFont"
                            }
                            onClick={() => this.click("???????????????")}
                          >
                            <FontAwesomeIcon
                              className="fa-fw"
                              size="lg"
                              icon={faCogs}
                            />{" "}
                            ???????????????
                          </font>
                        </Accordion.Toggle>
                        <ReactTooltip
                          id="???????????????"
                          delayUpdate={1000}
                          getContent={() => {
                            return (
                              <div
                                onClick={this.setClassName.bind(
                                  this,
                                  "???????????????"
                                )}
                              >
                                <ListGroup>
                                  <Accordion className="menuCol">
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("1") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "???????????????-1"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "???????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname: "/subMenuManager/dataShare",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("1") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/dataShare"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faFileContract}
                                          />{" "}
                                          ????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                      style={
                                        this.state.hover.search("2") !== -1
                                          ? subMenuHover
                                          : subMenu
                                      }
                                      onMouseEnter={this.toggleHover.bind(
                                        this,
                                        "???????????????-2"
                                      )}
                                      onMouseLeave={this.toggleHover.bind(
                                        this,
                                        "???????????????"
                                      )}
                                      onClick={this.shuseiTo.bind(this, {
                                        pathname: "/subMenuManager/systemSet",
                                      })}
                                    >
                                      <div>
                                        <Link
                                          className={
                                            this.state.hover.search("2") !== -1
                                              ? "my-tabcolor-font-hover"
                                              : "my-tabcolor-font"
                                          }
                                          to="/subMenuManager/systemSet"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-fw"
                                            size="lg"
                                            icon={faCog}
                                          />{" "}
                                          ??????????????????
                                        </Link>
                                      </div>
                                    </ListGroup.Item>
                                  </Accordion>
                                </ListGroup>
                              </div>
                            );
                          }}
                        />
                        {/*<Accordion.Collapse eventKey="9">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="??????????????????"?"linkFont-click":"linkFont"} onClick={() => this.click('??????????????????')} to="/subMenuManager/systemSet">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCog} />??????????????????</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
                      </ListGroup.Item>
                    ) : null}
                  </Accordion>
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col
            sm={9}
            id="page"
            style={{ backgroundColor: this.state.backgroundColor }}
          >
            <div key={this.props.location.key}>
              <br />
              <Router>
                <Route
                  exact
                  path={`${this.props.match.url}/`}
                  component={EmployeeSearch}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeInsert`}
                  component={EmployeeInsert}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeInsertNew`}
                  component={EmployeeInsertNew}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeSearch`}
                  component={EmployeeSearch}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeInformation`}
                  component={EmployeeInformation}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/certificatePrinting`}
                  component={CertificatePrinting}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/envelopePrinting`}
                  component={EnvelopePrinting}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/dutyManagement`}
                  component={dutyManagement}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/customerInfo`}
                  component={CustomerInfo}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/siteInfo`}
                  component={siteInfo}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/sendInvoice`}
                  component={sendInvoice}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/invoicePDF`}
                  component={invoicePDF}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/siteSearch`}
                  component={siteSearch}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/customerInfoSearch`}
                  component={CustomerInfoSearch}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/manageSituation`}
                  component={ManageSituation}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/sendRepot`}
                  component={SendRepot}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/dutyRegistration`}
                  component={DutyRegistration}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/breakTime`}
                  component={BreakTime}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/salesSendLetter`}
                  component={salesSendLetter}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/individualSales`}
                  component={individualSales}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/wagesInfo`}
                  component={WagesInfo}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/workRepot`}
                  component={workRepot}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/costRegistration`}
                  component={costRegistration}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/monthlySalesSearch`}
                  component={monthlySalesSearch}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/salaryDetailSend`}
                  component={salaryDetailSend}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/salesPointSet`}
                  component={salesPointSet}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/salesProfit`}
                  component={salesProfit}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/salesPoint`}
                  component={salesPoint}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/enterPeriodSearch`}
                  component={EnterPeriodSearch}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/sendLettersConfirm`}
                  component={sendLettersConfirm}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/sendLettersMatter`}
                  component={sendLettersMatter}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/sendRepotConfirm`}
                  component={sendRepotConfirm}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/situationChange`}
                  component={situationChange}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeUpdate`}
                  component={EmployeeUpdate}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeUpdateNew`}
                  component={EmployeeUpdateNew}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeDetail`}
                  component={EmployeeDetail}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/employeeDetailNew`}
                  component={EmployeeDetailNew}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/projectInfo`}
                  component={projectInfo}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/projectInfoSearch`}
                  component={ProjectInfoSearch}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/individualCustomerSales`}
                  component={IndividualCustomerSales}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/customerSalesList`}
                  component={customerSalesList}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/dataShare`}
                  component={dataShare}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/systemSet`}
                  component={systemSet}
                />
                <Route
                  exact
                  path={`${this.props.match.url}/profitChartist`}
                  component={profitChartist}
                />

                <div className="container col-8">
                  <div className="container col-10">
                    <Route
                      exact
                      path={`${this.props.match.url}/masterInsert`}
                      component={masterInsert}
                    />
                    <Route
                      exact
                      path={`${this.props.match.url}/masterUpdate`}
                      component={masterUpdate}
                    />
                  </div>
                </div>
              </Router>
            </div>
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}
export default connect(
  (state) => {
    return {
      state,
    };
  },
  (dispatch) => {
    return {
      updateInitEmployee: (data) => {
        dispatch({ type: "UPDATE_INIT_EMPLOYEE", data });
      },
    };
  }
)(SubMenu);
