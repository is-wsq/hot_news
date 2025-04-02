<template>
  <view class="pages templates" :style="{ height: `${safeAreaHeight - 69.8}px` }">
    <view class="clone-cards">
      <view class="card figure-bg" @click="goto('/pages/template/figure')">形象克隆</view>
      <view class="card voice-bg" @click="goto('/pages/template/voices')">声音克隆</view>
    </view>
    <view style="font-size: 18px; color: #fff;line-height: 50px">我的作品</view>
    <view class="video-list" style="height: calc(100% - 180px)">
      <view class="video-item" v-for="item in runningTask" :key="item.id">
        <view style="position: relative">
          <image class="item-img blurred" :src="item.img"></image>
          <view class="loading-title">视频生成中。。。</view>
        </view>
        <view class="item-title">{{ item.name }}</view>
      </view>
      <view class="video-item" v-for="item in showReel" :key="item.id" @click="downloadVideo(item)">
        <image class="item-img" :src="item.picture"></image>
        <view class="item-title">{{ item.filename }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'templates',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      userId: '',
      runningTask: [],
      showReel: []
    }
  },
  computed: {
    ...mapGetters('task', ['allTasks']) // 获取任务列表
  },
  watch: {
    // 监听 Vuex 任务数据的变化，自动更新任务列表
    allTasks: {
      handler() {
        this.processTasks();
        this.queryReel()
      },
      deep: true
    }
  },
  mounted() {
    this.userId = uni.getStorageSync('userId') || ''
    this.processTasks()
    this.queryReel()
  },
  methods: {
    processTasks() {
      this.runningTask = this.allTasks.filter(task => task.type === 'video' && task.status === 'running')
    },
    queryReel() {
      if (this.userId === '') {
        return
      }
      this.$http.get('/video_record/query', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.showReel = res.data
        }
      })
    },
    downloadVideo(data) {
      this.goto(`/pages/download?filepath=${data.video_path}&filename=${data.filename}`)
    },
    goto(path) {
      let userId = uni.getStorageSync('userId') || ''
      if (userId === '') {
        this.$tip.toast('请先登录')
        uni.redirectTo({url: '/pages/login/login?type=switchTab&path=/pages/template/index'})
        return
      }
      uni.redirectTo({ url: path })
    }
  }
}
</script>

<style scoped>
.clone-cards {
  display: flex;
  gap: 20px;
  padding-top: 20px;
}

.card {
  flex: 1;
  height: 100px;
  color: #fff;
  font-size: 20px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}

.figure-bg {
  background-image: url("/static/figure-bg.png");
}

.voice-bg {
  background-image: url("/static/voice-bg.png");
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-template-rows: 210px;
  gap: 10px;
  justify-items: center;
  overflow: auto;
}

.item-img {
  width: 160px;
  height: 180px;
  border-radius: 10px;
}

.item-img.blurred {
  filter: blur(8px);
}

.loading-title {
  position: absolute;
  color: #fff;
  font-size: 14px;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translate(0, -50%);
}

.item-title {
  font-size: 14px;
  color: #fff;
  width: 160px;
  text-align: center;
  margin-top: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
