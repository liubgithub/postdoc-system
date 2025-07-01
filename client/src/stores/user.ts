import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import fetch from '@/api/index'
import router from '@/router' // 导入路由实例

const useUser = defineStore("user", () => {
    const info = ref<{
        name: string
        token: string
    } | null>(null)

    // 初始化时检查 localStorage 中的 token
    const initUser = () => {
        const token = localStorage.getItem('token')
        const name = localStorage.getItem('username')
        if (token && name) {
            info.value = { name, token }
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
            const formData = {
                grant_type: '',
                username: name,
                password: pass,
                scope: '',
                client_id: '',
                client_secret: '',
            }

            const res = await fetch.raw.POST('/auth/login', {
                body: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            })

            if (res.response.status === 200) {
                console.log(res.data,'res.data')
                const token = res.data?.access_token

                if (token) {
                    // 存储 token 和用户名
                    // localStorage.setItem('token', token)
                    // localStorage.setItem('username', name)
                    info.value = { name, token }

                    loding.close()
                    ElMessage.success('登录成功！')

                    // 返回登录成功标志
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
            const res = await fetch.raw.POST('/users/register', {
                body: { username, password },
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

    return {
        info,
        login,
        logout,
        userInfo,
        isAuthenticated,
        initUser,
        register
    }
})

export default useUser