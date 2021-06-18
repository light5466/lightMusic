// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mouth : '06',
    day : '11',
    recommendList : [],    //推荐歌曲列表
    index : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请登录！',
        icon: 'none',
        success : () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    // 更新日期数据
    this.setData({
      mouth : new Date().getMonth() + 1,
      day : new Date().getDate()
    })
    this.getRecommendList();
    // 使用 pubsub订阅数据
    PubSub.subscribe('switchType',(msg,data)=>{
      let {recommendList,index} = this.data;
      let indexLength = recommendList.length;
      if (data == 'pre') {
        if (index == 0) {
          index = indexLength
        }
        index -= 1  //上一首
      } else {
        if (index == indexLength-1) {
          index = -1
        }
        index += 1   //下一首
      }
      this.setData({
        index
      })
      let musicId = recommendList[index].id;  //获取下一首或者上一首音乐id
      PubSub.publish('musicId',musicId)    //发送过去
    });

  },

  // 获取歌曲列表方法
  async getRecommendList(){
    let recommendList = await request("/recommend/songs");
    this.setData({
      recommendList : recommendList.recommend
    })
  },

  // 跳转至详情页的方法
  toSongDetail(e){
    let songId = e.currentTarget.dataset.song;
    let index = e.currentTarget.dataset.index;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+songId,
      // url: '/pages/songDetail/songDetail.wxml?song='+JSON.stringify(song),
    })
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