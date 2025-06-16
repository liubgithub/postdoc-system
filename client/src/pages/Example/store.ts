//定义页面级store的key和类型
//需要单独在一个文件中定义以支持DevTools
const _init = () => {
    const count = ref(0)
    const ps = reactive({
        count,
        msg: computed(() => `Count: ${count.value}`),
    })
    return ps
}
const _symbol = Symbol() as InjectionKey<ReturnType<typeof _init>>
export const useProvideStore = () => {
    const ps = _init()
    provide(_symbol, ps)
    return ps
}
export const usePageStore = () => {
    return inject(_symbol)!
}