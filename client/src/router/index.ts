import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login'
import Signin from '@/pages/Signin'
import Frame from '@/units/Frame'
import Home from '@/pages/Home'
import Behind from '@/pages/Status'
import UserInfo from '@/pages/UserInfo'
import UserInfo1 from '@/pages/EnterWorksation'
import UserInfoRegister from "@/pages/userinfoRegister"
import InWorkstation from '@/pages/InWorkstation'
import OutWorkstation from '@/pages/OutWorkstation'
import Teacher from '@/pages/Teacher'
import EntryManagePage from '@/pages/Teacher/EntryManage';
import EntryApprovalPage from '@/pages/Teacher/EntryApproval';
import OutManagePage from '@/pages/Teacher/OutManage';
import OutManageAssessment from '@/pages/Teacher/OutManage/Assessment';
import OutManageDelay from '@/pages/Teacher/OutManage/Delay';
import OutManageOut from '@/pages/Teacher/OutManage/Out';
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
      path: '/teacher',
      name: 'teacher',
      component: Teacher,
    },
    {
      path: '/teacher/entryManage',
      component: EntryManagePage,
    },
    {
      path: '/teacher/entryManage/approval',
      component: EntryApprovalPage,
    },
    {
      path: '/teacher/outManage',
      component: OutManagePage,
      children: [
        { path: 'assessment', component: OutManageAssessment },
        { path: 'assessment/:id', component: () => import('@/pages/Teacher/OutManage/AssessmentDetail') },
        { path: 'delay', component: OutManageDelay },
        { path: 'out', component: OutManageOut },
      ]
    },
    {
      path: '/UserInfo',
      name: '/UserInfo',
      component: UserInfo,
      children: [
        {
          path: 'status',
          name: 'behind',
          component:Behind
        },
        {
          path: 'userInfoRegister',
          name: '/userInfoRegister',
          component: UserInfoRegister
        },
        {
          path: 'entry',
          name: '/entry',
          component: UserInfo1
        },
        {
          path: 'in-station',
          name: '/in-station',
          component: InWorkstation
        },
        {
          path: 'out-station',
          name: '/out-station',
          component: OutWorkstation
        }
      ]
    }
  ],
})
router.beforeEach(authGuard)

export default router
