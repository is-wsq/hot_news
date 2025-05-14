<template>
  <view class="container">
    正在登录中，请稍候...
  </view>
</template>

<script>
export default {
  onLoad() {
    this.checkWeChatCode()
  },
  methods: {
    getUrlCode(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
          .replace(/\+/g, '%20')) || null
    },
    checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code && uni.getStorageSync('authorized')) {
        uni.removeStorageSync('authorized');
        this.loginByCode(code)
      }
    },
    loginByCode(code) {
      this.$http.get('/user/wx/auth',{code: code}).then(res => {
        if (res.status ==='success') {
          uni.setStorageSync('userId', res.data.user_id)
          uni.switchTab({ url: '/pages/home/index' })
        }else {
          this.$tip.confirm(res.message,false);
        }
      }).catch(err => {
        this.$tip.confirm(JSON.stringify(err),false);
      })
    }
  }
}
</script>

<style>
.container {
  padding: 30rpx;
}
</style>