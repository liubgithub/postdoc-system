import { defineComponent, ref, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';
import {
  ElContainer,
  ElAside,
  ElMenu,
  ElMenuItem,
  ElMain,
} from "element-plus";
import * as styles from "./styles.css.ts";

export default defineComponent({
  name: "AdminEntryManagePage",
  setup() {
    const router = useRouter();
    const route = useRoute();

    const menuList = [
      { label: '进站申请', key: 'approval' },
      { label: '进站考核', key: 'check-detail' },
    ];

    // 根据当前路由确定菜单高亮
    const getActiveMenu = () => {
      const currentPath = route.path;
      if (currentPath.includes('/approval')) {
        return 'approval';
      } else if (currentPath.includes('/check-detail')) {
        return 'check-detail';
      }
      return 'approval'; // 默认高亮进站申请
    };

    const activeMenu = ref(getActiveMenu());

    // 监听路由变化更新activeMenu
    watch(() => route.path, () => {
      activeMenu.value = getActiveMenu();
    });

    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
      if (key === 'check-detail') {
        router.push('/admin/entryManage/check-detail');
      } else if (key === 'approval') {
        router.push('/admin/entryManage/approval');
      }
    };

    return () => (
      <ElContainer style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
        <ElContainer style={{ position: 'relative', flex: 1, height: '0' }}>
          <ElAside width="200px" style={{ background: '#fff', height: '100%', borderRight: '1px solid #e4e7ed' }}>
            <ElMenu
              defaultActive={activeMenu.value}
              class={styles.sidebarMenu}
              onSelect={handleMenuClick}
            >
              {menuList.map(item => (
                <ElMenuItem
                  index={item.key}
                  class={activeMenu.value === item.key ? styles.sidebarMenuItemActive : styles.sidebarMenuItem}
                >
                  {item.label}
                </ElMenuItem>
              ))}
            </ElMenu>
          </ElAside>
          <ElMain style={{ padding: '20px', background: '#f5f7fa' }}>
            {/* 子路由内容渲染区域 */}
            <router-view />
          </ElMain>
        </ElContainer>
      </ElContainer>
    );
  },
});
