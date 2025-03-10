<template>
  <view class="login" :style="{height: safe.height + 'px'}">
    <image class="logo-img" src="/static/login/bg.jpg" :style="{height: safe.width + 'px'}"></image>

    <view class="title"><span style="color: #6286ED;">奇</span><span style="color: white">点</span></view>

    <view class="login-box" v-if="isLogin">
      <text class="welcome">欢迎回来！</text>
      <text class="subtitle">登陆后继续</text>
      <uni-forms ref="loginForm" label-position="top">
        <uni-forms-item name="phone" label="手机号">
          <input type="number" class="form-input" v-model="loginFormData.phone"/>
        </uni-forms-item>
        <uni-forms-item name="password" :label="loginType === 0? '密码':'验证码'">
          <input v-if="loginType === 0" type="text" class="form-input" v-model="loginFormData.password" password/>
          <view v-else style="display: flex">
            <input type="text" class="form-input" style="flex: 1" v-model="loginFormData.sms" password/>
            <button class="send-sms-button" :disabled="!isSendSMSEnable" @click="onSMSSend">
              {{ getSendBtnText }}
            </button>
          </view>
        </uni-forms-item>
      </uni-forms>
      <view style="width: 100%;display: flex;justify-content: space-between">
        <text class="forgot-password">忘记密码？</text>
        <text class="forgot-password" @click="loginType = 1 - loginType">{{ loginType === 0? '短信登陆':'密码登陆' }}</text>
      </view>
      <button class="login-button" @click="login">登陆</button>
      <button class="signup-button" @click="isLogin = false">创建账户</button>
    </view>

    <view class="login-box" v-else>
      <text class="welcome">创建账户</text>
      <text class="subtitle" style="margin-bottom: 20px !important;">注册后继续</text>
      <uni-forms ref="form" label-position="top">
        <uni-forms-item name="phone" label="手机号">
          <input type="number" class="form-input" v-model="registerFormData.phone"/>
        </uni-forms-item>
        <uni-forms-item name="password" label="密码">
          <input type="text" class="form-input" v-model="registerFormData.password" password/>
        </uni-forms-item>
        <uni-forms-item name="rePassword" label="确认密码">
          <input type="text" class="form-input" v-model="registerFormData.rePassword" password/>
        </uni-forms-item>
      </uni-forms>
      <button class="login-button" style="margin: 10px 0 0 0 !important;" @click="register">创建账户</button>
      <text class="forgot-password" @click="isLogin = true" style="margin-top: 7px">已有账户？登陆</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safe: null,
      isLogin: true,
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
      phoneError: true,
      passwordError: true,
      smsCountDown: 0
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
  onShow() {

  },
  created() {
    this.safe = uni.getSystemInfoSync().safeArea
  },
  methods: {
    login() {
      uni.switchTab({
        url: '/pages/home/index'
      })
    },
    onSMSSend() {
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
      if (!this.loginFormData.phone || this.loginFormData.phone === 0) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return false
      }
      if (!checkPhone.test(this.loginFormData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return false
      }
      this.smsCountDown = 60;
      this.startSMSTimer();
    },
    startSMSTimer() {
      this.smsCountInterval = setInterval(() => {
        this.smsCountDown--;
        if (this.smsCountDown <= 0) {
          clearInterval(this.smsCountInterval);
        }
      }, 1000);
    },
  },
}
</script>

<style scoped>
.login {
  position: relative;
}

.title {
  position: absolute;
  font-size: 60px;
  bottom: 580px;
  left: calc(50% - 60px);
}

.login >>> .uni-forms-item__label {
  color: #000
}

.logo-img {
  width: 100%;
}

.login-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 30px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.welcome {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #888;
  margin-bottom: 40px;
}

.form-input {
  height: 45px;
  padding: 0 10px;
  border-radius: 5px;
  box-sizing: border-box;
  border: 2px solid rgba(143, 146, 161, 0.2);
}

.send-sms-button {
  font-size: 16px;
  width: 110px;
  margin-left: 2px;
  border-radius: 5px;
  background: #4A90E2;
  color: #fff;
}

.forgot-password {
  font-size: 16px;
  color: #4A90E2;
  cursor: pointer;
  margin: 0 auto;
}

.login-button {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #4A90E2;
  color: #fff;
  font-size: 16px;
  border-radius: 10px;
  margin: 20px 0;
}

.signup-button {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: transparent;
  border: 1px solid rgba(143, 146, 161, 0.2);
  font-size: 16px;
  border-radius: 10px;
}
</style>
