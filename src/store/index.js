import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      // 用户登录 TOKEN
      user: window.localStorage.getItem('USERTOKEN'),
      // 购物车数据 存的是 sku id checked count title price stock
      cartList: []
    };
  },
  mutations: {
    // 设置 TOKEN
    setUser(state, payload) {
      state.user = payload;
      window.localStorage.setItem('USERTOKEN', payload);
    },
    // --------设置 购物车数据--------
    // 加购
    addToCart(state, payload) {
      state.cartList.push(payload)
    },
    // 清空数据
    clearCart(state, payload) {
      state.cartList = []
    }
  },
});
