import { defineComponent, ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage, ElSelect, ElOption, ElDatePicker } from "element-plus"
import * as styles from '../Login/style.css'
import loginBg from '../Login/images/loginbg.png'
import useUser from '@/stores/user'

export default defineComponent({
    name: "Signin",
    setup() {
        const router = useRouter()
        const formRef = ref()
        const form = reactive({
            username: '',
            password: '',
            confirmPassword: '',
            realname: '',
            country: '',
            birthday: '',
            phone: '',
            email: '',
            phoneCode: '',
            emailCode: '',
            code: '',
        })
        const sendingPhoneCode = ref(false)
        const sendingEmailCode = ref(false)
        const phoneCodeSent = ref(false)
        const emailCodeSent = ref(false)
        const phoneCountdown = ref(0)
        const emailCountdown = ref(0)
        let phoneTimer: any = null
        let emailTimer: any = null
        const userStore = useUser()

        const rules = {
            username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
            password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
            confirmPassword: [
                { required: true, message: '请再次输入密码', trigger: 'blur' },
                {
                    validator: (rule: any, value: string, callback: any) => {
                        if (value !== form.password) {
                            callback(new Error('两次输入的密码不一致'))
                        } else {
                            callback()
                        }
                    }, trigger: 'blur'
                }
            ],
            realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
            country: [{ required: true, message: '请输入国别（地区）', trigger: 'blur' }],
            birthday: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
            phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
            email: [{ required: true, message: '请输入电子邮件', trigger: 'blur' }],
            code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        }

        const sendPhoneCode = () => {
            if (!/^1[3-9]\d{9}$/.test(form.phone)) {
                ElMessage.error('请输入正确的手机号码')
                return
            }
            sendingPhoneCode.value = true
            phoneCodeSent.value = true
            phoneCountdown.value = 60
            phoneTimer = setInterval(() => {
                phoneCountdown.value--
                if (phoneCountdown.value <= 0) {
                    clearInterval(phoneTimer)
                    sendingPhoneCode.value = false
                }
            }, 1000)
            // TODO: 调用后端接口发送验证码
            ElMessage.success('验证码已发送')
        }

        const sendEmailCode = () => {
            if (!/^\S+@\S+\.\S+$/.test(form.email)) {
                ElMessage.error('请输入正确的电子邮件')
                return
            }
            sendingEmailCode.value = true
            emailCodeSent.value = true
            emailCountdown.value = 60
            emailTimer = setInterval(() => {
                emailCountdown.value--
                if (emailCountdown.value <= 0) {
                    clearInterval(emailTimer)
                    sendingEmailCode.value = false
                }
            }, 1000)
            // TODO: 调用后端接口发送验证码
            ElMessage.success('验证码已发送')
        }

        const handleRegister = async () => {
            const valid = await formRef.value?.validate()
            if (!valid) {
                ElMessage.error('请填写完整的注册信息')
                return
            }
            // 只传username和password
            const success = await userStore.register(form.username, form.password)
            // 成功与否的提示已在store中处理
        }

        const handleBack = () => {
            router.back()
        }

        return () => (
            <div class={styles.loginPage}>
                <div class={styles.leftSection}>
                    <img src={loginBg} alt="Login Background" class={styles.leftImage} />
                </div>
                <div class={styles.loginForm}>
                    <h2 class={styles.title}>用户注册</h2>
                    <ElForm ref={formRef} model={form} rules={rules} labelPosition="left" labelWidth="110px">
                        <ElFormItem label="登录账号" prop="username">
                            <ElInput v-model={form.username} placeholder="请输入登录账号" style={{ width: '100%' }} />
                        </ElFormItem>
                        <ElFormItem label="登录密码" prop="password">
                            <ElInput v-model={form.password} type="password" show-password placeholder="请输入登录密码" style={{ width: '100%' }} />
                        </ElFormItem>
                        <ElFormItem label="重复密码" prop="confirmPassword">
                            <ElInput v-model={form.confirmPassword} type="password" show-password placeholder="请再次输入密码" style={{ width: '100%' }} />
                        </ElFormItem>
                        <ElFormItem label="姓名" prop="realname">
                            <ElInput v-model={form.realname} placeholder="请输入姓名" style={{ width: '100%' }} />
                        </ElFormItem>
                        <ElFormItem label="国别（地区）" prop="country">
                            <ElInput v-model={form.country} placeholder="请输入国别（地区）" style={{ width: '100%' }} />
                        </ElFormItem>
                        <ElFormItem label="出生日期" prop="birthday">
                            <ElDatePicker v-model={form.birthday} type="date" placeholder="请选择出生日期" style={{ width: '100%' }} />
                        </ElFormItem>
                        <ElFormItem label="手机号码" prop="phone">
                            <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
                                <ElInput v-model={form.phone} placeholder="请输入手机号码" style={{ flex: 1 }} />
                                <ElButton
                                    type="primary"
                                    onClick={sendPhoneCode}
                                    disabled={sendingPhoneCode.value || !/^1[3-9]\d{9}$/.test(form.phone)}
                                >
                                    {sendingPhoneCode.value ? `${phoneCountdown.value}s后重发` : '发送验证码'}
                                </ElButton>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="电子邮件" prop="email">
                            <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
                                <ElInput v-model={form.email} placeholder="请输入电子邮件" style={{ flex: 1 }} />
                                <ElButton
                                    type="primary"
                                    onClick={sendEmailCode}
                                    disabled={sendingEmailCode.value || !/^\S+@\S+\.\S+$/.test(form.email)}
                                >
                                    {sendingEmailCode.value ? `${emailCountdown.value}s后重发` : '发送验证码'}
                                </ElButton>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="验证码" prop="code">
                            <ElInput v-model={form.code} placeholder="请输入验证码" style={{ width: '100%' }} />
                        </ElFormItem>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <ElButton type="primary" onClick={handleRegister} class={styles.submitButton}>注册</ElButton>
                            <ElButton style={{ marginLeft: '0px' }} onClick={handleBack} class={styles.submitButton}>返回</ElButton>
                        </div>
                    </ElForm>
                </div>
            </div>
        )
    }
})
