import { RouterView } from "vue-router"
import { ElAside, ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem, ElSubMenu } from "element-plus"

import useFrame from "@/stores/frame"
import useUser from "@/stores/user"
import Footer from "@/pages/Home/coms/Footer"
import UserMenu from "./coms/UserMenu"
import * as cls from "./styles.css"

export default defineComponent({
  name: "Frame",
  setup() {
    const s_frame = useFrame()
    const userStore = useUser()

    const img = `${import.meta.env.BASE_URL}logos/天空蓝.png`
    const menuList = [
      { label: '首页', path: '/' },
      {
        label: '流动站',
        children: [
          { label: '流动站介绍', },
          { label: '流动站列表', },
          { label: '流动站申请', },
          { label: '流动站管理', }
        ]
      },
      {
        label: '规章制度',
        children: [
          { label: '国家文件', },
          { label: '地方文件', },
          { label: '校内文件', },
        ]
      },
      { label: '项目申报', },
      {
        label: '进出站',
        children: [
          { label: '进站', },
          { label: '出站', },
        ]
      },
      {
        label: '在站管理',
        children: [
          { label: '考核', },
          { label: '退站', },
        ]
      },
      { label: '招聘信息', },
      { label: '联系我们', },
    ]
    return () => (
      <ElContainer class={cls.frame}>
        <ElHeader class={cls.header}>
          <div class={cls.image}>
            <img src={img} style={{ width: '296px', height: '71px' }} alt="logo" />
          </div>
          <div class={cls.header_left}>
            <div class={cls.header_left_title}>{s_frame.title}</div>
          </div>
          <div class={cls.header_right}>
            <UserMenu />
          </div>
        </ElHeader>

        <ElMain class={cls.main}>
          <ElMenu
            mode="horizontal"
            class={cls.horizontalMenu}
            defaultActive={window.location.pathname}
            router
          >
            {menuList.map((item, index) => {
              if (item.children) {
                return (
                  <ElSubMenu key={index} index={item.label}>
                    {{
                      title: () => item.label,
                      default: () => item.children?.map((child, childIndex) => (
                        <ElMenuItem key={childIndex}>
                          {child.label}
                        </ElMenuItem>
                      ))
                    }}
                  </ElSubMenu>
                )
              } else {
                return (
                  <ElMenuItem key={index} index={item.path}>
                    {item.label}
                  </ElMenuItem>
                )
              }
            })}
          </ElMenu>
          <div>
            <RouterView />
          </div>
          <div>
            <Footer />
          </div>
        </ElMain>
      </ElContainer>
    )
  },
})