<template>
  <view class="search">
    <view class="search-header">
      <uni-icons class="icon" type="left" size="24" color="#ffffff" @click="back"></uni-icons>
      <input class="search-input" v-model="keyword" placeholder="输入关键字" :focus="true" @confirm="search">
      </input>
      <view class="search-count">
        <uni-icons fontFamily="CustomFont" color="#ffffff" size="20">{{ '\ue607' }}</uni-icons>
        <view style="margin-left: 3px;color: #ffffff;font-size: 14px">4</view>
      </view>
      <uni-icons class="icon" type="search" size="24" color="#ffffff" @click="search"></uni-icons>
    </view>
    <view class="history">
      <view class="history-title">
        <view style="color: #ffffff;margin-left: 10px;width: calc(100% - 40px);">历史搜索</view>
      </view>
      <view class="tags">
        <view v-for="(item, index) in history" :key="index">
          <uni-tag circle class="tag-item" :class="{ 'tag-active': searchNews && searchNews.id === item.id }"
                   :text="item.keyword"
                   @click="searchByHistory(item)"></uni-tag>
        </view>
      </view>
    </view>
    <view v-if="searchNews">
      <view class="search-list" @click="goto()">
        <view class="search-title">{{ searchNews.title }}</view>
        <view class="search-details">{{ searchNews.details }}</view>
      </view>
    </view>
    <view class="custom" @click="toCustom">
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
      searchNews: null,
      isLoading: false
    }
  },
  mounted() {
    if (uni.getStorageSync('userId')) {
      this.userId = uni.getStorageSync('userId')
      this.queryHistoryCopy()
    }
  },
  methods: {
    searchByHistory(item) {
      this.searchNews = item
    },
    queryHistoryCopy() {
      let params = {
        user_id: this.userId,
      }
      this.$http.get('/news/query/user', params).then(res => {
        if (res.status === 'success') {
          this.history = res.data
        }
      })
    },
    search() {
      if (this.userId === '') {
        this.$tip.confirm('请先登录', false).then(() => {
          this.toLogin()
        })
        return
      }
      if (this.keyword.length === 0) {
        return
      }
      this.isLoading = true
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      let params = {
        user_id: this.userId,
        keyword: this.keyword
      }
      this.searchNews = {}
      this.queryHistoryCopy()
      this.$http.get('/news/online_search', params, 600000).then(res => {
        if (res.status === 'success') {
          this.searchNews = res.data
          this.isLoading = false
          // this.queryHistoryCopy()
        } else {
          this.isLoading = false
          this.$tip.confirm(res.message, false)
        }
      })
    },
    goto() {
      uni.setStorageSync('news', this.searchNews)
      uni.setStorageSync('back_params', { type: 'redirectTo', path: '/pages/home/search' })
      uni.redirectTo({url: '/pages/home/detail'})
    },
    toCustom() {
      if (this.userId === '') {
        this.$tip.confirm('请先登录', false).then(() => {
          this.toLogin()
        })
        return
      }
      uni.hideKeyboard()
      setTimeout(() => {
        uni.setStorageSync('back_params', { type: 'redirectTo', path: '/pages/home/search' })
        uni.redirectTo({url: '/pages/home/custom'})
      }, 100)
    },
    toLogin() {
      uni.setStorageSync('login_router', {
        type: 'redirectTo',
        path: '/pages/home/search'
      })
      uni.redirectTo({url: '/pages/login/login'})
    },
    back() {
      uni.hideKeyboard()
      setTimeout(() => {
        uni.switchTab({url: '/pages/home/index'})
      }, 100)
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: CustomFont;
  src: url('/static/iconfont.ttf');
}

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
  position: relative;
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

.search-count {
  position: absolute;
  right: 50px;
  height: 30px;
  display: flex;
  align-items: center;
}

.history {
  margin-bottom: 20px;
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

.tag-item {
  background-color: #303030;
  border: none;
  color: #E5E5E5;
  min-width: 80px;
}

.tag-active {
  background-color: #e99d42 !important;
  color: #000000 !important;
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