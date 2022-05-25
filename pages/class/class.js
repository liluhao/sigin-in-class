// pages/class/class.js
const API = require('../../utils/ajax.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:'tab1',
    // 已创建课堂列表
    classroomList_created:[
    ],
    dialog:false,
    dialog1:false,
    isEdit_classroom_name:'',
    isEdit_classname:[],
    classList:[],
    classList_checked:[],
    classList_checked1:[],
    lesson_id:'',
    role:''
  },
  // 切换已创建
  created(){
    // 跳转的时候已经请求过了，并且保存在了全局变量中，此处直接调用即可
    // 处理时间
    const lesson_List = app.globalData.lessonList
    if(lesson_List){
      for(let i=0;i<lesson_List.length;i++){
        lesson_List[i].created_at = lesson_List[i].created_at.substring(0,10)+' '+lesson_List[i].created_at.substring(11,16)
      }
    }
    this.setData({
      classroomList_created:lesson_List
    })
  },
  // 切换已加入
  joined(){
    this.setData({
      current:'tab1'
    })
    const _this = this
    // if(this.data.role==1){
    // 请求已加入课表的链接,通过class_id
    console.log(app.globalData.userInfo.class_id);
    API.join_classroom(app.globalData.userInfo.class_id).then(
      (success)=>{
        console.log(success,'已加入课程');
        if(success.data.code=='200'){
          const join_List = success.data.data
          for(let i=0;i<join_List.length;i++){
            join_List[i].created_at = join_List[i].created_at.substring(0,10)+' '+join_List[i].created_at.substring(11,16)
          }
          _this.setData({
            classroomList_created:join_List
          })
        }else{
          this.setData({
            classroomList_created:[]
          })
        }
      },
      (error)=>{
        console.log(error.data.message);
      }
    )
    // } 
    _this.setData({
      current:'tab2'
    })
  },
  // 全选班级
  checkall(){
    this.setData({
      classList_checked:this.data.classList,
      classList_checked1:app.globalData.class_id
    })
  },
  // 全不选班级
  nocheckall(){
    this.setData({
      classList_checked:[],
      classList_checked1:[]
    })
  },
  // 收集添加班级的数据
  handleClassChange({ detail = {} }){
    const item_id = app.globalData.class_id
    const item_name_list = app.globalData.class_name_list
    // 收集班级姓名，展示到页面
    const index = this.data.classList_checked.indexOf(detail.value);
    index === -1 ? this.data.classList_checked.push(detail.value) : this.data.classList_checked.splice(index, 1);
    this.setData({
      classList_checked: this.data.classList_checked
    });
    console.log(this.data.classList_checked);
    // 收集班级id，发送到后端
    const index1 = item_name_list.indexOf(detail.value)
    const index2 = this.data.classList_checked1.indexOf(item_id[index1])
    index2 === -1 ? this.data.classList_checked1.push(item_id[index1]) : this.data.classList_checked1.splice(index, 1);
    this.setData({
      classList_checked1: this.data.classList_checked1
    });
    console.log(this.data.classList_checked1);
  },
    // 关闭选择班级入口
    close_class(){
    // 封装对象
    const class_name_list = []
    this.data.classList_checked.forEach((e,index)=>{
      // 填充数组
      class_name_list[index]= e
    })
      this.setData({
        dialog1:false,
        // 将选择的班级名称展示到页面上
        isEdit_classname:class_name_list
      })
    },
  // 去点名
  Torollcall(){
    wx.redirectTo({
      url: '../startRollCall/rollCall',
    })
  },
  // 编辑
  isEdit({ currentTarget }){
  // 给课堂名和班级名赋值
    this.setData({
      isEdit_classroom_name:currentTarget.dataset.classroom_name,
      isEdit_classname:currentTarget.dataset.classname||this.data.classList_checked,
      dialog:true,
      lesson_id:currentTarget.dataset.index
    })
    console.log('111');
  },
  // 编辑班级
  switch_class(){
    this.setData({
      dialog1:true,
    })
  },
  // 取消编辑
  close(){
    this.setData({
      dialog:false,
    })
  },
  // 确认修改课堂信息
  changeclassroom(){
    // 封装对象
    const class_name_list = []
    this.data.classList_checked.forEach((e,index)=>{
      class_name_list[index] = e
    })
    // 获取对应index
    const index = this.data.lesson_id
    // 修改数据
    this.data.classroomList_created[index].class_name_list = class_name_list
    this.data.classroomList_created[index].lesson_name = this.data.isEdit_classroom_name
    // 调用编辑的接口
    // 向后端发送请求
    API.Edit_classroom(
      {
        lesson_id:app.globalData.lessonList[index].lesson_id,
        lesson_name:this.data.isEdit_classroom_name,
        class_id_list:this.data.classList_checked1.join(',')
      }
    ).then(
      (success)=>{
        console.log(success);
      },
      (error)=>{
        console.log(error);
      }
    )
    this.setData({
      classroomList_created:this.data.classroomList_created,
      dialog:false
    })
    // console.log(this.data.lesson_id);
    // console.log(class_name_list);
    // console.log(this.data.classList_checked);
  },
  // 删除某节课堂
  del_classroom({ currentTarget }){
    const _this = this
    const index = currentTarget.dataset.index
    console.log(app.globalData.lessonList[index].lesson_id,app.globalData.userInfo.user_id);
    wx.showModal({
      title: '确认移除该课程',
      success({ confirm }){
        if(confirm){
          // 调用移除课堂的接口
          API.delete_classroom(app.globalData.lessonList[index].lesson_id,app.globalData.userInfo.user_id).then(
            (success)=>{
              console.log(success);
              if(success.data.code=='200'){
                wx.showToast({
                  title: '移除成功',
                  icon:'none'
                })
                // 移除课堂
                setTimeout(()=>{
                  _this.data.classroomList_created.splice(index,1)
                  _this.setData({
                    classroomList_created:_this.data.classroomList_created
                  })
                },500)
              }
            },
            (error)=>{
              console.log(error);
            }
          )
        }else{
          wx.showToast({
            title: '取消',
            icon:'none'
          })
        }
      }
    })
  
  },
  // 切换标签
  handleChange({ detail }){
    this.setData({
      current:detail.key
    })
  },
  // 返回首页
  goback(){
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 请求已创建课堂列表
    API.created_classroom(app.globalData.userInfo.user_id).then(
      (success)=>{
        console.log(success,'已创建课堂');
        app.globalData.lessonList = success.data.data
      },
      (error)=>{
        console.log(error);
      },
    )
    const lesson_List = app.globalData.lessonList
    if(lesson_List){
      for(let i=0;i<lesson_List.length;i++){
        lesson_List[i].created_at = lesson_List[i].created_at.substring(0,10)+' '+lesson_List[i].created_at.substring(11,16)
      }
    }
    
    // 区分老师和学生
    const role = app.globalData.userInfo.role
    // 给对应的变量赋值
    this.setData({
      classroomList_created:lesson_List,
      role:role,
      classList:app.globalData.class_name_list
    })
    console.log(this.data.classList,'classList');
  },
  // 增加下拉刷新功能
  onRefresh(){
    const _this = this
    //导航条加载动画
    wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: 'Loading...',
    })
    console.log(this.data.current);
    if(this.data.current=='tab1'){
      this.onLoad()
    }else{
      // 请求已加入的列表
      API.join_classroom(app.globalData.userInfo.class_id).then(
        (success)=>{
          console.log(success,'已加入课程');
          if(success.data.code=='200'){
            _this.setData({
              classroomList_created:success.data.data
            })
          }else{
            this.setData({
              classroomList_created:[]
            })
          }
        },
        (error)=>{
          console.log(error.data.message);
        }
      )
    }
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
  async onPullDownRefresh() {
    await this.onRefresh()
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

  },
})