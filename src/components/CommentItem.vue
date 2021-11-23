<template>
  <van-cell class="comment-list">
    <!-- 用户信息 -->
    <div class="user-info">
      <img
        :src="reply?.avatar"
      >
      <span
        class="nickname"
        v-text="reply?.nickname"
      />
      <van-rate
        v-model="star"
        :size="15"
        color="#ffd21e"
        void-icon="star"
        void-color="#eee"
        readonly
        allow-half
      />
    </div>
    <!-- 商品信息 -->
    <p class="time">
      {{ reply?.add_time }} {{ reply?.sku }}
    </p>
    <!-- 评价内容 -->
    <p
      class="comment-content"
      v-text="reply?.comment"
    />
    <!-- 图片列表 -->
    <ul class="picture">
      <li
        v-for="(item, index) in pics"
        :key="index"
      >
        <img
          :src="item"
        >
      </li>
    </ul>
    <!-- 评价图片 -->
  </van-cell>
</template>
<script setup>
import {
  Rate as VanRate,
  Cell as VanCell
} from 'vant';
import { computed } from '@vue/reactivity';

// 接收评论数据
const { reply } = defineProps({
  reply: {
    type: Object,
    required: true,
  },
});

// ---处理数据---
// 评价星级
const star = computed(() => Number(reply?.star));
// 评价图片
const pics = computed(() => reply?.pics);
</script>
<style lang="scss" scoped>
.comment-list {
  padding: 10px 15px 20px;
  // 用户信息
  .user-info {
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 5px 0;
    img {
      width: 28px;
      height: 28px;
    }
    .nickname {
      padding: 0 10px 0 6px;
    }
  }
  .time {
    font-size: 12px;
    color: #82848f;
    padding: 5px 0;
  }
  .comment-content {
    font-size: 13px;
    margin-bottom: 10px;
  }
  .picture {
    li {
      float: left;
      padding-right: 11.25px;
      img {
        width: 75px;
      }
    }
  }
}
</style>
