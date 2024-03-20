import Request from "../utils/request";

// 导入utils中所有函数
// import * as utils from "../utils";


// token 可不传 在request中已补充
export const httpGet = (url, token, params) => Request({url, method: "GET", params})


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


  publishDateTimeList: (params) => Request({url: '/api/article/rest/publishDateTimeList', method: "GET", params}),
  bannerRestList: (params) => Request({url: "/api/banner/rest/list", method: "GET", params}),
  searchKeywordList: (params) => Request({url: "/api/searchKeyword/rest/list/10", method: "GET", params}),
  implementDateList: (params) => Request({url: '/api/article/rest/implementDateList', method: "GET", params}),
  getUserArticleList: (params) => Request({url: '/api/userArticle/pageList', method: "GET", params}),
  getMember: (params) => Request({url: '/api/member', method: "GET", params}),
  getNoticeList: (params) => Request({url: '/api/notice/pageList', method: "GET", params}),
  getWxPayResult: (outTradeNo,params) => Request({url: `/api/accountFlow/wxPayResult/${outTradeNo}`, method: "GET", params}),
  getArticleDetail: (articleId,params) => Request({url: `/api/article/detail/${articleId}`, method: "GET", params}),
  getMemberPrice: (params) => Request({url: '/api/memberPrice/list', method: "GET", params}),


  resetPassword: (data) => Request({url: "/api/userInfo/rest/getBackPwd", method: "PUT", data}),


  getCodeCaptcha: (data) => Request({url: '/api/rest/captcha', method: "POST", data}),
  verifyCode: (data) => Request({url: '/api/rest/verifyCode', method: "POST", data}),



  accountFlow: (data) => Request({url: '/api/accountFlow', method: "POST", data}),

  articleQuestion: (data) => Request({url:  `/api/articleQuestion`, method: "POST", data}),

  getUserCollection: (params) => Request({url: '/api/userCollection/pageList', method: "GET", params}),

  userCollection: (id,data) => Request({url:  `/api/userCollection/${id}`, method: "POST", data}),
  praiseArticle: (id,flag,data) => Request({url:  `/api/praiseArticle/${id}/${flag}`, method: "POST", data}),








  httpGet
}
