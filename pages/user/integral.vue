<template>
  <view class="pages integral">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">积分充值</view>
    </view>
    <view class="integral-container">
      <view style="display: flex;color: #fff">
        <view class="integral-header">
          <view style="line-height: 37px">积分余额</view>
          <view style="font-size: 20px">{{ info.user_points }}</view>
        </view>
        <view style="flex: 1;"></view>
        <view style="margin-top: 20px;width: 115px">
          <view style="display: flex">
            <image v-if="info.member !== '普通会员'" src="/static/royal.png" class="vip-icon"></image>
            <image v-else src="/static/royal.png" class="vip-icon"></image>
            <view class="vip-type">{{ info.member }}</view>
          </view>
          <view class="vip-desc">{{ info.discount === 1 ? '': `可享${info.discount*10}折充值优惠` }}</view>
        </view>
      </view>
      <view class="integral-content">
        <view class="integral-list">
          <view class="integral-item" v-for="item in integralList" :key="item"
                :class="{ 'integral-active': item === selected }" @click="selected = item">
            <view style="display: flex;align-items: center">
              <view class="integral-name">{{ item }}</view>
              <image v-if="item === selected" src="/static/amount-active.png" class="integral-icon"></image>
              <image v-else src="/static/amount.png" class="integral-icon"></image>
            </view>
            <view class="integral-price">{{ (item / 1000 * info.unit_price).toFixed(1) }}￥</view>
          </view>
        </view>
        <view class="top_up-desc">
          <view style="margin-bottom: 5px">充值说明：</view>
          <view>1.充值未完成时，请不要切换账户或者退出软件，请等待充值结束，否则可能会出现账户未到账的情况。若出现此类情况，请咨询客服。</view>
          <view>2.充值成功后不可提现，如其他问题，请联系客服。</view>
          <view>3.如特殊情况需要退款，请联系客服。</view>
        </view>
      </view>
      <button class="buy-btn">立即购买</button>
      <view class="integral-footer">
        购买即同意
        <view @click="goto('/pages/agreement/membership?type=navigateTo')">《付费服务协议》</view>
        、
        <view @click="goto('/pages/agreement/user?type=navigateTo')">《用户协议》</view>
        与
        <view @click="goto('/pages/agreement/privacy?type=navigateTo')">《隐私条款》</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Integral',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      integralList: [1000, 2000, 3000, 5000, 10000, 20000],
      selected: 1000,
      info: {},
    }
  },
  mounted() {
    this.queryInfo()
  },
  methods: {
    queryInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'token'
      }
      this.$http.get('/package/query/user',params).then(res => {
        if (res.status === 'success') {
          this.info = res.data
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
    },
    goto(path) {
      uni.redirectTo({url: path})
    },
    back() {
      uni.redirectTo({
        url: '/pages/user/voucher'
      })
    }
  }
}
</script>

<style scoped>
.integral {
  height: 100vh;
}

.integral-container {
  height: calc(100% - 56px);
  overflow-y: auto;
}

.integral-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}

.vip-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.vip-type {
  line-height: 20px;
  height: 20px;
}

.vip-desc {
  font-size: 14px;
  color: #AF8A18;
  height: 20px;
  margin-top: 5px;
}

.integral-content {
  height: calc(100% - 195px);
  min-height: 400px;
  margin-top: 10px;
  border-radius: 15px;
  background: linear-gradient(to bottom, rgba(233, 157, 66, 0.2), rgba(233, 157, 157, 0));
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.4);
  padding: 20px 5px 5px;
  box-sizing: border-box;
}

.integral-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
  grid-auto-rows: 92px;
  gap: 12px;
}

.integral-item {
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
}

.integral-active {
  background-color: rgba(225, 197, 156, 0.93) !important;
  color: #96750E !important;
}

.integral-name {
  line-height: 30px;
  font-size: 20px;
}

.integral-icon {
  width: 16px;
  height: 16px;
  margin-left: 2px;
}

.integral-price {
  font-size: 14px;
  color: #FFFFFF;
}

.top_up-desc {
  color: #CECECE;
  margin-top: 15px;
  padding: 0 10px;
  box-sizing: border-box;
}

.buy-btn {
  background-color: #e99d42;
  width: 255px;
  height: 35px;
  line-height: 35px;
  margin: 20px auto 0;
  font-size: 14px;
  border-radius: 15px;
  color: #101010;
}

.integral-footer {
  color: #9A9A9A;
  font-size: 13px;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
</style>