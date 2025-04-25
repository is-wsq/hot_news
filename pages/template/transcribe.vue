<template>
  <view class="pages transcribe">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">在线录制</view>
    </view>
    <view>
      <audio :src='recorder.localUrl' v-if='recorder' name='本地录音' controls="true"></audio>
      <view @click='handlerOnCahnger'>
        {{!status?'开始录音':'结束录音'}}
      </view>
    </view>
    <button type="primary" @click='handlerSave'>保存</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        status: false,
        isUserMedia: false,
        stream: null,
        audio: null,
        recorder: null,
        chunks: [],
        startTime: 0
      }
    },
    beforeDestroy() {
      this.stop()
    },
    mounted() {
      if (origin.indexOf('https') === -1) {
        this.$emit('error', '100')
        throw '请在 https 环境中使用本插件。'
      }
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        this.$emit('error', '101')
        throw '当前浏览器不支持'
      }

      this.getRecorderManager()
    },
    methods: {
      handlerSave() {
        let tag = document.createElement('a')
        tag.href = this.recorder.localUrl
        tag.download = '录音'
        tag.click()
      },
      getRecorderManager() {
        this.audio = document.createElement('audio')
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.isUserMedia = true
          stream.getTracks().forEach((track) => {
            track.stop()
          })
        }).catch(err => {
          this.onErrorHandler(err)
        })
      },
      start() {
        if (!this.isUserMedia) return console.log('设备不支持')

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.startTime = new Date().getTime()
          this.stream = stream
          this.recorder = new MediaRecorder(stream)
          this.recorder.ondataavailable = this.getRecordingData
          this.recorder.onstop = this.saveRecordingData
          this.recorder.start()
        }).catch(err => {
          this.onErrorHandler(err)
        })
        this.status = !this.status
      },
      stop() {
        this.recorder.stop()
        this.stream.getTracks().forEach((track) => {
          track.stop()
        })
        this.status = !this.status
      },
      getRecordingData(e) {
        this.chunks.push(e.data)
      },
      saveRecordingData() {
        console.log(this.chunks)
        const blob = new Blob(this.chunks, { 'type': 'audio/mp3' }),
            localUrl = URL.createObjectURL(blob)

        const endTime = new Date().getTime()

        let duration = (endTime - this.startTime).toString().split('')
        duration.splice(duration.length - 2)
        duration.splice(duration.length - 1, 0, '.')
        duration = parseFloat(duration.join(''))

        const recorder = {
          data: blob,
          duration: duration,
          localUrl: localUrl
        }
        this.handlerSuccess(recorder)
      },
      onErrorHandler(err) {
        console.log(err)
        if (err.name === 'NotAllowedError') {
          this.handlerError('201')
          throw '用户拒绝了当前的浏览器实例的访问请求'
        }

        if (err.name === 'NotReadableError') {
          this.handlerError('202')
          throw '当前浏览器不支持'
        }

        this.handlerError('500')
        throw '调用失败，原因不详'

      },


      handlerOnCahnger() {
        if (this.status) {
          this.stop()
        } else {
          this.start()
        }
      },
      handlerSuccess(res) {
        console.log(res)
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
        uni.redirectTo({ url: '/pages/template/voicesClone' })
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