import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login'
import Signin from '@/pages/Signin'
import Frame from '@/units/Frame'
import Home from '@/pages/Home'
import UserInfo from '@/pages/UserInfo'
import UserInfo1 from '@/pages/EnterWorksation'
import UserInfoRegister from "@/pages/userinfoRegister"
import InWorkstation from '@/pages/InWorkstation'
import OutWorkstation from '@/pages/OutWorkstation'
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
      path: "/register",
      name: "register",
      component: Signin,
    },
    {
      path: '/',
      name: 'frame',
      component: Frame,
      children: [
        {
          path: "",
          name: "home",
          component: Home
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
        {
          path: '/in-station',
          name: '/in-station',
          component: InWorkstation
        },
        {
          path: '/out-station',
          name: '/out-station',
          component: OutWorkstation
        }
      ]
    }
  ],
})
router.beforeEach(authGuard)

export default router
