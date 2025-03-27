<template>
  <view class="pages privacy" :style="{ height: `${safeAreaHeight}px` }">
    <web-view src="/static/pdf/pdf-view1.html?pdfUrl=/static/pdf/privacy.pdf&title=隐私条款"></web-view>
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