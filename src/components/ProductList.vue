<template>
    <!-- 内容不居中，关闭边框 -->
    <van-grid
      class="product-list"
      :column-num="2"
      :gutter="15"
      :center="false"
      :border="false"
    >
      <van-grid-item
        v-for="item in productsData"
        :key="item.id"
        :to="{ name: 'product', params: { productId: item.id } }"
      >
        <!-- 商品图 -->
        <van-image :src="item.image"/>
        <!-- 商品标题 -->
        <p
          class="title"
          v-text="item.store_name"
        />
        <!-- 商品价格 -->
        <p class="price">
          ￥{{ item.price }}
        </p>
        <!-- 销量 -->
        <p class="sales">
          已售{{ item.sales }}件
        </p>
      </van-grid-item>
    </van-grid>
</template>
<script setup>
import {
  Grid as VanGrid,
  GridItem as VanGridItem,
  Image as VanImage,
} from 'vant';

// 接收商品数据
const { productsData } = defineProps({
  productsData: {
    type: Array,
    required: true,
  },
});
</script>
<style lang="scss" scoped>
.product-list {
  margin: 10px 0;
  :deep(.van-grid-item__content) {
    padding: 0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .title {
    font-size: 14px;
    padding: 5px 8px 0;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .price {
    font-size: 18px;
    font-weight: 700;
    color: #ee3e3e;
    padding: 5px 6px 0;
  }
  .sales {
    font-size: 12px;
    color: #ccc;
    padding: 5px 8px;
  }
}
</style>
