import { defineComponent } from "vue";
import UserinfoRegister from "../userinfoRegister/form";
import ResearchForm from "./researchForm";
import * as styles from "./styles.css.ts";

export default defineComponent({
    name: "Application",
    setup() {
        return () => (
            <div>
                <h2>博士后进站申请</h2>
                <div class={styles.container}>
                    <h3>1. 基本信息</h3>
                    <UserinfoRegister />
                    <ResearchForm />
                </div>
            </div>
        )
    }
})