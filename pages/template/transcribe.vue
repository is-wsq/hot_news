<template>
  <view class="pages transcribe">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">在线录制</view>
    </view>
    <view> <audio :src='recorder.localUrl' v-if='recorder' name='本地录音' controls="true"></audio>
      <view @click='handlerOnCahnger'>
        {{!status?'开始录音':'结束录音'}}
      </view>
      <mumu-recorder ref='recorder' @success='handlerSuccess' @error='handlerError'></mumu-recorder>
    </view>
  </view>
</template>

<script>
  import MumuRecorder from '@/uni_modules/mumu-recorder/components/mumu-recorder/mumu-recorder.vue'
  export default {
    components: { MumuRecorder },
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
        uni.redirectTo({ url: '/pages/template/voicesClone' })
      }
    },
  }
</script>

<style scoped>
.transcribe {
  height: 100vh;
}
</style>