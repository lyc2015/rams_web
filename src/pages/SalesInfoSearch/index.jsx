import React, { useState } from 'react'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import dateImg from '../../assets/images/date_icon.ico'

import { DatePicker, message, Select as AntSelect } from "antd";
import {
  MinusOutlined
} from '@ant-design/icons';
import FromCol from "../../components/SalesInfo/FromCol/index.jsx";
import SalesTable from '../../components/SalesInfo/SalesTable/index.jsx';
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl
} from "react-bootstrap";

import request from "../../service/request.js";

const dateIcon = <img src={dateImg} alt="" />;

const initVal={
  contractId: '',
  customerNo: '',
  contractDateBegin: '',
  contractDateEnd: '',
  InstitutionId:'',
  employeeNo:'',
  asScheduledDateBegin:'',
  asScheduledDateBegin:'',


}


export default function SalesInfoSearch() {

 const [seachVal,setSeachVal]=useState({})


  const labelObjs = [
    {
      label: '契約ID',
      name: 'contractId',
      maxLength: 6,
    },
    {
      label: '担当者',
      name: 'employeeNo',
      children:
        <AntSelect
          className="form-control form-control-sm"
          bordered={false}
          showArrow={false}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        // options={employeeOption}
        // onChange={(e) => selChange("employeeNo", e)}
        // value={values.employeeNo}
        />

    }, ,
    {
      label: '契約日',
      name: 'contractDate',
      children:
        <>
          <DatePicker
            allowClear={false}
            format="YYYY-MM-DD"
            className="form-control form-control-sm"
            suffixIcon={dateIcon}
          // onChange={(e, value) => dateChange("contractDate", e, value)}
          // locale={'ja'}
          />
          <MinusOutlined />
          <DatePicker
            allowClear={false}
            format="YYYY-MM-DD"
            className="form-control form-control-sm"
            suffixIcon={dateIcon}
          // onChange={(e, value) => dateChange("contractDate", e, value)}
          // locale={'ja'}
          />

        </>


    },
    {
      label: '契約者',
      name: 'customerNo',
      maxLength: 8,
      children:
        <AntSelect
          className="form-control form-control-sm"
          bordered={false}
          showArrow={false}
        // filterOption={(input, option) =>
        //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        // }
        // options={custList}
        // onChange={(e) => selChange("customerNo", e)}
        // value={values.customerNo}
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
        // options={institutionInfo}
        // onChange={(e) => selChange("introducer", e)}
        // value={values.introducer}
        />

    },
    {
      label: 'AD予定日',
      name: 'asScheduledDate',
      children: <>
        <DatePicker
          allowClear={false}
          format="YYYY-MM-DD"
          className="form-control form-control-sm"
          suffixIcon={dateIcon}
        // onChange={(e, value) => dateChange("contractDate", e, value)}
        // locale={'ja'}
        />
        <MinusOutlined />
        <DatePicker
          allowClear={false}
          format="YYYY-MM-DD"
          className="form-control form-control-sm"
          suffixIcon={dateIcon}
        // onChange={(e, value) => dateChange("contractDate", e, value)}
        // locale={'ja'}
        />

      </>
    }
  ]
  const getRows = () => {
    return labelObjs.map((item, idx) =>
      <FromCol key={idx} {...item}
        //  value={values[item.name]} valueChange={valueChange} 
        required={item.required} >
        {item.children && item.children}
      </FromCol>)
  }

  return (
    <div className="container salesInfo">
      <Row className="text-center mb-3">
        <Col>
          <h2>売上情報登録(賃貸)</h2>
        </Col>
      </Row>

      <Form>

        <Row >

          {getRows()}

        </Row>
        <div style={{ textAlign: "center" }}>
          <Button
            size="sm"
            variant="info"
            type="button"

          >
            検索
          </Button>
        </div>
      </Form>
      <SalesTable />

    </div>
  )
}
