// pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iosDialog:false,
    spinShow:false,
  },
  // 返回首页
  goback(){
    wx.navigateBack({
      delta: 1,
    })
  },
  // 显示退出登录弹窗
  showmodal(){
    wx.showModal({
      title: '确认退出吗',
      success(res){
        if(res.confirm){
          // 确认退出
          wx.setStorageSync('token','')
          wx.showToast({
            title: '退出成功',
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '../login/login',
            })
          },1000)
        }else{
          return false
        }
      },
    })
  },
  // 跳转到帮助页面
  Tohelp(){
    wx.navigateTo({
      url: '../help/help',
    })
  },
  // 显示当前的版本
  showVersion(){
    this.setData({
      iosDialog:true,
      spinShow:true
    })
    setTimeout(()=>{
      this.setData({
        spinShow:false,
      })
    },1500)

  },
  // 关闭显示版本的弹窗
  close(){
    this.setData({
      iosDialog:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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