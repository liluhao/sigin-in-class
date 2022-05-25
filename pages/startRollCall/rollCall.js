// pages/startRollCall/rollCall.js
const API = require('../../utils/ajax.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrayClass: [],
    arrayId: [],
    classId: -1,
    arrayTime: ['5min', '10min', '30min', '60min'],
    sign_Time: '',
    sign_Class: '',
    QR_code: true,
    Sign_in_code: false,
    showMask: false,
    QR_Info: '',
    checkin_data: null,
    longitude: null,
    latitude: null,
    imagePath: null,
  },
  // 返回
  goback() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  // 选择二维码签到
  selectQR() {
    console.log('二维码签到');
    let that = this
    that.setData({
      QR_code: true,
      Sign_in_code: false
    })
  },
  // 选择签到码签到
  selectSign() {
    console.log('签到码签到');
    let that = this
    that.setData({
      QR_code: false,
      Sign_in_code: true
    })
  },
  // 选择签到时间
  selectSign_time: function (e) {
    let that = this
    that.setData({
      sign_Time: that.data.arrayTime[e.detail.value]
    })
  },
  // 选择上课名称（ 包含班级）
  selectSign_class: function (e) {
    let that = this
    that.setData({
      classId: that.data.arrayId[e.detail.value],
      sign_Class: that.data.arrayClass[e.detail.value]
    })
  },
  // 下载到本地
  async downLoadToLocal(url) {
    let that = this
    wx.downloadFile({
      url: url,
      success(res) {
        if (res.statusCode === 200) {
          that.setData({
            imagePath: res.tempFilePath
          })
        }
      },
      fail(err) {
        console.log(err);
      },
    })
  },
  // 保存到本地
  saveToLocal() {
    const qrContainer = this.selectComponent('#myQrcode')
    // console.log(qrContainer.getQrFile()); // url
    wx.saveImageToPhotosAlbum({
      filePath: qrContainer.getQrFile(),
      success() {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail cancel") return
        else if (err.errMsg) {
          wx.showModal({
            title: '提示',
            content: '您好,请先授权，在保存此图片。',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(settingData) {
                    if (settingData.authSetting['scope.writePhotosAlbum']) {
                      wx.saveImageToPhotosAlbum({
                        filePath: qrContainer.getQrFile(),
                        success(res) {
                          wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                          })
                        }
                      })
                    } else {
                      wx.showModal({
                        title: '温馨提示',
                        content: '授权失败，请稍后重新获取',
                        showCancel: false,
                      })
                    }
                  }
                })
              }
            }
          })
        }
        // wx.showToast({
        //   title: '保存失败',
        //   icon: 'error',
        //   duration: 2000
        // })
      }
    })
  },
  // 分享图片
  shareImage() {
    const qrContainer = this.selectComponent('#myQrcode')
    wx.shareFileMessage
  },
  // 开始签到
  async startCheck() {
    let that = this
    if (!that.data.sign_Class) {
      wx.showToast({
        title: '请选择上课班级',
        icon: 'error'
      })
    } else if (!that.data.sign_Time) {
      wx.showToast({
        title: '请选择签到时长',
        icon: 'error'
      })
    } else {
      let timer;
      if (timer) {
        wx.showToast({
          title: '您创建的一个签到尚未结束',
        })
      }
      timer = setTimeout(() => {
        clearTimeout(timer)
      }, parseInt(that.data.sign_Time) * 1000)
      let checkCode = Math.floor(1000000 - Math.random() * (1000000 - 100000)).toString()
      // 获取老师所在地的经纬度
      that.setData({
        QR_Info: {
          lesson_id: that.data.classId,
          duration: parseInt(that.data.sign_Time),
          creator_id: app.globalData.userInfo.user_id,
          checkin_code: checkCode,
          longitude: `${that.data.longitude}`,
          latitude: `${that.data.latitude}`
        }
      })
      console.log(that.data.QR_Info);
      const reponse = await API.createCheckin(that.data.QR_Info)
      console.log(reponse);
      // 如果勾选的是二维码
      if (that.data.QR_code) {
        if (reponse.data.code === 200) {
          console.log(reponse.data.data);
          // 二维码签到
          that.setData({
            showMask: true,
            checkin_data: `{"checkCode": "${checkCode}", "checkin_id": "${reponse.data.data}"}`,
          })
        }
      } else {
        // 签到码签到
        if (reponse.data.code === 200) {
          console.log(reponse.data.data);
          wx.showToast({
            title: checkCode,
            duration: 3000
          })
        }
      }
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    const lessonList = app.globalData.lessonList || []
    const lesson_id = []
    const lesson_name = []
    for (let i = 0; i < lessonList.length; i++) {
      lesson_name.push(lessonList[i].lesson_name)
      lesson_id.push(lessonList[i].lesson_id)
    }
    that.setData({
      arrayClass: lesson_name,
      arrayId: lesson_id
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          "latitude": `${res.latitude}`,
          "longitude": `${res.longitude}`
        })
        console.log(that.data.latitude, that.data.longitude);
      },
      fail(err) {
        wx.showToast({
          title: err,
        })
      }
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