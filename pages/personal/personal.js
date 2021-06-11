// pages/personal/personal.js
import request from "../../utils/request.js"

let startY = 0; //手指的起始坐标Y
let moveY = 0; //手指的移动坐标Y
let moveDistanceY = 0; //手指的移动距离

Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform : "translateY(0)",    //下拉动画
    coverTranstion : "",    //回弹动画
    userInfo: {},     //用户信息
    recentPlayList : []   //最近播放记录
  },

  // 跳转登录页
  toLogin(){
    //如果登录信息有了，就不再跳转至登录页面
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    return;
  },
  // 手指滑动事件
  handleTouchStart(e){
    startY = e.touches[0].clientY;
    this.setData({
      //防止第二次滑动出现滑动动画
      coverTranstion : " "
    })
  },
  handleTouchMove(e){  
    moveY = e.touches[0].clientY;
    moveDistanceY = moveY - startY;
    if(moveDistanceY <= 0){
      return;
    }
    if(moveDistanceY >= 100){
      moveDistanceY = 100;
    }
    this.setData({
      coverTransform : `translateY(${moveDistanceY}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform : "translateY(0rpx)",
      coverTranstion : "transform 0.5s linear"
    })
  },

  async getRecentPlayList(userId){
    let rpList = await request("/user/record",{ uid : userId, type : 0 });
    let index = 0;
    let rp = rpList.allData.map(item =>{ item.id = index++; return item;})
      if (rpList.allData.length>10) {
        this.setData({
          recentPlayList : rpList.allData.splice(0,10)
        })
      } else {
        this.setData({
          recentPlayList : rpList.allkData
        })
      }
      // recentPlayList : rpList.weekData.splice(0,10)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载前就读取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo : JSON.parse(userInfo)
      })
      //获取用户播放记录
      this.getRecentPlayList(this.data.userInfo.userId)
    }

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