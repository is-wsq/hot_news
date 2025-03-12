<template>
  <view class="pages info" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">个人资料</view>
    </view>
    <view class="info-list">
      <view class="info-item">
        <view class="info-label">头像</view>
        <view class="info-value"><image class="user-avatar" src="/static/test-bg.png"></image></view>
        <uni-icons style="line-height: 40px" type="right" size="21" color="#9A9A9A" @click="back"></uni-icons>
      </view>
      <view class="info-item">
        <view class="info-label">名字</view>
        <view class="info-value">奇点未来</view>
        <uni-icons style="line-height: 40px" type="right" size="21" color="#9A9A9A" @click="back"></uni-icons>
      </view>
      <view class="info-item">
        <view class="info-label">账号</view>
        <view class="info-value">17670845180</view>
        <uni-icons style="line-height: 40px" type="right" size="21" color="#9A9A9A" @click="back"></uni-icons>
      </view>
      <view class="info-item">
        <view class="info-label">性别</view>
        <view class="info-value">男</view>
        <uni-icons style="line-height: 40px" type="right" size="21" color="#9A9A9A" @click="back"></uni-icons>
      </view>
      <view class="info-item">
        <view class="info-label">地区</view>
        <view class="info-value"></view>
        <uni-icons style="line-height: 40px" type="right" size="21" color="#9A9A9A" @click="back"></uni-icons>
      </view>
      <view class="info-item" style="margin-top: 30px">
        <view class="info-label">退出登陆</view>
        <uni-icons style="line-height: 40px" type="right" size="21" color="#9A9A9A" @click="back"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
.info-item {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #222222;
}

.info-label {
  flex: 1;
  color: #ffffff;
  font-size: 16px;
}

.info-value {
  margin-right: 10px;
  color: #9A9A9A;
  font-size: 16px;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 5px;
}
</style>