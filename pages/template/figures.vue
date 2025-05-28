<template>
  <view class="pages figures">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">形象列表</view>
    </view>
    <view style="font-size: 18px; color: #ffffff;margin-bottom: 10px">系统形象</view>
    <view class="figure-list"
          :style="{ height: heightStyle + 40 + 'px', gridTemplateRows: `repeat(1, ${heightStyle + 30}px)`, gridAutoColumns: `${heightStyle * 3 / 4}px` }">
      <view v-for="item in systemFigure" :key="item.id" @click="previewFigure(item)">
        <image :src="item.picture" mode="aspectFill"
               :style="{height: heightStyle + 'px', width: heightStyle * 3 / 4 + 'px', borderRadius: '10px'}"/>
        <view class="figure-name" :style="{ width: heightStyle * 3 / 4 + 'px' }">{{ item.name }}</view>
      </view>
    </view>
    <view style="font-size: 18px; color: #ffffff;margin: 15px 0">我的形象</view>
    <view class="figure-list"
          :style="{ height: heightStyle * 2 + 85 + 'px', gridTemplateRows: `repeat(2, ${heightStyle + 30}px)`, gridAutoColumns: `${heightStyle * 3 / 4}px`}">
      <view v-for="item in processFigure" :key="item.id">
        <view class="image-wrapper shining">
          <image src="/static/img/20.png" mode="aspectFill"
                 :style="{height: heightStyle + 'px', width: heightStyle * 3 / 4 + 'px', borderRadius: '10px'}"/>
          <view class="shine-layer"></view>
          <view class="loading-title">
            <view style="font-size: 14px">形象克隆中</view>
            <view class="dot" style="font-size: 20px">{{ dot }}</view>
          </view>
        </view>
        <view class="figure-name" style="margin-top: -5px">{{ item.name }}</view>
      </view>
      <view v-for="item in cloneFigure" :key="item.id" @click="previewFigure(item)">
        <image :src="item.picture" mode="aspectFill"
               :style="{height: heightStyle + 'px', width: heightStyle * 3 / 4 + 'px', borderRadius: '10px'}"/>
        <view class="figure-name" :style="{ width: heightStyle * 3 / 4 + 'px' }">{{ item.name }}</view>
      </view>
    </view>
    <uni-popup ref="popup" type="center" border-radius="10px" @maskClick="popupClose">
      <view style="position: relative">
        <video ref="video" style="border-radius: 10px" :src="selectedFigure.filepath" :controls="false"
               :poster="selectedFigure.picture" :show-center-play-btn="false" @ended="isPlaying = false"
               :style="{width: safeArea.width * 0.8 + 'px',height: safeArea.width * 0.8 * 4 / 3 + 'px'}">
        </video>
        <uni-icons fontFamily="CustomFont" class="play-icon" size="30" color="#ffffff"
                   @click="controlVideo" v-if="!isPlaying">{{'\ue618'}}</uni-icons>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      safeArea: uni.getSystemInfoSync().safeArea,
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
    ...mapGetters("task", ["figureTasks"]), // 获取任务列表
    processFigure() {
      return this.figureTasks.filter((item) => item.status === 'ready');
    },
    systemFigure() {
      return this.figureTasks.filter((item) => item.type === "system");
    },
    cloneFigure() {
      return this.figureTasks.filter((item) => item.type === "clone" && item.status === "success");
    }
  },
  mounted() {
    this.$store.dispatch("task/pollFigureTasks");
    this.heightStyle = (uni.getSystemInfoSync().safeArea.height - 320) / 3
    this.startDotAnimation();
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
    previewFigure(item) {
      this.selectedFigure = item
      this.$refs.popup.open()
    },
    controlVideo() {
      this.$refs.video.play();
      this.isPlaying = true;
    },
    popupClose() {
      this.isPlaying = false;
      this.$refs.video.pause();
    },
    back() {
      uni.redirectTo({url: '/pages/template/figureClone'})
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

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