// pages/addclassroom/addclassroom.js
// 引入函数
const API = require('../../utils/ajax.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialog:false,
    classList:[],
    classList_checked:[],
    classroom:'',
    classList_checked1:[]
  },
  // 返回到上一个页面
  goback(){
    wx.navigateBack({
      delta:1,
    })
  },
  // 选择加入到课堂的教室
  switch_class(){
    this.setData({
      dialog:true
    })
  },
  // 关闭添加教室的弹窗
  close(){
    this.setData({
      dialog:false,
    })
  },
  // 全选班级
  checkall(){
    // console.log(this.data.classList);
    this.setData({
      classList_checked:this.data.classList,
      classList_checked1:app.globalData.class_id
    })
  },
  // 全不选班级
  nocheckall(){
    this.setData({
      classList_checked:[],
      classList_checked1:[],
    })
  },
  // 收集添加班级的数据
  handleClassChange({detail}){
    const class_id = app.globalData.class_id
    const class_name_list = app.globalData.class_name_list
    const index = class_name_list.indexOf(detail.value)
    // 获得item_id的列表
    const index1 = this.data.classList_checked1.indexOf(class_id[index]);
        index1 === -1 ? this.data.classList_checked1.push(class_id[index]) : this.data.classList_checked1.splice(index1, 1);
        this.setData({
          classList_checked1: this.data.classList_checked1
        });
        console.log(this.data.classList_checked1);
    // 获得value值的列表
    const index2 = this.data.classList_checked.indexOf(detail.value);
    index2 === -1 ? this.data.classList_checked.push(detail.value) : this.data.classList_checked.splice(index2, 1);
    this.setData({
      classList_checked: this.data.classList_checked
    });
    console.log(this.data.classList_checked);
  },
  // 提交表单，判断数据是否完整
  AddClass(){
    if(!this.data.classroom||!this.data.classList_checked.length){
      wx.showToast({
        title: '请完整填写信息',
        icon:'none'
      })
    }else{
      const _this = this
      console.log(_this.data.classroom);
      // 调用创建课堂的接口
      API.create_classroom(
        {
          lesson_name: _this.data.classroom,
          class_list:this.data.classList_checked1.join(','),
          user_id:app.globalData.userInfo.user_id
        }
      ).then(
        (success)=>{
          console.log(success);
          if(success.data.code=='200'){
            wx.showToast({
              title: '创建成功',
              icon:'none'
            })
          }
        },
        (error)=>{
          console.log(error);
        }
      )
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      classList:app.globalData.class_name_list
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