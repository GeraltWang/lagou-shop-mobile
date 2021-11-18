import request from '@/utils/request.js';

// 获取用户验证码,避免重复发送
export const getVerifyCode = () => request({
  method: 'GET',
  url: '/verify_code'
})

// 获取短信验证码
export const sendVerifyCode = (data) => request({
  method: 'POST',
  url: '/register/verify',
  data
})

// 密码登录请求
export const loginByPassword = (data) => request({
  method: 'POST',
  url: '/login',
  data
})

// 验证码登录请求
export const loginByCaptcha = (data) => request({
  method: 'POST',
  url: '/login/mobile',
  data
})

// logo 图
export const getLogo = () => request({
  method: 'GET',
  url: '/wechat/get_logo'
})
