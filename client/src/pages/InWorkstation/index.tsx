import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem } from 'element-plus'
import MidAssessment from './coms/MidAssessment/index'
import AnnualAssessment from './coms/AnnualAssessment/index'
const menuList = [
    { label: "进站后成果登记", key: "registration" },
    { label: "中期考核", key: "midterm" },
    { label: "年终考核", key: "annual" },
]

export default defineComponent({
    name: "InWorkstation",
    setup() {
        const activeMenu = ref('registration')
        const handleMenuClick = (key: string) => {
            activeMenu.value = key
        }
        return () => (
            <ElContainer>
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
                <ElMain>
                    {activeMenu.value === 'midterm' && <MidAssessment />}
                    {activeMenu.value === 'annual' && <AnnualAssessment />}
                </ElMain>
            </ElContainer>
        )
    }
})
