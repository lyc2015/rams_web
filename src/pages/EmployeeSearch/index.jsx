import React, { useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import { Table, message, Form, Button, Col, Row, Input } from 'antd';
import FromCol from '../../components/EmployeeSearchInfo';

import moment from "moment";
moment.locale("ja");

export default function EmployeeSearch() {

    const initValues = {
        contractID: '',
        manager: '',
        contractor: '',
        contractDate: '',
        Introducer: '',
        caregiver: '',
        fee: '',
        IntroductFee: '',
        propertyMail: '',
        sales: '',
        contactAddr: '',
        roomAddr: '',
        asScheduledDate: '',
        currentMail: '',
        rent: '',
        applicationAmount: '',
        currentAddr: '',
        managementCompanyName: '',
        remark: '',
        visa: '',
    }
    const [values, setValues] = useState(initValues);
    const valueChange = (name, value) => {
        setValues({
            ...values,
            [name]: value
        });
    }

    const topLabelobjs = [
        {
            label: '社員形式',
            name: 'contractID',
            required: true,
            maxLength: 6
        },
        {
            label: '社員名',
            name: 'manager',
            required: true,
        }
    ];

    const labelObjs = [
        {
            label: '仲介区分',
            name: 'customerNo',
            maxLength: 8
        },
        {
            label: '部署',
            name: 'contractDate',
            required: true,
        },
        {
            label: '性別',
            name: 'introducer',
            maxLength: 8
        },
        {
            label: '国籍',
            name: 'realEstateName',
            maxLength: 50
        },
    ];

    const getRows = () => {
        return labelObjs.map((item, idx) => (
            <FromCol key={idx} {...item} value={values[item.name]} valueChange={valueChange} required={item.required}>
                {item.children && item.children}
            </FromCol>
        ));
    }

    const insertEmployee = (e) => {
        console.log(e);

        messageApi.open({
            type: 'error',
            content: 'This is a success message',
        });
        const reqStrs = ['contractID', 'contractDate', 'manager', 'rent'];
        const reqNulls = reqStrs.filter((item) => !values[item]);
        console.log(reqNulls);
    }

    const [messageApi, contextHolder] = message.useMessage();

    const data = [
        { key: 94, employeeId: 'BP015', name: '高橋 太郎', katakana: 'タカハシ タロウ', romaji: 'takabasi tarowu', dob: '1991/12/10', age: 32, phone: '080-0000-2211', station: '石岡', hireYear: '2021/06', joinYear: '2021/06' },
        { key: 95, employeeId: 'BP017', name: '協力-斎藤 次郎', katakana: '協力・サイトウジロウ', romaji: 'saitojiro saitojiro', dob: '1987/11/05', age: 36, phone: '090-2233-3344', station: 'ひたち野うしく', hireYear: '2021/01', joinYear: '2021/01' },
        //...（其他数据）
    ];

    const columns = [
        { title: '番号', dataIndex: 'key', key: 'key' },
        { title: '社員番号', dataIndex: 'employeeId', key: 'employeeId' },
        { title: '社員名', dataIndex: 'name', key: 'name' },
        { title: '社員形式', dataIndex: 'katakana', key: 'katakana' },
        { title: '仲介区分', dataIndex: 'romaji', key: 'romaji' },
        { title: '電話番号', dataIndex: 'age', key: 'age', render: (text, record) => `${record.dob} (${record.age})` },
        { title: '最寄駅', dataIndex: 'phone', key: 'phone' },
        { title: '経験年数', dataIndex: 'station', key: 'station' },
        { title: '入社年月', dataIndex: 'hireYear', key: 'hireYear' },
        { title: '来日年月', dataIndex: 'joinYear', key: 'joinYear' },
    ];

    return (
        <div className="container">
            {contextHolder}
            <Row className="text-center mb-3">
                <Col>
                    <h2>社員情報検索</h2>
                </Col>
            </Row>

            <Form>
                <Row gutter={16}>
                    {topLabelobjs.map((item, idx) => (
                        <Col key={idx} span={12}>
                            <Form.Item
                                label={item.label}
                                name={item.name}
                                rules={[{ required: item.required, message: `${item.label}を入力してください` }]}
                            >
                                <Input
                                    value={values[item.name]}
                                    onChange={(e) => valueChange(item.name, e.target.value)}
                                    maxLength={item.maxLength}
                                />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
                <Row gutter={16}>
                    {getRows()}
                </Row>
                <div style={{ textAlign: "center" }}>
                    <Button
                        type="primary"
                        onClick={insertEmployee}
                    >
                        <FontAwesomeIcon icon={faSave} /> 検索
                    </Button>
                    <Button
                        type="primary"
                        onClick={insertEmployee}
                        style={{ marginLeft: 8 }}
                    >
                        <FontAwesomeIcon icon={faSave} /> 追加
                    </Button>
                </div>
                <Row>
                    <Col span={24}>
                        <Table dataSource={data} columns={columns} pagination={{ pageSize: 10 }} />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
