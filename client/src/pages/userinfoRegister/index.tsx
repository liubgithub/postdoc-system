import { defineComponent } from "vue";
import { ElContainer, ElMain } from "element-plus";
import UserInfoForm from "./basicInformationTable.tsx";


export default defineComponent({
  name: "userinfoRegister",
  setup() {
    return () => (
      <ElContainer style={{ minHeight: '100vh', background: '#f5f7fa', overflowY: 'auto' }}>
        <UserInfoForm />
      </ElContainer>
    );
  }
});