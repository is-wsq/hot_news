<template>
  <view class="pages transcribe">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">在线录制</view>
    </view>
    <view>
      <audio :src='recorder.localUrl' v-if='recorder' name='本地录音' controls="true"></audio>
      <view @click='handlerOnCahnger'>
        {{ !status ? '开始录音' : '结束录音' }}
      </view>
      <mumu-recorder ref='recorder' @success='handlerSuccess' @error='handlerError'></mumu-recorder>
    </view>
    <view style="display: flex;gap: 20px">
      <button style="flex: 1" type="primary" @click='handlerSave'>保存</button>
      <button style="flex: 1" type="primary" @click='handlerUpload'>上传</button>
    </view>
  </view>
</template>

<script>
let token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xpdmUudGVsbGFpLnRlY2giLCJzdWIiOiI3ODNjNGI1NC1hMWQwLTVmY2ItOTExZC1kNWM1YjNjODY2MTAiLCJpYXQiOjE3NDIyMTA0NDQsImV4cCI6MTc1OTc5NTIwMCwibmFtZSI6InRlc3QifQ.OGrW6VfdM7zLVcGjGz9UHblQQlQoHWSriFB90kJOq98'

import MumuRecorder from '@/uni_modules/mumu-recorder/components/mumu-recorder/mumu-recorder.vue'

export default {
  components: {MumuRecorder},
  data() {
    return {
      status: false,
      recorder: null
    }
  },
  mounted() {

  },
  methods: {
    handlerSave() {
      let tag = document.createElement('a')
      tag.href = this.recorder.localUrl
      tag.download = '录音'
      tag.click()
    },
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

            console.log('文件',self.recorder)

            const file = new File([self.recorder.data], 'recording.wav', { type: 'audio/wav' });
            console.log('文件1',file)

            uni.uploadFile({
              url: 'https://u480621-ba45-4d5fd016.westc.gpuhub.com:8443/files/upload_file',
              file: file,
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
    handlerOnCahnger() {
      if (this.status) {
        this.$refs.recorder.stop()
      } else {
        this.$refs.recorder.start()
      }
      this.status = !this.status
    },
    handlerSuccess(res) {
      this.$tip.confirm(JSON.stringify(res), false)
      this.recorder = res
    },
    handlerError(code) {
      switch (code) {
        case '101':
          uni.showModal({
            content: '当前浏览器版本较低，请更换浏览器使用，推荐在微信中打开。'
          })
          break;
        case '201':
          uni.showModal({
            content: '麦克风权限被拒绝，请刷新页面后授权麦克风权限。'
          })
          break
        default:
          uni.showModal({
            content: '未知错误，请刷新页面重试'
          })
          break
      }
    },
    back() {
      uni.redirectTo({url: '/pages/template/voicesClone'})
    }
  },
}
</script>

<style scoped>
.transcribe {
  height: 100vh;
  color: #ffffff;
}
</style>