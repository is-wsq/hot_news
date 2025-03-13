<template>
  <view class="pages template" :style="{ height: `${safeAreaHeight - 70}px` }">
<!--    <view class="nav-bar-header">-->
<!--      <view class="nav-bar-title">模板</view>-->
<!--    </view>-->
    <view class="clone-cards">
      <view class="card figure-bg" @click="goto('/pages/template/figure')">形象克隆</view>
      <view class="card voice-bg" @click="goto('/pages/template/voices')">声音克隆</view>
    </view>
    <view style="font-size: 18px; color: #fff;line-height: 50px">我的作品</view>
    <view class="video-list" style="height: calc(100% - 180px)">
      <view class="video-item" v-for="item in 10" :key="item">
        <image class="item-img" src="/static/test-bg.png"></image>
        <view class="item-title">暴雪中的美国中产</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'template',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
    }
  },
  methods: {
    goto(path) {
      uni.navigateTo({ url: path })
    }
  }
}
</script>

<style scoped>
.clone-cards {
  display: flex;
  gap: 20px;
  padding-top: 20px;
}

.card {
  flex: 1;
  height: 100px;
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
  grid-template-rows: 210px;
  gap: 10px;
  justify-items: center;
  overflow: auto;
}

.item-img {
  width: 160px;
  height: 180px;
  border-radius: 10px;
}

.item-title {
  font-size: 14px;
  color: #fff;
  width: 160px;
  text-align: center;
  margin-top: 5px;
}
</style>
