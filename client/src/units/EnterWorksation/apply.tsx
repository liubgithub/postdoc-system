import { defineComponent } from "vue";
import UserinfoRegister from "../userinfoRegister/form";
import ResearchForm from "./researchForm";
import * as styles from "./styles.css.ts";

export default defineComponent({
    name: "Application",
    props: {
        onSubmitSuccess: {
            type: Function,
            required: false
        }
    },
    setup(props) {
        return () => (
            <div>
                <h2>博士后进站申请</h2>
                <div class={styles.container} style={{maxHeight: 'calc(100vh - 300px)' }}>
                    <h3>1. 基本信息</h3>
                    <UserinfoRegister />
                    <ResearchForm onSubmitSuccess={props.onSubmitSuccess}/>
                </div>
            </div>
        )
    }
})