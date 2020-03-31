import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import("components/login");
const home = () => import("views/home/home");
const welcome = () => import("views/home/Welcome");
const user = () => import("views/user/User");
const powerlist = () => import("views/power/Powerlist");
const roles = () => import("views/power/roleList");
const goods = () => import("views/goods/Goods");
const params = () => import("views/goods/Params");
const goodList = () => import("views/goods/GoodList");
const goodListAdd = () => import("views/goods/GoodListAdd");
const order = () => import("views/order/Order");







Vue.use(VueRouter)

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    component: login,
  },
  {
    path: "/home",
    component: home,
    redirect: "/welcome",
    children: [{
      path: "/welcome",
      component: welcome,
    }, {
      path: "/users",
      component: user,
    },
    {
      path: "/rights",
      component: powerlist,
    },
    {
      path: "/roles",
      component: roles
    },
    {
      path: "/categories",
      component: goods
    }, {
      path: "/params",
      component: params
    }, {
      path: "/goods",
      component: goodList,
    },
    {
      path: "/goods/add",
      component: goodListAdd
    },
    {
      path: "/orders",
      component: order
    }

    ]
  },


]

const router = new VueRouter({
  routes,
  mode: "history",
})

// 该判断进行对用户的验证进行，在一个路由跳转到另一个路由前进行触发！
router.beforeEach((to, from, next) => {
  if (to.path == "/login") return next();

  // 获取看是否有token值
  let strtoken = window.sessionStorage.getItem("token")
  if (!strtoken) return next("/login");
  next();
})
export default router
