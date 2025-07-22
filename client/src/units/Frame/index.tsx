import { RouterView } from "vue-router"
import { ElAside, ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem } from "element-plus"
import { images } from "@/styles/images"
import useFrame from "@/stores/frame"
import useUser from "@/stores/user"

import UserMenu from "./coms/UserMenu"
import * as cls from "./styles.css"

export default defineComponent({
  name: "Frame",
  setup() {
    const s_frame = useFrame()
    const userStore = useUser()

    const teacherMenuItems = [
      { label: '首页', path: '/teacher' },
      { label: '学生管理', path: '/teacher/students' },
      { label: '申请审核', path: '/teacher/applications' },
      { label: '成果管理', path: '/teacher/achievements' },
      { label: '考核管理', path: '/teacher/assessments' }
    ]

    const userMenuItems = [
      { label: '首页', path: '/' },
      { label: '个人信息', path: '/UserInfo' },
      { label: '进站申请', path: '/UserInfo/entry' },
      { label: '在站管理', path: '/UserInfo/in-station' },
      { label: '出站管理', path: '/UserInfo/out-station' }
    ]

    const currentMenuItems = computed(() => {
      return userStore.isTeacher ? teacherMenuItems : userMenuItems
    })

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
          <ElAside class={cls.aside} width="200px">
            <ElMenu
              defaultActive={window.location.pathname}
              router
              style="height: 100%; border-right: none;"
            >
              {currentMenuItems.value.map(item => (
                <ElMenuItem key={item.path} index={item.path}>
                  {item.label}
                </ElMenuItem>
              ))}
            </ElMenu>
          </ElAside>
          <ElMain class={cls.main}>
            <RouterView />
          </ElMain>
        </ElContainer>
      </ElContainer>
    )
  },
})