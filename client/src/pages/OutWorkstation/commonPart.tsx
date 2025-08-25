import { ElForm, ElFormItem, ElInput, ElDatePicker, ElButton, ElTable, ElTableColumn, ElRadioGroup, ElRadio, ElMessage } from 'element-plus'
import * as styles from '@/pages/userinfoRegister/styles.css'
import UserinfoRegister from '@/pages/EnterWorksation/form.tsx'
import Achievement from '../InWorkstation/coms/MidAssessment/achres_instation'
import Achievement_1 from './achres_1'
import Assessment from './assessment'
import fetch from '@/api/index'
export default defineComponent({
    name: "CommonPart",
    props: {
        onBack: {
            type: Function,
            required: true
        },
        showAssessment: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const form = reactive<{ subNamePlan: string; subDescription: string; subType: string } >({
            subNamePlan: '',
            subDescription: '',
            subType: '出站考核',
        })
        const handleSubmit = async () => {
            try {
                const res = await fetch.raw.POST('/researchStatus/', { body: form })
            } catch (error) {
                console.log(error)
            }
            ElMessage.success('提交成功！')
            props.onBack && props.onBack()
        }
        const handleBack = () =>{
            props.onBack && props.onBack()
        }
        return () => (
            <div>
                <UserinfoRegister showResult={false}/>
                {/* 科研成果表单 */}
                <Achievement />
                <Achievement_1 model={form} onUpdate:model={val => Object.assign(form, val)} />
                {props.showAssessment ? <Assessment /> : null}
                {/* 按钮组 */}
                <div class={styles.btnGroup}>
                    <ElButton type="primary" onClick={handleSubmit}>提交</ElButton>
                    <ElButton onClick={handleBack}>返回</ElButton>
                </div>

            </div>
        )
    }
})