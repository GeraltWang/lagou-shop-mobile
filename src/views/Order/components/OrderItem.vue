<template>
  <div class="order-item">
    <div class="top">
      <span class="order-num">订单号：{{ orderInfo.order_id }}</span>
      <span class="status" v-text="orderInfo._status._title"></span>
    </div>
    <div class="center">
      <div class="img-box">
        <van-image v-for="(item, index) in orderInfo.cartInfo" :src="item.productInfo.attrInfo.image" :key="index" width="1.4rem" height="1.4rem" radius="5px"></van-image>
      </div>
      <span class="count">共{{ itemCount }}件</span>
    </div>
    <div class="bottom">
      <span class="price">￥{{ orderInfo.total_price }}</span>
      <span class="deadline" v-text="orderInfo._status._msg"></span>
    </div>
  </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';
import {
  Image as VanImage
} from 'vant';

const { orderInfo } = defineProps({
  orderInfo: {
    type: Object,
    required: true
  }
})

const itemCount = computed(() => orderInfo.cartInfo.reduce((sum, item) => sum += item.cart_num, 0))

</script>
<style lang="scss" scoped>
.order-item {
  font-size: 14px;
  padding: 10px 15px;
  margin: 10px 10px;
  min-height: 95px;
  border-radius: 5px;
  box-shadow: #c2c2c2 0 4px 12px;
  background-color: #fff;
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    .status {
      color: #ee0a24;
    }
  }
  .center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    .img-box {
      flex: 1;
      // width: 90%;
      display: flex;
      overflow-y: hidden;
      overflow-x: auto;
      .van-image {
        margin-right: 5px;
        flex-shrink: 0;
      }
    }
    .count {
      font-size: 12px;
      color: #6e6e6e;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    .price {
      font-size: 14px;
      color: #ee0a24;
    }
  }
}
</style>
