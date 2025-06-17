import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/units/Login'
import Frame from '@/units/Frame'
import Home from '@/pages/Home'
import UserInfo from '@/units/EnterWorksation'
import { authGuard } from './guard'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: '/',
      name: 'frame',
      component: Frame,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
          meta: { requiresAuth: true } // 需要认证
        },
      ],
    },
    {
      path: '/userInfo',
      name: '/userInfo',
      component: UserInfo
    }
  ],
})
router.beforeEach(authGuard)

export default router
