<template>
  <view class="pages detail" :style="{ height: `${safeAreaHeight}px` }">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="24" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">热点详情</view>
    </view>
    <view class="detail-content">
      <view style="color: #ffffff">{{ news.title }}</view>
      <view class="detail-card">{{ news.details }}</view>
    </view>
    <view class="warning">内容来源网络</view>
    <view class="detail-setting">
      <view class="setting-item">
        <view style="flex: 1">字数设置</view>
        <view class="setting-name" @click="showWordPopup">{{ word }}</view>
        <uni-icons type="right" size="20" color="#ffffff" @click="showWordPopup"></uni-icons>
      </view>
      <view class="setting-item">
        <view style="flex: 1">文案风格</view>
        <view class="setting-name" @click="showStylePopup">{{ style.name }}</view>
        <uni-icons type="right" size="20" color="#ffffff" @click="showStylePopup"></uni-icons>
      </view>
    </view>
    <button class="detail-btn" @click="generate">口播文案生成</button>
    <uni-popup ref="wordPopup" :mask-click="false" type="bottom">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">字数设置</view>
          <uni-icons class="popup-close" type="closeempty" size="18" color="#ffffff"
                     @click="$refs.wordPopup.close"></uni-icons>
        </view>
        <view class="word-content">
          <picker-view class="picker-view" :indicator-style="indicatorStyle" @change="bindChange">
            <picker-view-column>
              <view class="picker-item" :value="value" v-for="(item, index) in words" :key="index"
                    :class="{ option: true, active: item.count === selectedWord }">
                {{ item.count + item.introduce }}
              </view>
            </picker-view-column>
          </picker-view>
        </view>
        <button class="detail-btn" @click="wordSure">确定</button>
      </view>
    </uni-popup>
    <uni-popup ref="stylePopup" :mask-click="false" type="bottom">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">文案风格</view>
          <uni-icons class="popup-close" type="closeempty" size="18" color="#ffffff"
                     @click="$refs.stylePopup.close"></uni-icons>
        </view>
        <view class="style-content">
          <view style="flex: none;text-align: center" v-for="item in styles" :key="item.id"
                @click="selectedStyle = item">
            <view class="style-item" :style="{ border: item.id === selectedStyle.id? '2px solid #e99d42' : '' }"></view>
            <view style="margin-top: 10px;font-size: 14px"
                  :style="{ color: item.id === selectedStyle.id ? '#e99d42' : '#ffffff' }">{{ item.name }}
            </view>
          </view>
        </view>
        <button class="detail-btn" @click="styleSure">确定</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      safeAreaHeight: 0,
      newsId: null,
      news: {
        title: '标题',
        details: ''
      },
      value: [300],
      words: [
        {count: 300, introduce: '（口播约1分钟）'},
        {count: 400, introduce: '（口播约2分钟）'},
        {count: 500, introduce: '（口播约3分钟）'},
        {count: 600, introduce: '（口播约4分钟）'},
        {count: 700, introduce: '（口播约5分钟）'},
      ],
      word: 300,
      selectedWord: 300,
      styles: [],
      style: {},
      selectedStyle: {},
      indicatorStyle: `height: 50px;`
    }
  },
  onLoad: function (option) {
    let self = this
    self.newsId = option.id
    this.$http.get('/news/query', {id: option.id}).then(res => {
      if (res.status === 'success') {
        this.news = res.data
      }
    })
  },
  mounted() {
    this.queryStyles()
  },
  methods: {
    queryStyles() {
      this.$http.get('/copywriting/styles/query/all').then(res => {
        if (res.status ==='success') {
          this.styles = res.data
          if (this.styles.length > 0) {
            this.style = this.styles[0]
            this.selectedStyle = this.styles[0]
          }
        }
      })
    },
    showWordPopup() {
      this.$refs.wordPopup.open()
      this.value = [this.word]
    },
    showStylePopup() {
      this.$refs.stylePopup.open()
    },
    bindChange(e) {
      let val = e.detail.value[0]
      this.selectedWord = this.words[val].count
    },
    wordSure() {
      this.word = this.selectedWord
      this.$refs.wordPopup.close()
    },
    styleSure() {
      this.style = this.selectedStyle
      this.$refs.stylePopup.close()
    },
    generate() {
      let params = {
        style_id: this.style.id,
        news_id: this.newsId,
        count: this.word,
      }
      uni.showLoading({title: '口播文案生成中...', mask: true})
      this.$http.post('/copywriting/voice', params, 300000).then(res => {
        if (res.status === 'success') {
          uni.hideLoading()
          let userId = uni.getStorageSync('userId')
          uni.setStorageSync(`${userId}_script`, res.data.script)
          uni.navigateTo({
            url: '/pages/home/copy?' +'newsId=' +  this.newsId +'&word=' + this.word + '&style=' + this.style.id
          })
        } else {
          this.$tip.toast(res.message)
        }
      })
    },
    back() {
      uni.switchTab({url: '/pages/home/index'})
    }
  },
  created() {
    this.safeAreaHeight = uni.getSystemInfoSync().safeArea.height
  }
}
</script>

<style scoped>
.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 250px);
}

.detail-card {
  width: 100%;
  height: calc(100% - 30px);
  margin-top: 10px;
  border-radius: 20px;
  background-color: #303030;
  color: #ffffff;
  overflow-y: auto;
  padding: 10px;
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
  width: 80px;
  overflow-x: auto;
  white-space: nowrap;
  margin-right: 5px;
}

.detail-btn {
  background-color: #e99d42;
  width: 230px;
  margin: 0 auto;
  font-size: 14px;
  border-radius: 15px;
  color: #101010;
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
  font-size: 18px;
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
  background-color: #9A9A9A
}
</style>