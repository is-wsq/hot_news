<template>
  <view class="pages voice">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">音色列表</view>
    </view>
    <view style="font-size: 18px; color: #ffffff;margin-bottom: 15px">系统音色</view>
    <view class="voice-list" :style="{height: heightStyle + 'px'}">
      <view class="voice-item" v-for="item in systemVoice" :key="item.id" @click="previewAudio(item)">
        <image :class="{ 'active-item': audioCtxId === item.id }" :src="item.avatar" mode="aspectFill"
               style="width: 80px; height: 80px; border-radius: 50%"/>
        <view class="voice-name" :style="{color: audioCtxId === item.id ? '#e99d42' : '#ffffff'}">{{
            item.name
          }}
        </view>
      </view>
    </view>
    <view style="font-size: 18px; color: #ffffff;margin: 15px 0">我的音色</view>
    <view class="voice-list" :style="{height: heightStyle + 'px'}">
      <view class="voice-item" v-for="item in processVoice" :key="item.id">
        <view class="image-wrapper shining">
          <image src="/static/img/voice-loading.png" mode="aspectFill"
                 style="width: 80px; height: 80px; border-radius: 50%"/>
          <view class="shine-layer"></view>
          <view class="loading-title">
            <view style="font-size: 14px">克隆中</view>
            <view class="dot">{{ dot }}</view>
          </view>
        </view>
        <view class="voice-name">{{ item.name }}</view>
      </view>

      <view class="voice-item" v-for="item in cloneVoice" :key="item.id" @click="previewAudio(item)">
        <image :class="{ 'active-item': audioCtxId === item.id }" :src="item.avatar" mode="aspectFill"
               style="width: 80px; height: 80px; border-radius: 50%"/>
        <view class="voice-name" :style="{color: audioCtxId === item.id ? '#e99d42' : '#ffffff'}">{{
            item.name
          }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'voice',
  data() {
    return {
      heightStyle: 0,
      audioCtx: null,
      audioCtxId: null,
      dotCount: 1,
      dotTimer: null,
      dot: '.',
    }
  },
  computed: {
    ...mapGetters("task", ["voiceTasks"]), // 获取任务列表
    processVoice() {
      return this.voiceTasks.filter((item) => item.status === 'pending');
    },
    systemVoice() {
      return this.voiceTasks.filter((item) => item.type === "system");
    },
    cloneVoice() {
      return this.voiceTasks.filter((item) => item.type === "clone" && item.status === "success");
    }
  },
  mounted() {
    this.$store.dispatch("task/pollVoiceTasks");
    this.startDotAnimation()
    this.heightStyle = (uni.getSystemInfoSync().safeArea.height - 200) / 2
  },
  beforeDestroy() {
    clearInterval(this.dotTimer)
    this.stopPreviewAudio()
  },
  methods: {
    startDotAnimation() {
      this.dotTimer = setInterval(() => {
        this.dotCount = this.dotCount % 3 + 1;
        this.dot = '.'.repeat(this.dotCount);
      }, 1000);
    },
    previewAudio(item) {
      if (this.audioCtxId === item.id) {  // 已经播放了当前音色，则停止播放
        this.stopPreviewAudio()
        return
      }
      if (this.audioCtx) {  // 正在播放音频，则先停止播放
        this.stopPreviewAudio()
      }

      this.audioCtx = uni.createInnerAudioContext()
      this.audioCtx.src = item.filepath
      this.audioCtx.autoplay = true;
      this.audioCtx.play();
      this.audioCtx.onPlay(() => {
        this.audioCtxId = item.id
      })
      this.audioCtx.onEnded(() => {
        this.stopPreviewAudio()
      })
    },
    stopPreviewAudio() {
      if (this.audioCtx) {
        this.audioCtx.pause();
        this.audioCtx.destroy()
        this.audioCtx = null
        this.audioCtxId = null
      }
    },
    back() {
      uni.redirectTo({url: '/pages/template/voicesClone'})
    }
  }
}
</script>

<style scoped>
.voice {
  height: 100vh;
  color: #ffffff;
}

.voice-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  grid-auto-rows: 110px;
  gap: 20px;
  overflow-y: auto;
}

.voice-item {
  text-align: center;
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

.voice-name {
  width: 100%;
  text-align: center;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active-item {
  border: 1px solid #e99d42;
}
</style>