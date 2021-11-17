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
