import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusLogin: ''
        }
    }
    onClose = () => {
        if (this.state.statusLogin === 0) {
            return;
        }
        this.setState({
            statusLogin: 0
        })

        axios({
            method: 'GET',
            url: 'http://a.vipn.net/api/auth/logout',
            headers: { "DEVICE-CODE": this.props.device_code }
        }).then(res => {
            if (res.data.code === 200) {
                alert("Đăng xuất thành công");
                this.setState({
                    statusLogin: -1
                });
                localStorage.removeItem('name');
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