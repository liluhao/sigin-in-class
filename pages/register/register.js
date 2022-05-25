// pages/register/register.js
const API = require('../../utils/ajax.js')
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    phone:'',
    password:'',
    email:'',
    array: ['教师', '学生'],
    value:'请选择身份',
    array1:[],
    value1:'请选择班级',
    class_id:[],
    class_id_index:'',
	},
  Tologin(){
    wx.redirectTo({
      url: '../login/login',
    })
  },
  // 验证表单数据是否合格
  formSubmit(){
    const phone = this.data.phone
    const password = this.data.password
    const email = this.data.email
    const value = this.data.value
    const value1 = this.data.value1
    const class_id = this.data.class_id_index
    const phoneReg = /^1[3456789]\d{9}$/;
    const passwordReg = /^(\w){6,20}$/;
    const emailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
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
    }else if(email==''){
      wx.showToast({
        title: '邮箱不能为空',
        duration:1500,
        icon:'none',
      })
      return false
    }else if(!emailReg.test(email)){
      wx.showToast({
        title: '邮箱格式不正确',
        duration:1500,
        icon:'none',
      })
      return false
    }
    else if(password ==''){
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
    }else if((value!='教师' && value!='学生')||(value=='学生'&&value1=='请选择班级')){
      wx.showToast({
        title: '请完整填写信息',
        duration:1500,
        icon:'none',
      })
      return false
    }
    else {
      console.log(value);
      if(value=='学生'){
        // 学生
        API.register_people(
          {
            phone:phone,
            password:password,
            email:email,
            role:1,
            class_id:class_id
          }
        ).then(
        (success)=>{
          console.log(success);
          if(success.data.code=='200'){
            wx.showToast({
              title: '注册成功',
              duration:1500,
              icon:'none',
            })
            setTimeout(()=>{
              wx.navigateTo({
                url: '../login/login',
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
            title: '注册失败',
            duration:1500,
            icon:'none',
          })
          console.log(error);
        },
        )
      }else{
        // 教师
        API.register_people(
          {
            phone:phone,
            password:password,
            email:email,
            role:0,
          }
        ).then(
        (success)=>{
          console.log(success);
          if(success.data.code=='200'){
            wx.showToast({
              title: '注册成功',
              duration:1500,
              icon:'none',
            })
            setTimeout(()=>{
              wx.navigateTo({
                url: '../login/login',
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
            title: '注册失败',
            duration:1500,
            icon:'none',
          })
          console.log(error);
        },
        )
      }

    }
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
    const _this = this
    API.get_class('register').then(
      (success)=>{
        console.log(success);
        const tmparr = success.data.data.class
        const class_id = []
        const class_name = []
        if(success.data.code=='200'){
          for(let i=0;i<tmparr.length;i++){
            class_id.push(tmparr[i].class_id)
            class_name.push(tmparr[i].class_name)
          };
          _this.setData({
            array1:class_name,
            class_id:class_id
          })
        }
      },
      (error)=>{
        console.log(error);
      }
    )
  },
    // 选择身份函数
    bindPickerChange(e){
      const _this = this
      this.setData({
        value:_this.data.array[e.detail.value]
      })
    },
    bindPickerChange1(e){
      console.log(e);
      const _this = this
      this.setData({
        value1:_this.data.array1[e.detail.value],
        class_id_index:_this.data.class_id[e.detail.value]
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