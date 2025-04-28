<template>
  <view class="pages video">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">我的作品</view>
      <view class="manageBtn" @click="manage" v-if="videoTasks.length > 0">管理</view>
    </view>
    <view class="video-list" v-if="videoTasks.length > 0 || showReel.length > 0">
      <view class="video-item" v-for="item in videoTasks" :key="item.id">
        <view class="image-wrapper shining">
          <image class="item-img" src="/static/img/20.png"></image>
          <view class="shine-layer"></view>
          <view class="loading-title">
            <view>视频生成中</view>
            <view class="dot">{{ dot }}</view>
          </view>
        </view>
        <view class="item-title" style="margin-top: 1px">{{ item.name }}</view>
      </view>
      <view class="video-item" v-for="item in showReel" :key="item.id" @click="manageVideo(item)">
        <image class="item-img" :src="item.picture"
               :class="{'active-item': selectedVideos.findIndex(video => video.id === item.id) !== -1}">
        </image>
        <view class="item-title"
              :style="{color: selectedVideos.findIndex(video => video.id === item.id) !== -1 ? '#e99d42' : '#ffffff'}">
          {{ item.filename }}
        </view>
      </view>
    </view>
    <view class="empty-list" v-else>
      <uni-icons fontFamily="CustomFont" color="#333333" size="70">{{'\ue76c'}}</uni-icons>
      <view class="empty-list-title">暂无作品保存</view>
    </view>
    <view class="video-footer">
      <view v-if="!isManage">只保留近三天生成的作品</view>
      <button class="delBtn" v-else @click="delVideos">删除</button>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'videoList',
  data() {
    return {
      showReel: [],
      dotCount: 1,
      dotTimer: null,
      dot: '.',
      isManage: false,
      selectedVideos: [],
    }
  },
  computed: {
    ...mapGetters('task', ['allTasks']),
    videoTasks() {
      return this.allTasks.filter((item) => item.type === "video");
    },
  },
  watch: {
    videoTasks: {
      handler() {
        this.queryReel()
      },
      deep: true
    }
  },
  mounted() {
    this.queryReel()
    if (this.videoTasks.length > 0) {
      this.startDotAnimation()
    }
  },
  beforeDestroy() {
    clearInterval(this.dotTimer)
  },
  methods: {
    startDotAnimation() {
      this.dotTimer = setInterval(() => {
        this.dotCount = this.dotCount % 3 + 1;
        this.dot = '.'.repeat(this.dotCount);
      }, 1000);
    },
    manage() {
      this.isManage = !this.isManage
      this.selectedVideos = []
    },
    manageVideo(data) {
      if (!this.isManage) {
        let path = `/pages/download?filepath=${data.video_path}&filename=${data.filename}`
        uni.redirectTo({url: path})
      }else {
        let index = this.selectedVideos.findIndex(item => item.id === data.id)
        if (index !== -1) {
          this.selectedVideos.splice(index, 1)
        }else {
          this.selectedVideos.push(data)
        }
      }
    },
    queryReel() {
      let params = {
        user_id: uni.getStorageSync('userId')
      }
      this.$http.get('/video_record/query', params).then(res => {
        console.log('111',res)
        if (res.status === 'success') {
          this.showReel = res.data
        }
      })
    },
    delVideos() {
      let ids = this.selectedVideos.map(item => item.id)
      if (ids.length === 0) {
        this.$tip.confirm('请先选择要删除的视频', false)
        return
      }
      uni.showModal({
        title: '提示',
        content: '确定要删除选中的视频吗？',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            this.$http.del(`/video_record/batch_delete`, {ids: ids}).then(res => {
              if (res.status === 'success') {
                this.selectedVideos = []
                this.$tip.toast('删除成功', 1000)
                this.queryReel()
              }else {
                this.$tip.confirm(res.message, false)
              }
            })
          } else if (res.cancel) {
            this.selectedVideos = []
            this.$tip.toast('已取消删除', 1000)
          }
        },
      });
    },
    back() {
      uni.switchTab({url: '/pages/template/index'})
    },
  }
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

.video {
  height: 100vh;
}

.manageBtn {
  position: absolute;
  right: 5px;
  font-size: 16px;
  color: #ffffff;
}

.video-list {
  height: calc(100% - 140px);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-template-rows: 230px;
  gap: 10px;
  justify-items: center;
  overflow: auto;
}

.empty-list {
  height: calc(100% - 140px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-list-title {
  font-size: 16px;
  margin-top: 10px;
  color: #333333;
}

.item-img {
  width: 150px;
  height: 200px;
  border-radius: 10px;
}

.item-img.blurred {
  filter: blur(15px);
  opacity: 0.8
}

.loading-title {
  position: absolute;
  color: #fff;
  font-size: 14px;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translate(0, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 20px;
  text-align: left;
  margin-left: 5px;
  font-size: 16px;
  line-height: 40px;
}

.item-title {
  font-size: 14px;
  color: #fff;
  width: 150px;
  text-align: center;
  margin-top: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-footer {
  height: 35px;
  margin-top: 25px;
  color: #9A9A9A;
  font-size: 14px;
  text-align: center;
  line-height: 35px;
}

.delBtn {
  height: 35px;
  line-height: 35px;
  width: 255px;
  border-radius: 10px;
  color: #101010;
}

.active-item {
  border: 2px solid #e99d42;
}
</style>