
function getDeviceCode() {
    return localStorage.getItem("device-code");
}

function getToken() {
    return localStorage.getItem("token");
}

function getName() {
    return localStorage.getItem("name");
}

function getLoggedInTime() {
    return Date.parse(localStorage.getItem("time"));
}

function setDeviceCode(device_code) {
    localStorage.setItem("device-code", device_code)
    return device_code;
}

function setToken(token) {
    localStorage.setItem("token", token)
    return token;
}

function setName(name) {
    localStorage.setItem("name", name)
    return name;
}

function setLoggedInTime(time) {
    localStorage.setItem("time", time)
    return time;
}

export { getDeviceCode, getToken, getName, getLoggedInTime, setDeviceCode, setToken, setName, setLoggedInTime }