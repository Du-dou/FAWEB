import axios from 'axios'


const Request = axios.create({
  // TODO 环境变量
  baseURL: process.server ? 'https://www.lawsees.com' : '',
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

export default Request
