---
title: 饿了么高仿大作战

---

# 项目简介

参照支付宝里面的饿了么，写一个高仿的饿了么项目。

所用技术栈为**vue 2.x,   vue-cli 3.x**。

<br><br>

# 构建项目与准备工作

见[代码](https://github.com/Dunteng/ele/tree/v1/ele-app)

<br><br>



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

<br>

在router.js中配置路由，使用的是**路由的按需加载**以及**路由守卫**：

```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
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
    },
    {
      path: '*',
      redirect(to) {
        return '/'  //以上不存在的路径都全部重定位到首页
      }
    }

  ]
})
//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.ele_login ? true : false;
  if (to.path == '/login') {
    next();
  } else {
    // 是否在登录状态下
    isLogin ? next() : next('/login');
  }
});

export default router;

```

如果没有登陆就直接跳转到login页面。

<br><br>

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

<br>在Login.vue中使用这个InputGroup组件，并传值：

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

<br>到这一步的效果如下：

![](https://raw.githubusercontent.com/Dunteng/images/master/BlogImages/illustration/ele-app/1561619110524.png)

<br><br>

## 实现验证码功能

### 实现验证手机号码 & 倒计时功能

Login.vue新增验证手机号码方法和倒计时方法：

```js
  methods: {
    getVerifyCode() {
      if (this.validatePhone()) {
        // 验证一下手机号格式是否正确
        this.validateBtn();
          //开始倒计时
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

<br><br>

### 开通聚合数据的短信API功能

<https://www.juhe.cn/myData>

<br><br>

### 实现发送获取验证码功能

<br>

一、先安装**axios**，在main.js中引入import axios from 'axios'，并配置在**全局使用axios**

![1561623715024](https://raw.githubusercontent.com/Dunteng/images/master/BlogImages/illustration/ele-app/1561623715024.png)

<br>二、新建一个vue.config.js文件，里面配置关于跨域请求的东西。

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
          target: 'https://ele-interface.herokuapp.com/api/',//用于请求短信服务的后台接口
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

<br>三、在Login.vue中完善getVerifyCode():

```js
    getVerifyCode() {
      if (this.validatePhone()) {
        // 验证一下手机号格式是否正确
        this.validateBtn();
        // 发送网络请求
        this.$axios
          .post("/api/posts/sms_send", {
            tpl_id: "1xxx9",//填入你的聚合数据短信API模板ID
            key: "795be723xxxxxxxxb6713ab795",//填入你的聚合数据短信API Appkey
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

<br>

四、验证码作为参数发送登陆请求并跳转路由

原button登录按钮绑定路由跳转事件：

![1561626711738](https://raw.githubusercontent.com/Dunteng/images/master/BlogImages/illustration/ele-app/1561626711738.png)

```js
  computed: {
    isClick() {
      if (!this.phone || !this.verifyCode) return true;
      else return false;
    }
  },
```

<br>

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

<br><br>

## 封装底部tabbar组件

- 在`/public/index.html`中引入字体图标样式

  ```html
  <link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
  ```

- 封装**tabbar**组件

  ```vue
  <template>
    <div class="tabbar">
      <router-link
        class="tab-item"
        v-for="(item,index) in data"
        :key="index"
        :to="item.path"
        active-class="is-selected"
      >
        <div class="tab-item-icon">
          <i :class="'fa fa-' + item.icon"></i>
        </div>
        <div class="tab-item-label">{{item.title}}</div>
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "tabbar",
    props: {
      data: Array
    }
  };
  </script>
  ```

- 在`index.vue`里引用**tabbar**组件并在`router.js`中配置路由

<br><br>

## 高德地图api获取定位

### 准备工作

注册账号，创建应用，添加key。

打开👉开发支持—>web端—>[地图JS api](https://lbs.amap.com/api/javascript-api/summary)

里面有一个入口脚本标签，并将其中「您申请的key值」替换为您刚刚申请的 key；

```html
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=您申请的key值"></script> 
```

我们在/public/index.html中进行引入。

<br>

### 在App.vue中执行获取定位函数

使用高德地图api提供的定位函数来进行获取定位，👉<https://lbs.amap.com/api/javascript-api/guide/services/geolocation>

- 精准定位

  ![1568285944608](https://raw.githubusercontent.com/rockdunteng/imageBed/master/Project/ele/1568285944608.png)

  以上是精准的定位，但是因为pc设备上大都缺少GPS芯片，所以在PC上的定位主要通过IP精准定位服务，该服务的失败率在5%左右。

  精准定位失败的情况下要执行非精准定位。

- 非精准定位

  首先先通过[IP定位获取当前城市信息](https://lbs.amap.com/api/javascript-api/guide/services/geolocation)，获取到经纬度，然后利用经纬度进行[逆向地理编码](https://lbs.amap.com/api/javascript-api/guide/services/geocoder)。



- 将定位数据显示到页面

  - 通过 vuex 来处理位置location和地址address信息

  - 在App.vue中使用 vuex 中的state、mutations等操作将数据显示到页面

    ![1568289131669](https://raw.githubusercontent.com/rockdunteng/imageBed/master/Project/ele/1568289131669.png)







<br>

## Address 和 City 两大功能完善

**目标**：

首页的头部点击后跳转到地址路由`address.vue`，实现目标如图所示：

![1568292058440](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1568292058440.png)



- 封装Header组件

- 搜索框与定位信息显示

  Address.vue传值给Location组件

- 根据关键字检索地理信息

  利用高德地图的[**输入提示与POI搜索**](https://lbs.amap.com/api/javascript-api/guide/services/autocomplete)

  searchPlace ()

- 点击搜索出来的地理信息后更改首页的头部地址

  selectAddress ()

<br><br>



**目标**：点击 address 路由页面的城市名称跳转到 city 路由，进行城市搜索，搜索城市结果列表呈现，点击后跳转回 address 的路由并更新所在城市名称。

实现的关键：

- city 路由页面由 address 路由进入
- 搜索前所在城市信息由`Home.vue`传入
- 通过 axios 获取**后端数据**并队数据进行处理
- alphabet 组件用于列表显示城市搜索结果
- 使用 **better-scroll** 插件实现列表滚动
- 字母索引
- 关键字检索优化
- 其他点击跳转优化

