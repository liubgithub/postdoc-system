import { defineComponent, ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from "element-plus"
import useUser from "@/stores/user"
import * as styles from './style.css'
import loginBg from './images/loginbg.png'

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

    // 如果用户已登录，重定向到首页
    onMounted(() => {
      if (s_user.isAuthenticated) {
        router.replace('/')
      }
    })

    const rules = {
      name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    }

    const handleLogin = async () => {
      const valid = await formRef.value?.validate()
      
      if (valid) {
        const success = await s_user.login(form.name, form.pass)
        
        // 只有在登录成功后才跳转
        if (success) {
          // 尝试获取重定向路径
          const redirect = router.currentRoute.value.query.redirect
          
          // 跳转到目标页面或首页
          router.replace(redirect ? decodeURIComponent(redirect as string) : '/UserInfo')
        }
      } else {
        ElMessage.error('请填写完整的登录信息')
      }
    }

    return () => (
      <div class={styles.loginPage}>
        <div class={styles.leftSection}>
          <img src={loginBg} alt="Login Background" class={styles.leftImage} />
        </div>
        <div class={styles.loginForm}>
          <h2 class={styles.title}>登录</h2>
          <ElForm ref={formRef} model={form} rules={rules} labelPosition="top">
            <ElFormItem label="用户名" prop="name">
              <ElInput 
                v-model={form.name} 
                placeholder="请输入用户名"
                onKeydown={(e:any) => e.key === 'Enter' && handleLogin()}
              />
            </ElFormItem>
            <ElFormItem label="密码" prop="pass">
              <ElInput
                v-model={form.pass}
                placeholder="请输入密码"
                show-password
                type="password"
                onKeydown={(e:any) => e.key === 'Enter' && handleLogin()}
              />
            </ElFormItem>
            <ElFormItem>
              <ElButton 
                type="primary" 
                onClick={handleLogin} 
                class={styles.submitButton}
              >
                登录
              </ElButton>
            </ElFormItem>
          </ElForm>
          
          <div class={styles.registerLink}>
            <router-link to="/register">没有账号？立即注册</router-link>
          </div>
        </div>
      </div>
    )
  }
})