<template>
  <view class="pages voicesClone">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">音色克隆</view>
      <view class="voices-list" @click="gotoVoices">音色列表</view>
    </view>
    <view class="voice-content">
      <view style="margin-bottom: 15px">正确示例</view>
      <view style="display: flex">
        <view class="template-img"></view>
        <view class="template-requires">
          <view style="height: 40px;display: flex;align-items: center" v-for="(item,index) in requires" :key="index">
            <uni-icons type="checkbox-filled" size="22" color="#77C285" style="margin: 0 5px"></uni-icons>
            <view style="font-size: 14px">{{ item }}</view>
          </view>
        </view>
      </view>
      <view style="margin: 15px 0">克隆案例</view>
      <view style="display: flex;gap: 30px">
        <view class="clone-case">
          <view class="clone-case-title">原声</view>
          <view class="clone-case-btn">
            <uni-icons custom-prefix="iconfont" type="icon-play" class="off-on" size="18" color="#ffffff"
                       v-if="playIndex !== 0" @click="playAudio(0)"></uni-icons>
            <uni-icons custom-prefix="iconfont" type="icon-pause" class="off-on" size="18" color="#ffffff"
                       v-else @click="stopAudio()"></uni-icons>
          </view>
        </view>
        <view class="clone-case">
          <view class="clone-case-title">克隆</view>
          <view class="clone-case-btn">
            <uni-icons custom-prefix="iconfont" type="icon-play" class="off-on" size="18" color="#ffffff"
                       v-if="playIndex !== 1" @click="playAudio(1)"></uni-icons>
            <uni-icons custom-prefix="iconfont" type="icon-pause" class="off-on" size="18" color="#ffffff"
                       v-else @click="stopAudio()"></uni-icons>
          </view>
        </view>
      </view>
      <view style="margin: 15px 0">音频教程</view>
      <view class="voice-tutorial">
        <view class="voice-tutorial-btn">
          <uni-icons custom-prefix="iconfont" type="icon-play" class="off-on" size="22" color="#ffffff"
                     v-if="playIndex !== 2" @click="playAudio(2)"></uni-icons>
          <uni-icons custom-prefix="iconfont" type="icon-pause" class="off-on" size="22" color="#ffffff"
                     v-else @click="stopAudio()"></uni-icons>
        </view>
      </view>
    </view>
    <view style="height: 90px;display: flex;align-items: center;gap: 30px">
      <button class="transcribe">在线录制</button>
      <button class="upload" @click="uploadFile">上传文件</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      requires: ['30秒左右的视频、音频', '录制环境安静无杂音', '确保录制全程环境一致', '保持正常语速、音调', '保留自然停顿'],
      playIndex: null,
      audioCtx: null,
      audios: [
        'https://live.tellai.tech/api/news_assistant/static/generated_sample_audio/272f4122-ab74-4bc1-9cd6-c29a41fb508f/20250327145319386.wav',
        'https://live.tellai.tech/api/news_assistant/static/generated_sample_audio/272f4122-ab74-4bc1-9cd6-c29a41fb508f/20250326155734776.wav',
        'https://live.tellai.tech/api/news_assistant/static/generated_sample_audio/272f4122-ab74-4bc1-9cd6-c29a41fb508f/20250326154431855.wav',
      ]
    }
  },
  methods: {
    uploadFile() {
      let self = this
      uni.chooseFile({
        count: 1,
        success: function (res) {
          let allowedExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.mov'];
          let filename = res.tempFiles[0].name.toLowerCase();
          let allow = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext))
          if (!allow) {
            self.$tip.toast('请选择有效的音频文件',2000)
            return
          }
          let task = {
            name: res.tempFiles[0].name,
            type: 'voice',
            id: self.generateUniqueId(),
          }
          self.$store.dispatch('task/addTask', task);
          self.$tip.confirm(`已创建音色克隆任务\n《${res.tempFiles[0].name}》`,false).then(res => {
            uni.redirectTo({url: '/pages/template/voice'})
          })

          uni.uploadFile({
            url: 'https://live.tellai.tech/api/news_assistant/timbres/clone',
            filePath: res.tempFilePaths[0],
            name: 'file',
            timeout: 1800000,
            formData: {'user_id': uni.getStorageSync('userId')},
            success: (result) => {
              self.$store.dispatch("task/removeTask", task.id);
              let data = JSON.parse(result.data)
              if (data.status === 'success') {
                self.$tip.confirm(`${task.name}音色克隆任务已完成`,false)
              } else {
                self.$tip.confirm(`${task.name}音色克隆任务失败,${data.message}`,false)
              }
            }
          });
        }
      });
    },
    playAudio(index) {
      if (this.audioCtx) {
        this.stopAudio()
      }
      this.audioCtx = uni.createInnerAudioContext()
      this.audioCtx.src = this.audios[index]
      this.audioCtx.autoplay = true;
      this.audioCtx.play();
      this.audioCtx.onPlay(() => {
        this.playIndex = index
      })
      this.audioCtx.onEnded(() => {
        this.stopAudio()
      })
    },
    stopAudio() {
      if (this.audioCtx) {
        this.audioCtx.pause();
        this.audioCtx.destroy()
        this.audioCtx = null
        this.playIndex = null
      }
    },
    generateUniqueId() {
      return Date.now() + Math.random().toString(36).substr(2, 16);
    },
    back() {
      uni.switchTab({url: '/pages/template/index'})
    },
    gotoVoices() {
      uni.redirectTo({url: '/pages/template/voice'})
    }
  },
  beforeDestroy() {
    this.stopAudio()
  }
}
</script>

<style scoped>
.voicesClone {
  height: 100vh;
  color: #ffffff;
}

.voices-list {
  position: absolute;
  right: 5px;
  color: #ffffff;
}

.voice-content {
  height: calc(100% - 150px);
  overflow-y: auto;
}

.template-img {
  background-image: url('/static/img/microphone.png');
  border-radius: 10px;
  width: 180px;
  height: 240px;
  margin-right: 5px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.clone-case {
  flex: 1;
  border-radius: 10px;
  height: 82px;
  background-image: url('/static/img/case.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.clone-case-title {
  position: absolute;
  bottom: 5px;
  left: 5px;
  color: #ffffff;
  font-size: 14px;
}

.clone-case-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgba(16, 16, 16, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
}

.voice-tutorial {
  height: 150px;
  border-radius: 10px;
  background-image: url('/static/img/microphone_copy.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.voice-tutorial-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(16, 16, 16, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
}

.transcribe {
  flex: 1;
  height: 55px;
  line-height: 55px;
  border-radius: 10px;
}

.upload {
  flex: 1;
  height: 55px;
  line-height: 55px;
  background-color: #E99D42;
  color: #ffffff;
  border-radius: 10px;
}
</style>