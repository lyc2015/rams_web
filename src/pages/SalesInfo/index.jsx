import React, { useCallback, useEffect, useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
// import dateImg from '../../asserts/css/date_24px_533395_easyicon.net.ico'
import dateImg from '../../assets/images/date_icon.ico'

import { DatePicker, message, Select as AntSelect } from "antd";
import FromCol from "../../components/SalesInfo/FromCol/index.jsx";
import SalesTable from '../../components/SalesInfo/SalesTable/index.jsx';

import request from "../../service/request.js";

import { postcodeApi } from "../../utils/publicUtils.js"

import {
    Form,
    Button,
    Row,
    Col,
    InputGroup,
    FormControl
} from "react-bootstrap";

import './index.css'


import moment from "moment";
const dateIcon = <img src={dateImg} alt="" />;
// const data=(value1,value2)=>{
//     const val=value1.
// }
console.log('moment', moment().format("YYYY-MM-DD"));

export default function SalesInfo() {


    const [messageApi, contextHolder] = message.useMessage();

    const initValues = {
        contractId: '',
        customerNo: '',
        contractDate: '',
        realEstateName: '',
        realEstatePostCode: '',
        realEstateAddress: '',
        rent: '',
        realEstateManagementCompanyCode: '',
        institutionId: '',
        introducer: '',
        introducerFee: '',
        commissionAdCode: null,
        bankSales: '',
        asScheduledDate: '',
        applicationAmount: '',
        remark: '',
        employeeNo: '',
        contactInfo: '',
        currentPostal: '',
        currentAddress: '',
        visa: '',
    }
    const [values, setValues] = useState(initValues)

    const [employeeOption, setEmployeeOption] = useState([])
    const [adCodeList, setAdCodeList] = useState([])
    const [custList, setCustList] = useState([])
    const [companyList, setCompanyList] = useState([])
    const [phoneObj, setPhoneObj] = useState({
        phoneNo1: '',
        phoneNo2: '',
        phoneNo3: ''
    })
    const [institutionInfo, setInstitutionInfo] = useState([])
    const [visaList, setVisaList] = useState([])


    useEffect(() => {

        const getOption = (item) => {
            const obj = { value: item.id, label: `${item.firstName + item.lastName}(${item.id})` }
            return obj
        }
        const fetchData = async () => {
            const data = await request.get('/getSalesBaseInfo');
            const newList = data.employeeList.map(getOption)
            setEmployeeOption(newList)
            setAdCodeList(data.adCodeList)
            const cList = data.customerList.map(getOption)
            setCustList(cList)
            setCompanyList(data.company)
            setInstitutionInfo(data.institutionInfo)
            setVisaList(data.visaList)

        };



        fetchData();

    }, [])
    const [refreshFlag, setRefreshFlag] = useState(false)

    useEffect(() => {

        const getNextId = async () => {
            const data = await request.get('/sales/getSalesId');

            setValues({
                ...values,
                contractId: data.nextId
            })

        };

        getNextId();

    }, [refreshFlag])

    const dateChange = (name, e, value) => {
        setValues({
            ...values,
            [name]: value
        })


    }

    useEffect(() => {

       const nowAd= adCodeList.find(item=>item.value===values.commissionAdCode)
       if(nowAd&&values.rent){
        const adNum =parseInt(nowAd.label)/100
        const introducerFee=adNum


       }
        
        
        
    }, [values.commissionAdCode,values.rent])


    const getPostCode = async (valueInput, inputName) => {
        const res = await postcodeApi(values[valueInput])
        valueChange(inputName, res)
    }

    const valueChange = (name, value) => {
        setValues({
            ...values,
            [name]: value
        })
    }
    const selChange = (name, value) => {
        console.log(name, value);
        valueChange(name, value)
    }
    const phoneChange = (e, name) => {
        const value = e.target.value
        setPhoneObj({
            ...phoneObj,
            [name]: value
        })
    }

    useEffect(() => {
        const phone = '' + phoneObj.phoneNo1 + phoneObj.phoneNo2 + phoneObj.phoneNo3
        setValues({
            ...values,
            contactInfo: phone
        })
        console.log("values", values);

    }, [phoneObj])

    const textchange = (e) => {
        console.log('textarea', e.target.value);

    }
    // 第一行搜索项
    const topLabelobjs = [
        {
            label: '契約ID',
            name: 'contractId',
            required: true,
            maxLength: 6,
            disabled: true,
        },
        {
            label: '担当者',
            name: 'employeeNo',
            required: true,
            children:
                <AntSelect
                    className="form-control form-control-sm"
                    bordered={false}
                    showArrow={false}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={employeeOption}
                    onChange={(e) => selChange("employeeNo", e)}
                    value={values.employeeNo}
                />

        }
    ]


    const labelObjs = [
        {
            label: '契約者',
            name: 'customerNo',
            maxLength: 8,
            children:
                <AntSelect
                    className="form-control form-control-sm"
                    bordered={false}
                    showArrow={false}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={custList}
                    onChange={(e) => selChange("customerNo", e)}
                    value={values.customerNo}
                />


        },
        {
            label: '契約日',
            name: 'contractDate',
            required: true,
            children: <DatePicker
                allowClear={false}
                format="YYYY-MM-DD"
                className="form-control form-control-sm"
                suffixIcon={dateIcon}
                onChange={(e, value) => dateChange("contractDate", e, value)}
                locale={'ja'}
            />
        },
        {
            label: '紹介人(機構)',
            name: 'introducer',
            maxLength: 8,
            children:
                <AntSelect
                    className="form-control form-control-sm"
                    bordered={false}
                    showArrow={false}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={institutionInfo}
                    onChange={(e) => selChange("introducer", e)}
                    value={values.introducer}
                />

        },
        {
            label: '物件名',
            name: 'realEstateName',
            maxLength: 50
        },
        {
            label: '手数料(AD)',
            name: 'commissionAdCode',
            children: <AntSelect
                className="form-control form-control-sm"
                bordered={false}
                options={adCodeList}
                onChange={(e) => selChange("commissionAdCode", e)}
                value={values.commissionAdCode}
            />

        },
        {
            label: '紹介費',
            name: 'introducerFee',
            disabled: true,

        },
        {
            label: '物件郵便',
            name: 'realEstatePostCode',
            onBlur: () => {
                getPostCode('realEstatePostCode', 'realEstateAddress')
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
            children:
                <>
                    <FormControl

                        autoComplete="off"

                        size="sm"
                        name="phoneNo1"
                        maxLength="3"
                        value={phoneObj.phoneNo1}
                        onChange={(e) => phoneChange(e, "phoneNo1")}
                    />
                    <InputGroup.Prepend>
                        <InputGroup.Text className="width-auto bdr0">
                            —
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        autoComplete="off"
                        size="sm"
                        name="phoneNo2"
                        maxLength="4"
                        value={phoneObj.phoneNo2}
                        onChange={(e) => phoneChange(e, "phoneNo2")}

                    />
                    <InputGroup.Prepend>
                        <InputGroup.Text className="width-auto bdr0">
                            —
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        autoComplete="off"
                        size="sm"
                        name="phoneNo3"
                        maxLength="4"
                        value={phoneObj.phoneNo}
                        onChange={(e) => phoneChange(e, "phoneNo3")}
                    />
                </>
        },
        {
            label: '部屋住所',
            name: 'realEstateAddress',
        },
        {
            label: 'AD予定日',
            name: 'asScheduledDate',
            children: <DatePicker
                locale="ja"
                showMonthYearPicker
                showFullMonthYearPicker
                className="form-control form-control-sm"
                suffixIcon={dateIcon}

            />
        },
        {
            label: '現郵便',
            name: 'currentPostal',
            onBlur: () => {
                getPostCode('currentPostal', 'currentAddress')
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
            children:
                <AntSelect
                    className="form-control form-control-sm"
                    bordered={false}
                    showArrow={false}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={companyList}
                    onChange={(e) => selChange("realEstateManagementCompanyCode", e)}
                    value={values.realEstateManagementCompanyCode}
                />
        },
        {
            label: '備考',
            name: 'remark',
            children:
                <textarea className="form-control form-control-sm remark" rows={5} placeholder="備考" cols={3} maxLength={50} wrap='auto' value={values.remark} onChange={(e) => valueChange('remark', e.target.value)} />
        },
        {
            label: 'ビザ',
            name: 'visa',
            children: <AntSelect
                className="form-control form-control-sm"
                bordered={false}
                options={visaList}
                onChange={(e) => selChange("visa", e)}
                value={values.visa} />
        }
    ]

    const getRows = () => {
        return labelObjs.map((item, idx) =>
            <FromCol key={idx} {...item} value={values[item.name]} valueChange={valueChange} required={item.required} >
                {item.children && item.children}
            </FromCol>)
    }


    const insertEmployee = async (e) => {
        console.log('values', values);

        const reqStrs = [
            {
                name: 'contractId', value: '契約ID'
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
        try {
            const res = await request.post('/sales/insertSales', values)
            console.log(res);
            if (!res.result) {
                messageApi.open({
                    type: 'error',
                    content: `登録失敗しました`,
                });
                return

            }
            messageApi.open({
                type: 'success',
                content: `登録成功しました`,
            });

            setValues({
                ...initValues
            })

            setRefreshFlag(!refreshFlag)

        } catch (err) {
            console.log(err);

        }




    }


    return (
        <div className="container salesInfo">
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
            <SalesTable />

        </div>
    )
}




