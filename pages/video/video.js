// pages/video/video.js

import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList : [],   //获取的视频标签数组
    videoId : '',
    videoList : [],
    imgId: '',  //替代图片的id
    videoUpdataTime : [],  //记录视频播放的时间的
    isTrigger : false,  //标记下拉刷新的状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()

    // this.getVideoList(this.data.videoId)
    // 放这里会出问题，会取不到vedioId 的值
  },

  // 获取视频列表的方法
  async getVideoGroupList(){
    let videoGroupList = await request("/video/group/list");
    this.setData({
      videoGroupList : videoGroupList.data.slice(0,14),
      videoId : videoGroupList.data[0].id
    })
    // // 放在这里可以获取到内容
    this.getVideoList(this.data.videoId)
  },

  // 获取视频数据
  async getVideoList(videoId){
    if (!videoId) {
      return;
    }
    let videoList = await request("/video/group",{id: videoId})
    wx.hideLoading({
    })
    let index = 0;
    let videoList1 = videoList.datas.map(item => {item.id = index++; return item})
    this.setData({
      videoList : videoList1,
      isTrigger : false
    })
  },

  changeVideo(e){
    let videoId = e.currentTarget.id;
    // 这里自动转为了字符串 所以要转回来  隐形转换
    this.setData({
      videoId : videoId*1,
      videoList :''
    })
    // 点击获取最新视频
    // 提升体验可以使用加载
    wx.showLoading({
      title: 'Loding',
    })
    this.getVideoList(this.data.videoId)
  },

  play(e){
    // 控制播放的  解决多个视频同时播放
    //点击下一个 关闭上一个   点击自身的bug
    let vId = e.currentTarget.id;
    // 因为已经切换成了图片，所以下面就没用了
    //this.vId != vId && this.vContent && this.vContent.stop()   //当当前的id 不相等 且 this.vContent不为空时 停止
    // this.vId = vId
    this.setData({
      imgId : vId
    })
    this.vContent = wx.createVideoContext(vId)
    // 播放前判断是否播放过
    let {videoUpdataTime} = this.data;
    let videoItem = videoUpdataTime.find(item => item.vid === vId)
    if (videoItem) {
      this.vContent.seek(videoItem.currentTime)
    }
    this.vContent.play()
  },
//播放记录播放时间的
  handleUpdataTime(e){
    let videoTimeObj = { vid : e.currentTarget.id, currentTime : e.detail.currentTime};
    let {videoUpdataTime} = this.data; //从data中获取videoUpdataTime的数据
    // console.log(videoTimeObj)
    // 判断数组中是否存在这条数据，存在就更新，不存在就添加
    let videoItem = videoUpdataTime.find(item => item.vid == videoTimeObj.vid);
    if (videoItem) {
      videoItem.currentTime = e.detail.currentTime;
    } else {
      videoUpdataTime.push(videoTimeObj);
    }
    this.setData({
      videoUpdataTime
    })
  },

  // 播放到结尾之后
  handleEnd(e){
    // 移除播放记录
    let {videoUpdataTime} = this.data;
    videoUpdataTime.splice(videoUpdataTime.findIndex(item => item.vid == e.currentTarget.id),1);
    this.setData({
      videoUpdataTime
    })
  },

  // 跳转搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 视频下拉刷新  scroll-view组件
  handleRefresh(){
    this.getVideoList(this.data.videoId)
  },

  //上拉触顶回调 刷新 scroll-view
  handleLower(){
    console.log("发送请求 ||  或者前端截取后面的数据再次加载")
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
// 页面下拉刷新，需要配置页面或者app.json
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
    return {
      title: '小可爱给你转发的好货',
      path: '/pages/video/video.wxml',
      imageUrl :  '/static/images/logo.png' 
    }
  }
})