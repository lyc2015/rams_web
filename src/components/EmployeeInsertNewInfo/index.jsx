import React from 'react';
import { Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import './index.css';

const { Option } = Select;

const FormInput = ({
  label,
  type = "text",
  value,
  name,
  placeholder,
  onChange,
  disabled = false,
  options = [],
  isSelect = false,
  isDatePicker = false,
  dateFormat = "YYYY/MM/DD",
  className = "",
  onDateChange,
  datePickerProps = {},
}) => {
  if (isSelect) {
    return (
      <div className={`form-input ${className}`}>
        <label>{label}</label>
        <Select
          name={name}
          value={value}
          onChange={(value) => onChange({ target: { name, value } })}
          disabled={disabled}
          style={{ width: '100%' }}
        >
          {options.map((option) => (
            <Option key={option.code} value={option.code}>
              {option.name}
            </Option>
          ))}
        </Select>
      </div>
    );
  } else if (isDatePicker) {
    return (
      <div className={`form-input ${className}`}>
        <label>{label}</label>
        <DatePicker
          allowClear={false}
          value={value ? moment(value) : null}
          onChange={onDateChange}
          format={dateFormat}
          locale="ja"
          {...datePickerProps}
        />
      </div>
    );
  } else {
    return (
      <div className={`form-input ${className}`}>
        <label>{label}</label>
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    );
  }
};

export default FormInput;
