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
    const [tableData, setTableData] = useState([]);
    const [transformedData, setTransformedData] = useState([]);
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
            maxLength: 6
        },
        {
            label: '社員名',
            name: 'manager',
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
        { title: '社員名', dataIndex: 'employeeName', key: 'employeeName' },
        { title: '社員形式', dataIndex: 'employeeFormCode', key: 'employeeFormCode' },
        { title: '仲介区分', dataIndex: 'homesAgentCode', key: 'homesAgentCode' },
        { title: '電話番号', dataIndex: 'phoneNo', key: 'phoneNo', },
        { title: '最寄駅', dataIndex: 'stationCode', key: 'stationCode' },
        { title: '経験年数', dataIndex: 'yearsOfExperience', key: 'yearsOfExperience' },
        { title: '入社年月', dataIndex: 'hireYear', key: 'hireYear' },
        { title: '来日年月', dataIndex: 'joinYear', key: 'joinYear' },
    ];

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await request.get('/employee/all');
                const tableData = response.map((item, index) => ({
                    key: index,
                    employeeId: item.employeeNo,
                    employeeName: `${item.employeeFirstName} ${item.employeeLastName}`,
                    employeeFormCode: item.employeeFormCode,
                    homesAgentCode: item.homesAgentCode,
                    phoneNo: item.phoneNo,
                    stationCode: item.stationCode,
                    yearsOfExperience: item.yearsOfExperience,
                    hireYear: item.intoCompanyYearAndMonth,
                    joinYear: item.comeToJapanYearAndMonth,
                }));
                setTableData(tableData);
                const tData = response.map((item, index) => ({
                    key: index,
                    ...Object.entries(item).reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {})
                }));
                setTransformedData(tData);
            } catch (error) {
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
        history.push(`/submenu/employeeInsertNew`, { employee: transformedData[selectedEmployeeId] });
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
                    <Button size="sm" variant="info" onClick={insertEmployee}>
                    検索
                    </Button>

                    <Button size="sm" variant="info" style={{marginLeft:'20px'}}>
                    追加
                    </Button>

                </div><br/>   
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
                            dataSource={tableData}
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
