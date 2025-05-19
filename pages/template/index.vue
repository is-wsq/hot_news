<template>
  <view class="pages templates" :style="{ height: `${safeAreaHeight - 69.8}px` }">
    <view class="clone-cards">
      <view class="card figure-bg" @click="goto('/pages/template/figureClone')">形象克隆</view>
      <view class="card voice-bg" @click="goto('/pages/template/voicesClone')">声音克隆</view>
    </view>
    <view style="font-size: 18px; color: #fff;line-height: 50px;display: flex">
      <view style="flex: 1">我的作品</view>
      <uni-icons type="right" size="21" color="#ffffff" @click="goto('/pages/template/videoList')"></uni-icons>
    </view>
    <view class="video-list" style="height: calc(100% - 180px)">
      <view class="video-item" v-for="item in processList" :key="item.id">
        <view class="image-wrapper shining">
          <image class="item-img" src="/static/img/20.png"></image>
          <view class="shine-layer"></view>
          <view class="loading-title">
            <view>视频生成中</view>
            <view class="dot">{{ dot }}</view>
          </view>
        </view>
        <view class="item-title" style="margin-top: 1px">{{ item.filename }}</view>
      </view>
      <view class="video-item" v-for="item in videoList" :key="item.id">
        <image class="item-img" :src="item.picture"></image>
        <view class="item-title">{{ item.filename }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'templates',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      userId: '',
      showReel: [],
      dotCount: 1,
      dotTimer: null,
      dot: '.'
    }
  },
  computed: {
    ...mapGetters("task", ["videoTasks"]),
    processList() {
      return this.videoTasks.filter((item) => item.status === 'pending');
    },
    videoList() {
      return this.videoTasks.filter((item) => item.status === 'success');
    },
  },
  mounted() {
    this.startDotAnimation();
    this.$store.dispatch("task/pollVideoTasks");
  },
  beforeDestroy() {
    clearInterval(this.dotTimer);
  },
  methods: {
    startDotAnimation() {
      this.dotTimer = setInterval(() => {
        this.dotCount = this.dotCount % 3 + 1;
        this.dot = '.'.repeat(this.dotCount);
      }, 1000);
    },
    toLogin() {
      uni.setStorageSync('login_router', {
        type: 'switchTab',
        path: '/pages/template/index'
      })
      uni.redirectTo({url: '/pages/login/login'})
    },
    goto(path) {
      let userId = uni.getStorageSync('userId') || ''
      if (userId === '') {
        this.$tip.confirm('请先登录',false).then(() => {
          this.toLogin()
        })
        return
      }
      uni.redirectTo({url: path})
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #fff;
  font-size: 20px;
  border-radius: 10px;
  background-size: cover;
  background-repeat: no-repeat;
}

.figure-bg {
  background-image: url("/static/figure-bg.png");
}

.voice-bg {
  background-image: url("/static/voice-bg.png");
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-template-rows: 230px;
  gap: 10px;
  justify-items: center;
  overflow: auto;
}

.item-img {
  width: 150px;
  height: 200px;
  border-radius: 10px;
}

.item-img.blurred {
  filter: blur(15px);
  opacity: 0.8
}

.loading-title {
  position: absolute;
  color: #fff;
  font-size: 14px;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translate(0, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 20px;
  text-align: left;
  margin-left: 5px;
  font-size: 16px;
  line-height: 40px;
}

.item-title {
  font-size: 14px;
  color: #fff;
  width: 150px;
  text-align: center;
  margin-top: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
