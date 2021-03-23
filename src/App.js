import React, { Component } from 'react';
import axios from 'axios';
import Home from './components/Home';
import { getDeviceCode, getName, getLoggedInTime, getToken, setDeviceCode, setName, setLoggedInTime, setToken } from "./helper/local-storage"
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    let user = getName();
    console.log("user", user)
    this.state = {
      email: '',
      password: '',
      name: !!user ? user : '',
      isLogin: !!user,
      statusLogin: -1,
      device_code: '',
    }
  }

  initDevice = () => {
    this.device_code = this.checkDeviceCode();

    if (this.device_code === '' || this.device_code === undefined) {
      axios({
        method: 'POST',
        url: 'http://a.vipn.net/api/device/init',
        body: { 'device_type': 2 }
      }).then(res => {
        const result = res.data;
        if (result.success !== true) {
          alert(result.msg);
          return;
        }
        this.device_code = result.data.device_code;
        setDeviceCode(this.device_code);

      }).catch(err => {
        console.log(err);
      });
    }
  }


  checkDeviceCode = () => {
    let cache = getDeviceCode();
    if (typeof cache === 'string' && cache.length > 0) {
      let data = JSON.parse(cache);
      //trả về devicecode
      return data.device_code;
    }
    return '';
  }

  componentDidMount() {
    const device_code = getDeviceCode();
    const token = getToken();

    if (!device_code) {
      this.initDevice();
      return;
    }
    if (typeof token === 'string' && token.length > 0) {
      const loggedInTime = getLoggedInTime();
      const now = Date.now();
      console.log("thoi gian", now, loggedInTime)
      if (now - loggedInTime < 5 *60* 1000) {
        this.setState({
          statusLogin: 1,
        });
      }
      else {
        this.setState({
          isLogin: false,
          statusLogin: -1
        });
      }
    }
  }

  //Hàm gán giá trị user nhập vào thành State
  onHandleChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      [name]: value,
    });
  }

  onCloseForm = () => {
    this.setState({
      isLogin: false,
      statusLogin: -1
    });
  }

  onLogin = (event) => {
    //Chặn sự kiện submit mặc định của form khi nhấn buttom
    event.preventDefault();

    var email = this.state.email;
    var password = this.state.password;
    var device_code = getDeviceCode(); // = '05efa39561ac57b84baace76cdb5ddcd'
    //Gọi API đăng nhập
    if (this.state.statusLogin === 0) {
      return;
    }
    this.setState({
      statusLogin: 0
    })
    axios({
      method: 'post',
      url: 'http://a.vipn.net/api/auth/login',
      headers: { "DEVICE-CODE": device_code },
      data: {
        email: email,
        password: password
      }
    }).then(res => {
      console.log(res.data);
      if (res.data.code === 200) {
        alert("Đăng nhập thành công");
        this.setState({
          isLogin: true,
          statusLogin: 1,
          name: res.data.data.user.email,
        });
        setName(res.data.data.user.email);
        setToken(res.data.data.token);
        setLoggedInTime(res.data.data.user.last_login.date);
      }
      else {
        alert(res.data.msg);
        this.setState({
          statusLogin: 2
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }


  render() {
    var statusLogin = this.state.statusLogin;
    var isLogin = this.state.isLogin;

    var local = getDeviceCode();
    return (
      <div>
        {isLogin === true ? <div></div> :
          <div className="App">
            <h1>Login</h1>
            <form className="form-group">
              <input type="text" placeholder="Nhập tài khoản" name="email" onChange={this.onHandleChange} value={this.state.email} /><br />
              <input type="password" placeholder="Nhập mật khẩu" name="password" onChange={this.onHandleChange} value={this.state.password} /><br />
              <button type="submit" onClick={this.onLogin}>Đăng nhập</button>
            </form>
          </div>
        }
        {this.state.isLogin === true
          ? <Home name={this.state.name}
            onCloseForm={this.onCloseForm}
            device_code={local}
            statusLogin={statusLogin} />
          : <div></div>}
      </div>
    );
  }
}
export default App;
