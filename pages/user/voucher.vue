<template>
  <view class="pages voucher">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">充值服务</view>
      <view class="integralRecharge" @click="goto('/pages/user/integral')">积分充值</view>
    </view>
    <view class="voucher-content">
      <view class="voucher-list">
        <view class="voucher-item" v-for="(item, index) in voucherInfos" :key="index"
              :class="{ 'item-active': index === selectedIndex }" @click="selectedIndex = index">
          <view class="voucher-item-top">{{ item.name }}</view>
          <view class="voucher-item-center">￥{{ item.price }}</view>
          <view class="voucher-item-bottom">{{ item.unit_price + '/100积分' }}</view>
        </view>
      </view>
      <view class="vip-interest">
        <view class="vip-interest-title">会员权益</view>
        <view class="vip-interest-list" v-if="voucherInfos.length > 0">
          <view class="vip-interest-item">
            <image class="vip-interest-img" src="/static/interest-item.png"/>
            <view style="margin-left: 7px">{{'定制版数字人形象×'+voucherInfos[selectedIndex].figure}}</view>
          </view>
          <view class="vip-interest-item">
            <image class="vip-interest-img" src="/static/interest-item.png"/>
            <view style="margin-left: 7px">{{'定制版声音克隆×'+voucherInfos[selectedIndex].timbre}}</view>
          </view>
          <view class="vip-interest-item">
            <image class="vip-interest-img" src="/static/interest-item.png"/>
            <view style="margin-left: 7px">{{'赠送'+voucherInfos[selectedIndex].points+'积分'}}</view>
          </view>
          <view class="vip-interest-item">
            <image class="vip-interest-img" src="/static/interest-item.png"/>
            <view style="margin-left: 7px">{{'后续积分购买'+voucherInfos[selectedIndex].discount*10+'折优惠'}}</view>
          </view>
        </view>
      </view>
    </view>
    <button class="buy-btn">立即购买</button>
    <view class="voucher-footer">
      购买即同意
      <view @click="goto('/pages/agreement/membership?type=navigateTo')">《付费服务协议》</view>
      、
      <view @click="goto('/pages/agreement/user?type=navigateTo')">《用户协议》</view>
      与
      <view @click="goto('/pages/agreement/privacy?type=navigateTo')">《隐私条款》</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      selectedIndex: 0,
      voucherInfos: [],
    }
  },
  created() {
    this.queryInfo()
  },
  methods: {
    queryInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'member'
      }
      this.$http.get('/package/query/user',params).then(res => {
        if (res.status === 'success') {
          this.voucherInfos = res.data
          this.selectedIndex = 0
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
    },
    goto(path) {
      uni.redirectTo({ url: path })
    },
    back() {
      uni.switchTab({
        url: '/pages/user/index'
      })
    }
  }
}
</script>

<style scoped>
.voucher {
  height: 100vh;
  overflow-y: auto;
}
.integralRecharge {
  position: absolute;
  right: 5px;
  color: #ffffff;
}

.voucher-content {
  height: calc(100% - 180px);
  min-height: 450px;
  border-radius: 15px;
  background: linear-gradient(to bottom, rgba(233, 157, 66, 0.2), rgba(233, 157, 157, 0));
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.4);
  padding-top: 20px;
  box-sizing: border-box;
}

.voucher-list {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 0 10px;
  box-sizing: border-box;
}

.voucher-item {
  flex: 1;
  max-width: 108px;
  height: 128px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-active {
  background-color: rgba(225, 197, 156, 0.93) !important;
  color: #96750E !important;
}

.voucher-item-top {
  margin-top: 15px;
  font-size: 16px;
}

.voucher-item-center {
  margin-top: 12px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.voucher-item-bottom {
  margin-top: 20px;
  font-size: 13px;
}

.vip-interest {
  height: calc(100% - 150px);
  min-height: 280px;
  margin: 20px 20px 0;
  border-radius: 15px;
  background-image: url('/static/voucher-bg-200kb.jpg');
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 20px 30px 0;
  box-sizing: border-box;
}

.vip-interest-title {
  text-align: right;
  margin-top: 5px;
  color: #ffffff;
  font-size: 20px;
}

.vip-interest-list {
  margin-left: 15px;
  margin-top: 10px;
  color: #ffffff;
  font-size: 16px;
}

.vip-interest-item {
  display: flex;
  align-items: center;
  line-height: 50px;
}

.vip-interest-img {
  width: 25px;
  height: 25px;
}

.buy-btn {
  background-color: #e99d42;
  width: 255px;
  height: 35px;
  line-height: 35px;
  margin: 25px auto 0;
  font-size: 14px;
  border-radius: 15px;
  color: #101010;
}

.voucher-footer {
  color: #9A9A9A;
  font-size: 13px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>