import request from "../../utils/request"
let isSend = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderInfo : '',  //搜搜框默认的文字
    hotList : [],   //热搜榜数据
    searchContent : '',  //用户输入的表单内容
    searchList : [] ,   //搜索到的数据
    historyList : [],  //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    this.getHistoryList()
  },

  // 获取默认搜索框文字的方法 以及热搜榜的信息
  async getInitData(){
    let placeholderData = await request("/search/default")
    let hotListData = await request("/search/hot/detail")
    
    this.setData({
      placeholderInfo : placeholderData.data.showKeyword,
      hotList : hotListData.data
    })
  },
//表单发生改变的事件 发起请求 使用函数节流
   handleInput(e){
    this.setData({
      searchContent : e.detail.value.trim()   //去掉空格的
    })
    if (isSend) {
      return
    }
    isSend = true;
    this.getSearchList();
    setTimeout(() => {
      isSend = false
    }, 800);
    
  },
// 搜索发送请求
async getSearchList(){
  if (!this.data.searchContent) {
    this.setData({
      searchList : [ ]
    })
    return;
  }
  let {searchContent,historyList} = this.data
  let searchListData = await request("/search",{keywords : searchContent , limit : 10})
  this.setData({
    searchList : searchListData.result.songs
  })
  if (historyList.indexOf(searchContent) !== -1) {
    historyList.splice(historyList.indexOf(searchContent),1)   //如果有相同的，则删除，然后再重新添加到第一位
  }
  historyList.unshift(searchContent)
  // 把记录保存在本地
  wx.setStorageSync('searchHistory', historyList)
  this.getHistoryList()
},

getHistoryList(){
  let historyList = wx.getStorageSync('searchHistory')
  if (historyList) {
    this.setData({
      historyList
    })
  }
},

// 点击清空搜索框内容
clearSearchContent(){
  
  this.setData({
    searchContent : '',
    searchList : []
  })
},
//删除本地历史记录
deleteHistory(){
  if (this.data.historyList) {
    wx.showModal({
      title : '删除记录',
      content : '确认要删除吗？',
      cancelColor: '#0ef8e1',
      success : (res) => {
        if (res.confirm) {
          this.setData({
            historyList : []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
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