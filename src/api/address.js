import request from '@/utils/request.js';

// 获取省市区列表
export const getCityList = () => request({
  method: 'GET',
  url: '/city_list',
});

// 新增/编辑 地址
export const addOrEditAddress = (data) => request({
  method: 'POST',
  url: '/address/edit',
  data,
});
