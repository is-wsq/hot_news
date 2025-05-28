<template>
  <view class="pages history-copy">
    <view class="nav-bar-header">
      <uni-icons class="nav-bar-back" type="left" size="21" color="#ffffff" @click="back"></uni-icons>
      <view class="nav-bar-title">历史生成文案</view>
    </view>
    <view class="history-copy-list">
      <view class="history-copy-item" v-for="(item, index) in history" :key="item.id"
      :class="{'margin-bottom': index !== history.length - 1}">
        <view class="copy-item">{{ item.copywriting }}</view>
        <image class="copy-icon" src="/static/copy_icon.png" @click="copy(item)"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'historyCopy',
  data() {
    return {
      history: []
    }
  },
  mounted() {
    this.queryHistory()
  },
  methods: {
    queryHistory() {
      if (!uni.getStorageSync('userId')) {
        this.$tip.confirm('请先登录',false).then(() => {
          this.toLogin()
        })
        return
      }
      this.$http.get('/copywriting_history/query/all',{user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.history = res.data
        }else {
          this.$tip.toast(res.message)
        }
      })
    },
    copy(item) {
      console.log(item)
      let self = this
      uni.setClipboardData({
        data: item.copywriting,
        showToast: false,
        success: function () {
          self.$tip.confirm('复制成功',false)
        }
      });
    },
    back() {
      uni.switchTab({ url: '/pages/user/index' })
    }
  },
}
</script>

<style scoped>
.history-copy {
  height: 100vh;
}

.history-copy-list {
  height: calc(100vh - 70px);
  overflow-y: auto;
}

.history-copy-item {
  border-radius: 10px;
  background-color: #303030;
  padding: 14px 14px 5px 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.copy-item {
  max-height: 300px;
  overflow-y: auto;
  font-size: 14px;
  color: #9A9A9A;
  white-space: pre-line;
}

.copy-icon {
  width: 18px;
  height: 18px;
  margin-top: 5px;
}

.margin-bottom {
  margin-bottom: 20px;
}
</style>