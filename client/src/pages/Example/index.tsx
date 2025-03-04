import store from "./store"

import Sub from "./coms/sub"

export default defineComponent({
  name: "Example", //非强制，用于在DevTools里显示名称
  setup() {
    //页面级store
    //统一简写为ps，永远使用px.xxx访问，不要解构
    const count = ref(0)
    const ps = reactive({
      count,
      msg: computed(() => `Count: ${count.value}`),
    })

    //提供页面级store给子组件
    provide(store, ps)

    //组件级state
    //统一简写为s，永远使用s.xxx访问，不要解构
    //储存JSX节点等复杂对象时要用shallowReactive
    const s = shallowReactive({
      extra: <button onClick={() => {
        console.log("+1")
        ps.count += 1
      }}>+1</button>,
    })
    setTimeout(() => {
      console.log("禁止修改")
      s.extra = <>禁止修改</>
    }, 5000)

    //返回一个渲染函数，函数返回JSX节点
    //一般简写为return () => (<></>)，比如下面这样
    //渲染函数会在其中调用的响应式变量变化时重新执行
    return () => (
      <>
        {console.log("主组件渲染函数执行！")}
        <Sub extra={s.extra} />
      </>
    )
  }
})