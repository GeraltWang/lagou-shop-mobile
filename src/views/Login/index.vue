<template>
  <van-form @submit="onSubmit">
    <img src="@/assets/logo.png" />
    <van-cell-group inset>
      <van-field v-model="state.username" name="用户名" label="用户名" placeholder="用户名" clearable center/>
      <van-field v-model="state.password" v-if="state.isPswd" type="password" name="密码" label="密码" placeholder="密码" clearable center/>
      <van-field v-model="state.captcha" v-else name="验证码" label="短信验证码" placeholder="短信验证码" clearable center>
        <template #button>
          <van-button size="small" type="primary">发送验证码</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div class="btn-group">
      <van-button round block color="linear-gradient(to right, #5433FF, #20BDFF, #A5FECB)" native-type="submit">登录</van-button>
      <van-button round block type="primary" plain @click="changeMode">{{ state.changeText }}</van-button>
    </div>
  </van-form>
</template>

<script setup>
import { computed, reactive } from '@vue/reactivity';
import { getVerifyCode, sendVerifyCode } from '@/api/user.js';

// ---页面数据---
const state = reactive({
  loginMode: 'password', // 登录模式 密码 验证码 captcha
  isPswd: computed(() => state.loginMode === 'password'),
  changeText: computed(() => state.isPswd ? '手机号登录' : '密码登录'),
  username: '',
  password: '',
  captcha: '',
})

// 验证码
const sendCaptcha = () => {}

// 切换登陆方式
const changeMode = () => {
  state.loginMode = state.isPswd ? 'captcha' : 'password'
  state.password = ''
  state.captcha = ''
}

// 登录
const onSubmit = () => { }
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
