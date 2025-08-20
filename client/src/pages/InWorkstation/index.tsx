import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem } from 'element-plus'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import MidAssessment from './coms/MidAssessment/index'
import AnnualAssessment from './coms/AnnualAssessment/index'
import ExtensionAssessment from './coms/ExtensionAssessment'

const menuList = [
    { label: "中期考核", key: "midterm_assessment" },
    { label: "年终考核", key: "annual_assessment" },
    { label: "延期考核", key: "extension_assessment"}
]

export default defineComponent({
    name: "InWorkstation",
    setup() {
        const route = useRoute()
        const activeMenu = ref('midterm_assessment')
        
        // 根据路由查询参数设置默认激活的菜单
        const initActiveMenu = () => {
            const activeTab = route.query.activeTab as string
            if (activeTab && menuList.some(item => item.key === activeTab)) {
                activeMenu.value = activeTab
                console.log('根据路由参数设置激活菜单:', activeTab)
            }
        }
        
        const handleMenuClick = (key: string) => {
            console.log('菜单点击:', key)
            activeMenu.value = key
        }
        
        onMounted(() => {
            // 初始化激活菜单
            initActiveMenu()
        })
        
        return () => (
            <ElContainer>
                <ElAside width="15vw">
                    <ElMenu
                        defaultActive={activeMenu.value}
                        class="el-menu-vertical"
                        onSelect={handleMenuClick}
                    >
                        {menuList.map(item => (
                            <ElMenuItem 
                                key={item.key}
                                index={item.key}
                            >
                                {item.label}
                            </ElMenuItem>
                        ))}
                    </ElMenu>
                </ElAside>
                <ElMain>
                    {activeMenu.value === 'midterm_assessment' && <MidAssessment />}
                    {activeMenu.value === 'annual_assessment' && <AnnualAssessment />}
                    {activeMenu.value === 'extension_assessment' && <ExtensionAssessment />}
                </ElMain>
            </ElContainer>
        )
    }
})
