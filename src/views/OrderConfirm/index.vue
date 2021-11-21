<template>
  <!-- 顶部导航 -->
  <van-nav-bar title="确认订单" left-arrow @click-left="router.go(-1)" />
  <!-- 主体 -->
  <div class="main">
    <!-- 地址区域 -->
    <div class="address-card" @click="shopPopup">
      <p class="info">
        <span class="username" v-text="state.chosenAddress.name"></span>
        <span class="tel" v-text="state.chosenAddress.tel"></span>
      </p>
      <p class="detail">
        <span class="tag" v-if="state.chosenAddress.isDefault">默认</span>
        <span class="tag other" v-else>其他</span>
        <span class="address" v-text="state.chosenAddress.address"></span>
      </p>
    </div>
    <!-- 地址选择弹出层 -->
    <van-popup
      v-model:show="state.popupStatus"
      round
      closeable
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-address-list
        v-model="state.chosenAddressId"
        :list="state.list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @click-item="selectAddress"
      >
        <template #top v-if="state.isEmpty">
          <!-- 地址为空时显示 -->
          <van-empty
            class="custom-image"
            image="https://img.yzcdn.cn/vant/custom-empty-image.png"
            description="暂无地址"
          />
        </template>
      </van-address-list>
    </van-popup>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getAddressList } from '@/api/order';
import { computed, reactive, toRaw } from '@vue/reactivity';
import { Toast } from 'vant';

// router
const router = useRouter();

// 页面状态
const state = reactive({
  popupStatus: false,
  chosenAddressId: '',
  chosenAddress: {},
  list: [
    {
      id: '1',
      name: '张三',
      tel: '13000000000',
      address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
      isDefault: true,
    },
    {
      id: '2',
      name: '李四',
      tel: '1310000000',
      address: '浙江省杭州市拱墅区莫干山路 50 号',
    },
  ],
  isEmpty: computed(() => state.list.length === 0)
})

// ------获取用户地址------
// 数据格式转换函数
const convertData = (data) => {
  return data.map(item => {
    const temp = {
      id: item.id,
      name: item.read_name,
      tel: item.phone,
      address: item.province + item.city + item.district + item.detail,
      isDefault: item.is_default
    }
    // 检测是否为默认地址
    if (item.is_default === 1) {
      // 记录勾选的 id
      state.chosenAddressId = item.id
      // 记录默认地址
      state.chosenAddress = temp
    }
    return temp
  })
}

const initAddress = async (params) => {
  const { data } = await getAddressList(params)
  console.log(data);
  if (data.status === 410000) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return Toast({
      message: '请先登录',
      position: 'top',
    });
  }
  if (data.status !== 200) {
    return Toast.fail('服务器异常')
  }
  // state.list = convertData(data.data)
}
initAddress({ limit: 5, page: 1 })

// 选择地址 显示弹出层
const shopPopup = () => state.popupStatus = !state.popupStatus
const selectAddress = (item) => {
  state.popupStatus = false
  // 更新 地址栏 显示的地址
  console.log(item);
  state.chosenAddress = toRaw(item)
}
// 编辑 / 新增 地址
const onAdd = () => Toast('新增地址');
const onEdit = (item, index) => Toast('编辑地址:' + index);

</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed !important;
  width: 100%;
}
.main {
  padding: 50px 0;
  .address-card {
    position: relative;
    min-height: 85px;
    box-sizing: border-box;
    padding: 15px 20px;
    font-size: 16px;
    &::after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      content: "";
      background: repeating-linear-gradient(
        90deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 20%,
        transparent 25%,
        #0084ff 25%,
        #0084ff 45%,
        transparent 45%,
        transparent 50%
      );
      background-size: 80px;
    }
    .info {
      margin-bottom: 5px;
      .username {
        padding-right: 20px;
      }
    }
    .detail {
      .tag {
        float: left;
        margin-right: 20px;
        font-size: 12px;
        color: #fff;
        border-radius: 3px;
        background-color: #1989fa;
        padding: 2px 5px;
      }
      .tag.other {
        background-color: #919090;
      }
      .address {
        font-size: 14px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
