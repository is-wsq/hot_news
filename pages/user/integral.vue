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
            <image v-if="info.member !== '普通会员'" src="/static/royal-vip.png" class="vip-icon"></image>
            <image v-else src="/static/royal.png" class="vip-icon"></image>
            <view class="vip-type">{{ info.member }}</view>
          </view>
          <view class="vip-desc">{{ info.discount === 1 ? '': `可享${info.discount*10}折充值优惠` }}</view>
        </view>
      </view>
      <view class="integral-content">
        <view class="integral-list">
          <view class="integral-item" v-for="item in packages" :key="item.id"
                :class="{ 'integral-active': item.id === selectedPackage.id }" @click="changePackage(item)">
            <view style="display: flex;align-items: center">
              <view class="integral-name">{{ item.points }}</view>
              <image v-if="item.id === selectedPackage.id" src="/static/amount-active.png" class="integral-icon"></image>
              <image v-else src="/static/amount.png" class="integral-icon"></image>
            </view>
            <view class="integral-price">{{ item.price }}￥</view>
          </view>
        </view>
        <view class="top_up-desc">
          <view style="margin-bottom: 5px">充值说明：</view>
          <view>1.充值未完成时，请不要切换账户或者退出软件，请等待充值结束，否则可能会出现账户未到账的情况。若出现此类情况，请咨询客服。</view>
          <view>2.充值成功后不可提现，如其他问题，请联系客服。</view>
          <view>3.如特殊情况需要退款，请联系客服。</view>
        </view>
      </view>
      <button class="buy-btn" @click="getWeChatCode">立即购买</button>
      <view class="integral-footer">
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
  name: 'Integral',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      info: {},
      packages: [],
      selectedPackage: {},
      jssdkConfig: null // 用于存储 JSSDK 配置信息
    }
  },
  onLoad() {
    this.queryInfo()
    // this.initJSSDK() // 初始化 JSSDK
    this.checkWeChatCode()
  },
  beforeDestroy() {
    uni.removeStorageSync('packageId')
  },
  methods: {
    isWeChat() {
      return /MicroMessenger/i.test(navigator.userAgent);
    },
    async initJSSDK() {
      if (this.isWeChat()) {
        try {
          const url = window.location.href.split('#')[0]
          // 从后端获取 JSSDK 配置信息
          const response = await this.$http.get('/getJSSDKConfig', {params: {url}})
          this.jssdkConfig = response.data
          wx.config({
            debug: false, // 开启调试模式
            appId: this.jssdkConfig.appId,
            timestamp: this.jssdkConfig.timestamp,
            nonceStr: this.jssdkConfig.nonceStr,
            signature: this.jssdkConfig.signature,
            jsApiList: ['chooseWXPay'] // 需要使用的 JS 接口列表
          })
          wx.ready(() => {
            console.log('JSSDK 初始化成功')
          })
          wx.error((res) => {
            console.error('JSSDK 初始化失败', res)
          })
        } catch (error) {
          console.error('获取 JSSDK 配置信息失败', error)
        }
      }
    },
    async initPayment() {
      if (this.isWeChat()) {
        try {
          const params = {
            user_id: uni.getStorageSync('userId'),
            package_id: uni.getStorageSync('packageId'),
          }
          const res = await this.$http.post('/package/buy', params)
          if (res.status === 'success') {
            wx.chooseWXPay({
              timestamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: (result) => {
                if (result.errMsg === "chooseWXPay:ok") {
                  this.$tip.confirm('支付成功', false).then(() => {
                    this.queryInfo()
                  })
                } else {
                  this.$tip.confirm('支付失败', false)
                }
              },
              cancel: () => {
                this.$tip.confirm('已取消支付', false)
              },
              fail: (err) => {
                this.$tip.confirm('支付失败', false)
              }
            })
          } else {
            this.$tip.confirm(res.message, false);
          }
        } catch (error) {
          console.error('支付请求出错', error)
          this.$tip.confirm('支付请求出错，请稍后重试', false)
        }
      } else {
        this.$tip.confirm('需要在微信环境下才能使用', false)
      }
    },
    getWeChatCode() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        const redirectUri = encodeURIComponent(window.location.href)
        uni.setStorageSync('redirectUri', window.location.href)
        const scope = 'snsapi_base'
        const state = 'STATE123'
        const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&forcePopup=true#wechat_redirect`;

        location.replace(authUrl)
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
          package_id: uni.getStorageSync('packageId'),
        }
        this.$http.post('/package/buy', params).then(res => {
          if (res.status === 'success') {
            let self = this
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (result) {
              // 将回调页面重新设置成当前页面
              history.replaceState({}, '', 'https://tellai.tech/#/pages/user/integral');

              if (result.err_msg === "get_brand_wcpay_request:ok") {
                self.$tip.confirm('支付成功', false).then(() => {
                  self.queryInfo()
                })
              } else if (result.err_msg === "get_brand_wcpay_request:cancel") {
                self.$tip.confirm('已取消支付', false)
              } else {
                self.$tip.confirm('支付失败', false)
              }
            });
          } else {
            history.replaceState({}, '', 'https://tellai.tech/#/pages/user/integral');
            this.$tip.confirm(res.message, false);
          }
        })
      }
    },
    queryInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'token'
      }
      this.$http.get('/package/query/user', params).then(res => {
        if (res.status === 'success') {
          this.info = res.data.user_info;
          console.log(this.info)
          this.packages = res.data.packages;
          if (uni.getStorageSync('packageId')) {
            this.selectedPackage = this.packages.find(item => item.id === uni.getStorageSync('packageId'))
          } else {
            this.selectedPackage = this.packages[0] || {}
            uni.setStorageSync('packageId', this.selectedPackage.id)
          }
        } else {
          this.$tip.confirm(res.message, false);
        }
      })
    },
    changePackage(item) {
      this.selectedPackage = item
      uni.setStorageSync('packageId', item.id)
    },
    goto(path) {
      uni.redirectTo({url: path})
    },
    back() {
      uni.switchTab({url: '/pages/user/index'})
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
  border-radius: 10px;
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