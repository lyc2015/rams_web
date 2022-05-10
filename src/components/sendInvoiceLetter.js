import React, { Component } from "react";
import {
  Form,
  Button,
  ListGroup,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import MyToast from "./myToast";
import store from "./redux/store";
axios.defaults.withCredentials = true;

class sendInvoiceLetter extends Component {
  constructor(props) {
    super(props);
    this.state = this.initState;
  }
  initState = {
    mailConfirmContont: "",
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
  };

  // valueChange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount() {
    this.setState({
      mailConfirmContont: this.props.mailConfirmContont,
      mailTO: this.props.mailTO,
      mailTitle: this.props.mailTitle,
    });
  }

  setMail = () => {
    this.props.returnMail.setNewMail(this.state.mailConfirmContont);
  };

  render() {
    return (
      <div>
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={"更新成功！"}
            type={"danger"}
          />
        </div>
        <div>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-sm">TO</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              value={this.state.mailTO}
              autoComplete="off"
              onChange={this.valueChange}
              size="sm"
              name="mailTO"
            />
          </InputGroup>

          <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-sm">CC</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              value={this.state.mailCC}
              autoComplete="off"
              onChange={this.valueChange}
              size="sm"
              name="mailCC"
            />
          </InputGroup>

          <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-sm">
                タイトル
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              value={this.state.mailTitle}
              autoComplete="off"
              onChange={this.valueChange}
              size="sm"
              name="mailTitle"
            />
          </InputGroup>

          <textarea
            ref={(textarea) => (this.textArea = textarea)}
            value={this.state.mailConfirmContont}
            id="mailConfirmContont"
            name="mailConfirmContont"
            onChange={this.valueChange}
            className="auto form-control Autocompletestyle-interview-text"
            style={{ height: "600px", resize: "none", overflow: "hidden" }}
          />
        </div>
        <div>
          <div style={{ textAlign: "center" }}>
            <Button
              id="copyUrl"
              size="sm"
              variant="info"
              onClick={this.setMail}
            >
              {" "}
              確認
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default sendInvoiceLetter;
