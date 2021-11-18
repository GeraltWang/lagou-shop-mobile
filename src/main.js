import { createApp } from 'vue';
import Vant from 'vant';
import App from './App.vue';
import router from './router';
import store from './store';
import 'amfe-flexible';
import '@/styles/base.css';
import 'vant/lib/index.css';

const app = createApp(App);
app.use(Vant);
app.use(router);
app.use(store);
app.mount('#app');
