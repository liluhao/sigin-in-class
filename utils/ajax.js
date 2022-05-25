// 配置基础接口地址
const BASE_URL = "http://localhost:8080/api"
// 封装请求函数
// 请求form表单类数据
const Ajax = (url,method,data,header)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url,
      method,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : '',
        // "token":wx.getStorageInfoSync('token')
      },
      data,
      success(res){
        resolve(res)
      },
      fail(err){
        console.log('请求错误');
        reject(err)
      },
    })
  })
}
const AjaxJSON = (url,method,data,header)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url,
      method,
      header: {
        "Content-Type": "application/json",
        // "authorization":"bearer"+wx.getStorageSync('token')
      },
      data,
      success(res){
        resolve(res)
      },
      fail(err){
        console.log('请求错误');
        reject(err)
      },
    })
  })
}
// 暴露函数
module.exports = {
  // 注册函数
  register_people(data){
    return Ajax(BASE_URL+'/auth/register','post',data)
  },
  // 分页获取班级列表
  get_class(logo){
    return Ajax(BASE_URL+`/class?logo=${logo}`,'get')
  },
  // 登录函数
  login_pepple(data){
    return Ajax(BASE_URL+'/auth/login','post',data)
  },
  // 创建课堂
  create_classroom(data){
    return Ajax(BASE_URL+'/lesson','post',data)
  },
  // 获取已创建课堂列表
  created_classroom(id){
    return Ajax(BASE_URL+`/lesson/user?user_id=${id}`,'get')
  },
  // 获取已加入课堂列表
  join_classroom(id){
    return Ajax(BASE_URL+`/lesson/join?class_id=${id}`,'get')
  },
  // 编辑班级
  Edit_classroom(data){
    return Ajax(BASE_URL+'/lesson/editor','put',data)
  },
  // 移除班级
  delete_classroom(lesson_id,lesson_creator){
    return Ajax(BASE_URL+`/lesson/del?lesson_id=${lesson_id}&lesson_creator=${lesson_creator}`,'delete')
  },
  // 找回密码
  findpwd(data){
    return Ajax(BASE_URL+'/auth/update-forget-password','put',data)
  },
  // 获取签到详情
  checked_in(checkin_id){
    return Ajax(BASE_URL+`/checkin/getCheckinDetailscheckin_id?checkin_id=${checkin_id}`,'get')
  },
  // 获取课堂签到详情
  Check_in_lessonid(lesson_id){
    return Ajax(BASE_URL+`/checkin/getLessonCheckinDetails?lesson_id=${lesson_id}`,'get')
  },
  // 获取签到记录列表
  getCheckinRecList(user_id){
    return Ajax(BASE_URL + `/checkin/getCheckinRecList?user_id=${user_id}`,'get')
  },
  // 获取已创建签到列表
  getCreatedCheckinList(user_id){
    return Ajax(BASE_URL + `/checkin/getCreatedCheckinList?user_id=${user_id}`,'get')
  },
  // 老师发起签到
  createCheckin(data){
    return AjaxJSON(BASE_URL + '/checkin/createCheckin','post',data)
  },
  // 学生签到
  checkin(data){
    return AjaxJSON(BASE_URL + '/checkin','post',data)
  },
  // 更新用户信息
  update_user(data){
    return Ajax(BASE_URL + '/user/update-user','put',data)
  },
  // 用户修改邮箱
  update_email(data){
    return Ajax(BASE_URL + '/user/update-email','put',data)
  },
  // 用户修改昵称
  update_nick_name(data){
    return Ajax(BASE_URL + '/user/update-nick-name','put',data)
  },
  // 用户修改密码
  update_password(data){
    return Ajax(BASE_URL + '/user/update-password','put',data)
  },
  checked_in(lesson_id){
    return Ajax(BASE_URL+`/checkin/getCheckinDetails?checkin_id=${lesson_id}`,'get')
  }
}