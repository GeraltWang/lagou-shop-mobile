<template>
  <van-swipe-cell>
    <div class="cart-item">
      <!-- 选中 -->
      <van-checkbox
        checked-color="#1989fa"
        v-model="itemChecked"
      />
      <!-- 右侧 -->
      <div class="link">
        <van-image
          :src="itemInfo.image"
          width="2rem"
          height="2rem"
          @click.stop="router.push({ name: 'product', params: { productId: itemInfo.productId } })"
        />
        <div class="info">
          <p
            class="title"
            v-text="itemInfo.title"
            @click.stop="router.push({ name: 'product', params: { productId: itemInfo.productId } })"
          />
          <div class="detail">
            <span class="price">￥{{ itemInfo.price }}</span>
            <van-stepper
              v-model="itemCount"
              integer
              :max="itemInfo.stock"
              button-size="0.65rem"
              @click.stop
            />
          </div>
          <p
            class="sku"
            v-text="itemInfo.sku"
          />
        </div>
      </div>
    </div>
    <template #right>
      <van-button
        square
        text="删除"
        type="danger"
        class="delete-button"
      />
    </template>
  </van-swipe-cell>
</template>
<script setup>import { computed } from '@vue/reactivity';
import {
  SwipeCell as VanSwipeCell,
  Checkbox as VanCheckbox,
  Image as VanImage,
  Stepper as VanStepper,
  Button as VanButton,
} from 'vant';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { itemInfo } = defineProps({
  itemInfo: {
    type: Object,
    required: true,
  },
});

// 通过计算属性 处理 v-model 的获取与设置操作
const store = useStore();

// 商品选中状态变化处理
const itemChecked = computed({
  get: () => itemInfo.checked,
  set: (newChecked) => {
    // 通过Vuex 进行状态更新
    console.log(newChecked);
    store.commit('cart/checkedChange', { checked: newChecked, id: itemInfo.id });
  },
});

// 商品个数变化处理
const itemCount = computed({
  get: () => itemInfo.count,
  set: (newCount) => {
    console.log(newCount);
    store.dispatch('cart/countChange', { count: newCount, id: itemInfo.id });
  },
});

const router = useRouter();
</script>
<style lang="scss" scoped>
.van-swipe-cell {
  background-color: #fff;
  margin: 0 10px 12px;
  border-radius: 5px;
  box-shadow: #c2c2c2 0 4px 12px;
}
.cart-item {
  display: flex;
  min-height: 100px;
  padding: 10px 10px;
  .van-checkbox {
    margin: 0 5px;
  }
  .link {
    flex: 1;
    display: flex;
    align-items: center;
    .info {
      flex: 1;
      font-size: 14px;
      margin-left: 10px;
      .title {
        font-size: 17px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        margin-bottom: 10px;
      }
      .detail {
        margin-bottom: 10px;
        .price {
          font-size: 16px;
          color: #f2270c;
        }
        .van-stepper {
          float: right;
        }
      }
      .sku {
        font-size: 11px;
        color: #838181;
      }
    }
  }
}
.delete-button {
  height: 100%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
