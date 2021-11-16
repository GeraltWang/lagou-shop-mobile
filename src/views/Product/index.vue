<template>
  <van-nav-bar
    fixed
    left-arrow
  />
  <van-tabs
    scrollspy
    color="#fbc546"
  >
    <van-tab title="商品">
      <!-- 轮播图 -->
      <van-swipe indicator-color="#ccc">
        <van-swipe-item
          v-for="(item, index) in swipeImage"
          :key="index"
        >
          <van-image
            width="10rem"
            height="10rem"
            :src="item"
          />
        </van-swipe-item>
      </van-swipe>
      <!-- 商品信息 -->
      <van-cell
        class="product-info"
        :border="false"
      >
        <!-- 使用 title, label 插槽来自定义 -->
        <template #title>
          <!-- 价格 -->
          <div class="price">
            <span>￥{{ storeInfo?.price }}</span>
          </div>
          <!-- 分享按钮 -->
          <van-icon
            name="share-o"
            size="20"
            class="share"
          />
          <!-- 商品标题 -->
          <div class="title" v-text="storeInfo?.store_name">
          </div>
        </template>
        <!-- 其他信息 -->
        <template #label>
          <span>原价：{{ storeInfo?.ot_price }}</span>
          <span>库存：{{ storeInfo?.stock }}</span>
          <span>销量：{{ storeInfo?.fsales }}</span>
        </template>
      </van-cell>
      <!-- 商品规格选择 -->
      <van-cell class="product-sku" is-link>
        <template #title>
          <span>已选择：</span>
        </template>
      </van-cell>
    </van-tab>
    <van-tab title="评价">
      内容 2
    </van-tab>
    <van-tab title="推荐">
      内容 3
    </van-tab>
    <van-tab title="详情">
      内容 4
    </van-tab>
  </van-tabs>
</template>

<script setup>
import { computed, ref } from '@vue/reactivity';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import { getProductDetail } from '@/api/product.js';

// defineprops 接收路由参数
const { productId } = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

// vueRouter 功能
const router = useRouter();

// 请求商品详情
const productDetail = ref({});
const initProductDetail = async () => {
  const { data } = await getProductDetail(productId);
  console.log(data);
  if (data.status !== 200) {
    // 找不到对应商品，跳回首页
    Toast.fail('商品不存在');
    return router.push({ name: 'home' });
  }
  productDetail.value = data.data;
};
initProductDetail();

// ---商品数据处理---
// 商品详细信息
const storeInfo = computed(() => productDetail.value.storeInfo);
// 1 轮播图
const swipeImage = computed(() => storeInfo.value?.slider_image);
</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed !important;
}
// 顶部 Tabs 标题部分
.van-tabs {
  padding-top: 46px;
  background-color: #f2f2f2;
  :deep(.van-tabs__wrap) {
    position: fixed;
    top: 0;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    // 内容容器
    :deep(.van-tabs__content) {
      padding-top: 46px;
    }
  }
  // 商品信息
  .product-info {
    margin-bottom: 10px;
    // title 插槽
    .van-cell__title {
      .price {
        span {
          font-size: 22px;
          font-weight: 700;
        }
      }
      .share {
        float: right;
      }
      .title {
        font-size: 16px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin: 5px 0 10px;
      }
    }
    // label 插槽
    :deep(.van-cell__label) {
      display: flex;
      justify-content: space-between;
    }
  }
  // sku 信息
  .product-sku {
    margin-bottom: 10px;
  }
}
// 轮播图
:deep(.van-swipe) {
  width: 375px;
  height: 375px;
}
</style>
