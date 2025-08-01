import { ElForm, ElButton } from 'element-plus'
import UserinfoRegister from '@/pages/EnterWorksation/form.tsx'
import Achievement from './achres_instation'
import Achievement_1 from './achres_1'
import Assessment from './assessment'

export default defineComponent({
    name: "MidForm",
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
        const handleSubmit = () => {

        }
        return () => (
            <div>
                <UserinfoRegister />
                {/* 科研成果表单 */}
                <Achievement />
                <Achievement_1 model={form.value.achievement} onUpdate:model={val => form.value.achievement = val} />
                {props.showAssessment ? <Assessment /> : null}
                {/* 按钮组 */}

            </div>
        )
    }
})