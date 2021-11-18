import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      user: window.localStorage.getItem('USERTOKEN'),
    };
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      window.localStorage.setItem('USERTOKEN', payload);
    },
  },
});
