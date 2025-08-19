import AdminHeader from "./adminHeader";
import { ElContainer,ElHeader,ElMain } from "element-plus";
export default defineComponent({
    name: "AdminPage",
    setup() {
        return () => (
            <ElContainer style={{minHeight:'100vh'}}>
                <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
                    <AdminHeader />
                </ElHeader>
            </ElContainer>
        )
    }
})