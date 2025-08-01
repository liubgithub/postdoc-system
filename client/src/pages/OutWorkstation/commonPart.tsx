import { ElForm, ElFormItem, ElInput, ElDatePicker, ElButton, ElTable, ElTableColumn, ElRadioGroup, ElRadio, ElMessage } from 'element-plus'
import * as styles from '@/pages/userinfoRegister/styles.css'
import UserinfoRegister from '@/pages/EnterWorksation/form.tsx'
import Achievement from '../InWorkstation/coms/MidAssessment/achres_instation'
import Achievement_1 from './achres_1'
import Assessment from './assessment'

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
        const form = ref({
            achievement: {
                paper_title: '',
                journal_name: '',
                journal_type: '',
                first_author_unit: '',
                publish_time: '',
                paper_rank: '',
                project_title: '',
                fund_name: '',
                fund_amount: '',
                project_unit: '',
                approval_time: '',
                project_rank: '',
                patent_title: '',
                patent_type_number: '',
                patent_unit: '',
                patent_other: '',
                patent_apply_time: '',
                patent_rank: '',
                award_title: '',
                award_dept_level: '',
                award_other: '',
                award_other2: '',
                award_time: '',
                award_rank: ''
            }
        })
        const handleSubmit = async () => {
            // 提交form.value，包括form.value.achievement
            // await api.submitForm(form.value)
            ElMessage.success('提交成功！')
            props.onBack && props.onBack()
        }
        return () => (
            <div>
                <UserinfoRegister />
                {/* 科研成果表单 */}
                <Achievement />
                <Achievement_1 model={form.value.achievement} onUpdate:model={val => form.value.achievement = val} />
                {props.showAssessment ? <Assessment /> : null}
                {/* 按钮组 */}
                <div class={styles.btnGroup}>
                    <ElButton type="primary" onClick={handleSubmit}>提交</ElButton>
                </div>

            </div>
        )
    }
})