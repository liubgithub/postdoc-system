import { ElButton } from 'element-plus'
import UserinfoRegister from '@/pages/EnterWorksation/form.tsx'
import Achievement from './achres_instation'
import Achievement_1 from './achres_1'
import Assessment from './assessment'
import fetch from "@/api/index"
import { reactive, onMounted } from 'vue'

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
        const form = reactive<{ subNamePlan: string; subDescription: string; subType: string } >({
            subNamePlan: '',
            subDescription: '',
            subType: '中期考核',
        })

        
        const handleSubmit = async () => {
            console.log(form, 'sss1')
            try {
                const res = await fetch.raw.POST('/researchStatus/', { body: form })
            } catch (error) {
                console.log(error)
            }
        }
        const handleBack = () => {
            props.onBack && props.onBack()
        }
        return () => (
            <div>
                <UserinfoRegister showResult={false} />
                {/* 科研成果表单 */}
                <Achievement />
                <Achievement_1 model={form} onUpdate:model={val => Object.assign(form, val)} />
                {props.showAssessment ? <Assessment showButtons={!props.showAssessment} /> : null}
                {/* 按钮组 */}
                <div style={{display:'flex',justifyContent:'center',gap:'2rem'}}>
                    <ElButton type='primary' onClick={handleSubmit}>提交</ElButton>
                    <ElButton onClick={handleBack}>返回</ElButton>
                </div>
            </div>
        )
    }
})