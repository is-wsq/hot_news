<template>
  <view class="pages copy">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">口播文案</view>
      <view class="regenerate" @click="generate">重新生成</view>
    </view>
    <view class="copy-content">
      <input style="height: 23px;line-height: 23px;width: 100%;text-align: center;color: #ffffff" type="text" v-model="news.title"></input>
      <view class="copy-card">
        <textarea class="copy-script" type="text" v-model="script" placeholder-style="color:#9A9A9A"
                  placeholder="请输入文案内容" :maxlength="-1"></textarea>
        <view style="height: 40px;display: flex;align-items: end">
          <view
              style="margin-left: 18px;width: calc(100% - 36px);color: #d3d3d3;display: flex;justify-content: center;align-items: center">
            <template v-if="scriptList.length > 1">
              <uni-icons type="left" size="18" color="#d3d3d3" @click="prevScript"></uni-icons>
              <view style="margin: 0 10px"> {{ scriptIndex }}</view>
              <view> /</view>
              <view style="margin: 0 10px"> {{ scriptList.length }}</view>
              <uni-icons type="right" size="18" color="#d3d3d3" @click="nextScript"></uni-icons>
            </template>
          </view>
          <image class="copy-icon" src="/static/copy_icon.png" @click="copy"></image>
        </view>
      </view>
    </view>
    <view class="warning">内容由DeepSeek R1生成，禁止从事违法活动</view>
    <view class="copy-setting">
      <view class="setting-item">
        <view style="color: #E5E5E5;">声音选择</view>
        <view class="setting-name" @click="$refs.voicePopup.open">{{ voice.name }}</view>
        <uni-icons type="right" size="20" color="#E5E5E5;" @click="$refs.voicePopup.open"></uni-icons>
      </view>
      <view class="setting-item">
        <view style="color: #E5E5E5;">形象选择</view>
        <view class="setting-name" @click="$refs.figurePopup.open">{{ figure.name }}</view>
        <uni-icons type="right" size="20" color="#E5E5E5;" @click="$refs.figurePopup.open"></uni-icons>
      </view>
    </view>
    <view style="position: relative;width: 250px;margin: 0 auto">
      <button class="copy-btn" @click="generateVideo" :disabled="disabled">口播视频生成</button>
    </view>
    <uni-popup ref="voicePopup" type="bottom" background-color="#292929" borderRadius="12px 12px 0 0" @maskClick="closeVoicePopup">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">声音</view>
        </view>
        <view style="color: #ffffff;font-size: 14px;margin-top: 10px;">系统音色</view>
        <view class="voice-content">
          <view style="flex: none;text-align: center" v-for="(item,index) in systemVoice" :key="item.id"
                @click="selectedVoice = item">
            <view class="voice-item" :style="{ border: item.id === selectedVoice.id? '2px solid #e99d42' : '', backgroundImage: `url(${item.avatar})` }">
              <uni-icons fontFamily="CustomFont" class="off-on" size="20" color="#ffffff" v-if="testAudioIndex !== index"
                         @click="previewAudio(item,index)">{{'\ue618'}}</uni-icons>
              <uni-icons fontFamily="CustomFont" class="off-on" size="20" color="#ffffff" v-else
                         @click="stopPreviewAudio">{{'\ue637'}}</uni-icons>
            </view>
            <view
                style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 80px;"
                :style="{ color: item.id === selectedVoice.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <view style="color: #ffffff;font-size: 14px;margin-top: 10px;">克隆音色</view>
        <view class="voice-content">
          <view style="flex: none;text-align: center" v-for="(item,index) in cloneVoice" :key="item.id"
                @click="selectedVoice = item">
            <view class="voice-item" :style="{ border: item.id === selectedVoice.id? '2px solid #e99d42' : '', backgroundImage: `url(${item.avatar})` }">
              <uni-icons fontFamily="CustomFont" class="off-on" size="20" color="#ffffff" v-if="testAudioIndex !== index"
                         @click="previewAudio(item,index)">{{'\ue618'}}</uni-icons>
              <uni-icons fontFamily="CustomFont" class="off-on" size="20" color="#ffffff" v-else
                         @click="stopPreviewAudio">{{'\ue637'}}</uni-icons>
            </view>
            <view
                style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 80px;"
                :style="{ color: item.id === selectedVoice.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <button class="copy-btn" @click="voiceSure">确定</button>
      </view>
    </uni-popup>
    <uni-popup ref="figurePopup" type="bottom" background-color="#292929" borderRadius="12px 12px 0 0">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">形象</view>
        </view>
        <view style="color: #ffffff;font-size: 14px;margin-top: 10px;">系统形象</view>
        <view class="figure-content">
          <view style="flex: none;text-align: center" v-for="item in systemFigure" :key="item.id"
                @click="selectedFigure = item">
            <image :src="item.picture" class="figure-item" mode="aspectFill"
                   :style="{ border: item.id === selectedFigure.id? '2px solid #e99d42' : '' }"></image>
            <view
                style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 100px;"
                :style="{ color: item.id === selectedFigure.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <view style="color: #ffffff;font-size: 14px;margin-top: 10px;">克隆形象</view>
        <view class="figure-content">
          <view style="flex: none;text-align: center" v-for="item in cloneFigure" :key="item.id"
                @click="selectedFigure = item">
            <image :src="item.picture" class="figure-item" mode="aspectFill"
                   :style="{ border: item.id === selectedFigure.id? '2px solid #e99d42' : '' }"></image>
            <view
                style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 100px;"
                :style="{ color: item.id === selectedFigure.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <button class="copy-btn" @click="figureSure">确定</button>
      </view>
    </uni-popup>
    <loading-video ref="loadingVideo" v-if="isLoading" text="口播文案生成中..."/>
  </view>
