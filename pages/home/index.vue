<template>
  <view class="pages home" :style="{ height: `${safeAreaHeight - 69.8}px` }">
    <view class="header">
      <input class="search-input" placeholder="搜索新闻/更多功能" @focus="goto('/pages/home/search')"></input>
      <uni-icons class="search" type="search" size="24" color="#ffffff" @click="goto('/pages/home/search')"></uni-icons>
    </view>
    <view class="content">
      <view v-for="(item, index) in news" :key="index" class="new" @click="toDetail(item)">
        <view style="width: 35px;height: 35px;display: flex;align-items: center;justify-content: center">
          <image v-if="index === 0" src="/static/top1.png" style="width: 25px;height: 25px;" />
          <image v-if="index === 1" src="/static/top2.png" style="width: 25px;height: 25px;" />
          <image v-if="index === 2" src="/static/top3.png" style="width: 25px;height: 25px;" />
        </view>
        <view style="margin-left: 10px;flex: 1;">
          {{ item.title }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      safeAreaHeight: uni.getSystemInfoSync().safeArea.height,
      news: []
    }
  },
  onShow() {
    this.queryNews()
    uni.removeStorageSync(`${uni.getStorageSync('userId')}_script`)
    uni.removeStorageSync('searchNews')
  },
  methods: {
    queryNews() {
      this.$http.get('/news/rank').then(res => {
        if (res.status === 'success') {
          this.news = res.data
        }else {
          this.$tip.toast(res.message, 5000)
        }
      })
    },
    goto(path) {
      uni.redirectTo({
        url: path
      })
    },
    toDetail(item) {
      uni.setStorageSync('newsDetail', item)
      uni.redirectTo({
        url: '/pages/home/detail?type=switchTab'
      })
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  width: 100%;
}

.search {
  width: 30px;
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

.content {
  height: calc(100% - 65px);
  overflow: auto;
}

.new {
  height: 35px;
  line-height: 35px;
  color: #ffffff;
  font-size: 16px;
  display: flex;
}
</style>