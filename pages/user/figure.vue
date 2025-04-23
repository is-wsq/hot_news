<template>
  <view class="pages user-figure">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">我的数字人</view>
      <view class="manageBtn" @click="manage" v-if="figures.length > 0">管理</view>
    </view>
    <view class="user-figure-container" :style="{gridAutoRows: figureWidth * 4 / 3 + 30 + 'px' }" v-if="figures.length > 0">
      <view class="user-figure-item" v-for="item in figures" :key="item.id" @click="manageFigure(item)">
        <image class="user-figure-item-img" :src="item.picture"
               :class="{'user-figure-itemActive': selectedFigures.findIndex(video => video.id === item.id) !== -1}"
               :style="{width: figureWidth + 'px',height: figureWidth * 4 / 3 + 'px'}"></image>
        <view class="user-figure-item-name" :style="{width: figureWidth + 'px'}">{{ item.name }}</view>
      </view>
    </view>
    <view class="empty-figure" v-else>
      <uni-icons fontFamily="CustomFont" color="#333333" size="70">{{'\ue76c'}}</uni-icons>
      <view class="empty-figure-title">
        <view>暂无形象，</view>
        <view style="color: #636dae" @click="toClone">去克隆？</view>
      </view>
    </view>
    <view class="user-figure-footer" v-if="isManage">
      <button class="user-figure-btn" style="background-color: #E99D42" @click="rename">重命名</button>
      <button class="user-figure-btn" @click="delVideos">删除</button>
    </view>
    <uni-popup ref="popup" type="center" border-radius="10px">
      <view style="position: relative">
        <video ref="video" style="background-color: #999999;border-radius: 10px" :src="filepath"
               :poster="poster" :controls="false" :show-center-play-btn="false" @ended="isPlaying = false"
               :style="{width: safeArea.width * 0.8 + 'px',height: safeArea.width * 0.8 * 4 / 3 + 'px'}">
        </video>
        <uni-icons fontFamily="CustomFont" class="play-icon" size="30" color="#ffffff"
                   @click="controlVideo" v-if="!isPlaying">{{'\ue618'}}</uni-icons>
      </view>
    </uni-popup>
    <uni-popup ref="inputDialog" type="dialog">
      <uni-popup-dialog ref="inputClose" mode="input" title="重命名形象"
                        placeholder="输入新名称" @confirm="dialogInputConfirm">
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'UserFigure',
  data() {
    return {
      safeArea: uni.getSystemInfoSync().safeArea,
      figureWidth: 0,
      figures: [],
      isManage: false,
      filepath: '',
      poster: '',
      isPlaying: false,
      selectedFigures: []
    }
  },
  mounted() {
    this.figureWidth = (uni.getSystemInfoSync().safeArea.width - 90) / 3
    this.queryFigures()
  },
  methods: {
    queryFigures() {
      this.$http.get('/figure/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.figures = res.data.filter(item => item.type === 'clone')
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
    },
    manage() {
      this.isManage = !this.isManage
      this.selectedFigures = []
    },
    manageFigure(data) {
      if (this.isManage) {
        let index = this.selectedFigures.findIndex(item => item.id === data.id)
        if (index !== -1) {
          this.selectedFigures.splice(index, 1)
        } else {
          this.selectedFigures.push(data)
        }
      } else {
        this.poster = data.picture
        this.filepath = data.filepath
        this.$refs.popup.open()
      }
    },
    toClone() {
      uni.redirectTo({url: '/pages/template/figureClone'})
    },
    rename() {
      if (this.selectedFigures.length === 0) {
        this.$tip.confirm('请先选择要重命名的数字人', false)
        return;
      }
      if (this.selectedFigures.length > 1) {
        this.$tip.confirm('单次只支持重命名单个数字人，请重新选择后继续', false)
        return;
      }
      this.$refs.inputDialog.open()
    },
    delVideos() {
      let ids = this.selectedFigures.map(item => item.id)
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
            this.$http.del(`/figure/batch_delete`, {ids: ids}).then(res => {
              if (res.status === 'success') {
                this.selectedFigures = []
                this.$tip.toast('删除成功', 1000)
                this.queryFigures()
              } else {
                this.$tip.confirm(res.message, false)
              }
            })
          } else if (res.cancel) {
            this.selectedFigures = []
            this.$tip.toast('已取消删除', 1000)
          }
        },
      });
    },
    controlVideo() {
      this.$refs.video.play();
      this.isPlaying = true;
    },
    dialogInputConfirm(value) {
      let params = {
        figure_id: this.selectedFigures[0].id,
        name: value
      }
      this.$http.put('/figure/update', params).then(res => {
        if (res.status === 'success') {
          this.$tip.toast('重命名成功', 1000)
          this.selectedFigures = []
          this.queryFigures()
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
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

.user-figure {
  height: 100vh;
}

.manageBtn {
  position: absolute;
  right: 5px;
  font-size: 16px;
  color: #ffffff;
}

.user-figure-container {
  height: calc(100% - 230px);
  padding: 20px 15px;
  box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(233, 157, 66, 0.2), rgba(233, 157, 157, 0));
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  overflow-y: auto;
}

.empty-figure {
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-figure-title {
  font-size: 16px;
  color: #333333;
  margin-top: 10px;
  display: flex;
}

.user-figure-item-img {
  border-radius: 15px;
}

.user-figure-item-name {
  line-height: 30px;
  height: 30px;
  color: #ffffff;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.user-figure-footer {
  height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

.user-figure-btn {
  height: 40px;
  line-height: 40px;
  width: 255px;
  border-radius: 10px;
  color: #101010;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.user-figure-itemActive {
  border: 1px solid #E99D42;
  box-shadow: 0 0 6px 0 #E99D42;
}
</style>