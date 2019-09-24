import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      // name: 'index',
      component: () => import('./views/index.vue'),
      children: [
        {
          path: '',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('./views/Home.vue')
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('./views/Order.vue')
        },
        {
          path: '/me',
          name: 'me',
          component: () => import('./views/Me.vue')
        },
        {
          path: '/address',
          name: 'address',
          component: () => import('./views/Address.vue')
        },
        {
          path: '/city',
          name: 'city',
          component: () => import('./views/City.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./views/Search.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      redirect: '/goods',
      component: () => import('./views/Shops/Shop.vue'),
      children: [
        {
          path: '/goods',
          component: () => import('./views/Shops/Goods.vue')
        },
        {
          path: '/seller',
          component: () => import('./views/Shops/Seller.vue')
        },
        {
          path: '/comments',
          component: () => import('./views/Shops/Comments.vue')
        }
      ]
    },
    {
      path: "/myAddress",
      component: () => import('./views/Orders/MyAddress.vue')
    },
    {
      path: "/addAddress",
      name: "addAddress",
      component: () => import('./views/Orders/AddAddress.vue')
    },
    {
      path: "/settlement",
      name: "settlement",
      component: () => import('./views/Orders/Settlement.vue')
    },
    {
      path: "/remark",
      name: "remark",
      component: () => import('./views/Orders/Remark.vue')
    },
    {
      path: "/pay",
      name: "pay",
      component: () => import("./views/Orders/Pay.vue")
    },
    {
      path: '/orderInfo',
      name: 'orderInfo',
      component: () => import('./views/Orders/OrderInfo.vue')
    },
    {
      path: '*',
      redirect(to) {
        return '/home'
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