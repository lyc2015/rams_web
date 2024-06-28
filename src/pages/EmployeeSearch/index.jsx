import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Table, message } from 'antd';

import FromCol from '../../components/EmployeeSearch';

import {
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";

import Autocomplete from "@material-ui/lab/Autocomplete";

import store from "../../redux/store";

// moment
import moment from "moment";
moment.locale("ja");


export default function EmployeeSearch() {

  const history = useHistory();

  const initValues = {
    employeeName: '',
  }

  const [values, setValues] = useState(initValues);

  const valueChange = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  }
  //修正ボタンの活性制御
  const [modifyBtnDisabled, setModifyBtnDisabled] = useState(true);

  const [allTableData, setAllTableData] = useState([]);
  // Navigate to the edit page
  const [transformedData, setTransformedData] = useState([]);
  // Table 
  const [selectedRowKey, setSelectedRowKey] = useState([]);

  // DropDown
  const [nationalityCodes] = useState(store.getState().dropDown[0] || []);
  const [homesAgentCodes] = useState(store.getState().dropDown[4] || []);
  const [departmentCodes] = useState(store.getState().dropDown[3] || []);
  const [employeeFormCodes] = useState(store.getState().dropDown[2] || []);

  // Search Condition
  const [nationalityCode, setNationalityCode] = useState('');
  const [homesAgentCode, setHomesAgentCode] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [employeeFormCode, setEmployeeFormCode] = useState('');
  const [genderStatus, setGenderStatus] = useState('');
  const [employeeNo, setEmployeeNo] = useState('');

  // Search
  const [filteredData, setFilteredData] = useState([]);

  // get All 
  // from redux
  const [allEmployee] = useState(store.getState().allEmployee || []);

  useEffect(() => {
    const allTData = allEmployee.map((item, index) => ({
      key: index,
      employeeNo: item.employeeNo,
      employeeName: `${item.employeeFirstName} ${item.employeeLastName}`,
      employeeFormCode: item.employeeFormCode,
      homesAgentCode: item.homesAgentCode,
      phoneNo: item.phoneNo,
      stationCode: item.stationCode,
      yearsOfExperience: item.yearsOfExperience,
      hireYear: item.intoCompanyYearAndMonth,
      joinYear: item.comeToJapanYearAndMonth,
    }));
    setAllTableData(allTData);
    setFilteredData(allTData);
    setTransformedData(allEmployee);

  }, [allEmployee]); // Adding allEmployee as dependency so it runs when allEmployee changes

  // 
  const [employeeNamesAndNos, setEmployeeNamesAndNos] = useState([]);
  useEffect(() => {
    // 提取每个员工的 employeeName 和 employeeNo 的组合
    const namesAndNos = allEmployee.map((employee) => ({
      name: `${employee.employeeFirstName} ${employee.employeeLastName} (${employee.employeeNo})`,
      code: employee.employeeNo,
    }));
    setEmployeeNamesAndNos(namesAndNos);
  }, [allEmployee]); // allEmployee 变化时重新计算

  // Search button click
  const handleSearch = () => {
    // 过滤数据
    let filteredData = allTableData.filter(item => {
      return (
        (employeeNo ? item.employeeNo === employeeNo : true) &&
        (nationalityCode ? item.nationalityCode === Number(nationalityCode) : true) &&
        (homesAgentCode ? item.homesAgentCode === Number(homesAgentCode) : true) &&
        (departmentCode ? item.departmentCode === Number(departmentCode) : true) &&
        (genderStatus ? item.genderStatus === Number(genderStatus) : true) &&
        (employeeFormCode ? item.employeeFormCode === Number(employeeFormCode) : true)
      );
    });

    setFilteredData(filteredData);
  };

  // Edit button click
  const handleEditClick = () => {
    const selectedemployeeNo = selectedRowKey;
    console.log("transformedData[selectedemployeeNo]", transformedData[selectedemployeeNo]);
    history.push(
      `/submenu/employeeInfo`,
      { employee: transformedData[selectedemployeeNo] }
    );
  };

  // Components
  const topLabelobjs = [
    {
      label: '社員形式',
      name: 'employeeFormCode',
      children:
        <Autocomplete
          className="input-group-right-item"
          options={employeeFormCodes || []}
          getOptionLabel={(option) => option.name || ""}
          onChange={(event, values) => {
            setEmployeeFormCode(values.code);
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input
                placeholder=""
                type="text"
                {...params.inputProps}
                className="auto form-control Autocompletestyle-emp-station"
              />
            </div>
          )}
        />
    },
    {
      label: '社員名',
      name: 'employeeName',
      children:
        <Autocomplete
          className="input-group-right-item"
          options={employeeNamesAndNos || []}
          getOptionLabel={(option) => option.name || ""}
          onChange={(event, values) => {
            setEmployeeNo(values.code);
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input
                placeholder=""
                type="text"
                {...params.inputProps}
                className="auto form-control Autocompletestyle-emp-station"
              />
            </div>
          )}
        />
    }
  ];

  const labelObjs = [
    {
      label: '仲介区分',
      name: 'customerNo',
      maxLength: 8,
      children:
        <Autocomplete
          className="input-group-right-item"
          options={homesAgentCodes || []}
          getOptionLabel={(option) => option.name || ""}
          onChange={(event, values) => {
            setHomesAgentCode(values.code);
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input
                placeholder=""
                type="text"
                {...params.inputProps}
                className="auto form-control Autocompletestyle-emp-station"
              />
            </div>
          )}
        />
    },
    {
      label: '部署',
      name: 'contractDate',
      children:
        <Autocomplete
          className="input-group-right-item"
          options={departmentCodes || []}
          getOptionLabel={(option) => option.name || ""}
          onChange={(event, values) => {
            setDepartmentCode(values.code);
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input
                placeholder=""
                type="text"
                {...params.inputProps}
                className="auto form-control Autocompletestyle-emp-station"
              />
            </div>
          )}
        />
    },
    {
      label: '性別',
      name: 'introducer',
      maxLength: 8,
      children:
        <Form.Control
          as="select"
          size="sm"
          name="genderStatus"
          autoComplete="off"
        >
          <option value=""></option>
          <option value="0">男性</option>
          <option value="1">女性</option>
        </Form.Control>
    },
    {
      label: '国籍',
      name: 'realEstateName',
      maxLength: 50,
      children:
        <Autocomplete
          className="input-group-right-item"
          options={nationalityCodes || []}
          getOptionLabel={(option) => option.name || ""}
          onChange={(event, values) => {
            setNationalityCode(values.code);
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input
                placeholder=""
                type="text"
                {...params.inputProps}
                className="auto form-control Autocompletestyle-emp-station"
              />
            </div>
          )}
        />
    },
  ];

  // 生成组件
  const getRows = (items) => {
    return items.map((item, idx) => (
      <FromCol
        key={idx}
        {...item}
        value={values[item.name]}
        valueChange={valueChange}
      >
        {item.children && item.children}
      </FromCol>
    ));
  }





  // Table Handle
  const columns = [
    { title: '番号', dataIndex: 'key', key: 'key', render: (text, record, index) => index + 1, },
    { title: '社員番号', dataIndex: 'employeeNo', key: 'employeeNo' },
    { title: '社員名', dataIndex: 'employeeName', key: 'employeeName' },
    { title: '社員形式', dataIndex: 'employeeFormCode', key: 'employeeFormCode' },
    { title: '仲介区分', dataIndex: 'homesAgentCode', key: 'homesAgentCode' },
    { title: '電話番号', dataIndex: 'phoneNo', key: 'phoneNo', },
    { title: '最寄駅', dataIndex: 'stationCode', key: 'stationCode' },
    { title: '経験年数', dataIndex: 'yearsOfExperience', key: 'yearsOfExperience' },
    { title: '入社年月', dataIndex: 'hireYear', key: 'hireYear' },
    { title: '来日年月', dataIndex: 'joinYear', key: 'joinYear' },
  ];

  const onRowClick = (record) => {
    setSelectedRowKey(selectedRowKey === record.key ? setModifyBtnDisabled(true) : setModifyBtnDisabled(false));
    setSelectedRowKey(selectedRowKey === record.key ? null : record.key);
  };

  const rowClassName = (record) => {
    return record.key === selectedRowKey ? 'selected-row' : '';
  };


  return (
    <div className="">
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
          <Button size="sm" variant="info" onClick={handleSearch}>
            検索
          </Button>

          <Button size="sm" variant="info" style={{ marginLeft: '20px' }}>
            追加
          </Button>

        </div>
        <br />
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
                  disabled={modifyBtnDisabled}
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
              bordered
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              className="custom-table"
              rowClassName={rowClassName}

              onRow={(record) => ({
                onClick: () => {
                  onRowClick(record);
                },
              })}
            />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
