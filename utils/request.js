// 发送ajax请求
import config from './config';

export default (url,data={},method="GET") => {
  return new Promise((resolve,reject)=>{
    wx.request({
      url: config.host + url,
      data,
      method,
      success :(res) => {
        //console.log(success);
        resolve(res.data); //resolve是修改promise的状态为成功状态
      },
      fail :(err) => {
        //console.log(err);
        reject(err);
      }
    })
  })
  
}