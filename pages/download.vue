<template>
  <view class="pages download" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">下载</view>
    </view>
    <view class="download-container">
      <view class="download-filename">
        {{ filename }}
      </view>
      <view class="download-preview">
        <video ref="video" style="width: 100%; height: 100%;" :src="filepath"></video>
      </view>
      <button class="download-btn" @click="download">下载文件</button>
    </view>
    <uni-popup ref="dialog" type="dialog">
      <uni-popup-dialog type="info" confirmText="确定" :showClose="false" @confirm="$refs.dialog.close()"
                        content="微信内无法直接下载，请点击右上角'…'选择'在浏览器中打开'">
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      filename: '',
      filepath: ''
    }
  },
  onLoad: function (option) {
    this.filename = option.filename
    this.filepath = option.filepath
  },
  mounted() {
    console.log(this.isWeChat())
  },
  methods: {
    isWeChat() {
      return /MicroMessenger/i.test(navigator.userAgent);
    },
    download() {
      if (this.isWeChat()) {
        this.$refs.dialog.open()
      }else {
        const link = document.createElement('a');
        link.href = this.filepath;
        link.download = this.filename + '.mp4'; // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载后移除元素
        this.$tip.toast('下载完成')
      }
    },
    back() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.download-container {
  height: calc(100% - 110px);
}

.download-preview {
  height: calc(100% - 150px);
  width: 100%;
}

.download-filename {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 20px;
}

.download-btn {
  margin-top: 50px;
  color: #ffffff;
  background-color: #297aff;
  border-radius: 10px;
  width: 200px;
}
</style>