<template>
  <view class="home" :style="{ height: `${safeAreaHeight - 70}px` }">
    <view class="header">
      <uni-icons class="search" type="left" size="24" color="#ffffff" v-if="showSearch"></uni-icons>
      <view v-else style="width: 15px"></view>
      <input class="search-input" placeholder="搜索你需要的新闻" @focus="goto('/pages/home/search')"></input>
      <uni-icons class="search" type="search" size="24" color="#ffffff"></uni-icons>
    </view>
    <view class="content">
      <view v-for="(item, index) in news" :key="index" class="new" @click="goto('/pages/home/detail?id=' + index)">
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
      safeAreaHeight: 0,
      showSearch: false,
      news: [
        { title: '强化教育对科技和人才支撑作用' },
        { title: '台湾唯一称谓就是中国台湾省' },
        { title: '第一批倒闭的AI明星公司已经出现了' },
        { title: '2025年中国经济怎么干' },
        { title: '王毅谈特朗普不停退群' },
        { title: '界外狂潮全球公测' },
        { title: '女子请200个中介组团上门看房' },
        { title: '#尹锡悦被释放还能继续当总统吗#' },
        { title: '宇树机器人秀李小龙式720度回旋踢' },
        { title: '5岁女儿偷拍妈妈独自干活发给爸爸' },
        { title: '王毅：借台湾生事就是给日本找事' },
        { title: '宝宝和爸爸吵架 一气之下学会走路' },
        { title: '中国留英博士生强奸10名女子罪名成立' },
        { title: '许昌将投资10亿建3个机场？假' },
        { title: '俄方：绝不容忍北约军队出现在乌克兰' },
        { title: '华尔街预测美国经济衰退概率高达50%' },
        { title: '曝沃尔玛要求部分中国供应商降价' },
      ]
    }
  },
  mounted() {
   this.safeAreaHeight = uni.getSystemInfoSync().safeArea.height
  },
  methods: {
    goto(path) {
      uni.navigateTo({
        url: path
      })
    }
  }
}
</script>

<style scoped>
.home {
  background-color: #000000;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  width: 100%;
  box-sizing: border-box;
}

.search {
  width: 50px;
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
  padding: 0 20px;
}

.new {
  height: 35px;
  line-height: 35px;
  color: #ffffff;
  font-size: 16px;
  display: flex;
}
</style>