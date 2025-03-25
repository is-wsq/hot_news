<template>
  <view class="pages info" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">个人资料</view>
    </view>
    <view class="info-list">
      <view class="info-item" @click="previewAvatar">
        <view class="info-label">头像</view>
        <view class="info-value"><image class="user-avatar" :src="userInfo.avatar"></image></view>
      </view>
      <view class="info-item">
        <view class="info-label">名字</view>
        <view class="info-value">奇点未来</view>
      </view>
      <view class="info-item">
        <view class="info-label">账号</view>
        <view class="info-value">17670845180</view>
      </view>
      <view class="info-item">
        <view class="info-label">性别</view>
        <view class="info-value">男</view>
      </view>
      <view class="info-item">
        <view class="info-label">地区</view>
        <view class="info-value"></view>
      </view>
    </view>

    <view class="logout-btn" @click="logout">退出登陆</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      userId: '',
      userInfo: {}
    }
  },
  onShow() {
    this.userId = uni.getStorageSync('userId') || ''
    if (this.userId !== '') {
      this.queryUserInfo()
    }
  },
  methods: {
    queryUserInfo() {
      this.$http.get('/user/query', {user_id: this.userId}).then(async res => {
        if (res.status ==='success') {
          this.userInfo = res.data
        }
      })
    },
    previewAvatar() {
      uni.navigateTo({ url: `/pages/user/previewAvatar` })
    },
    logout() {
      uni.removeStorageSync('userId')
      uni.navigateTo({
        url: '/pages/login/login?type=home'
      })
    },
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
  height: 60px;
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

.logout-btn {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  margin-top: 60px;
  font-size: 16px;
  border-bottom: 1px solid #222222;
  border-top: 1px solid #222222;
}
</style>