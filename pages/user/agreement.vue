<template>
  <view class="pages agreement" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <!--      <view class="nav-bar-title">用户协议</view>-->
      <view style="display: flex;">
        <view class="button-group button-left" :class="{ 'button-active': activeIndex === 0 }"
              @click="activeIndex = 0">声音复刻协议
        </view>
        <view class="button-group button-right" :class="{ 'button-active': activeIndex === 1 }"
              @click="activeIndex = 1">形象克隆协议
        </view>
      </view>
    </view>
    <view class="iframe-container" v-loading="loading">
<!--      <web-view-->
<!--        :src="docUrl"-->
<!--      ></web-view>-->
<!--      <iframe :src="docUrl" frameborder="0" style="width: 100%; height: 100%;"></iframe>-->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      activeIndex: 0,
      docUrl: '',
      loading: true
    }
  },
  mounted() {
    // let url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent('https://live.tellai.tech/files/figure-clone.docx')}`
    // let url = `https://docs.google.com/gview?url=${encodeURIComponent('https://live.tellai.tech/files/figure-clone.docx')}&embedded=true`
    // let url = `https://h5.wps.cn/office/view?src=${encodeURIComponent('https://live.tellai.tech/files/figure-clone.docx')}`
    // window.open(url)
    // this.docUrl = url
  },
  methods: {
    back() {
      uni.switchTab({url: '/pages/user/index'})
    }
  }
}
</script>

<style scoped>
.button-group {
  width: 120px;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
  text-align: center;
  font-size: 14px;
}

.button-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.button-right {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.button-active {
  background-color: #409eff !important;
  color: #fff !important;
}

.iframe-container {
  height: calc(100% - 100px);
}
</style>