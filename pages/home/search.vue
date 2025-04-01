<template>
  <view class="search">
    <view class="search-header">
      <uni-icons class="icon" type="left" size="24" color="#ffffff" @click="back"></uni-icons>
      <input class="search-input" v-model="keyword" placeholder="输入关键字" :focus="true"
             @input="keyInput" @confirm="search"></input>
      <uni-icons class="icon" type="search" size="24" color="#ffffff" @click="search"></uni-icons>
    </view>
    <view class="history" v-if="!searchNews.newsTitle">
      <view class="history-title">
        <view style="color: #ffffff;margin-left: 10px;width: calc(100% - 40px);">历史搜索</view>
        <uni-icons type="trash-filled" size="20" color="#9a9a9a" @click="clearHistory"></uni-icons>
      </view>
      <view class="tags">
        <view v-for="(item, index) in history" :key="index">
          <uni-tag circle style="background-color: #303030;border: none;color: #E5E5E5;min-width: 80px;"
                   :text="item.keyword"
                   @click="searchByHistory(item.keyword)"></uni-tag>
        </view>
      </view>
    </view>
    <view v-if="searchNews.newsTitle">
      <view class="search-list" @click="goto()">
        <view class="search-title">{{ searchNews.newsTitle }}</view>
        <view class="search-details">{{ searchNews.newsDetails }}</view>
      </view>
    </view>
    <view v-if="!searchNews.newsTitle" class="custom" @click="toCustom('/pages/home/custom')">
      <view class="custom-text">自定义文案</view>
      <uni-icons type="right" size="18" color="#ffffff" class="custom-icon"></uni-icons>
    </view>
    <loading-video ref="loadingVideo" v-if="isLoading" text="联网搜索中..."/>
  </view>
</template>
<script>
import LoadingVideo from "../../components/loading-video.vue";

export default {
  components: {LoadingVideo},
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      userId: '',
      keyword: '',
      history: [],
      searchNews: {},
      isLoading: false
    }
  },
  mounted() {
    this.userId = uni.getStorageSync('userId') || ''
    this.queryHistory()
    uni.removeStorageSync(`${this.userId}_script`)
  },
  methods: {
    clearHistory() {
      uni.removeStorageSync(`${this.userId}_history`)
      this.queryHistory()
    },
    searchByHistory(keyword) {
      this.keyword = keyword
      this.search()
    },
    queryHistory() {
      this.history = uni.getStorageSync(`${this.userId}_history`) || []
      this.searchNews = uni.getStorageSync('searchNews') || []
    },
    keyInput() {
      if (this.keyword.length === 0) {
        this.queryHistory()
      }
    },
    search() {
      if (this.keyword.length === 0) {
        return
      }
      let history = uni.getStorageSync(`${this.userId}_history`) || []
      if (history.findIndex(item => item.keyword === this.keyword) === -1) {
        history.unshift({keyword: this.keyword})
        uni.setStorageSync(`${this.userId}_history`, history)
      }
      this.isLoading = true
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      this.$http.get('/news/online_search', {keyword: this.keyword},300000).then(res => {
        if (res.status === 'success') {
          this.searchNews = res.data
          uni.setStorageSync('searchNews', res.data)
          this.isLoading = false
        } else {
          this.$tip.toast(res.message, 5000)
        }
      })
    },
    goto() {
      let newsDetail = {
        title: this.searchNews.newsTitle,
        details: this.searchNews.newsDetails,
      }
      uni.setStorageSync('newsDetail', newsDetail)
      uni.redirectTo({
        url: '/pages/home/detail?type=redirectTo'
      })
    },
    toCustom(url) {
      if (this.userId === '') {
        this.$tip.toast('请先登录')
        uni.redirectTo({ url: '/pages/login/login?type=redirectTo&path=/pages/home/search' })
        return
      }
      uni.redirectTo({ url: url })
    },
    back() {
      uni.switchTab({url: '/pages/home/index'})
    }
  }
}
</script>

<style scoped>
.search {
  height: 100vh;
  background-color: #000000;
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  width: 100%;
}

.icon {
  width: 32px;
}

.search-input {
  background-color: #303030;
  height: 35px;
  border-radius: 20px;
  flex: 1;
  color: #E5E5E5;
  padding: 0 20px;
  box-sizing: border-box;
}

.history-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px
}

.tags {
  display: flex;
  gap: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.search-list {
  border-bottom: 1px solid #303030;
  padding: 10px;
  box-sizing: border-box;
}

.search-title {
  font-size: 16px;
  line-height: 30px;
  height: 30px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-details {
  font-size: 14px;
  color: #999999;
  line-height: 20px;
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  border-radius: 20px;
  background-color: #303030;
}

.custom-text {
  color: #fff;
  font-size: 14px;
  height: 38px;
  line-height: 38px;
}

.custom-icon {
  position: absolute;
  right: 15px;
}
</style>