<template>
  <view class="pages custom">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">口播文案</view>
    </view>
    <view class="custom-content">
      <view style="color: #ffffff;display: flex;justify-content: center;align-items: center">
        <view v-if="!isEdit" style="height: 23px;line-height: 23px" @click="edit">{{ title ? title : '请输入标题' }}</view>
        <input v-else style="height: 23px;line-height: 23px;text-align: center" type="text" :focus="focus" v-model="title"
               @blur="isEdit = false">
        </input>
      </view>
      <view class="custom-card">
        <textarea class="custom-script" type="text" v-model="script" placeholder-style="color:#9A9A9A"
                  placeholder="请输入文案内容" :maxlength="-1"></textarea>
        <view style="height: 20px;text-align: end">
          <image class="custom-icon" src="/static/copy_icon.png" @click="copy"></image>
        </view>
      </view>
    </view>
    <view class="warning">内容禁止从事违法活动</view>
    <view class="custom-setting">
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
      <button class="custom-btn" @click="generateVideo" :disabled="disabled">口播视频生成</button>
      <view class="word-count">
        <uni-icons fontFamily="CustomFont" color="#ffffff" size="18">{{'\ue607'}}</uni-icons>
        <view style="margin-left: 3px;color: #ffffff;font-size: 14px">{{ scriptLengthInHundredths }}</view>
      </view>
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
            <view style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 80px;"
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
            <view style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 80px;"
                  :style="{ color: item.id === selectedVoice.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <button class="custom-btn" @click="voiceSure">确定</button>
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
            <view style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 100px;"
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
            <view style="margin-top: 10px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 100px;"
                  :style="{ color: item.id === selectedFigure.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <button class="custom-btn" @click="figureSure">确定</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      userId: '',
      isEdit: false,
      focus: false,
      title: '',
      script: '',
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
      userInfo: {},
      disabled: false
    }
  },
  computed: {
    scriptLengthInHundredths() {
      return Math.ceil(this.script.length / 100);
    }
  },
  mounted() {
    if (uni.getStorageSync('allScriptIndex') || parseInt(uni.getStorageSync('allScriptIndex')) === 0) {
      let index = parseInt(uni.getStorageSync('allScriptIndex'))
      this.$http.get('/copywriting_history/query/all',{user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.title = res.data[index].title
          this.script = res.data[index].copywriting
        }else {
          this.$tip.toast(res.message)
        }
      })
      uni.removeStorageSync('allScriptIndex')
    }
    this.userId = uni.getStorageSync('userId')
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
    generateVideo() {
      if (this.title === ''){
        this.$tip.confirm('请输入标题',false)
        return
      }
      if (this.script === '') {
        this.$tip.confirm('请输入文案内容',false)
        return;
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
            filename: this.title
          }
          this.$http.post('/figure/generate_video', params).then(res => {
            if (res.status === 'success') {
              this.$tip.confirm(`已创建口播视频生成任务\n《${this.title}.mp4》`,false).then(() => {
                this.disabled = false
                uni.switchTab({
                  url: '/pages/template/index'
                })
              })
            }else {
              this.$tip.confirm(`创建口播视频生成任务\n《${this.title}.mp4》失败,${res.message}`, false).then(() => {
                this.disabled = false
              })
            }
          })
        }
      })
    },
    back() {
      uni.hideKeyboard()
      setTimeout(() => {
        let back_params = uni.getStorageSync('back_params')
        if (back_params.type === 'redirectTo') {
          uni.redirectTo({url: back_params.path})
        }else {
          uni.switchTab({url: back_params.path})
        }
      },100)
    },
    edit() {
      this.isEdit = true
      this.focus = true
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

.custom {
  height: 100vh;
}

.custom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 235px);
}

.custom-card {
  width: 100%;
  height: calc(100% - 30px);
  margin-top: 10px;
  border-radius: 20px;
  background-color: #303030;
  padding: 14px;
  box-sizing: border-box;
}

.custom-script {
  height: calc(100% - 20px);
  line-height: 23px;
  width: 100%;
  overflow-y: auto;
  font-size: 14px;
  color: #9A9A9A;
}

.custom-icon {
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

.custom-setting {
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

.custom-btn {
  background-color: #e99d42;
  width: 250px;
  margin: 0 auto;
  font-size: 16px;
  border-radius: 10px;
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