## 新闻热榜(hot_news)

### 技术栈

- 核心框架：`Vue 3.5.13` 、`uniapp`
- 状态管理：`Vuex 4.1.0`
- 路由：`uniapp`框架自带页面跳转方式 `uni.navigateTo`、`uni.redirectTo`、`uni.switchTab`等

### 环境准备

- 安装 `Node.js`（版本要求：`20.14.0`，官网下载地址：https://nodejs.org/）
- 安装依赖管理工具：`npm`（`Node`自带）或 `yarn`（可选，需额外安装）
- 安装开发工具 `HBuilder X`

### 快速启动

- 克隆代码到本地 `git clone https://github.com/KPointFuture/hot_news.git`

- 进入项目目录 `cd hot_news`

- 安装依赖 `npm install` 运行后会生成 ` node_modules` 依赖文件夹，安装依赖出现冲突或警告时，可添加后缀`--legacy-peer-deps`解决，即运行 `npm install --legacy-peer-deps`

- `HBuilder X` 打开 `hot_news` 项目，点击运行 - 运行到浏览器 

### 项目目录结构

```plaintext
hot_news/
├── common/
│   └── utils/
│   │   ├── axios.js  # API请求工具（封装uniapp默认的请求方法）
│   │   └── tip.js    # 提示工具（封装弹窗提示工具）
├── components/  
│   └── loading-video.vue  # 自定义封装的loading显示
├── node_modules/	# 依赖文件夹
├── pages/
│   ├── agreement/	# 协议组件文件夹   
│   │   ├── membership.vue  
│   │   ├── privacy.vue  
│   │   └── user.vue  
│   ├── home/   	# tabBar "主页"
│   │   ├── copy.vue  
│   │   ├── custom.vue  
│   │   ├── detail.vue  
│   │   ├── history.vue 
│   │   ├── index.vue   
│   │   └── search.vue  
│   ├── index/    
│   │   └── index.vue  
│   ├── login/ 		# 登陆/注册
│   │   ├── login.vue   
│   │   └── register.vue 
│   ├── template/ 	# tabBar "模板"    
│   │   ├── figureClone.vue  
│   │   ├── figures.vue  
│   │   ├── index.vue 
│   │   ├── videoList.vue   
│   │   ├── voice.vue  
│   │   └── voicesClone.vue  
│   ├── user/		# tabBar "我的" 
│   │   ├── contactUs.vue  
│   │   ├── figure.vue  
│   │   ├── figureRecharge.vue  
│   │   ├── historyCopy.vue  
│   │   ├── index.vue  
│   │   ├── info.vue 
│   │   ├── integral.vue
│   │   ├── order.vue 
│   │   ├── previewAvatar.vue   
│   │   ├── voice.vue  
│   │   ├── voiceRecharge.vue  
│   │   └── voucher.vue  
│   └── download.vue
├── static/   		# 静态资源目录 
├── store/
│   ├── index.js             # Vuex 状态管理入口（整合模块）
│   └── modules/
│       └── generate.js      # 生成任务状态管理（语音、形象、视频任务）
├── uni_modules/	# 项目使用到的uniapp框架组件 
├── unpackage/		# 打包后的目录 
├── .gitignore
├── App.vue			# 根组件
├── main.js			# 应用入口文件
├── manifest.json 
├── package.json
├── package-lock.json
├── pages.json		# 页面配置（定义所有页面路由）
├── README.md
├── uni.promisify.adaptor.js
└── uni.scss
```

### 项目文件详解

#### App.vue

- 应用根组件，负责管理全局任务轮询

- 通过 `Vuex` 获取任务状态、登录状态
- 在组件创建且登录后，开始以每5秒一次的频率轮训音色克隆、形象克隆、视频生成任务
- 在组件销毁前或退出登录后清理所有定时器，防止内存泄漏
- 全局样式定义，包括滚动条、按钮样式等

```javascript
<script>
import {mapGetters} from "vuex";

export default {
    data() {
      return {
        pollingTimer: null
      }
    },
    computed: {
      ...mapGetters("task", ["isLogin"]), // 获取任务列表、登录状态
    },
    watch: {
      /* 
       * watch监听登录状态，登录启动轮训，退出停止轮训
       */
      isLogin: {
        handler() {
          if (this.isLogin) {
            this.startPolling()
          }else{
            this.stopPolling()
          }
        },
        deep: true,
      },
    },
    mounted() {
      if(this.$store.state.task.isLogin) {
        this.startPolling()
      }
    },
    methods: {
      /* 
       * 启动轮训方法，5s每次的频率，轮训音色克隆、形象克隆、视频生成任务
       */
      startPolling() {
        this.$store.dispatch("task/pollVideoTasks");
        this.$store.dispatch("task/pollVoiceTasks");
        this.$store.dispatch("task/pollFigureTasks");
        this.pollingTimer = setInterval(() => {
          this.$store.dispatch("task/pollVideoTasks");
          this.$store.dispatch("task/pollVoiceTasks");
          this.$store.dispatch("task/pollFigureTasks");
        }, 5000);
      },
      /* 
       * 停止轮训方法
       */
      stopPolling() {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    },
    beforeDestroy() {
      this.stopPolling()
    }
}
</script>
```

#### main.js

- 应用入口文件，负责初始化 `Vue` 实例
- 注册配置请求(http)、提示信息(tip)、状态管理(store)使用方式

```javascript
import App from './App'
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
/*
 * 注册配置请求(http)
 * 使用方式 this.$http
 */
import http from './common/utils/axios.js';
Vue.prototype.$http = http;
/*
 * 注册配置提示信息(tip)
 * 使用方式 this.$tip
 */
import tip from './common/utils/tip.js'
Vue.prototype.$tip = tip;
/*
 * 注册配置状态管理(store)
 * 使用方式 this.$store
 */
import store from './store'
Vue.prototype.$store = store;

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
```

#### pages.json

- 对 uni-app 进行全局配置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生 tabbar 等

```json
{
  "pages": [
    //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
    {
      "path": "pages/home/index"
    },
    {
      "path": "pages/home/search"
    },
    {
      "path": "pages/home/detail"
    },
    {
      "path": "pages/home/copy"
    },
    {
      "path": "pages/home/history"
    },
    {
      "path": "pages/home/custom"
    },
    {
      "path": "pages/template/index"
    },
    {
      "path": "pages/template/videoList"
    },
    {
      "path": "pages/template/figureClone"
    },
    {
      "path": "pages/template/figures"
    },
    {
      "path": "pages/template/voicesClone"
    },
    {
      "path": "pages/template/voice"
    },
    {
      "path": "pages/template/transcribe"
    },
    {
      "path": "pages/template/recorder"
    },
    {
      "path": "pages/user/index"
    },
    {
      "path": "pages/user/info"
    },
    {
      "path": "pages/user/voucher"
    },
    {
      "path": "pages/user/integral"
    },
    {
      "path": "pages/user/figureRecharge"
    },
    {
      "path": "pages/user/voiceRecharge"
    },
    {
      "path": "pages/user/previewAvatar"
    },
    {
      "path": "pages/user/figure"
    },
    {
      "path": "pages/user/voice"
    },
    {
      "path": "pages/user/contactUs"
    },
    {
      "path": "pages/user/order"
    },
    {
      "path": "pages/user/historyCopy"
    },
    {
      "path": "pages/agreement/user"
    },
    {
      "path": "pages/agreement/privacy"
    },
    {
      "path": "pages/agreement/membership"
    },
    {
      "path": "pages/login/login"
    },
    {
      "path": "pages/login/auth-callback"
    },
    {
      "path": "pages/login/register"
    },
    {
      "path": "pages/download"
    }
  ],
  // 配置tabBar底部导航栏
  "tabBar": {
    "color": "#9A9A9A",
    "selectedColor": "#ffffff",
    "borderStyle": "black",
    "backgroundColor": "#222222",
    "height": "70px",
    "iconWidth": "32px",
    "spacing": "0",
    "fontSize": "12px",
    "list": [
      {
        "pagePath": "pages/home/index",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/homeActive.png",
        "text": "主页"
      },
      {
        "pagePath": "pages/template/index",
        "iconPath": "static/tabbar/live.png",
        "selectedIconPath": "static/tabbar/liveActive.png",
        "text": "模板"
      },
      {
        "pagePath": "pages/user/index",
        "iconPath": "static/tabbar/user.png",
        "selectedIconPath": "static/tabbar/userActive.png",
        "text": "我的"
      }
    ]
  },
  // 用于设置应用的状态栏、导航条、标题、窗口背景色等。
  "globalStyle": {
    "navigationStyle": "custom",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "新闻热榜",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#000000",
    "backgroundColorTop": "#000000",
    "backgroundColorBottom": "#000000"
  },
  "uniIdRouter": {}
}

```

