<template>
  <view class="pages voicesClone">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">音色克隆</view>
      <view class="voices-list" @click="gotoVoices">音色列表</view>
    </view>
    <view class="voice-content">
      <view style="margin-bottom: 10px">正确示例</view>
      <view style="display: flex">
        <view class="template-img"></view>
        <view class="template-requires">
          <view style="height: 40px;display: flex;align-items: center" v-for="(item,index) in requires" :key="index">
            <uni-icons type="checkbox-filled" size="22" color="#77C285" style="margin: 0 5px"></uni-icons>
            <view style="font-size: 14px">{{ item }}</view>
          </view>
        </view>
      </view>
      <view style="margin: 10px 0">克隆案例</view>
      <view style="display: flex;gap: 30px">
        <view class="clone-case">
          <view class="clone-case-title">原声</view>
          <view class="clone-case-btn">
            <uni-icons fontFamily="CustomFont" class="off-on" size="18" color="#ffffff" v-if="playIndex !== 0"
                       @click="playAudio(0)">{{ '\ue618' }}
            </uni-icons>
            <uni-icons fontFamily="CustomFont" class="off-on" size="18" color="#ffffff" v-else
                       @click="stopAudio()">{{ '\ue637' }}
            </uni-icons>
          </view>
        </view>
        <view class="clone-case">
          <view class="clone-case-title">克隆</view>
          <view class="clone-case-btn">
            <uni-icons fontFamily="CustomFont" class="off-on" size="18" color="#ffffff" v-if="playIndex !== 1"
                       @click="playAudio(1)">{{ '\ue618' }}
            </uni-icons>
            <uni-icons fontFamily="CustomFont" class="off-on" size="18" color="#ffffff" v-else
                       @click="stopAudio()">{{ '\ue637' }}
            </uni-icons>
          </view>
        </view>
      </view>
      <view style="margin: 10px 0">音频教程</view>
      <view class="voice-tutorial">
        <view class="voice-tutorial-btn">
          <uni-icons fontFamily="CustomFont" class="off-on" size="22" color="#ffffff" v-if="playIndex !== 2"
                     @click="playAudio(2)">{{ '\ue618' }}
          </uni-icons>
          <uni-icons fontFamily="CustomFont" class="off-on" size="22" color="#ffffff" v-else
                     @click="stopAudio()">{{ '\ue637' }}
          </uni-icons>
        </view>
      </view>
    </view>
    <view style="height: 90px;display: flex;align-items: center;gap: 30px">
      <button class="transcribe" @click="gotoTranscribe">在线录制</button>
      <button class="upload" @click="uploadFile">上传文件</button>
    </view>
    <uni-popup ref="recorder" :mask-click="false" type="bottom" background-color="#292929" borderRadius="12px 12px 0 0">
      <view class="popup-content">
        <view style="height: 200px;line-height: 50px">
          <view class="text">
            <text
                v-for="(char, index) in chars"
                :key="index"
                class="word"
                :class="{ active: started }"
                :style="started ? { animationDelay: (index * delayStep) + 's' } : {}"
            >{{ char }}
            </text>
          </view>
        </view>
        <view style="font-size: 14px;margin-top: 20px;text-align: center"></view>
        <view class="recorder-content">
          <canvas canvas-id="progressCircle" class="circle-canvas"></canvas>
          <view class="microphone-icon" v-if="!audioUrl">
            <uni-icons type="mic-filled" size="30" color="#ffffff" @click="startRecording" v-if="!isRecording">
            </uni-icons>
            <uni-icons type="smallcircle-filled" size="30" color="#ffffff" @click="stopRecording" v-if="isRecording">
            </uni-icons>
            <!--            <uni-icons fontFamily="CustomFont" size="25" color="#ffffff" @click="stopRecording" v-if="isRecording">-->
            <!--              {{ '\ue8a5' }}-->
            <!--            </uni-icons>-->
          </view>
          <view class="microphone-icon" v-if="audioUrl">
            <uni-icons fontFamily="CustomFont" size="25" color="#ffffff" v-if="playIndex !== 3" @click="playAudio(3)">
              {{ '\ue618' }}
            </uni-icons>
            <uni-icons fontFamily="CustomFont" size="25" color="#ffffff" v-else @click="stopAudio()">
              {{ '\ue637' }}
            </uni-icons>
          </view>
          <view class="timer">{{ formatTime(duration) }}</view>
          <view style="margin-top: 20px;font-size: 14px;text-align: center;height: 40px" @click="reRecord">
            {{ audioUrl ? '重新录制' : '' }}
          </view>
          <view style="display: flex;gap: 30px;margin-top: 20px">
            <button class="recorder-btn" @click="handleCancel">取消</button>
            <button class="recorder-btn" style="background-color: #e99d42;" @click="handleConfirm">完成</button>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
