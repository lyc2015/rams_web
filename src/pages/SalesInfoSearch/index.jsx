import React, { useState, useEffect } from 'react'


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

} from "react-bootstrap";

import request from "../../service/request.js";

const dateIcon = <img src={dateImg} alt="" />;

const initVal = {
  contractId: '',
  customerNo: '',
  contractDateBegin: '',
  contractDateEnd: '',
  institutionId: '',
  employeeNo: '',
  asScheduledDateBegin: '',
  asScheduledDateEnd: '',
}

const columns = [
  {
    title: '番号',
    dataIndex: 'key',
    key: 'key',
    width:50
  },
  {
    title: '契約ID',
    dataIndex: 'contractId',
    key: 'contractId',
    width:100
  },
  {
    title: '契約日',
    dataIndex: 'contractDate',
    key: 'contractDate',
    width:100

  },
  {
    title: '家賃/価格',
    key: 'rent',
    dataIndex: 'rent',
    width: 100

  },
  {
    title: 'AD',
    key: 'commissionAdCode',
    dataIndex: 'commissionAdCode',
    width:100

  },
  {
    title: '紹介費',
    key: 'introducerFee',
    dataIndex: 'introducerFee',
    width:100

  },
  {
    title: '担当者',
    key: 'employeeNo',
    dataIndex: 'employeeNo',
    width:100

  },
  {
    title: '物件名',
    key: 'realEstateAddress',
    dataIndex: 'realEstateAddress',
    width:100

  },
];

