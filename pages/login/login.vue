<template>
  <view class="login">
    <view class="logo-img">
      <image src="/static/login/bg-black.jpeg" style="width: 100%" mode="widthFix"></image>
      <view class="title">
        <span style="color: #fff;">奇</span>
        <span style="color: #E1C59CD9;margin-left: 6px">点</span>
      </view>
    </view>

    <view class="login-box">
      <text class="welcome">欢迎回来 !</text>
      <text class="subtitle">登陆后继续</text>
      <uni-forms ref="loginForm" label-position="top">
        <uni-forms-item name="phone" label="手机号">
          <input type="number" class="form-input" v-model="loginFormData.phone"/>
        </uni-forms-item>
        <uni-forms-item name="password" :label="loginType === 0? '密码':'验证码'" style="position: relative">
          <input v-if="loginType === 0" type="text" class="form-input" v-model="loginFormData.password" password/>
          <input v-else type="text" class="form-input" v-model="loginFormData.sms" password/>
          <view @click="onSMSSend" v-if="loginType === 1" class="send-sms-button">{{ getSendBtnText }}</view>
        </uni-forms-item>
      </uni-forms>
      <view style="width: 100%;display: flex;justify-content: space-between">
        <text class="forgot-password">忘记密码？</text>
        <text class="forgot-password" @click="loginType = 1 - loginType">{{
            loginType === 0 ? '短信登陆' : '密码登陆'
          }}
        </text>
      </view>
      <view style="display: flex;gap: 30px;margin: 25px 0;">
        <button class="login-button" @click="login">登陆</button>
        <button class="signup-button" @click="gotoRegister">创建账户</button>
      </view>
      <view style="display: flex;margin-top: 10px;justify-content: center;gap: 40px">
        <view class="third" @click="wxLogin">
          <view style="color: #fff;margin-right: 5px">微信授权登陆</view>
          <uni-icons type="weixin" size="25" color="#fff"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safe: uni.getSystemInfoSync().safeArea,
      loginType: 0,
      loginFormData: {
        phone: '',
        password: '',
        sms: '',
      },
      registerFormData: {
        phone: '',
        password: '',
        rePassword: '',
      },
      smsCountDown: 0, //0 密码登陆， 1 短信登陆
      type: '',
      path: '',
    };
  },
  computed: {
    isSendSMSEnable() {
      return this.smsCountDown <= 0
    },
    getSendBtnText() {
      if (this.smsCountDown > 0) {
        return this.smsCountDown + '秒后发送';
      } else {
        return '发送验证码';
      }
    },
  },
  onLoad: function (option) {
    this.type = option.type
    this.path = option.path
    this.checkWeChatCode()
  },
  methods: {
    login() {
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);

      if(!this.loginFormData.phone || this.loginFormData.phone.length === 0){
        this.$tip.confirm('请填写手机号',false);
        return;
      }
      if(!checkPhone.test(this.loginFormData.phone)){
        this.$tip.confirm('请输入正确的手机号',false);
        return;
      }
      if (this.loginType === 0) {
        this.onPasswordLogin();
      } else {
        this.onSMSLogin()
      }
    },
    gotoRegister() {
      uni.redirectTo({
        url: '/pages/login/register',
      })
    },
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
          if (this.type === 'switchTab') {
            uni.switchTab({ url: this.path })
          }else {
            uni.redirectTo({ url: this.path })
          }
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
    },
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
          if (this.type === 'switchTab') {
            uni.switchTab({ url: this.path })
          }else {
            uni.redirectTo({ url: this.path })
          }
        }else {
          this.$tip.confirm(res.message,false);
        }
      })
    },
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
    startSMSTimer() {
      this.smsCountInterval = setInterval(() => {
        this.smsCountDown--;
        if (this.smsCountDown <= 0) {
          clearInterval(this.smsCountInterval);
        }
      }, 1000);
    },
    resetData() {
      this.loginType = 0
      this.loginFormData = {
        phone: '',
        password: '',
        sms: '',
      };
    },
    isWeChat() {
      return /MicroMessenger/i.test(navigator.userAgent);
    },
    wxLogin() {
      if (this.isWeChat()) {
        const appId = 'wx48d2e02bf10f849c'
        let url = `${window.location.origin}${window.location.pathname}?t=${Date.now()}`
        const redirectUri = encodeURIComponent(url)
        const scope = 'snsapi_userinfo' // 或 snsapi_base（静默授权）
        const state = 'STATE123'
        const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`

        // 微信授权跳转
        uni.setStorageSync('authorized',true)
        window.location.href = authUrl
      }else {
        this.$tip.confirm('需要在微信环境下才能使用',false)
      }
    },
    getUrlCode(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
          .replace(/\+/g, '%20')) || null
    },
    checkWeChatCode() {
      let code = this.getUrlCode('code')
      if (code && uni.getStorageSync('authorized')) {
        this.loginByCode(code)
      }
    },
    loginByCode(code) {
      this.$tip.confirm(code,false).then(() => {
        this.$http.get('/user/wx/auth',{code: code}).then(res => {
          if (res.status ==='success') {
            uni.setStorageSync('userId', res.data.user_id)
            if (this.type === 'switchTab') {
              uni.switchTab({ url: this.path })
            }else {
              uni.redirectTo({ url: this.path })
            }
          }else {
            this.$tip.confirm(res.message,false);
          }
        })
      })
    }
  },
}
</script>

<style scoped>
.login {
  position: relative;
  background-color: #000000;
  height: 100vh !important;
}

.title {
  font-size: 60px;
  font-weight: bold;
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 63px);
}

.login >>> .uni-forms-item {
  margin-bottom: 20px;
}

.login >>> .uni-forms-item__label {
  font-size: 14px;
  color: #FFFFFF
}

.login >>> .uni-forms-item.is-direction-top .uni-forms-item__label{
  padding: 0 0 6px !important;
}

.logo-img {
  width: 100%;
  position: relative;
}

.login-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 528px;
  background-color: #292929;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.welcome {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #fff;
}

.subtitle {
  font-size: 14px;
  color: #BBBBBB;
  margin-bottom: 10px;
  text-align: center;
}

.form-input {
  height: 48px;
  padding: 0 10px;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #5f5f5f;
  color: #fff;
}

.send-sms-button {
  position: absolute;
  top: 0;
  right: 12px;
  color: #FFFFFF;
  font-size: 16px;
  line-height: 48px;
}

.forgot-password {
  font-size: 14px;
  color: #BBBBBB;
  cursor: pointer;
  margin: 0 auto;
}

.login-button {
  flex: 1;
  height: 50px;
  line-height: 50px;
  background: #e99d42;
  color: #fff;
  font-size: 16px;
  border-radius: 10px;
}

.signup-button {
  flex: 1;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  color: #1E1F20;
  font-size: 16px;
  border-radius: 10px;
}

.third {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #393939;
  display: flex;
  align-items: center;
  justify-content: center
}
</style>
