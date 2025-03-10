<template>
  <view class="detail" :style="{ height: `${safeAreaHeight}px` }">
    <view class="detail-header">
      <uni-icons class="back" type="left" size="24" color="#ffffff" @click="back"></uni-icons>
      <view class="title">热点详情</view>
    </view>
    <view class="detail-content">
      <view style="color: #ffffff">{{ news.name }}</view>
      <view class="detail-card">{{ news.content }}</view>
    </view>
    <view class="warning">内容由大模型AI生成，禁止从事违法活动</view>
    <view class="detail-setting">
      <view class="setting-item">
        <view style="flex: 1">字数设置</view>
        <view class="setting-name">{{ setting.count }}</view>
        <uni-icons type="right" size="20" color="#ffffff" @click="showPopup"></uni-icons>
      </view>
      <view class="setting-item">
        <view style="flex: 1">文案风格</view>
        <view class="setting-name">{{ setting.style }}</view>
        <uni-icons type="right" size="20" color="#ffffff"></uni-icons>
      </view>
      <view class="setting-item">
        <view style="flex: 1">声音选择</view>
        <view class="setting-name">{{ setting.voice }}</view>
        <uni-icons type="right" size="20" color="#ffffff"></uni-icons>
      </view>
      <view class="setting-item">
        <view style="flex: 1">形象选择</view>
        <view class="setting-name">{{ setting.figure }}</view>
        <uni-icons type="right" size="20" color="#ffffff"></uni-icons>
      </view>
    </view>
    <button class="detail-btn">口播视频生成</button>
    <uni-popup ref="popup" :mask-click="false" type="bottom">
      <view class="popup-content">
        <view class="popup-title">
          <view style="color: #ffffff; font-size: 16px;">字数设置</view>
          <uni-icons class="popup-close" type="closeempty" size="18" color="#ffffff"
                     @click="$refs.popup.close"></uni-icons>
        </view>
        <view style="height: 300px;display: flex;flex-direction: column;align-items: center;justify-content: center;">
          <picker-view class="picker-view" :indicator-style="indicatorStyle" @change="bindChange">
            <picker-view-column>
              <view class="picker-item" v-for="(item, index) in wordSetting" :key="index"
                    :class="{ option: true, active: item.count === setting.count }">
                {{ item.count + item.introduce }}
              </view>
            </picker-view-column>
          </picker-view>
        </view>
        <button class="detail-btn">确定</button>
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
      news: {
        name: '暴雪中的美国中产',
        content: '广东广东省，英文名（Guangdong Province）， [10]简称粤， [121]中华人民共和国省级行政区，省会是广州市。 [210] [245]地处中国大陆最南部，东邻福建，北接江西、湖南，西接广西，南邻南海。 [2]截至2023年12月，下辖21个地级市、65个市辖区， [209]总面积17.98万平方千米， [6]2023年年末，全省常住人口12706万人。 [195]广东省语言复杂多样，主要有粤、客、闽三大汉语方言。 [12] [283]\n广东省属亚热带季风气候， [154]属东亚季风区，从北向南分别为中亚热带、南亚热带和热带气候。 [6]有山地、丘陵、台地和平原多种地貌类型，地势总体北高南低。 [2]广东在旧石器时代早期就有人类活动， [161]秦始皇三十三年（公元前214年），设南海郡、象郡、桂林郡，也是广东历史上第一次划分行政区。清初，广东省名称正式使用， [196]1988年，全面实行市管县体制，至2022年底，广东省辖境范围未变。 [3]广东是改革开放的前沿阵地，处在南海航运枢纽位置上，同时也是中国外贸第一大省和农产品进出口大省。 [160]广东省自古就是中国海上贸易和移民出洋最早、最多、最广的省份，占全国海外华侨华人人数一半以上 [284]。广东连续7年成为第一生育大省 [280]，外来人口数量居全国之首 [281]。广东形成了独具特色的岭南文化，开放包容，敢为人先的人文氛围。 [80]2024年，全省地区生产总值141633.81亿元，比上年增长3.5% [282]。2023年度国家科学技术奖励名单中，广东有14个项目分获自然科学奖、技术发明奖、科技进步奖。 [164]广东省也是中国改革开放的排头兵、先行地、实验区，在社会主义现代化建设大局中具有十分重要的地位和作为。'
      },
      setting: {
        count: 300,
        style: '李佳琪',
        voice: '温柔带货',
        figure: '系统形象',
      },
      wordSetting: [
        {count: 300, introduce: '（口播约1分钟）'},
        {count: 400, introduce: '（口播约2分钟）'},
        {count: 500, introduce: '（口播约3分钟）'},
        {count: 600, introduce: '（口播约4分钟）'},
        {count: 700, introduce: '（口播约5分钟）'},
      ],
      indicatorStyle: `height: 50px;`
    }
  },
  methods: {
    showPopup() {
      this.$refs.popup.open()
    },
    bindChange(e) {
      console.log(e)
      let val = e.detail.value[0]
      this.setting.count = this.wordSetting[val].count
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
.detail {
  background-color: #000000;
  padding: 0 10px;
  box-sizing: border-box;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
}

.back {
  position: absolute;
  left: 0;
}

.title {
  font-size: 20px;
  color: #ffffff;
  display: flex;
}

.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 320px);
}

.detail-card {
  width: 100%;
  margin-top: 10px;
  border-radius: 20px;
  background-color: #303030;
  color: #9A9A9A;
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
</style>