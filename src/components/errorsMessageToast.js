import React, { Component } from "react";
import { Toast } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export default class errorsMessageToast extends Component {
  render() {
    const toastCss = {
      position: "fixed",
      top: "10px",
      left: "10px",
      zIndex: "10",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };

    return (
      <div style={this.props.errorsMessageShow ? toastCss : null}>
        <Toast 
          show={this.props.errorsMessageShow}
          className="border border-danger"
          style={{ backgroundColor: "white" }}
        >
          <Toast.Body style={{ color: "#000", display: "flex", alignItems: "center" }}>
            <FontAwesomeIcon 
              icon={faTimesCircle} 
              style={{ color: "red", marginRight: "8px", fontSize: "18px" }} 
            />
            {this.props.message}
          </Toast.Body>
        </Toast>
      </div>
    );
  }
}
