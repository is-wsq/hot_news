<template>
  <view class="pages template" :style="{ height: `${safeAreaHeight - 70}px` }">
    <view class="nav-bar-header">
      <view class="nav-bar-title">模板</view>
    </view>
    <view class="clone-cards">
      <view class="card figure-bg">形象克隆</view>
      <view class="card voice-bg">声音克隆</view>
    </view>
    <view style="display: flex;height: 50px;align-items: center">
      <view style="font-size: 18px; color: #fff;flex: 1">我的作品</view>
      <uni-icons type="right" size="20" color="#fff"></uni-icons>
    </view>
    <view class="video-list" style="height: calc(100% - 250px)">
      <view class="video-item" v-for="item in 10" :key="item">
        <view>
          <image class="item-img" src="/static/test-bg.png"></image>
        </view>
        <view class="item-title">暴雪中的每股中产</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'template',
  data() {
    return {
      safeAreaHeight: 0,
    }
  },
  created() {
    this.safeAreaHeight = uni.getSystemInfoSync().safeArea.height
  }
}
</script>

<style scoped>
.clone-cards {
  display: flex;
  gap: 20px;
}

.card {
  flex: 1;
  height: 120px;
  color: #fff;
  font-size: 20px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}

.figure-bg {
  background-image: url("/static/figure-bg.png");
}

.voice-bg {
  background-image: url("/static/voice-bg.png");
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-template-rows: 205px;
  gap: 20px;
  justify-items: center;
  overflow: auto;
}

.item-img {
  width: 160px;
  height: 180px;
  border-radius: 10px;
}

.item-title {
  font-size: 15px;
  color: #fff;
  width: 160px;
  text-align: center;
  margin-top: 5px;
}
</style>
