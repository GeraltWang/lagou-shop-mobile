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
        />
        <div class="info">
          <p class="title" v-text="itemInfo.title"></p>
          <div class="detail">
            <span class="price">￥{{ itemInfo.price }}</span>
            <van-stepper v-model="value" integer max="100" button-size="0.65rem" />
          </div>
          <!-- <p class="del">
            <span>删除</span>
          </p> -->
        </div>
      </div>
    </div>
    <template #right>
      <van-button square text="删除" type="danger" class="delete-button" />
    </template>
  </van-swipe-cell>
</template>
<script setup>
const { itemInfo } = defineProps({
  itemInfo: {
    type: Object,
    required: true
  }
})
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
  min-height: 90px;
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
        font-size: 18px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        margin-bottom: 10px;
      }
      .detail {
        // margin-bottom: 10px;
        .price {
          font-size: 16px;
          color: #f2270c;
        }
        .van-stepper {
          float: right;
        }
      }
      .del {
        direction: rtl;
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
