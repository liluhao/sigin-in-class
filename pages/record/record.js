// pages/record/record.js
const API = require('../../utils/ajax')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 'record_created',
    checkinLists: [], // 签到记录列表
    createdCheckinLists: [], // 已创建签到记录列表
  },
  // 切换内容
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    })
  },
  // 返回
  goback() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  async goStatic(list){
    const info = list.currentTarget.dataset.info
    const checkin_id = info.checkin_id
    app.globalData.lesson_name = info.lesson_name
    app.globalData.start_time = info.begin_time.substring(11)
    const reponse = await API.checked_in(checkin_id)
    if (reponse.data.code === 200) {
      const rep = reponse.data.data
      const staticData = getApp().globalData
      staticData.total = rep.total_list || []
      staticData.checkin = rep.checkin_list || []
      staticData.nocheckin = rep.not_check_list || []
    }
    wx.navigateTo({
      url: '../../packageA/pages/statistics/statistics',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const that = this
    const userInfo = app.globalData.userInfo
    let user_id = userInfo.user_id
    // 获取签到记录列表
    const checkinLists = await API.getCheckinRecList(user_id)
    // 获取已创建签到列表
    const createdCheckinLists = await API.getCreatedCheckinList(user_id)
    that.setData({
      checkinLists: checkinLists.data.data,
      createdCheckinLists: createdCheckinLists.data.data
    })
  },
  // 下拉刷新方法
  async onRefresh() {
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    await this.onLoad()
    setTimeout(function () {
      //隐藏loading 提示框
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      // 显示刷新完毕
      wx.showToast({
        title: '刷新成功',
      })
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000)
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
    this.onRefresh()
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