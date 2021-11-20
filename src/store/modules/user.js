const state = {
  // 用户登录 TOKEN
  token: window.localStorage.getItem('USERTOKEN'),
};
const getters = {};
const mutations = {
  // 设置 TOKEN
  setUser(state, payload) {
    state.token = payload;
    window.localStorage.setItem('USERTOKEN', payload);
  },
};
const actions = {};

export default {
  namespaced: true, state, getters, mutations, actions,
};
