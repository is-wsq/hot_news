<template>
  <view class="pages membership" :style="{ height: `${safeAreaHeight}px` }">
    <web-view src="/static/pdf-view1.html?pdfUrl=/static/figure.pdf&title=付费服务协议"></web-view>
  </view>
</template>

<script>
export default {
  name: 'Privacy',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      backType: ''
    }
  },
  onLoad: function (option) {
    this.backType = option.type
  },
  created() {
    window.addEventListener("message", this.handleMessage);
  },
  methods: {
    handleMessage() {
      if (this.backType === 'navigateTo') {
        uni.navigateBack()
      }else {
        uni.switchTab({url: '/pages/user/index'})
      }
    }
  }
}
</script>

<style scoped>

</style>