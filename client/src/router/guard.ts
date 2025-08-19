import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import useUser from '@/stores/user'

// 白名单 - 不需要认证的路径
const whiteList = ['/auth/login', '/register', '/']

// 角色权限配置
const rolePermissions: { [key: string]: string[] } = {
  admin: ['/admin', '/admin/*'], // admin可以访问的路径
  teacher: ['/teacher', '/teacher/*'], // teacher可以访问的路径
  user: ['/', '/UserInfo', '/UserInfo/*'] // 普通用户可以访问的路径
}

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
    // 检查角色权限
    const userRole = userStore.info?.role || 'user'
    const allowedPaths = rolePermissions[userRole] || []
    
    // 检查用户是否有权限访问当前路径
    const hasPermission = allowedPaths.some((path: string) => {
      if (path.endsWith('/*')) {
        return to.path.startsWith(path.slice(0, -2))
      }
      return to.path === path
    })
    
    if (hasPermission) {
      next()
    } else {
      // 没有权限，重定向到对应角色的首页
      if(userRole === 'admin'){
        next('/admin')
      } else if (userRole === 'teacher'){
        next('/teacher')
      } else {
        next('/')
      }
    }
  } else {
    // 重定向到登录页，并携带目标路径
    next({
      path: '/auth/login',
      query: { redirect: encodeURIComponent(to.fullPath) }
    })
  }
}