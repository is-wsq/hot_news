<template>
  <view class="search" :style="{ height: `${safeAreaHeight}px` }">
    <view class="search-header">
      <uni-icons class="icon" type="left" size="24" color="#ffffff" @click="back"></uni-icons>
      <input class="search-input" placeholder="搜索你需要的新闻"></input>
      <uni-icons class="icon" type="search" size="24" color="#ffffff"></uni-icons>
    </view>
    <view class="history" v-if="history.length > 0">
      <view class="history-title">
        <view style="color: #ffffff;margin-left: 10px;width: calc(100% - 40px);">历史搜索</view>
        <uni-icons type="trash-filled" size="20" color="#9a9a9a"></uni-icons>
      </view>
      <view class="tags">
        <view v-for="(item, index) in history" :key="index">
          <uni-tag circle style="background-color: #303030;border: none" :text="item.name"></uni-tag>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      safeAreaHeight: 0,
      history: [
        {name: '广东'},
        {name: '上海'},
        {name: '北京'},
        {name: '北京'},
        {name: '北京'},
        {name: '北京'},
        {name: '北京北京'},
        {name: '北京北京北京'},
        {name: '北京北京'},
        {name: '北京北京北京'},
        {name: '北京北京北京北京'},
        {name: '北京北京'},
      ],
      news: [
        {name: '新闻1', url: 'https://www.baidu.com'},
        {name: '新闻2', url: 'https://www.baidu.com'},
        {name: '新闻3', url: 'https://www.baidu.com'},
        {name: '新闻4', url: 'https://www.baidu.com'},
        {name: '新闻5', url: 'https://www.baidu.com'},
        {name: '新闻6', url: 'https://www.baidu.com'},
        {name: '新闻7', url: 'https://www.baidu.com'},
        {name: '新闻8', url: 'https://www.baidu.com'},
        {name: '新闻9', url: 'https://www.baidu.com'},
        {name: '新闻10', url: 'https://www.baidu.com'},
        {name: '新闻11', url: 'https://www.baidu.com'},
      ]
    }
  },
  mounted() {
    this.safeAreaHeight = uni.getSystemInfoSync().safeArea.height
  },
  methods: {
    back() {
      uni.switchTab({ url: '/pages/home/index' })
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
  box-sizing: border-box;
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
</style>