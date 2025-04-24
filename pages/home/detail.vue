<template>
  <view class="pages detail">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">热点详情</view>
      <view class="history-copy" @click="viewHistory">历史文案</view>
    </view>
    <view class="detail-title">{{ news.title }}</view>
    <view class="detail-card">
      <rich-text :nodes="htmlContent"></rich-text>
    </view>
    <view class="warning">内容来源网络</view>
    <view class="detail-setting">
      <view class="setting-item">
        <view style="color: #E5E5E5;">字数设置</view>
        <view class="setting-name" @click="showWordPopup">{{ word + ' ' + introduce }}</view>
        <uni-icons type="right" size="20" color="#E5E5E5;" @click="showWordPopup"></uni-icons>
      </view>
      <view class="setting-item">
        <view style="color: #E5E5E5;">文案风格</view>
        <view class="setting-name" @click="showStylePopup">{{ style.name }}</view>
        <uni-icons type="right" size="20" color="#E5E5E5;" @click="showStylePopup"></uni-icons>
      </view>
    </view>
    <view style="position: relative;width: 250px;margin: 0 auto">
      <button class="detail-btn" @click="generate">口播文案生成</button>
      <view class="word-count">
        <uni-icons fontFamily="CustomFont" color="#ffffff" size="18">{{'\ue607'}}</uni-icons>
        <view style="margin-left: 3px;color: #ffffff;font-size: 14px">{{ word / 100 }}</view>
      </view>
    </view>

    <uni-popup ref="wordPopup" type="bottom" background-color="#292929" borderRadius="12px 12px 0 0">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">字数设置</view>
        </view>
        <view class="word-content">
          <picker-view class="picker-view" :indicator-style="indicatorStyle" @change="bindChange">
            <picker-view-column>
              <view class="picker-item" :value="value" v-for="(item, index) in words" :key="index"
                    :class="{ option: true, active: item.count === selectedWord }">
                {{ item.count + ' ' + item.introduce }}
              </view>
            </picker-view-column>
          </picker-view>
        </view>
        <button class="detail-btn" @click="wordSure">确定</button>
      </view>
    </uni-popup>
    <uni-popup ref="stylePopup" type="bottom" background-color="#292929" borderRadius="12px 12px 0 0">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">文案风格</view>
        </view>
        <view class="style-content">
          <view style="flex: none;text-align: center" v-for="item in styles" :key="item.id"
                @click="selectedStyle = item">
            <image :src="item.avatar" class="style-item"
                   :style="{ border: item.id === selectedStyle.id? '2px solid #e99d42' : '' }"></image>
            <view style="margin-top: 10px;font-size: 14px"
                  :style="{ color: item.id === selectedStyle.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <button class="detail-btn" @click="styleSure">确定</button>
      </view>
    </uni-popup>
    <loading-video ref="loadingVideo" v-if="isLoading" text="口播文案生成中..."/>
  </view>
</template>

<script>
import LoadingVideo from '@/components/loading-video.vue'
import {marked} from "marked";

