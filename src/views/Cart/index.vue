<template>
  <!-- 顶部导航 -->
  <van-nav-bar
    title="购物车"
    left-arrow
    @click-left="router.go(-1)"
  />
  <!-- 购物车列表 -->
  <div
    class="cart-list"
    v-if="hasItem"
  >
    <cart-item
      v-for="item in cartList"
      :key="item.id"
      :item-info="item"
    />
  </div>
  <!-- 购物车为空 -->
  <van-empty
    description="购物车空空如也"
    v-else
  >
    <van-button
      round
      type="danger"
      icon="cart"
      class="bottom-button"
      @click="router.push('/')"
    >
      快去逛逛吧
    </van-button>
  </van-empty>
  <!-- 合计功能 -->
  <van-submit-bar
    :price="store.getters['cart/totalPrice'] * 100"
    button-text="去结算"
    @submit="goOrder"
  >
    <van-checkbox v-model="checkedAll">
      全选
    </van-checkbox>
  </van-submit-bar>
  <!-- 底部导航 -->
  <tab-bar />
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Empty as VanEmpty,
  Button as VanButton,
  SubmitBar as VanSubmitBar,
  Checkbox as VanCheckbox,
} from 'vant';
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { nextTick } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { getCartList } from '@/api/cart.js';
import CartItem from './components/CartItem.vue';
import TabBar from '@/components/TabBar.vue';

// Vuex
const store = useStore();

// router
const router = useRouter();

// --------购物车数据存储--------
const cartList = computed(() => store.state.cart.cartList);
const hasItem = computed(() => cartList.value.length !== 0);

// --------初始化购物车数据--------
const initCart = async (page, limit) => {
  const { data } = await getCartList(page, limit);
  console.log(data);
  if (data.status !== 200) {
    return;
  }
  // 请求到新数据后 清空原始数据
  store.commit('cart/clearCart');
  await nextTick();
  // 数据处理，将需要的数据交由VUEX进行状态管理
  data.data.valid.forEach((item) => {
    store.commit('cart/addToCart', {
      id: item.id,
      checked: true,
      count: item.cart_num,
      image: item.productInfo.image,
      title: item.productInfo.store_name,
      price: item.truePrice,
      stock: item.trueStock,
      sku: item.productInfo.attrInfo.sku,
      productId: item.product_id,
    });
  });
};
initCart();

// ------全选处理------
const checkedAll = computed({
  get: () => store.getters['cart/checkedAll'],
  set: (newStatus) => {
    store.commit('cart/changeAll', { checked: newStatus });
  },
});

// -------跳转订单页面-------
const goOrder = () => {
  // cartId 指的是要结算的所有商品的id 用逗号连接
  router.push({
    name: 'order-confirm',
    params: {
      cartId: store.getters['cart/checkedItems'].map((item) => item.id).toString(),
    },
  });
};

</script>

<style lang="scss" scoped>
// 顶部导航
.van-nav-bar {
  position: fixed !important;
  top: 0;
  width: 100%;
}
// 主体
.cart-list {
  // min-height: 1000px;
  height: 100vh;
  margin: 46px 0 110px;
  padding-top: 10px;
  box-sizing: border-box;
  background-color: #f2f2f2;
}
// 结算
.van-submit-bar {
  bottom: 50px;
}
</style>
