import axios from 'axios'


const Request = axios.create({
  // TODO 环境变量
  baseURL: process.server ? 'https://www.lawknows.com' : '',
  headers: {'Content-Type': 'application/json; charset=utf-8'},
  timeout: 5000
})

// 请求拦截器
Request.interceptors.request.use((config) => {
  if(!process.server){
    config.headers['token'] = localStorage?.getItem('token') || ''
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加请求返回拦截器
Request.interceptors.response.use((res) => {
  const {data} = res
  return Promise.resolve(data)
}, async (error) => {
  console.log(error)
  const {response} = error
  // errorHandle(response.status,response.info)
  return Promise.reject(response)
})

const errorHandle = (status,info) =>{
  switch (status) {
    case 400:
      console.log("语义有误");
      break;
    case 401:
      console.log("服务器认证失败");
      break;
    case 403:
      console.log("服务器拒绝访问");
      break;
    case 404:
      console.log("地址错误");
      break;
    case 500:
      console.log("服务器遇到意外");
      break;
    case 502:
      console.log("服务器无响应");
      break;
    default:
      console.log(info);
      break;
  }
}

export default Request
