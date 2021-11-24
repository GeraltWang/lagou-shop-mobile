<template>
  <div class="pay">
    <van-icon name="checked" size="3rem" color="#29da71"/>
    <p>{{ msg }}</p>
    <van-button type="primary" @click="router.push({ name: 'order', params: { type: 'undel' }, replace: true })">我的订单</van-button>
  </div>
</template>

<script setup>
import {
  Icon as VanIcon,
  Button as VanButton
} from 'vant'
import { useRouter } from 'vue-router';

const router = useRouter()

const { msg } = defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.pay {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 140px 0;
  p {
    margin-top: 20px;
  }
  .van-button {
    margin-top: 20px;
  }
}

</style>
