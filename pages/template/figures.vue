<template>
  <view class="pages figures">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">形象列表</view>
    </view>
    <view style="font-size: 18px; color: #ffffff;margin-bottom: 10px">系统形象</view>
    <view class="figure-list"
          :style="{ height: heightStyle + 30 + 'px', gridTemplateRows: `repeat(1, ${heightStyle + 30}px)`, gridAutoColumns: `${heightStyle * 3 / 4}px` }">
      <view v-for="item in systems" :key="item.id">
        <image :src="item.picture"
               :style="{height: heightStyle + 'px', width: heightStyle * 3 / 4 + 'px', borderRadius: '10px'}"/>
        <view class="figure-name" :style="{ width: heightStyle * 3 / 4 + 'px' }">{{ item.name }}</view>
      </view>
    </view>
    <view style="font-size: 18px; color: #ffffff;margin: 15px 0">我的形象</view>
    <view class="figure-list"
          :style="{ height: heightStyle * 2 + 85 + 'px', gridTemplateRows: `repeat(2, ${heightStyle + 30}px)`, gridAutoColumns: `${heightStyle * 3 / 4}px`}">
      <view v-for="item in figureTasks" :key="item.id">
        <view class="image-wrapper shining">
          <image src="/static/img/20.png"
                 :style="{height: heightStyle + 'px', width: heightStyle * 3 / 4 + 'px', borderRadius: '10px'}"/>
          <view class="shine-layer"></view>
          <view class="loading-title">
            <view style="font-size: 14px">视频生成中</view>
            <view class="dot" style="font-size: 20px">{{ dot }}</view>
          </view>
        </view>
        <view class="figure-name" style="margin-top: -5px">{{ item.name }}</view>
      </view>
      <view v-for="item in clones" :key="item.id" @click="previewFigure(item)">
        <image :src="item.picture"
               :style="{height: heightStyle + 'px', width: heightStyle * 3 / 4 + 'px', borderRadius: '10px'}"/>
        <view class="figure-name" :style="{ width: heightStyle * 3 / 4 + 'px' }">{{ item.name }}</view>
      </view>
    </view>
    <uni-popup ref="previewPopup" :mask-click="false" type="bottom">
      <view class="preview-content" :style="{ height: `${safeAreaHeight}px` }">
        <view class="preview-title">
          <view style="color: #ffffff; font-size: 16px;">{{ selectedFigure.name }} 形象预览</view>
          <uni-icons class="preview-close" type="closeempty" size="20" color="#ffffff"
                     @click="popupClose"></uni-icons>
        </view>
        <view style="height: calc(100% - 30px);position: relative;">
          <uni-icons class="preview-close" type="closeempty" size="20" color="#ffffff"
                     @click="popupClose"></uni-icons>
          <video ref="video" style="width: 100%; height: 100%;" :src="selectedFigure.filepath" :controls="false"
                 :show-center-play-btn="false" @ended="isPlaying = false"></video>
          <uni-icons custom-prefix="iconfont" type="icon-play" class="play-icon" size="20" color="#ffffff"
                     @click="controlVideo" v-if="!isPlaying"></uni-icons>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      systems: [],
      clones: [],
      heightStyle: 0,
      figureStyle: {},
      contentStyle: {},
      dotCount: 1,
      dotTimer: null,
      dot: '.',
      selectedFigure: {},
      isPlaying: false,
    }
  },
  computed: {
    ...mapGetters("task", ["allTasks"]), // 获取任务列表
    figureTasks() {
      return this.allTasks.filter((item) => item.type === "figures");
    },
  },
  watch: {
    figureTasks: {
      handler() {
        this.queryFigures();
      },
      deep: true,
    },
  },
  mounted() {
    this.queryFigures();
    this.heightStyle = (uni.getSystemInfoSync().safeArea.height - 320) / 3
    if (this.figureTasks.length > 0) {
      this.startDotAnimation();
    }
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
    queryFigures() {
      this.systems = []
      this.clones = []
      this.$http.get('/figure/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          res.data.forEach(item => {
            item.type === 'system' ? this.systems.push(item) : this.clones.push(item)
          })
        } else {
          this.$tip.toast(res.message, 5000)
        }
      })
    },
    previewFigure(item) {
      this.selectedFigure = item
      this.$refs.previewPopup.open()
    },
    controlVideo() {
      this.$refs.video.play();
      this.isPlaying = true;
    },
    popupClose() {
      this.isPlaying = false;
      this.$refs.video.pause();
      this.$refs.previewPopup.close();
    },
    back() {
      uni.redirectTo({url: '/pages/template/figureClone'})
    }
  }
}
</script>

<style scoped>
.figures {
  height: 100vh;
}

.figure-list {
  display: grid;
  gap: 20px;
  grid-auto-flow: column;
  overflow-x: auto;
}

.item-title {
  font-size: 14px;
  color: #fff;
  text-align: center;
  margin-top: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.figure-name {
  text-align: center;
  color: #ffffff;
  line-height: 30px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-content {
  background-color: #292929;
  padding: 20px 0;
  box-sizing: border-box;
}

.preview-title {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}

.preview-close {
  position: absolute;
  top: 5px;
  right: 10px;
  color: #ffffff;
}

.play-icon {
  height: 20px;
  width: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
</style>