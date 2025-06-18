import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/units/Login'
import Frame from '@/units/Frame'
import Home from '@/pages/Home'
import UserInfo from '@/units/UserInfo'
import UserInfo1 from '@/units/EnterWorksation'
import UserInfoRegister from "@/units/userinfoRegister"
import { authGuard } from './guard'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/auth/login",
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
      path: '/UserInfo',
      name: '/UserInfo',
      component: UserInfo,
      children: [
        {
          path: '',
          name: '/userInfoRegister',
          component: UserInfoRegister
        },
        {
          path: '/entry',
          name: '/entry',
          component: UserInfo1
        },
      ]
    }
  ],
})
router.beforeEach(authGuard)

export default router
