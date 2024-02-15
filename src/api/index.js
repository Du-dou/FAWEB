import Request from "../utils/request";

// 导入utils中所有函数
// import * as utils from "../utils";


// token 可不传 在request中已补充

export const httpGet = (url, token, params) => Request({url, method: "GET", params})
export const httpPost = (url, token, data) => Request({url, method: "POST", data})
export const httpPut = (url, data) => Request({url, method: "PUT", data})


export default {
  sendCode: (data) => Request({url: "/api/rest/sendCode", method: "POST", data}),
  register: (data) => Request({url: '/api/userInfo/rest/register', method: "POST", data}),
  userLogin: (data) => Request({url: '/api/session', method: "POST", data}),
  getUserInfo: (params) => Request({url: '/api/userInfo', method: "GET", params}),
  changePassword: (data) => Request({url: "/api/userInfo/pwd", method: "PUT", data}),
  changePhone: (data) => Request({url: "/api/userInfo/tel", method: "PUT", data}),
  changeUserInfo: (data) => Request({url: "/api/userInfo", method: "PUT", data}),
  uploadFile: (data) => Request({
    url: "/api/fileUpload",
    method: "POST",
    data,
    headers: {'Content-Type': 'multipart/form-data'}
  }),
  deleteAllCollect: (id) => Request({url: `/api/userCollection/${id}`, method: "DELETE"}),
  deleteAllCollectCancel: (id) => Request({url: `/api/userCollection/cancel/${id}`, method: "DELETE"}),
  deleteAllCollectNotice: (id) => Request({url: `/api/notice/${id}`, method: "DELETE"}),
  downFile: (url, data = null) => Request({url, method: "GET", data, responseType: 'blob'}),

  httpGet,
  httpPost,
  httpPut

}
