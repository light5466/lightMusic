// pages/index/index.js
import request from "../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],  //轮播图数据
    recommendList: [],  //推荐歌单的数据
    topList: [] //排行榜歌单数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图数据
    let bannerListData = await request('/banner',{type : 2})
    // console.log(result)
    this.setData({
      bannerList : bannerListData.banners
    })

    // 获取推荐歌单的数据
    let rc = await request('/personalized',{limit : 10})
    this.setData({
      recommendList : rc.result
    })

    //获取排行榜数据
    // 问题：获取多个种类的排行榜，会发送多次请求，请求的数据是上百条，我们只需要前三条
    let index = 0
    let resArr = []
    while(index < 5) {
      let topListData = await request('/top/list',{idx : index++})
      // 数组的截取方法： splice（）会修改原数组，  slice（）不会修改原数组
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0,3)
      }
      resArr.push(topListItem)
      //好处是 每请求完一次就渲染，减少客户等待时间 但是渲染次数增多
      this.setData({
        topList : resArr
      })
    }
    //这样会 等待五次请求结束后才会渲染数据，会让客户等待的时间很长，
    // this.setData({
    //   topList : resArr
    // })


  },
  // 跳转至推荐歌单
  toRecommend(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
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