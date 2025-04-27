<template>
  <view class="pages recorder">
<!--    <button @click="startRecording">开始录音</button>-->
<!--    <button @click="stopRecording">停止</button>-->

<!--    <audio v-if="audioUrl" :src="audioUrl" controls></audio>-->
<!--    <button @click="handlerUpload">上传</button>-->
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">在线录制</view>
    </view>
    <view class="autocue">

    </view>
    <view class="recorder-audio">
      <audio :src="audioUrl" controls></audio>
    </view>
    <view class="recorder-box">
      <canvas width="100%" height="100%" ref="canvas"></canvas>
      <view class="recorder-btn">
        <uni-icons style="border: 1px solid #ffffff;" type="mic-filled" v-if="!recorder" size="30" color="#ffffff" @click="startRecording"></uni-icons>
        <uni-icons type="micoff-filled" v-else size="30" color="#ffffff" @click="stopRecording"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
let token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xpdmUudGVsbGFpLnRlY2giLCJzdWIiOiI3ODNjNGI1NC1hMWQwLTVmY2ItOTExZC1kNWM1YjNjODY2MTAiLCJpYXQiOjE3NDIyMTA0NDQsImV4cCI6MTc1OTc5NTIwMCwibmFtZSI6InRlc3QifQ.OGrW6VfdM7zLVcGjGz9UHblQQlQoHWSriFB90kJOq98'

import '../../static/js/recorder.wav.min.js'

export default {
  data() {
    return {
      recorder: null,
      audioUrl: '',     // 录音本地播放地址
    }
  },
  beforeDestroy() {
    if (this.recorder) this.recorder.close();
  },
  methods: {
    generateUniqueId() {
      return Date.now() + Math.random().toString(36).substr(2, 16);
    },
    handlerUpload() {
      let self = this
      uni.request({
        url: `https://live.tellai.tech/api/media/files/upload_request?type=audio`,
        header: {'Authorization': token},
        success: (res) => {
          let status = res.data.base_resp
          let data = res.data.data
          if (status.status_code === 200) {
            let task = {
              name: '录制.wav',
              type: 'voice',
              id: self.generateUniqueId(),
            }
            self.$store.dispatch('task/addTask', task);
            self.$tip.confirm(`已创建音色克隆任务\n《录制.wav》`, false).then(res => {
              uni.redirectTo({url: '/pages/template/voice'})
            })

            uni.uploadFile({
              url: data.upload_url,
              file: this.file,
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
            this.$tip.confirm(status.status_msg, false)
          }
        }
      });
    },
    clone(fileId, task) {
      let params = {
        file_id: fileId,
        user_id: uni.getStorageSync('userId'),
        audio_name: task.name.substring(0, task.name.lastIndexOf('.'))
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
    startRecording() {
      if (!window.Recorder) {
        uni.showToast({ title: '录音库未加载', icon: 'none' })
        return
      }

      this.recorder = window.Recorder({
        type: 'wav',
        sampleRate: 16000,
        bitRate: 16
      })

      this.recorder.open(() => {
        this.recorder.start()
        uni.showToast({ title: '录音中...', icon: 'none' })
      }, (errMsg, isUserNotAllow) => {
        console.error('录音授权失败:', errMsg)
        uni.showToast({ title: '录音失败', icon: 'none' })
      })
    },

    stopRecording() {
      if (!this.recorder) return

      this.recorder.stop((blob, duration) => {
        this.audioUrl = URL.createObjectURL(blob)
        this.recorder.close()

        this.file = new File([blob], 'recording.wav', { type: 'audio/wav' })
        console.log(this.file)
      }, err => {
        console.error('停止失败:', err)
        uni.showToast({ title: '停止失败', icon: 'none' })
      })
    },

    back() {
      uni.redirectTo({url: '/pages/template/voicesClone'})
    }
  }
}
</script>

<style scoped>
.recorder {
  height: 100vh;
}

.autocue {
  height: 200px;
  border-radius: 10px;
  background-color: #f5f5f5;
}

.recorder-audio {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
}

.recorder-box {
  height: calc(100vh - 465px);
  border: 1px solid red;
  position: relative;
}

.recorder-btn {
  position: absolute;
  bottom: 0;
  height: 100px;
  width: 100%;
  border: 1px solid yellow;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
