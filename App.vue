<script>
import wechatToolbarMixin from './common/utils/wechat-toolbar.js';
  export default {
    mixins: [wechatToolbarMixin],
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
html,
body {
  background-color: #000000;
}
@import "/static/iconfont.css";
.image-wrapper {
  position: relative;
  display: inline-block;
  border-radius: 10px;
  overflow: hidden;
}

.shine-layer {
  content: '';
  position: absolute;
  top: 0;
  left: -60px;
  width: 20px;
  height: 100%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 40%,
      rgba(255, 255, 255, 0.7) 50%,
      rgba(255, 255, 255, 0.4) 60%,
      rgba(255, 255, 255, 0) 100%
  );
  filter: blur(20px); /* 拖尾模糊 */
  opacity: 1;
  pointer-events: none;
  border-radius: 12px;
  z-index: 2;
}

.shining .shine-layer {
  animation: shine-move 2s linear infinite;
}

@keyframes shine-move {
  0% {
    left: -100%;
  }
  100% {
    left: 120%;
  }
}

  .uni-pull-to-refresh {
    background-color: #000000 !important; /* 设置为你想要的背景色，例如 #ffffff */
  }

  /* 如果有下拉刷新提示区域，也可调整其背景色 */
  .uni-pull-to-refresh .uni-pull-to-refresh__layer {
    background-color: #000000 !important;
  }

	/*每个页面公共css */
  .pages {
    background-color: #000000;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .nav-bar-header {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 56px;
    box-sizing: border-box;
    position: relative;
  }

  .nav-bar-title {
    color: #ffffff;
    font-size: 16px;
    display: flex;
  }

  .nav-bar-back {
    position: absolute;
    left: 0;
  }

  /* 定义整个滚动条的宽度和高度 */
  ::-webkit-scrollbar {
    width: 0; /* 垂直滚动条的宽度 */
    height: 0; /* 水平滚动条的高度 */
  }

  /* 滚动条轨道样式 */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* 轨道背景色 */
    border-radius: 10px; /* 轨道角的圆滑度 */
  }

  /* 滚动条滑块样式 */
  ::-webkit-scrollbar-thumb {
    background: #888; /* 滑块背景色 */
    border-radius: 10px; /* 滑块角的圆滑度 */
  }

  /* 鼠标悬停在滚动条滑块上的样式 */
  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* 悬停时的滑块颜色 */
  }
</style>
