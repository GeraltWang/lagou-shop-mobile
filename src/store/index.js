import { createStore } from 'vuex';

// 引入封装的状态模块
import user from './modules/user';
import cart from './modules/cart';

export default createStore({
  // 添加 modules
  modules: {
    user,
    cart,
  },
});