#### common

##### utils(公共工具)

###### axios.js

- 封装 uniapp 原生请求，在main.js中注册配置

```javascript
const BASE_URL = 'https://live.tellai.tech/api/news_assistant';  //基础 API 地址
// 统一请求的配置
const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + options.url,  // 请求地址
            method: options.method || 'GET',
            timeout: options.timeout || 60000,
            data: options.data || {}, // 请求数据
            header: options.header || {
                'Content-Type': 'application/json',
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

const get = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'GET',
        timeout,
        data,
        header
    });
};

const post = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'POST',
        timeout,
        data,
        header
    });
};

const del = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'DELETE',
        timeout,
        data,
        header
    });
};

const put = (url, data = {}, timeout = 60000, header = {}) => {
    return request({
        url,
        method: 'PUT',
        timeout,
        data,
        header
    });
};

export default {
    get,
    post,
    del,
    put
};
```

###### tip.js

- 封装提示信息，在main.js中注册配置

```javascript
/**
 * 提示与加载工具类
 */
export default class Tips {
  constructor() {
    this.isLoading = false;
  }
  /**
   * 弹出提示框
   */
  static success(title, duration = 1000) {
    setTimeout(() => {
      uni.showToast({
        title: title,
        icon: "success",
        mask: true,
        duration: duration
      });
    }, 300);
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  }
  /**
   * 弹出确认窗口
   */
  static confirm(text,showCancel, payload = {}, title = "提示") {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title,
        content: text,
        showCancel: showCancel,
        success: res => {
          if (res.confirm) {
            resolve('success');
          } else if (res.cancel) {
            resolve('fail');
          }
        },
        fail: res => {
          resolve('fail');
        }
      });
    });
  }
  /**
   * 普通信息
   */
  static toast(title, duration = 1000, onHide, icon = "none") {
    setTimeout(() => {
      uni.showToast({
        title: title,
        icon: icon,
        mask: true,
        duration:duration
      });
    }, 300);
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 500);
    }
  }
  /**
   * 警告框
   */
  static alert(title) {
    uni.showToast({
      title: title,
      image: "../../static/alert.png",
      mask: true,
      duration: 1500
    });
  }
  /**
   * 错误框
   */
  static error(title, onHide) {
    uni.showToast({
      title: title,
      image: "../../static/error.png",
      mask: true,
      duration: 1500
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 500);
    }
  }
  /**
   * 弹出加载提示
   */
  static loading(title = "加载中") {
    if (Tips.isLoading) {
      return;
    }
    Tips.isLoading = true;
    uni.showLoading({
      title: title,
      mask: true
    });
  }
  /**
   * 加载完毕
   */
  static loaded() {
    if (Tips.isLoading) {
      Tips.isLoading = false;
      uni.hideLoading();
    }
  }
}
/**
 * 静态变量，是否加载中
 */
Tips.isLoading = false;
```

#### components

##### loading-video.vue

- 自定义封装的loading显示
- 使用方式

```javascript
<template>
  <div>
    <loading-video ref="loadingVideo" v-if="isLoading" text="loading信息..."/>
  </div>
</template>

<script>
import LoadingVideo from "../../components/loading-video.vue";

export default {
  components: {LoadingVideo}, // 注册组件
}
</script>
```

#### pages

##### agreement

协议组件文件夹

###### membership.vue

- 付费服务协议

###### privacy.vue

- 隐私条款

###### user.vue

- 用户协议（形象克隆协议/音色克隆协议）

##### home

tabbar "主页" 所包含的所有页面文件

###### copy.vue

- 口播视频生成页面，从 `home/detail.vue` 新闻详情页面或 `home/custom.vue` 自定义文案页面
- 可重新生成口播文案，切换生成视频所选文案
- 选择音色、形象，生成口播视频

```javascript
methods: {
   /*
    * 查询形象方法
    */
   queryFigures() {
      this.$http.get('/figure/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.systemFigure = res.data.filter(item => item.status === 'success' && item.type === 'system')
          this.cloneFigure = res.data.filter(item => item.status === 'success' && item.type === 'clone')
          if (this.systemFigure.length > 0) {
            this.figure = this.systemFigure[0]
            this.selectedFigure = this.systemFigure[0]
          }
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
   },
   /*
    * 查询音色方法
    */
   queryVoices() {
      this.$http.get('/timbres/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.systemVoice = res.data.filter(item => item.status === 'success' && item.type === 'system')
          this.cloneVoice = res.data.filter(item => item.status === 'success' && item.type === 'clone')
          if (this.systemVoice.length > 0) {
            this.voice = this.systemVoice[0]
            this.selectedVoice = this.systemVoice[0]
          }
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
   },
   /*
    * 重新生成文案方法
    */
   generate() {
      let params = {
        user_id: this.userId,
        style_id: this.styleId,
        news_details: this.news.details,
        news_id: this.news.id,
        count: this.word,
        productInfo: this.productInfo
      }
      this.isLoading = true
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      this.$http.post('/copywriting/voice', params, 300000).then(res => {
        if (res.status === 'success') {
          this.queryHistoryCopy()
          this.isLoading = false
        } else {
          this.isLoading = false
          this.$tip.confirm(res.message,false)
        }
      })
   },
   /*
    * 生成口播视频方法
    */
   generateVideo() {
      if (this.news.title === ''){
        this.$tip.confirm('请输入标题',false)
        return
      }
      if (this.userInfo.point < 20) {
        this.$tip.confirm(`积分余额须大于20方可使用本服务，当前剩余积分${this.userInfo.point}`,false)
        return;
      }
      this.$tip.confirm('确定生成视频？',true).then((res) => {
        if (res === 'success') {
          this.disabled = true
          let params = {
            text: this.script,
            user_id: this.userId,
            voice_id: this.voice.voice_id,
            video_id: this.figure.video_id,
            filename: this.news.title
          }
          this.$http.post('/figure/generate_video', params).then(res => {
            if (res.status === 'success') {
              this.$tip.confirm(`已创建口播视频生成任务\n${this.news.title}.mp4`,false).then(() => {
                this.disabled = false
                uni.switchTab({
                  url: '/pages/template/index'
                })
              })
            }else {
              this.$tip.confirm(`创建口播视频生成任务\n${this.news.title}.mp4失败,${res.message}`, false).then(() => {
                this.disabled = false
              })
            }
          })
        }
      })
   },
   /*
    * 查询历史文案方法
    */
   queryHistoryCopy() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        news_id: uni.getStorageSync('news').id
      }
      this.$http.get('/copywriting_history/query', params).then(res => {
        if (res.status === 'success') {
          this.scriptList = res.data
          if (uni.getStorageSync('scriptIndex')) {
            this.scriptIndex = parseInt(uni.getStorageSync('scriptIndex')) + 1
            setTimeout(() => {
              uni.removeStorageSync('scriptIndex')
            })
          } else {
            this.scriptIndex = 1
          }
          this.script = this.scriptList[this.scriptIndex - 1].copywriting
        }
      })
   },
   /*
    * 切换选择上一条口播文案方法
    */
   prevScript() {
      if (this.scriptIndex > 1) {
        this.script = this.scriptList[this.scriptIndex - 2].copywriting
        this.scriptIndex = this.scriptIndex - 1
      } else {
        this.$tip.confirm('已经是第一条口播文案了',false)
      }
   },
   /*
    * 切换选择下一条口播文案方法
    */
   nextScript() {
      if (this.scriptIndex < this.scriptList.length) {
        this.script = this.scriptList[this.scriptIndex].copywriting
        this.scriptIndex = this.scriptIndex + 1
      } else {
        this.$tip.confirm('已经是最后一条口播文案了',false)
      }
   },
}
```

