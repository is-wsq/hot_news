<script>
	export default {
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
@import "/static/iconfont.css";
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
    padding: 20px 0;
    box-sizing: border-box;
    position: relative;
  }

  .nav-bar-title {
    font-size: 20px;
    color: #ffffff;
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
