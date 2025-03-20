<template>
  <view class="search" :style="{ height: `${safeAreaHeight}px` }">
    <view class="search-header">
      <uni-icons class="icon" type="left" size="24" color="#ffffff" @click="back"></uni-icons>
      <input class="search-input" v-model="keyword" placeholder="搜索你需要的新闻" :focus="true"
             @input="keyInput"></input>
      <uni-icons class="icon" type="search" size="24" color="#ffffff" @click="search"></uni-icons>
    </view>
    <view class="history" v-if="searchList.length === 0">
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
    <view v-if="searchList.length > 0">
      <view class="search-list" v-for="item in searchList" :key="item.id" @click="goto(item.id)">
        <view class="search-title">{{ item.title }}</view>
        <view class="search-details">{{ item.details }}</view>
      </view>
    </view>
    <view v-else class="custom" @click="toCustom('/pages/home/custom')">
      <view class="custom-text">自定义文案</view>
      <uni-icons type="right" size="18" color="#ffffff" class="custom-icon"></uni-icons>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      userId: '',
      keyword: '',
      history: [],
      searchList: [],
    }
  },
  onShow() {
    this.userId = uni.getStorageSync('userId') || ''
  },
  mounted() {
    this.queryHistory()
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
    },
    keyInput() {
      if (this.keyword.length === 0) {
        this.searchList = []
        this.queryHistory()
      }
    },
    search() {
      if (this.keyword.length === 0) {
        this.searchList = []
        return
      }
      let history = uni.getStorageSync(`${this.userId}_history`) || []
      if (history.findIndex(item => item.keyword === this.keyword) === -1) {
        history.unshift({keyword: this.keyword})
        uni.setStorageSync(`${this.userId}_history`, history)
      }
      this.$http.get('/news/search', {keyword: this.keyword}).then(res => {
        if (res.status === 'success') {
          this.searchList = res.data
          if (this.searchList.length === 0) {
            this.$tip.toast('没有找到相关新闻')
          }
        } else {
          this.$tip.toast('搜索失败')
        }
      })
    },
    goto(id) {
      uni.navigateTo({
        url: '/pages/home/detail?id=' + id
      })
    },
    toCustom(url) {
      if (this.userId === '') {
        this.$tip.toast('请先登录')
        uni.navigateTo({ url: '/pages/login/login?type=usual' })
        return
      }
      uni.navigateTo({ url: url })
    },
    back() {
      uni.switchTab({url: '/pages/home/index'})
    }
  }
}
</script>

<style scoped>
.search {
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