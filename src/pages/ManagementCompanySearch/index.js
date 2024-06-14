import React , { useState, createContext, useContext, useRef, useEffect }from "react";
import { DatePicker as AntdDatePicker, message, Dropdown, Space, Cascader, Select, AutoComplete, Input, Table } from "antd";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../asserts/css/style.css";
import "../asserts/css/newCssInsert.css"
import * as publicUtils from "./utils/publicUtils.js";

import { 
  Form, 
  Button, 
  Col, 
  Row, 
  InputGroup
} from "react-bootstrap";

import moment from "moment";
moment.locale("ja");

export default function TestManagementCompanySearch() {

    //
    const[searchCompanyByID,setSearchCompanyByID] = useState('');

    //grid中の項目
    const[managementCompanyID,setManagementCompanyID] = useState('');
    const[managementCompanyName,setManagementCompanyName] = useState('');
    const[managementCompanyMail,setManagementCompanyMail] = useState('');
    const[managementCompanyPhoneNo,setManagementCompanyPhoneNo] = useState('');
    const[managementCompanyURL,setManagementCompanyURL] = useState('');
    const[managementCompanyPostCode,setManagementCompanyPostCode] = useState('');
    const[managementCompanyAddress,setManagementCompanyAddress] = useState('');
    const[managementCompanyRemark,setManagementCompanyRemark] = useState('');

    //取得した会社情報
    const [options, setOptions] = useState('');
   
    //検索boxをクリックし、dropdownリストですべての会社情報を取得して反映
    const { Option } = AutoComplete;
    const [inputValue, setInputValue] = useState('');

    const handleSearch = (value) => {
      setInputValue(value);
    };

    const handleSelect = (value) => {
      setInputValue(value);
    };

    const filterOption = (inputValue, option) =>
      option.value.toLowerCase().includes(inputValue.toLowerCase());

    //render後　すべての情報をすぐ取得
    useEffect(()=>{ 
        const getAllManagementCompanyInfo = async () => {
            try {
                const response = await axios.post('http://localhost:8080/employee/searchAllManagementCompanyInfo');
                if (response.status === 200) {
                  const formattedOptions = response.data.map(user => ({
                    value: `${user.managementCompanyID} (${user.managementCompanyName})`,
                  }));
                  setOptions(formattedOptions);
                  message.success("success")
                } else {
                  message.error("fail")
                }
            } catch (error) {
                message.error("fail")
            }
        }
        getAllManagementCompanyInfo();
    },[])




    const searchCompanyInfo =()=>{  //inputValue
      setSearchCompanyByID(inputValue.substring(0,5))
      console.log('setSearchCompanyByID',searchCompanyByID)
      //console.log('inputValue',inputValue.substring(0,5))

    }
  


    //----------------------------------------------------
   

    const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8080/employee/searchAllManagementCompanyInfo');
        const data = response.data.map((item, index) => ({
          ...item,
          key: index,
          番号: index + 1, // 自动生成类似行号的字段
        }));
        setDataSource(data);


                // 如果数据少于7行，填充空行
        const emptyRows = Array.from({ length: Math.max(0, 12 - data.length) }, (_, index) => ({
           key: data.length + index,
           番号: '',
           管理会社ID: '',
           管理会社名: '',
           電話番号: '',
           メール: '',
           住所: '',
           備考: '',      
        }
    ));

    const filledData = data.concat(emptyRows);
        setDataSource(filledData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
        {
          title: '番号',
          dataIndex: '番号',
        },
        {
          title: '管理会社ID',
          dataIndex: 'managementCompanyID',
          
        },
        {
          title: '管理会社名',
          dataIndex: 'managementCompanyName',
          
        },
        {
          title: '電話番号',
          dataIndex: 'managementCompanyPhoneNo',
          
        },
        {
          title: 'メール',
          dataIndex: 'managementCompanyMail',
          
        },
        {
          title: '住所',
          dataIndex: 'managementCompanyAddress',
          
        },
        {
          title: '備考',
          dataIndex: 'managementCompanyRemark',
          
        },



      ];

      const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
      };

      
        const mergedColumns = columns.map((col) => {
                if (!col.editable) {
                return col;
                }

                return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave,
                }),
                };
            });
  
            
    //---------------------------------------------------
    



  return (
    <div className="container">
    <br></br>
     <Row className="text-center mb-3">
        <Col>
          <h2>管理会社情報登録</h2>
        </Col>
     </Row>

  <Form>



    <Row justify="center" align="middle" >
        <Col >
          <InputGroup size="sm"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <InputGroup.Prepend>
                <InputGroup.Text id="sixKanji">
                  管理会社名
                </InputGroup.Text>
              </InputGroup.Prepend> 



{/* 
              <AutoComplete
                options={options}
                onSearch={handleSearch}
                style={{ width: 230 }}
                value={inputValue}
                onChange={setInputValue}
                onSelect={handleSelect}
                filterOption={filterOption}
                //dropdownStyle="custom-dropdown"
              >
                <Input placeholder="Search users" />
              </AutoComplete> */}

              <Select
                showArrow={false}
                showSearch
                options={options}
                onSearch={handleSearch}
                style={{ width: 230 }}
                value={inputValue}
                onChange={setInputValue}
                onSelect={handleSelect}
                filterOption={filterOption}
                //dropdownStyle="custom-dropdown"
              >
                <Input placeholder="Search users" />
              </Select>


          </InputGroup>
        </Col>
    </Row><br/>

      <div style={{ textAlign: "center" }}>
            <Button size="sm" variant="info" onClick={searchCompanyInfo}>
               検索
            </Button>

            <Button size="sm" variant="info" style={{marginLeft:'20px'}}>
              追加
            </Button>

        </div><br/>   

 
        <div style={{ width: '90%', margin: '0 auto' }}>
          <Table
            bordered
            dataSource={dataSource}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{ pageSize: 10 }}
            className="custom-table"
          />
        </div>

  </Form>

  </div>
  )
}



