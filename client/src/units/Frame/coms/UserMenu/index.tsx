import { useRouter } from "vue-router"
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from "element-plus"
import { UserFilled } from "@element-plus/icons-vue"

import useUser from "@/stores/user"

import * as cls from "./styles.css"

export default defineComponent({
  name: "UserMenu",
  setup() {
    const router = useRouter()
    const s_user = useUser()

    return () => {
      if (s_user.info) {
        return (
          <ElDropdown>
            {{
              default: () => (
                <div class={cls.info}>
                  <ElIcon class={cls.info_icon}><UserFilled /></ElIcon>
                  <div>{s_user.info!.name}</div>
                </div>
              ),
              dropdown: () => (
                <ElDropdownMenu>
                  <ElDropdownItem onClick={s_user.userInfo}>个人中心</ElDropdownItem>
                  <ElDropdownItem onClick={s_user.logout}>退出登录</ElDropdownItem>
                </ElDropdownMenu>
              ),
            }}
          </ElDropdown>
        )
      } else {
        return (
          <div class={cls.btngroup}>
              <ElButton onClick={() => {router.push("/auth/login")}}>登录</ElButton>
              {/* <ElButton onClick={() => {router.push("/register")}}>注册</ElButton> */}
          </div>
        )
      }
    }
  }
})