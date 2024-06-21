import React from 'react'
import { DatePicker } from "antd";
// import dateImg from '../../assets/images/date_icon.ico'
import dateImg from '../../../assets/images/date_icon.ico'


const dateIcon = <img src={dateImg} alt="" />;

export default function DatePicker({onChange}) {
  return (
    <DatePicker
    allowClear={true}
    format="YYYY-MM-DD"
    className="form-control form-control-sm"
    suffixIcon={dateIcon}
    onChange={onchange}
    locale={'ja'}
  />
  )
}
