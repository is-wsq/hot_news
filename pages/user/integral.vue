<template>
  <view class="pages integral" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">积分充值</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Integral',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>

</style>