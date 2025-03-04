export default defineComponent({
  name: "Example", //非强制，用于在DevTools里显示名称
  props: ["msg"], //由于Vue限制，必须手动声明所有的props名称
  setup(p: {
    msg: string  
  }) {
    //返回一个函数，函数返回JSX节点，一般这么写
    return () => (
      <>{p.msg}</>
    )
  }
})