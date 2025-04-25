<template>
  <view class="container">
    <button @click="startRecording">开始录音</button>
    <button @click="stopRecording">停止</button>

    <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    <button @click="handlerUpload">上传</button>
  </view>
</template>

<script>
let token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xpdmUudGVsbGFpLnRlY2giLCJzdWIiOiI3ODNjNGI1NC1hMWQwLTVmY2ItOTExZC1kNWM1YjNjODY2MTAiLCJpYXQiOjE3NDIyMTA0NDQsImV4cCI6MTc1OTc5NTIwMCwibmFtZSI6InRlc3QifQ.OGrW6VfdM7zLVcGjGz9UHblQQlQoHWSriFB90kJOq98'

import Recorder from 'recorder-core';

export default {
  data() {
    return {
      recorder: null,
      audioUrl: '',     // 录音本地播放地址
    }
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
              url: 'https://u480621-ba45-4d5fd016.westc.gpuhub.com:8443/files/upload_file',
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
      if (!Recorder) {
        uni.showToast({ title: '录音库未加载', icon: 'none' })
        return
      }

      this.recorder = Recorder({
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

        this.file = new File([blob], 'recording.wav', { type: 'audio/wav' })
        console.log(this.file)
      }, err => {
        console.error('停止失败:', err)
        uni.showToast({ title: '停止失败', icon: 'none' })
      })
    },
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
}
button {
  display: block;
  margin: 20rpx auto;
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #007AFF;
  color: white;
  border-radius: 10rpx;
}
</style>
