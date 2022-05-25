// pages/sign/sign.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    sum_color: '#9152fa',
    signed_color: '#a7b6d9',
    unsigned_color: '#a7b6d9',
    peopleList_sum: [],
    totalList: [],
    checkninList: [],
    nocheckinList: [],
    default_name:'未命名用户'
  },
  // 返回上一个页面
  goback() {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 切换选项卡
  checktabs(res) {
    const _this = this
    if (res.currentTarget.dataset.index == 0) {
      _this.setData({
        sum_color: '#9152fa',
        signed_color: '#a7b6d9',
        unsigned_color: '#a7b6d9',
        peopleList_sum: app.globalData.total,
      })
      return
    } else if (res.currentTarget.dataset.index == 1) {
      _this.setData({
        sum_color: '#a7b6d9',
        signed_color: '#fc7c1c',
        unsigned_color: '#a7b6d9',
        // 获取已签到人数列表
        peopleList_sum: app.globalData.checkin,
      })
      return
    } else {
      _this.setData({
        sum_color: '#a7b6d9',
        signed_color: '#a7b6d9',
        unsigned_color: '#fc424b',
        // 获取未签到人数列表
        peopleList_sum: app.globalData.nocheckin,
      })
      return
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取总人数列表
    this.setData({
      peopleList_sum: app.globalData.total || [],
      totalList: app.globalData.total || [],
      checkninList: app.globalData.checkin || [],
      nocheckinList: app.globalData.nocheckin || []
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})