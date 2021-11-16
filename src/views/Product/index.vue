<template>
  <van-nav-bar fixed left-arrow />
  <van-tabs scrollspy color="#fbc546">
    <van-tab title="商品">
      <!-- 轮播图 -->
      <van-swipe indicator-color="#ccc">
        <van-swipe-item v-for="(item, index) in swipeImage" :key="index">
          <van-image width="10rem" height="10rem" :src="item" />
        </van-swipe-item>
      </van-swipe>
      <!-- 商品信息 -->
      <van-cell class="product-info" :border="false">
        <!-- 使用 title, label 插槽来自定义 -->
        <template #title>
          <!-- 价格 -->
          <div class="price">
            <span>￥{{ storeInfo?.price }}</span>
          </div>
          <!-- 分享按钮 -->
          <van-icon name="share-o" size="20" class="share" />
          <!-- 商品标题 -->
          <div class="title" v-text="storeInfo?.store_name"></div>
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
      <van-cell-group class="comment">
        <!-- 评价状况 -->
        <van-cell is-link :title="replyCountShow" :value="replyRate" to="/"></van-cell>
        <!-- 评价列表 -->
        <comment-item v-if="replyCount != 0" :reply="reply"></comment-item>
      </van-cell-group>
    </van-tab>
    <van-tab title="推荐">
      <van-cell class="recommend">
        <p class="title">推荐商品</p>
        <van-grid :column-num="3" :border="false">
          <van-grid-item
            v-for="item in goodsList"
            v-show="item.id != productId"
            :key="item.id"
            :to="{ name: 'product', params: { productId: item.id } }"
          >
            <van-image width="2.6rem" height="2.6rem" :src="item.image"></van-image>
            <p v-text="item.store_name"></p>
            <span>￥{{ item.price }}</span>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-tab>
    <van-tab title="详情">内容 4</van-tab>
  </van-tabs>
</template>

<script setup>
import { computed, ref } from '@vue/reactivity';
import { Toast } from 'vant';
import { useRouter, onBeforeRouteUpdate} from 'vue-router';
import { getProductDetail } from '@/api/product.js';
import CommentItem from '@/components/CommentItem.vue';

// defineprops 接收路由参数
const { productId } = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

// vueRouter 功能
const router = useRouter();
// 跳转推荐商品 通过导航守卫监听路由变化 请求新的商品数据
onBeforeRouteUpdate((to) => {
  // 清除旧数据
  productDetail.value = {};
  // 回到顶部
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  // 重新请求数据
  initProductDetail(to.params.productId);
})

// 请求商品详情
const productDetail = ref({});
const initProductDetail = async (productId) => {
  const { data } = await getProductDetail(productId);
  console.log(data);
  if (data.status !== 200) {
    // 找不到对应商品，跳回首页
    Toast.fail('商品不存在');
    return router.push({ name: 'home' });
  }
  productDetail.value = data.data;
};
initProductDetail(productId);

// ---商品数据处理---
// 商品详细信息
const storeInfo = computed(() => productDetail.value.storeInfo);
// 1 轮播图
const swipeImage = computed(() => storeInfo.value?.slider_image);
// 2 评价信息
// 评价个数
const replyCount = computed(() => productDetail.value.replyCount || 0);
const replyCountShow = computed(() => `用户评价(${replyCount.value})`);
// 好评率
const replyChance = computed(() => productDetail.value.replyChance || 100);
const replyRate = computed(() => `${replyChance.value}% 好评率`);
// 好评信息
const reply = computed(() => productDetail.value.reply);
// 3 推荐
const goodsList = computed(() => productDetail.value.good_list);
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
  // 商品评价
  .comment {
    margin-bottom: 10px;
  }
  // 推荐
  :deep(.recommend) {
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: 700;
      padding: 5px 0;
    }
    .van-grid-item {
      p {
        font-size: 13px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        align-self: flex-start;
      }
      span {
        color: #f2270c;
        font-size: 14px;
        font-weight: 700;
        align-self: flex-start;
      }
    }
  }
}
// 轮播图
:deep(.van-swipe) {
  width: 375px;
  height: 375px;
}
</style>
