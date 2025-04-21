<template>
  <view class="pages order">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">订单管理</view>
    </view>
    <view class="order-content">
      <view class="order-item" v-for="(item, index) in orders" :key="index" :class="{'marginBottom': index !== orders.length - 1}">
        <view class="order-item-left">
          <view class="order-item-left-title">{{ item.title }}</view>
          <view class="order-item-left-time">{{ item.time }}</view>
        </view>
        <view class="order-item-right">
          <view class="order-item-right-title">积分：{{ item.score > 0? '+' + item.score : item.score }}</view>
          <view class="order-item-right-title" v-if="item.figure !== 0">形象：{{ item.figure > 0? '+' + item.figure : item.figure }}</view>
          <view class="order-item-right-title" v-if="item.voice !== 0">声音：{{ item.voice > 0? '+' + item.voice : item.voice }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orders: [
        { title: '克隆形象', time: '2025/4/6 18:23', score: -25, figure: 0, voice: 0 },
        { title: '生成视频', time: '2025/4/6 18:23', score: -25, figure: 0, voice: 0 },
        { title: '搜索新闻', time: '2025/4/6 18:23', score: -25, figure: 0, voice: 0 },
        { title: '会员购买（季度）￥100', time: '2025/4/6 18:23', score: 300000, figure: 3, voice: 3 },
        { title: '积分充值 ￥20', time: '2025/4/6 18:23', score: 600, figure: 0, voice: 0 },
      ]
    }
  },
  methods: {
    back() {
      uni.switchTab({ url: '/pages/user/index' })
    }
  }
}
</script>

<style scoped>
.order {
  height: 100vh;
}

.order-content {
  height: calc(100vh - 58px);
  overflow-y: auto;
}

.order-item {
  height: 80px;
  background-color: rgba(211, 211, 211, 0.15);
  display: flex;
}

.marginBottom {
  margin-bottom: 10px;
}

.order-item-left {
  flex: 1;
  display: flex;
  padding-left: 40px;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.order-item-left-title {
  font-size: 14px;
  color: #ffffff;
}

.order-item-left-time {
  font-size: 13px;
  color: #F2F0F0
}

.order-item-right {
  padding: 8px 0;
  width: 120px;
}

.order-item-right-title {
  font-size: 14px;
  color: #ffffff;
  line-height: 21px;
}
</style>