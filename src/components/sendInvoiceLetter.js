import React, { Component } from 'react';
import { Form, Button, ListGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import MyToast from './myToast';
import store from './redux/store';
axios.defaults.withCredentials = true;

class sendInvoiceLetter extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState;
    }
    initState = {
    	mailConfirmContont: "",
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    }
    
	// valueChange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

    componentDidMount() {
        this.setState({
        	mailConfirmContont: this.props.mailConfirmContont
        })
    }
    render() {
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={"更新成功！"} type={"danger"} />
                </div>
                <div>
	                <textarea ref={(textarea) => this.textArea = textarea} value = {this.state.mailConfirmContont}  id="mail" name="mail" 
						onChange={this.valueChange}
						className="auto form-control Autocompletestyle-interview-text"
						style={{ height: '800px', resize: 'none', overflow: 'hidden' }}
					/>
				</div>
            </div>
        );
    }
}

export default sendInvoiceLetter;