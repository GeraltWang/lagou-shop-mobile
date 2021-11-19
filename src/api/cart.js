import request from '@/utils/request.js';

// 加入购物车
export const addCart = (data) => request({
  method: 'POST',
  url: '/cart/add',
  data
})

// 获取购物车数据
export const getCartList = (page, limit) => request({
  method: 'GET',
  url: '/cart/list',
  params: {
    page,
    limit
  }
})

// 修改商品个数
export const changeItemCount = data => request({
  method: 'POST',
  url: '/cart/num',
  data
})