</template>

<script>
import LoadingVideo from '@/components/loading-video.vue'

export default {
  name: 'Detail',
  components: {
    LoadingVideo
  },
  data() {
    return {
      userId: '',
      news: {},
      word: 0,
      styleId: '',
      isEdit: false,
      focus: false,
      script: '',
      scriptIndex: 0,
      scriptList: [],
      voices: [],
      systemVoice: [],
      cloneVoice: [],
      voice: {},
      selectedVoice: {},
      systemFigure: [],
      cloneFigure: [],
      figure: {},
      selectedFigure: {},
      testAudioContext: null,
      testAudioIndex: null,
      isLoading: false,
      fileInfo: {},
      type: '',
      productInfo: '',
      userInfo: {},
      disabled: false
    }
  },
  mounted() {
    this.userId = uni.getStorageSync('userId')
    this.news = uni.getStorageSync('news')
    this.word = uni.getStorageSync('wordSetting')
    this.styleId = uni.getStorageSync('styleId')
    this.productInfo = uni.getStorageSync('productInfo')
    this.queryHistoryCopy()
    this.queryVoices()
    this.queryFigures()
    this.queryUserInfo()
  },
  methods: {
    queryUserInfo() {
      this.$http.get('/user/query', {user_id: this.userId}).then(async res => {
        if (res.status ==='success') {
          this.userInfo = res.data
        }
      })
    },
    queryFigures() {
      this.$http.get('/figure/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.systemFigure = res.data.filter(item => item.status === 'success' && item.type === 'system')
          this.cloneFigure = res.data.filter(item => item.status === 'success' && item.type === 'clone')
          if (this.systemFigure.length > 0) {
            this.figure = this.systemFigure[0]
            this.selectedFigure = this.systemFigure[0]
          }
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
    },
    queryVoices() {
      this.$http.get('/timbres/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.systemVoice = res.data.filter(item => item.status === 'success' && item.type === 'system')
          this.cloneVoice = res.data.filter(item => item.status === 'success' && item.type === 'clone')
          if (this.systemVoice.length > 0) {
            this.voice = this.systemVoice[0]
            this.selectedVoice = this.systemVoice[0]
          }
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
    },
    generate() {
      let params = {
        user_id: this.userId,
        style_id: this.styleId,
        news_details: this.news.details,
        news_id: this.news.id,
        count: this.word,
        productInfo: this.productInfo
      }
      this.isLoading = true
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      this.$http.post('/copywriting/voice', params, 300000).then(res => {
        if (res.status === 'success') {
          this.queryHistoryCopy()
          this.isLoading = false
        } else {
          this.isLoading = false
          this.$tip.confirm(res.message,false)
        }
      })
    },
    generateVideo() {
      if (this.news.title === ''){
        this.$tip.confirm('请输入标题',false)
        return
      }
      if (this.userInfo.point < 20) {
        this.$tip.confirm(`积分余额须大于20方可使用本服务，当前剩余积分${this.userInfo.point}`,false)
        return;
      }
      this.$tip.confirm('确定生成视频？',true).then((res) => {
        if (res === 'success') {
          this.disabled = true
          let params = {
            text: this.script,
            user_id: this.userId,
            voice_id: this.voice.voice_id,
            video_id: this.figure.video_id,
            filename: this.news.title
          }
          this.$http.post('/figure/generate_video', params).then(res => {
            if (res.status === 'success') {
              this.$tip.confirm(`已创建口播视频生成任务\n《${this.news.title}.mp4》`,false).then(() => {
                this.disabled = false
                uni.switchTab({
                  url: '/pages/template/index'
                })
              })
            }else {
              this.$tip.confirm(`创建口播视频生成任务\n《${this.news.title}.mp4》失败,${res.message}`, false).then(() => {
                this.disabled = false
              })
            }
          })
        }
      })
    },
    queryHistoryCopy() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        news_id: uni.getStorageSync('news').id
      }
      this.$http.get('/copywriting_history/query', params).then(res => {
        if (res.status === 'success') {
          this.scriptList = res.data
          if (uni.getStorageSync('scriptIndex')) {
            this.scriptIndex = parseInt(uni.getStorageSync('scriptIndex')) + 1
            setTimeout(() => {
              uni.removeStorageSync('scriptIndex')
            })
          } else {
            this.scriptIndex = 1
          }
          this.script = this.scriptList[this.scriptIndex - 1].copywriting
        }
      })
    },
    previewAudio(item, index) {
      if (this.testAudioContext) {
        this.stopPreviewAudio()
      }

      this.testAudioContext = uni.createInnerAudioContext()
      this.testAudioContext.src = item.filepath
      this.testAudioContext.autoplay = true;
      this.testAudioContext.play();
      this.testAudioContext.onPlay(() => {
        this.testAudioIndex = index
      })
      this.testAudioContext.onEnded(() => {
        this.stopPreviewAudio()
      })
    },
    stopPreviewAudio() {
      this.testAudioContext.pause();
      this.testAudioContext.destroy()
      this.testAudioContext = null
      this.testAudioIndex = null
    },
    voiceSure() {
      if (this.testAudioContext) {
        this.stopPreviewAudio()
      }
      this.voice = this.selectedVoice
      this.$refs.voicePopup.close()
    },
    closeVoicePopup() {
      if (this.testAudioContext) {
        this.stopPreviewAudio()
      }
      this.$refs.voicePopup.close()
    },
    figureSure() {
      this.figure = this.selectedFigure
      this.$refs.figurePopup.close()
    },
    copy() {
      let self = this
      uni.setClipboardData({
        data: self.script,
        showToast: false,
        success: function () {
          self.$tip.confirm('复制成功',false)
        }
      });
    },
    prevScript() {
      if (this.scriptIndex > 1) {
        this.script = this.scriptList[this.scriptIndex - 2].copywriting
        this.scriptIndex = this.scriptIndex - 1
      } else {
        this.$tip.confirm('已经是第一条口播文案了',false)
      }
    },
    nextScript() {
      if (this.scriptIndex < this.scriptList.length) {
        this.script = this.scriptList[this.scriptIndex].copywriting
        this.scriptIndex = this.scriptIndex + 1
      } else {
        this.$tip.confirm('已经是最后一条口播文案了',false)
      }
    },
    back() {
      uni.hideKeyboard()
      setTimeout(() => {
        uni.redirectTo({url: `/pages/home/detail`})
      },100)
    },
    edit() {
      this.focus = true
      this.isEdit = true
    }
  },
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

.copy {
  height: 100vh;
}

.regenerate {
  position: absolute;
  right: 5px;
  color: #ffffff;
}

.copy-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 230px);
}

