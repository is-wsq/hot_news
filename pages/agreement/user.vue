<template>
  <view class="pages agreement" :style="{ height: `${safeAreaHeight}px` }">
    <web-view src="/static/pdf/pdf-view.html"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      back: ''
    }
  },
  created() {
    window.addEventListener("message", this.handleMessage);
  },
  onLoad: function (option) {
    this.back = option.back
  },
  methods: {
    handleMessage(event) {
      if (event.data === 'back') {
        if (this.back === 'index') {
          uni.switchTab({url: '/pages/user/index'})
        }else {
          uni.reLaunch({url: `/pages/user/${this.back}`})
        }
      }
    },
  }
}
</script>

<style scoped>

</style>