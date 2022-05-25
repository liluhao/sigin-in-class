// pages/FindPwd/FindPwd.js
const API = require('../../utils/ajax.js')
Page({

	/**
	 * 页面的初始数据
	 */
  data : {
    List:[
      {title:'开始',status:'process',icon:'right'},
      {title:'手机号',status:'finish',icon:''},
      {title:'邮箱',status:'finish',icon:''},
      {title:'完成',status:'finish',icon:''}
		],
		phone:'',
    email:'',
    iosDialog:false
},
goback(){
	wx.navigateBack({
		delta: 1,
	})
},
// 找回密码的进度
// 找回账号
  twosteps({ detail:{detail:{value}}}){
    const phoneReg = /^1[3456789]\d{9}$/;
    if(phoneReg.test(value)){
      this.data.List[1].status = 'process'
      this.data.List[1].icon = 'right'
      this.setData({
        List:this.data.List,
        phone:value
      })
    }else{
      this.data.List[1].status = 'finish'
      this.data.List[1].icon = ''
      this.setData({
        List:this.data.List
      })
    }
  },
// 找回邮箱
threesteps({ detail:{detail:{value}}}){
  const emailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
  if(emailReg.test(value)){
    this.data.List[2].status = 'process'
    this.data.List[2].icon = 'right'
    this.setData({
      List:this.data.List,
      email:value
    })
  }else{
    this.data.List[2].status = 'finish'
    this.data.List[2].icon = ''
    this.setData({
      List:this.data.List
    })
  }
},
// 提交表单
  repwd(){
    const phoneReg = /^1[3456789]\d{9}$/;
    const emailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
    if(phoneReg.test(this.data.phone) && emailReg.test(this.data.email)){
      API.findpwd({
        phone:this.data.phone,
        email:this.data.email
      }).then(
        (success)=>{
          console.log(success);
          if(success.statusCode =='200'){
            this.data.List[3].status = 'process'
            this.data.List[3].icon = 'right'
            this.setData({
              List:this.data.List,
              iosDialog:true,
            })
          }
        },
        (error)=>{
          console.log(error);
        }
      )
    }else{
      wx.showToast({
        title: '填写信息是否有误，请检查',
        icon:'none'
      })
    }
   
  },
  // 关闭弹窗
  close(){
    this.setData({
      iosDialog:false
    })
  },
// handleClick () {
//     const addCurrent = this.data.current + 1;
//     const current = addCurrent > 2 ? 0 : addCurrent;
//     this.setData({
//         'current' : current
//     })
// },

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