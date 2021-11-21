<template>
  <!-- 顶部导航 -->
  <van-nav-bar title="地址管理" left-arrow @click-left="router.go(-1)" />
  <!-- 表单 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="addressForm.real_name"
        name="姓名"
        label="姓名"
        placeholder="收货人姓名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <!-- 手机 -->
      <van-field
        v-model="addressForm.phone"
        name="手机号"
        label="手机号"
        placeholder="收货人手机号"
        :rules="[{ required: true, message: '请填写收货人手机号' }]"
      />
      <!-- 地区 -->
      <van-field
        v-model="addressForm.fieldValue"
        name="地区"
        label="地区"
        placeholder="请选择所在地区"
        is-link
        readonly
        @click="showCascader"
        :rules="[{ required: true, message: '请填选择地区' }]"
      />
      <van-popup v-model:show="addressForm.show" round position="bottom">
        <van-cascader
          v-model="addressForm.area"
          title="请选择所在地区"
          :field-names="addressForm.fieldNames"
          :options="addressForm.options"
          @close="addressForm.show = false"
          @finish="onFinish"
          swipeable
          active-color="#1989fa"
        />
      </van-popup>
      <!-- 详细地址 -->
      <van-field
        v-model="addressForm.detail"
        name="详细地址"
        label="详细地址"
        placeholder="详细地址"
        :rules="[{ required: true, message: '请填写详细地址' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field name="switch" label="设为默认地址" input-align="right">
        <template #input>
          <van-switch v-model="addressForm.is_default" size="20" />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">提交</van-button>
    </div>
  </van-form>
</template>
<script setup>
import { reactive } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { getCityList, addOrEditAddress } from '@/api/address'
import { Toast } from 'vant';

// router
const router = useRouter();

// 路由参数
const { cartId } = defineProps({
  cartId: String
})

// --------表单数据--------
const addressForm = reactive({
  real_name: '',
  phone: '',
  area: '',
  detail: '',
  is_default: false,
  // 地区菜单显示状态
  show: false,
  // 自定义options 的 key
  fieldNames: { text: 'n', value: 'v', children: 'c' },
  // 地区菜单选项
  options: [],
  // 地区菜单 选择后 input 展示内容
  fieldValue: ''
})

// 用于在选择地区后，整合接口需要的地区信息
let address = {}

// 显示级联菜单 并请求地区列表
const showCascader = () => {
  addressForm.show = true
  initCityList()
}

// 请求级联菜单列表
const initCityList = async () => {
  const { data } = await getCityList()
  if (data.status !== 200) {
    return Toast.fail('服务器异常')
  }
  addressForm.options = convertData(data.data)
}
initCityList()

// 地区选项处理 去除空的children
const convertData = data => {
  data.forEach(item => {
    // 说明是去
    if (item.c.length === 0) {
      delete item.c
    } else {
      // 说明是省或者市 递归处理
      convertData(item.c)
    }
  });
  return data
}

// 级联菜单 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
  addressForm.show = false;
  addressForm.fieldValue = selectedOptions.map((option) => option.n).join('/');
  // 为提交接口准备数据
  address = {
    province: selectedOptions[0].n,
    city: selectedOptions[1].n,
    city_id: selectedOptions[1].v,
    district: selectedOptions[2].n
  }
};

// 新增/编辑 地址
const onSubmit = async () => {
  const { data } = await addOrEditAddress({
    id: 0,
    real_name: addressForm.real_name,
    phone: addressForm.phone,
    detail: addressForm.detail,
    is_default: addressForm.is_default,
    address
  })
  console.log(data);
  if (data.status !== 200) {
    return Toast.fail('服务器异常')
  }
  // 新增成功时检测是否要跳回订单确认页面
  if (cartId) {
    router.push({
      name: 'order-confirm',
      params: {
        cartId
      }
    })
  } else {
    router.push('/user')
  }
}

</script>
<style lang="scss" scoped>
// 顶部导航
.van-nav-bar {
  position: fixed !important;
  top: 0;
  width: 100%;
}
// 表单
.van-form {
  padding: 50px 0;
  height: 90vh;
  box-sizing: border-box;
  background-color: #f7f7f7;
  .van-cell-group {
    margin-top: 10px;
  }
}
</style>
