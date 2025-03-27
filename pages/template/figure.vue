<template>
  <view class="pages figure" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">形象列表</view>
    </view>
    <view class="figure-type-name">系统形象</view>
    <view class="figure-list">
      <view class="figure-item" v-for="item in systems" :key="item.id"
            :class="{ 'active-item': selectedFigure.id === item.id }" @click="previewFigure(item)">
        <image :src="item.picture" class="figure-avatar"/>
        <view class="figure-name">{{ item.name }}</view>
      </view>
    </view>
    <view class="figure-type-name">克隆形象</view>
    <view class="figure-list">
      <view class="figure-item" @click="cloneFigure">
        <uni-icons type="plusempty" class="figure-avatar clone-figure-icon" size="25" color="#e99d42"></uni-icons>
        <view class="figure-name" style="color: #e99d42 !important;">克隆形象</view>
      </view>
      <view class="figure-item" v-for="item in clones" :key="item.id"
            :class="{ 'figure-item': selectedFigure.id === item.id }" @click="previewFigure(item)">
        <image :src="item.picture" class="figure-avatar"/>
        <view class="figure-name">{{ item.name }}</view>
      </view>
    </view>
    <uni-popup ref="previewPopup" :mask-click="false" type="bottom">
      <view class="preview-content" :style="{ height: `${safeAreaHeight}px` }">
        <view class="preview-title">
          <view style="color: #ffffff; font-size: 16px;">[ {{ selectedFigure.name }} ] 形象预览</view>
          <uni-icons class="preview-close" type="closeempty" size="20" color="#ffffff"
                     @click="popupClose"></uni-icons>
        </view>
        <view style="height: calc(100% - 30px);position: relative;">
          <uni-icons class="preview-close" type="closeempty" size="20" color="#ffffff"
                     @click="popupClose"></uni-icons>
          <video ref="video" style="width: 100%; height: 100%;" :src="selectedFigure.filepath" :controls="false"
                 :show-center-play-btn="false"></video>
          <uni-icons custom-prefix="iconfont" type="icon-play" class="play-icon" size="20" color="#ffffff"
                     @click="controlVideo" v-if="!isPlaying"></uni-icons>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="clonePopup" :mask-click="false" type="center" style="width: 100%">
      <view class="clone-content" :style="{ width: `${safeAreaWidth * 0.8}px` }">
        <view class="clone-title">克隆形象</view>
        <view style="padding: 30px;box-sizing: border-box;">
          <view v-if="!selectedFile" style="text-align: center">
            <button @click="selectFile" size="mini" style="font-size: 14px">选择文件</button>
          </view>
          <view v-else style="display: flex">
            <view class="file-name">{{ selectedFile.name }}</view>
            <uni-icons style="margin-left: 10px;line-height: 38px;" type="trash-filled" size="20" color="#9a9a9a"
                       @click="selectedFile = null"></uni-icons>
          </view>
          <view style="margin-top: 10px;display: flex;align-items: center;">
            <checkbox-group @change="cloneSound = !cloneSound">
              <checkbox color="#42B983" style="transform:scale(0.7)"/>
            </checkbox-group>
            <view style="font-size: 14px;">同时克隆声音</view>
          </view>
        </view>
        <view style="display: flex;">
          <view class="clone-btn" style="border-right: 1px solid #f5f5f5;" @click="clonePopupClose">取消</view>
          <view class="clone-btn" style="color: #007aff" @click="clone">克隆</view>
        </view>
      </view>
    </uni-popup>
    <loading-video ref="loadingVideo" v-if="isLoading" text="视频克隆中..."/>
  </view>
</template>

<script>
import LoadingVideo from "../../components/loading-video.vue";

