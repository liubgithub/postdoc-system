import { useRouter } from "vue-router"
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from "element-plus"

import useUser from "@/stores/user"

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter()
    const s_user = useUser()

    const formRef = ref<InstanceType<typeof ElForm>>()
    const form = reactive({
      name: '',
      pass: '',
    })

    const rules = {
      name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    }

    const handleLogin = () => {
      formRef.value?.validate(async (valid) => {
        if (valid) {
          await s_user.login(form.name)
          router.push("/")
        } else {
          ElMessage.error('请填写完整的登录信息')
        }
      })
    }

    return () => (
      <div style={{
        width: '400px',
        margin: '100px auto',
        padding: '40px',
        border: '1px solid #e4e7ed',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>登录</h2>
        <ElForm ref={formRef} model={form} rules={rules} labelPosition="top">
          <ElFormItem label="用户名" prop="name">
            <ElInput v-model={form.name} placeholder="请输入用户名" />
          </ElFormItem>
          <ElFormItem label="密码" prop="pass">
            <ElInput
              v-model={form.pass}
              placeholder="请输入密码"
              show-password
              type="password"
            />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" onClick={handleLogin} style={{ width: '100%' }}>
              登录
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    )
  }
})