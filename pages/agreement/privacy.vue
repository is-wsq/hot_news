<template>
  <view class="pages privacy" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">隐私条款</view>
    </view>
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
  methods: {
    back() {
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