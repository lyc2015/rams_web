import React from "react";
import { DatePicker as AntdDatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../asserts/css/style.css";
import "../asserts/css/newCssInsert.css"
import * as publicUtils from "./utils/publicUtils.js";

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

class EmployeeInsertNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      furigana1: "",
      furigana2: "",
      alphabetName1: "",
      alphabetName2: "",
      alphabetName3: "",
      genderStatus: "",
      nationalityCode: "",
      birthplace: "",
      birthday: "",
      image: "https://images.669pic.com/element_pic/54/25/82/94/d2825498dd97a2594c35d633e8454d19.jpg_w700wb",
      temporary_age: "",
      companyMail: "",
      socialInsuranceNo: "",
      socialInsuranceDate: null,
      employeeFristName: "",
      employeeLastName: "",      
      employmentInsurance: "",
      employmentInsuranceNo: "",
      socialInsurance: "",      
      employmentInsuranceStatus: [
        { code: "0", name: "未加入" },
        { code: "1", name: "加入済み" }
      ],
      socialInsuranceStatus: [
        { code: "0", name: "未加入" },
        { code: "1", name: "加入済み" }
      ],
      graduationYearAndMonth: null,
      comeToJapanYearAndMonth: null,
      intoCompanyYearAndMonth: null,
      yearsOfExperience: null,
      temporary_graduationYearAndMonth: "",
      temporary_comeToJapanYearAndMonth: "",
      temporary_intoCompanyYearAndMonth: "",
      temporary_yearsOfExperience: "",
      employeeStatus: "0",
      postalCode: '',
      firstHalfAddress: '',
    };
  }

  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  dateChange = (name, date) => {
    this.setState({
      [name]: date,
    });
  };

  inactiveBirthday = (date) => {
    this.setState({
      birthday: date,
      temporary_age: this.calculateAge(date)
    });
  };

  calculateAge = (birthday) => {
    const today = moment();
    const birthDate = moment(birthday);
    let age = today.year() - birthDate.year();
    const monthDiff = today.month() - birthDate.month();
    if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDate.date())) {
      age--;
    }
    return age;
  };



  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  valueChangeEmployeeInsuranceStatus = (event) => {
    this.setState({
      employmentInsurance: event.target.value
    });
  };

  valueChangesocialInsuranceStatus = (event) => {
    this.setState({
      socialInsurance: event.target.value
    });
  };

  socialInsuranceDateChange = (date) => {
    this.setState({
      socialInsuranceDate: date
    });
  };

  // 卒業

  formatDuration = (years, months) => {
    if (years === 0) {
      return `${months}ヶ月`;
    }
    return `${years}年${months}ヶ月`;
  };

  inactiveGraduationYearAndMonth = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      graduationYearAndMonth: date,
      temporary_graduationYearAndMonth: formattedDuration
    }, () => {
      if (!this.state.yearsOfExperience) {
        this.setState({
          yearsOfExperience: date,
          temporary_yearsOfExperience: formattedDuration
        });
      }
    });
  };

  inactiveComeToJapanYearAndMonth = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      comeToJapanYearAndMonth: date,
      temporary_comeToJapanYearAndMonth: formattedDuration
    });
  };

  inactiveintoCompanyYearAndMonth = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      intoCompanyYearAndMonth: date,
      temporary_intoCompanyYearAndMonth: formattedDuration
    });
  };

  inactiveyearsOfExperience = (date) => {
    const yearsDiff = moment().diff(date, 'years');
    const monthsDiff = moment().diff(date, 'months') % 12;
    const formattedDuration = this.formatDuration(yearsDiff, monthsDiff);

    this.setState({
      yearsOfExperience: date,
      temporary_yearsOfExperience: formattedDuration
    });
  };

  /**
   * 郵便番号API
   */
  postApi = (event) => {
    let value = event.target.value;
    const promise = Promise.resolve(publicUtils.postcodeApi(value));
    promise.then((data) => {
      if (data !== undefined && data !== null && data !== "") {
        this.setState({ firstHalfAddress: data });
      }
    });
  };

  /**
   * 漢字をカタカナに変更する
   */
  katakanaApiChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let promise = Promise.resolve(publicUtils.katakanaApi(value));
    promise.then((date) => {
      switch (name) {
        case "employeeFristName":
          this.setState({
            furigana1: date,
            employeeFristName: value,
          });
          break;
        case "employeeLastName":
          this.setState({
            furigana2: date,
            employeeLastName: value,
          });
          break;
        default:
      }
    });
  };

  render() {
    const {
      companyMail,
      phoneNo1,
      phoneNo2,
      phoneNo3,
      employmentInsurance, 
      socialInsurance, 
      socialInsuranceDate, 
      employeeStatus,
      graduationYearAndMonth,
      comeToJapanYearAndMonth,
      intoCompanyYearAndMonth,
      yearsOfExperience,
      temporary_graduationYearAndMonth,
      temporary_comeToJapanYearAndMonth,
      temporary_intoCompanyYearAndMonth,
      temporary_yearsOfExperience,      
    } = this.state;
    const residenceTimeDisabled = false; // 示例值，需根据实际情况设置

    // 
    return (  
      <div className="container">
        <Row className="text-center mb-3">
          <Col>
            <h2>社員情報登録</h2>
          </Col>
        </Row>

        <Form>
          <Row className="mb-3">
                <Col sm={12}>
                  <Form.Label style={{ color: "#000000" }}>基本情報</Form.Label>
                </Col>
              </Row>
          <Row>
            <Col md={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text>社員区分</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  name="employeeStatus"
                  value={this.state.employeeStatus}
                  onChange={this.valueChange}
                  autoComplete="off"
                >
                  <option value="">選択してください</option>
                  <option value="0">在籍</option>
                  <option value="1">退職</option>
                  <option value="2">内定</option>
                </Form.Control>
              </InputGroup>
              <InputGroup size="sm">
                <InputGroup.Prepend>
                  <InputGroup.Text>社員名</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="社員氏"
                  value={this.state.employeeFristName}
                  onChange={this.valueChange}
                  onBlur={this.katakanaApiChange.bind(this)}
                  name="employeeFristName"
                  size="sm"
                />
                <FormControl
                  placeholder="社員名"
                  value={this.state.employeeLastName}
                  onChange={this.valueChange}
                  onBlur={this.katakanaApiChange.bind(this)}
                  name="employeeLastName"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>カタカナ</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="カタカナ"
                  value={this.state.furigana1}
                  onChange={this.valueChange}
                  name="furigana1"
                  size="sm"
                />
                <FormControl
                  placeholder="カタカナ"
                  value={this.state.furigana2}
                  onChange={this.valueChange}
                  name="furigana2"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>ローマ字</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="first"
                  value={this.state.alphabetName1}
                  onChange={this.valueChange}
                  name="alphabetName1"
                  size="sm"
                />
                <FormControl
                  placeholder="last"
                  value={this.state.alphabetName2}
                  onChange={this.valueChange}
                  name="alphabetName2"
                  size="sm"
                />
                <FormControl
                  placeholder="last"
                  value={this.state.alphabetName3}
                  onChange={this.valueChange}
                  name="alphabetName3"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>性別</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  name="genderStatus"
                  value={this.state.genderStatus}
                  onChange={this.valueChange}
                  autoComplete="off"
                >
                  <option value="">選択してください</option>
                  <option value="M">男性</option>
                  <option value="F">女性</option>
                </Form.Control>
              </InputGroup>
              <InputGroup size="sm">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Prepend>
                  <AntdDatePicker
                    allowClear={false}
                    suffixIcon={false}
                    value={this.state.birthday ? moment(this.state.birthday) : ""}
                    onChange={this.inactiveBirthday}
                    format="YYYY/MM/DD"
                    locale="ja"
                    id="datePicker"
                    disabledDate={(current) => current >= moment()}
                    bordered={false}
                    className="antd-date-picker"
                  />
                </InputGroup.Prepend>
                <FormControl
                  id="temporary_age"
                  value={this.state.temporary_age}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="temporary_age"
                  disabled
                />
                <FormControl value="歳" size="sm" disabled />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>国籍</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  name="nationalityCode"
                  value={this.state.nationalityCode}
                  onChange={this.valueChange}
                  autoComplete="off"
                >
                  <option value="">選択してください</option>
                  <option value="JP">日本</option>
                  <option value="US">アメリカ</option>
                </Form.Control>
                <FormControl
                  placeholder="県"
                  value={this.state.birthplace}
                  onChange={this.valueChange}
                  name="birthplace"
                  size="sm"
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text>社員番号</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="社員番号"
                  value={this.state.employeeNumber}
                  onChange={this.valueChange}
                  name="employeeNumber"
                  size="sm"
                  disabled
                />
              </InputGroup>
              <InputGroup size="sm" className="required-mark">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    社内メール
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="email"
                  placeholder="メール"
                  value={companyMail}
                  autoComplete="off"
                  disabled={
                    employeeStatus === "0" ||
                    employeeStatus === "2" ||
                    employeeStatus === "3"
                      ? false
                      : true
                  }
                  onChange={this.valueChange}
                  size="sm"
                  name="companyMail"
                />
                <FormControl value="@lyc.co.jp" size="sm" disabled />
              </InputGroup>
              <InputGroup size="sm" className="">
                <InputGroup.Prepend>
                  <InputGroup.Text>携帯電話</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={phoneNo1}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo1"
                  maxlength="3"
                />
                <InputGroup.Prepend>
                  <InputGroup.Text className="width-auto bdr0">
                    —
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={phoneNo2}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo2"
                  maxlength="4"
                />
                <InputGroup.Prepend>
                  <InputGroup.Text className="width-auto bdr0">
                    —
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={phoneNo3}
                  autoComplete="off"
                  onChange={this.valueChange}
                  size="sm"
                  name="phoneNo3"
                  maxlength="4"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>郵便番号</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="郵便番号"
                  value={this.state.postalCode}
                  onChange={this.valueChange}
                  onBlur={this.postApi.bind(this)}
                  name="postalCode"
                  size="sm"
                  id="postcode"
                  maxlength="7"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>都道府県</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="都道府県"
                  value={this.state.firstHalfAddress}
                  onChange={this.valueChange}
                  name="firstHalfAddress"
                  size="sm"
                  disabled
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>以降住所</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="以降住所"
                  value={this.state.address}
                  onChange={this.valueChange}
                  name="address"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>最寄駅</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="例：秋葉原駅"
                  value={this.state.nearestStation}
                  onChange={this.valueChange}
                  name="nearestStation"
                  size="sm"
                />
              </InputGroup>            
            </Col>

            <Col md={4} className="text-center">
              <Image src={this.state.image} rounded width="220" height="240" />
            </Col>
          </Row>
          
          <Row>
            <Col md={4}>
              <Form.Label style={{ color: "#000000" }}>
                基本情報補足
              </Form.Label>


              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>権限</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="権限"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>卒業学校</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="学校"
                  value={this.state.graduatedSchool}
                  onChange={this.valueChange}
                  name="graduatedSchool"
                  size="sm"
                />
                <FormControl
                  placeholder="専門"
                  value={this.state.major}
                  onChange={this.valueChange}
                  name="major"
                  size="sm"
                />
              </InputGroup>

              <InputGroup size="sm" className="">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  卒業年月
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={graduationYearAndMonth ? moment(graduationYearAndMonth) : ""}
                  onChange={this.inactiveGraduationYearAndMonth}
                  format="YYYY/MM"
                  locale="ja"
                  showMonthYearPicker
                  id="datePicker-empInsert-left"
                  className="form-control form-control-sm"
                  autoComplete="off"
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_graduationYearAndMonth"
                value={temporary_graduationYearAndMonth}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  来日年月
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={comeToJapanYearAndMonth ? moment(comeToJapanYearAndMonth) : ""}
                  onChange={this.inactiveComeToJapanYearAndMonth}
                  format="YYYY/MM"
                  locale="ja"
                  showMonthYearPicker
                  id="datePicker-empInsert-left"
                  className="form-control form-control-sm"
                  autoComplete="off"
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_comeToJapanYearAndMonth"
                value={temporary_comeToJapanYearAndMonth}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="required-mark">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  入社年月
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={intoCompanyYearAndMonth ? moment(intoCompanyYearAndMonth) : ""}
                  onChange={this.inactiveintoCompanyYearAndMonth}
                  format="YYYY/MM/DD"
                  locale="ja"
                  id="datePicker-empInsert-left"
                  disabled={
                    this.state.employeeStatus === "1" || this.state.employeeStatus === "4"
                      ? true
                      : false}
                  bordered={false}
                  style={{ padding: "0px" }}
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_intoCompanyYearAndMonth"
                value={temporary_intoCompanyYearAndMonth}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            <InputGroup size="sm" className="">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  経験年数
                </InputGroup.Text>
              </InputGroup.Prepend>
              <InputGroup.Append>
                <AntdDatePicker
                  allowClear={false}
                  suffixIcon={false}
                  value={yearsOfExperience ? moment(yearsOfExperience) : ""}
                  onChange={this.inactiveyearsOfExperience}
                  format="YYYY/MM"
                  locale="ja"
                  showMonthYearPicker
                  className="form-control form-control-sm"
                  autoComplete="off"
                  id="datePicker-empInsert-left"
                />
              </InputGroup.Append>
              <FormControl
                name="temporary_yearsOfExperience"
                value={temporary_yearsOfExperience}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled
              />
            </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label style={{ color: "#000000" }}>
                
              </Form.Label>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>仲介区分</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="仲介区分"
                  value={this.state.residenceStatus}
                  onChange={this.valueChange}
                  name="residenceStatus"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>部署</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="部署"
                  value={this.state.residenceStatus}
                  onChange={this.valueChange}
                  name="residenceStatus"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>在留資格</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="在留資格"
                  value={this.state.residenceStatus}
                  onChange={this.valueChange}
                  name="residenceStatus"
                  size="sm"
                />
              </InputGroup>

              <InputGroup size="sm" className="flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="sevenKanji">
                    雇用保険加入
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  onChange={this.valueChangeEmployeeInsuranceStatus}
                  name="employmentInsurance"
                  value={employmentInsurance}
                  disabled={
                    employeeStatus === "2" ||
                    employeeStatus === "1" ||
                    employeeStatus === "4"
                      ? true
                      : false
                  }
                  autoComplete="off"
                >
                  {this.state.employmentInsuranceStatus.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
              </InputGroup>
              
              <InputGroup size="sm" className="flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="sevenKanji">
                    社会保険加入
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  size="sm"
                  hidden
                  onChange={this.valueChangesocialInsuranceStatus}
                  name="socialInsurance"
                  value={socialInsurance}
                  autoComplete="off"
                >
                  {this.state.socialInsuranceStatus.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
                <InputGroup.Append>
                  <AntdDatePicker
                    allowClear={false}
                    suffixIcon={false}
                    value={socialInsuranceDate ? moment(socialInsuranceDate) : ""}
                    onChange={this.socialInsuranceDateChange}
                    format="YYYY/MM/DD"
                    locale="ja"
                    showMonthYearPicker
                    id="datePicker-empInsert-left"
                    className="form-control form-control-sm"
                    autoComplete="off"
                  />
                </InputGroup.Append>
              </InputGroup>           

              

              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text　id="sevenKanji">
                    退職年月日
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="退職年月日"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                  disabled
                />
              </InputGroup>
            </Col>
            <Col>
              <div className="blank-3"></div>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>番号</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="雇用保険番号"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>番号</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="社会保険番号"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                  disabled
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>区分</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="区分"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                  disabled
                />
              </InputGroup>
            </Col>
          </Row>
          <div style={{ textAlign: "center" }}>
              <Button
                size="sm"
                variant="info"
                onClick={this.insertEmployee}
                type="button"
                on
              >
                <FontAwesomeIcon icon={faSave} /> 登録
              </Button>
            </div>
        </Form>
      </div>
    );
  }
}

export default EmployeeInsertNew;
