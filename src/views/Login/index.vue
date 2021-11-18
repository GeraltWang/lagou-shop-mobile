<template>
  <van-form @submit="onSubmit">
    <img :src="state.logo">
    <van-cell-group inset>
      <van-field
        v-if="state.isPswd"
        v-model="state.username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        clearable
        center
        :formatter="formatter"
        :rules="[{ patternName, message: '请输入正确用户名' }, { required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-else
        v-model="state.username"
        name="手机号"
        label="手机号"
        placeholder="手机号"
        clearable
        center
        :formatter="formatter"
        :rules="[{ patternPhone, message: '请输入正确手机号' }, { required: true, message: '请填写手机号' }]"
      />
      <van-field
        v-model="state.password"
        v-if="state.isPswd"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        clearable
        center
        :formatter="formatter"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="state.captcha"
        v-else
        name="验证码"
        label="短信验证码"
        placeholder="短信验证码"
        clearable
        center
        :formatter="formatter"
        :rules="[{ required: true, message: '请填写验证码' }]"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="sendCaptcha"
            :disabled="state.isSent"
          >
            <template #default>
              <span v-if="!state.isSent">发送验证码</span>
              <span v-else>已发送 ({{ state.countDown.seconds }})</span>
            </template>
          </van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div class="btn-group">
      <van-button
        round
        block
        color="linear-gradient(to right, #5433FF, #20BDFF, #A5FECB)"
        native-type="submit"
      >
        登录
      </van-button>
      <van-button
        round
        block
        type="primary"
        plain
        @click="changeMode"
      >
        {{ state.changeText }}
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import { computed, reactive } from '@vue/reactivity';
import { useCountDown } from '@vant/use';
import { Toast } from 'vant';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import {
  getVerifyCode, sendVerifyCode, loginByPassword, loginByCaptcha, getLogo,
} from '@/api/user.js';

// Vuex Store
const store = useStore();

// VueRouter
const router = useRouter();
const route = useRoute();

// ---页面数据---
const state = reactive({
  loginMode: 'password', // 登录模式 密码 验证码 captcha
  isPswd: computed(() => state.loginMode === 'password'),
  changeText: computed(() => (state.isPswd ? '手机号登录' : '密码登录')),
  username: '',
  password: '',
  captcha: '',
  isSent: false,
  countDown: null,
  logo: '',
});
const patternName = /\w+/;
const patternPhone = /1\d{10}/;

// 验证码
const sendCaptcha = async () => {
  // 手机号规则校验
  if (!/^1\d{10}$/.test(state.username)) {
    return Toast({
      message: '请输入正确手机号',
      position: 'top',
    });
  }
  // 请求验证码 key
  const { data } = await getVerifyCode();
  if (data.status !== 200) {
    return Toast.fail('服务器繁忙，请稍后重试');
  }
  // 发送验证码请求
  const { data: codeStatus } = await sendVerifyCode({
    type: 'login',
    phone: state.username,
    key: data.data.key,
  });
  if (codeStatus.status !== 200) {
    return Toast.fail('服务器繁忙，请稍后重试');
  }
  // 发送开始后，设置倒计时实例
  const countDown = useCountDown({
    time: 60 * 1000,
    onFinish() {
      state.isSent = false;
    },
  });
  // 开启倒计时
  countDown.start();
  state.isSent = true;
  state.countDown = countDown.current;
};

// 切换登陆方式
const changeMode = () => {
  state.loginMode = state.isPswd ? 'captcha' : 'password';
  state.password = '';
  state.captcha = '';
};

// 登录
// 输入框内容处理
const formatter = (value) => value.trim();
const onSubmit = async () => {
  // 响应结果
  let data = '';
  if (state.isPswd) {
    // 密码登录
    ({ data } = await loginByPassword({
      account: state.username,
      password: state.password,
    }));
  } else {
    ({ data } = await loginByCaptcha({
      phone: state.username,
      captcha: state.captcha,
    }));
  }
  console.log(data);
  // 登陆失败
  if (state.isPswd && data.status !== 200) {
    return Toast.fail('账号或密码错误');
  }
  if (!state.isPswd && data.status !== 200) {
    return Toast.fail('验证码错误');
  }
  // 登陆成功 commit mutation 存储用户信息
  store.commit('setUser', data.data.token);
  // 跳转页面
  router.push(route.query.redirect ?? '/user');
};

const loadLogo = async () => {
  const { data } = await getLogo();
  console.log(data);
  if (data.status !== 200) {
    return;
  }
  state.logo = data.data.logo_url;
};
loadLogo();
</script>

<style lang="scss" scoped>
.van-form {
  display: flex;
  flex-direction: column;
  img {
    align-self: center;
    width: 60%;
    margin: 60px 0;
  }
  .btn-group {
    margin: 30px;
    .van-button {
      margin-bottom: 18px;
    }
  }
}
</style>
