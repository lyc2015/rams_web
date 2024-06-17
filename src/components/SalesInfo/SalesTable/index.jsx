import React from 'react'
import {  Table} from 'antd';
const columns = [
    {
      title: '番号',
      dataIndex: 'key',
      key: 'name',
    },
    {
      title: '契約ID',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '契約日',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '家賃/価格',
      key: 'tags',
      dataIndex: 'tags',

    },
    {
      title: 'AD',
      key: 'action',
    },
    {
        title: '紹介費',
        key: 'action',
      },
      {
        title: '担当者',
        key: 'action',
      },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
export default function SalesTable() {


  return (
    <Table columns={columns} dataSource={data} />
  )
}
