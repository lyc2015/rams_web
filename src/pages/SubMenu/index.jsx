import React, { Component } from "react";
import { Row, Col, ListGroup, Accordion, Button, Navbar, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareLeft, faAddressBook, faHome, faUser, faUsers, faYenSign, faPaperPlane, faBuilding, faCalendar, faCalendarAlt, faThList, faCogs } from "@fortawesome/free-solid-svg-icons";
import title from "../../asserts/images/LYCmark.png";
import { Link } from "react-router-dom";

import "./index.css";
import Routes from "../../components/SubMenuInfo/SubPageRouter";
import { BrowserRouter as Router } from "react-router-dom";

class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowDate: new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      isMobileDevice: false, // Assume a state for mobile device check
    };
  }

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
    this.setClassName(name);
  };


  renderTop = () => {
    const { isMobileDevice, nowDate } = this.state;
    return (
      <div className="header-container">
        <div className="df justify-between">
          <Navbar inline="true">
            <img
              className={"titleImg " + (isMobileDevice ? "w40" : "")}
              alt="title"
              src={title}
            />
            <span className={"loginMark " + (isMobileDevice ? "fz30" : "")}>
              LYC株式会社
            </span>
          </Navbar>
        </div>
        <div className="df justify-end header-info">
          <div className={"loginPeople df " + (isMobileDevice ? "fz12" : "")}>
            {nowDate}{" "}
            <FontAwesomeIcon className="fa-fw" size="lg" icon={faUser} />
            スーパ管理 : 社員 - 斉藤真一
          </div>
          <Link
            as="button"
            className={"loginPeople " + (isMobileDevice ? "fz12" : "")}
            to="/"
            id="logout"
          >
            <FontAwesomeIcon className="fa-fw" size="lg" icon={faCaretSquareLeft} />
            sign out
          </Link>
        </div>
      </div>
    );
  };

  render() {
    const menuStyle = {
      borderBottom: "0.1px solid #167887",
      backgroundColor: "#17a2b8",
    };
    const menuStyleHover = {
      borderBottom: "0.1px solid #167887",
      backgroundColor: "#188596",
    };

    return (
      <div className="mainBodyMinWidth">
        <div className="mainBody"></div>
        <Row className="myCss employeeNavBar">
          <Col sm={11}>{this.renderTop()}</Col>
          <Col sm={1}></Col>
        </Row>
        <Row>
          <Col sm={2}>
            <br />
            <Row>
              <Container>
                <h1 className="title-font">社員・営業管理</h1>
                <br />
              </Container>
            </Row>
            <Row>
              <Col>
                <ListGroup>
                  <Accordion className="menuCol">
                    <ListGroup.Item
                      style={this.state.hover === "社員・BP" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("社員・BP")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="0"
                        onClick={() => this.changePage("社員・BP")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faAddressBook} /> 社員・BP
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "現場" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("現場")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="1"
                        onClick={() => this.changePage("現場")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faHome} /> 現場
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "お客様" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("お客様")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="2"
                        onClick={() => this.changePage("お客様")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faUsers} /> お客様
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "給料・売上" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("給料・売上")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="3"
                        onClick={() => this.changePage("給料・売上")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faYenSign} /> 給料・売上
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "営業送信" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("営業送信")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="4"
                        onClick={() => this.changePage("営業送信")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faPaperPlane} /> 営業送信
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "営業管理" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("営業管理")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="5"
                        onClick={() => this.changePage("営業管理")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faBuilding} /> 営業管理
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "勤務" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("勤務")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="6"
                        onClick={() => this.changePage("勤務")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendar} /> 勤務
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "期限確認" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("期限確認")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="7"
                        onClick={() => this.changePage("期限確認")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendarAlt} /> 期限確認
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "マスター" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("マスター")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="8"
                        onClick={() => this.changePage("マスター")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faThList} /> マスター
                      </Accordion.Toggle>
                    </ListGroup.Item>
                    <ListGroup.Item
                      style={this.state.hover === "設定・共有" ? menuStyleHover : menuStyle}
                      onMouseEnter={() => this.toggleHover("設定・共有")}
                      onMouseLeave={() => this.toggleHover("")}
                    >
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="9"
                        onClick={() => this.changePage("設定・共有")}
                      >
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={faCogs} /> 設定・共有
                      </Accordion.Toggle>
                    </ListGroup.Item>
                  </Accordion>
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col sm={10}>
            <div 
              id = "page"
              style = {{ marginRight: 15 }}
            >
              <br />
              {/* Add your routes or components here */}
              <Router>
                <Routes match={this.props.match} />
              </Router>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SubMenu;
