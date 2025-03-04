import store from "../store"

export default defineComponent({
  name: "Sub", //非强制，用于在DevTools里显示名称
  props: ["extra"], //由于Vue限制，必须手动声明所有的props名称
  setup(p: {
    //props类型定义
    //统一简写为p，永远使用p.xxx访问，不要解构
    //JSX可以直接传节点、组件、函数，一般不要使用emits、slots
    extra?: JSX.Element
  }) {
    //获取页面级store，感叹号表示不考虑获取不到的情况
    //统一简写为ps，永远使用px.xxx访问，不要解构
    const ps = inject(store)!

    //使用computed并返回一个JSX节点，是需要优化时的常用手段
    //则可以使得当且仅当computed内使用的响应式变量变化时才重新生成返回的节点
    //而不是和本组件渲染函数一起每次重新生成
    //本示例中可以看到，禁止修改后，本节点并未重新生成
    const x3 = computed(() => {
      console.log("computed节点重新生成！")
      return <p>Count x3: {ps.count * 3}</p>
    })

    //返回一个渲染函数，函数返回JSX节点
    //一般简写为return () => (<></>)
    //使用大括号来声明可以编写更复杂的逻辑
    //渲染函数会在其中调用的响应式变量变化时重新执行
    return () => {
      console.log("子组件渲染函数执行！")
      //由于ps.count变化时会重新执行，不需要写computed
      const c2 = ps.count * 2
      return (
        <>
          {p.extra}<br />
          {ps.msg}<br />
          <p>Count x2: {c2}</p>
          {/* 大括号里这样写注释，也可以像下一行那样直接显示一个JSX节点 */}
          {x3.value}
        </>
      )
    }
  }
})