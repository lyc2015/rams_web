import React, { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
// import dateImg from '../../asserts/css/date_24px_533395_easyicon.net.ico'
import dateImg from '../../asserts/images/date_icon.ico'

import { DatePicker, message } from "antd";
import FromCol from "../../components/SalesInfo/FromCol/index.jsx";

import http from '../../utils/Http.js';

import { postcodeApi } from "../../utils/publicUtils.js"

import {
    Form,
    Button,
    Col,
    Row
} from "react-bootstrap";

import moment from "moment";
moment.locale("ja");
const dateIcon = <img src={dateImg} />



export default function SalesInfo() {




    const initValues = {
        contractId:'',
        customerNo:'',
        contractDate:'',
        realEstateName:'',
        realEstatePostCode:'',
        realEstateAddress:'',
        rent:'',
        realEstateManagementCompanyCode:'',
        institutionId:'',
        introducer:'',
        introducerFee:'',
        commissionAdCode:'',
        bankSales:'',
        asScheduledDate:'',
        applicationAmount:'',
        remark:'',
        employeeNo:'',
        contactInfo:'',
        currentPostal:'',
        currentAddress:'',
        visa:'',
    }
    const [values, setValues] = useState(initValues)


    const valueChange = (name, value) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    const getPostCode=async (valueInput,inputName) => {
        const res = await postcodeApi(values[valueInput])
        valueChange(inputName,res)
    }
    // 第一行搜索项
    const topLabelobjs = [
        {
            label: '契約ID',
            name: 'contractId',
            required: true,
            maxLength: 6
        },
        {
            label: '担当者',
            name: 'employeeNo',
            required: true,

        }
    ]


    const labelObjs = [
        {
            label: '契約者',
            name: 'customerNo',
            maxLength: 8

        },
        {
            label: '契約日',
            name: 'contractDate',
            required: true,
            children: <DatePicker
                autoComplete="off"
                locale="ja"
                showMonthYearPicker
                showFullMonthYearPicker
                className="form-control form-control-sm"
                dateFormat="yyyy/MM"
                suffixIcon={dateIcon}
            />
        },
        {
            label: '紹介人(機構)',
            name: 'introducer',
            maxLength: 8

        },
        {
            label: '物件名',
            name: 'realEstateName',
            maxLength: 50
        },
        {
            label: '手数料(AD)',
            name: 'commissionAdCode',

        },
        {
            label: '紹介費',
            name: 'introducerFee',
            disabled: true,

        },
        {
            label: '物件郵便',
            name: 'realEstatePostCode',
            onBlur:()=>{
                getPostCode('realEstatePostCode','realEstateAddress')
            }
        },
        {
            label: '銀行売上',
            name: 'bankSales',
            maxLength: 6,
            type: 'number'
        },
        {
            label: '連絡先',
            name: 'contactInfo',
        },
        {
            label: '部屋住所',
            name: 'realEstateAddress',
        },
        {
            label: 'AD予定日',
            name: 'asScheduledDate',
            children: <DatePicker
                autoComplete="off"
                locale="ja"
                showMonthYearPicker
                showFullMonthYearPicker
                className="form-control form-control-sm"
                dateFormat="yyyy/MM"
                suffixIcon={dateIcon}
            />
        },
        {
            label: '現郵便',
            name: 'currentPostal',
            onBlur:()=>{
                getPostCode('currentPostal','currentAddr')
            }

        },
        {
            label: '家賃',
            name: 'rent',
            required: true
        },
        {
            label: '申込金',
            name: 'applicationAmount',
            maxLength: 6,
            type: 'number'
        },
        {
            label: '現住所',
            name: 'currentAddress',
        },
        {
            label: '管理会社',
            name: 'realEstateManagementCompanyCode',
        },
        {
            label: '備考',
            name: 'remark',
        },
        {
            label: 'ビザ',
            name: 'visa',
        }
    ]

    const getRows = () => {
        return labelObjs.map((item, idx) =>
            <FromCol key={idx} {...item} value={values[item.name]} valueChange={valueChange} required={item.required} >
                {item.children && item.children}
            </FromCol>)
    }

    const insertEmployee = async (e) => {
        console.log(e);
        try {
            const res = await http.get('/sales/getSales')
            console.log(res);

        } catch (err) {
            console.log(err);

        }
        const reqStrs = [
            {
                name: 'contractID', value: '契約ID'
            },
            {
                name: 'employeeNo', value: '担当者'
            },
            {
                name: 'contractDate', value: '契約日'
            },
            {
                name: 'rent', value: '家賃'
            }]
        const reqNulls = reqStrs.filter((item) => !values[item.name]);
        const reqNullStrs = reqNulls.map((item) => item.value)
        if (reqNullStrs.length !== 0) {
            messageApi.open({
                type: 'error',
                content: `${reqNullStrs.join()}  を入力してください。`,
            });
            return
        }
        console.log('后续');


    }

    const [messageApi, contextHolder] = message.useMessage();


    return (
        <div className="container">
            {contextHolder}
            <Row className="text-center mb-3">
                <Col>
                    <h2>売上情報登録(賃貸)</h2>
                </Col>
            </Row>

            <Form>
                <Row>
                    {topLabelobjs.map((item, idx) => <FromCol key={idx} {...item} value={values[item.name]} valueChange={valueChange} required={item.required} />)}
                </Row>
                <Row >

                    {getRows()}

                </Row>
                <div style={{ textAlign: "center" }}>
                    <Button
                        size="sm"
                        variant="info"
                        onClick={insertEmployee}
                        type="button"

                    >
                        <FontAwesomeIcon icon={faSave} /> 登録
                    </Button>
                </div>
            </Form>
        </div>
    )
}




