import React from "react";
import { DatePicker as AntdDatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../asserts/css/style.css";
import "../asserts/css/newCssInsert.css"

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
      birthday: new Date(),
      image: "https://images.669pic.com/element_pic/54/25/82/94/d2825498dd97a2594c35d633e8454d19.jpg_w700wb",
      temporary_age: "",
      companyMail: "",
      socialInsuranceNo: "",
      socialInsuranceDate: null,
      employeeStatus: "",
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

  render() {
    const { 
      employmentInsurance, 
      socialInsurance, 
      socialInsuranceDate, 
      employeeStatus,
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
                  name="employeeFristName"
                  size="sm"
                />
                <FormControl
                  placeholder="社員名"
                  value={this.state.employeeLastName}
                  onChange={this.valueChange}
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
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>社内メール</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="社内メール"
                  value={this.state.phone}
                  onChange={this.valueChange}
                  name="phone"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>携帯電話</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="携帯電話"
                  value={this.state.phone}
                  onChange={this.valueChange}
                  name="phone"
                  size="sm"
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
                  name="postalCode"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>都道府県</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="都道府県"
                  value={this.state.prefecture}
                  onChange={this.valueChange}
                  name="prefecture"
                  size="sm"
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
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>卒業年月</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="卒業年月"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>来日年月</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="来日年月"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>入社年月</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="入社年月"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
                />
              </InputGroup>
              <InputGroup size="sm" >
                <InputGroup.Prepend>
                  <InputGroup.Text>経験年数</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="経験年数"
                  value={this.state.permission}
                  onChange={this.valueChange}
                  name="permission"
                  size="sm"
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
                    disabled={
                      residenceTimeDisabled ||
                      employeeStatus === "2" ||
                      employeeStatus === "1" ||
                      employeeStatus === "4"
                        ? true
                        : false
                    }
                    id={
                      residenceTimeDisabled ||
                      employeeStatus === "2" ||
                      employeeStatus === "1" ||
                      employeeStatus === "4"
                        ? "datePickerReadonlyDefault-empInsert-right-socialInsuranceDate"
                        : "datePicker-empInsert-right-socialInsuranceDate"
                    }
                    style={{ padding: "0px" }}
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
