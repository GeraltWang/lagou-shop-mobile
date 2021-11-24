<template>
  <!-- 顶部导航 -->
  <van-nav-bar
    title="确认订单"
    left-arrow
    @click-left="router.go(-1)"
  />
  <!-- 主体 -->
  <div class="main">
    <!-- 地址区域 -->
    <div
      class="address-card"
      @click="shopPopup"
      v-if="!state.isEmpty"
    >
      <p class="info">
        <span
          class="username"
          v-text="state.chosenAddress.name"
        />
        <span
          class="tel"
          v-text="state.chosenAddress.tel"
        />
      </p>
      <p class="detail">
        <span
          class="tag"
          v-if="state.chosenAddress.isDefault"
        >默认</span>
        <span
          class="tag other"
          v-else
        >其他</span>
        <span
          class="address"
          v-text="state.chosenAddress.address"
        />
      </p>
    </div>
    <div
      class="address-card empty"
      @click="shopPopup"
      v-else
    >
      <p>您还没有添加过地址哦,点击此处添加</p>
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
        <template
          #top
          v-if="state.isEmpty"
        >
          <!-- 地址为空时显示 -->
          <van-empty
            class="custom-image"
            image="https://img.yzcdn.cn/vant/custom-empty-image.png"
            description="暂无地址"
          />
        </template>
      </van-address-list>
    </van-popup>
    <!-- 商品列表 -->
    <div class="product">
      <!-- 标题区域 -->
      <van-cell-group>
        <van-cell :title="state.title" />
      </van-cell-group>
      <!-- 商品列表 -->
      <van-cell-group class="product-list">
        <van-cell
          class="item"
          v-for="item in state.cartInfo"
          :key="item.id"
        >
          <!-- 商品图 -->
          <van-image
            :src="item.productInfo.image"
            width="2rem"
            height="2rem"
          />
          <div class="info">
            <p
              class="title"
              v-text="item.productInfo.store_name"
            />
            <p class="price">
              ￥{{ item.truePrice }}
            </p>
            <p
              class="sku"
              v-text="item.productInfo.attrInfo.sku"
            />
          </div>
          <span class="count">x {{ item.cart_num }}</span>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
  <!-- 提交订单栏 -->
  <van-submit-bar
    :loading="false"
    label="订单总计："
    :price="state.totalPrice * 100"
    button-text="提交订单"
    @submit="state.showPayPanel = true"
  />
  <!-- 付款弹出层 -->
  <van-action-sheet
    v-model:show="state.showPayPanel"
    title="请选择支付方式"
    cancel-text="取消"
  >
    <template #default>
      <van-radio-group v-model="state.paymentMethod">
        <van-cell-group>
          <!-- 微信 -->
          <van-cell
            clickable
            center
            title="微信支付"
            label="微信快捷支付"
            @click="state.paymentMethod = 'wechat'"
          >
            <template #icon>
              <van-icon
                name="wechat-pay"
                size="1rem"
                color="#22ac38"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio name="wechat" />
            </template>
          </van-cell>
          <!-- 支付宝 -->
          <van-cell
            clickable
            center
            title="支付宝支付"
            label="支付宝快捷支付"
            @click="state.paymentMethod = 'alipay'"
          >
            <template #icon>
              <van-icon
                name="alipay"
                size="1rem"
                color="#1989fa"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio name="alipay" />
            </template>
          </van-cell>
          <!-- 余额 -->
          <van-cell
            clickable
            center
            title="余额支付"
            :label="`可用余额：${state.yue}元`"
            @click="state.paymentMethod = 'yue'"
          >
            <template #icon>
              <van-icon
                name="gold-coin"
                size="1rem"
                color="#f1a628"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio name="yue" />
            </template>
          </van-cell>
          <van-cell>
            <van-button
              block
              round
              type="primary"
              @click="goPay"
            >
              去支付
            </van-button>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </template>
  </van-action-sheet>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, reactive, toRaw } from '@vue/reactivity';
import {
  Notify,
  Toast,
  Cell as VanCell,
  CellGroup as VanCellGroup,
  RadioGroup as VanRadioGroup,
  Button as VanButton,
  ActionSheet as VanActionSheet,
  Radio as VanRadio,
  Icon as VanIcon,
  Popup as VanPopup,
  NavBar as VanNavBar,
  AddressList as VanAddressList,
  Empty as VanEmpty,
  SubmitBar as VanSubmitBar,
  Image as VanImage
} from 'vant';
import { getAddressList, confirmOrder, createOrder } from '@/api/order';

// router
const router = useRouter();

