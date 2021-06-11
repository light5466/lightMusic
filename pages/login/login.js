// pages/login/login.js

import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone : '',  //用户的手机号
    password : ''   //用户的密码
  },

  // 获取密码和电话  (验证信息)
  handleInput(e){
   // let type = e.currentTarget.id;  //取值  拿到名字  看是电话还是密码
   let type = e.currentTarget.dataset.type;   //data-key 发的方式传值  data-type
    this.setData({
      [type] : e.detail.value
    })
  },

  //login登录
  async login(){  //异步请求
    let {phone,password} = this.data;
    //前端验证  内容是否为空  手机号码格式不正确  
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon : 'none'
      })
      return;
    }
    // 不为空验证格式
    let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!reg.test(phone)) {
     wx.showToast({
       title: '请输入正确的手机号',
       icon : 'none'
     })
    
     return;
    }
    if(!password){
      wx.showToast({
        title: '请输入密码',
        icon : 'none'
      })
      return;
    }

    // 后端验证
    let result = await request("/login/cellphone",{phone,password})

    if (result.code ===200) {
      // 登录成功 首先获取用户信息 然后跳转个人页面 把信息传过去
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))  //头部方法存放到本地 方便下一个页面获取
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    } else if(result.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon : 'none'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon : 'none'
      })
    }else {
      wx.showToast({
        title: '请重新登录',
        icon : 'none'
      })
    }

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})