###### custom.vue

- 自定义文案生成视频页面，从 `home/search.vue` 新闻搜索页面进入
- 自定义口播文案标题、文案内容，选择音色、形象，生成口播视频

```javascript
methods: {
   /*
    * 查询形象方法
    */
   queryFigures() {
      this.$http.get('/figure/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.systemFigure = res.data.filter(item => item.status === 'success' && item.type === 'system')
          this.cloneFigure = res.data.filter(item => item.status === 'success' && item.type === 'clone')
          if (this.systemFigure.length > 0) {
            this.figure = this.systemFigure[0]
            this.selectedFigure = this.systemFigure[0]
          }
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
   },
   /*
    * 查询音色方法
    */
   queryVoices() {
      this.$http.get('/timbres/query/user', {user_id: this.userId}).then(res => {
        if (res.status === 'success') {
          this.systemVoice = res.data.filter(item => item.status === 'success' && item.type === 'system')
          this.cloneVoice = res.data.filter(item => item.status === 'success' && item.type === 'clone')
          if (this.systemVoice.length > 0) {
            this.voice = this.systemVoice[0]
            this.selectedVoice = this.systemVoice[0]
          }
        } else {
          this.$tip.confirm(res.message,false)
        }
      })
   },
   /*
    * 生成口播视频方法
    */
   generateVideo() {
      if (this.title === ''){
        this.$tip.confirm('请输入标题',false)
        return
      }
      if (this.script === '') {
        this.$tip.confirm('请输入文案内容',false)
        return;
      }
      if (this.userInfo.point < 20) {
        this.$tip.confirm(`积分余额须大于20方可使用本服务，当前剩余积分${this.userInfo.point}`,false)
        return;
      }
      this.$tip.confirm('确定生成视频？',true).then((res) => {
        if (res === 'success') {
          this.disabled = true
          let params = {
            text: this.script,
            user_id: this.userId,
            voice_id: this.voice.voice_id,
            video_id: this.figure.video_id,
            filename: this.title
          }
          this.$http.post('/figure/generate_video', params).then(res => {
            if (res.status === 'success') {
              this.$tip.confirm(`已创建口播视频生成任务\n${this.title}.mp4`,false).then(() => {
                this.disabled = false
                uni.switchTab({
                  url: '/pages/template/index'
                })
              })
            }else {
              this.$tip.confirm(`创建口播视频生成任务\n${this.title}.mp4失败,${res.message}`, false).then(() => {
                this.disabled = false
              })
            }
          })
        }
      })
   },
}
```

###### detail.vue

- 新闻详情页面，从 `home/index.vue` 新闻首页或 `home/search.vue` 新闻搜索页面选择新闻进入
- 设置字数、文案风格、带货设置生成口播文案，生成后会自动跳转进入 `home/copy.vue` 生成口播视频页面
- 带货设置(提取商品形象)：上传商品详情页图片提取商品信息
- 可点击 "历史文案"按钮，进入 `home/history` 历史文案页面

```javascript
methods: {
   /*
    * 查询文案风格方法
    */
   queryStyles() {
      this.$http.get('/copywriting/styles/query/all').then(res => {
        if (res.status === 'success') {
          this.styles = res.data
          this.style = this.styles[0]
          this.selectedStyle = this.styles[0]
        }
      })
   },
   /*
    * 提取商品信息方法
    */
   async sellSure() {
      if (this.img_list.length === 0) {
        this.$tip.confirm('请先上传商品相关图片',false)
        return
      }
      this.extracting = true
      await this.convertToBase64()
      let params = {
        image_base64_list: this.image_base64_list
      }
      this.$http.post('/extract_product_info',params,1800000).then(res => {
        if (res.status === 'success') {
          this.productInfo = res.data.product_info
          this.$tip.toast('商品信息提取成功')
        } else {
          this.$tip.confirm(res.message,false)
        }
        this.extracting = false
        this.$refs.sellPopup.close()
      })
   },
   /*
    * 生成口播文案方法
    */
   generate() {
      if (this.userId === '') {
        this.$tip.confirm('请先登录',false).then(() => {
          this.toLogin()
        })
        return
      }
      let params = {
        user_id: this.userId,
        style_id: this.style.id,
        news_id: this.news.id,
        news_details: this.news.details,
        count: this.word,
        productInfo: this.productInfo
      }
      this.isLoading = true
      this.$nextTick(() => {
        this.$refs.loadingVideo.playVideo()
      })
      this.$http.post('/copywriting/voice', params, 300000).then(res => {
        if (res.status === 'success') {
          this.isLoading = false
          uni.setStorageSync('wordSetting', this.word)
          uni.setStorageSync('styleId', this.style.id)
          uni.setStorageSync('productInfo',this.productInfo)
          uni.redirectTo({url: `/pages/home/copy`})
        } else {
          this.isLoading = false
          this.$tip.confirm(res.message,false)
        }
      })
   },
   /*
    * 进入文案历史页面
    */
   viewHistory() {
      uni.redirectTo({url: '/pages/home/history'})
   }
}
```

###### history.vue

- 历史文案页面，从 `home/detail.vue` 页面进入，查询选择的新闻对应生成的历史文案
- 可选择一个历史文案，进入 `home/copy.vue` 生成口播视频页面

```javascript
methods: {
   /*
    * 查询新闻历史生成文案方法
    */
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
   /*
    * 选择文案进入生成口播视频页面方法
    */
   selectEnter() {
      if (!this.selectHistory.id) {
        this.$tip.confirm('请选择文案后再选择进入', false)
        return
      }
      let index = this.histories.findIndex(item => item.id === this.selectHistory.id)
      uni.setStorageSync('scriptIndex', index)
      uni.redirectTo({url: '/pages/home/copy'})
   },
}
```

###### index.vue

- 新闻首页，整合显示最新热门榜单
- 选择榜单新闻，进入`home/detail.vue` 新闻详情页面
- 点击顶部搜索新闻/更多功能或搜索图标，进入`home/search.vue`新闻搜索页面

