// index.js
const filter = require('../../utils/routerfilter.js')
// 获取应用实例
const app = getApp()
const API = require('../../utils/ajax.js')
Page(
  filter.loginCheck({
    data: {
      checkin_id: null,
      user_id: null,
      checkWay: false,
      showCode: false,
      checkCode: 0,
      studentLatitude: null,
      studentLongtitude: null,
    },
    // 关闭选项
    close() {
      let that = this
      that.setData({
        checkWay: false
      })
      console.log(this.data.checkWay);
    },
    // 打开选项
    showWay() {
      let that = this
      that.setData({
        checkWay: !that.data.checkWay
      })
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          that.setData({
            studentLatitude: res.latitude,
            studentLongtitude: res.longitude
          })
        },
        fail(err) {
          wx.showToast({
            title: err,
          })
        }
      })
    },
    // 跳转到班级页面
    Toclass() {
      wx.navigateTo({
        url: '../class/class?lesson_list=' + app.globalData.lessonList,
      })
    },
    // 跳转到开始点名页面
    ToRollCall() {
      wx.navigateTo({
        url: '../startRollCall/rollCall',
      })
    },
    // 跳转到创建课堂页面
    ToADDclassroom() {
      wx.navigateTo({
        url: '../addclassroom/addclassroom',
      })
    },
    // 跳转到数据统计页面
    Tostatistics() {
      // 根据是否存在app.globalData.lesson_name进行判断获取哪个课堂名的数据
      if(app.globalData.lesson_name){
        app.globalData.lessonList.forEach((e,index)=>{
          if(e.lesson_name==app.globalData.lesson_name){
            API.Check_in_lessonid(app.globalData.lessonList[index].lesson_id).then(
              (success) => {
                console.log(success, '默认的数据统计课堂');
                if (success.statusCode == '200') {
                  // 存储到全局变量中
                  app.globalData.total = success.data.data.total_list
                  app.globalData.checkin = success.data.data.checkin_list
                  app.globalData.nocheckin = success.data.data.not_check_list
                  app.globalData.start_time = success.data.data.begin_time.substring(11)
                }
              },
              (error) => {
                console.log(error);
              }
            )
            return
          }
        })
      }else{
        API.Check_in_lessonid(app.globalData.lessonList[0].lesson_id).then(
          (success) => {
            console.log(success, '默认的数据统计课堂');
            if (success.statusCode == '200') {
              // 存储到全局变量中
              app.globalData.total = success.data.data.total_list
              app.globalData.checkin = success.data.data.checkin_list
              app.globalData.nocheckin = success.data.data.not_check_list
              app.globalData.start_time = success.data.data.begin_time.substring(11)
            }
          },
          (error) => {
            console.log(error);
          }
        )
      }
    
      wx.navigateTo({
        url: '../../packageA/pages/statistics/statistics'
      })
    },
    // 跳转到个人页面
    Tome() {
      wx.navigateTo({
        url: '../me/me',
      })
    },
    // 跳转到设置页面
    Tosetup() {
      wx.navigateTo({
        url: '../setup/setup',
      })
    },
    // 跳转到签到页面
    ToRecord() {
      wx.navigateTo({
        url: '../record/record',
      })
    },

    // 关闭签到码遮罩
    close_codeMask() {
      let that = this
      that.setData({
        showCode: false,
        checkWay: false
      })
    },

    // 扫一扫
    scan() {
      let that = this
      wx.scanCode({
        async success(res0) {
          const res = JSON.parse(res0.result)
          console.log(res);
          const userInfo = app.globalData.userInfo
          let info = {
            checkin_id: res.checkin_id, // 签到id
            user_id: userInfo.user_id, // 学生id
            checkin_code: res.checkCode, // 签到码
            longitude: `${that.data.studentLongtitude}`, // 经度
            latitude: `${that.data.studentLatitude}`, // 纬度
          }
          console.log(info);
          let reponse = await API.checkin(info)
          console.log(reponse);
          if (reponse.data.code === 200 && reponse.data.data === 1) {
            wx.showToast({
              title: '签到成功',
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: '签到失败',
              icon: 'error'
            })
          }
        },
      })

    },
    // 显示输入
    showCode() {
      this.setData({
        showCode: true
      })
    },
    // 签到码
    async code() {
      let that = this
      if (!that.data.checkCode) {
        wx.showToast({
          title: '签到码不能为空',
        })
      }
      const user_id = app.globalData.userInfo.user_id
      // 获取该学生对应的课程当中是否含有正在进行的签到
      console.log(user_id);
      let rep = await API.getCheckinRecList(user_id)
      console.log(rep);
      if (rep.data.code === 200) {
        const data = rep.data.data[0]
        console.log(rep.data.data[0]);
        if (data.checkin_state === 1) {
          if (data.state === 1) {
            wx.showToast({
              title: '重复签到',
              icon: 'error'
            })
            return
          } else {
            that.setData({
              checkin_id: data.checkin_id
            })
          }
        }
      } else {
        wx.showToast({
          title: '你没有正在签到的课程哦',
        })
        return
      }
      let info = {
        // 签到id
        checkin_id: that.data.checkin_id,
        // 学生id
        user_id: that.data.user_id,
        // 签到码
        checkin_code: `${that.data.checkCode}`,
        // 经度
        longitude: `${that.data.studentLongtitude}`,
        // 纬度
        latitude: `${that.data.studentLatitude}`,
      }
      let reponse = await API.checkin(info)
      if (reponse.data.code === 200 && reponse.data.data === 1) {
        wx.showToast({
          title: '签到成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: '签到失败',
          icon: 'error'
        })
      }
    },
    // 获取输入验证码
    getCode(e) {
      let that = this
      that.setData({
        checkCode: e.detail.value
      })
    },

    onLoad() {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
      let user_id = app.globalData.userInfo.user_id
      // 请求已创建课堂列表
      API.created_classroom(user_id).then(
        (success) => {
          console.log(success, '已创建课堂');
          app.globalData.lessonList = success.data.data
        },
        (error) => {
          console.log(error);
        },
      )
      this.setData({
        user_id: user_id
      })
    },
    // 监听页面显示
    onShow() {

    },
  }))