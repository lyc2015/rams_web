import React, { Component } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";

import "./index.css";
import title from "../../assets/images/LYCmark.png";
import request from "../../service/request";

import { message } from "antd"

/**
 * 管理者ログイン画面
 */ 
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: "SMSを発信する",
      btnDisable: false,
      time: 60,
      pic: title,
      remberPassWord: false,
      companyName: "LYC"
    };
  }

  componentDidMount() {
    this.loadAccountInfo();
  }

  loadAccountInfo = () => {
    // 读取Cookie逻辑
  };

  /**
   * ログイン処理
   */
  login = () => { 
    var loginModel = {
      employeeNo: document.getElementById("employeeNo").value,
      password: document.getElementById("password").value,
      verificationCode: document.getElementById("verificationCode").value,
    };
    request.post("login/login", loginModel)
      .then((res) => {
        console.log("res---", res);
        message.success("success")
        window.location.href = "/submenu";
      })
      .catch((error) => {
        message.error("fail")
      });
  };

  handleChecked = () => {
    this.setState({
      remberPassWord: !this.state.remberPassWord,
    });
  };

  render() {
    const sendCode = () => {
      // 发送验证码逻辑
    };

    return (
      <div className="loginBody">
        <div style={{ marginTop: "10%" }}>
          <div style={{ textAlign: "center" }}>
            <img className="mb-4" alt="title" src={this.state.pic} style={{ width: "65px" }} />
            {"   "}
            <a className="loginMark" href="https://example.com">{this.state.companyName}</a>
          </div>  
          <Form className="form-signin" id="loginForm">
            <Form.Group>
              <Form.Control
                id="employeeNo"
                name="employeeNo"
                maxLength="6"
                type="text"
                placeholder="社员番号"
                required
              />
              <Form.Control
                id="password"
                name="password"
                maxLength="12"
                type="password"
                placeholder="Password"
                required
              />
            </Form.Group>
            <InputGroup className="mb-3" size="sm">
              <FormControl
                size="sm"
                placeholder="検証番号"
                id="verificationCode"
                name="verificationCode"
                readOnly
                required
              />
              <InputGroup.Append>
                <Button
                  size="sm"
                  variant="info"
                  id="sendVerificationCode"
                  disabled={this.state.btnDisable}
                  onClick={sendCode}
                >
                  {this.state.buttonText}
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <div style={{ textAlign: "center" }}>
              <input
                type="checkbox"
                checked={this.state.remberPassWord}
                onChange={this.handleChecked}
                value={this.state.remberPassWord}
              />
              <span> ログイン情報保存</span>
            </div>
            <Button
              variant="primary"
              id="login"
              onClick={this.login}
              block
              type="button"
            >
              ログイン
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
