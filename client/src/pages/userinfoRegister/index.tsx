import { defineComponent, ref } from "vue";
import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem } from "element-plus";
import * as styles from "./styles.css.ts";
import UserInfoForm from "./form";
import PreEntryAchievementMain from "./pre_entry_achievement/main";

const menuList = [
  { label: "个人信息登记", key: "userinfo" },
  { label: "入站前已有成果登记", key: "preEntryAchievements" },
];

export default defineComponent({
  name: "userinfoRegister",
  setup() {
    const activeMenu = ref("userinfo");

    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
    };

    return () => (
      <ElContainer style={{ minHeight: '100vh', background: '#f5f7fa', overflowY: 'auto', }}>
        <ElAside width="15vw">
          <ElMenu
            defaultActive={activeMenu.value}
            class="el-menu-vertical"
            onSelect={handleMenuClick}
          >
            {menuList.map(item => (
              <ElMenuItem index={item.key}>
                {item.label}
              </ElMenuItem>
            ))}
          </ElMenu>
        </ElAside>
        <ElMain style={{ overflowY: 'auto', margin: 0, padding: 0 }}>
            {activeMenu.value === "userinfo" && <UserInfoForm />}
            {activeMenu.value === "preEntryAchievements" && <PreEntryAchievementMain />}
        </ElMain>
      </ElContainer>
    );
  }
});