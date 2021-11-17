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

// 获取商品评价 获取评价个数
export const getProductReply = (productId) => request({
  method: 'GET',
  url: `/reply/config/${productId}`,
})

// 根据分类获取评价
export const getReplyByType = (productId, type) => request({
  method: 'GET',
  url: `/reply/list/${productId}`,
  params: {
    type: type
  }
})
