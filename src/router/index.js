import Vue from 'vue'
import Router from 'vue-router'
//将组件引用到路由页面
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import users from '../components/users'
import rights from '../components/rights'
import roles from '../components/roles'
import categories from '../components/categories'
import params from '../components/params'
import goods from '../components/goods'
import goodsAdd from '../components/goodsAdd'
import orders from '../components/orders'
import reports from '../components/reports'


Vue.use(Router)

const router = new Router({

  routes: [
    // 重定向根目录为Login页面
    {
      path: "/",
      redirect: "/login"
    },
    // login登录的路由页面
    {
      path: '/login',
      component: login
    },
    // 重定向主页
    {
      path: '/home',
      redirect: "/welcome",
      component: home,
      children: [
        // 主页地址
        {
          path: '/welcome',
          component: welcome
        },
        // 用户列表主页
        {
          path: '/users',
          component: users
        },
        // 权限列表
        {
          path: '/rights',
          component: rights
        },
        //角色列表
        {
          path: '/roles',
          component: roles
        },
        //商品分类
        {
          path: '/categories',
          component: categories
        },
        //商品参数
        {
          path: '/params',
          component: params
        },
        //商品列表
        {
          path: '/goods',
          component: goods
        },
        //商品添加列表
        {
          path: '/goodsAdd',
          component: goodsAdd
        },
        //订单列表
        {
          path: '/orders',
          component: orders
        },
        //报表统计
        {
          path: '/reports',
          component: reports
        },

      ]
    }
  ]
})


// 使用路由守卫控制访问权限
router.beforeEach((to, from, next) => {
  // 判断是否带有tokenStr字符串，如有不为空则放行
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/login') return next()
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
