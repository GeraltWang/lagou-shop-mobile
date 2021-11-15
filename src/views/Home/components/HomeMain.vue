<template>
  <van-pull-refresh
    class="home-main"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <!-- <div class="home-main"> -->
    <!-- 轮播图 -->
    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
      lazy-render
    >
      <van-swipe-item
        v-for="img in swipeData"
        :key="img.img"
      >
        <img :src="img.img">
      </van-swipe-item>
    </van-swipe>
    <!-- 宫格 -->
    <van-grid
      icon-size="35px"
      clickable
    >
      <van-grid-item
        v-for="(item,index) in gridData"
        :key="index"
        :icon="item.img"
        :text="item.info[0].value"
      />
    </van-grid>
    <!-- 公告栏 -->
    <van-notice-bar
      left-icon="fire"
      :scrollable="false"
    >
      <span>热点资讯公告：</span>
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item, index) in newsData"
          :key="index"
          v-text="item.chiild[0].val"
        />
      </van-swipe>
    </van-notice-bar>
    <!-- 商品列表 -->
    <van-list
      v-model:loading="state.loading"
      :finished="state.finished"
      finished-text="没有更多了"
      @load="initProductData"
    >
      <product-list :products-data="productsData" />
    </van-list>
    <!-- </div> -->
  </van-pull-refresh>
</template>
<script setup>
import { ref, computed, reactive } from 'vue';
import ProductList from '@/components/ProductList.vue';
import { getFirstPage } from '@/api/index.js';
import { getProductList } from '@/api/product.js';

// ---首页功能---
// 响应式数据，存储首页所有数据
const indexData = ref({});

// 首页数据初始化功能
const initIndexData = async () => {
  const { data } = await getFirstPage();
  console.log(data);
  if (data.status !== 200) {
    return;
  }
  indexData.value = data.data;
  // 加载完成，下拉刷新状态改为false
  refreshing.value = false;
};
initIndexData();

// 通过计算属性保存需要使用的数据
// 1 轮播图
const swipeData = computed(() => indexData.value.swiperBg?.default.imgList.list);
// 2 宫格
const gridData = computed(() => indexData.value.menus?.default.imgList.list);
// 3 公告
const newsData = computed(() => indexData.value.news?.default.newList.list);

// ---商品功能---
// 存储商品列表
const productsData = ref([]);
const state = reactive({
  loading: false,
  finished: false,
});
// 页数
let page = 1;
// 加载条数
const limit = 6;
// 产品内容请求
const initProductData = async () => {
  console.log('触发产品刷新');
  const { data } = await getProductList({
    page,
    limit,
  });
  console.log(data);
  if (data.status !== 200) {
    return;
  }
  // 数据存储至商品列表
  productsData.value.push(...data.data);
  // 加载状态变更为false
  state.loading = false;
  // 判断是否已经加载完所有产品
  if (data.data.length < limit) {
    state.finished = true;
    return;
  }
  // 变更页数，准备下次数据请求
  page += 1;
  console.log(page);
};
// List组件可见时，会自动触发加载，所以无需手动调用请求方法
// initProductData()

// ---下拉刷新----
const refreshing = ref(false);

const onRefresh = () => {
  console.log('触发下拉刷新');
  // 1.清空数据
  indexData.value = {};
  productsData.value = [];
  // 2.页码还原
  page = 1;
  // 3.触底加载状态还原
  state.loading = false;
  state.finished = false;
  // 4.重新发送请求
  initIndexData();
  // initProductData();
};
</script>
<style lang="scss" scoped>
.home-main {
  .my-swipe {
    img {
      width: 100%;
      height: 170px;
    }
  }
  :deep(.van-notice-bar__content) {
    display: flex;
    align-items: center;
  }
  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }
}
</style>
