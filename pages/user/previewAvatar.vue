<template>
  <view class="pages avatar"  :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons style="position: absolute;left: 10px;" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">头像</view>
      <uni-icons style="position: absolute;right: 10px;" type="more-filled" size="24" color="#fff" @click="more"></uni-icons>
    </view>
    <view class="body" :style="{ height: safeHeight - 85 + 'px' }">
      <view class="avatar-box" :style="{ width: safeWidth + 'px', height: safeWidth + 'px' }">
        <image class="avatar-img" :src="userInfo.avatar" mode="aspectFill"></image>
      </view>
    </view>
    <uni-popup ref="popup" background-color="#F9F9F9" borderRadius="10px 10px 0 0">
      <view class="popup-content">
        <view class="popup-btn" style="border-top-left-radius: 10px;border-top-right-radius: 10px;"
              @click="upload">上传头像
        </view>
        <view class="popup-btn" @click="viewLastAvatar">查看上一张头像</view>
        <view class="popup-cancel" @click="$refs.popup.close()">取消</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      safeHeight: uni.getSystemInfoSync().safeArea.height,
      safeWidth: uni.getSystemInfoSync().safeArea.width,
      userId: '',
      userInfo: {}
    }
  },
  onShow() {
    this.userId = uni.getStorageSync('userId') || ''
    if (this.userId !== '') {
      this.queryUserInfo()
    }
  },
  methods: {
    queryUserInfo() {
      this.$http.get('/user/query', {user_id: this.userId}).then(async res => {
        if (res.status ==='success') {
          this.userInfo = res.data
        }
      })
    },
    back() {
      uni.navigateBack()
    },
    more() {
      this.$refs.popup.open("bottom")
    },
    upload() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: function (res) {
          uni.uploadFile({
            url: 'https://live.tellai.tech/api/news_assistant/user/upload_avatar',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              'user_id': that.userId,
            },
            success: () => {
              that.queryUserInfo();
            }
          });
          that.$refs.popup.close();
        }
      });
    },
    viewLastAvatar() {
      this.$tip.toast('暂未开放')
      this.$refs.popup.close();
    }
  }
}
</script>

<style scoped>
.avatar {
  padding: 0 !important;
  height: 100%;
  background-color: #000;
  box-sizing: border-box;
}

.body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-box {
  background-color: #fff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-btn {
  height: 58px;
  line-height: 58px;
  text-align: center;
  border-bottom: 1px solid #e6e8e7;
  background-color: white
}

.popup-cancel {
  margin-top: 10px;
  background-color: white;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>