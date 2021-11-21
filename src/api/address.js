import request from '@/utils/request.js';

// 获取省市区列表
export const getCityList = () => request({
  method: 'GET',
  url: '/city_list'
})
