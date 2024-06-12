import React from 'react'

import {
    Col,
    InputGroup,
    FormControl,
} from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'



export default function FromCol({ children, label, value, valueChange, required, name,maxLength ,type,disabled,...otherProps}) {
    const handleChange=(e)=>{
        let value=e.target.value
        if(type==="number"){
            console.log("number");
            if(value.length > maxLength) 
                value = value.slice(0, 6)
            
        }
        valueChange(name,value)
    }
    return (
        <Col md={4} className='fromCol'>
            <InputGroup size="sm" className={`mb-3  ${required && 'required-mark'}`}>
                <InputGroup.Prepend>
                    <InputGroup.Text>{label}</InputGroup.Text>
                </InputGroup.Prepend>
                {children ? children : <FormControl
                    placeholder={label}
                    value={value}
                    onChange={handleChange}
                    name={name}
                    size="sm"
                    maxLength={maxLength}
                    type={type}
                    disabled={disabled}
                    {...otherProps}
                />}
            </InputGroup>
        </Col>
    )
}
