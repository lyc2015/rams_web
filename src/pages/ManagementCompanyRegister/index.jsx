import React, { Component } from "react";
import { message } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as publicUtils from "../../utils/publicUtils.js";

import {
  Form,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl,
  Image
} from "react-bootstrap";

import moment from "moment";
moment.locale("ja");


export default class ManagementCompanyRegister extends Component {
  constructor(props) {
    super(props);

    // 从props.location.state中获取state参数
    const companyInfo = this.props.location?.state?.companyInfo ?? {};// 防止 state 为空时的错误

    this.state = {
      managementMaxCompanyID: "",
      managementCompanyID: companyInfo.managementCompanyID || "",
      managementCompanyName: companyInfo.managementCompanyName || "",
      managementCompanyMail: companyInfo.managementCompanyMail || "",
      managementCompanyPhoneNo: companyInfo.managementCompanyPhoneNo || "",
      phoneNo1: companyInfo.phoneNo1 || "",
      phoneNo2: companyInfo.phoneNo2 || "",
      phoneNo3: companyInfo.phoneNo3 || "",


      managementCompanyURL: companyInfo.managementCompanyURL || "",
      managementCompanyPostCode: companyInfo.managementCompanyPostCode || "",
      managementCompanyAddress: companyInfo.managementCompanyAddress || "",
      managementCompanyRemark: companyInfo.managementCompanyRemark || "",
      hasNameError: false,
      hasMailError: false,
      hasPhoneNoError: false,
      hasPhoneNo1Error: false,
      hasPhoneNo2Error: false,
      hasPhoneNo3Error: false,
      hasPostError: false,
      checkErrorMsg: "",
      allowRegister: false,
      allowUpdate: false,
      showPopup: false,
      messageApi: "",
      btnText: companyInfo.managementCompanyID ? "更新" :"登録",
      payload:'',
      checkedItems:false,
    };

    this.valueChange = this.valueChange.bind(this);

  }


  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };


  //画面上のデータを取得
  createPayload = () => {
    return {
      managementCompanyID: this.state.managementCompanyID,
      managementCompanyName: this.state.managementCompanyName,
      managementCompanyMail: this.state.managementCompanyMail,
      phoneNo1: this.state.phoneNo1,
      phoneNo2: this.state.phoneNo2,
      phoneNo3: this.state.phoneNo3,
      managementCompanyPhoneNo: this.state.phoneNo1 + this.state.phoneNo2 + this.state.phoneNo3,
      managementCompanyURL: this.state.managementCompanyURL,
      managementCompanyPostCode: this.state.managementCompanyPostCode,
      managementCompanyAddress: this.state.managementCompanyAddress,
      managementCompanyRemark: this.state.managementCompanyRemark,
    };
  }

  /**
  * 各項目の入力値をチェックする
  */
  checkItems = () => {

    //errorMsgをクリア
    this.setState({
      hasNameError: false,
      hasMailError: false,
      hasPhoneNoError: false,
      hasPhoneNo1Error: false,
      hasPhoneNo2Error: false,
      hasPhoneNo3Error: false,
      hasPostError: false,
      hasURLError: false,
      checkErrorMsg: ''
    });

    const regMail_full = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
    const reg_Tel = /^[0-9]+$/;
    const reg_URL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;


    if (this.state.managementCompanyName === '') {
      this.setState({ hasNameError: true });
      message.error("管理会社名を入力してください")

    } else if (this.state.managementCompanyMail !== '' && !regMail_full.test(this.state.managementCompanyMail)) {
      this.setState({ hasMailError: true });
      message.error("有効なメールを入力してください")

    } else if (this.state.phoneNo1 !== '' && !reg_Tel.test(this.state.phoneNo1)) {
      this.setState({ hasPhoneNo1Error: true });
      message.error("正しい電話番号を入力してください")

    } else if (this.state.phoneNo2 !== '' && !reg_Tel.test(this.state.phoneNo2)) {
      this.setState({ hasPhoneNo2Error: true });
      message.error("正しい電話番号を入力してください")

    } else if (this.state.phoneNo3 !== '' && !reg_Tel.test(this.state.phoneNo3)) {
      this.setState({ hasPhoneNo3Error: true });
      message.error("正しい電話番号を入力してください")

    } else if ((this.state.phoneNo1 !== '') && (this.state.phoneNo2 === '' || this.state.phoneNo3 === '')) {
      this.setState({ hasPhoneNo1Error: true });
      this.setState({ hasPhoneNo2Error: true });
      this.setState({ hasPhoneNo3Error: true });
      message.error("正しい電話番号を入力してください")

    } else if ((this.state.phoneNo2 !== '') && (this.state.phoneNo1 === '' || this.state.phoneNo3 === '')) {
      this.setState({ hasPhoneNo1Error: true });
      this.setState({ hasPhoneNo2Error: true });
      this.setState({ hasPhoneNo3Error: true });
      message.error("正しい電話番号を入力してください")

    } else if ((this.state.phoneNo3 !== '') && (this.state.phoneNo1 === '' || this.state.phoneNo2 === '')) {
      this.setState({ hasPhoneNo1Error: true });
      this.setState({ hasPhoneNo2Error: true });
      this.setState({ hasPhoneNo3Error: true });
      message.error("正しい電話番号を入力してください")

    } else if ((this.state.phoneNo1 !== '' && this.state.phoneNo2 !== '' && this.state.phoneNo3 !== '') && (this.state.phoneNo1.length + this.state.phoneNo2.length + this.state.phoneNo3.length < 10)) {
      this.setState({ hasPhoneNo1Error: true });
      this.setState({ hasPhoneNo2Error: true });
      this.setState({ hasPhoneNo3Error: true });
      message.error("正しい電話番号を入力してください")

    } else if (this.state.managementCompanyPostCode !== '' && !reg_Tel.test(this.state.managementCompanyPostCode)) {
      this.setState({ hasPostError: true });
      message.error("正しい郵便番号を入力してください")
      
    } else if (this.state.managementCompanyPostCode !== '' && this.state.managementCompanyAddress === "") {
      this.setState({ hasPostError: true });
      message.error("正しい郵便番号を入力してください")
      
    } else if (this.state.managementCompanyURL !== '' && !reg_URL.test(this.state.managementCompanyURL)) {
      this.setState({ hasURLError: true });
      message.error("正しいURLを入力してください")
      
    }else{
      this.setState({ checkedItems: true });
    }

  }


  /**
    * 郵便番号API
    */
  postApi = (event) => {

    //errorMsgをクリア
    this.setState({
      hasPostError: false,
      checkErrorMsg: ''
    });

    const reg_Tel = /^[0-9]+$/;
    let value = event.target.value;

    if (value !== '' && reg_Tel.test(value)) {
      const promise = Promise.resolve(publicUtils.postcodeApi(value));
      promise.then((data) => {
        
        if (data !== undefined && data !== null && data !== "") {
          this.setState({ managementCompanyAddress: data });

        } else {
          this.setState({ hasPostError: true });
          message.error('正しい郵便番号を入力してください')
          this.setState({ managementCompanyAddress: '' });
         
        }
      });
    }
  };


  /**
    * 最大管理会社IDを取得
    */

  componentDidMount() {
    // 组件挂载后立即调用
    this.fetchMaxNo();
  }

  //最大管理会社ID取得
  async fetchMaxNo() {

    console.log('---this.props.location.state.companyInfo---', this.state.companyInfo)
    try {
      const response = await fetch('http://localhost:8080/employee/searchManagementCompanyID',
        {
          method: 'POST', // 请求方法
          headers: {
            'Content-Type': 'application/json', // 请求头
          },
          body: '', // 请求体
        }
      );

      if (!response.ok) {
        message.error('管理会社ID取得失敗')
      }

      const data = await response.json();
      this.setState({
        managementMaxCompanyID: data.maxID
      })

      //取得した最大管理会社IDを反映する 
      if (this.state.managementCompanyName === '') {
        this.setState({
          managementCompanyID: data.maxID,
          managementCompanyName: "",
          managementCompanyMail: "",
          managementCompanyPhoneNo: "",
          phoneNo1: "",
          phoneNo2: "",
          phoneNo3: "",
          managementCompanyURL: "",
          managementCompanyPostCode: "",
          managementCompanyAddress: "",
          managementCompanyRemark: "",
         // btnText:"登録"
        })

      }

    } catch (error) {
      message.error('管理会社ID取得失敗')
    }
  }





  //登録ボタンを押下すると、各項目チェックのfunctionで、情報登録または情報更新を判断して、処理を行う
  registerManagementCompany = () => {
    //各項目をチェック
    this.checkItems();
  }
 

  componentDidUpdate(prevProps, prevState) {
  
    //入力した内容をチェック
    if (this.state.checkedItems !== prevState.checkedItems && this.state.checkedItems === true) {
      if (this.state.managementCompanyID !== this.state.managementMaxCompanyID) {
        this.setState({ allowUpdate: true });
      } else {
        this.setState({ allowRegister: true });
      }
    }

    //入力した内容が問題ない場合
      if (this.state.allowRegister !== prevState.allowRegister && this.state.allowRegister === true && this.state.checkedItems === true) {
         
          console.log('----进入插入---')
          this.register();
        
        
      } else if (this.state.allowUpdate !== prevState.allowUpdate && this.state.allowUpdate === true && this.state.checkedItems === true) {
      
          console.log('----进入更新---')
          this.update();
              
      }
  }


  

  //会社情報登録
  async register() {

    //データを取得
    const payload = this.createPayload();

    //データ登録
    try {

      const response = await fetch('http://localhost:8080/employee/registerManagementCompany',
        {
          method: 'POST', // 请求方法
          headers: {
            'Content-Type': 'application/json', // 请求头
          },
          body: JSON.stringify(payload), // 请求体
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        //popup 登陆成功
        if (data.result === true) {
          message.success('管理会社登録成功')
          this.setState({
            managementCompanyName: '',
            managementCompanyMail: '',
            managementCompanyPhoneNo: '',
            phoneNo1: '',
            phoneNo2: '',
            phoneNo3: '',
            managementCompanyURL: '',
            managementCompanyPostCode: '',
            managementCompanyAddress: '',
            managementCompanyRemark: '',
          })

          //最大管理会社IDを更新
          this.fetchMaxNo();

        }
        //popup 登陆失败 
        else {
          message.error('管理会社登録失敗')
        }
      } else {
        message.error('管理会社登録失敗')
        // response.status 不是 200 的情况
      }

    } catch (error) {
      message.error('管理会社登録失敗')

    }
    this.setState({ allowRegister: false });
    this.setState({ checkedItems: false });
  }


 

  //会社情報更新
  async update() {
    //データを取得
    const payload = this.createPayload();

    //データ提出
    try {
      const response = await fetch('http://localhost:8080/employee/updateManagementCompanyInfo',
        {
          method: 'POST', // 请求方法
          headers: {
            'Content-Type': 'application/json', // 请求头
          },
          body: JSON.stringify(payload), // 请求体
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        //popup 登陆成功
        if (data.result === 1) {
          message.success('管理会社情報更新成功')

          this.setState({
            managementCompanyID: '',
            managementCompanyName: '',
            managementCompanyMail: '',
            managementCompanyPhoneNo: '',
            phoneNo1: '',
            phoneNo2: '',
            phoneNo3: '',
            managementCompanyURL: '',
            managementCompanyPostCode: '',
            managementCompanyAddress: '',
            managementCompanyRemark: '',
            btnText: "登録",
          })

          //// 使用state传递值
          this.props.history.push({
            pathname: '/submenu/managementCompanyRegister',
            state: {}

          });

          //最大管理会社IDを更新
          this.fetchMaxNo();

        }
        //popup 登陆失败 
        else {
          message.error('管理会社更新失敗')
        }
      } else {
        message.error('管理会社更新失敗')
        // response.status 不是 200 的情况
      }


    } catch (error) {
      message.error('管理会社更新失敗')

    }

    this.setState({ allowUpdate: false });
    this.setState({ checkedItems: false });
  }


  //戻るボタン
  backToSearch = () => {
    // 使用state传递值
    this.props.history.push({
      pathname: '/submenu/managementCompanySearch',
      state: {}
    });
  }


  render() {

    const {
      checkErrorMsg
    } = this.state;

    const nameInputStyle = this.state.hasNameError ? { borderColor: 'red' } : {};
    const mailInputStyle = this.state.hasMailError ? { borderColor: 'red' } : {};
    const phoneNo1InputStyle = this.state.hasPhoneNo1Error ? { borderColor: 'red' } : {};
    const phoneNo2InputStyle = this.state.hasPhoneNo2Error ? { borderColor: 'red' } : {};
    const phoneNo3InputStyle = this.state.hasPhoneNo3Error ? { borderColor: 'red' } : {};
    const postInputStyle = this.state.hasPostError ? { borderColor: 'red' } : {};
    const urlInputStyle = this.state.hasURLError ? { borderColor: 'red' } : {};


    return (
      <div className="container">
        <br></br>
        <Row className="text-center mb-3">
          <Col>
            <h2>管理会社情報登録</h2>
          </Col>
        </Row><br />

        <Form>
          <Row>
            <Col md={4}>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    管理会社ID
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.managementCompanyID}
                  onChange={this.valueChange}
                  name="managementCompanyID"
                  size="sm"
                  disabled
                />
              </InputGroup>
            </Col>

            <Col md={4}>

              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    管理会社名
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.managementCompanyName}
                  onChange={this.valueChange}
                  name="managementCompanyName"
                  size="sm"
                  maxLength={20}
                  style={nameInputStyle}
                />
              </InputGroup>

            </Col>
            <span style={{ color: 'red' }}>&#9733;</span>
          </Row><br />


          <Row>
            <Col md={4}>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    メール
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.managementCompanyMail}
                  onChange={this.valueChange}
                  name="managementCompanyMail"
                  size="sm"
                  maxLength={50}
                  style={mailInputStyle}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    電話番号
                  </InputGroup.Text>
                </InputGroup.Prepend>

                <FormControl
                  value={this.state.phoneNo1}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo1"
                  maxLength="3"
                  style={phoneNo1InputStyle}
                />
                <InputGroup.Prepend>
                  <InputGroup.Text className="width-auto bdr0">
                    —
                  </InputGroup.Text>
                </InputGroup.Prepend>

                <FormControl
                  value={this.state.phoneNo2}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo2"
                  maxLength="4"
                  style={phoneNo2InputStyle}
                />
                <InputGroup.Prepend>
                  <InputGroup.Text className="width-auto bdr0">
                    —
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.phoneNo3}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo3"
                  maxLength="4"
                  style={phoneNo3InputStyle}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="twoKanji">
                    備考
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.managementCompanyRemark}
                  onChange={this.valueChange}
                  name="managementCompanyRemark"
                  size="sm"
                  maxLength={50}
                />
              </InputGroup>
            </Col>
          </Row><br />

          <Row>
            <Col md={4}>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    URL
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.managementCompanyURL}
                  onChange={this.valueChange}
                  name="managementCompanyURL"
                  size="sm"
                  maxLength={50}
                  style={urlInputStyle}
                />
              </InputGroup>

            </Col>

            <Col md={4}>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="fiveKanji">
                    郵便番号
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.managementCompanyPostCode}
                  onChange={this.valueChange}
                  onBlur={this.postApi.bind(this)}
                  name="managementCompanyPostCode"
                  size="sm"
                  maxLength={7}
                  style={postInputStyle}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text id="twoKanji">
                    住所
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={this.state.managementCompanyAddress}
                  onChange={this.valueChange}
                  name="managementCompanyAddress"
                  size="sm"
                  maxLength={50}
                />
              </InputGroup>

            </Col>
          </Row><br />

          <div style={{ textAlign: "center" }}>
            <Button
              size="sm"
              variant="info"
              onClick={this.registerManagementCompany}
              type="button"

            >
              <FontAwesomeIcon /> {this.state.btnText}
            </Button>

            {/* {this.state.managementCompanyID === '' ? '登録' : '更新'}
             */}
            <Button
              size="sm"
              variant="info"
              onClick={this.backToSearch}
              type="button"
              style={{ marginLeft: '20px' }}
            >
              <FontAwesomeIcon /> 戻る
            </Button>
          </div>

          <br></br>
          <div style={{ textAlign: "center" }}>
            {checkErrorMsg ? checkErrorMsg : ''}
          </div>

        </Form>

      </div>
    )
  }
}


