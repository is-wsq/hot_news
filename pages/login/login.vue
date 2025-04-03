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
        <text class="forgot-password" @click="loginType = 1 - loginType">{{ loginType === 0? '短信登陆':'密码登陆' }}</text>
      </view>
      <button class="login-button" @click="login">登陆</button>
      <button class="signup-button" @click="gotoRegister">创建账户</button>
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
      path: ''
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
  },
  methods: {
    login() {
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);

      if(!this.loginFormData.phone || this.loginFormData.phone.length === 0){
        this.$tip.toast('请填写手机号',2000);
        return;
      }
      if(!checkPhone.test(this.loginFormData.phone)){
        this.$tip.toast('请输入正确的手机号',2000);
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
        this.$tip.toast('请输入密码',2000);
        return
      }
      let params = {
        phone: this.loginFormData.phone,
        password: this.loginFormData.password,
      }
      this.$http.post('/user/login', params).then(res => {
        if (res.status === 'success') {
          this.$tip.toast('登陆成功');
          uni.setStorageSync('userId', res.data.user_id)
          if (this.type === 'switchTab') {
            uni.switchTab({ url: this.path })
          }else {
            uni.redirectTo({ url: this.path })
          }
        }else {
          this.$tip.toast(res.message,5000);
        }
      })
    },
    onSMSLogin() {
      if(!this.loginFormData.sms || this.loginFormData.sms.length === 0){
        this.$tip.toast('请填短信验证码',2000);
        return;
      }
      let params = {
        phone: this.loginFormData.phone,
        code: this.loginFormData.sms,
        usage: 'login',
      }
      this.$http.post('/sms/verify', params).then(res => {
        if (res.status ==='success') {
          this.$tip.toast('登陆成功');
          uni.setStorageSync('userId', res.data.user_id)
          if (this.type === 'switchTab') {
            uni.switchTab({ url: this.path })
          }else {
            uni.redirectTo({ url: this.path })
          }
        }else {
          this.$tip.toast(res.message,2000);
        }
      })
    },
    onSMSSend() {
      if (!this.isSendSMSEnable) {
        return;
      }
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
      if (!this.loginFormData.phone || this.loginFormData.phone.length === 0) {
        this.$tip.toast('请填写手机号',2000);
        return
      }
      if (!checkPhone.test(this.loginFormData.phone)) {
        this.$tip.toast('请输入正确的手机号',2000);
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
          this.$tip.toast('短信验证码发送成功',2000);
        }else {
          this.$tip.toast(res.message,2000);
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
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #e99d42;
  color: #fff;
  font-size: 16px;
  border-radius: 12px;
  margin: 25px 0;
}

.signup-button {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  color: #1E1F20;
  font-size: 16px;
  border-radius: 12px;
}
</style>
