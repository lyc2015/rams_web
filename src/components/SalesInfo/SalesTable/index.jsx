import React from 'react'
import { Table } from 'antd';

export default function SalesTable({columns,data}) {
  const onChange=(e)=>{
    console.log(e);
  }


  return (
    <Table columns={columns} dataSource={data} onChange={onChange} pagination={{
      pageSize: 12,
    }} />
  )
}
