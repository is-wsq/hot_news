<template>
  <view class="pages agreement" :style="{ height: `${safeAreaHeight}px` }">
    <web-view src="/static/pdf-view.html?url=/static/figure.pdf&height=300px&width=100%"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
    }
  },
  created() {
    window.addEventListener("message", this.handleMessage);
  },
  mounted() {

  },
  methods: {
    handleMessage(event) {
      if (event.data === 'back') {
        uni.switchTab({url: '/pages/user/index'})
      }
    },
  }
}
</script>

<style scoped>

</style>