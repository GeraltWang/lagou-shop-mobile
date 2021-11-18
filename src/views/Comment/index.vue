<template>
  <van-cell-group
    v-if="networkStatus"
    :border="false"
    class="comment"
  >
    <!-- 评价概况 -->
    <van-cell
      title="商品评价"
      :value="`好评率：${state.replyChance}%`"
    />
    <!-- 评价切换 -->
    <van-cell class="tags">
      <van-button
        size="small"
        :class="{ active: state.isSum }"
        @click="onChange(0)"
      >
        全部({{ state.sumCount }})
      </van-button>
      <van-button
        size="small"
        :class="{ active: state.isGood }"
        @click="onChange(1)"
      >
        好评({{ state.goodCount }})
      </van-button>
      <van-button
        size="small"
        :class="{ active: state.isIn }"
        @click="onChange(2)"
      >
        中评({{ state.inCount }})
      </van-button>
      <van-button
        size="small"
        :class="{ active: state.isPoor }"
        @click="onChange(3)"
      >
        差评({{ state.poorCount }})
      </van-button>
    </van-cell>
    <!-- 评价列表 -->
    <keep-alive v-if="state.hasComment">
      <comment-item
        v-for="item in state.commentList"
        :key="item.id"
        :reply="item"
      />
    </keep-alive>
    <van-empty
      v-else
      description="暂无评论"
    />
  </van-cell-group>
  <van-empty
    v-else
    image="network"
    description="服务器走丢了"
  >
    <van-button
      round
      type="danger"
    >
      刷新试试
    </van-button>
  </van-empty>
</template>

<script setup>
import { computed, reactive, ref } from '@vue/reactivity';
import CommentItem from '@/components/CommentItem.vue';
import { getProductReply, getReplyByType } from '@/api/product.js';

const { productId } = defineProps({
  productId: {
    type: String,
    required: true,
  },
});
// 判断网络状态
const networkStatus = ref(true);

// 获取评价个数
// 存储评价个数
const state = reactive({
  commentCount: {},
  // 个数
  goodCount: computed(() => state.commentCount?.good_count || 0),
  inCount: computed(() => state.commentCount?.in_count || 0),
  poorCount: computed(() => state.commentCount?.poor_count || 0),
  sumCount: computed(() => state.commentCount?.sum_count || 0),
  replyChance: computed(() => state.commentCount?.reply_chance || 100),
  // 评价信息
  commentList: [],
  // 评价显示切换
  active: 0,
  // 计算属性 进行不同状态的判断
  isSum: computed(() => state.active === 0),
  isGood: computed(() => state.active === 1),
  isIn: computed(() => state.active === 2),
  isPoor: computed(() => state.active === 3),
  // 判断是否存在评论
  hasComment: computed(() => state.commentList.length || 0),
});
const initProductReply = async () => {
  const { data } = await getProductReply(productId);
  console.log(data);
  if (data.status !== 200) {
    networkStatus.value = false;
    return;
  }
  state.commentCount = data.data;
};
initProductReply();

const initReplyByType = async (type) => {
  const { data } = await getReplyByType(productId, type);
  console.log(data);
  if (data.status !== 200) {
    networkStatus.value = false;
    return;
  }
  state.commentList = data.data;
};
initReplyByType(state.active);

const onChange = (tagKey) => {
  state.active = tagKey;
  initReplyByType(state.active);
};
</script>

<style lang="scss" scoped>
.comment {
  .tags {
    .van-button {
      border-radius: 15px;
      margin-right: 10px;
    }
    .active {
      background-color: #fbc546;
    }
  }
}
</style>
