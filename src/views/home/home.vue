<template>
  <!-- 布局区域 -->
  <el-container class="home_contain">
    <!-- 布局头部上栏 -->
    <el-header>
      <div class="header_left">
        <img src="~assets/img/icon.jpg" alt />
        <span>Vue后台管理系统</span>
      </div>
      <div class="header_right">
        <el-button type="info" @click="leave">退出</el-button>
      </div>
    </el-header>
    <!--布局下栏目  -->
    <el-container>
      <!-- 侧边左区域 -->
      <el-aside :width="iscollapase?'64px':'200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="iscollapase"
          :collapse-transition="false"
          router
          :default-active="activepath"
        >
          <!-- 第一菜单 -->
          <el-submenu :index="index+''" v-for="(val,index) in menulist" :key="index">
            <template slot="title">
              <!-- 利用i标签进行图标设置 -->
              <i :class="icondata[val.id]"></i>
              <span>{{val.authName}}</span>
            </template>
            <!-- 第一菜单的第二菜单 -->
            <el-menu-item
              :index="'/'+val.path"
              v-for="val in val.children"
              :key="val.id"
              @click="btn(val.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{val.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--  侧边右区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { menu } from "../../network/user";
export default {
  name: "home",
  data() {
    return {
      menulist: [],
      // 添加对应图标的id值；
      icondata: {},
      // 添加对应的图标；
      icondatas: [
        "iconfont icon-ai-user",
        "iconfont icon-quanxian",
        "iconfont icon-shangpin",
        "iconfont icon-icon-",
        "iconfont icon-tongji"
      ],
      // 是否进行折叠
      iscollapase: false,
      activepath: ""
    };
  },
  created() {
    // 运行一次获取菜单数据的方法
    this.menus();

    // 组件一开始初始化就把当前某一菜单进行高亮，选中状态
    this.activepath = window.sessionStorage.getItem("activepatha");
  },
  computed: {},
  methods: {
    // 获取菜单分类的数据
    async menus() {
      let { data} = await menu("menus");
      this.menulist = data.data;
      // 对图标进行唯一标识
      data.data.forEach((element, index) => {
        this.icondata[element.id] = this.icondatas[index];
      });
    },

    // 点击退出主页
    leave() {
      window.sessionStorage.clear();
      this.$router.replace("/login");
      this.$Message.success("退出成功！");
    },

    // 折叠菜单方法
    toggle() {
      // iscollapase判断true是否折叠菜单
      this.iscollapase = !this.iscollapase;
    },

    // 对当前的点击菜单路径存储在sessionstrorage中
    btn(path) {
      path = "/" + path;
      window.sessionStorage.setItem("activepatha", path);

      // 立马让当前的点击路径高亮
      this.activepath = path;
    }
  }
};
</script>
<style  scoped>
@import url("http://at.alicdn.com/t/font_1678481_xjzic3ywr7j.css");
.home_contain {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border: none;
}
.header_left {
  display: flex;
  align-items: center;
}
.header_left img {
  height: 50px;
}
.header_left span {
  color: #fff;
  padding-left: 20px;
}
.iconfont {
  padding-right: 12px;
}
.toggle-button {
  text-align: center;
  line-height: 30px;
  height: 30px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  letter-spacing: 2px;
  background: #4a5064;
}
</style>