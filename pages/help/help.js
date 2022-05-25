// pages/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TipList:[
      {name:'name1',title:'如何查看某个课堂',content:'在主页点击班级模块即可查看'},
      {name:'name2',title:'如何解散创建的课堂',content:'登录创建者账号，点击课堂页面，点击移除对应的班级即可'},
      {name:'name3',title:'每个学生可以绑定几个班级',content:'一个学生只能绑定一个班级，如果想要修改绑定，请联系管理员'},
      {name:'name4',title:'如何创建课堂',content:'输入课堂名称，点击下面的创建按钮即可创建'},
    ]
  },
  // 返回到设置页面
  goback(){
    wx.navigateBack({
      delta: 1,
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