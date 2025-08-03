import { defineComponent } from "vue";
import UserinfoRegister from "./form.tsx";
import ResearchForm from "./researchForm";


export default defineComponent({
    name: "Application",
    props: {
        onSubmitSuccess: {
            type: Function,
            required: false
        },
        onBack:{
            type:Function,
            required:true
        }
    },
    setup(props) {
        return () => (
            <div>
                <h2>博士后进站申请</h2>
                <div style={{maxHeight: 'calc(100vh - 300px)' }}>
                    <h3>1. 基本信息</h3>
                    <UserinfoRegister />
                    <ResearchForm onBack={props.onBack} onSubmitSuccess={props.onSubmitSuccess}/>
                </div>
            </div>
        )
    }
})