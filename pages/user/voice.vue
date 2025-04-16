<template>
  <view class="pages user-voice">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">我的声音</view>
      <view class="manageBtn" @click="manage">管理</view>
    </view>
    <view class="user-voice-container" :style="{gridAutoRows: voiceWidth + 30 + 'px' }">
      <view class="user-voice-item" v-for="item in voices" :key="item.id" @click="manageVoice(item)">
        <image class="user-voice-item-img" :src="item.avatar"
               :class="{'user-voice-itemActive': selectedVoices.findIndex(video => video.id === item.id) !== -1 || audioCtxId === item.id}"
               :style="{width: voiceWidth + 'px',height: voiceWidth + 'px'}"></image>
        <view class="user-voice-item-name"
              :style="{width: voiceWidth + 'px',
              color: selectedVoices.findIndex(video => video.id === item.id) !== -1 || audioCtxId === item.id? '#E99D42' : '#ffffff'}">
          {{ item.name }}
        </view>
      </view>
    </view>
    <view class="user-voice-footer" v-if="isManage">
      <button class="user-voice-btn" style="background-color: #E99D42" @click="rename">重命名</button>
      <button class="user-voice-btn" @click="delVoices">删除</button>
    </view>
    <uni-popup ref="inputDialog" type="dialog">
      <uni-popup-dialog ref="inputClose" mode="input" title="重命名形象"
                        placeholder="请输入内容" @confirm="dialogInputConfirm">
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      voices: [],
      voiceWidth: 0,
      isManage: false,
      selectedVoices: [],
      audioCtx: null,
      audioCtxId: null,
    }
  },
  mounted() {
    this.voiceWidth = (uni.getSystemInfoSync().safeArea.width - 120) / 3
    this.queryVoices()
  },
  beforeDestroy() {
    this.stopAudio()
  },
  methods: {
    queryVoices() {
      this.$http.get('/timbres/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.voices = res.data.filter(item => item.type === 'clone')
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
    },
    manage() {
      this.stopAudio()
      this.isManage = !this.isManage
      this.selectedVoices = []
    },
    manageVoice(data) {
      if (this.isManage) {
        let index = this.selectedVoices.findIndex(item => item.id === data.id)
        if (index !== -1) {
          this.selectedVoices.splice(index, 1)
        } else {
          this.selectedVoices.push(data)
        }
      } else {
        this.previewAudio(data)
      }
    },
    previewAudio(data) {
      if (this.audioCtxId === data.id) {
        this.stopAudio()
        return
      }
      if (this.audioCtx) {
        this.stopAudio()
      }

      this.audioCtx = uni.createInnerAudioContext()
      this.audioCtx.src = data.filepath
      this.audioCtx.autoplay = true;
      this.audioCtx.play();
      this.audioCtx.onPlay(() => {
        this.audioCtxId = data.id
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
        this.audioCtxId = null
      }
    },
    rename() {
      if (this.selectedVoices.length === 0) {
        this.$tip.confirm('请先选择要重命名的音色', false)
        return;
      }
      if (this.selectedVoices.length > 1) {
        this.$tip.confirm('单次只支持重命名单个音色，请重新选择后继续', false)
        return;
      }
      this.$refs.inputDialog.open()
    },
    delVoices() {
      let ids = this.selectedVoices.map(item => item.id)
      if (ids.length === 0) {
        this.$tip.confirm('请先选择要删除的音色', false)
        return
      }
      uni.showModal({
        title: '提示',
        content: '确定要删除选中的音色吗？',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            this.$http.del(`/timbres/batch_delete`, {ids: ids}).then(res => {
              if (res.status === 'success') {
                this.selectedVoices = []
                this.$tip.toast('删除成功', 1000)
                this.queryVoices()
              } else {
                this.$tip.confirm(res.message, false)
              }
            })
          } else if (res.cancel) {
            this.selectedVoices = []
            this.$tip.toast('已取消删除', 1000)
          }
        },
      });
    },
    dialogInputConfirm(value) {
      let params = {
        timbre_id: this.selectedVoices[0].id,
        name: value
      }
      this.$http.put('/timbres/update', params).then(res => {
        if (res.status === 'success') {
          this.$tip.toast('重命名成功', 1000)
          this.selectedVoices = []
          this.queryVoices()
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
    },
    back() {
      uni.switchTab({url: '/pages/user/index'})
    }
  }
}
</script>

<style scoped>
.user-voice {
  height: 100vh;
}

.manageBtn {
  position: absolute;
  right: 5px;
  font-size: 16px;
  color: #ffffff;
}

.user-voice-container {
  height: calc(100% - 230px);
  padding: 20px 15px;
  box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(233, 157, 66, 0.2), rgba(233, 157, 157, 0));
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  overflow-y: auto;
}

.user-voice-item-img {
  border-radius: 50%;
}

.user-voice-item-name {
  line-height: 30px;
  height: 30px;
  color: #ffffff;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.user-voice-itemActive {
  border: 1px solid #E99D42;
  box-shadow: 0 0 6px 0 #E99D42;
}

.user-voice-footer {
  height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

.user-voice-btn {
  height: 40px;
  line-height: 40px;
  width: 255px;
  border-radius: 10px;
  color: #101010;
}
</style>