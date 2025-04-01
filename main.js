import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

import http from './common/utils/axios.js';

Vue.prototype.$http = http;

import tip from './common/utils/tip.js'
Vue.prototype.$tip = tip;

import store from './store'
Vue.prototype.$store = store;
let lastTaskStatus = {};
store.watch(
    (state) => state.task.tasks, // 监听任务列表
    (newTasks) => {
        newTasks.forEach((task) => {
            // 检查任务从 "running" 状态变成了 "success"
            if (lastTaskStatus[task.id] === 'running' && task.status === 'success') {
                // const pages = getCurrentPages(); // 获取当前页面栈
                // const currentPage = pages[pages.length - 1]; // 获取栈中的当前页面
                //
                // if (currentPage && currentPage.$route === '/pages/template/index') {
                //     currentPage.queryReel(); // 调用
                // }
                // 弹出提示框
                let taskName = task.type === 'voice'? '音色克隆' : '口播视频生成';
                uni.showModal({
                    title: '提示',
                    showCancel: false,
                    content: `${taskName}任务 "${task.name}" 已完成！`,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
            }
            // 更新记录的任务状态
            lastTaskStatus[task.id] = task.status;
        });
    },
    { deep: true } // 深度监听，确保数组内部对象的变化也能被监测到
);

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}

// #endif