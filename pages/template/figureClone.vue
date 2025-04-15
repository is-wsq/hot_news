<template>
  <view class="pages figureClone">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">形象克隆</view>
      <view class="figure-list" @click="gotoFigures">形象列表</view>
    </view>
    <view class="figure-content">
      <view style="margin-bottom: 15px">正确示例</view>
      <view style="display: flex">
        <view class="template-img"></view>
        <view class="template-requires">
          <view style="height: 40px;display: flex;align-items: center" v-for="(item,index) in requires" :key="index">
            <uni-icons type="checkbox-filled" size="22" color="#77C285" style="margin: 0 5px"></uni-icons>
            <view style="font-size: 14px">{{ item }}</view>
          </view>
        </view>
      </view>
      <view style="margin: 15px 0">错误示例</view>
      <view style="display: flex;gap: 15px">
        <view v-for="(item,index) in errors" :key="index">
          <view class="error-img"
                :style="{width: `${errorWidth}px`,height: `${errorHeight}px`,backgroundImage: `url(${item.img})`}">
            <view style="position: absolute;bottom: 0;right: 0">
              <uni-icons type="clear" size="20" color="#BD3124"></uni-icons>
            </view>
          </view>
          <view style="width: 100%;text-align: center;margin-top: 5px">{{ item.name }}</view>
        </view>
      </view>
      <view style="margin: 15px 0">视频教程</view>
      <video style="width: 100%;height: 200px" :src="src" :poster="poster"></video>
    </view>
    <view class="figure-footer">
      <button class="clone-button" @click="cloneFigure">开始克隆</button>
    </view>
    <uni-popup ref="clonePopup" :mask-click="false" type="center" style="width: 100%">
      <view class="clone-content" :style="{ width: `${contentWidth * 0.8}px` }">
        <view class="clone-title">克隆形象</view>
        <view style="padding: 10px 20px;box-sizing: border-box;">
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
            <view style="font-size: 14px;color: #000000">同时克隆声音</view>
          </view>
        </view>
        <view style="display: flex;margin-top: 10px">
          <view class="clone-btn" style="border-right: 1px solid #f5f5f5;color: #000000" @click="clonePopupClose">取消</view>
          <view class="clone-btn" style="color: #007aff" @click="clone">克隆</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'figureClone',
  data() {
    return {
      requires: ['提交1-3分钟的视频片段', '使用高分辨率相机和麦克风', '录制环境光线充足、安静', '保持人物一直在画框中', '直视镜头', '适当配合通用手势'],
      errors: [
        {name: '遮住嘴巴', img: '/static/img/20.jpg'},
        {name: '人脸出框', img: '/static/img/20.jpg'},
        {name: '侧脸拍摄', img: '/static/img/20.jpg'},
      ],
      contentWidth: 0,
      errorWidth: 0,
      errorHeight: 0,
      src: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
      poster: 'https://www.w3schools.com/images/w3schools_green.jpg',
      selectedFile: null,
      cloneSound: false,
    }
  },
  mounted() {
    this.contentWidth = uni.getSystemInfoSync().safeArea.width - 20
    this.errorWidth = (uni.getSystemInfoSync().safeArea.width - 50) / 3
    this.errorHeight = this.errorWidth * 4 / 3
  },
  methods: {
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
            self.$tip.toast('请选择有效的视频文件',2000)
            return
          }
          self.selectedFile = res.tempFiles[0]
          console.log(res)
        }
      });
    },
    clonePopupClose() {
      this.selectedFile = null
      this.cloneSound = false
      this.$refs.clonePopup.close()
    },
    clone() {
      let self = this
      self.$refs.clonePopup.close()

      let task = {
        type: "figures",
        id: self.generateUniqueId(),
        name: self.selectedFile.name,
      };
      this.$store.dispatch("task/addTask", task);
      self.$tip.confirm(`已创建形象克隆任务\n《${self.selectedFile.name}》`,false).then(res => {
        uni.redirectTo({url: '/pages/template/figures'})
      })

      uni.uploadFile({
        url: 'https://live.tellai.tech/api/news_assistant/figure/clone',
        filePath: self.selectedFile.path,
        name: 'file',
        timeout: 1800000,
        formData: {
          'user_id': uni.getStorageSync('userId'),
          cloneSound: self.cloneSound
        },
        success: (result) => {
          this.$store.dispatch("task/removeTask", task.id);
          let data = JSON.parse(result.data)
          if (data.status === 'success') {
            self.$tip.confirm(`${task.name}形象克隆任务已完成`,false)
          } else {
            self.$tip.confirm(`${task.name}形象克隆任务失败,${data.message}`,false)
          }
        }
      });
    },
    generateUniqueId() {
      return Date.now() + Math.random().toString(36).substr(2, 16);
    },
    back() {
      uni.switchTab({url: '/pages/template/index'})
    },
    gotoFigures() {
      uni.redirectTo({url: '/pages/template/figures'})
    }
  }
}
</script>

<style scoped>
.figureClone {
  height: 100vh;
  color: #ffffff;
}

.figure-list {
  position: absolute;
  right: 5px;
  color: #ffffff;
}

.figure-content {
  height: calc(100% - 135px);
  overflow-y: auto;
}

.template-img {
  background-image: url('/static/img/20.jpg');
  border-radius: 10px;
  width: 180px;
  height: 240px;
  margin-right: 5px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.figure-footer {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clone-button {
  width: 250px;
  height: 40px;
  line-height: 40px;
  color: #101010;
  border-radius: 10px;
  background-color: #E99D42;
}

.error-img {
  position: relative;
  border-radius: 10px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.clone-content {
  background: #fff;
  border-radius: 11px;
  padding-top: 15px;
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
  color: #000000;
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