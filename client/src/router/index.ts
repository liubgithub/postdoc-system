import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login'
import Signin from '@/pages/Signin'
import Frame from '@/units/Frame'
import Home from '@/pages/Home'
import AdminPage from '@/pages/Admin'
import Behind from '@/pages/PostdocProcess'
import UserInfo from '@/pages/UserInfo'
import UserInfo1 from '@/pages/EnterWorksation'
import UserInfoRegister from "@/pages/userinfoRegister"
import InWorkstation from '@/pages/InWorkstation'
import OutWorkstation from '@/pages/OutWorkstation'
import Teacher from '@/pages/Teacher'
import EntryApplyPage from '@/pages/Teacher/EntryManage/EntryAply';
import EntryApprovalPage from '@/pages/Teacher/EntryManage/ViewEntryAply';
import EntryCheckPage from '@/pages/Teacher/EntryManage/EntryCheck';
import ViewEntryCheckPage from '@/pages/Teacher/EntryManage/ViewEntryCheck';
import OutManagePage from '@/pages/Teacher/OutManage/OutManage';
import OutManageAssessment from '@/pages/Teacher/OutManage/Assessment';
import OutManageDelay from '@/pages/Teacher/OutManage/Delay';
import OutManageOut from '@/pages/Teacher/OutManage/Out';
import MiddleCheckPage from '@/pages/Teacher/InManage/MiddleCheck';
import ViewMiddleCheckPage from '@/pages/Teacher/InManage/ViewMiddleCheck';
import YearCheckPage from '@/pages/Teacher/InManage/YearCheck';
import ViewYearCheckPage from '@/pages/Teacher/InManage/ViewYearCheck';
import ExtensionCheckPage from '@/pages/Teacher/InManage/ExtentionCheck';
import ViewExtensionCheckPage from '@/pages/Teacher/InManage/ViewExtentionCheck';
import AccountCheckPage from '@/pages/Teacher/AccountApproval/AccountCheck';
import OutCheckPage from '@/pages/Teacher/OutManage/OutCheck';
import PremissionManage from '@/pages/Admin/PremissionManage'
import Statistics from '@/pages/Admin/Statistics'
import InformationRelease from '@/pages/Admin/InformationRelease'
import CotutorAccount from '@/pages/Admin/CotutorAccount'
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
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      children: [
        {
          path: 'adminHome', // 默认子路由
          name: 'adminHome',
          component: () => import('@/pages/Admin/PostdocProcess/index.tsx'),
        },
        {
          path: 'entryManage',
          name: 'entryManage',
          component: () => import('@/pages/Admin/EntryManage/index.tsx'),
          redirect: '/admin/entryManage/Application', // 默认重定向到Application
          children: [
            {
              path: 'Application',
              name: 'adminEntryApproval',
              component: () => import('@/pages/Admin/EntryManage/Application'),
            },
            {
              path: 'Assessment',
              name: 'adminEntryCheckDetail',
              component: () => import('@/pages/Admin/EntryManage/Assessment'),
            },
          ]
        },
        {
          path: 'accountApproval',
          name: 'adminAccountApproval',
          component: () => import('@/pages/Admin/AccountApproval/AccountCheck.tsx'),
        },
        {
          path:'premissionManage',
          name:'premissionManage',
          component: PremissionManage
        },
        {
          path:'statistics',
          name:'statistics',
          component:Statistics
        },
        {
          path:'informationRelease',
          name:'informationRelease',
          component:InformationRelease
        },
        {
          path:'cototuraccount',
          name:'cototuraccount',
          component:CotutorAccount
        }
      ]
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: Teacher,
    },
    {
      path: '/teacher/entryManage',
      redirect: '/teacher/entryManage/apply'
    },
    {
      path: '/teacher/entryManage/apply',
      component: EntryApplyPage,
    },
    {
      path: '/teacher/entryManage/approval',
      component: EntryApprovalPage,
    },
    {
      path: '/teacher/entryManage/assessment',
      component: EntryCheckPage,
    },
    {
      path: '/teacher/entryManage/check-detail',
      component: ViewEntryCheckPage,
    },
    {
      path: '/teacher/inManage',
      redirect: '/teacher/inManage/middle'
    },
    {
      path: '/teacher/inManage/middle',
      component: MiddleCheckPage,
    },
    {
      path: '/teacher/inManage/viewMiddleCheck',
      component: ViewMiddleCheckPage,
    },
    {
      path: '/teacher/inManage/year',
      component: YearCheckPage,
    },
    {
      path: '/teacher/inManage/viewYearCheck',
      component: ViewYearCheckPage,
    },
    {
      path: '/teacher/inManage/extension',
      component: ExtensionCheckPage,
    },
    {
      path: '/teacher/inManage/viewExtensionCheck',
      component: ViewExtensionCheckPage,
    },
    {
      path: '/teacher/accountApproval',
      component: AccountCheckPage,
    },
    {
      path: '/teacher/outCheck',
      component: OutCheckPage,
    },
    {
      path: '/teacher/outManage',
      component: OutManagePage,
      children: [
        { path: 'assessment', component: OutManageAssessment },
        { path: 'assessment/:id', component: () => import('@/pages/Teacher/OutManage/AssessmentDetail') },
        { path: 'delay', component: OutManageDelay },
        { path: 'out', component: OutManageOut },
        { path: 'out', component: OutCheckPage },
      ]
    },
    {
      path: '/UserInfo',
      name: '/UserInfo',
      component: UserInfo,
      children: [
        {
          path: '',
          name: 'behind',
          component: Behind
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
