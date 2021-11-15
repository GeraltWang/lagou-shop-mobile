<template>
  <!-- 顶部导航 -->
  <home-nav />
  <!-- 内容区域 -->
  <home-main class="home-main" />
  <!-- 底部导航 -->
  <tab-bar />
</template>

<script setup>
import HomeNav from './components/HomeNav.vue';
import HomeMain from './components/HomeMain.vue';
import TabBar from '@/components/TabBar.vue';
</script>

<style lang="scss" scoped>
.home-nav {
  z-index: 10;
}
.home-main {
  background-color: #f7f7f7;
  padding: 50px 0;
}
</style>
