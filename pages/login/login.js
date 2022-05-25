// pages/login/login.js
const API = require('../../utils/ajax.js')
let app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    phone:'15090388081',
    email:'2921455327@qq.com',
    password:'123456',
	},

    // 正则匹配验证
    formSubmit(){
      const phone = this.data.phone
      const password = this.data.password
      const phoneReg = /^1[3456789]\d{9}$/;
      const passwordReg = /^(\w){6,20}$/;
      if(phone==''){
        wx.showToast({
          title: '手机号不能为空',
          duration:1500,
          icon:'none',
        })
        return false
      }else if(!phoneReg.test(phone)){
        wx.showToast({
          title: '手机号格式不正确',
          // 延迟时间
          duration:1500,
          icon:'none',
        })
        return false
      }else if(password ==''){
        wx.showToast({
          title: '密码不能为空',
          duration:1500,
          icon:'none',
        })
        return false
      }else if(!passwordReg.test(password)){
        wx.showToast({
          title: '密码长度6~20且只能由字母，数字，下划线组成',
          duration:1500,
          icon:'none',
        })
        return false
      }else {
        // 发送网络请求
        API.login_pepple(
          {
            phone:phone,
            password:password,
          }
        ).then(
          (success)=>{
            console.log(success,'登录返回的信息');
            
            if(success.data.code=='200'){
              // 赋值
              app.globalData.userInfo = success.data.data.user
              app.globalData.token = success.data.data.token
              wx.setStorageSync('token', success.data.data.token)
              wx.showToast({
                title: '登录成功',
                duration:1500,
                icon:'none',
              })
              // 跳转
              setTimeout(()=>{
                wx.navigateTo({
                  url: '../index/index',
                })
              },1000)
            }else{
              wx.showToast({
                title: success.data.message,
                duration:1500,
                icon:'none',
              })
            }
          },
          (error)=>{
            wx.showToast({
              title: '登录失败',
              duration:1500,
              icon:'none',
            })
            console.log(error);
          }
        )
        // 获取班级id和课程列表
        API.get_class('register').then(
          (success)=>{
            const tmparr = success.data.data.class
            const class_id = []
            const class_name = []
            if(success.data.code=='200'){
              for(let i=0;i<tmparr.length;i++){
                class_id.push(tmparr[i].class_id)
                class_name.push(tmparr[i].class_name)
              };
              app.globalData.class_id = class_id
              app.globalData.class_name_list = class_name
            }
          },
          (error)=>{
            console.log(error);
          }
        )
      
      }
    },
    // 注册账号
    Toregister(){
      wx.redirectTo({
        url: '../register/register',
      })
    },
    // 忘记密码
    ToFindpwd(){
      wx.navigateTo({
        url: '../FindPwd/FindPwd',
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