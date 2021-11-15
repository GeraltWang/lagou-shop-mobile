import request from '@/utils/request.js';

// 获取商品列表
export const getProductList = (params) => request({
  method: 'GET',
  url: '/products',
  params,
});

// 获取商品详情
export const getProductDetail = (productId) => request({
  method: 'GET',
  url: `/product/detail/${productId}`,
});
