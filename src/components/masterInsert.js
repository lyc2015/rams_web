import React, { Component } from "react";
import * as publicUtils from "./utils/publicUtils.js";
import {
  Row,
  Form,
  Col,
  InputGroup,
  Button,
  FormControl,
} from "react-bootstrap";
import $ from "jquery";
import axios from "axios";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import store from "./redux/store";
import { Hidden } from "@material-ui/core";
axios.defaults.withCredentials = true;

// マスター登録
class masterInsert extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.onchange = this.onchange.bind(this);
    this.refreshReducer = this.refreshReducer.bind(this);
  }
  // 初期化
  initialState = {
    myToastShow: false,
    errorsMessageShow: false,
    flag: true, // 活性非活性flag
    masterStatus: store.getState().dropDown[32].slice(1),
    bankInfo: store.getState().dropDown[57].slice(1),
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    bankName: "",
    branchName: "",
  };

  onchange = (event, values) => {
    this.setState({ flag: false });
    this.setState({ [event.target.name]: event.target.value }, () => {
      if ($("#master").val() === "") {
        this.setState({ flag: true });
      }
    });
    if (values != null) {
      this.setState({
        master: values.name,
      });
    } else {
      this.setState({
        master: "",
      });
    }
  };

  // 页面加载
  componentDidMount() {}

  /**
   * 登録ボタン
   */
  toroku = () => {
    // $("#toroku").attr({"disabled":"disabled"});
    // setTimeout($("#toroku").removeAttr("disabled"),2000)
    if (
      this.state.master != "支店マスター" &&
      this.state.master != "TOPお客様"
    ) {
      var masterModel = {};
      // 画面输入信息取得
      var formArray = $("#masterInsertForm").serializeArray();
      $.each(formArray, function (i, item) {
        masterModel[item.name] = item.value;
      });
      masterModel["master"] = publicUtils.labelGetValue(
        $("#master").val(),
        this.state.masterStatus
      );
      axios
        .post(this.state.serverIP + "masterInsert/toroku", masterModel)
        .then((result) => {
          if (result.data.errorsMessage != null) {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: result.data.errorsMessage,
            });
            // $("#toroku").removeAttr("disabled");
          } else {
            this.setState({ myToastShow: true, errorsMessageShow: false });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            this.refreshReducer();
          }
        })
        .catch((error) => {
          console.error("Error - " + error);
        });
    } else if (this.state.master === "支店マスター") {
      // $("#toroku").attr({"disabled":"disabled"});
      const branchDetails = {
        bankBranchCode: this.state.branchCode,
        bankBranchName: this.state.branchName,
        bankCode: this.state.bankName,
      };
      axios
        .post(this.state.serverIP + "branchInsert/toroku", branchDetails)
        .then((result) => {
          if (result.data.errorsMessage != null) {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: result.data.errorsMessage,
            });
            // $("#toroku").removeAttr("disabled");
          } else {
            this.setState({ myToastShow: true, errorsMessageShow: false });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            this.refreshReducer();
            this.setState({ branchCode: "", branchName: "" });
            // $("#toroku").removeAttr("disabled");
          }
        })
        .catch((error) => {
          console.error("Error - " + error);
        });
    } else if (this.state.master === "TOPお客様") {
      // $("#toroku").attr({"disabled":"disabled"});
      const customerDetails = {
        topCustomerName: this.state.topCustomerName,
        topCustomerAbbreviation: this.state.topCustomerAbbreviation,
        url: this.state.url,
      };
      axios
        .post(this.state.serverIP + "customerInsert/toroku", customerDetails)
        .then((result) => {
          if (result.data.errorsMessage != null) {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: result.data.errorsMessage,
            });
            // $("#toroku").removeAttr("disabled");
          } else {
            this.setState({ myToastShow: true, errorsMessageShow: false });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            this.setState({
              topCustomerName: "",
              topCustomerAbbreviation: "",
              url: "",
            });
            // $("#toroku").removeAttr("disabled");
            this.refreshReducer();
          }
        })
        .catch((error) => {
          console.error("Error - " + error);
        });
    }
  };

  refreshReducer = () => {
    switch (this.state.master) {
      case "TOPお客様":
        store.dispatch({ type: "UPDATE_STATE", dropName: "getTopCustomer" });
        break;
      case "支店マスター":
        break;
      default:
        let dropName = publicUtils.labelGetValue(
          $("#master").val(),
          this.state.masterStatus
        );
        dropName = "get" + dropName.substring(4, dropName.length);
        store.dispatch({ type: "UPDATE_STATE", dropName: dropName });
        break;
    }
    //$("#shuseiTo").click();
  };

  shuseiTo = (actionType) => {
    var path = {};
    const sendValue = {
      master: this.state.master,
      type: "return",
      backPage: this.state.backPage,
    };
    switch (actionType) {
      case "detail":
        path = {
          pathname: "/subMenuManager/masterUpdate",
          state: {
            actionType: "detail",
            sendValue: sendValue,
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  };

  handleTag = (event, values) => {
    if (values != null) {
      this.setState({
        bankName: values.code,
        branchName: "",
        branchCode: "",
      });
    } else {
      this.setState({
        bankName: "",
      });
    }
  };
  valueChange = (event) => {
    if (event.target.value === "") {
      this.setState({
        [event.target.name]: event.target.value,
        branchCode: "",
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };
  vNumberChange = (e, key) => {
    const { value } = e.target;

    const reg = /^[0-9]*$/;
    if (reg.test(value) && value.length < 4) {
      this.setState({
        [key]: value,
      });
    }
    if (value === "") {
      this.setState({
        [key]: value,
        branchName: "",
      });
    }
  };

  render() {
    const { master, errorsMessageValue, masterStatus, bankName, bankInfo } =
      this.state;

    return (
      <div className="container col-7">
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={"登録成功！"}
            type={"success"}
          />
        </div>
        <div
          style={{ display: this.state.errorsMessageShow ? "block" : "none" }}
        >
          <ErrorsMessageToast
            errorsMessageShow={this.state.errorsMessageShow}
            message={errorsMessageValue}
            type={"danger"}
          />
        </div>
        <Row inline="true">
          <Col className="text-center">
            <h2>共通マスター登録</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={4}></Col>
          <Col sm={7}>
            <p
              id="masterInsertErorMsg"
              style={{ visibility: "hidden" }}
              class="font-italic font-weight-light text-danger"
            >
              ★
            </p>
          </Col>
        </Row>
        <Form id="masterInsertForm">
          <Row>
            <Col>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    名　称
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  id="master"
                  name="master"
                  value={
                    masterStatus.find((v) => v.name === this.state.master) || {}
                  }
                  onChange={(event, values) => this.onchange(event, values)}
                  options={this.state.masterStatus}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder="マスター名"
                        type="text"
                        {...params.inputProps}
                        className="auto form-control Autocompletestyle-master"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>
          </Row>
          {master === "支店マスター" ? (
            <div>
              <Row>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        銀行名
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      id="bankName"
                      name="bankName"
                      options={bankInfo}
                      getOptionLabel={(option) => option.name}
                      value={
                        bankInfo.find((v) => v.code === this.state.bankName) ||
                        {}
                      }
                      onChange={(event, values) =>
                        this.handleTag(event, values)
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder=" 銀行名"
                            type="text"
                            {...params.inputProps}
                            className=" auto form-control Autocompletestyle-branchInsertInfo "
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        支店名
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      name="branchName"
                      id="branchName"
                      value={this.state.branchName}
                      onChange={this.valueChange}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder=" 支店名"
                      disabled={bankName === "" ? true : false}
                      maxLength={20}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        支店番号
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      name="branchCode"
                      id="branchCode"
                      value={this.state.branchCode}
                      onChange={(e) => this.vNumberChange(e, "branchCode")}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder=" 支店番号"
                      disabled={bankName === "" ? true : false}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </div>
          ) : null}
          {master === "TOPお客様" ? (
            <div>
              <Row>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        お客様名
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      name="topCustomerName"
                      id="topCustomerName"
                      value={this.state.topCustomerName}
                      onChange={this.valueChange}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder=" お客様名"
                      maxLength={20}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        お客様略称
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      name="topCustomerAbbreviation"
                      id="topCustomerAbbreviation"
                      value={this.state.topCustomerAbbreviation}
                      onChange={this.valueChange}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder=" お客様略称"
                      maxLength={20}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        URL
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      name="url"
                      id="url"
                      value={this.state.url}
                      onChange={this.valueChange}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="URL"
                    />
                  </InputGroup>
                </Col>
              </Row>
            </div>
          ) : null}
          {master != "支店マスター" && master != "TOPお客様" ? (
            <Row>
              <Col>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">
                      データ
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder="データ"
                    id="data"
                    name="data"
                    disabled={this.state.flag === true ? true : false}
                  />
                </InputGroup>
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col sm={4}></Col>
            <Col sm={4} className="text-center">
              <Button
                size="sm"
                onClick={this.toroku}
                variant="info"
                id="toroku"
                type="button"
                disabled={this.state.flag === true ? true : false}
              >
                <FontAwesomeIcon icon={faSave} />
                登録
              </Button>
              <Button
                size="sm"
                onClick={this.shuseiTo.bind(this, "detail")}
                variant="info"
                id="shuseiTo"
                type="button"
                hidden
              ></Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default masterInsert;