```javascript
methods: {
   /*
    * 查询新闻榜单方法
    */
   queryNews() {
      this.$http.get('/news/rank').then(res => {
        if (res.status === 'success') {
          this.news = res.data
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 进入新闻搜索页面
    */
   toSearch() {
      uni.redirectTo({url: '/pages/home/search'})
   },
   /*
    * 选择新闻进入新闻详情页面
    */
   toDetail(item) {
      uni.setStorageSync('news', item)
      uni.setStorageSync('back_params', {type: 'switchTab', path: '/pages/home/index'})
      uni.redirectTo({url: '/pages/home/detail'})
   }
}
```

###### search.vue

- 搜索新闻页面，从 `home/index.vue` 页面进入
- 输入关键字联网搜索新闻，或点击历史搜索关键字标签
- 可点击 "自定义文案"，进入 `home/custom.vue` 自定义文案生成视频页面

```javascript
methods: {
   /*
    * 查询历史搜索记录方法
    */
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
   /*
    * 关键字搜索新闻方法
    */
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
      this.searchNews = null
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
   /*
    * 选择新闻进入新闻详情页面
    */
   goto() {
      uni.setStorageSync('news', this.searchNews)
      uni.setStorageSync('back_params', { type: 'redirectTo', path: '/pages/home/search' })
      uni.redirectTo({url: '/pages/home/detail'})
   },
   /*
    * 进入自定义文案生成视频页面
    */
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
   /*
    * 返回到home/index 主页
    */
   back() {
      uni.hideKeyboard()
      setTimeout(() => {
        uni.switchTab({url: '/pages/home/index'})
      }, 100)
   }
}
```

##### login

###### login.vue

- 登录页面，配合状态管理 `store/modules/generate.js` 中的登录状态使用，在使用项目功能前校验登录状态，未登录，则跳转到登录页面
- 支持账号登录、验证码登录、微信授权登录

