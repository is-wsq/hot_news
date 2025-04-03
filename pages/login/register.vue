<template>
  <view class="register">
    <view class="logo-img">
      <image src="/static/login/bg-black.jpeg" style="width: 100%" mode="widthFix"></image>
      <view class="title">
        <span style="color: #fff;">奇</span>
        <span style="color: #E1C59CD9;margin-left: 6px">点</span>
      </view>
    </view>
    <view class="register-box">
      <text class="welcome">创建账户 !</text>
      <text class="subtitle">注册后继续</text>
      <uni-forms ref="form" label-position="top" style="width: 100%;">
        <template v-if="isVerify">
          <uni-forms-item name="phone" label="手机号">
            <input type="number" class="form-input" v-model="registerFormData.phone"/>
          </uni-forms-item>
          <uni-forms-item name="password" label="验证码" style="position: relative">
            <input type="text" class="form-input" v-model="registerFormData.sms" password/>
            <view @click="onSMSSend" class="send-sms-button">{{ getSendBtnText }}</view>
          </uni-forms-item>
        </template>
        <template v-else>
          <uni-forms-item name="phone" label="密码">
            <input type="text" class="form-input" v-model="registerFormData.password" password/>
          </uni-forms-item>
          <uni-forms-item name="password" label="重复密码" style="position: relative">
            <input type="text" class="form-input" v-model="registerFormData.rePassword" password/>
          </uni-forms-item>
        </template>
      </uni-forms>
      <button v-if="isVerify" class="register-button" @click="verify">验证账号</button>
      <button v-else class="register-button" @click="register">注册账号</button>
      <text class="forgot-password" @click="gotoLogin" style="margin-top: 7px">已有账户？登陆</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      safe: uni.getSystemInfoSync().safeArea,
      registerFormData: {
        phone: '',
        sms: '',
        password: '',
        rePassword: '',
      },
      isVerify: true,
      smsCountDown: 0,
      routeTo: ''
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
    this.routeTo = option.type
    // if (window.history && window.history.pushState) {
    //   window.history.pushState(null, null, document.URL);
    //   window.addEventListener('popstate', function () {
    //     window.history.pushState(null, null, document.URL);
    //   });
    // }
  },
  methods: {
    onSMSSend() {
      if (!this.isSendSMSEnable) {
        return;
      }
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
      if (!this.registerFormData.phone || this.registerFormData.phone.length === 0) {
        this.$tip.toast('请填写手机号',2000);
        return
      }
      if (!checkPhone.test(this.registerFormData.phone)) {
        this.$tip.toast('请输入正确的手机号',2000);
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
    verify() {
      let checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
      if (!this.registerFormData.phone || this.registerFormData.phone.length === 0) {
        this.$tip.toast('请填写手机号',2000);
        return
      }
      if (!checkPhone.test(this.registerFormData.phone)) {
        this.$tip.toast('请输入正确的手机号',2000);
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
          this.$tip.toast(res.message,2000);
        }
      })
    },
    register() {
      if (!this.registerFormData.password || this.registerFormData.password.length === 0) {
        this.$tip.toast('请填写密码',2000);
        return
      }
      if (this.registerFormData.password !== this.registerFormData.rePassword) {
        this.$tip.toast('两次密码不一致',2000);
        return
      }
      let params = {
        phone: this.registerFormData.phone,
        password: this.registerFormData.password,
      }
      this.$http.post('/user/register', params).then(res => {
        if (res.status === 'success') {
          this.$tip.toast('注册成功，请登录');
          this.resetData();
          uni.redirectTo({
            url: '/pages/login/login?type=switchTab&path=/pages/home/index'
          })
        } else {
          this.$tip.toast(res.message,5000);
        }
      })
    },
    resetData() {
      this.isVerify = true;
      this.smsCountDown = 0
      this.registerFormData = {
        phone: '',
        sms: '',
        password: '',
        rePassword: '',
      };
    },
    gotoLogin() {
      uni.redirectTo({
        url: '/pages/login/login?type=switchTab&path=/pages/home/index'
      })
    }
  },
}
</script>

<style scoped>
.register {
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

.register >>> .uni-forms-item {
  margin-bottom: 20px;
}

.register >>> .uni-forms-item__label {
  font-size: 14px;
  color: #FFFFFF
}

.register >>> .uni-forms-item.is-direction-top .uni-forms-item__label{
  padding: 0 0 6px !important;
}

.logo-img {
  width: 100%;
  position: relative;
}

.register-box {
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
  text-align: center;
  margin-bottom: 10px;
  color: #fff;
}

.subtitle {
  font-size: 14px;
  color: #BBBBBB;
  margin-bottom: 30px;
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

.register-button {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #e99d42;
  color: #fff;
  font-size: 16px;
  border-radius: 12px;
  margin: 30px 0;
}
</style>
