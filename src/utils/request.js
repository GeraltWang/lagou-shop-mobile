import axios from 'axios';

const requset = axios.create({
  baseURL: 'http://shop.fed.lagou.com/api',
});

export default requset;
