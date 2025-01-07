import React, { Component } from "react";
import {
    Row,
    Form,
    Col,
    InputGroup,
    Button,
} from "react-bootstrap";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as utils from "./utils/publicUtils.js";
import store from "./redux/store";
import { Table, Input, Form as AntForm, notification } from "antd";
import { formatPayroll, COLORS } from './payrollData.js'
axios.defaults.withCredentials = true;


export default class Payroll extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState; //初期化
    }
    initialState = {
        employeeNo: "", //社員番号
        employeeName: "",
        EmployeeFormCodeDrop: [], //社員性質select
        employeeNameDrop: [], //社員名select
        searchFlag: false,
        sendValue: {},
        employeeStatusList: store.getState().dropDown[4],
        payrollList: [],
        period: '',
        employeeInfo: {},
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
        pageSize: 20,
        averageTrafficData: {},
        averageOtherData: {},
        table_key: 0,
        currentPage: 1
    }

    componentDidMount() {
        this.setemployeeStatusList();
        this.getNewEmployeeNameDrop();
        if (!!this.props.location.state) {
            this.setState({
                sendValue: this.props.location.state.sendValue,
                searchFlag: this.props.location.state.searchFlag,
                employeeName: this.props.location.state.employeeNo,
                employeeNo: this.props.location.state.employeeNo,
                backPage: this.props.location.state.backPage,
            });
            if (!!this.props.location.state.employeeNo) {
                this.getList(this.props.location.state.employeeNo)
            }
        }
    }
    getList = async (employeeNo) => {
        axios
            .post(this.state.serverIP + "subMenu/getPayroll", { employeeNo })
            .then((response) => {
                let _list = formatPayroll(response.data, this.state.pageSize)
                this.setState({
                    payrollList: [..._list],
                })
            })
            .catch((error) => {
                console.error("Error - " + error);
                notification.error({
                    message: "エラー",
                    description: `${error}`,
                    placement: "topLeft",
                });
            });
    }

    getNewEmployeeNameDrop = () => {
        let employee = this.state.employeeNameDrop;
        employee = store.getState().dropDown[9].filter(item => item.code.substring(0, 2) !== "BP" && item.code.substring(0, 2) !== "SC")
        this.setState({ employeeNameDrop: employee });
    };

    setemployeeStatusList = () => {
        this.setState({
            employeeStatusList: store.getState().dropDown[4].filter(item => item.code != 1),
        });
    };

    getInfo = (event, values) => {
        this.setState({
            currentPage: 1,
            employeeNo: values.code || '',
            employeeName: values.code || '',
        });
        this.getList(values.code)
    };

    employeeStatusChange = (event) => {
        const value = event.target.value;
        if (value === "0") {
            let newEmpInfoList = [];
            newEmpInfoList = this.state.employeeNameDrop.filter(item =>
                item.code.substring(0, 2) !== "BP" && item.code.substring(0, 2) !== "SP" && item.code.substring(0, 2) !== "SC")

            this.setState({ employeeNameDrop: newEmpInfoList, employeeName: "" });
        } else if (value === "2") {
            let newEmpInfoList = [];
            newEmpInfoList = this.state.employeeNameDrop.filter(item => item.code.substring(0, 2) === "SP")

            this.setState({ employeeNameDrop: newEmpInfoList, employeeName: "" });
        } else {
            this.setState({ employeeNameDrop: this.state.employeeNameDrop });
        }
        this.setState({ employeeStatus: value });
    }

    shuseiTo = (actionType) => {
        console.log('actionType', actionType)
        let path = {};
        switch (actionType) {
            case "employeeInfo":
                path = {
                    pathname: "/subMenuManager/employeeUpdateNew",
                    state: {
                        id: this.state.employeeName,
                        employeeNo: this.state.employeeName,
                        backPage: "payroll",
                        sendValue: this.state.sendValue,
                        searchFlag: true,
                        actionType: "update",
                        backbackPage: this.state.backPage,
                    },
                };
                break;
            case "siteInfo":
                path = {
                    pathname: "/subMenuManager/siteInfo",
                    state: {
                        employeeNo: this.state.employeeName,
                        backPage: "payroll",
                        sendValue: this.state.sendValue,
                        searchFlag: true,
                        backbackPage: this.state.backPage,
                    },
                };
                break;
            default:
        }
        this.props.history.push(path);
    };
    // 表格最右侧合并列展示
    expandComponent = (index, item) => {
        return <AntForm>
            <AntForm.Item name={index} >
                <div>
                    <div>{item.averageSalary}（基） + </div>
                    <div>{item.averageBonusPayoff}（赏） + </div>
                    <div>
                        <Input
                            style={{ width: '70px' }}
                            value={item.averageTraffic || 0}
                            onChange={(e) => this.averageChange(e, 'averageTraffic', index)}
                            ref={(textarea) => (this[`averageTraffic${index}`] = textarea)}
                        />
                        （交） +
                    </div>
                    <div>{item.averageSocialInsurancePayoff}(社) + </div>
                    <div>
                        <Input
                            style={{ width: '70px' }}
                            value={item.averageOther || 0}
                            onChange={(e) => this.averageChange(e, 'averageOther', index)}
                            ref={(textarea) => (this[`averageOther${index}`] = textarea)}
                        />
                        （他）
                    </div>
                    <div> 約 =（{(parseFloat(item.averageValue) + parseFloat(item.averageTraffic || 0) + parseFloat(item.averageOther || 0)).toFixed(2)}） </div>
                    <Button
                        size="sm"
                        onClick={() => this.averageClick(item)}
                        variant="info"
                    >保存</Button>
                </div>
            </AntForm.Item>
        </AntForm>
    }
    // 合并单元格的逻辑
    mergedColumns = [
        {
            title: "番号",
            dataIndex: "rowNo",
            key: 'rowNo',

        },
        {
            title: "年度番号",
            dataIndex: "yearAndMonth",
            key: 'yearAndMonth',
        },
        {
            title: "お客様",
            dataIndex: "customerName",
            key: 'customerName'
        },
        {
            title: "単価",
            dataIndex: "unitPrice",
            key: 'unitPrice'
        },
        {
            title: "給料",
            dataIndex: "salary",
            key: 'salary'
        },
        {
            title: "賞与",
            dataIndex: "bonusPayoff",
            key: 'bonusPayoff'
        },
        {
            title: "社会保険料",
            dataIndex: "socialInsurancePayoff",
            key: 'socialInsurancePayoff',
            render: (text, item, index) => {
                return <div>{utils.addComma(item.socialInsurancePayoff)}</div>
            }
        },
        {
            title: "粗利益見込",
            dataIndex: "rough",
            key: 'rough',
            render: (text, item, index) => {
                return <div>{utils.addComma(item.rough)}</div>
            }
        },
        {
            title: "年間粗利",
            dataIndex: "yearRough",
            key: 'yearRough',
            render: (text, item, index) => {
                if (item.isSalaryIncrease) {
                    return <div>{utils.addComma(item.yearRough)}</div>
                }
            }
        },
        {
            title: "他のコスト集計",
            dataIndex: "category",
            editable: true,
            render: (text, item, index) => this.expandComponent(index, item),
            onCell: (record, rowIndex) => {
                return {
                    rowSpan: record.rowSpan, // 根据条件设置合并行数
                }
            },
        },
    ];
    // 交通费和其他费用输入框change事件
    averageChange = (e, key, index) => {
        let table_key = this.state.table_key;
        const newList = [...this.state.payrollList];

        newList[index+(this.state.currentPage-1)*this.state.pageSize][key] = e.target.value.replace(/^0/, "")

        this.setState({ table_key: table_key + `1`, payrollList: [...newList] }, () => {
            this[`${key}${index}`].focus()
        })
    }
    // 表格最右侧合并列中保存点击事件
    averageClick = (item) => {
        console.log('item=====', item)
        var sendMap = {};
        sendMap["employeeNo"] = item.employeeNo;
        sendMap["updateUser"] = sessionStorage.getItem("employeeNo");
        sendMap["salary"] = item.averageSalary;
        sendMap["salaryStartYear"] = item.yearAndMonth;
        sendMap["salaryEndYear"] = item.rowEndYearAndMonth;
        sendMap["bonusPayoffAmount"] = item.averageBonusPayoff;
        sendMap["trafficPayoffAmount"] = item.averageTraffic;
        sendMap["socialInsurancePayoffAmount"] = item.averageSocialInsurancePayoff;
        sendMap["othersPayoffAmount"] = item.averageOther;
        sendMap["totalPayoffAmount"] = item.averageValue;
        axios
            .post(this.state.serverIP + "subMenu/insertAverage", sendMap)
            .then((resultMap) => {
                notification.success({
                    message: "システムメッセージ",
                    description: '保存が成功しました',
                    placement: "topLeft",
                });
            })
            .catch((error) => {
                notification.error({
                    message: "エラー",
                    description: `${error}`,
                    placement: "topLeft",
                });
            });
    }

    onChange = (page) => {
        this.setState({ currentPage: page })
    }

    render() {
        const { employeeStatus, employeeNameDrop, employeeName, employeeStatusList, payrollList, pageSize, currentPage, errorsMessageShow, errorsMessageValue } = this.state

        return (
            <div className="payroll">
                <Col className="text-center">
                    <h2>年間給料精算</h2>
                </Col>

                <Form style={{ marginTop: "1em" }}>
                    <Row>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">
                                        社員区分
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    className="w100p"
                                    as="select"
                                    size="sm"
                                    onChange={this.employeeStatusChange}
                                    name="employeeStatus"
                                    value={employeeStatus}
                                    autoComplete="off"
                                >
                                    {employeeStatusList.map((data) => (
                                        <option key={data.code} value={data.code}>
                                            {data.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-3 flexWrapNoWrap required-mark" >
                                <InputGroup.Prepend>
                                    <InputGroup.Text>社員名</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    className="w100p"
                                    id="employeeName"
                                    name="employeeName"
                                    value={employeeNameDrop.find((v) => v.code === employeeName) || {}}
                                    options={employeeNameDrop}
                                    getOptionDisabled={(option) => option.name || ""}
                                    getOptionLabel={(option) => option.text || ""}
                                    onChange={(event, values) => this.getInfo(event, values)}
                                    renderOption={(option) => {
                                        return (
                                            <React.Fragment>{option.name || ""}</React.Fragment>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input
                                                placeholder="  例：佐藤真一"
                                                type="text"
                                                {...params.inputProps}
                                                className="auto form-control Autocompletestyle-wagesInfo-employeeName w100p"
                                            />
                                        </div>
                                    )}
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={5}>
                            <div style={{ float: "left" }}>
                                <Button
                                    size="sm"
                                    style={{ marginRight: '5px' }}
                                    onClick={() => this.shuseiTo("employeeInfo")}
                                    disabled={employeeName === "" ? true : false}
                                    variant="info"
                                    id="employeeInfo"
                                >
                                    個人情報
                                </Button>{" "}
                                <Button
                                    size="sm"
                                    onClick={() => this.shuseiTo("siteInfo")}
                                    disabled={employeeName === "" ? true : false}
                                    variant="info"
                                    id="siteInfo"
                                >
                                    現場情報
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <Col>
                    <Table
                        className={'payroll-table'}
                        columns={this.mergedColumns}
                        dataSource={payrollList}
                        bordered
                        pagination={{ defaultPageSize: pageSize, current: currentPage, onChange: this.onChange }}
                        rowKey={'rowNo'}
                        key={this.state.table_key}
                        rowClassName={(item, index) => {
                            let name = ''
                            if (!!item.isSalaryIncrease) name = `${name} salary-increase-item`
                            else if (index == 0) name = `${name} salary-item`
                            else if (!!payrollList[pageSize * (currentPage - 1) + index - 1].isSalaryIncrease) name = `${name} salary-item`
                            return name
                        }}
                        onRow={item => {
                            return { style: { background: item.colorIndex != null ? `${COLORS[item.colorIndex]}` : '#fff' } }
                        }}
                    />
                </Col>
            </div>
        )
    }
}
