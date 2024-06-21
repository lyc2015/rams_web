// SubMenu.js
import React, { Component } from "react";
import { Row, Col, ListGroup, Accordion, Container } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import MenuItem from "../../components/SubMenu/MenuItem";
import Header from "../../components/Header";
import Routes from "../../components/SubMenu/SubPageRouter";
import {
  faUsers,
  faSave,
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
        text: "従業員",
        eventKey: "2",
        subMenuItems: [
          {
            key: "従業員-1",
            label: "従業員登録",
            icon: faSave,
            path: "/submenu/employeeInsertNew",
          },
          {
            key: "従業員-2",
            label: "従業員検索",
            icon: faSave,
            path: "/submenu/employeeSearch",
          },
        ]
      },
      {
        icon: faUsers,
        text: "お客様",
        eventKey: "2",
        subMenuItems: [
          {
            key: "お客様-1",
            label: "お客様登録",
            icon: faSave,
            path: "/submenu/employeeInsertNew",
          },
          {
            key: "お客様-2",
            label: "お客様検索",
            icon: faSave,
            path: "/submenu/employeeSearch",
          },
        ]
      },
      {
        icon: faUsers,
        text: "売上情報・賃貸",
        eventKey: "2",
        subMenuItems: [
          {
            key: "売上情報・賃貸-1",
            label: "売上情報登録(賃貸)",
            icon: faSave,
            path: "/submenu/salesInfo",
          },
          {
            key: "売上情報・賃貸-2",
            label: "売上情報検索(賃貸)",
            icon: faSave,
            path: "/submenu/salesInfoSearch",
          },
        ]
      },
      {
        icon: faUsers,
        text: "売上情報・贩壳",
        eventKey: "2",
        subMenuItems: [
          {
            key: "売上情報・贩壳-1",
            label: "売上情報登録(贩壳)",
            icon: faSave,
            path: "/submenu/employeeInsertNew",
          },
          {
            key: "売上情報・贩壳-2",
            label: "売上情報検索(贩壳)",
            icon: faSave,
            path: "/submenu/employeeSearch",
          },
        ]
      },
      {
        icon: faUsers,
        text: "管理会社",
        eventKey: "2",
        subMenuItems: [
          {
            key: "管理会社-1",
            label: "管理会社登録",
            icon: faSave,
            path: "/submenu/managementCompanyRegister",
          },
          {
            key: "管理会社-2",
            label: "管理会社検索",
            icon: faSave,
            path: "/submenu/managementCompanySearch",
          },
        ]
      },
    ];

    return (
      <div className="mainBodyMinWidth">
        <Router>
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
                  <Routes match={this.props.match} />
              </div>
            </Col>
          </Row>
        </Router>

      </div>
    );
  }
}

export default SubMenu;
