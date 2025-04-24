<template>
  <view class="pages voice-recharge">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">声音额度充值</view>
    </view>
    <view class="voice-recharge-container">
      <view style="display: flex;color: #fff">
        <view class="voice-recharge-header">
          <view style="line-height: 37px">声音额度</view>
          <view style="font-size: 20px">{{ userInfo.timbreBalance }}</view>
        </view>
        <view style="flex: 1;"></view>
        <view style="margin-top: 20px;width: 115px">
          <view style="display: flex">
            <image v-if="userInfo.userType !== 0" src="/static/royal.png" class="vip-icon"></image>
            <image v-else src="/static/royal.png" class="vip-icon"></image>
            <view class="vip-type">{{ userTypeNames.find(item => item.type === userInfo.userType).name }}</view>
          </view>
          <view class="vip-desc">{{ discounts.find(item => item.type === userInfo.userType).name }}</view>
        </view>
      </view>
      <view class="voice-recharge-content">
        <view style="margin-bottom: 10px;font-size: 14px;color: #CECECE">当前会员折扣价：{{ price }}元/个</view>
        <view class="voice-recharge-list">
          <view class="voice-recharge-item" v-for="item in recharges" :key="item.id"
                :class="{ 'voice-recharge-active': item.id === selected.id }" @click="selected = item">
            <view>{{ item.name }}</view>
            <view v-if="item.id !== 4" style="font-size: 14px;margin-top: 5px">{{ (price * item.count).toFixed(1) }}￥</view>
            <view v-if="item.id === 4 && selected.id === 4" style="font-size: 14px;margin-top: 5px">{{ (price * count).toFixed(1) }}￥</view>
          </view>
        </view>
        <input v-if="selected.id === 4" class="voice-recharge-other" v-model="count" type="number" placeholder="输入充值数字人额度数量" />
        <view v-else style="height: 64px"></view>
        <view class="top_up-desc">
          <view style="margin-bottom: 5px">充值说明：</view>
          <view>1.充值未完成时，请不要切换账户或者退出软件，请等待充值结束，否则可能会出现账户未到账的情况。若出现此类情况，请咨询客服。</view>
          <view>2.充值成功后不可提现，如其他问题，请联系客服。</view>
          <view>3.如特殊情况需要退款，请联系客服。</view>
        </view>
      </view>
      <button class="buy-btn" @click="getWeChatCode">立即购买</button>
      <view class="voice-recharge-agreement">
        购买即同意
        <view @click="goto('/pages/agreement/membership?back=integral')">《付费服务协议》</view>
        、
        <view @click="goto('/pages/agreement/user?back=integral')">《用户协议》</view>
        与
        <view @click="goto('/pages/agreement/privacy?back=integral')">《隐私条款》</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      userTypeNames: [
        { type: 0, name: '普通用户' },
        { type: 1, name: '月会员' },
        { type: 2, name: '季会员' },
        { type: 3, name: '年会员' },
      ],
      discounts: [
        { type: 0, name: '' },
        { type: 1, name: '可享9折充值优惠' },
        { type: 2, name: '可享8折充值优惠' },
        { type: 3, name: '可享7折充值优惠' },
      ],
      recharges: [
        { id: 1, name: '1个声音', count: 1 },
        { id: 2, name: '3个声音', count: 3 },
        { id: 3, name: '5个声音', count: 5 },
        { id: 4, name: '其他数量'}
      ],
      selected: { id: 1, name: '1个声音', count: 1 },
      price: 0,
      count: 1,
    }
  },
  onLoad() {
    this.queryUserInfo()
    if (uni.getStorageSync('selected')) {
      this.selected = uni.getStorageSync('selected')
      uni.removeStorageSync('selected')
    }
    if (uni.getStorageSync('count')) {
      this.count = uni.getStorageSync('count')
      uni.removeStorageSync('count')
    }
    this.queryPackageInfo()
    this.checkWeChatCode()
  },
  beforeDestroy() {
    uni.removeStorageSync('packageId')
  },
  methods: {
    queryPackageInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'timbre'
      }
      this.$http.get('/package/query/user', params).then(res => {
        if (res.status ==='success') {
          this.price = res.data.price
          uni.setStorageSync('packageId', res.data.id)
        }else {
          this.$tip.confirm(res.message, false)
        }
      })
    },
    queryUserInfo() {
      this.$http.get('/user/query', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status ==='success') {
          this.userInfo = res.data
        }
      })
    },
    isWeChat() {
      return /MicroMessenger/i.test(navigator.userAgent);
    },
    getWeChatCode() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        const redirectUri = encodeURIComponent(window.location.href)
        uni.setStorageSync('selected', this.selected)
        uni.setStorageSync('count', this.count)
        const scope = 'snsapi_base'
        const state = 'STATE123'
        window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`)
      } else {
        this.$tip.confirm('需要在微信环境下才能使用', false)
      }
    },
    getUrlCode(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
          .replace(/\+/g, '%20')) || null
    },
    checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code) {
        let params = {
          user_id: uni.getStorageSync('userId'),
          code: code,
          count: this.selected.id === 4? this.count : this.selected.count,
          package_id: uni.getStorageSync('packageId'),
        }
        this.$tip.confirm(JSON.stringify(params),false).then(() => {
          this.$http.post('/package/buy/balance', params).then(res => {
            if (res.status === 'success') {
              let self = this
              window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (result) {
                // 将回调页面重新设置成当前页面
                window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/voiceRecharge');

                if (result.err_msg === "get_brand_wcpay_request:ok") {
                  self.$tip.confirm('支付成功', false).then(() => {
                    self.queryUserInfo()
                  })
                } else if (result.err_msg === "get_brand_wcpay_request:cancel") {
                  self.$tip.confirm('已取消支付', false)
                } else {
                  self.$tip.confirm('支付失败', false)
                }
              });
            } else {
              window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/voiceRecharge');
              this.$tip.confirm(res.message, false);
            }
          })
        })
      }
    },
    goto(url) {

    },
    back() {
      uni.switchTab({ url: '/pages/user/index' })
    }
  },
}
</script>

<style scoped>
.voice-recharge {
  height: 100vh;
  color: #ffffff;
}

.voice-recharge-container {
  height: calc(100% - 58px);
}

.voice-recharge-header {
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

.voice-recharge-content {
  height: calc(100% - 195px);
  min-height: 400px;
  margin-top: 10px;
  border-radius: 15px;
  background: linear-gradient(to bottom, rgba(233, 157, 66, 0.2), rgba(233, 157, 157, 0));
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.4);
  padding: 10px 5px 5px;
  box-sizing: border-box;
}

.voice-recharge-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
  grid-auto-rows: 70px;
  gap: 12px;
}

.voice-recharge-item {
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
}

.voice-recharge-active {
  background-color: rgba(225, 197, 156, 0.93) !important;
  color: #96750E !important;
}

.voice-recharge-other {
  margin-top: 12px;
  height: 50px;
  border: 1px solid #96750E;
  padding-left: 10px;
  border-radius: 12px;
  font-size: 16px;
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
  border-radius: 10px;
  color: #101010;
}

.voice-recharge-agreement {
  color: #9A9A9A;
  font-size: 13px;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
</style>