<template>
  <van-swipe-cell>
    <div class="cart-item">
      <!-- 选中 -->
      <van-checkbox checked-color="#1989fa" v-model="itemInfo.checked"></van-checkbox>
      <!-- 右侧 -->
      <div class="link">
        <van-image
          :src="itemInfo.image"
          width="2rem"
          height="2rem"
          @click.stop="router.push({ name: 'product', params: { productId: itemInfo.productId } })"
        />
        <div class="info">
          <p class="title" v-text="itemInfo.title" @click.stop="router.push({ name: 'product', params: { productId: itemInfo.productId } })"></p>
          <div class="detail">
            <span class="price">￥{{ itemInfo.price }}</span>
            <van-stepper v-model="value" integer :max="itemInfo.stock" button-size="0.65rem" @click.stop/>
          </div>
          <p class="sku" v-text="itemInfo.sku"></p>
        </div>
      </div>
    </div>
    <template #right>
      <van-button square text="删除" type="danger" class="delete-button" />
    </template>
  </van-swipe-cell>
</template>
<script setup>import { useRouter } from 'vue-router';

const { itemInfo } = defineProps({
  itemInfo: {
    type: Object,
    required: true
  }
})

const router = useRouter()
</script>
<style lang="scss" scoped>
.van-swipe-cell {
  background-color: #fff;
  margin: 0 10px 12px;
  border-radius: 5px;
  box-shadow: #c2c2c2 0 4px 12px;
}
.cart-item {
  display: flex;
  min-height: 100px;
  padding: 10px 10px;
  .van-checkbox {
    margin: 0 5px;
  }
  .link {
    flex: 1;
    display: flex;
    align-items: center;
    .info {
      flex: 1;
      font-size: 14px;
      margin-left: 10px;
      .title {
        font-size: 17px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        margin-bottom: 10px;
      }
      .detail {
        margin-bottom: 10px;
        .price {
          font-size: 16px;
          color: #f2270c;
        }
        .van-stepper {
          float: right;
        }
      }
      .sku {
        font-size: 11px;
        color: #838181;
      }
    }
  }
}
.delete-button {
  height: 100%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
