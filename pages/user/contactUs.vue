<template>
  <view class="contact-us">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">联系我们</view>
    </view>
    <view class="contact-us-content">
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      back() {
        uni.switchTab({ url: '/pages/user/index' })
      }
    }
  }
</script>

<style scoped>
.contact-us {
  background-color: #000000;
}
.contact-us-content {
  height: calc(100vh - 56px);
  background-image: url('/static/img/contact_us.png');
  background-size: cover;
  background-position: center top;
}
</style>