const data=[
  {
      "contractId": "000004",
      "customerNo": "",
      "contractDate": "2024-06-13",
      "realEstateName": "",
      "realEstatePostCode": "",
      "realEstateAddress": "",
      "rent": "1111",
      "realEstateManagementCompanyCode": "",
      "institutionId": "",
      "introducer": "",
      "introducerFee": "",
      "commissionAdCode": "0",
      "bankSales": "",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "",
      "remark": "",
      "employeeNo": "0",
      "contactInfo": "",
      "currentPostal": "",
      "currentAddress": "",
      "visa": "",
      "updateDate": "2024-06-13",
      "createDate": "2024-06-13",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000005",
      "customerNo": "1",
      "contractDate": "2024-06-14",
      "realEstateName": "qq",
      "realEstatePostCode": "5400002",
      "realEstateAddress": "大阪府大阪市中央区大阪城",
      "rent": "22",
      "realEstateManagementCompanyCode": "M0003",
      "institutionId": "",
      "introducer": "99",
      "introducerFee": "",
      "commissionAdCode": "1",
      "bankSales": "11",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "22",
      "remark": "1111",
      "employeeNo": "1",
      "contactInfo": "111222222",
      "currentPostal": "5400002",
      "currentAddress": "大阪府大阪市中央区大阪城",
      "visa": "1111",
      "updateDate": "2024-06-14",
      "createDate": "2024-06-14",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000006",
      "customerNo": "1",
      "contractDate": "2024-06-15",
      "realEstateName": "qq",
      "realEstatePostCode": "5400002",
      "realEstateAddress": "大阪府大阪市中央区大阪城",
      "rent": "1111",
      "realEstateManagementCompanyCode": "M0001",
      "institutionId": "",
      "introducer": "99",
      "introducerFee": "",
      "commissionAdCode": "1",
      "bankSales": "223",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "1111",
      "remark": "1111",
      "employeeNo": "0",
      "contactInfo": "222333333",
      "currentPostal": "5400002",
      "currentAddress": "大阪府大阪市中央区大阪城",
      "visa": "1111",
      "updateDate": "2024-06-14",
      "createDate": "2024-06-14",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000007",
      "customerNo": "",
      "contractDate": "2024-06-15",
      "realEstateName": "",
      "realEstatePostCode": "",
      "realEstateAddress": "",
      "rent": "1111",
      "realEstateManagementCompanyCode": "",
      "institutionId": "",
      "introducer": "",
      "introducerFee": "",
      "commissionAdCode": null,
      "bankSales": "",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "",
      "remark": "",
      "employeeNo": "1",
      "contactInfo": "",
      "currentPostal": "",
      "currentAddress": "",
      "visa": "",
      "updateDate": "2024-06-14",
      "createDate": "2024-06-14",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000008",
      "customerNo": "1",
      "contractDate": "2024-06-14",
      "realEstateName": "",
      "realEstatePostCode": "",
      "realEstateAddress": "",
      "rent": "1111",
      "realEstateManagementCompanyCode": "",
      "institutionId": "",
      "introducer": "",
      "introducerFee": "",
      "commissionAdCode": null,
      "bankSales": "",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "",
      "remark": "",
      "employeeNo": "1",
      "contactInfo": "",
      "currentPostal": "",
      "currentAddress": "",
      "visa": "",
      "updateDate": "2024-06-14",
      "createDate": "2024-06-14",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000009",
      "customerNo": "",
      "contractDate": "2024-06-15",
      "realEstateName": "",
      "realEstatePostCode": "",
      "realEstateAddress": "",
      "rent": "1111",
      "realEstateManagementCompanyCode": "",
      "institutionId": "",
      "introducer": "",
      "introducerFee": "",
      "commissionAdCode": null,
      "bankSales": "",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "",
      "remark": "\t\n不要加快应用程序的启动时间。\n\n默认情况下，通过在命令行上传递以下 JVM 选项来启用此优化：-",
      "employeeNo": "1",
      "contactInfo": "",
      "currentPostal": "",
      "currentAddress": "",
      "visa": "",
      "updateDate": "2024-06-14",
      "createDate": "2024-06-14",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000010",
      "customerNo": "1",
      "contractDate": "2024-06-18",
      "realEstateName": "qq",
      "realEstatePostCode": "5400002",
      "realEstateAddress": "大阪府大阪市中央区大阪城",
      "rent": "1111",
      "realEstateManagementCompanyCode": "M0003",
      "institutionId": "",
      "introducer": "1",
      "introducerFee": "",
      "commissionAdCode": "2",
      "bankSales": "333",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "1111",
      "remark": "222",
      "employeeNo": "0",
      "contactInfo": "112222222",
      "currentPostal": "5400002",
      "currentAddress": "大阪府大阪市中央区大阪城",
      "visa": "0",
      "updateDate": "2024-06-17",
      "createDate": "2024-06-17",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000011",
      "customerNo": "",
      "contractDate": "2024-06-19",
      "realEstateName": "",
      "realEstatePostCode": "",
      "realEstateAddress": "",
      "rent": "1111",
      "realEstateManagementCompanyCode": "",
      "institutionId": "",
      "introducer": "1",
      "introducerFee": "",
      "commissionAdCode": "2",
      "bankSales": "",
      "asScheduledDate": "2024-06-13",
      "applicationAmount": "",
      "remark": "",
      "employeeNo": "0",
      "contactInfo": "",
      "currentPostal": "",
      "currentAddress": "",
      "visa": "1",
      "updateDate": "2024-06-17",
      "createDate": "2024-06-17",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000012",
      "customerNo": "1",
      "contractDate": "2024-06-19",
      "realEstateName": "qq",
      "realEstatePostCode": "5400002",
      "realEstateAddress": "大阪府大阪市中央区大阪城222",
      "rent": "1111",
      "realEstateManagementCompanyCode": "M0002",
      "institutionId": "1",
      "introducer": null,
      "introducerFee": "",
      "commissionAdCode": "2",
      "bankSales": "245",
      "asScheduledDate": "",
      "applicationAmount": "1111",
      "remark": "242525",
      "employeeNo": "0",
      "contactInfo": "121222222",
      "currentPostal": "5400002",
      "currentAddress": "大阪府大阪市中央区大阪城",
      "visa": "1",
      "updateDate": "2024-06-19",
      "createDate": "2024-06-19",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "000013",
      "customerNo": "1",
      "contractDate": "2024-06-20",
      "realEstateName": "qq",
      "realEstatePostCode": "5400002",
      "realEstateAddress": "大阪府大阪市中央区大阪城",
      "rent": "1111",
      "realEstateManagementCompanyCode": "M0002",
      "institutionId": "1",
      "introducer": null,
      "introducerFee": "",
      "commissionAdCode": "2",
      "bankSales": "11",
      "asScheduledDate": "",
      "applicationAmount": "1111",
      "remark": "11wadd",
      "employeeNo": "1",
      "contactInfo": "",
      "currentPostal": "5400002",
      "currentAddress": "大阪府大阪市中央区大阪城",
      "visa": "1",
      "updateDate": "2024-06-19",
      "createDate": "2024-06-19",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "0001",
      "customerNo": "222",
      "contractDate": "2024-06-10",
      "realEstateName": "aaa",
      "realEstatePostCode": "001",
      "realEstateAddress": "bb",
      "rent": "0.1",
      "realEstateManagementCompanyCode": "1",
      "institutionId": "222",
      "introducer": "222",
      "introducerFee": "222",
      "commissionAdCode": "222",
      "bankSales": "222",
      "asScheduledDate": "222",
      "applicationAmount": "222",
      "remark": "222",
      "employeeNo": "22",
      "contactInfo": "22",
      "currentPostal": "22",
      "currentAddress": "22",
      "visa": "22",
      "updateDate": "22",
      "createDate": "22",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "002",
      "customerNo": "0003",
      "contractDate": "0001",
      "realEstateName": "0001",
      "realEstatePostCode": "001",
      "realEstateAddress": "11",
      "rent": "111",
      "realEstateManagementCompanyCode": "1",
      "institutionId": "11",
      "introducer": "11",
      "introducerFee": "11",
      "commissionAdCode": "0",
      "bankSales": "111",
      "asScheduledDate": "111",
      "applicationAmount": "111",
      "remark": "11",
      "employeeNo": "11",
      "contactInfo": "11",
      "currentPostal": "11",
      "currentAddress": "11",
      "visa": "11",
      "updateDate": "22",
      "createDate": "22",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "003",
      "customerNo": "0003",
      "contractDate": "0001",
      "realEstateName": "0001",
      "realEstatePostCode": "001",
      "realEstateAddress": "11",
      "rent": "111",
      "realEstateManagementCompanyCode": "1",
      "institutionId": "11",
      "introducer": "11",
      "introducerFee": "11",
      "commissionAdCode": "0",
      "bankSales": "111",
      "asScheduledDate": "111",
      "applicationAmount": "111",
      "remark": "11",
      "employeeNo": "11",
      "contactInfo": "11",
      "currentPostal": "11",
      "currentAddress": "11",
      "visa": "11",
      "updateDate": "2024-06-11",
      "createDate": "2024-06-11",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  },
  {
      "contractId": "11",
      "customerNo": "11",
      "contractDate": "11",
      "realEstateName": "11",
      "realEstatePostCode": "11",
      "realEstateAddress": "11",
      "rent": "11",
      "realEstateManagementCompanyCode": "11",
      "institutionId": "11",
      "introducer": "11",
      "introducerFee": "11",
      "commissionAdCode": "11",
      "bankSales": "11",
      "asScheduledDate": "11",
      "applicationAmount": "11",
      "remark": "11",
      "employeeNo": "11",
      "contactInfo": "11",
      "currentPostal": "11",
      "currentAddress": "11",
      "visa": "11",
      "updateDate": "2024-06-14",
      "createDate": "2024-06-14",
      "contractDateBegin": null,
      "contractDateEnd": null,
      "asScheduledDateBegin": null,
      "asScheduledDateEnd": null
  }
]

