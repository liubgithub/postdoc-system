import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem } from 'element-plus'
import MidAssessment from './coms/MidAssessment/index'
import AnnualAssessment from './coms/AnnualAssessment/index'
import ExtensionAssessment from './coms/ExtensionAssessment'
const menuList = [
    { label: "中期考核", key: "midterm" },
    { label: "年终考核", key: "annual" },
    { label: "延期考核", key: "extension"}
]

export default defineComponent({
    name: "InWorkstation",
    setup() {
        const activeMenu = ref('midterm')
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
                    {activeMenu.value === 'extension' && <ExtensionAssessment />}
                </ElMain>
            </ElContainer>
        )
    }
})
