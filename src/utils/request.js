import axios from 'axios';

const requset = axios.create({
  baseURL: 'https://shop.fed.lagou.com/api',
});

export default requset;
