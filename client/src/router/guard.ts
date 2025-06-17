import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import useUser from '@/stores/user'

// 白名单 - 不需要认证的路径
const whiteList = ['/auth/login', '/register']

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUser()
  
  // 初始化用户状态
  userStore.initUser()
  
  // 如果目标路由在白名单中，直接放行
  if (whiteList.includes(to.path)) {
    return next()
  }

  // 检查用户是否已认证  
  if (userStore.isAuthenticated) {
    next()
  } else {
    // 重定向到登录页，并携带目标路径
    next({
      path: '/auth/login',
      query: { redirect: encodeURIComponent(to.fullPath) }
    })
  }
}