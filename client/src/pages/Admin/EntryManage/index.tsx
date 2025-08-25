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
      { label: '进站申请', key: 'Application' },
      { label: '进站考核', key: 'Assessment' },
    ];

    // 根据当前路由确定菜单高亮
    const getActiveMenu = () => {
      const currentPath = route.path;
      if (currentPath.includes('/Application')) {
        return 'Application';
      } else if (currentPath.includes('/Assessment')) {
        return 'Assessment';
      }
      return 'Application'; // 默认高亮进站申请
    };

    const activeMenu = ref(getActiveMenu());

    // 监听路由变化更新activeMenu
    watch(() => route.path, () => {
      activeMenu.value = getActiveMenu();
    });

    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
      if (key === 'Assessment') {
        router.push('/admin/entryManage/Assessment');
      } else if (key === 'Application') {
        router.push('/admin/entryManage/Application');
      }
    };

    return () => (
      <ElContainer>
        <ElAside width="15vw">
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
        <ElMain>
          {/* 子路由内容渲染区域 */}
          <router-view />
        </ElMain>
      </ElContainer>
    );
  },
});
