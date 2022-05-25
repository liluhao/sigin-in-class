// pages/me/me.js
const API = require('../../utils/ajax.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUserName: false,
    showUserInfoMask: false,
    showEmailMask: false,
    showPwdMask: false,
    nickName: '',
    realName: '',
    sex: '',
    age: null,
    hobby: '',
    address: '',
    user_id: null,
    email: '',
  },

  // 打开userInfo弹窗
  changeUserInfo(type0) {
    let type = type0.currentTarget.dataset.type
    var that = this
    if (type == "0") {
      that.setData({
        showUserName: !that.data.showUserName
      })
    } else if (type == "1") {
      that.setData({
        showUserInfoMask: !that.data.showUserInfoMask
      })
    } else if (type == "2") {
      that.setData({
        showEmailMask: !that.data.showEmailMask
      })
    } else {
      that.setData({
        showPwdMask: !that.data.showPwdMask
      })
    }
  },
  // 点击遮罩关闭弹窗
  closeMask(type0) {
    var that = this
    let type = type0.currentTarget.dataset.type
    if (type == "0") {
      that.setData({
        showUserName: false
      })
    } else if (type == "1") {
      that.setData({
        showUserInfoMask: false
      })
    } else if (type == "2") {
      that.setData({
        showEmailMask: false
      })
    } else {
      that.setData({
        showPwdMask: false
      })
    }
  },
  // 修改昵称
  async pullNickName(e) {
    if (e.detail.value === '') {
      wx.showToast({
        title: '不能为空',
      })
    }
    // let that = this
    const data = {
      nick_name: e.detail.value.nick_name,
      user_id: this.data.user_id
    }
    const reponse = await API.update_nick_name(data)
    if (reponse.data.code === 200) {
      this.setData({
        nickName: e.detail.value.nick_name
      })
      getApp().globalData.userInfo.nick_name = e.detail.value.nick_name
    } else {
      wx.showToast({
        title: reponse.data.message,
      })
    }
  },
  // 修改用户信息
  async pullUserInfo(e) {
    const info = e.detail.value
    const data = {
      user_id: this.data.user_id,
      real_name: info.realName,
      hobby: info.hobby,
      address: info.address,
      sex: info.radio == '男' ? 1 : 0,
      age: parseInt(info.age)
    }
    const reponse = await API.update_user(data)
    console.log(reponse);
    if (reponse.data.code === 200) {
      this.setData({
        real_name: info.realName,
        sex: info.radio,
        age: parseInt(info.age),
        hobby: info.hobby,
        address: info.address,
      })
      const data = getApp().globalData.userInfo
      data.real_name = info.realName
      data.sex = info.radio == '男' ? 1 : 0
      data.age = parseInt(info.age)
      data.hobby = info.hobby
      data.address = info.address
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
    }else{
      const info = getApp().globalData.userInfo
      this.setData({
        real_name: info.realName,
        sex: info.radio,
        age: parseInt(info.age),
        hobby: info.hobby,
        address: info.address,
      })
      wx.showToast({
        title: '修改失败',
        icon: 'error'
      })
    }
  },
  // 修改邮箱
  async pullEmail(e) {
    const emailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
    const emailInput = e.detail.value.email
    if (emailInput == '') {
      wx.showToast({
        title: '邮箱不能为空',
        duration: 2000,
        icon: 'error',
      })
      return false
    } else if (!(emailReg.test(emailInput))) {
      wx.showToast({
        title: '邮箱格式错误',
        duration: 2000,
        icon: 'error',
      })
      const app = getApp()
      this.setData({
        email: app.globalData.userInfo.email || ''
      })
      return false
    } else {
      const data = {
        user_id: this.data.user_id,
        email: emailInput
      }
      const reponse = await API.update_email(data)
      console.log(reponse);
      if (reponse.data.code === 200) {
        this.setData({
          email: emailInput
        })
        getApp().globalData.userInfo.email = emailInput
        wx.showToast({
          title: '邮箱修改成功',
          duration: 2000,
          icon: 'success',
        })
      }
    }
  },
  // 修改密码
  async pullPwd(e) {
    const pwd = e.detail.value
    const data = {
      user_id: this.data.user_id,
      old_password: pwd.oldPwd,
      new_password: pwd.newPwd,
      new_confirm_password: pwd.confirmNewPwd,
    }
    if (data.new_password !== data.new_confirm_password) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'error'
      })
      return 
    }
    const reponse = await API.update_password(data)
    if (reponse.data.code === 200) {
      wx.showToast({
        title: '修改成功',
      })
    } else {
      wx.showToast({
        title: reponse.data.message,
        icon: 'error'
      })
    }
  },
  // 返回首页
  goback() {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初次需要发送数据请求  获取用户信息
    const userInfo = getApp().globalData.userInfo
    console.log(userInfo);
    this.setData({
      user_id: userInfo.user_id,
      nickName: userInfo.nick_name, // 昵称
      realName: userInfo.real_name, // 姓名
      sex: userInfo.sex, // 性别
      age: userInfo.age === 0 ? null : userInfo.age, // 年龄
      address: userInfo.address,  // 住址
      hobby: userInfo.hobby, // 爱好
      email: userInfo.email
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