.copy-title {
  height: 23px;
  line-height: 23px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-card {
  width: 100%;
  height: calc(100% - 30px);
  margin-top: 10px;
  border-radius: 20px;
  background-color: #303030;
  padding: 14px;
  box-sizing: border-box;
}

.copy-script {
  height: calc(100% - 40px);
  width: 100%;
  overflow-y: auto;
  font-size: 14px;
  color: #9A9A9A;
}

.copy-icon {
  width: 18px;
  height: 18px;
  margin-top: 5px;
  margin-right: 3px;
}

.warning {
  color: #9A9A9A;
  font-size: 14px;
  margin: 10px 0;
}

.copy-setting {
  margin-bottom: 10px;
  margin-left: 10px;
}

.setting-item {
  color: #ffffff;
  font-size: 16px;
  height: 35px;
  line-height: 35px;
  display: flex;
  align-items: center;
}

.setting-name {
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 20px;
  text-align: right;
  color: #E5E5E5;
}

.copy-btn {
  background-color: #e99d42;
  width: 250px;
  margin: 0 auto;
  font-size: 16px;
  border-radius: 15px;
  color: #101010;
}

.word-count {
  position: absolute;
  top: 0;
  right: 20px;
  height: 40px;
  display: flex;
  align-items: center;
}

.popup-content {
  background-color: #292929;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 20px 10px;
}

.popup-title {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.popup-close {
  position: absolute;
  top: 5px;
  right: 0;
  color: #ffffff;
}

.voice-content {
  width: 100%;
  height: 150px;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  flex-wrap: nowrap;
  align-items: center
}

.voice-item {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  background-size: cover;
}

.off-on {
  height: 20px;
  width: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.figure-content {
  width: 100%;
  height: 180px;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  flex-wrap: nowrap;
  align-items: center
}

.figure-item {
  width: 90px;
  height: 120px;
  border-radius: 12px;
}
</style>