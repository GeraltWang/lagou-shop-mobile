import { changeItemCount } from '@/api/cart.js';

const state = {
  // 购物车数据 存的是 sku id checked count title price stock
  cartList: [],
};
const getters = {
  // 筛选选中的商品
  checkedItems: (state) => state.cartList.filter((item) => item.checked === true),
  // 计算 选中商品的 总价
  totalPrice: (state, getters) =>
    // let sum = 0
    // getters.checkedItems.forEach(item => {
    //   sum+=item.price * item.count
    // });
    // return sum.toFixed(2)
    getters.checkedItems.reduce((sum, item) => sum += item.price * item.count, 0).toFixed(2),
  // 全选按钮状态
  checkedAll: (state, getters) => state.cartList.length === getters.checkedItems.length,
};
const mutations = {
  // --------设置 购物车数据--------
  // 加购
  addToCart(state, payload) {
    state.cartList.push(payload);
  },
  // 清空数据
  clearCart(state, payload) {
    state.cartList = [];
  },
  // 商品选中更改
  checkedChange(state, { id, checked }) {
    // 根据传参找到指定数据 并修改状态
    state.cartList.find((item) => item.id === id).checked = checked;
  },
  // 商品个数更改
  countChange(state, { id, count }) {
    state.cartList.find((item) => item.id === id).count = count;
  },
  // 商品全部选中状态更改 (主动操作全选按钮)
  changeAll(state, { checked }) {
    // 为所有商品设置统一的选中状态
    state.cartList.forEach((item) => {
      item.checked = checked;
    });
  },
};
const actions = {
  // 商品个数更改
  async countChange(context, payload) {
    context.commit('countChange', payload);
    // 发送商品个数更改请求
    const { data } = await changeItemCount({
      id: payload.id,
      number: payload.count,
    });
    if (data.status !== 200) {
      return;
    }
    console.log('修改成功');
  },
};

export default {
  namespaced: true, state, getters, mutations, actions,
};
