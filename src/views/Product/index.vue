<template>
  <van-nav-bar
    fixed
    left-arrow
    @click-left="router.go(-1)"
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
          <div
            class="title"
            v-text="storeInfo?.store_name"
          />
        </template>
        <!-- 其他信息 -->
        <template #label>
          <span>原价：{{ storeInfo?.ot_price }}</span>
          <span>库存：{{ storeInfo?.stock }}</span>
          <span>销量：{{ storeInfo?.fsales }}</span>
        </template>
      </van-cell>
      <!-- 商品规格选择 -->
      <van-cell
        class="product-sku"
        is-link
        @click="showPopup"
      >
        <template #title>
          <span>已选择：{{ sku }}</span>
        </template>
      </van-cell>
      <!-- 规格选择弹出层 -->
      <van-popup
        v-model:show="skuState.show"
        round
        position="bottom"
      >
        <van-cell-group :border="false">
          <!-- 商品信息 -->
          <van-cell class="popup-header">
            <!-- 图片 -->
            <van-image
              width="2rem"
              height="2rem"
              :src="skuDetail?.image"
            />
            <!-- 文字 -->
            <div class="info">
              <p
                class="title"
                v-text="storeInfo?.store_name"
              />
              <p class="price">
                ￥{{ skuDetail?.price }}
              </p>
              <p class="stock">
                库存：{{ skuDetail?.stock }}
              </p>
            </div>
          </van-cell>
          <!-- 规格 -->
          <van-cell
            class="spec"
            v-for="(item, index) in productAttr"
            :key="item.id"
          >
            <p v-text="item.attr_name" />
            <span
              class="tag"
              :class="{ active: skuState.spec[index] === tag }"
              v-for="tag in item.attr_values"
              :key="tag"
              v-text="tag"
              @click="selectSku(tag, index)"
            />
          </van-cell>
          <!-- 数量 -->
          <van-cell title="数量">
            <van-stepper
              v-model="skuState.quantities"
              :max="skuDetail?.stock"
              integer
            />
          </van-cell>
        </van-cell-group>
      </van-popup>
    </van-tab>
    <van-tab title="评价">
      <van-cell-group class="comment">
        <!-- 评价状况 -->
        <van-cell
          is-link
          :title="replyCountShow"
          :value="replyRate"
          :to="{ name: 'comment', params: { productId: storeInfo?.id } }"
        />
        <!-- 评价列表 -->
        <comment-item
          v-if="replyCount != 0"
          :reply="reply"
        />
      </van-cell-group>
    </van-tab>
    <van-tab title="推荐">
      <van-cell class="recommend">
        <p class="title">
          推荐商品
        </p>
        <van-grid
          :column-num="3"
          :border="false"
        >
          <van-grid-item
            v-for="item in goodsList"
            v-show="item.id != productId"
            :key="item.id"
            :to="{ name: 'product', params: { productId: item.id } }"
          >
            <van-image
              width="2.6rem"
              height="2.6rem"
              :src="item.image"
            />
            <p v-text="item.store_name" />
            <span>￥{{ item.price }}</span>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-tab>
    <van-tab title="详情">
      <div
        class="description"
        v-html="storeInfo?.description"
      />
    </van-tab>
  </van-tabs>
  <!-- 架构栏 -->
  <van-action-bar>
    <van-action-bar-icon
      icon="chat-o"
      text="客服"
      color="#ee0a24"
    />
    <van-action-bar-icon
      icon="cart-o"
      text="购物车"
      to="/cart"
    />
    <van-action-bar-icon
      icon="star"
      text="已收藏"
      color="#ff5000"
    />
    <van-action-bar-button
      type="warning"
      text="加入购物车"
      @click="addToCart(0)"
    />
    <van-action-bar-button
      type="danger"
      text="立即购买"
    />
  </van-action-bar>
</template>

<script setup>
import { computed, ref, reactive } from '@vue/reactivity';
import { Toast } from 'vant';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';
import { getProductDetail } from '@/api/product.js';
import { addCart } from '@/api/cart';
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

// Vuex
const store = useStore();

// 跳转推荐商品 通过导航守卫监听路由变化 请求新的商品数据
onBeforeRouteUpdate((to) => {
  // 清除旧数据
  productDetail.value = {};
  // 回到顶部
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  // 重新请求数据
  initProductDetail(to.params.productId);
});

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
  // 初始化规格默认选择
  initSpec(data.data.productAttr);
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

// sku弹出层处理
// 1. 规格数据处理
const productAttr = computed(() => productDetail.value.productAttr);
const productValue = computed(() => productDetail.value.productValue);
const skuState = reactive({
  show: false,
  spec: [], // sku选中
  quantities: 0, // 购买个数
});

// 显示隐藏弹出层
const showPopup = () => {
  skuState.show = true;
};
// 初始化默认选择sku 默认选中每个选项的第一个
const initSpec = (spec) => {
  skuState.spec = spec.map((item) => item.attr_values[0]);
};
// sku 切换
const selectSku = (tag, index) => {
  skuState.spec[index] = tag;
};
// sku 数据处理
const sku = computed(() => skuState.spec.toString());
// 根据SKU 获取对应商品信息
const skuDetail = computed(() => productValue.value?.[sku.value]);

// ---加购功能---
const addToCart = async (type) => {
  // 检测登录, 未登录 跳转登录页
  if (!store.state.user.token) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return Toast({
      message: '请先登录',
      position: 'top',
    });
  }
  // 显示弹出层
  if (!skuState.show) {
    return skuState.show = true;
  }
  // 发送请求，将数据加入购物车
  const { data } = await addCart({
    new: type,
    uniqueId: skuDetail.value.unique,
    productId,
    cartNum: skuState.quantities,
  });
  if (data.status !== 200) {
    return Toast.fail('服务器异常');
  }
  // 隐藏弹出层
  skuState.show = false;
  Toast.success('加入购物车成功');
};
</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed !important;
}
// 顶部 Tabs 标题部分
.van-tabs {
  padding-top: 46px;
  background-color: #f2f2f2;
  margin-bottom: 50px;
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
          font-size: 24px;
          font-weight: 700;
          color: #f2270c;
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
  // 规格选择弹出层
  :deep(.van-popup) {
    max-height: 65%;
    z-index: 10;
    .van-cell-group {
      margin-bottom: 50px;
      // popup 头部
      .popup-header {
        .van-cell__value {
          display: flex;
          align-items: center;
          .van-image {
            margin-right: 20px;
          }
          .info {
            flex: 1;
            .title {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              font-size: 16px;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .price {
              color: #f2270c;
            }
            .stock {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
      // 规格
      .spec {
        p {
          margin-bottom: 5px;
        }
        .tag {
          display: inline-block;
          min-width: 25px;
          padding: 0 12px;
          border: 1px solid #ccc;
          border-radius: 12px;
          text-align: center;
          background-color: #f2f2f2;
          margin-right: 10px;
        }
        .tag.active {
          color: #f2270c;
          border-color: #f2270c;
          background-color: #fcedeb;
        }
      }
    }
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
  :deep(.description) {
    width: 100%;
    img {
      width: 100%;
    }
  }
}
// 轮播图
:deep(.van-swipe) {
  width: 375px;
  height: 375px;
}
.van-action-bar {
  z-index: 10000;
  width: 100%;
}
</style>
