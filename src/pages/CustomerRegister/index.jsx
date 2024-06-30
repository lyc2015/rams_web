import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNationalityCodes, fetchVISATypes, fetchCustomerBase, fetchStations, fetchMaxId } from '../../redux/customerRegister/actions.js';
import { useHistory, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import dateImg from '../../assets/images/date_icon.ico'
import axios from 'axios';
import { DatePicker, message, Select as AntSelect, AutoComplete } from "antd";
import FromCol from "../../components/SalesInfo/FromCol/index.jsx";
import request from "../../service/request.js";
import * as publicUtils from "../../utils/publicUtils.js";
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

    //国籍 
    const [allNationalityInfo, setAllNationalityInfo] = useState([]);
    const [nationalityOptions, setNationalityOptions] = useState('');
    const [inputNationalityValue, setInputNationalityValue] = useState('');

    //visa
    const [visaOptions, setVisaOptions] = useState('');
    const [allVisaInfo, setAllVisaInfo] = useState([]);
    const [inputVisaValue, setInputVisaValue] = useState('');

    //顧客出所
    const [customerBaseOptions, setCustomerBaseOptions] = useState('');
    const [allCustomerBase, setAllCustomerBase] = useState([]);
    const [inputCustomerBaseValue, setInputCustomerBaseValue] = useState('');


    //最寄り駅
    const [stationOptions, setStationOptions] = useState('');
    const [allStation, setAllStation] = useState([]);
    const [inputStationeValue, setInputStationBaseValue] = useState('');

    const handleStationSearch = (value) => {
        setInputStationBaseValue(value);
    };

    const handleStationSelect = (value) => {
        setInputStationBaseValue(value);
    };

    const filterStationOption = (setInputStationBaseValue, option) =>
        option.value.toLowerCase().includes(setInputStationBaseValue.toLowerCase());


    const handleSearch = (value) => {
        setInputNationalityValue(value);
    };

    const handleVisaSearch = (value) => {
        setInputVisaValue(value);
    };

    const handleCustomerBaseSearch = (value) => {
        setInputCustomerBaseValue(value);
    };

    const handleSelect = (value) => {
        setInputNationalityValue(value);
    };

    const handleVisaSelect = (value) => {
        setInputVisaValue(value);
    };

    const handleCustomerBaseSelect = (value) => {
        setInputCustomerBaseValue(value);
    };

    const filterOption = (setInputNationalityValue, option) =>
        option.value.toLowerCase().includes(setInputNationalityValue.toLowerCase());

    const filterVisaOption = (setInputVisaValue, option) =>
        option.value.toLowerCase().includes(setInputVisaValue.toLowerCase());

    const filterCustomerBaseOption = (setInputCustomerBaseValue, option) =>
        option.value.toLowerCase().includes(setInputCustomerBaseValue.toLowerCase());


    //郵便番号api
    const postApi = (event) => {

        //errorMsgをクリア

        const reg_Tel = /^[0-9]+$/;
        let value = event.target.value;


        message.error(value)
        console.log('reg_Tel.test(value)', reg_Tel.test(value))


        if (value !== '' && reg_Tel.test(value)) {
            const promise = Promise.resolve(publicUtils.postcodeApi(value));
            promise.then((data) => {

                if (data !== undefined && data !== null && data !== "") {
                    setAddress(data)

                } else {
                    message.error('正しい郵便番号を入力してください')
                    setAddress('')
                }
            });
        } else if (value !== '' && !reg_Tel.test(value)) {
            message.error('正しい郵便番号を入力してください')
        }
    };



    //redux---------------------------------------
    const dispatch = useDispatch();
    const history = useHistory();

    const nationalityCodes = useSelector(state => state.data.nationalityCodes);
    const visaTypes = useSelector(state => state.data.visaTypes);
    const customerSource = useSelector(state => state.data.customerSource);
    const allStations = useSelector(state => state.data.stations);
    const maxId = useSelector(state => state.data.maxId);
    const loading = useSelector(state => state.data.loading);
    const error = useSelector(state => state.data.error);


    useEffect(() => {
        dispatch(fetchNationalityCodes());
        dispatch(fetchVISATypes());
        dispatch(fetchCustomerBase());
        dispatch(fetchStations());
        dispatch(fetchMaxId());
    }, [dispatch]);

    //FETCH_STATION

    useEffect(() => {
        if (nationalityCodes.length && visaTypes.length && customerSource.length   && maxId) {
            setAllNationalityInfo(nationalityCodes);
            setNationalityOptions(nationalityCodes);
            setAllVisaInfo(visaTypes);
            setVisaOptions(visaTypes);
            setAllCustomerBase(customerSource);
            setCustomerBaseOptions(customerSource);
            // setAllStation(allStations);
            // allStations(allStations);
            setCustomerID(maxId.maxID);
            message.success("顧客出所、国籍、ビザ情報取得成功");

            console.log('allStations', allStations)
        }
    }, [nationalityCodes, visaTypes, customerSource, maxId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    //---------------------------------------



    //登録する際に、各項目をチェック
    const checkItems = () => {

        const resultNationality = allNationalityInfo.find(item => item.value === inputNationalityValue)
        const resultVisa = allVisaInfo.find(item => item.value === inputVisaValue)
        const resultCustomerBase = allCustomerBase.find(item => item.value === inputCustomerBaseValue)

        if (inputCustomerBaseValue === '') {
            message.error('顧客出所を入力してください');
        }
        else if (inputCustomerBaseValue !== '' && resultCustomerBase === undefined) {
            message.error('正しい顧客出所を入力してください');
        }
        else if (customerLastName === '' || customerFirstName === '') {
            message.error('お客様名を入力してください');
        }



    }





    const testRegister = () => {

        checkItems();

        const resultNationality = allNationalityInfo.find(item => item.value === inputNationalityValue)
        const resultVisa = allVisaInfo.find(item => item.value === inputVisaValue)
        const resultCustomerBase = allCustomerBase.find(item => item.value === inputCustomerBaseValue)

        if (inputNationalityValue !== '' && resultNationality !== undefined) {
            setNationalityCode(resultNationality.key ? resultNationality.key : '');
        } else if (inputNationalityValue !== '' && resultNationality === undefined) {
            message.error('正しい国籍を入力してください');
        }

        if (inputVisaValue !== '' && resultVisa !== undefined) {
            setResidenceCode(resultVisa.key);
        } else if (inputVisaValue !== '' && resultVisa === undefined) {
            message.error('正しいビザタイプを入力してください');
        }


        //赋值
        if (inputCustomerBaseValue !== '' && resultCustomerBase !== undefined) {
            setCustomerBase(resultCustomerBase.key);
        }


        console.log('resultNationality----', resultNationality)

        //  console.log('resultNationality.key----', resultNationality.key )
        //  console.log('resultVisa.key----', resultVisa.key)
        //  console.log('resultCustomerBase.key.key----', resultCustomerBase.key)





    }


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
                                // onChange={(e) => setCustomerID(e.target.value)}
                                size="sm"
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

                            <AutoComplete
                                style={{ flexGrow: '1' }}
                                options={customerBaseOptions}
                                onSearch={handleCustomerBaseSearch}
                                value={inputCustomerBaseValue}
                                onChange={setInputCustomerBaseValue}
                                onSelect={handleCustomerBaseSelect}
                                filterOption={filterCustomerBaseOption}>
                            </AutoComplete>

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

                            <AutoComplete
                                options={nationalityOptions}
                                onSearch={handleSearch}
                                style={{ flexGrow: '1' }}
                                value={inputNationalityValue}
                                onChange={setInputNationalityValue}
                                onSelect={handleSelect}
                                filterOption={filterOption}>
                            </AutoComplete>

                        </InputGroup>
                    </Col>

                    <Col md={3}>
                        <InputGroup size="sm" >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="threeKanji">
                                    ビザ
                                </InputGroup.Text>
                            </InputGroup.Prepend>


                            <AutoComplete
                                options={visaOptions}
                                onSearch={handleVisaSearch}
                                style={{ flexGrow: '1' }}
                                value={inputVisaValue}
                                onChange={setInputVisaValue}
                                onSelect={handleVisaSelect}
                                filterOption={filterVisaOption}>
                            </AutoComplete>


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


                            <AutoComplete
                                style={{ flexGrow: '1' }}
                                options={stationOptions}
                                onSearch={handleStationSearch}
                                value={inputStationeValue}
                                onChange={setInputStationBaseValue}
                                onSelect={handleStationSelect}
                                filterOption={filterStationOption}>
                            </AutoComplete>
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
                                onBlur={postApi}
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
                    <Button size="sm" variant="info" onClick={testRegister} >
                        登録
                    </Button>

                    <Button size="sm" variant="info" style={{ marginLeft: '20px' }}>
                        戻る
                    </Button>
                </div>

            </Form>
            <br />
        </div>

        // <Provider store={store}>
        // </Provider>

    )
}
