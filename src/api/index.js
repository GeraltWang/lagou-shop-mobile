import request from '@/utils/request.js';

// 请求首页默认数据
export const getFirstPage = () => {
  return request({
    method: 'GET',
    url: '/v2/diy/get_diy/moren',
  })
}