export default {
  name: 'Detail',
  components: {
    LoadingVideo
  },
  computed: {
    htmlContent() {
      return marked(this.news.details);
    }
  },
  data() {
    return {
      userId: '',
      news: {
        title: '',
        details: ''
      },
      value: [200],
      words: [
        {count: 200, introduce: '(口播约40秒)'},
        {count: 300, introduce: '(口播约60秒)'},
        {count: 400, introduce: '(口播约80秒)'},
        {count: 500, introduce: '(口播约100秒)'},
        {count: 600, introduce: '(口播约120秒)'},
      ],
      word: 200,
      introduce: '(口播约40秒)',
      selectedWord: null,
      selectedIntroduce: '',
      styles: [],
      style: {},
      selectedStyle: {},
      indicatorStyle: `height: 50px;`,
      isLoading: false,
      type: ''
    }
  },
  mounted() {
    this.userId = uni.getStorageSync('userId') || ''
    this.news = uni.getStorageSync('news')
    this.queryStyles()
  },
  onLoad: function (option) {
    if (option.type){
      this.type = option.type
    }
  },
  methods: {
    queryStyles() {
      this.$http.get('/copywriting/styles/query/all').then(res => {
        if (res.status === 'success') {
          this.styles = res.data
          this.style = this.styles[0]
          this.selectedStyle = this.styles[0]
        }
      })
    },
    showWordPopup() {
      this.$refs.wordPopup.open()
      this.value = [this.word]
      this.selectedWord = this.word
      this.selectedIntroduce = this.introduce
    },
    showStylePopup() {
      this.$refs.stylePopup.open()
    },
    bindChange(e) {
      let val = e.detail.value[0]
      this.selectedWord = this.words[val].count
      this.selectedIntroduce = this.words[val].introduce
    },
    wordSure() {
      this.word = this.selectedWord
      this.introduce = this.selectedIntroduce
      this.$refs.wordPopup.close()
    },
    styleSure() {
      this.style = this.selectedStyle
      this.$refs.stylePopup.close()
    },
    generate() {
      if (this.userId === '') {
        this.$tip.confirm('请先登录',false).then(() => {
          uni.redirectTo({url: `/pages/login/login?type=redirectTo&path=/pages/home/detail?type=${this.type}`})
        })
        return
      }
      let params = {
        user_id: this.userId,
        style_id: this.style.id,
        news_id: this.news.id,
        news_details: this.news.details,
        count: this.word,
      }
      this.isLoading = true
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      this.$http.post('/copywriting/voice', params, 300000).then(res => {
        if (res.status === 'success') {
          this.isLoading = false
          uni.setStorageSync('wordSetting', this.word)
          uni.setStorageSync('styleId', this.style.id)
          uni.redirectTo({url: `/pages/home/copy?type=${this.type}`})
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
    },
    back() {
      if (this.type === 'redirectTo') {
        uni.redirectTo({url: '/pages/home/search'})
      }else {
        uni.switchTab({url: '/pages/home/index'})
      }
    },
    viewHistory() {
      uni.redirectTo({url: '/pages/home/history'})
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

.history-copy {
  position: absolute;
  right: 5px;
  color: #ffffff;
}

.detail {
  height: 100vh;
}

.detail-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-card {
  width: 100%;
  height: calc(100% - 275px);
  margin-top: 15px;
  font-size: 14px;
  color: #ffffff;
  overflow-y: auto;
  box-sizing: border-box;
}

.warning {
  color: #9A9A9A;
  font-size: 14px;
  margin: 10px 0;
}

.detail-setting {
  margin-bottom: 10px;
  margin-left: 10px;
}

.setting-item {
  color: #ffffff;
  font-size: 16px;
  height: 35px;
  line-height: 35px;
  display: flex;
  align-items: center;
}

.setting-name {
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 20px;
  text-align: right;
  color: #E5E5E5;
}

.detail-btn {
  background-color: #e99d42;
  width: 250px;
  margin: 0 auto;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  border-radius: 10px;
  color: #101010;
}

.word-count {
  position: absolute;
  top: 0;
  right: 20px;
  height: 40px;
  display: flex;
  align-items: center;
}

.popup-content {
  background-color: #292929;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 20px;
}

.popup-title {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.popup-close {
  position: absolute;
  top: 5px;
  right: 0;
  color: #ffffff;
}

.word-content {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.picker-view {
  width: 250px;
  height: 150px;
  background-color: #292929 !important;
  color: #ffffff;
}

.picker-item {
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #E5E5E5;
}

.option {
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  transition: all 0.3s;
  background: transparent;
}

.active {
  font-size: 19px;
  height: 50px;
  border-radius: 20px;
  background-color: #303030;
}

.detail >>> .uni-picker-view-mask {
  background: none !important;
}

.detail >>> .uni-picker-view-indicator:before {
  border: none !important;
}

.detail >>> .uni-picker-view-indicator:after {
  border: none !important;
}

.style-content {
  width: 100%;
  height: 220px;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  flex-wrap: nowrap;
  align-items: center
}

.style-item {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>