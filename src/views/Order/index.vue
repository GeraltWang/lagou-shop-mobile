<template>
  <!-- 顶部导航 -->
  <van-nav-bar
    title="订单列表"
    left-arrow
    @click-left="router.go(-1)"
  />
  <van-tabs v-model:active="state.active" animated swipeable sticky>
    <van-tab title="全部">
      <template v-if="state?.orderList.length > 0">
        <order-item v-for="item in state?.orderList" :key="item.order_id" :order-info="item"/>
      </template>
      <van-empty v-else description="暂无订单" />
    </van-tab>
    <van-tab title="待付款">
      <template v-if="state?.unpayList.length > 0">
        <order-item v-for="item in state?.unpayList" :key="item.order_id" :order-info="item"/>
      </template>
      <van-empty v-else description="暂无待付款订单" />
    </van-tab>
    <van-tab title="待发货">
      <template v-if="state?.undeliveredList.length > 0">
        <order-item v-for="item in state?.undeliveredList" :key="item.order_id" :order-info="item"/>
      </template>
      <van-empty v-else description="暂无待发货订单" />
    </van-tab>
    <van-tab title="待收货">
      <template v-if="state?.unconfirmedList.length > 0">
        <order-item v-for="item in state?.unconfirmedList" :key="item.order_id" :order-info="item"/>
      </template>
      <van-empty v-else description="暂无待收货订单" />
    </van-tab>
    <van-tab title="待评价">
      <template v-if="state?.commentList.length > 0">
        <order-item v-for="item in state?.commentList" :key="item.order_id" :order-info="item"/>
      </template>
      <van-empty v-else description="暂无待评价订单" />
    </van-tab>
    <van-tab title="已完成">
      <template v-if="state?.completedList.length > 0">
        <order-item v-for="item in state?.completedList" :key="item.order_id" :order-info="item"/>
      </template>
      <van-empty v-else description="暂无已完成货订单" />
    </van-tab>
  </van-tabs>
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Tabs as VanTabs,
  Tab as VanTab,
  Empty as VanEmpty,
  Toast
} from 'vant';
import OrderItem from './components/OrderItem.vue';
import { getOrderList } from '@/api/order';
import { useRouter } from 'vue-router';
import { computed, reactive } from '@vue/reactivity';

const router = useRouter();

// 各种订单数据
const state = reactive({
  active: 0,
  orderList: [],
  unpayList: computed(() => state.orderList.filter(item => item._status._type === 0)),
  undeliveredList: computed(() => state.orderList.filter(item => item._status._type === 1)),
  unconfirmedList: computed(() => state.orderList.filter(item => item._status._type === 2)),
  commentList: computed(() => state.orderList.filter(item => item._status._type === 3)),
  completedList: computed(() => state.orderList.filter(item => item._status._type === 4)),
})

// 请求所有订单数据
const initOrderList = async () => {
  const { data } = await getOrderList()
  console.log(data);
  if (data.status !== 200) {
    return Toast.fail('服务器异常')
  }
  state.orderList = data.data
}
initOrderList()
</script>

<style lang="scss" scoped>
// 顶部导航
.van-nav-bar {
  position: fixed !important;
  width: 100%;
}
// 主体
.van-tabs {
  padding-top: 45px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f6f7f9;
}
</style>
