<template>
  <div class="login_contain">
    
    <!-- 登录界面 -->
    <div class="login_box">
      <!-- 登录图标 -->
      <div class="login_logo">
        <div class="logo_contain">
          <img src="~assets/logo.png" alt />
        </div>
      </div>
      <!-- 登录框 -->
      <!-- 1.model进行对用户框的复制 :model固定 -->
      <!-- 在el-input中 v-model=loginform.username 双向绑定 -->
      <!-- 2.设置用户框的输入规则 :rules 固定-->
      <!-- 在el-form-item中进行prop="username"设置规则 -->
      <!-- 注意规则的username必须一致！！！！ -->
      <!-- ref是相当于获取该组件 -->
      <el-form class="el_form" :model="loginform" :rules="loginrules" ref="loginref">
        <el-form-item prop="username">
          <el-input class="input" prefix-icon="icon-yonghu iconfont" v-model="loginform.username">54</el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="input"
            prefix-icon="iconfont icon-mima"
            v-model="loginform.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="el_btn">
          <el-button type="primary" @click="formvalidate">登录</el-button>
          <el-button type="info" @click="formreset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { user, menu } from "../network/user";
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      // 初始化用户名与密码的值，进行双向绑定
      loginform: {
        username: "admin",
        password: "123456"
      },
      // 用户框规则
      loginrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 点击按钮进行重置
    formreset() {
      console.log(this.$refs.loginref);
      this.$refs.loginref.resetFields();
    },
    
    // 进行用户验证方法后跳转
    formvalidate() {
      // 对该form中的数据组件进行验证
      this.$refs.loginref.validate(bool => {
        if (!bool) return;
        // 进行用户的验证
        user("/login", this.loginform).then(da => {
          let { meta, data } = da;
          if (meta.status === 200) {
            this.$Message.success("登录成功！");
          } else {
            this.$Message.error("登录失败！");
          }
          // 当第一次用户进行验证的时候，服务器会返回一个token，保存在浏览器的sessionstorage
          // 当打开别的接口进行访问的时候会携带这个token，不用再登录了！
          window.sessionStorage.setItem("token", data.token);
          this.$router.replace("/home");
        });
      });
    }
  }
};
</script>
<style  scoped>
@import url("http://at.alicdn.com/t/font_1471343_pxcakqqk6e.css");
.login_contain {
  height: 100%;
  background: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
}
.login_logo {
  display: flex;
  justify-content: center;
  margin-top: -80px;
}
.logo_contain {
  width: 120px;
  height: 125px;
  background: #eee;
  border-radius: 50%;
  border: 10px #fff solid;
  position: relative;
  box-shadow: 0px 0px 10px #ddd;
  text-overflow: hidden;
}
.logo_contain img {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 120px;
  height: 125px;
  border-radius: 50%;
}

.el_form {
  margin-top: 50px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.el_btn {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
</style>