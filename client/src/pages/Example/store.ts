//定义页面级store的key和类型
//需要单独在一个文件中定义以支持DevTools
export default Symbol() as InjectionKey<{
    //使用TS定义类型
    count: number
    msg: string
}>