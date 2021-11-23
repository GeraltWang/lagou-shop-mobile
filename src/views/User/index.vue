<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <van-image
        :src="avatar"
        width="2rem"
        height="2rem"
        round
      />
      <transition
        v-if="isLogin"
        appear
      >
        <div class="user-info">
          <div class="user-name">
            {{ userName }}
          </div>
          <div class="user-id">
            ID:{{ userId }}
          </div>
        </div>
      </transition>
      <transition
        v-else
        appear
      >
        <div class="user-info">
          <div class="user-name">
            未登录
          </div>
          <van-button
            round
            size="small"
            @click="goLogin"
          >
            请先登录
          </van-button>
        </div>
      </transition>
      <van-icon
        name="setting-o"
        size="0.6rem"
        color
      />
    </div>
    <!-- 菜单区域 -->
    <div class="menu">
      <van-cell-group
        inset
        :border="false"
        class="user-prop"
      >
        <van-cell>
          <van-grid :border="false">
            <van-grid-item :text="collectCount">
              <template #icon>
                收藏
              </template>
            </van-grid-item>
            <van-grid-item :text="integral">
              <template #icon>
                积分
              </template>
            </van-grid-item>
            <van-grid-item :text="couponCount">
              <template #icon>
                优惠券
              </template>
            </van-grid-item>
            <van-grid-item :text="now_money">
              <template #icon>
                余额
              </template>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset>
        <van-cell
          title="订单中心"
          value="查看全部"
          is-link
          to="/order"
        />
        <van-grid
          :border="false"
          column-num="5"
        >
          <van-grid-item
            icon="bill-o"
            text="待付款"
          />
          <van-grid-item
            icon="tosend"
            text="待发货"
          />
          <van-grid-item
            icon="logistics"
            text="待收货"
          />
          <van-grid-item
            icon="comment-o"
            text="待评价"
          />
          <van-grid-item
            icon="sign"
            text="已完成"
          />
        </van-grid>
      </van-cell-group>
    </div>
    <tab-bar />
  </div>
</template>

<script setup>
import {
  Toast,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Grid as VanGrid,
  GridItem as VanGridItem,
  Icon as VanIcon,
  Button as VanButton,
} from 'vant';
import { computed, ref } from '@vue/reactivity';
// import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import TabBar from '@/components/TabBar.vue';
import { getUserInfo } from '@/api/user.js';

// VUEX
// const store = useStore();

// router
const router = useRouter();

// 用户信息
const userData = ref({});
const isLogin = ref(false);
const avatar = computed(() => userData.value?.switchUserInfo?.[0].avatar || 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg');
const userId = computed(() => userData.value?.uid);
const userName = computed(() => userData.value?.nickname);
// 用户详情信息
const collectCount = computed(() => userData.value?.collectCount?.toString() || '***');
const integral = computed(() => userData.value?.integral?.toString() || '***');
const couponCount = computed(() => userData.value?.couponCount?.toString() || '***');
const now_money = computed(() => userData.value?.now_money?.toString() || '***');

// 获取用户信息
const initUser = async () => {
  const { data } = await getUserInfo();
  console.log(data);
  if (data.status === 400) {
    return Toast.fail('服务器异常');
  }
  if (data.status === 410000) {
    isLogin.value = false;
    return;
  }
  userData.value = data.data;
  isLogin.value = true;
};
initUser();

// 去登陆
const goLogin = () => {
  router.push({ name: 'login', query: { redirect: '/user' } });
};

</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  padding: 15px 0;
  box-sizing: border-box;
  background: radial-gradient(circle at 50% -10%, #199afb 72%, #f6f7f9 72%)
    #f6f7f9 0 -350px no-repeat;
  .header {
    display: flex;
    margin: 0 15px 15px;
    padding: 5px 10px;
    background-color: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    min-height: 94px;
    box-shadow: #c2c2c2 0 4px 12px;

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 10px;
      flex: 1;
      .user-name {
        font-size: 16px;
        font-weight: bold;
      }
      .user-id {
        font-size: 12px;
        color: #747f88;
      }
      .van-button {
        width: 100px;
      }
    }
    .van-icon {
      margin-top: 5px;
    }
  }
  .menu {
    .van-cell-group {
      margin-bottom: 10px;
      box-shadow: #ebedf0 0 4px 12px;
    }
    .user-prop {
      .van-cell {
        padding: 0;
        min-height: 74px;
      }
    }
  }
}
</style>
