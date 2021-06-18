import PubSub from 'pubsub-js'
import moment from 'moment'
import request from "../../utils/request"
var appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay : false ,   //是否播放
    song : {},
    musicId : '',
    musicLink : '',
    currentTime : '00:00',   //实时的时间
    durationTime : '00:00',  //音乐的总时长
    currentWidth : 0 ,  // 进度条的实时宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取路由传参的值
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    //  console.log(musicId)
    this.getMusicInfo(musicId);
    // 判断当前音乐是否在播放
    if (appInstance.globalData.isMusicPlay &&  appInstance.globalData.musicId == musicId) {
      this.setData({
        isPlay: true
      })
    }

    this.backgroundManager = wx.getBackgroundAudioManager();
    // 创建一个音乐播放实例  监听音乐事件
    this.backgroundManager.onPlay(()=>{
      this.changePlay(true)
      appInstance.globalData.musicId = musicId
      
    })
    this.backgroundManager.onPause(()=>{
      this.changePlay(false)
    })
    this.backgroundManager.onStop(()=>{
      this.changePlay(false)
    })
    this.backgroundManager.onEnded(()=>{
      this.changePlay(false)
      this.autoPlay('next') //自动下一首
      // 为防止自动跳转之后数据没有更新，可以手动更新时长为0
      this.setData({
        currentWidth : 0,
        currentTime : '00:00'
      })
    })
    this.backgroundManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundManager.currentTime * 1000).format('mm:ss')
      let durationTime = this.data.durationTime;
      let currentWidth = this.backgroundManager.currentTime / this.backgroundManager.duration
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  // 改变播放状态
  changePlay(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取歌曲详情
  async getMusicInfo(musicId){
    let songData = await request("/song/detail",{ids:musicId})
    // console.log(songData)

    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song : songData.songs[0],
      durationTime
    })
    // 动态更新导航栏的文字
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
    
  },
  //控制音乐 获取歌曲播放地址
  async musicControl(isPlay,musicId,musicLink){
    
    if (isPlay) {
      if (!musicLink) {
        let musicData = await request("/song/url",{id:musicId});
        musicLink = musicData.data[0].url;
        this.setData({
          musicLink
        })
      }
      
      
      this.backgroundManager.src = musicLink;
      this.backgroundManager.title = this.data.song.name;
    } else {
      this.backgroundManager.pause();
    }
  },
  // 点击播放控制按键
  musicPlay(){
     let isPlay = !this.data.isPlay
    // this.setData({
    //  isPlay
    // })
    let {musicId,musicLink} = this.data
    this.musicControl(isPlay,musicId,musicLink);
  },
// 切换歌曲的功能
handleSwitch(e){
  let typeId = e.currentTarget.id
  // 发送前关闭当前音乐
  this.backgroundManager.stop();
  this.autoPlay(typeId)
  // PubSub.subscribe('musicId',(msg,data)=>{
  //   // console.log(data)
  //   // 调用获取歌曲信息方法
  //   this.getMusicInfo(data)
  //   // 自动播放音乐
  //   this.musicControl(true,data)
  //   // 用完之后取消订阅
  //   PubSub.unsubscribe('musicId')
  // })
  // PubSub.publish('switchType',typeId);//传递当前信息给recommend页面
},

// 自动播放下一首
autoPlay(next){
  PubSub.subscribe('musicId',(msg,data)=>{
    // console.log(data)
    // 调用获取歌曲信息方法
    this.getMusicInfo(data)
    // 自动播放音乐
    this.musicControl(true,data)
    // 用完之后取消订阅
    PubSub.unsubscribe('musicId')
  })
  PubSub.publish('switchType',next);//传递当前信息给recommend页面
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