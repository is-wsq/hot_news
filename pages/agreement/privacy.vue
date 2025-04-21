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
      back: ''
    }
  },
  onLoad: function (option) {
    this.back = option.back
  },
  created() {
    window.addEventListener("message", this.handleMessage);
  },
  methods: {
    handleMessage() {
      if (this.back === 'index') {
        uni.switchTab({url: '/pages/user/index'})
      }else {
        uni.reLaunch({url: `/pages/user/${this.back}`})
      }
    }
  }
}
</script>

<style scoped>

</style>