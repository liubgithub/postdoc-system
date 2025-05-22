import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/units/Login'
import Frame from '@/units/Frame'
import Home from '@/pages/Home'


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
        },
      ],
    },
  ],
})

export default router
