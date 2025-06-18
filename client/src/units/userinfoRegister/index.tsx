import { defineComponent, ref } from "vue";
import * as styles from "./styles.css.ts";
import UserInfoForm from "./form";

const menuList = [
  { label: "个人信息登记", key: "userinfo" },
  { label: "入站前已有成果登记", key: "preEntryAchievements" },
];

export default defineComponent({
  name: "userinfoRegister",
  setup() {
    const activeMenu = ref("userinfo");

    return () => (
      <div class={styles.container}>
        {/* 左侧菜单栏 */}
        <div class={styles.sidebar}>
          {menuList.map(item => (
            <button
              class={[styles.menuBtn, activeMenu.value === item.key ? styles.menuBtnActive : ""]}
              onClick={() => (activeMenu.value = item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* 右侧表单内容 */}
        <div class={styles.main}>
          {activeMenu.value === "userinfo" && <UserInfoForm />}
        </div>
      </div>
    );
  }
});