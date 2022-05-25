// utils/filter.js
const app = getApp()

function loginCheck(pageObj) {
  if (pageObj.onLoad) {
    let _onLoad = pageObj.onLoad;
    // 使用onLoad的话需要传递options
    pageObj.onLoad = function (options) {
      if (app.globalData.userInfo) {
        // 获取当前页面
        let currentInstance = getPageInstance();
        _onLoad.call(currentInstance, options);
      } else {
        wx.showToast({
          title: '未登录,即将跳转',
          icon: 'none'
        })
        setTimeout(() => {
          //跳转到登录页
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }, 2000);

      }
    }
  }
  return pageObj;
}

// 获取当前页面    
function getPageInstance() {
  var pages = getCurrentPages();
  // console.log(pages[pages.length - 1]);
  return pages[pages.length - 1];
}

exports.loginCheck = loginCheck;