```javascript
methods: {
   /*
    * 账号登录方法
    */
   onPasswordLogin() {
      if (!this.loginFormData.password) {
        this.$tip.confirm('请输入密码',false);
        return
      }
      let params = {
        phone: this.loginFormData.phone,
        password: this.loginFormData.password,
      }
      this.$http.post('/user/login', params).then(res => {
        if (res.status === 'success') {
          uni.setStorageSync('userId', res.data.user_id)
          this.$store.dispatch('task/userLogin', res.data.user_id);
          let router = uni.getStorageSync('login_router')
          uni[router.type]({url: router.path})
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
   },
   /*
    * 短信验证登录方法
    */
   onSMSLogin() {
      if(!this.loginFormData.sms || this.loginFormData.sms.length === 0){
        this.$tip.confirm('请填短信验证码',false);
        return;
      }
      let params = {
        phone: this.loginFormData.phone,
        code: this.loginFormData.sms,
        usage: 'login',
      }
      this.$http.post('/sms/verify', params).then(res => {
        if (res.status ==='success') {
          uni.setStorageSync('userId', res.data.user_id)
          this.$store.dispatch('task/userLogin', res.data.user_id);
          let router = uni.getStorageSync('login_router')
          uni[router.type]({url: router.path})
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
   },
   /*
    * 发送短信验证码方法
    */
   onSMSSend() {
      if (!this.isSendSMSEnable) {
        return;
      }
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
      if (!this.loginFormData.phone || this.loginFormData.phone.length === 0) {
        this.$tip.confirm('请填写手机号',false);
        return
      }
      if (!checkPhone.test(this.loginFormData.phone)) {
        this.$tip.confirm('请输入正确的手机号',false);
        return
      }
      let params = {
        phone: this.loginFormData.phone,
        usage: 'login',
      }
      this.$http.post('/sms/send', params).then(res => {
        if (res.status ==='success') {
          this.smsCountDown = 60;
          this.startSMSTimer();
          this.$tip.confirm('短信验证码发送成功',false);
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
   },
   /*
    * 判断是否是在微信环境
    */
   isWeChat() {
      return /MicroMessenger/i.test(navigator.userAgent);
   },
   /*
    * 微信授权
    */
   wxLogin() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        const redirectUri = encodeURIComponent(location.href)
        const scope = 'snsapi_userinfo'
        const state = 'xyz123'
        const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&forcePopup=true#wechat_redirect`;

        // 微信授权跳转
        uni.setStorageSync('authorized',true)
        location.replace(authUrl)
      }else {
        this.$tip.confirm('需要在微信环境下才能使用',false)
      }
   },
   /*
    * 获取code参数
    * 微信授权成功后，回调地址会携带code参数
    */
   getUrlCode(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
          .replace(/\+/g, '%20')) || null
   },
   checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code && uni.getStorageSync('authorized')) {
        uni.removeStorageSync('authorized');
        this.loginByCode(code)
      }
   },
   /*
    * 通过code登录，获取用户形象
    */
   loginByCode(code) {
      this.$http.get('/user/wx/auth',{code: code}).then(res => {
        if (res.status ==='success') {
          uni.setStorageSync('userId', res.data.user_id)
          this.$store.dispatch('task/userLogin', res.data.user_id);
          const cleanUrl = location.origin + location.pathname;
          history.replaceState({}, '', cleanUrl);
          let router = uni.getStorageSync('login_router')
          uni[router.type]({url: router.path})
        }else {
          this.$tip.confirm(res.message,false);
        }
      }).catch(err => {
        this.$tip.confirm(JSON.stringify(err),false);
      })
   },
   /*
    * 进入注册页面
    */
   gotoRegister() {
      uni.redirectTo({
        url: '/pages/login/register',
      })
   },
}
```

###### register.vue

- 注册账号页面，从 `login/login.vue` 登录页面进入
- 输入手机号，获取验证码验证手机号，验证通过后方可输入密码进行注册

```javascript
methods: {
   /*
    * 发送验证码
    */
   onSMSSend() {
      if (!this.isSendSMSEnable) {
        return;
      }
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
      if (!this.registerFormData.phone || this.registerFormData.phone.length === 0) {
        this.$tip.confirm('请填写手机号',false);
        return
      }
      if (!checkPhone.test(this.registerFormData.phone)) {
        this.$tip.confirm('请输入正确的手机号',false);
        return
      }
      let params = {
        phone: this.registerFormData.phone,
        usage: 'register',
      }
      this.$http.post('/sms/send', params).then(res => {
        if (res.status ==='success') {
          this.smsCountDown = 60;
          this.startSMSTimer();
          this.$tip.confirm('短信验证码发送成功',false);
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
   },
   /*
    * 验证手机号方法
    */
   verify() {
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
      if (!this.registerFormData.phone || this.registerFormData.phone.length === 0) {
        this.$tip.confirm('请填写手机号',false);
        return
      }
      if (!checkPhone.test(this.registerFormData.phone)) {
        this.$tip.confirm('请输入正确的手机号',false);
        return
      }
      let params = {
        phone: this.registerFormData.phone,
        code: this.registerFormData.sms,
        usage: 'register',
      }
      this.$http.post('/sms/verify', params).then(res => {
        if (res.status ==='success') {
          this.$tip.toast('验证成功，请设置密码',1000);
          this.isVerify = false
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
   },
   /*
    * 注册账号方法
    */
   register() {
      if (!this.registerFormData.password || this.registerFormData.password.length === 0) {
        this.$tip.confirm('请填写密码',false);
        return
      }
      if (this.registerFormData.password !== this.registerFormData.rePassword) {
        this.$tip.confirm('两次密码不一致',false);
        return
      }
      let params = {
        phone: this.registerFormData.phone,
        password: this.registerFormData.password,
      }
      this.$http.post('/user/register', params).then(res => {
        if (res.status === 'success') {
          this.$tip.confirm('注册成功，去登录',false).then(() => {
            this.resetData();
            this.toLogin();
          })
        } else {
          this.$tip.confirm(res.message,false);
        }
      })
   },
}
```

##### template

###### figureClone.vue

- 形象克隆页面，从 `template/index.vue` 页面进入
- 可点击右上角 "形象列表" 按钮进入 `template/figures.vue` 形象列表页面 
- 点击 "开始克隆" 按钮，选择视频文件、选择是否同时克隆声音，选定后点击 "克隆"，进行形象克隆任务

```javascript
methods: {
   /*
    * 选择视频文件
    */
   selectFile() {
      let self = this
      uni.chooseFile({
        count: 1,
        success: function (res) {
          let allowedExtensions = ['.mp4', '.mov'];
          let filename = res.tempFiles[0].name.toLowerCase();
          let allow = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext))
          if (!allow) {
            self.$tip.confirm('请选择有效的视频文件,mp4或mov格式',false)
            return
          }
          self.selectedFile = res.tempFiles[0]
        }
      });
   },
   /*
    * 上传文件方法
    */
   uploadFile() {
      let self = this
      if (!self.selectedFile || !self.selectedFile.path) {
        this.$tip.confirm('请先选择要上传的文件',false)
        return
      }
      self.$refs.clonePopup.close()

      self.isLoading = true
      self.$nextTick(() => {
        self.$refs.loadingVideo.playVideo()
      })

      uni.uploadFile({
        url: self.uploadUrl,
        filePath: self.selectedFile.path,
        name: 'file',
        header: {
          'Authorization': token
        },
        timeout: 1800000,
        formData: {
          'file_id': self.fileId,
          'type': 'video'
        },
        success: (result) => {
          let status = JSON.parse(result.data).base_resp
          let data = JSON.parse(result.data).data
          if (status.status_code === 200) {
            self.isLoading = false 
            // 上传成功后直接进行克隆任务
            self.clone(data.file_id)
          }else {
            self.isLoading = false
            self.$tip.confirm(`${self.selectedFile.name}视频上传失败,${status.status_msg}`,false)
          }
        }
      });
   },
   /*
    * 克隆形象方法
    */
   clone(fileId) {
      let params = {
        user_id: uni.getStorageSync('userId'),
        file_id: fileId,
        video_name: this.selectedFile.name,
        cloneSound: this.cloneSound
      }
      this.$http.post('/figure/clone/file_id',params,1800000).then(res => {
        if (res.status === 'success') {
          this.$tip.confirm(`视频上传成功，已创建形象克隆任务\n《${this.selectedFile.name}》`,false).then(res => {
            uni.redirectTo({url: '/pages/template/figures'})
          })
        }else {
          this.$tip.confirm(`${this.selectedFile.name}形象克隆任务创建失败,${res.message}`,false)
        }
      })
   },
}
```

###### figures.vue

- 形象列表页面，展示用户可用形象（系统形象/克隆形象），从 `template/figureClone.vue` 形象克隆页面进入
- 可点击占位形象图片，弹窗预览数字人形象视频，预览使用 `uni-popup` 弹窗 + <video> 标签实现

```javascript
mounted() {
   // 从store中获取形象列表，亦可获取到正在克隆中的形象
   this.$store.dispatch("task/pollFigureTasks");
},
```

###### index.vue

- 模板首页，集成了形象克隆、音色克隆、我的作品入口

```javascript
methods: {
   /*
    * 跳转到登录页
    */
   toLogin() {
      uni.setStorageSync('login_router', {
        type: 'switchTab',
        path: '/pages/template/index'
      })
      uni.redirectTo({url: '/pages/login/login'})
   },
   /*
    * 根据path路径的不同，跳转到形象克隆、音色克隆或我的作品页面
    */
   goto(path) {
      let userId = uni.getStorageSync('userId') || ''
      if (userId === '') {
        this.$tip.confirm('请先登录',false).then(() => {
          this.toLogin()
        })
        return
      }
      uni.redirectTo({url: path})
   }
}
```

###### videoList.vue

- 我的作品(视频列表)页面，从 `template/index.vue` 模板首页进入
- 展示生成的口播视频列表，只保留近三天生成的口播视频
- 支持批量删除选择的视频，也可选择视频进入 `pages/download.vue` 视频下载页面

```javascript
methods: {
   /*
    * 管理视频方法
    * 判断isManage值，false: 选择视频进入视频下载页面，true: 选择视频(用于后续删除)
    */
   manageVideo(data) {
      if (!this.isManage) {
        let path = `/pages/download?filepath=${data.video_path}&filename=${encodeURIComponent(data.filename)}`
        uni.redirectTo({url: path})
      }else {
        let index = this.selectedVideos.findIndex(item => item.id === data.id)
        if (index !== -1) {
          this.selectedVideos.splice(index, 1)
        }else {
          this.selectedVideos.push(data)
        }
      }
   },
   /*
    * 批量删除视频方法
    */
   delVideos() {
      let ids = this.selectedVideos.map(item => item.id)
      if (ids.length === 0) {
        this.$tip.confirm('请先选择要删除的视频', false)
        return
      }
      uni.showModal({
        title: '提示',
        content: '确定要删除选中的视频吗？',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            this.$http.del(`/video_record/batch_delete`, {ids: ids}).then(res => {
              if (res.status === 'success') {
                this.selectedVideos = []
                this.$tip.toast('删除成功', 1000)
                this.$store.dispatch("task/pollVideoTasks");
              }else {
                this.$tip.confirm(res.message, false)
              }
            })
          } else if (res.cancel) {
            this.selectedVideos = []
            this.$tip.toast('已取消删除', 1000)
          }
        },
      });
   },
}
```

###### voice.vue

- 音色列表页面，展示用户可用音色（系统音色/克隆音色），从 `template/voicesClone.vue` 音色克隆页面进入
- 支持点击音色占位头像试听音频

```javascript
mounted() {
   // 从store中获取音色列表，亦可获取到正在克隆中的音色
   this.$store.dispatch("task/pollVoiceTasks");
},
methods: {
   /*
    * 试听音频方法
    */
   previewAudio(item) {
      if (this.audioCtxId === item.id) {  // 已经播放了当前音色，则停止播放
        this.stopPreviewAudio()
        return
      }
      if (this.audioCtx) {  // 正在播放音频，则先停止播放
        this.stopPreviewAudio()
      }

      this.audioCtx = uni.createInnerAudioContext()
      this.audioCtx.src = item.filepath
      this.audioCtx.autoplay = true;
      this.audioCtx.play();
      this.audioCtx.onPlay(() => {
        this.audioCtxId = item.id
      })
      this.audioCtx.onEnded(() => {
        this.stopPreviewAudio()
      })
   },
   /*
    * 停止音频试听
    */
   stopPreviewAudio() {
      if (this.audioCtx) {
        this.audioCtx.pause();
        this.audioCtx.destroy()
        this.audioCtx = null
        this.audioCtxId = null
      }
   },
}
```

###### voicesClone.vue

- 音色克隆页面，从 `template/index.vue` 模板首页进入
- 可点击右上角 "音色列表" 按钮进入 `template/voice.vue` 音色列表页面 
- 支持在线录制音频克隆、上传音频文件克隆

```javascript
methods: {
   /*
    * 开始录制音频方法
    */
   startRecording() {
      uni.showToast({title: '录音环境准备中', icon: 'loading'})
      this.recorder = window.Recorder({
        type: 'wav',
        sampleRate: 16000,
        bitRate: 16
      })

      this.recorder.open(async () => {
        await this.recorder.start()
        uni.hideToast()
        this.isRecording = true;
        this.started = true;
        this.interval = setInterval(() => {
          if (this.duration < 15) {
            this.duration++;
            this.progress = (this.duration % 60) / 15; // 每60秒转一圈
            this.drawProgress();
          } else {
            this.stopRecording()
          }
        }, 1000);
      }, (errMsg, isUserNotAllow) => {
        this.$tip.confirm(`录音失败${errMsg}`, false)
      })
   },
   /*
    * 结束/完成录制方法
    */
   stopRecording() {
      if (!this.recorder) return

      this.recorder.stop((blob, duration) => {
        this.isRecording = false;
        this.started = false;
        this.progress = 0
        this.drawProgress();
        clearInterval(this.interval);
        this.audioUrl = URL.createObjectURL(blob)
        this.recorder.close()

        let index = uni.getStorageSync('recorderIndex') ? uni.getStorageSync('recorderIndex') + 1 : 1
        this.recorderFile = new File([blob], `recording_${index}.wav`, {type: 'audio/wav'})
      }, err => {
        this.$tip.confirm(`停止失败${err}`, false)
      })
   },
   /*
    * 上传音频文件方法
    */
   uploadFile() {
      let self = this
      uni.chooseFile({
        count: 1,
        success: function (res) {
          let allowedExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.mov'];
          let filename = res.tempFiles[0].name.toLowerCase();
          let allow = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext))
          if (!allow) {
            self.$tip.confirm('请选择有效的音频文件', false)
            return
          }
          let type = res.tempFiles[0].type.indexOf('audio') !== -1 ? 'audio' : 'video'
          self.getFileId(type, res.tempFiles[0])
        }
      });
   },
   /*
    * 克隆音色方法
    */
   clone(fileId, name) {
      let params = {
        file_id: fileId,
        user_id: uni.getStorageSync('userId'),
        audio_name: name
      }
      this.$http.post('/timbres/clone/file_id', params, 1800000).then(res => {
        if (res.status === 'success') {
          this.$tip.confirm(`文件上传成功，已创建音色克隆任务\n《${name}》`,false).then(res => {
            uni.redirectTo({url: '/pages/template/voice'})
          })
        } else {
          this.$tip.confirm(`${name}音色克隆任务创建失败,${res.message}`, false)
        }
      })
   },
}
```

##### user

###### contactUs.vue

- 联系我们页面，从 `user/index.vue` 页面进入
- 可选择通过电话、邮箱或是微信二维码联系我们

``` javascript
methods: {
   /*
    * 微信环境下，直接调起拨号方法
    */
   call() {
      window.location.href = 'tel:123-4567-890'
   },
}
```

###### figure.vue

- 我的数字人页面，从 `user/index.vue` 页面点击进入 "我的数字人" 功能卡片进入
- 查看已克隆的数字人，可对数字人重命名以及删除数字人

```javascript
methods: {
   /*
    * 查询已克隆数字人方法
    */
   queryFigures() {
      this.$http.get('/figure/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.figures = res.data.filter(item => item.type === 'clone' && item.status === 'success')
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 重命名数字人方法
    */
   dialogInputConfirm(value) {
      let params = {
        figure_id: this.selectedFigures[0].id,
        name: value
      }
      this.$http.put('/figure/update', params).then(res => {
        if (res.status === 'success') {
          this.$tip.toast('重命名成功', 1000)
          this.selectedFigures = []
          this.queryFigures()
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 批量删除数字人方法
    */
   delVideos() {
      let ids = this.selectedFigures.map(item => item.id)
      if (ids.length === 0) {
        this.$tip.confirm('请先选择要删除的数字人形象', false)
        return
      }
      uni.showModal({
        title: '提示',
        content: '确定要删除选中的数字人形象吗？',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            this.$http.del(`/figure/batch_delete`, {ids: ids}).then(res => {
              if (res.status === 'success') {
                this.selectedFigures = []
                this.$tip.toast('删除成功', 1000)
                this.queryFigures()
              } else {
                this.$tip.confirm(res.message, false)
              }
            })
          } else if (res.cancel) {
            this.selectedFigures = []
            this.$tip.toast('已取消删除', 1000)
          }
        },
      });
   },
}
```

###### figureRecharge.vue

- 形象额度充值页面，从 `user/index.vue` 页面点击"数字人额度"进入
- 选择需要充值的数字人额度，点击立即购买，调起微信支付充值

```javascript
methods: {
   /*
    * 查询用户套餐价格方法
    */
   queryPackageInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'figure'
      }
      this.$http.get('/package/query/user', params).then(res => {
        if (res.status ==='success') {
          this.price = res.data.price
          uni.setStorageSync('packageId', res.data.id)
        }else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 查询用户形象方法(会员等级)
    */
   queryUserInfo() {
      this.$http.get('/user/query', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status ==='success') {
          this.userInfo = res.data
        }else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 调起微信支付方法
    */
   getWeChatCode() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        const redirectUri = encodeURIComponent(window.location.href)
        uni.setStorageSync('selected', this.selected)
        uni.setStorageSync('count', this.count)
        const scope = 'snsapi_base'
        const state = 'STATE123'
        window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`)
      } else {
        this.$tip.confirm('需要在微信环境下才能使用', false)
      }
   },
   /*
    * 根据code微信支付方法
    */
   checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code) {
        let params = {
          user_id: uni.getStorageSync('userId'),
          code: code,
          count: this.selected.id === 4? parseInt(this.count) : this.selected.count,
          package_id: uni.getStorageSync('packageId'),
        }
        this.$http.post('/package/buy/balance', params).then(res => {
          if (res.status === 'success') {
            let self = this
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (result) {
              // 将回调页面重新设置成当前页面
              window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/figureRecharge');

              if (result.err_msg === "get_brand_wcpay_request:ok") {
                self.$tip.confirm('支付成功', false).then(() => {
                  self.queryUserInfo()
                })
              } else if (result.err_msg === "get_brand_wcpay_request:cancel") {
                self.$tip.confirm('已取消支付', false)
              } else {
                self.$tip.confirm('支付失败', false)
              }
            });
          } else {
            window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/figureRecharge');
            this.$tip.confirm(res.message, false);
          }
        })
      }
   },
}
```

###### historyCopy.vue

- 历史生成文案页面，从 `user/index.vue` 页面进入
- 展示用户历史生成的所有文案，可选中当前文案进入 `home/custom.vue` 自定义文案生成口播视频页面

``` javascript
methods: {
   /*
    * 查询历史生成文案方法
    */
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
   /*
    * 选择文案进入自定义文案生成口播视频页面方法
    */
   gotoCustom(index) {
      uni.setStorageSync('allScriptIndex', index)
      uni.setStorageSync('back_params', { type: 'redirectTo', path: '/pages/user/historyCopy' })
      uni.redirectTo({ url: '/pages/home/custom' })
   },
}
```

###### index.vue

- "我的" 首页，展示用户基本信息，隐私条款、用户协议、付费服务协议等
- 集成历史生成文案、订单管理、联系我们、充值等入口
- 点击头像可进入 `user/info.vue` 个人资料页面

```javascript
methods: {
   /*
    * 查询用户信息方法
    */
   queryUserInfo() {
      this.$http.get('/user/query', {user_id: this.userId}).then(async res => {
        if (res.status ==='success') {
          this.userInfo = res.data
          this.userTypeName = this.userTypeNames.find(item => item.type === this.userInfo.userType).name
          this.expireTime = this.userInfo.expire_time? this.userInfo.expire_time.replace('T',' ') : ''
        }
      })
   },
   /*
    * 进入充值中心方法
    */
   openVIP() {
      if (this.userId === '') {
        this.$tip.confirm('请先登录',false).then(() => {
          this.toLogin()
        })
        return
      }
      uni.removeStorageSync('packageId')
      this.goto('/pages/user/voucher')
   },
   /*
    * 页面跳转方法，根据url值，进入个人资料、历史生成文案、订单管理、联系客服等页面
    */
   goto(url) {
      if (url === '')
        return
      uni.redirectTo({url: url})
   }
}
```

###### info.vue

- 个人资料页面，从 `user/index.vue` 进入
- 展示头像、名称、性别、地区信息
- 点击头像，进入 `user/previewAvatar.vue` 预览头像页面

```javascript
methods: {
  /*
   * 查询用户信息方法
   */
  queryUserInfo() {
      this.$http.get('/user/query', {user_id: this.userId}).then(res => {
        if (res.status ==='success') {
          this.userInfo = res.data
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
   },
   /*
   * 进入预览头像页面
   */
   previewAvatar() {
      uni.redirectTo({
        url: `/pages/user/previewAvatar`
      })
   },
}
```

###### integral.vue

- 积分充值页面，从 `user/index.vue` 页面点击"积分余额"或 `user/voucher.vue` 点击"积分充值"进入
- 选择需要充值的积分数，点击立即购买，调起微信支付充值

```javascript
methods: {
   /*
    * 调起微信支付方法
    */
   getWeChatCode() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        const redirectUri = encodeURIComponent(window.location.href)
        uni.setStorageSync('redirectUri', window.location.href)
        const scope = 'snsapi_base'
        const state = 'STATE123'
        const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&forcePopup=true#wechat_redirect`;

        location.replace(authUrl)
      } else {
        this.$tip.confirm('需要在微信环境下才能使用', false)
      }
    },
   /*
    * 根据code微信支付方法
    */
   checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code) {
        let params = {
          user_id: uni.getStorageSync('userId'),
          code: code,
          package_id: uni.getStorageSync('packageId'),
        }
        this.$http.post('/package/buy', params).then(res => {
          if (res.status === 'success') {
            let self = this
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (result) {
              // 将回调页面重新设置成当前页面
              history.replaceState({}, '', 'https://tellai.tech/#/pages/user/integral');

              if (result.err_msg === "get_brand_wcpay_request:ok") {
                self.$tip.confirm('支付成功', false).then(() => {
                  self.queryInfo()
                })
              } else if (result.err_msg === "get_brand_wcpay_request:cancel") {
                self.$tip.confirm('已取消支付', false)
              } else {
                self.$tip.confirm('支付失败', false)
              }
            });
          } else {
            history.replaceState({}, '', 'https://tellai.tech/#/pages/user/integral');
            this.$tip.confirm(res.message, false);
          }
        })
      }
   },
   /*
    * 查询用户套餐价格方法
    */
   queryInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'token'
      }
      this.$http.get('/package/query/user', params).then(res => {
        if (res.status === 'success') {
          this.info = res.data.user_info;
          console.log(this.info)
          this.packages = res.data.packages;
          if (uni.getStorageSync('packageId')) {
            this.selectedPackage = this.packages.find(item => item.id === uni.getStorageSync('packageId'))
          } else {
            this.selectedPackage = this.packages[0] || {}
            uni.setStorageSync('packageId', this.selectedPackage.id)
          }
        } else {
          this.$tip.confirm(res.message, false);
        }
      })
   },
}
```

###### order.vue

- 订单管理页面，从 `user/index.vue` 页面进入
- 显示用户历史订单，积分、形象、音色额度使用情况

``` javascript
methods: {
   /*
    * 查询历史订单方法
    */
   queryOrders() {
      if (!uni.getStorageSync('userId')) {
        this.$tip.confirm('请先登录',false).then(() => {
          this.toLogin()
        })
        return
      }
      this.$http.get('/transactions/query/user',{user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.orders = res.data
        }else {
          this.$tip.toast(res.message)
        }
      })
   },
}
```

###### previewAvatar.vue

- 预览头像页面，`user/info.vue` 点击头像进入
- 大图预览头像，点击右上角更多按钮，可选上传头像，更换头像功能

```javascript
methods: {
   /*
    * 选择图片并上传更换头像方法
    */
   upload() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: function (res) {
          uni.uploadFile({
            url: 'https://live.tellai.tech/api/news_assistant/user/upload_avatar',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              'user_id': that.userId,
            },
            success: () => {
              that.queryUserInfo();
            }
          });
          that.$refs.popup.close();
        }
      });
   },
}
```

###### voice.vue

- 我的声音页面，从 `user/index.vue` 页面点击进入 "我的声音" 功能卡片进入
- 查看已克隆的声音，可对声音重命名以及删除声音

```javascript
methods: {
   /*
    * 查询声音方法
    */
   queryVoices() {
      this.$http.get('/timbres/query/user', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status === 'success') {
          this.voices = res.data.filter(item => item.type === 'clone' && item.status === 'success')
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 重命名声音方法
    */
   dialogInputConfirm(value) {
      let params = {
        timbre_id: this.selectedVoices[0].id,
        name: value
      }
      this.$http.put('/timbres/update', params).then(res => {
        if (res.status === 'success') {
          this.$tip.toast('重命名成功', 1000)
          this.selectedVoices = []
          this.queryVoices()
        } else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 批量删除声音方法
    */
   delVoices() {
      let ids = this.selectedVoices.map(item => item.id)
      if (ids.length === 0) {
        this.$tip.confirm('请先选择要删除的音色', false)
        return
      }
      uni.showModal({
        title: '提示',
        content: '确定要删除选中的音色吗？',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            this.$http.del(`/timbres/batch_delete`, {ids: ids}).then(res => {
              if (res.status === 'success') {
                this.selectedVoices = []
                this.$tip.toast('删除成功', 1000)
                this.queryVoices()
              } else {
                this.$tip.confirm(res.message, false)
              }
            })
          } else if (res.cancel) {
            this.selectedVoices = []
            this.$tip.toast('已取消删除', 1000)
          }
        },
      });
   },
}
```

###### voiceRecharge.vue

- 音色额度充值页面，从 `user/index.vue` 页面点击"音色额度"进入
- 选择需要充值的音色额度，点击立即购买，调起微信支付充值

```javascript
methods: {
   /*
    * 查询用户套餐价格方法
    */
   queryPackageInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'timbre'
      }
      this.$http.get('/package/query/user', params).then(res => {
        if (res.status ==='success') {
          this.price = res.data.price
          uni.setStorageSync('packageId', res.data.id)
        }else {
          this.$tip.confirm(res.message, false)
        }
      })
   },
   /*
    * 查询用户形象方法(会员等级)
    */
   queryUserInfo() {
      this.$http.get('/user/query', {user_id: uni.getStorageSync('userId')}).then(res => {
        if (res.status ==='success') {
          this.userInfo = res.data
        }
      })
   },
   /*
    * 调起微信支付方法
    */
   getWeChatCode() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        const redirectUri = encodeURIComponent(window.location.href)
        uni.setStorageSync('selected', this.selected)
        uni.setStorageSync('count', this.count)
        const scope = 'snsapi_base'
        const state = 'STATE123'
        window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`)
      } else {
        this.$tip.confirm('需要在微信环境下才能使用', false)
      }
   },
   /*
    * 根据code微信支付方法
    */
   checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code) {
        let params = {
          user_id: uni.getStorageSync('userId'),
          code: code,
          count: this.selected.id === 4? parseInt(this.count) : this.selected.count,
          package_id: uni.getStorageSync('packageId'),
        }
        this.$http.post('/package/buy/balance', params).then(res => {
          if (res.status === 'success') {
            let self = this
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (result) {
              // 将回调页面重新设置成当前页面
              window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/voiceRecharge');

              if (result.err_msg === "get_brand_wcpay_request:ok") {
                self.$tip.confirm('支付成功', false).then(() => {
                  self.queryUserInfo()
                })
              } else if (result.err_msg === "get_brand_wcpay_request:cancel") {
                self.$tip.confirm('已取消支付', false)
              } else {
                self.$tip.confirm('支付失败', false)
              }
            });
          } else {
            window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/voiceRecharge');
            this.$tip.confirm(res.message, false);
          }
        })
      }
   },
}
```

###### voucher.vue

- 充值服务页面，从 `user/index.vue` 页面点击"开通VIP"进入
- 可选月度会员、季度会员和年度会员套餐，点击立即购买
- 点击右上角"积分充值"，进入 `user/integral.vue` 积分充值页面

```javascript
methods: {
   /*
    * 查询会员套餐方法
    */
   queryInfo() {
      let params = {
        user_id: uni.getStorageSync('userId'),
        type: 'member'
      }
      this.$http.get('/package/query/user', params).then(res => {
        if (res.status === 'success') {
          this.voucherInfos = res.data
          if (uni.getStorageSync('packageId')) {
            this.selectedVoucher = this.voucherInfos.find(item => item.id === uni.getStorageSync('packageId')) || {}
          }else {
            this.selectedVoucher = this.voucherInfos[0] || {}
            uni.setStorageSync('packageId', this.selectedVoucher.id)
          }
        } else {
          this.$tip.confirm(res.message, false);
        }
      })
   },
   /*
    * 调起微信支付方法
    */
   getWeChatCode() {
      if (this.selectedVoucher.member_type < this.userInfo.userType) {
        this.$tip.confirm('无法购买比当前会员等级低的套餐', false)
      }else {
        this.$tip.confirm('未过期前购买新的会员套餐，时长会覆盖而不是延长', true).then(() => {
          if (this.isWeChat()) {
            const appId = 'wx48d2e02bf10f849c'
            const redirectUri = encodeURIComponent(window.location.href)
            uni.setStorageSync('redirectUri', window.location.href)
            const scope = 'snsapi_base'
            const state = 'STATE123'
            window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`)
          } else {
            this.$tip.confirm('需要在微信环境下才能使用', false)
          }
        }).catch(() => {
          this.$tip.toast('已取消购买', 1000)
        })
      }
   },
   /*
    * 根据code微信支付方法
    */
   checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code) {
        let params = {
          user_id: uni.getStorageSync('userId'),
          code: code,
          package_id: uni.getStorageSync('packageId'),
        }
        this.$http.post('/package/buy', params).then(res => {
          if (res.status === 'success') {
            let self = this
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (result) {
              // 将回调页面重新设置成当前页面
              window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/voucher');

              if (result.err_msg === "get_brand_wcpay_request:ok") {
                self.$tip.confirm('支付成功', false)
              } else if (result.err_msg === "get_brand_wcpay_request:cancel") {
                self.$tip.confirm('已取消支付', false)
              } else {
                self.$tip.confirm('支付失败', false)
              }
            });
          } else {
            window.history.replaceState({}, '', 'https://tellai.tech/#/pages/user/voucher');
            this.$tip.confirm(res.message, false);
          }
        })
      }
   },
}
```

##### download.vue

- 下载视频页面，从 `template/videoList.vue` 页面进入

```javascript
methods: {
   /*
    * 判断当前运行环境是否是微信
    */
   isWeChat() {
      return /MicroMessenger/i.test(navigator.userAgent);
    },
    /*
     * 下载视频方法
     * 若是微信环境，则弹出提示 "微信内无法直接下载，请点击右上角'…'选择'在浏览器中打开'"
     */
    download() {
      if (this.isWeChat()) {
        this.$refs.dialog.open()
      }else {
        const a = document.createElement('a');
        let filepath = this.filepath.replace('results','download_v4');
        a.href = filepath + `?filename=${this.filename}`;
        a.download =  this.filename + '.mp4';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
   },
}
```

#### store

##### index.js

- Vuex 状态管理入口文件，整合 `generate` 模块，统一管理应用状态

##### modules

###### generate.js

- 管理音色克隆、形象克隆、视频生成任务的轮询与状态更新以及登录状态
- 与 `App.vue` 的轮询逻辑联动

```javascript
const state = {
    isLogin: false,
    userId: '',

    videoTasks: [],
    videoPreviousStatusMap: {},
    
    // ......
};

if (uni.getStorageSync('userId')) {
    state.isLogin = true;
    state.userId = uni.getStorageSync('userId');
}

const mutations = {
    setLoginStatus(state, status) {
        state.isLogin = status;
    },

    setUserId(state, userId) {
        state.userId = userId;
    },

    setVideoTasks(state, list) {
        state.videoTasks = list;
    },
    updatePreviousStatusMap(state, newMap) {
        state.videoPreviousStatusMap = { ...newMap };
    },
	
    // ......
};

const actions = {
    /*
     * 登录调用方法，记录登录状态以及userId
     */
    async userLogin({ commit }, userId) {
        commit("setLoginStatus", true)
        commit("setUserId", userId)
    },
	/*
     * 登出调用方法，记录登录状态、移除userId
     */
    async userLogout({ commit }) {
        commit("setLoginStatus", false)
        commit("setUserId", '')
    },
	/*
     * 轮训视频生成任务
     */
    async pollVideoTasks({ state, commit }) {
        uni.request({
            url: 'https://live.tellai.tech/api/news_assistant/video_record/query',
            data: {
                user_id: state.userId,
            },
            method: 'GET',
            success: (res) => {
                if (res.data.status === 'success') {
                    const list = res.data.data;
                    list.forEach(video => {
                        const prev = state.videoPreviousStatusMap[video.id];
                        if (prev === "pending" && video.status === "success") {
                            uni.showModal({
                                title: '提示',
                                content: `${video.filename}视频生成任务成功，本次生成消耗${video.points}个积分`,
                                showCancel: false,
                            });
                        }else if (prev === "pending" && video.status === "failed") {
                            uni.showModal({
                                title: '提示',
                                content: `${video.filename}视频生成任务失败,${video.message}`,
                                showCancel: false,
                            });
                        }
                    });

                    const newStatusMap = {};
                    list.forEach(v => { newStatusMap[v.id] = v.status; });

                    commit("setVideoTasks", list);
                    commit("updatePreviousStatusMap", newStatusMap);
                }
            }
        })
    },
    
    // ......  
    // 其余轮训声音克隆、信息克隆方法与视频生成类似
};

const getters = {
    isLogin: (state) => state.isLogin,
    videoTasks: (state) => state.videoTasks,
    // ......
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

```

