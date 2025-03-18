import { defineStore } from 'pinia'

const useUser = defineStore("user", () => {
    const info = ref<{
        name: string
        token: string
    }>()
    const login = async () => {
        info.value = {
            name: "Test",
            token: "Test",
        }
    }
    const logout = async () => {
        info.value = undefined
    }
    return {
        info,
        login,
        logout,
    }
})
export default useUser