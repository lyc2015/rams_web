import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import dateImg from '../../assets/images/date_icon.ico'

import { DatePicker, message, Select as AntSelect } from "antd";
import FromCol from "../../components/SalesInfo/FromCol/index.jsx";
import SalesTable from '../../components/SalesInfo/SalesTable/index.jsx';

import request from "../../service/request.js";

import { postcodeApi } from "../../utils/publicUtils.js"
import "./index.css";


import {
    Form,
    Button,
    Row,
    Col,
    InputGroup,
    FormControl
} from "react-bootstrap";

// Moment
import moment from "moment";
moment.locale("ja");

const dateIcon = <img src={dateImg} alt="" />;

export default function CustomerRegister() {

    //inputboxの値
    const [customerID, setCustomerID] = useState('');

    const [customerBase, setCustomerBase] = useState('');

    const [customerName, setCustomerName] = useState('');
    const [customerLastName, setCustomerLastName] = useState('');
    const [customerFirstName, setCustomerFirstName] = useState('');

    const [temporary_age, setTemporary_age] = useState('');

    //カレンダーの値
    const [birthday, setBirthday] = useState('');

    const inactiveBirthday = (date) => {
        setBirthday(date);
        setTemporary_age(calculateAge(date));
    };

    const calculateAge = (birthday) => {
        const today = moment();
        const birthDate = moment(birthday);
        let age = today.year() - birthDate.year();
        const monthDiff = today.month() - birthDate.month();
        if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDate.date())) {
            age--;
        }

        if (age <= 0) {
            return 0;
        } else {
            return age;
        }

    };



    const [katakana, setKatakana] = useState('');
    const [lastKatakana, setLastKatakana] = useState('');
    const [firstKatakana, setFirstKatakana] = useState('');
    const [alphabetName, setAlphabetName] = useState('');
    const [alphabetFirstName, setAlphabetFirstName] = useState('');
    const [alphabetLastName, setAlphabetLastName] = useState('');


    const [nationality, setNationality] = useState('');
    const [nationalityCode, setNationalityCode] = useState('');
    const [visa, setVisa] = useState('');
    const [residenceCode, setResidenceCode] = useState('');
    const [mail, setMail] = useState('');

    const [postcode, setPostcode] = useState('');

    const [station, setStation] = useState('');
    const [address, setAddress] = useState('');
    const [stationCode, setStationCode] = useState('');

    const [remark, setRemark] = useState('');
    const [genderStatus, setGenderStatus] = useState('');

    const [phoneNo, setPhoneNo] = useState('');
    const [phoneNo1, setPhoneNo1] = useState('');
    const [phoneNo2, setPhoneNo2] = useState('');
    const [phoneNo3, setPhoneNo3] = useState('');

    const [updateUser, setUpdateUser] = useState('');


    return (
        <div className="container"><br></br>
            <Row className="text-center mb-3">
                <Col>
                    <h2>お客様情報登録</h2>
                </Col>
            </Row>

            <Form>
                <Row>
                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fourKanji">
                                    お客様ID
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={customerID}
                                onChange={(e) => setCustomerID(e.target.value)}
                                size="sm"
                                maxLength={7}
                                disabled
                            />
                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" className="required-mark">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fourKanji">
                                    顧客出所
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={customerBase}
                                size="sm"
                                onChange={(e) => setCustomerBase(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row><br />


                <Row>
                    <Col md={3}>
                        <InputGroup size="sm" className="required-mark">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fourKanji">
                                    お客様名
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={customerLastName}
                                onChange={(e) => setCustomerLastName(e.target.value)}
                                size="sm"
                                maxLength={7}
                                placeholder='氏'
                            />
                            <FormControl
                                value={customerFirstName}
                                onChange={(e) => setCustomerFirstName(e.target.value)}
                                size="sm"
                                maxLength={7}
                                placeholder='名'
                            />
                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    性別
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                as="select"
                                size="sm"
                                value={genderStatus}
                                onChange={(e) => setGenderStatus(e.target.value)}
                                autoComplete="off"
                            >
                                <option value="">選択してください</option>
                                <option value="0">男性</option>
                                <option value="1">女性</option>
                            </Form.Control>
                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    国籍
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={nationality}
                                size="sm"
                                maxLength={7}
                                onChange={(e) => setNationality(e.target.value)}
                            />
                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    ビザ
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={visa}
                                size="sm"
                                maxLength={10}
                                onChange={(e) => setVisa(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row><br />


                <Row>
                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fourKanji">
                                    カタカナ
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={lastKatakana}
                                size="sm"
                                maxLength={7}
                                placeholder='セイ'
                                onChange={(e) => setLastKatakana(e.target.value)}
                            />
                            <FormControl
                                value={firstKatakana}
                                size="sm"
                                maxLength={7}
                                placeholder='メイ'
                                onChange={(e) => setFirstKatakana(e.target.value)}
                            />
                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    年齢
                                </InputGroup.Text>
                            </InputGroup.Prepend>


                            <div className='birthday-wrapper' style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <InputGroup.Prepend>
                                    <DatePicker
                                        allowClear={true}
                                        suffixIcon={false}
                                        value={birthday ? moment(birthday) : ""}
                                        onChange={inactiveBirthday}
                                        format="YYYY/MM/DD"
                                        locale="ja"
                                        showMonthYearPicker
                                        className="form-control form-control-sm birthday-dateime"
                                        autoComplete="off"
                                        id="datePicker"
                                    />
                                </InputGroup.Prepend>
                            </div>

                            <FormControl
                                style={{
                                    padding: '0 5px',
                                    width: 30,
                                    flexGrow: 0,
                                }}
                                value={isNaN(temporary_age) ? "" : temporary_age}
                                onChange={setTemporary_age}
                                autoComplete="off"
                                size="sm"
                                disabled
                            />
                            <FormControl style={{
                                width: 30,
                                flexGrow: 0,
                            }} value="歳" size="sm" disabled />
                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    連絡先
                                </InputGroup.Text>
                            </InputGroup.Prepend>

                            <FormControl
                                value={phoneNo1}
                                autoComplete="off"
                                onChange={(e) => setPhoneNo1(e.target.value)}
                                size="sm"
                                maxLength="3"
                            />
                            <InputGroup.Prepend>
                                <InputGroup.Text className="width-auto bdr0" style={{ padding: '0' }}>
                                    —
                                </InputGroup.Text>
                            </InputGroup.Prepend>

                            <FormControl
                                value={phoneNo2}
                                autoComplete="off"
                                onChange={(e) => setPhoneNo2(e.target.value)}
                                size="sm"
                                maxLength="4"
                            />
                            <InputGroup.Prepend>
                                <InputGroup.Text className="width-auto bdr0" style={{ padding: '0' }}>
                                    —
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={phoneNo3}
                                autoComplete="off"
                                onChange={(e) => setPhoneNo3(e.target.value)}
                                size="sm"
                                maxLength="4"
                            />

                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    メール
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={mail}
                                size="sm"
                                maxLength={7}
                                onChange={(e) => setMail(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row><br />

                <Row>
                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fourKanji">
                                    ローマ字
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={alphabetLastName}
                                size="sm"
                                maxLength={7}
                                placeholder='LastName'
                                onChange={(e) => setAlphabetLastName(e.target.value)}
                            />
                            <FormControl
                                value={alphabetFirstName}
                                size="sm"
                                maxLength={7}
                                placeholder='FirstName'
                                onChange={(e) => setAlphabetFirstName(e.target.value)}
                            />
                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    最寄駅
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={station}
                                size="sm"
                                maxLength={7}
                                onChange={(e) => setStation(e.target.value)}
                            />
                        </InputGroup>
                    </Col>

                    <Col md={6}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    備考
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={remark}
                                size="sm"
                                maxLength={7}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row><br />


                <Row>
                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fourKanji">
                                    郵便番号
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={postcode}
                                size="sm"
                                maxLength={7}
                                onChange={(e) => setPostcode(e.target.value)}
                            />
                        </InputGroup>
                    </Col>


                    <Col md={5}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    住所
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                value={address}
                                size="sm"
                                maxLength={7}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row><br />

                <div style={{ textAlign: "center" }}>
                    <Button size="sm" variant="info"  >
                        登録
                    </Button>

                    <Button size="sm" variant="info" style={{ marginLeft: '20px' }}>
                        戻る
                    </Button>
                </div>

            </Form>

        </div>

    )
}
