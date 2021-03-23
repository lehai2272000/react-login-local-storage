import React, { Component } from 'react';
import axios from 'axios';
import { getDeviceCode } from '../helper/local-storage';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusLogin: ''
        }
    }
    onClose = () => {
        var device_code= getDeviceCode();

        if (this.state.statusLogin === 0) {
            return;
        }
        this.setState({
            statusLogin: 0
        })

        axios({
            method: 'GET',
            url: 'http://a.vipn.net/api/auth/logout',
            headers: { "DEVICE-CODE": device_code }
        }).then(res => {
            if (res.data.code === 200) {
                alert("Đăng xuất thành công");
                this.setState({
                    statusLogin: -1
                });
                localStorage.removeItem('name');
                localStorage.removeItem('time');
                localStorage.removeItem('token');
            }
            else {
                alert(res.data.msg);
                this.setState({
                    statusLogin: 2
                })
            }
        }).catch(err => {
            console.log(err);
        });
        this.props.onCloseForm();
    }

    render() {

        return (
            <div>
                <h1>Xin chào, {this.props.name}</h1>
                <div>
                    <button onClick={this.onClose}>Đăng xuất</button>
                </div>
            </div>
        )
    };
}

export default Home;