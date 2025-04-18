<template>
  <view class="pages voices">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">音色列表</view>
    </view>
    <view class="voice-type-name">系统音色</view>
    <view class="voices-list">
      <view class="voices-item" v-for="item in systems" :key="item.id"
            :class="{ 'active-item': selectedVoice.id === item.id }" @click="previewAudio(item)">
        <image :src="item.avatar? item.avatar : '/static/default-avatar1.jpg'" class="voice-avatar"/>
        <view class="voice-name">{{ item.name }}</view>
      </view>
    </view>
    <view class="voice-type-name">克隆音色</view>
    <view class="voices-list">
      <view class="voices-item" @click="selectFile">
        <uni-icons type="plusempty" class="voice-avatar clone-voice-icon" size="25" color="#e99d42"></uni-icons>
        <view class="voice-name" style="color: #e99d42 !important;">克隆音色</view>
      </view>
      <view class="voices-item" v-for="item in clones" :key="item.id"
            :class="{ 'active-item': selectedVoice.id === item.id }" @click="previewAudio(item)">
        <image :src="item.avatar" class="voice-avatar"/>
        <view class="voice-name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'voices',
  data() {
    return {
      systems: [],
      clones: [],
      selectedVoice: {},
      testAudioContext: null,
      testAudioId: null,
    }
  },
  computed: {
    ...mapGetters('task', ['allTasks']), // 获取任务列表
    voiceTasks() {
      return this.allTasks.filter(item => item.type === 'voice')
    }
  },
  watch: {
    // 监听 Vuex 类型为 voice 的任务数据的变化，自动更新任务列表
    voiceTasks: {
      handler() {
        this.queryVoices()
      },
      deep: true
    }
  },
  mounted() {
    this.queryVoices()
  },
  methods: {
    queryVoices() {
      this.systems = []
      this.clones = []
      this.$http.get('/timbres/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          res.data.forEach(item => {
            item.type === 'system' ? this.systems.push(item) : this.clones.push(item)
          })
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
    },
    generateUniqueId() {
      return Date.now() + Math.random().toString(36).substr(2, 16);
    },
    selectFile() {
      let self = this
      uni.chooseFile({
        count: 1,
        success: function (res) {
          let allowedExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.mov'];
          let filename = res.tempFiles[0].name.toLowerCase();
          let allow = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext))
          if (!allow) {
            self.$tip.confirm('请选择有效的音频文件',false)
            return
          }
          let task = {
            name: res.tempFiles[0].name,
            type: 'voice',
            id: self.generateUniqueId(),
            status: 'running'
          }
          self.$store.dispatch('task/addTask', task);
          self.$tip.confirm(`已创建音色克隆任务\n《${res.tempFiles[0].name}》`,false)

          uni.uploadFile({
            url: 'https://live.tellai.tech/api/news_assistant/timbres/clone',
            filePath: res.tempFilePaths[0],
            name: 'file',
            timeout: 1800000,
            formData: {'user_id': uni.getStorageSync('userId')},
            success: (result) => {
              let data = JSON.parse(result.data)
              if (data.status === 'success') {
                task.status = 'success'
                self.$store.dispatch('task/updateTask', task);
              } else {
                self.$tip.confirm(data.message,false)
              }
            }
          });
        }
      });
    },
    previewAudio(item) {
      this.selectedVoice = item
      if (this.testAudioId === item.id) {
        this.stopPreviewAudio()
        return
      }
      if (this.testAudioContext) {
        this.stopPreviewAudio()
      }

      this.testAudioContext = uni.createInnerAudioContext()
      this.testAudioContext.src = item.filepath
      this.testAudioContext.autoplay = true;
      this.testAudioContext.play();
      this.testAudioContext.onPlay(() => {
        this.testAudioId = item.id
      })
      this.testAudioContext.onEnded(() => {
        this.stopPreviewAudio()
      })
    },
    stopPreviewAudio() {
      this.testAudioContext.pause();
      this.testAudioContext.destroy()
      this.testAudioContext = null
      this.testAudioId = null
    },
    back() {
      uni.switchTab({
        url: '/pages/template/index'
      })
    }
  }
}
</script>

<style scoped>
.voices {
  height: 100vh;
}

.voice-type-name {
  color: #ffffff;
  font-size: 16px;
  line-height: 50px;
}

.voices-list {
  height: calc(50% - 90px);
  background-color: #292929;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 70px;
  gap: 20px;
}

.voices-item {
  display: flex;
  border: 1px solid #3a3a3a;
  padding: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  flex: 1;
  height: 70px;
}

.active-item {
  border: 1px solid #e99d42;
}

.voice-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.clone-voice-icon {
  border: 1px solid #e99d42;
  line-height: 50px;
}

.voice-name {
  margin-left: 10px;
  flex: 1;
  color: #fff;
  font-size: 14px;
  line-height: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>