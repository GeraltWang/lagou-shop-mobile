<template>
  <div class="home-nav">
    <!-- logo区域 -->
    <img src="@/assets/logo.png">
    <!-- 搜索框 -->
    <div class="search">
      <van-icon
        name="search"
        size="0.5rem"
      />
    </div>
    <!-- 分类跳转 -->
    <van-icon name="wap-nav" />
  </div>
</template>
<script setup>

</script>
<style lang="scss" scoped>
.home-nav {
  position: fixed;
  width: 100%;
  height: 50px;
  padding-right: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: #fff;
  img {
    height: 20px;
    padding: 0 10px;
  }
  .search {
    background-color: #f7f7f7;
    width: 100%;
    height: 30px;
    margin-right: 10px;
    border-radius: 25px;
    .van-icon {
      margin-left: 10px;
    }
  }
}
</style>
