<template>
  <view class="pages order">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">订单管理</view>
    </view>
    <view class="order-content" v-if="orders.length > 0">
      <view class="order-item" v-for="(item, index) in orders" :key="index" :class="{'marginBottom': index !== orders.length - 1}">
        <view class="order-item-left">
          <view class="order-item-left-title">{{ item.service_name + (item.money? '&nbsp￥'+ item.money : '') }}</view>
          <view class="order-item-left-time" v-if="item.created_at">{{ formatTime(item.created_at) }}</view>
        </view>
        <view class="order-item-right">
          <view class="order-item-right-title" v-if="item.points">积分：{{ item.points > 0? '+' + item.points : item.points }}</view>
          <view class="order-item-right-title" v-if="item.figure">形象：{{ item.figure > 0? '+' + item.figure : item.figure }}</view>
          <view class="order-item-right-title" v-if="item.timbre">声音：{{ item.timbre > 0? '+' + item.timbre : item.timbre }}</view>
        </view>
      </view>
    </view>
    <view class="empty-content" v-else>
      <uni-icons fontFamily="CustomFont" color="#434343" size="70">{{'\ue638'}}</uni-icons>
      <view class="empty-content-title">暂无交易记录</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orders: []
    }
  },
  mounted() {
    this.queryOrders()
  },
  methods: {
    queryOrders() {
      if (!uni.getStorageSync('userId')) {
        this.$tip.confirm('请先登录',false).then(() => {
          this.toLogin()
        })
        return
      }
      this.$http.get('/transactions/query/user',{user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.orders = res.data
        }else {
          this.$tip.toast(res.message)
        }
      })
    },
    formatTime(isoString) {
      const parts = isoString.split('T')
      if (parts.length !== 2) return 'Invalid Date'
      return parts[0].replace(/-/g, '/') + ' ' + parts[1]
    },
    toLogin() {
      uni.setStorageSync('login_router', {
        type: 'redirectTo',
        path: '/pages/user/order'
      })
      uni.redirectTo({url: '/pages/login/login'})
    },
    back() {
      uni.switchTab({ url: '/pages/user/index' })
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

.order {
  height: 100vh;
}

.order-content {
  height: calc(100vh - 58px);
  overflow-y: auto;
}

.empty-content {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-content-title {
  color: #434343;
  font-size: 18px;
  margin-top: 10px;
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