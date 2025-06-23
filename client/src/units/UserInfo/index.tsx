import { defineComponent, ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption, ElRadioGroup, ElRadio, ElTable, ElTableColumn, ElDatePicker, ElMessage, ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem } from "element-plus";
import { useRouter, useRoute, RouterView } from "vue-router";
import * as styles from "./styles.css.ts";
import useUser from "@/stores/user"

const menuList = [
  { label: "个人情况", path: "/userinfo" },
  { label: "进站", path: "/entry" },
  { label: "在站", path: "/in-station" },
  { label: "出站", path: "/out-station" },
  { label: "出站后科研成果导出", path: "/export" }
];

export default defineComponent({
  name: "UserInfoLayout",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const s_user = useUser()
    const activeMenu = ref(route.path)

    const handleMenuClick = (path: string) => {
      router.push(path);
      activeMenu.value = path;
    };
    return () => (
      <ElContainer style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <ElHeader height="20vh" style={{ padding: 0, background: 'none' }}>
          <div class={styles.headerBar} style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div class={styles.welcome} style={{ color: '#222', fontSize: '1.5rem', fontWeight: 'normal', marginBottom: '12px' }}>
              博士后{s_user.info!.name}您好，欢迎使用华中农业大学园艺林学学院博士后信息管理系统
            </div>
            <ElMenu
              mode="horizontal"
              defaultActive={activeMenu.value}
              onSelect={handleMenuClick}
              style={{ justifyContent: 'center', background: 'transparent', borderBottom: 'none', marginTop: '0' }}
            >
              {menuList.map(item => (
                <ElMenuItem
                  index={item.path}
                  style={{ fontSize: '16px', padding: '0 32px', height: '48px', display: 'flex', alignItems: 'center' }}
                >
                  {item.label}
                </ElMenuItem>
              ))}
            </ElMenu>
          </div>
        </ElHeader>
          <div class={styles.contentArea}>
            <RouterView />
          </div>
      </ElContainer>
    );
  }
});