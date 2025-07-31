import { defineComponent } from 'vue';
import { ElMenu, ElMenuItem } from 'element-plus';
import * as styles from '../UserInfo/styles.css.ts';
import useUser from '@/stores/user';
import { useRouter } from "vue-router";

const menuList = [
  { label: "进站管理", path: "/teacher/entryManage" },
  { label: "在站管理", path: "/teacher/inManage" },
  { label: "出站管理", path: "/teacher/outCheck" },
  { label: "账号审批", path: "/teacher/accountApproval" },
];

export default defineComponent({
  name: 'TeacherHeader',
  setup() {
    const userStore = useUser();
    const router = useRouter();
    const handleMenuClick = (path: string) => {
      router.push(path);
    };
    return () => (
      <div class={styles.headerBar} style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div class={styles.welcome} style={{ color: '#fff', fontSize: '2rem', fontWeight: 'normal', marginBottom: '12px' }}>
          {userStore.info?.name}老师您好，欢迎使用华中农业大学园艺林学学院博士后信息管理系统
        </div>
        <ElMenu
          mode="horizontal"
          onSelect={handleMenuClick}
          style={{ justifyContent: 'center', background: 'transparent', borderBottom: 'none', marginTop: '0' }}
        >
          {menuList.map(item => (
            <ElMenuItem
              index={item.path}
              style={{ fontSize: '16px', padding: '0 32px', height: '48px', display: 'flex', alignItems: 'center',color: '#fff' }}
            >
              {item.label}
            </ElMenuItem>
          ))}
        </ElMenu>
      </div>
    );
  }
}); 