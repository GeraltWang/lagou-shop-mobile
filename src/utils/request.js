import axios from 'axios';
import store from '@/store';

const requset = axios.create({
  baseURL: 'https://shop.fed.lagou.com/api',
});

// 在请求拦截器中进行token 设置
requset.interceptors.request.use(config => {
  // 获取token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = 'Bearer ' + user
  }
  return config
})

export default requset;
