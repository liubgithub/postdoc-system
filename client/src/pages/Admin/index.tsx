import { useRouter, useRoute, RouterView } from "vue-router";
import { ElContainer, ElHeader, ElMain,ElMenu, ElMenuItem} from "element-plus";
import * as styles from '@/pages/UserInfo/styles.css'
import useUser from "@/stores/user"
const menuList = [
    { label: "后台首页", path: "/admin/adminHome" },
    { label: "进站管理", path: "/admin/entryManage" },
    { label: "权限分配", path: "" },
    { label: "信息发布", path: "" },
    { label: "数据统计", path: "" },
    { label: "在站管理", path: "" },
    { label: "出站管理", path: "" },
    { label: "账号审批", path: "/admin/accountApproval" },
    { label: "合作导师账号分配", path: "" },
    { label: "科研成果管理", path: "" },
  ];
export default defineComponent({
    name: "AdminPage",
    setup() {
        const router = useRouter();
        const route = useRoute();
        const s_user = useUser()
        const activeMenu = ref(route.path)
    
        const handleMenuClick = (path: string) => {
          console.log(path, 'path')
          router.push(path);
          activeMenu.value = path;
        };
        return () => (
            <ElContainer style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <ElHeader style={{
                height: '20vh',
                flexShrink: 0,
                padding: 0,
                background: 'none'
              }}>
                <div class={styles.headerBar} style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div class={styles.welcome} style={{ color: '#fff', fontSize: '2rem', fontWeight: 'normal', marginBottom: '12px' }}>
                    管理员{s_user.info!.name}您好，欢迎使用华中农业大学园艺林学学院博士后信息管理系统
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
                        style={{ fontSize: '16px', padding: '0 32px', height: '48px', display: 'flex', alignItems: 'center', color: '#fff' }}
                      >
                        {item.label}
                      </ElMenuItem>
                    ))}
                  </ElMenu>
                </div>
              </ElHeader>
              <div style={{ flex: 1, overflow: 'auto' }}>
                <RouterView />
              </div>
            </ElContainer>
          );
    }
})