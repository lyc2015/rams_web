import React, { Component } from "react";
import { Toast } from "react-bootstrap";

export default class myToast extends Component {
  render() {
    const toastCss = {
      position: "fixed",
      top: "10px",
      left: "10px",
      zIndex: "2",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };

    return (
      <div style={this.props.myToastShow ? toastCss : null}>
        <Toast
          className={`border text-white ${
            this.props.type === "success"
              ? "border-success bg-success"
              : "border-danger bg-danger"
          }`}
          /*myToastShow*/ show={this.props.myToastShow}
        >
          <Toast.Body>{this.props.message}</Toast.Body>
        </Toast>
      </div>
    );
  }
}