export default {
  name: 'Figure',
  components: {LoadingVideo},
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      safeAreaWidth: uni.getSystemInfoSync().safeArea.width,
      systems: [],
      clones: [],
      selectedFigure: {},
      src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
      isPlaying: false,
      cloneSound: false,
      selectedFile: null,
      isLoading: false
    }
  },
  mounted() {
    this.queryFigures()
  },
  methods: {
    queryFigures() {
      this.systems = []
      this.clones = []
      this.$http.get('/figure/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          res.data.forEach(item => {
            item.type === 'system' ? this.systems.push(item) : this.clones.push(item)
          })
        } else {
          this.$tip.toast(res.message)
        }
      })
    },
    previewFigure(item) {
      if (item.status !== 'success') {
        this.$tip.toast('形象还未克隆完成，暂时无法预览')
        return
      }
      this.selectedFigure = item
      this.$refs.previewPopup.open()
    },
    controlVideo() {
      this.$refs.video.play();
      this.isPlaying = true;
    },
    popupClose() {
      this.isPlaying = false;
      this.$refs.video.pause();
      this.$refs.previewPopup.close();
    },
    cloneFigure() {
      this.$refs.clonePopup.open()
    },
    selectFile() {
      let self = this
      uni.chooseFile({
        count: 1,
        success: function (res) {
          let allowedExtensions = ['.mp4', '.mov'];
          let filename = res.tempFiles[0].name.toLowerCase();
          let allow = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext))
          if (!allow) {
            self.$tip.toast('请选择有效的视频文件')
            return
          }
          self.selectedFile = res.tempFiles[0]
        }
      });
    },
    clone() {  //克隆方法
      console.log(this.selectedFile)
      console.log(this.cloneSound)
      let self = this
      self.isLoading = true
      self.$nextTick(() => {
        self.$refs.loadingVideo.playVideo()
      })
      self.$refs.clonePopup.close()
      uni.uploadFile({
        url: 'https://live.tellai.tech/api/news_assistant/figure/clone',
        filePath: self.selectedFile.path,
        name: 'file',
        timeout: 1800000,
        formData: {
          'user_id': uni.getStorageSync('userId'),
          // cloneSound: self.cloneSound
          'cloneSound': false
        },
        success: (result) => {
          let data = JSON.parse(result.data)
          if (data.status === 'success') {
            self.$tip.toast('克隆成功')
            self.queryFigures()
          } else {
            self.$tip.toast(data.message)
          }
          self.isLoading = false
        }
      });
    },
    clonePopupClose() {
      this.selectedFile = null
      this.cloneSound = false
      this.$refs.clonePopup.close()
    },
    back() {
      uni.switchTab({ url: '/pages/template/index' })
    }
  }
}
</script>

<style scoped>
.figure-type-name {
  color: #ffffff;
  font-size: 16px;
  line-height: 50px;
}

.figure-list {
  height: calc(50% - 90px);
  background-color: #292929;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 90px;
  gap: 20px;
}

.figure-item {
  display: flex;
  border: 1px solid #3a3a3a;
  padding: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  flex: 1;
  height: 90px;
}

.active-item {
  border: 1px solid #e99d42;
}

.figure-avatar {
  width: 60px;
  height: 70px;
  border-radius: 10px;
}

.clone-figure-icon {
  border: 1px solid #e99d42;
  line-height: 70px;
}

.figure-name {
  margin-left: 10px;
  flex: 1;
  color: #fff;
  font-size: 14px;
  line-height: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-content {
  background-color: #292929;
  padding: 20px 0;
  box-sizing: border-box;
}

.preview-title {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}

.preview-close {
  position: absolute;
  top: 5px;
  right: 10px;
  color: #ffffff;
}

.play-icon {
  height: 20px;
  width: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.clone-content {
  background: #fff;
  border-radius: 11px;
  padding-top: 20px;
  box-sizing: border-box;
}

.clone-title {
  font-size: 16px;
  font-weight: 500;
  color: #909399;
  text-align: center;
}

.file-name {
  font-size: 14px;
  line-height: 36px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clone-btn {
  flex: 1;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  border-radius: 0 0 0 11px;
  border-top: 1px solid #f5f5f5;
}
</style>