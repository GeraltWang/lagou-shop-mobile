<template>
  <div class="home-main">
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" lazy-render>
      <van-swipe-item v-for="img in swipeData" :key="img.img">
        <img :src="img.img" />
      </van-swipe-item>
    </van-swipe>
    <!-- 宫格 -->
    <van-grid icon-size="35px" clickable>
      <van-grid-item
        v-for="(item,index) in gridData"
        :key="index"
        :icon="item.img"
        :text="item.info[0].value"
      />
    </van-grid>
  </div>
</template>
<script setup>
import { getFirstPage } from '@/api/index.js';
import { ref, computed } from 'vue';

// 响应式数据，存储首页所有数据
let indexData = ref({});

// 封装首页数据初始化功能
const initIndexData = async () => {
  const { data } = await getFirstPage()
  console.log(data);
  if (data.status !== 200) {
    return
  }
  indexData.value = data.data
}
initIndexData()

// 通过计算属性保存需要使用的数据
// 1 轮播图
const swipeData = computed(() => {
  return indexData.value.swiperBg?.default.imgList.list
})
// 2 宫格
const gridData = computed(() => {
  return indexData.value.menus?.default.imgList.list
})
</script>
<style lang="scss" scoped>
.home-main {
  .my-swipe {
    img {
      width: 100%;
      height: 170px;
    }
  }
}
</style>
