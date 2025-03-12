<template>
  <view class="loading-container">
    <view class="loading-wrapper">
      <video ref="video" class="loading-video" src="/static/loading.mp4" playsinline webkit-playsinline loop muted
             object-fit="cover" :controls="false" :show-center-play-btn="false"></video>
      <view class="loading-text">{{ text }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Loading...'
    }
  },
  methods: {
    playVideo() {
      this.$refs.video.play();
    }
  }
};
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 180px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
}

.loading-video {
  width: 100px;
  height: 85px;
}

.loading-text {
  color: #fff;
  margin-top: 15px;
  font-size: 16px;
}
</style>