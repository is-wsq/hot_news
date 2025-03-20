<template>
  <view class="pages agreement" :style="{ height: `${safeAreaHeight}px` }">
    <web-view src="/static/pdf-view.html"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      backType: ''
    }
  },
  created() {
    window.addEventListener("message", this.handleMessage);
  },
  onLoad: function (option) {
    this.backType = option.type
  },
  methods: {
    handleMessage(event) {
      if (event.data === 'back') {
        if (this.backType === 'navigateTo') {
          console.log('navigateTo')
          uni.navigateBack()
        }else {
          console.log('switchTab')
          uni.switchTab({url: '/pages/user/index'})
        }
      }
    },
  }
}
</script>

<style scoped>

</style>