// 路由参数
const { cartId } = defineProps({
  cartId: {
    type: String,
    required: true,
  },
});

// 页面状态
const state = reactive({
  // 地址 popup 显示状态
  popupStatus: false,
  chosenAddressId: '',
  // 选中的地址
  chosenAddress: {},
  // 地址列表
  list: [],
  // 地址 是否为空
  isEmpty: computed(() => state.list.length === 0),
  // 订单数据
  orderData: {},
  // 订单所含的商品
  cartInfo: computed(() => state.orderData?.cartInfo),
  // 订单所含的商品 种类数
  cartItemCount: computed(() => state.cartInfo?.length || 0),
  // 订单所含的商品 件数
  cartItemTotalCount: computed(() => state.cartInfo?.reduce((sum, item) => sum += item.cart_num, 0) || 0),
  // 订单所含的商品 展示文字
  title: computed(() => `共${state.cartItemCount}种，${state.cartItemTotalCount}件 商品`),
  // 订单总价
  totalPrice: computed(() => state.orderData?.priceGroup?.totalPrice || 0),
  // 付款面板显示状态
  showPayPanel: false,
  // 付款方式
  paymentMethod: 'yue',
  // 用户余额
  yue: computed(() => state.orderData?.userInfo.now_money || 0),
});

// ------获取用户地址------
// 数据格式转换函数
const convertData = (data) => data.map((item) => {
  const temp = {
    id: item.id,
    name: item.real_name,
    tel: item.phone,
    address: item.province + item.city + item.district + item.detail,
    isDefault: item.is_default,
  };
  // 检测是否为默认地址
  if (item.is_default === 1) {
    // 记录勾选的 id
    state.chosenAddressId = item.id;
    // 记录默认地址
    state.chosenAddress = temp;
  }
  return temp;
});

const initAddress = async (params) => {
  const { data } = await getAddressList(params);
  console.log(data);
  if (data.status === 410000) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return Toast({
      message: '请先登录',
      position: 'top',
    });
  }
  if (data.status !== 200) {
    return Toast.fail('服务器异常');
  }
  state.list = convertData(data.data);
};
initAddress({ limit: 5, page: 1 });

// 选择地址 显示弹出层
const shopPopup = () => state.popupStatus = !state.popupStatus;
const selectAddress = (item) => {
  state.popupStatus = false;
  // 更新 地址栏 显示的地址
  console.log(item);
  state.chosenAddress = toRaw(item);
};
// 编辑 / 新增 地址
const onAdd = () => {
  router.push({
    name: 'add-address',
    params: {
      cartId,
    },
  });
};
const onEdit = (item, index) => Toast(`编辑地址:${index}`);

// ------初始化订单数据------
const initOrderData = async () => {
  const { data } = await confirmOrder({
    cartId,
    new: 0,
  });
  console.log(data);
  if (data.status === 400) {
    return Notify({ type: 'danger', message: '请返回购物车重新提交订单' });
  }
  state.orderData = data.data;
};
initOrderData();

// ------去支付------
const goPay = async () => {
  const { data } = await createOrder(state.orderData?.orderKey, {
    addressId: state.chosenAddress.id,
    payType: state.paymentMethod,
  });
  console.log(data);
  if (data.status === 200 && data.data.status === 'PAY_DEFICIENCY') {
    state.showPayPanel = false
    return Notify({ type: 'danger', message: `余额不足${data.msg}元，请重试` });
  }
  if (data.status !== 200) {
    state.showPayPanel = false
    return Notify({ type: 'danger', message: '服务器异常' });
  }
  Toast.success('支付成功');
  state.showPayPanel = false
  router.push({ name: 'pay', params: { msg: '支付成功' } })
};

</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed !important;
  width: 100%;
}
.main {
  padding: 50px 0;
  // 顶部地址框
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
  // 地址框无地址
  .address-card.empty {
    font-size: 14px;
    color: #6b6b6b;
    text-align: center;
    p {
      line-height: 55px;
    }
  }
  // 地址 popup
  :deep(.van-popup) {
    .van-address-list {
      .van-radio-group {
        padding-bottom: 50px;
      }
    }
  }

  .product {
    .product-list {
      .item {
        :deep(.van-cell__value) {
          display: flex;
          align-items: center;
          .info {
            flex: 1;
            margin-left: 10px;
            .title {
              font-size: 16px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .price {
              font-size: 14px;
              color: #f2270c;
            }
            .sku {
              font-size: 13px;
              color: #727272;
            }
          }
          .count {
            font-size: 13px;
            color: #727272;
          }
        }
      }
    }
  }
}
</style>
