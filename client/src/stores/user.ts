import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'

const useUser = defineStore("user", () => {
    const info = ref<{
        name: string
        token: string
    }>()
    const login = async (name: string) => {
        return new Promise<void>((resolve) => {
            const loding = ElMessage({
                message: '正在登录...',
                type: 'info',
                duration: 0,
              })
            setTimeout(() => {
                info.value = {
                    name,
                    token: "Test",
                }
                loding.close()
                ElMessage.success('登录成功！')
                resolve()
            }, 2000)
        })
    }
    const logout = async () => {
        ElMessageBox.confirm(
            '您确定要退出登录么？',
            '退出登录',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        ).then(() => {
            info.value = undefined
            ElMessage.success('退出登录成功！')
        }).catch()
    }
    return {
        info,
        login,
        logout,
    }
})
export default useUser