let token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xpdmUudGVsbGFpLnRlY2giLCJzdWIiOiI3ODNjNGI1NC1hMWQwLTVmY2ItOTExZC1kNWM1YjNjODY2MTAiLCJpYXQiOjE3NDIyMTA0NDQsImV4cCI6MTc1OTc5NTIwMCwibmFtZSI6InRlc3QifQ.OGrW6VfdM7zLVcGjGz9UHblQQlQoHWSriFB90kJOq98'
import '../../static/js/recorder.wav.min.js'

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
      ],
      duration: 0,
      interval: null,
      progress: 0,
      ctx: null,
      isRecording: false,
      recorder: null,
      audioUrl: null,
      recorderFile: null,
      sentence: "现在做视频真的太简单了，使用奇点数字人，不用真人出镜也能出爆款视频。",
      delayStep: 0.277, // 每个字的延迟秒数（10秒/36字）
      started: false
    }
  },
  computed: {
    chars() {
      return this.sentence.split('');
    }
  },
  mounted() {
    this.ctx = uni.createCanvasContext('progressCircle', this);
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
            self.$tip.confirm('请选择有效的音频文件', false)
            return
          }
          let type = res.tempFiles[0].type.indexOf('audio') !== -1 ? 'audio' : 'video'
          console.log(res.tempFiles[0])
          self.getFileId(type, res.tempFiles[0])
        }
      });
    },
    getFileId(type, file) {
      let self = this
      uni.request({
        url: `https://live.tellai.tech/api/media/files/upload_request?type=${type}`,
        header: {'Authorization': token},
        success: (res) => {
          let status = res.data.base_resp
          let data = res.data.data
          if (status.status_code === 200) {
            console.log(file)
            let task = {
              name: file.name.split('.')[0],
              type: 'voice',
              id: self.generateUniqueId(),
            }
            self.$store.dispatch('task/addTask', task);
            self.$tip.confirm(`已创建音色克隆任务\n《${task.name}》`, false).then(res => {
              uni.redirectTo({url: '/pages/template/voice'})
            })

            uni.uploadFile({
              url: data.upload_url,
              filePath: file.path,
              name: 'file',
              header: {'Authorization': token},
              timeout: 1800000,
              formData: {'file_id': data.file_id, 'type': type},
              success: (result) => {
                let upload_status = JSON.parse(result.data).base_resp
                let upload_data = JSON.parse(result.data).data
                if (upload_status.status_code === 200) {
                  self.clone(upload_data.file_id, task)
                } else {
                  self.$store.dispatch("task/removeTask", task.id);
                  self.$tip.confirm(`${task.name}音色克隆任务失败,${upload_status.status_msg}`, false)
                }
              }
            });
          } else {
            this.$tip.confirm(status.status_msg, false)
          }
        }
      });
    },
    clone(fileId, task) {
      let params = {
        file_id: fileId,
        user_id: uni.getStorageSync('userId'),
        audio_name: task.name
      }
      this.$http.post('/timbres/clone/file_id', params).then(res => {
        this.$store.dispatch("task/removeTask", task.id);
        if (res.status === 'success') {
          this.$tip.confirm(`${task.name}音色克隆任务成功`, false)
        } else {
          this.$tip.confirm(`${task.name}音色克隆任务失败,${res.message}`, false)
        }
      })
    },
    playAudio(index) {
      if (this.audioCtx) {
        this.stopAudio()
      }
      this.audioCtx = uni.createInnerAudioContext()
      if (index === 3) {
        this.audioCtx.src = this.audioUrl
      } else {
        this.audioCtx.src = this.audios[index]
      }
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
    },
    gotoTranscribe() {
      // uni.redirectTo({url: '/pages/template/recorder'})
      this.$refs.recorder.open()
      setTimeout(() => {
        this.drawProgress()
      }, 50)
    },
    startRecording() {
      uni.showToast({title: '录音环境准备中', icon: 'loading'})
      this.recorder = window.Recorder({
        type: 'wav',
        sampleRate: 16000,
        bitRate: 16
      })

      this.recorder.open(async () => {
        await this.recorder.start()
        uni.hideToast()
        this.isRecording = true;
        this.started = true;
        this.interval = setInterval(() => {
          if (this.duration < 15) {
            this.duration++;
            this.progress = (this.duration % 60) / 15; // 每60秒转一圈
            this.drawProgress();
          } else {
            this.stopRecording()
          }
        }, 1000);
      }, (errMsg, isUserNotAllow) => {
        this.$tip.confirm(`录音失败${errMsg}`, false)
      })
    },
    stopRecording() {
      if (!this.recorder) return

      this.recorder.stop((blob, duration) => {
        this.isRecording = false;
        this.started = false;
        this.progress = 0
        this.drawProgress();
        clearInterval(this.interval);
        this.audioUrl = URL.createObjectURL(blob)
        this.recorder.close()

        let index = uni.getStorageSync('recorderIndex') ? uni.getStorageSync('recorderIndex') + 1 : 1
        this.recorderFile = new File([blob], `recording_${index}.wav`, {type: 'audio/wav'})
      }, err => {
        this.$tip.confirm(`停止失败${err}`, false)
      })
    },
    drawProgress() {
      const ctx = this.ctx;
      const r = 40; // 圆半径
      ctx.clearRect(0, 0, 100, 100);

      // 绘制灰色底圈
      ctx.beginPath();
      ctx.arc(50, 50, r, 0, 2 * Math.PI);
      ctx.setStrokeStyle('#eeeeee');
      ctx.setLineWidth(4);
      ctx.stroke();

      // 绘制进度圈
      ctx.beginPath();
      ctx.arc(50, 50, r, -0.5 * Math.PI, (this.progress * 2 * Math.PI) - 0.5 * Math.PI);
      ctx.setStrokeStyle('#00C6AD'); // 进度条颜色
      ctx.setLineWidth(4);
      ctx.stroke();

      ctx.draw();
    },
    formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    },
    reRecord() {
      this.audioUrl = null
      this.progress = 0
      this.drawProgress();
      this.duration = 0
      this.started = false;
      this.recorderFile = null
    },
    handleCancel() {
      this.stopAudio()
      if (this.isRecording)
        this.stopRecording()

      this.reRecord()
      this.$refs.recorder.close()
    },
    handleConfirm() {
      let self = this
      if (self.recorderFile) {
        this.$tip.confirm('请先录制音频', false)
      }
      self.handleCancel()
      uni.request({
        url: `https://live.tellai.tech/api/media/files/upload_request?type=audio`,
        header: {'Authorization': token},
        success: (res) => {
          let status = res.data.base_resp
          let data = res.data.data
          if (status.status_code === 200) {
            let index = uni.getStorageSync('recorderIndex') ? uni.getStorageSync('recorderIndex') + 1 : 1
            uni.setStorageSync('recorderIndex', index)
            let task = {
              name: `recording_${index}`,
              type: 'voice',
              id: self.generateUniqueId(),
            }
            self.$store.dispatch('task/addTask', task);
            self.$tip.confirm(`已创建音色克隆任务\n《${task.name}》`, false).then(res => {
              uni.redirectTo({url: '/pages/template/voice'})
            })

            uni.uploadFile({
              url: data.upload_url,
              file: self.recorderFile,
              name: 'file',
              header: {'Authorization': token},
              timeout: 1800000,
              formData: {'file_id': data.file_id, 'type': 'audio'},
              success: (result) => {
                let upload_status = JSON.parse(result.data).base_resp
                let upload_data = JSON.parse(result.data).data
                if (upload_status.status_code === 200) {
                  self.clone(upload_data.file_id, task)
                } else {
                  self.$store.dispatch("task/removeTask", task.id);
                  self.$tip.confirm(`${task.name}音色克隆任务失败,${upload_status.status_msg}`, false)
                }
              }
            });
          } else {
            self.$tip.confirm(status.status_msg, false)
          }
        }
      });
    }
  },
  beforeDestroy() {
    this.stopAudio()
  }
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

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
  width: 160px;
  height: 211px;
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
  height: 170px;
  border-radius: 10px;
  background-image: url('/static/img/microphone_copy.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  background-position: 0 -30px;
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

.popup-content {
  background-color: #292929;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 10px;
  height: 500px;
}

.popup-title {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.recorder-content {
  position: relative;
  height: 100px;
}

.circle-canvas {
  width: 100px;
  height: 100px;
  margin: 20px auto 0;
}

.microphone-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.timer {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.recorder-btn {
  flex: 1;
  height: 45px;
  line-height: 45px;
  font-size: 14px;
  border-radius: 8px;
  color: #101010;
}

.text {
  font-size: 16px;
  color: #888;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

.word {
  opacity: 1;
  color: #888;
}

.word.active {
  animation: highlight 0.5s forwards;
}

@keyframes highlight {
  from {
    color: #888;
  }
  to {
    color: #E99D42;
  }
}
</style>