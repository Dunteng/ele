---
title: 饿了么高仿大作战

---

# 项目简介

参照支付宝里面的饿了么，写一个高仿的饿了么项目。

所用技术栈为**vue 2.x,   vue-cli 3.x**。

<br><br>

# 构建项目与准备工作

见[代码](https://github.com/Dunteng/ele/tree/v1/ele-app)





# 正式开发

## 构建登录组件

新建Login.vue:

```vue
<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/logo.jpg" alt="logo">
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {};
  }
};
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
</style>
```

在router.js中配置路由，使用的是**路由的按需加载**：

```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: ()=>import('./views/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: ()=>import('./views/Login.vue')
    }

  ]
})

```

如果没有登陆就直接跳转到login页面。



## 构建InputGroup组件

将“请输入手机号”、“请输入验证码”的input框都封装成了一个InputGroup组件。

```vue
<template>
  <div class="text_group">
    <!-- 组件结构 -->
    <!-- 组件容器 -->
    <div class="input_group" :class="{'is-invalid':error}">
      <!-- 输入框 -->
      <input
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :name="name"
        @input="$emit('input',$event.target.value)"
      >
      <!-- 输入框后面的按钮 -->
      <button v-if="btnTitle" :disabled="disabled" @click="$emit('btnClick')">{{btnTitle}}</button>
    </div>
    <!-- 错误提醒 -->
    <div v-if="error" class="invalid-feedback">{{error}}</div>
  </div>
</template>

<script>
export default {
  name: "inputGroup",
  props: {
    type: {
      type: String,
      default: "text"
    },
    value: String,
    placeholder: String,
    name: String,
    btnTitle: String,
    disabled: Boolean,
    error: String
  }
};
</script>

<style scoped>
.input_group {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.input_group input {
  height: 100%;
  width: 60%;
  outline: none;
  border: none;
  /* 下面是自己加的消除移动端input默认样式 */
  -moz-appearance: none;
  -webkit-appearance: none; /*解决ios上按钮的圆角问题*/
  border-radius: 0; /*解决ios上输入框圆角问题*/
  outline: medium; /*去掉鼠标点击的默认黄色边框*/
  background-color: transparent;
}
.input_group button {
  border: none;
  outline: none;
  background: #fff;
}
.input_group button[disabled] {
  color: #aaa;
}
.is-invalid {
  border: 1px solid red;
}
.invalid-feedback {
  color: red;
  padding-top: 5px;
}
</style>

```

在Login.vue中使用这个InputGroup组件，并传值：

```vue
<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/logo.jpg" alt="logo">
    </div>
    <!-- 输入手机号 -->
    <InputGroup 
      type="number"
      v-model="phone"
      placeholder="请输入手机号"
      :btnTitle="btnTitle"
      :disabled="disabled"
      :error="errors.phone"
    />
    <!-- 输入验证码 -->
    <InputGroup type="number" v-model="verifyCode" placeholder="请输入验证码" :error="errors.code" />

    <!-- 用户服务协议 -->
    <div class="login_des">
      <p>
        新用户登录即自动注册，表示已同意
        <span>《用户服务协议》</span>
      </p>
    </div>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <button :disabled='disabled' >登录</button>
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
```

到这一步的效果如下：

![1561619110524](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1561619110524.png)

## 实现验证码功能

### 实现验证手机号码 & 倒计时功能

Login.vue新增验证手机号码方法和倒计时方法：

```
  methods: {
    getVerifyCode() {
      if (this.validatePhone()) {
        // 验证一下手机号格式是否正确
        this.validateBtn();
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
    }
  },
```

### 开通聚合科技的短信API功能

<https://www.juhe.cn/myData>

### 实现发送获取验证码功能

**一、**先安装**axios**，在main.js中引入import axios from 'axios'，并配置在**全局使用axios**

![1561623715024](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1561623715024.png)

**二、**新建一个vue.config.js文件，里面配置关于跨域请求的东西。

```js
module.exports = {
    devServer: {
      open: true,
      host: 'localhost',
      port: 8080,
      https: false,
      hotOnly: false,
      proxy: {
        // 配置跨域
        '/api': {
          target: 'https://ele-interface.herokuapp.com/api/',
          ws: true,
          changOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      },
      before: app => {}
    }
  };
  
```

**三、**在Login.vue中完善getVerifyCode():

```js
    getVerifyCode() {
      if (this.validatePhone()) {
        // 验证一下手机号格式是否正确
        this.validateBtn();
        // 发送网络请求
        this.$axios
          .post("/api/posts/sms_send", {
            tpl_id: "136729",
            key: "795be723dd9e88c3ea98e2b6713ab795",
            phone: this.phone
          })
          .then(res => {
            console.log(res);
          });
      }
    },
```

这里看一下聚合科技短信服务的[API文档](https://www.juhe.cn/docs/api/id/54)

|      | 名称      | 必填 | 类型   | 说明                                                         |
| ---- | --------- | ---- | ------ | ------------------------------------------------------------ |
|      | mobile    | 是   | string | 接收短信的手机号码                                           |
|      | tpl_id    | 是   | int    | 短信模板ID，请参考个人中心短信模板设置                       |
|      | tpl_value | 是   | string | 变量名和变量值对，如：#code#=431515，整串值需要urlencode，比如正确结果为：%23code%23%3d431515。如果你的变量名或者变量值中带有#&=中的任意一个特殊符号，请先分别进行utf-8 urlencode编码后再传递，[详细说明>](http://www.juhe.cn/news/index/id/50) |
|      | key       | 是   | string | 在个人中心->我的数据,接口名称上方查看                        |
|      | dtype     | 否   | string | 返回数据的格式,xml或json，默认json                           |



**四、**验证码作为参数发送登陆请求并跳转路由

原button登录按钮绑定路由跳转事件：

![1561626711738](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1561626711738.png)

```js
  computed: {
    isClick() {
      if (!this.phone || !this.verifyCode) return true;
      else return false;
    }
  },
```



```js
    handleLogin() {
      // 取消错误提醒
      this.errors = {};
      // 发送请求
      this.$axios
        .post("/api/posts/sms_back", {
          phone: this.phone,
          code: this.verifyCode
        })
        .then(res => {
          // console.log(res);
          // 检验成功 设置登录状态并且跳转到/
          localStorage.setItem("ele_login", true);
          this.$router.push("/");
        })
        .catch(err => {
          // 返回错误信息
          this.errors = {
            code: err.response.data.msg
          };
        });
    }
```

至此发送和获取验证码并成功跳转的功能实现了。