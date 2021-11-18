import axios from 'axios';
import store from '@/store';
// import router from '@/router'

const requset = axios.create({
  baseURL: 'https://shop.fed.lagou.com/api',
});

// 在请求拦截器中进行token 设置
requset.interceptors.request.use((config) => {
  // 获取token
  const { user } = store.state;
  if (user) {
    config.headers.Authorization = `Bearer ${user}`;
  }
  return config;
});

// 响应拦截器 进行失败处理
requset.interceptors.response.use((config) => {
  console.log(config.data);
  // 响应码为410000 未登录 处理
  if (config.data.status === 410000) {
    console.log('未登录');
  }
  return config;
});

export default requset;
