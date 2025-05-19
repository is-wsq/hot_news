<template>
  <view class="pages copy-history">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">历史文案</view>
    </view>
    <view class="copy-history-list">
      <view class="copy-history-item" v-for="(item, index) in histories" :key="item.id" @click="selectCopy(item)"
            :class="{'copy-history-item-active': selectHistory.id === item.id, 'margin-bottom': index !== histories.length - 1}">
        {{ item.copywriting }}
      </view>
    </view>
    <view style="height: 62px;margin: 0 auto">
      <button class="copy-select" @click="selectEnter">选择进入</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      histories: [],
      selectHistory: {}
    }
  },
  mounted() {
    this.queryHistories()
  },
  methods: {
    queryHistories() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        news_id: uni.getStorageSync('news').id
      }
      this.$http.get('/copywriting_history/query',params).then(res => {
        if (res.status === 'success') {
          this.histories = res.data
        }
      })
    },
    selectCopy(item) {
      if (this.selectHistory.id === item.id) {
        this.selectHistory = {}
        return
      }
      this.selectHistory = item
    },
    selectEnter() {
      if (!this.selectHistory.id) {
        this.$tip.confirm('请选择文案后再选择进入', false)
        return
      }
      let index = this.histories.findIndex(item => item.id === this.selectHistory.id)
      uni.setStorageSync('scriptIndex', index)
      uni.redirectTo({url: '/pages/home/copy'})
    },
    back() {
      uni.redirectTo({url: '/pages/home/detail'})
    }
  }
}
</script>

<style scoped>
.copy-history {
  height: 100vh;
}

.copy-history-list {
  height: calc(100vh - 140px);
  overflow-y: auto;
  margin-bottom: 20px;
}

.copy-history-item {
  height: 200px;
  border-radius: 10px;
  background-color: #303030;
  padding: 14px;
  box-sizing: border-box;
  overflow-y: auto;
  font-size: 14px;
  color: #9A9A9A;
}

.margin-bottom {
  margin-bottom: 20px;
}

.copy-history-item-active {
  border: 1px solid #FFC107;
  color: #FFC107;
}

.copy-select {
  background-color: #e99d42;
  width: 250px;
  font-size: 16px;
  border-radius: 8px;
  color: #101010;
}
</style>