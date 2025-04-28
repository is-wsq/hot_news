<template>
  <view class="pages user" :style="{ height: `${safeAreaHeight - 69.8}px` }">
    <view class="user-info" v-if="userId !== ''">
      <image class="user-avatar" :src="userInfo.avatar" @click="goto('/pages/user/info')"></image>
      <view class="user-account">
        <view class="user-phone">{{ userInfo.username }}</view>
        <view style="display: flex">
          <view class="user-identity">{{ userTypeName  }}</view>
          <view style="font-size: 12px;color: #BBBBBB;line-height: 30px">{{'有效期至' + userInfo.expire_time.replace('T',' ')}}</view>
        </view>
      </view>
    </view>
    <view class="user-info" v-else @click="goto('/pages/login/login?type=switchTab&path=/pages/user/index')">
      <view class="user-avatar"></view>
      <view class="user-account">
        <view class="user-phone">暂未登录</view>
      </view>
    </view>
    <view class="identity-card">
      <view style="display: flex">
        <view style="color: #BBBBBB; font-size: 14px;flex: 1"></view>
        <button class="membership" @click="openVIP">开通VIP</button>
      </view>
      <view class="identity-detail">
        <view style="text-align: center" @click="goto('/pages/user/figureRecharge')">
          <view class="detail-value">{{ userInfo.figureBalance || 0 }}</view>
          <view class="detail-name">数字人额度</view>
        </view>
        <view style="text-align: center" @click="goto('/pages/user/voiceRecharge')">
          <view class="detail-value">{{ userInfo.timbreBalance || 0 }}</view>
          <view class="detail-name">声音额度</view>
        </view>
        <view style="text-align: center" @click="goto('/pages/user/integral')">
          <view class="detail-value">{{ userInfo.points || 0 }}</view>
          <view class="detail-name">积分余额</view>
        </view>
      </view>
    </view>
    <view class="asset-text">我的资产</view>
    <view class="asset-list">
      <view class="asset-item" @click="goto('/pages/user/figure')">
        <view class="asset-value">{{ userInfo.figure || 0 }}</view>
        <view class="asset-name">我的数字人</view>
      </view>
      <view class="asset-item" @click="goto('/pages/user/voice')">
        <view class="asset-value">{{ userInfo.timbre || 0 }}</view>
        <view class="asset-name">我的声音</view>
      </view>
    </view>
    <view class="function-list">
      <view style="background-color: #282828;border-radius: 10px;padding: 5px 20px;box-sizing: border-box">
        <view style="display: flex" v-for="item in functions" :key="item.name" @click="goto(item.path)">
          <view style="flex: 1;color: #fff;font-size: 14px;line-height: 40px">{{ item.name }}</view>
          <uni-icons style="line-height: 40px" type="right" size="15" color="#8c8c8c"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'user',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      userId: '',
      userInfo: {},
      userTypeNames: [
        { type: 0, name: '普通用户' },
        { type: 1, name: '月会员' },
        { type: 2, name: '季会员' },
        { type: 3, name: '年会员' },
      ],
      userTypeName: '',
      functions: [
        {name: '隐私条款', path: '/pages/agreement/privacy?back=index'},
        {name: '用户协议', path: '/pages/agreement/user?back=index'},
        {name: '付费服务协议', path: '/pages/agreement/membership?back=index'},
        {name: '订单管理', path: '/pages/user/order'},
        {name: '联系客服', path: '/pages/user/contactUs'},
      ]
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
          this.userTypeName = this.userTypeNames.find(item => item.type === this.userInfo.userType).name
        }
      })
    },
    openVIP() {
      if (this.userId === '') {
        this.$tip.confirm('请先登录',false).then(() => {
          uni.redirectTo({url: '/pages/login/login?type=switchTab&path=/pages/user/index'})
        })
        return
      }
      uni.removeStorageSync('packageId')
      this.goto('/pages/user/voucher')
    },
    goto(url) {
      if (url === '')
        return
      uni.redirectTo({url: url})
    }
  }
}
</script>

<style scoped>
.user-info {
  height: 80px;
  padding: 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.user-avatar {
  width: 60px;
  height: 60px;
  margin-right: 25px;
  background-color: #ccc;
  border-radius: 50%;
}

.user-account {
  flex: 1;
}

.user-phone {
  color: #fff;
  font-size: 18px;
  line-height: 30px;
  font-weight: bold;
}

.user-identity {
  color: #BBBBBB;
  font-size: 14px;
  line-height: 30px;
  font-weight: bold;
  margin-right: 10px;
}

.identity-card {
  height: 130px;
  background-image: url('/static/voucher-bg.jpg');
  background-size: cover;
  background-position: 0 210px;
  padding: 10px 15px;
  box-sizing: border-box;
  border-radius: 12px;
}

.membership {
  width: 80px;
  height: 35px;
  border-radius: 8px;
  background-image: url('/static/voucher-bg.jpg');
  background-position: 80px 170px;
  background-size: revert;
  background-color: #E5E5E5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 14px;
}

.identity-detail {
  width: calc(100% - 50px);
  color: #fff;
  display: flex;
  justify-content: space-between;
  height: 54px;
  margin-top: 20px;
  gap: 25px;
}

.detail-value {
  line-height: 31px;
  font-size: 18px;
  font-weight: bold;
}

.detail-name {
  line-height: 23px;
  font-size: 12px;
}

.asset-text {
  margin-top: 5px;
  margin-left: 15px;
  color: #fff;
  font-size: 16px;
  line-height: 35px;
}

.asset-list {
  margin-top: 5px;
  display: flex;
  gap: 22px;
}

.asset-item {
  flex: 1;
  height: 75px;
  background-color: #282828;
  border-radius: 10px;
  padding-left: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.asset-value {
  font-size: 20px;
  line-height: 30px;
  font-weight: bold;
  color: #fff;
}

.asset-name {
  font-size: 14px;
  line-height: 30px;
  color: #BBBBBB;
}

.function-list {
  margin-top: 15px;
  height: calc(100% - 330px);
  overflow-y: auto;
}
</style>