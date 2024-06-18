import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Table, message, Form, Button, Col, Row, Input } from 'antd';
import moment from "moment";
import FromCol from '../../components/EmployeeSearch';

import request from '../../service/request';

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
    const [data, setData] = useState([]);
    const [allData, setallData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const history = useHistory();

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

    const getRows = (items) => {
        return items.map((item, idx) => (
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

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await request.get('/employee/all');
                setallData(response);
                console.log('Fetched employees:', typeof(response));
                console.log('Fetched employees:-----------------', response.data);
                const transformedData = response.map((item, index) => ({
                    key: index,
                    employeeId: item.employeeNo,
                    name: `${item.employeeFirstName} ${item.employeeLastName}`,
                    katakana: '', // 假设没有相应的字段，需要手动添加
                    romaji: '', // 假设没有相应的字段，需要手动添加
                    dob: '', // 假设没有相应的字段，需要手动添加
                    age: '', // 需要计算年龄
                    phone: item.phoneNo,
                    station: '', // 假设没有相应的字段，需要手动添加
                    hireYear: item.intoCompanyYearAndMonth,
                    joinYear: item.comeToJapanYearAndMonth,
                }));
                setData(transformedData);
            } catch (error) {
                console.error('Failed to fetch employees:', error);
                message.error('Failed to fetch employees');
            }
            setLoading(false);
        };

        fetchEmployees();
    }, []);

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleEditClick = () => {
        if (selectedRowKeys.length !== 1) {
            message.error('Please select exactly one row to edit.');
            return;
        }
        const selectedEmployeeId = selectedRowKeys[0];
        console.log("data", data);
        console.log("data", data[selectedEmployeeId]);
        history.push(`/submenu/employeeInsertNew`, { employee: data[selectedEmployeeId] });
    };

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
                    {getRows(topLabelobjs)}
                </Row>
                <Row gutter={16}>
                    {getRows(labelObjs)}
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
                <div style={{ height: "10px" }}></div>
                <div>
                    <Row>
                        <Col>
                        <div style={{ float: "right" }}>
                            <Button
                                size="sm"
                                name="clickButton"
                                id="update"
                                variant="info"
                                onClick={handleEditClick}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                                修正
                            </Button>{" "}
                        </div>
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col span={24}>
                        <Table
                            rowSelection={rowSelection}
                            dataSource={data}
                            columns={columns}
                            pagination={{ pageSize: 10 }}
                            loading={loading}
                            onRow={(record) => ({
                                onClick: () => {
                                    setSelectedRowKeys([record.key]);
                                },
                            })}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
