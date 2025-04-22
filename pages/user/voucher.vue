<template>
  <view class="pages voucher">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">充值服务</view>
      <view class="integralRecharge" @click="goto('/pages/user/integral')">积分充值</view>
    </view>
    <view class="voucher-content">
      <view class="voucher-list">
        <view class="voucher-item" v-for="item in voucherInfos" :key="item.id"
              :class="{ 'item-active': item.id === selectedVoucher.id }" @click="changePackage(item)">
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
            <view style="margin-left: 7px">{{ '定制版数字人形象×' + selectedVoucher.figure }}</view>
          </view>
          <view class="vip-interest-item">
            <image class="vip-interest-img" src="/static/interest-item.png"/>
            <view style="margin-left: 7px">{{ '定制版声音克隆×' + selectedVoucher.timbre }}</view>
          </view>
          <view class="vip-interest-item">
            <image class="vip-interest-img" src="/static/interest-item.png"/>
            <view style="margin-left: 7px">{{ '赠送' + selectedVoucher.points + '积分' }}</view>
          </view>
          <view class="vip-interest-item">
            <image class="vip-interest-img" src="/static/interest-item.png"/>
            <view style="margin-left: 7px">{{ '后续积分购买' + selectedVoucher.discount * 10 + '折优惠' }}</view>
          </view>
        </view>
      </view>
    </view>
    <button class="buy-btn" @click="getWeChatCode">立即购买</button>
    <view class="voucher-footer">
      购买即同意
      <view @click="goto('/pages/agreement/membership?back=voucher')">《付费服务协议》</view>
      、
      <view @click="goto('/pages/agreement/user?back=voucher')">《用户协议》</view>
      与
      <view @click="goto('/pages/agreement/privacy?back=voucher')">《隐私条款》</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      voucherInfos: [],
      selectedVoucher: {},
    }
  },
  onLoad() {
    this.queryInfo()
    this.checkWeChatCode()
  },
  beforeDestroy() {
    uni.removeStorageSync('packageId')
  },
  methods: {
    isWeChat() {
      return /MicroMessenger/i.test(navigator.userAgent);
    },
    getWeChatCode() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        const redirectUri = encodeURIComponent(window.location.href)
        this.$tip.confirm(window.location.href, false).then(() => {
          const scope = 'snsapi_base'
          const state = 'STATE123'
          uni.setStorageSync('wxpay', true)
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
        })
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
      uni.setStorageSync('wxpay', false)
      if (code) {
        let params = {
          user_id: uni.getStorageSync('userId'),
          code: code,
          package_id: uni.getStorageSync('packageId'),
        }
        this.$http.post('/package/buy', params).then(res => {
          this.$tip.confirm(JSON.stringify(params), false).then(() => {
            if (res.status === 'success') {
              let self = this
              window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (result) {
                const cleanUrl = window.location.origin + window.location.pathname;
                self.$tip.confirm(cleanUrl, false).then(() => {
                  window.history.replaceState({}, '', cleanUrl);
                  if (result.err_msg === "get_brand_wcpay_request:ok") {
                    self.$tip.confirm('支付成功', false)
                  } else if (result.err_msg === "get_brand_wcpay_request:cancel") {
                    self.$tip.confirm('已取消支付', false)
                  } else {
                    self.$tip.confirm('支付失败', false)
                  }
                })
              });
            } else {
              this.$tip.confirm(res.message, false);
            }
          })
        })
      }
    },
    queryInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'member'
      }
      this.$http.get('/package/query/user', params).then(res => {
        if (res.status === 'success') {
          this.voucherInfos = res.data
          if (uni.getStorageSync('packageId')) {
            this.selectedVoucher = this.voucherInfos.find(item => item.id === uni.getStorageSync('packageId')) || {}
          }else {
            this.selectedVoucher = res.data[0] || {}
            uni.setStorageSync('packageId', this.selectedVoucher.id)
          }
        } else {
          this.$tip.confirm(res.message, false);
        }
      })
    },
    changePackage(item) {
      this.selectedVoucher = item
      uni.setStorageSync('packageId', item.id)
    },
    goto(path) {
      uni.redirectTo({url: path})
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