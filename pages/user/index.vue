<template>
  <view class="pages user" :style="{ height: `${safeAreaHeight - 70}px` }">
    <view class="user-info">
      <image class="user-avatar" src="/static/test-bg.png" mode="aspectFit" @click="goto('/pages/user/info')"></image>
      <view class="user-account">
        <view class="user-phone">17670845180</view>
        <view class="user-identity">普通用户</view>
      </view>
    </view>
    <view class="identity-card">
      <view style="display: flex">
        <view style="color: #BBBBBB; font-size: 14px;flex: 1"></view>
        <button class="membership">开通VIP</button>
      </view>
      <view class="identity-detail">
        <view style="text-align: center">
          <view class="detail-value">5</view>
          <view class="detail-name">数字人额度</view>
        </view>
        <view style="text-align: center">
          <view class="detail-value">12000</view>
          <view class="detail-name">积分余额</view>
        </view>
      </view>
    </view>
    <view class="asset-text">我的资产</view>
    <view class="asset-list">
      <view class="asset-item">
        <view class="asset-value">{{ asset.figure }}</view>
        <view class="asset-name">我的数字人</view>
      </view>
      <view class="asset-item">
        <view class="asset-value">{{ asset.voice }}</view>
        <view class="asset-name">我的声音</view>
      </view>
    </view>
    <view class="function-list">
      <view style="background-color: #282828;border-radius: 10px;padding: 5px 20px;box-sizing: border-box">
        <view style="display: flex" v-for="item in functions" :key="item.name" @click="goto(item.path)">
          <view style="flex: 1;color: #fff;font-size: 14px;line-height: 40px">{{ item.name }}</view>
          <uni-icons style="line-height: 40px" type="right" size="15" color="#8c8c8c"></uni-icons>
        </view>
        <!--        <view style="display: flex">-->
        <!--          <view style="flex: 1;color: #fff;font-size: 14px;line-height: 40px">新手引导</view>-->
        <!--          <uni-icons style="line-height: 40px" type="right" size="15" color="#8c8c8c" ></uni-icons>-->
        <!--        </view>-->
        <!--        <view style="display: flex">-->
        <!--          <view style="flex: 1;color: #fff;font-size: 14px;line-height: 40px">隐私条款</view>-->
        <!--          <uni-icons style="line-height: 40px" type="right" size="15" color="#8c8c8c" ></uni-icons>-->
        <!--        </view>-->
        <!--        <view style="display: flex" @click="goto('/pages/user/agreement')">-->
        <!--          <view style="flex: 1;color: #fff;font-size: 14px;line-height: 40px">用户协议</view>-->
        <!--          <uni-icons style="line-height: 40px" type="right" size="15" color="#8c8c8c" ></uni-icons>-->
        <!--        </view>-->
        <!--        <view style="display: flex">-->
        <!--          <view style="flex: 1;color: #fff;font-size: 14px;line-height: 40px">订单管理</view>-->
        <!--          <uni-icons style="line-height: 40px" type="right" size="15" color="#8c8c8c" ></uni-icons>-->
        <!--        </view>-->
        <!--        <view style="display: flex">-->
        <!--          <view style="flex: 1;color: #fff;font-size: 14px;line-height: 40px">联系客服</view>-->
        <!--          <uni-icons style="line-height: 40px" type="right" size="15" color="#8c8c8c" ></uni-icons>-->
        <!--        </view>-->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'user',
  data() {
    return {
      isLoading: false,
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      asset: {
        figure: 0,
        voice: 0
      },
      functions: [
        {name: '新手引导', path: ''},
        {name: '隐私条款', path: ''},
        {name: '用户协议', path: '/pages/user/agreement'},
        {name: '订单管理', path: ''},
        {name: '联系客服', path: ''},
      ]
    }
  },
  mounted() {
    this.queryFigures()
    this.queryVoices()
  },
  methods: {
    queryFigures() {
      this.$http.get('/figure/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.asset.figure = res.data.reduce((count, item) => item.type === 'clone' ? count + 1 : count, 0);
        } else {
          this.$tip.toast(res.message)
        }
      })
    },
    queryVoices() {
      this.$http.get('/timbres/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.asset.voice = res.data.reduce((count, item) => item.type === 'clone' ? count + 1 : count, 0);
        } else {
          this.$tip.toast(res.message)
        }
      })
    },
    goto(url) {
      if (url === '')
        return
      uni.navigateTo({url: url})
    }
  }
}
</script>

<style scoped>
.user-info {
  height: 120px;
  padding: 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.user-avatar {
  width: 80px;
  height: 80px;
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
}

.identity-card {
  height: 130px;
  background-image: url('/static/identity-bg1.png');
  background-size: cover;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 15px;
}

.membership {
  width: 80px;
  height: 35px;
  background-image: url('/static/identity-bg1.png');
  background-size: 80px 35px;
  color: #fff;
  font-size: 14px;
}

.identity-detail {
  color: #fff;
  display: flex;
  height: 54px;
  margin-top: 15px;
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
  margin-top: 20px;
  margin-left: 30px;
  color: #fff;
  font-size: 16px;
  line-height: 35px;
}

.asset-list {
  height: 90px;
  display: flex;
  gap: 22px;
  justify-content: center;
  align-items: center;
}

.asset-item {
  width: 135px;
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
  height: calc(100% - 430px);
  overflow-y: auto;
}
</style>