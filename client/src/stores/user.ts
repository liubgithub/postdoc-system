import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router' // 导入路由实例
import { init_login } from '@/api/fetch'
const useUser = defineStore("user", () => {

    const { raw } = init_login('/api')

    const info = ref<{
        name: string
        token: string
        role: string
    } | null>(null)

    // 初始化时检查 localStorage 中的 token
    const initUser = () => {
        const token = localStorage.getItem('token')
        const name = localStorage.getItem('username')
        const role = localStorage.getItem('userRole')
        if (token && name) {
            info.value = { name, token, role: role || 'user' }
        }
    }

    // 立即初始化
    initUser()

    const login = async (name: string, pass: string) => {
        const loding = ElMessage({
            message: '正在登录...',
            type: 'info',
            duration: 0,
        })

        try {
            const params = new URLSearchParams()
            params.append('grant_type', '')
            params.append('username', name)
            params.append('password', pass)
            params.append('scope', '')
            params.append('client_id', '')
            params.append('client_secret', '')

            const res = await raw.POST('/auth/login', {
                body: params as any,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            } as any)

            if (res.response.status === 200) {
                const token = res.data?.access_token
                if (token) {
                    // 存储 token 和用户名
                    localStorage.setItem('token', token)
                    localStorage.setItem('username', name)

                    // 用 token 再请求 /auth/me 获取角色
                    const meRes = await raw.GET('/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    const role = meRes.data?.role || 'user'
                    console.log(role,'?/?')
                    localStorage.setItem('userRole', role)
                    info.value = { name, token, role }

                    loding.close()
                    ElMessage.success('登录成功！')

                    // 关键：打印调试
                    console.log('登录角色:', role);

                    // 根据角色跳转到不同页面
                    if (role === 'teacher') {
                        router.push('/teacher')
                    } else if(role === 'user') {
                        router.push('/UserInfo')
                    } else if(role === 'admin'){
                        router.push('/admin')
                    }

                    return true
                }
            } else if (res.response.status === 401) {
                loding.close()
                ElMessage.error('用户名或密码错误！')
                return false
            }

        } catch (error) {
            loding.close()
            const errorMsg = (error as Error)?.message || '登录失败'
            ElMessage.error(errorMsg)
            return false
        }
    }

    const logout = async () => {
        ElMessageBox.confirm(
            '您确定要退出登录么？',
            '退出登录',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            // 清除所有认证信息
            info.value = null
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('userRole')

            // 重定向到登录页
            router.push('/auth/login')
            ElMessage.success('退出登录成功！')
        }).catch(() => {
            // 取消退出
        })
    }

    const userInfo = async()=>{
        router.push('/userInfo')
    }

    const register = async (username: string, password: string) => {
        try {
                const res = await raw.POST('/users/register', {
                body: { username, password, role: 'user' },
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.response.status === 200) {
                ElMessage.success('注册成功，请登录！')
                router.replace('/login')
                return true
            } else {
                ElMessage.error('注册失败')
                return false
            }
        } catch (error) {
            const errorMsg = (error as Error)?.message || '注册失败'
            ElMessage.error(errorMsg)
            return false
        }
    }

    // 检查用户是否已认证
    const isAuthenticated = computed(() => !!info.value?.token)

    // 检查用户角色
    const isTeacher = computed(() => info.value?.role === 'teacher')
    const isUser = computed(() => info.value?.role === 'user')

    return {
        info,
        login,
        logout,
        userInfo,
        isAuthenticated,
        isTeacher,
        isUser,
        initUser,
        register
    }
})

export default useUser