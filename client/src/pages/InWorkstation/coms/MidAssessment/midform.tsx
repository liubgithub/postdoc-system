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

        onMounted(async () => {
            try {
                const res = await fetch.raw.GET('/researchStatus/', { 
                    params: { query: { subType: '中期考核' } } 
                })
                const maybeData = (res as any)?.data ?? res
                const payload = maybeData?.Target ?? maybeData
                
                if (payload) {
                    if (payload.subNamePlan) form.subNamePlan = payload[0].subNamePlan
                    if (payload.subDescription) form.subDescription = payload[0].subDescription

                }
            } catch (error) {
                console.log(error)
            }
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
                {props.showAssessment ? <Assessment /> : null}
                {/* 按钮组 */}
                <div>
                    <ElButton onClick={handleSubmit}>提交</ElButton>
                    <ElButton onClick={handleBack}>返回</ElButton>
                </div>
            </div>
        )
    }
})