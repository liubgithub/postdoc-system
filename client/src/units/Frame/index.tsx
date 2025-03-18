import { RouterView } from "vue-router"
import { ElAside, ElContainer, ElHeader, ElMain } from "element-plus"

import * as cls from "./styles.css"

export default defineComponent({
  name: "Frame",
  setup() {
    return () => (
      <ElContainer class={cls.frame}>
        <ElHeader class={cls.header}>
          Header
        </ElHeader>
        <ElContainer>
          <ElAside class={cls.aside}>
            Aside
          </ElAside>
          <ElMain>
            <RouterView />
          </ElMain>
        </ElContainer>
      </ElContainer>
    )
  },
})