// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts'
const API = require('../../../utils/ajax.js')
const app = getApp()
let chart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图表数据
    ec: {
      onInit: initChart
    },
    data_info: [{
        number: 1,
        type: '总人数',
        color: '#9b62f9'
      },
      {
        number: 1,
        type: '已签到',
        color: '#429ffc'
      },
      {
        number: 1,
        type: '未签到',
        color: '#fa8d39'
      },
    ],
    classList: ['农业大数据', '物联网应用', '单片机开发'],
    lesson_id_list: [],
    className: '农业大数据',
    // lesson_id:'',
    checkrate: '',
    begin_time :''
  },
  // 返回到上一个页面
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 跳转到签到详情页
  Tosign() {
    wx.navigateTo({
      url: '../../../pages/sign/sign',
    })
  },
  // 切换课程名
  bindPickerChange(e) {
    const index = e.detail.value
    this.setData({
      className: this.data.classList[e.detail.value]
    })
    const _this = this
    // 发送网络请求
    // console.log(this.data.classList,e.detail);
    console.log(index,this.data.lesson_id_list[index]);
    API.Check_in_lessonid(this.data.lesson_id_list[index]).then(
      (success) => {
        console.log(success, '切换课堂名获取的数据');
        if (success.data.code == '200') {
          // 改变全局变量的值
          app.globalData.total = success.data.data.total_list || []
          app.globalData.checkin = success.data.data.checkin_list || []
          app.globalData.nocheckin = success.data.data.not_check_list || []
          app.globalData.checkList[0].number = app.globalData.total.length
          app.globalData.checkList[1].number = app.globalData.checkin.length
          app.globalData.checkList[2].number = app.globalData.nocheckin.length
          app.globalData.start_time = success.data.data.begin_time.substring(11)
          _this.setData({
            data_info: app.globalData.checkList,
            begin_time:app.globalData.start_time
          })
        }else{
          app.globalData.total = []
          app.globalData.checkin = []
          app.globalData.nocheckin = []
          app.globalData.checkList[0].number = app.globalData.total.length
          app.globalData.checkList[1].number = app.globalData.checkin.length
          app.globalData.checkList[2].number = app.globalData.nocheckin.length
          app.globalData.start_time = '00:00'
          _this.setData({
            data_info: app.globalData.checkList,
            begin_time:app.globalData.start_time
          })
        }
      },
      (error) => {
        console.log(error);
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // console.log(data);
    // 获取课堂名称列表和课堂id列表
    const lesson_list = app.globalData.lessonList
    const lesson_name = []
    const lesson_id = []
    // let [total, checkin, nocheckin] = [null, null, null];
    for (let i = 0; i < lesson_list.length; i++) {
      lesson_name.push(lesson_list[i].lesson_name)
      lesson_id.push(lesson_list[i].lesson_id)
    }
    let total = app.globalData.total || []
    let checkin = app.globalData.checkin || []
    let nocheckin = app.globalData.nocheckin || []
    this.data.data_info[0].number = total.length
    this.data.data_info[1].number = checkin.length
    this.data.data_info[2].number = nocheckin.length
    app.globalData.checkList = this.data.data_info
    this.setData({
      data_info: this.data.data_info,
      checkrate: (this.data.data_info[1].number / this.data.data_info[0].number) * 100 || 0,
      classList: lesson_name,
      className: app.globalData.lesson_name || lesson_name[0],
      lesson_id_list: lesson_id,
      begin_time:app.globalData.start_time
    })
    console.log(this.data);
    console.log(app.globalData.checkList);
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
// 初始化图表函数
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(chart)
  // 显示Echarts图表类型信息，可以去Echarts官网复制粘贴
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [{
          value: app.globalData.checkList[1].number || 0,
          name: '已签到'
        },
        {
          value: app.globalData.checkList[2].number || 0,
          name: '未签到'
        },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  chart.setOption(option);
  console.log();
  return chart;
}