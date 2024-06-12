// SubMenu.js
import React, { Component } from "react";
import { Row, Col, ListGroup, Accordion, Container } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import MenuItem from "../../components/SubMenuInfo/MenuItem";
import Header from "../../components/Header";
import Routes from "../../components/SubMenuInfo/SubPageRouter";
import {
  faUsers,
  faSave,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";

class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowDate: new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      isMobileDevice: false,
      hover: "", 
      className: "", 
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

  render() {
    const { isMobileDevice, nowDate, hover } = this.state;
    const menuItems = [
      {
        icon: faUsers,
        text: "お客様",
        eventKey: "2",
        subMenuItems: [
          {
            key: "お客様-1",
            label: "お客様情報登録",
            icon: faSave,
            path: "/submenu/employeeInsertNew",
            onMouseEnter: () => this.toggleHover("お客様-1"),
            onMouseLeave: () => this.toggleHover("お客様"),
            onClick: () => this.changePage("お客様情報登録")
          },
        ]
      },
      // Add other menu items here
    ];

    return (
      <div className="mainBodyMinWidth">
        <div className="mainBody"></div>
        <Row className="myCss employeeNavBar">
          <Col sm={11}>
            <Header nowDate={nowDate} isMobileDevice={isMobileDevice} />
          </Col>
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
                    {menuItems.map((item, index) => (
                      <MenuItem
                        key={index}
                        icon={item.icon}
                        text={item.text}
                        eventKey={item.eventKey}
                        isHover={hover === item.text}
                        onMouseEnter={() => this.toggleHover(item.text)}
                        onMouseLeave={() => this.toggleHover("")}
                        onClick={() => this.changePage(item.text)}
                        subMenuItems={item.subMenuItems}
                      />
                    ))}
                  </Accordion>
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col sm={10}>
            <div id="page" style={{ marginRight: 15 }}>
              <br />
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
