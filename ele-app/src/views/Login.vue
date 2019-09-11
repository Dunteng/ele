<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/logo.jpg" alt="logo" />
    </div>
    <!-- 输入手机号 -->
    <InputGroup
      type="number"
      v-model="phone"
      placeholder="请输入手机号"
      :btnTitle="btnTitle"
      :disabled="disabled"
      :error="errors.phone"
      @btnClick="getVerifyCode"
    />
    <!-- 输入验证码 -->
    <InputGroup type="number" v-model="verifyCode" placeholder="请输入验证码" :error="errors.code" />

    <!-- 用户服务协议 -->
    <div class="login_des">
      <p>
        新用户登录即自动注册，表示已同意
        <span>《用户服务协议》</span>
      </p>
      <br />
      <p>本项目由【聚合数据】提供10条免费验证码服务，如无法成功收到验证码短信，可能是该10次服务已用尽，可使用以下账号密码进行登录</p>
      <span>账号：13724828194</span>
      <br />
      <span>验证码：004096</span>
    </div>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <button :disabled="isClick" @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script>
import InputGroup from "../components/InputGroup";

export default {
  name: "login",
  data() {
    return {
      phone: "",
      verifyCode: "",
      errors: {},
      btnTitle: "获取验证码",
      disabled: false
    };
  },
  computed: {
    isClick() {
      if (!this.phone || !this.verifyCode) return true;
      else return false;
    }
  },
  methods: {
    getVerifyCode() {
      if (this.validatePhone()) {
        // 验证一下手机号格式是否正确
        this.validateBtn(); //开始倒计时
        // 发送网络请求
        this.$axios
          .post("/api/posts/sms_send", {
            tpl_id: "168497",
            key: "060e4520d84c80e9852c1c8530bf6359",
            phone: this.phone
          })
          .then(res => {
            console.log(res);
          });
      }
    },
    validateBtn() {
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.btnTitle = "获取验证码";
          this.disabled = false;
        } else {
          // 倒计时
          this.btnTitle = time + "秒后重试";
          this.disabled = true;
          time--;
        }
      }, 1000);
    },
    validatePhone() {
      // 验证手机号码
      if (!this.phone) {
        this.errors = {
          phone: "手机号码不能为空"
        };
        return false;
      } else if (!/^1[345678]\d{9}$/.test(this.phone)) {
        this.errors = {
          phone: "请填写正确的手机号码"
        };
        return false;
      } else {
        this.errors = {};
        return true;
      }
    },
    handleLogin() {
      // 取消错误提醒
      this.errors = {};
      // 发送请求
      // this.$axios
      //   .post("/api/posts/sms_back", {
      //     phone: this.phone,
      //     code: this.verifyCode
      //   })
      //   .then(res => {
      //     console.log(res);
      //     // 检验成功 设置登录状态并且跳转到/
      //     localStorage.setItem("ele_login", true);
      //     this.$router.push("/");
      //   })
      //   .catch(err => {
      //     // 返回错误信息
      //     this.errors = {
      //       code: err.response.data.msg
      //     };
      //   });
      localStorage.setItem("ele_login", true);
      this.$router.push("/");
    }
  },
  components: {
    InputGroup
  }
};
</script>

</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
}

.logo {
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>
