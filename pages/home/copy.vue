<template>
  <view class="pages copy" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">口播文案</view>
      <view class="regenerate" @click="generate">重新生成</view>
    </view>
    <view class="copy-content">
      <view style="color: #ffffff;display: flex;justify-content: center;align-items: center">
        <view v-if="!isEdit" style="height: 23px;line-height: 23px">{{ title }}</view>
        <input style="height: 23px;line-height: 23px" v-else type="text" :focus="focus" v-model="title"
               placeholder="请输入标题"
               :style="{ width: String(title).length * 16 + 'px', maxWidth: '200px'}"></input>
        <image src="/static/edit_pan.png" style="width: 14px;height: 14px;margin-left: 10px;" @click="edit"></image>
      </view>
      <view class="copy-card">
        <view class="copy-script">{{ script }}</view>
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
    <button class="copy-btn" @click="generateVideo">口播视频生成</button>
    <uni-popup ref="voicePopup" :mask-click="false" type="bottom">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">声音</view>
          <uni-icons class="popup-close" type="closeempty" size="18" color="#ffffff"
                     @click="$refs.voicePopup.close"></uni-icons>
        </view>
        <view class="voice-content">
          <view style="flex: none;text-align: center" v-for="(item,index) in voices" :key="item.id"
                @click="selectedVoice = item">
            <view class="voice-item" :style="{ border: item.id === selectedVoice.id? '2px solid #e99d42' : '' }">
              <uni-icons custom-prefix="iconfont" type="icon-play" class="off-on" size="20" color="#ffffff"
                         v-if="testAudioIndex !== index" @click="previewAudio(item,index)"></uni-icons>
              <uni-icons custom-prefix="iconfont" type="icon-pause" class="off-on" size="20" color="#ffffff"
                         v-else @click="stopPreviewAudio"></uni-icons>
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
    <uni-popup ref="figurePopup" :mask-click="false" type="bottom">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">形象</view>
          <uni-icons class="popup-close" type="closeempty" size="18" color="#ffffff"
                     @click="$refs.figurePopup.close"></uni-icons>
        </view>
        <view class="figure-content">
          <view style="flex: none;text-align: center" v-for="item in figures" :key="item.id"
                @click="selectFigure(item)">
            <image :src="item.picture" class="figure-item"
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
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog type="info" cancelText="关闭" confirmText="下载" @confirm="downloadFile"
                        content="口播视频生成成功,可点击下载按钮跳转至下载页面,也可在我的作品中查看">
      </uni-popup-dialog>
    </uni-popup>
    <loading-video ref="loadingVideo" v-if="isLoading" :text="loadingText"/>
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
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      safeAreaWidth: uni.getSystemInfoSync().safeArea.width,
      userId: '',
      newsId: null,
      word: 0,
      styleId: '',
      isEdit: false,
      focus: false,
      title: '',
      script: '',
      scriptIndex: 0,
      scriptList: [],
      voices: [],
      voice: {},
      selectedVoice: {},
      figures: [],
      figure: {},
      selectedFigure: {},
      testAudioContext: null,
      testAudioIndex: null,
      isLoading: false,
      loadingText: '',
      fileInfo: {}
    }
  },
  onLoad: function (option) {
    this.newsId = option.newsId
    this.word = option.word
    this.styleId = option.style
  },
  onShow() {
    this.userId = uni.getStorageSync('userId')
    this.queryTitleAndScript()
    this.queryVoices()
    this.queryFigures()
  },
  methods: {
    queryFigures() {
      this.$http.get('/figure/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.figures = res.data
          if (this.figures.length > 0) {
            this.figure = this.figures[0]
            this.selectedFigure = this.figures[0]
          }
        } else {
          this.$tip.toast(res.message)
        }
      })
    },
    queryVoices() {
      this.$http.get('/timbres/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.voices = res.data
          if (this.voices.length > 0) {
            this.voice = this.voices[0]
            this.selectedVoice = this.voices[0]
          }
        } else {
          this.$tip.toast(res.message)
        }
      })
    },
    generate() {
      let params = {
        style_id: this.styleId,
        news_id: this.newsId,
        count: this.word,
      }
      this.isLoading = true
      this.loadingText = '口播文案生成中...'
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      this.$http.post('/copywriting/voice', params, 300000).then(res => {
        if (res.status === 'success') {
          this.script = res.data.script
          this.scriptList.push(res.data.script)
          this.scriptIndex = this.scriptList.length
          uni.setStorageSync(`${this.userId}_${this.newsId}_script`, this.scriptList)
          this.isLoading = false
        } else {
          this.$tip.toast(res.message)
        }
      })
    },
    generateVideo() {
      let params = {
        text: this.script,
        user_id: this.userId,
        voice_id: this.voice.voice_id,
        video_id: this.figure.video_id,
        filename: this.title
      }
      this.isLoading = true
      this.loadingText = '口播视频生成中...'
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      this.$http.post('/figure/generate_video', params, 1800000).then(res => {
        if (res.status === 'success') {
          this.isLoading = false
          this.fileInfo = res.data
          this.$refs.alertDialog.open()
        }
      })
    },
    downloadFile() {
      let filename = this.fileInfo.video_name
      let filepath = this.fileInfo.video_path
      let path = `/pages/download?filepath=${filepath}&filename=${filename}`
      uni.navigateTo({ url: path })
    },
    queryTitleAndScript() {
      this.scriptList = uni.getStorageSync(`${this.userId}_${this.newsId}_script`) || []
      if (this.scriptList.length > 0) {
        this.scriptIndex = this.scriptList.length
        this.script = this.scriptList[this.scriptIndex - 1]
      }
      this.$http.get('/news/query', {id: this.newsId}).then(res => {
        if (res.status === 'success') {
          this.title = res.data.title
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
      this.voice = this.selectedVoice
      this.$refs.voicePopup.close()
    },
    selectFigure(item) {
      if (item.status !== 'success') {
        this.$tip.toast('当前形象正在克隆中，暂不可选择')
        return
      }
      this.selectedFigure = item
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
          self.$tip.toast('复制成功')
        }
      });
    },
    prevScript() {
      if (this.scriptIndex > 1) {
        this.script = this.scriptList[this.scriptIndex - 2]
        this.scriptIndex = this.scriptIndex - 1
      } else {
        this.$tip.toast('已经是第一条口播文案了')
      }
    },
    nextScript() {
      if (this.scriptIndex < this.scriptList.length) {
        this.script = this.scriptList[this.scriptIndex]
        this.scriptIndex = this.scriptIndex + 1
      } else {
        this.$tip.toast('已经是最后一条口播文案了')
      }
    },
    back() {
      uni.navigateBack()
    },
    edit() {
      this.focus = !this.focus
      this.isEdit = !this.isEdit
    }
  },
}
</script>

<style scoped>
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
  width: 230px;
  margin: 0 auto;
  font-size: 16px;
  border-radius: 15px;
  color: #101010;
}

.popup-content {
  background-color: #292929;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 20px;
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
  height: 220px;
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
  background-color: #9A9A9A;
  position: relative;
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
  height: 250px;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  flex-wrap: nowrap;
  align-items: center
}

.figure-item {
  width: 100px;
  height: 130px;
  border-radius: 20px;
}
</style>