export default function SalesInfoSearch() {

  const [searchVal, setSearchVal] = useState(initVal)

  const [salesInfo, setSalesInfo] = useState([])

  const valueChange = (name, value) => {
    setSearchVal({
      ...searchVal,
      [name]: value
    })
  }
  const selChange = (name, value) => {
    console.log(name, value);
    setSearchVal({
      ...searchVal,
      [name]: value || ''
    })
  }

  const dateChange = (name, e, value) => {
    setSearchVal({
      ...searchVal,
      [name]: value
    })
  }


  const toSearch = async (e) => {
    console.log('tosearch', e, searchVal);
    const data = await request.post('/sales/getSalesInfo', searchVal);
    data.forEach((item, idx) => {
      item.key = idx + 1

    });
    console.log('/sales/getSales', data);
    setSalesInfo(data)


  }

  const [employeeOption, setEmployeeOption] = useState([])

  const [custList, setCustList] = useState([])
  const [institutionInfo, setInstitutionInfo] = useState([])
  // const [companyList, setCompanyList] = useState([])
  // const [adCodeList, setAdCodeList] = useState([])
  // const [visaList, setVisaList] = useState([])


  useEffect(() => {

    const getOption = (item) => {
      const obj = { value: item.id, label: `${item.firstName + item.lastName}(${item.id})` }
      return obj
    }
    const fetchData = async () => {
      const data = await request.get('/getSalesBaseInfo');
      const newList = data.employeeList.map(getOption)
      setEmployeeOption(newList)
      const cList = data.customerList.map(getOption)
      setCustList(cList)
      setInstitutionInfo(data.institutionInfo)
      // setVisaList(data.visaList)
      // setCompanyList(data.company)
      // setAdCodeList(data.adCodeList)



    };



    fetchData();

  }, [])

  const labelObjs = [
    {
      label: '契約ID',
      name: 'contractId',
      maxLength: 6,
      md:3
    },
    {
      label: '担当者',
      name: 'employeeNo',
      md:3,
      children:
        <AntSelect
          className="form-control form-control-sm"
          bordered={false}
          showArrow={false}
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          // options={employeeOption}
          options={[{ label: 1, value: 1 }, { label: 2, value: 2 }]}
          onChange={(e) => selChange("employeeNo", e)}
          value={searchVal.employeeNo}
          
        />

    }, ,
    {
      label: '契約日',
      name: 'contractDate',
      md:6,
      children:
        <>
          <DatePicker
            allowClear={true}
            format="YYYY-MM-DD"
            className="form-control form-control-sm"
            suffixIcon={dateIcon}
            onChange={(e, value) => dateChange("contractDateBegin", e, value)}
            locale={'ja'}
          />
          <MinusOutlined />
          <DatePicker
            allowClear={false}
            format="YYYY-MM-DD"
            className="form-control form-control-sm"
            suffixIcon={dateIcon}
            onChange={(e, value) => dateChange("contractDateEnd", e, value)}
            locale={'ja'}
          />

        </>


    },
    {
      label: '契約者',
      name: 'customerNo',
      maxLength: 8,
      md:3,
      children:
        <AntSelect
          allowClear
          className="form-control form-control-sm"
          bordered={false}
          showArrow={false}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={custList}
          onChange={(e) => selChange("customerNo", e)}
          value={searchVal.customerNo}
        />


    },
    {
      label: '紹介人(機構)',
      name: 'institutionId',
      maxLength: 8,
      md:3,
      children:
        <AntSelect
          allowClear
          className="form-control form-control-sm"
          bordered={false}
          showArrow={false}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={institutionInfo}
          onChange={(e) => selChange("institutionId", e)}
          value={searchVal.institutionId}
        />

    },
    {
      label: 'AD予定日',
      name: 'asScheduledDate',
      md:6,
      children: <>
        <DatePicker
          allowClear={false}
          format="YYYY-MM-DD"
          className="form-control form-control-sm"
          suffixIcon={dateIcon}
          onChange={(e, value) => dateChange("asScheduledDateBegin", e, value)}
          locale={'ja'}
        />
        <MinusOutlined />
        <DatePicker
          allowClear={false}
          format="YYYY-MM-DD"
          className="form-control form-control-sm"
          suffixIcon={dateIcon}
          onChange={(e, value) => dateChange("asScheduledDateEnd", e, value)}
          locale={'ja'}
        />

      </>
    }
  ]
  const getRows = () => {
    return labelObjs.map((item, idx) =>
      <FromCol key={idx} {...item}
        value={searchVal[item.name]} valueChange={valueChange}
        required={item.required} >
        {item.children && item.children}
      </FromCol>)
  }

  return (
    <div className="salesInfo">
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
            onClick={toSearch}
          >
            検索
          </Button>
        </div>
      </Form>
      {/* <SalesTable columns={columns} data={salesInfo} /> */}
      <SalesTable columns={columns} data={data} />

    </div>
  )
}
