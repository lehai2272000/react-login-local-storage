import React, { Component } from 'react';
import axios from 'axios';
import Home from './components/Home';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    var user = JSON.parse(localStorage.getItem('name'));
    this.state = {
      email: '',
      password: '',
      name: !!user ? user.name : '',
      isLogin: !!user,
      statusLogin: -1,
      device_code: '',
    }
  }

  componentDidMount() {
    const device = localStorage.getItem("device_code");
    if (device === null || device === undefined || device === "") {
      this.initDevice();
    }
  }

  //kiem tra devide-code
  checkDeviceCode = () => {
    let cache = localStorage.getItem('device_code');
    //tồn tại
    if (typeof cache === 'string' && cache.length > 0) {
      let data = JSON.parse(cache);
      // console.log('data', data)
      // //ktra tgian htai > tgian kết thúc
      const crtTime = new Date().getTime();
      if (data.timeExpire < crtTime) {
        //xóa device_code
        localStorage.removeItem('device_code');
        return '';
      }
      //trả về devicecode
      return data.deviceCode;
    }
    return '';
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
        //lưu vào local-storage
        localStorage.setItem('device_code', JSON.stringify({
          deviceCode: result.data.device_code,
          timeExpire: new Date().getTime() + 1000 * 60 * 5,
        }));
      }).catch(err => {
        console.log(err);
      });
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
    var local = JSON.parse(localStorage.getItem('device_code'));
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
      headers: { "DEVICE-CODE": local.deviceCode },
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
        localStorage.setItem('name', JSON.stringify({
          name: res.data.data.user.email,
        }));
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
    console.log('render')
    var statusLogin = this.state.statusLogin;
    var isLogin = this.state.isLogin;

    var local = JSON.parse(localStorage.getItem('device_code'));
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
            device_code={local.deviceCode}
            statusLogin={statusLogin} />
          : <div></div>}
      </div>
    );
  }
}
export default App;
