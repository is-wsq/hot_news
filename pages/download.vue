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
      <button class="download-btn" type="primary" @click="download">下载视频</button>
<!--      <view style="color: #FFFFFF; font-size: 14px; margin-top: 20px;">下载进度：{{ downloadProgress }}</view>-->
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
      filepath: '',
      downloadProgress: 0
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
        const a = document.createElement('a');
        let filepath = this.filepath.replace('results','download_v4');
        a.href = filepath + `?filename=${this.filename}`;
        a.download =  this.filename + '.mp4';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // this.downloadByStream('https://u480621-96f7-a7a0b4fd.westc.gpuhub.com:8443/results/19038caf-0499-4feb-8d94-9b772be9eb33-r.mp4', (loaded, total) => {
        //   console.log(`下载进度：${(loaded / total * 100).toFixed(2)}%`);
        //   this.downloadProgress = (loaded / total * 100).toFixed(2)
        // }).then(blob => {
        //   const url = URL.createObjectURL(blob);
        //   const a = document.createElement('a');
        //   a.href = url;
        //   a.download = this.filename + '.mp4';
        //   a.click();
        //   URL.revokeObjectURL(url);
        // });
      }
    },
    async downloadByStream(url, onProgress) {
      const response = await fetch(url);
      if (!response.ok) throw new Error('网络请求失败');

      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        onProgress?.(receivedLength, contentLength);
      }

      return new Blob(chunks, {type: 'video/mp4'});
    },
    back() {
      uni.redirectTo({
        url: '/pages/template/videoList'
      })
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
  border-radius: 10px;
  width: 200px;
}
</style>