import { defineStore } from 'pinia'

const useFrame = defineStore("frame", () => {
    const title = ref("博士后")
    return {
        title,
    }
})
export default useFrame