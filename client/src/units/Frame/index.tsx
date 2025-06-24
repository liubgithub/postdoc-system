import { RouterView } from "vue-router"
import { ElAside, ElContainer, ElHeader, ElMain } from "element-plus"
import { images } from "@/styles/images"
import useFrame from "@/stores/frame"

import UserMenu from "./coms/UserMenu"
import * as cls from "./styles.css"

export default defineComponent({
  name: "Frame",
  setup() {
    const s_frame = useFrame()

    return () => (
      <ElContainer class={cls.frame}>
        <ElHeader class={cls.header}>
          <div class={cls.image}>
            <img src={images.LOGO} alt="logo" />
          </div>
          <div class={cls.header_left}>
            <div class={cls.header_left_title}>{s_frame.title}</div>
          </div>
          <div class={cls.header_right}>
            <UserMenu/>
          </div>
        </ElHeader>
        <ElContainer>
          {/* <ElAside class={cls.aside}>
            Aside
          </ElAside> */}
          <ElMain class={cls.main}>
            <RouterView />
          </ElMain>
        </ElContainer>
      </ElContainer>
    )
  },
})