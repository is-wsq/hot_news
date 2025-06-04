<template>
  <view class="contact-us">
    <view class="contact-us-content">
      <uni-icons class="contact-us-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="contact-us-title">联系我们</view>
      <image ref="content" src="/static/img/contact-us.png" alt="背景图片" class="cover-image"/>
    </view>
    <view style="display: flex;align-items: center;height: 60px;border-bottom: 1px solid #444444">
      <uni-icons type="phone" size="28" color="#ffffff" class="contact-us-icon" style="margin-left: 20px"></uni-icons>
      <view style="flex: 1;margin-left: 20px;font-size: 16px;font-weight: bold;color: #ffffff">123-4567-890</view>
      <button class="contact-us-btn" @click="call">拨打</button>
    </view>
    <view style="display: flex;align-items: center;height: 60px;border-bottom: 1px solid #444444">
      <uni-icons type="email" size="28" color="#ffffff" class="contact-us-icon" style="margin-left: 20px"></uni-icons>
      <view style="flex: 1;margin-left: 20px;font-size: 16px;font-weight: bold;color: #ffffff">Singai@foxmail.com</view>
      <button class="contact-us-btn" @click="copyEmail">复制</button>
    </view>
    <view class="company-logo">广东省奇点未来软件研发</view>
    <view style="display: flex;justify-content: center">
      <image src="/static/img/qrcode.png" alt="logo" style="width: 250px;height: 250px;margin-top: 10px"/>
    </view>
    <view style="text-align: center;margin-top: 10px;font-size: 14px;color: #999999">长按识别图中二维码</view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    call() {
      window.location.href = 'tel:123-4567-890'
    },
    copyEmail() {
      let self = this
      uni.setClipboardData({
        data: 'Singai@foxmail.com',
        showToast: false,
        success: function () {
          self.$tip.confirm('复制成功',false)
        }
      });
    },
    back() {
      uni.switchTab({url: '/pages/user/index'})
    }
  }
}
</script>

<style scoped>
.contact-us {
  height: 100vh;
  background-color: #000000;
}

.contact-us-content {
  display: flex;
  justify-content: center;
  line-height: 56px;
  position: relative;
}

.contact-us-title {
  position: absolute;
  color: #ffffff;
  font-size: 16px;
  display: flex;
  z-index: 999;
}

.contact-us-back {
  position: absolute;
  left: 0;
  z-index: 999;
}

.cover-image {
  width: 100%;
}

.company-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}

.contact-us-btn {
  border: 1px solid #444444;
  margin-right: 20px;
  border-radius: 20px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #ffffff;
  background-color: #000000;
}
</style>