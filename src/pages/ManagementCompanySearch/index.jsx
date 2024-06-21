import React, { useState, useEffect } from "react";
import { message, AutoComplete, Input, Table } from "antd";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as publicUtils from "../../utils/publicUtils.js";
import './index.css'; // 引入自定义样式


import {
  Form,
  Button,
  Col,
  Row,
  InputGroup
} from "react-bootstrap";

import moment from "moment";
moment.locale("ja");

export default function ManagementCompanySearch() {

  //修正ボタンの活性制御
  const [modifyBtnDisabled, setModifyBtnDisabled] = useState(true);

  //grid中の項目
  const [managementCompanyID, setManagementCompanyID] = useState('');
  const [managementCompanyName, setManagementCompanyName] = useState('');
  const [managementCompanyMail, setManagementCompanyMail] = useState('');
  const [managementCompanyPhoneNo, setManagementCompanyPhoneNo] = useState('');
  const [managementCompanyURL, setManagementCompanyURL] = useState('');
  const [managementCompanyPostCode, setManagementCompanyPostCode] = useState('');
  const [managementCompanyAddress, setManagementCompanyAddress] = useState('');
  const [managementCompanyRemark, setManagementCompanyRemark] = useState('');

  //取得した会社情報
  const [options, setOptions] = useState('');

  //会社IDで会社情報を検索
  const [allowSearch, setAllowSearch] = useState(false);
  const [allowAllSearch, setAllowAllSearch] = useState(false);

  //tableに反映する検索結果
  const [dataSource, setDataSource] = useState([]);

  //すべてのデータ　と　検索結果
  const [allData, setAllData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  //会社登録画面に反映する検索結果
  const [companyInfo, setCompanyInfo] = useState([]);

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
  useEffect(() => {
    const getAllManagementCompanyInfo = async () => {
      try {
        const response = await axios.post('http://localhost:8080/employee/searchAllManagementCompanyInfo');
        if (response.status === 200) {

          //検索ボックスのdropdownリスト
          const formattedOptions = response.data.map(user => ({
            value: `${user.managementCompanyID} (${user.managementCompanyName})`,
          }));
          setOptions(formattedOptions);
        
          //表
          const data = response.data.map((item, index) => ({
            ...item,
            key: index,
            番号: index + 1, // 自动生成类似行号的字段
          }));
          setDataSource(data);
          setAllData(data);

          message.success("管理会社情報取得成功");

        } else {
          message.error("管理会社情報取得失敗")
        }
      } catch (error) {
        message.error("管理会社情報取得失敗")
      }
    }
    getAllManagementCompanyInfo();
  }, [])



  const columns = [
    {
      title: '番号',
      dataIndex: '番号',
      width: "4%",
      ellipsis: true,
    },
    {
      title: '管理会社ID',
      dataIndex: 'managementCompanyID',
      width: "8%", ellipsis: true,
    },
    {
      title: '管理会社名',
      dataIndex: 'managementCompanyName',
      width: "10%", ellipsis: true,
    },
    {
      title: '電話番号',
      dataIndex: 'managementCompanyPhoneNo',
      width: "8%", ellipsis: true,
    },
    {
      title: 'メール',
      dataIndex: 'managementCompanyMail',
      width: "15%", ellipsis: true,
    },
    {
      title: '住所',
      dataIndex: 'managementCompanyAddress',
      width: "20%",
      ellipsis: true,
    },
    {
      title: '備考',
      dataIndex: 'managementCompanyRemark',
      width: "15%",
      ellipsis: true,
    },

  ];

  //検索ボタンを押下すると、検索内容がある場合、検索結果を表示；検索内容がない場合、すべての結果を表示
  const searchCompanyInfo = () => {  //inputValue
    const result = allData.find(item => item.managementCompanyID === inputValue.substring(0, 5))

    if (inputValue !== '' && result !== undefined) {
      setManagementCompanyID(inputValue.substring(0, 5));
      setAllowSearch(true);
      setAllowAllSearch(false);
      setSearchResult(result)

    } else if(inputValue !== '' && result === undefined){
      setDataSource([]);
      message.error('正しい管理会社名を入力してください');
    } 
    
    else if (inputValue === '') {
      setDataSource(allData);
    }

  }


  useEffect(()=>{
    if (allowSearch === true && searchResult !== "") {
      const data = [searchResult].map((item, index) => ({
        ...item,
        key: 0,
        番号: 1, // 自动生成类似行号的字段
      }));
      setDataSource(data);
      message.success('データ検索成功');

    }else if(allowSearch === true && searchResult === ""){
      setDataSource([]);
      message.error('正しい管理会社名を入力してください');
    }

    setAllowSearch(false);
    
  },[allowSearch,searchResult])


  //登録/更新ページにデータを渡す
  const history = useHistory();

  const transferToRegister = () => {
    history.push('/submenu/managementCompanyRegister'); // 跳转到 /about 页面
  };

  //修正ボタン
  const transferToModify = () => {
    // 使用state传递值
    history.push({
      pathname: "/submenu/managementCompanyRegister",
      state: { companyInfo },
    });
  };

  //行目を選択する場合、「修正」ボタンが活性；もう一回クリックすると、非活性になる
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const onRowClick = (record) => {
    setSelectedRowKey(selectedRowKey === record.key ? setModifyBtnDisabled(true) : setModifyBtnDisabled(false));
    setSelectedRowKey(selectedRowKey === record.key ? null : record.key);
    setCompanyInfo(record)
  };




  const rowClassName = (record) => {
    return record.key === selectedRowKey ? 'selected-row' : '';
  };

  return (
    <div className="container">
      <br></br>
      <Row className="text-center mb-3">
        <Col>
          <h2>管理会社情報検索</h2>
        </Col>
      </Row>

      <Form>


        <Row justify="center" align="middle" >
          <Col >
            <InputGroup size="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <InputGroup.Prepend>
                <InputGroup.Text id="sixKanji">
                  管理会社名
                </InputGroup.Text>
              </InputGroup.Prepend>

              <AutoComplete
                options={options}
                onSearch={handleSearch}
                style={{ width: 230 }}
                value={inputValue}
                onChange={setInputValue}
                onSelect={handleSelect}
                filterOption={filterOption}>
                <Input placeholder="Search users" />
              </AutoComplete>


            </InputGroup>
          </Col>
        </Row><br />

        <div style={{ textAlign: "center" }}>
          <Button size="sm" variant="info" onClick={searchCompanyInfo}>
            検索
          </Button>

          <Button size="sm" variant="info" onClick={transferToRegister} style={{ marginLeft: '20px' }}>
            追加
          </Button>

        </div>

        <div style={{ width: '95%', margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="sm" variant="info" onClick={transferToModify} disabled={modifyBtnDisabled}>
            修正
          </Button>
        </div>

        <div style={{ width: '95%', margin: '0 auto', marginTop:'5px' }}>
          <Table
            bordered
            dataSource={dataSource}
            //columns={mergedColumns}
            columns={columns}
            pagination={{ pageSize: 7 }}
            className="custom-table"
            rowClassName={rowClassName}

            onRow={(record) => ({
              onClick: () => onRowClick(record),
            })}
            
          />
        </div>

      </Form>

    </div>
  )
}


