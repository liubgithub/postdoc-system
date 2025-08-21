import { ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadio, ElButton, ElSelect, ElOption } from "element-plus"
import * as styles from "@/pages/userinfoRegister/styles.css"


export default defineComponent({
    name: 'cototurInfor',
    props:{
        onBack:{
            type:Function,
            required:true
        }
    },
    setup(props) {
        const form = ref({
            name: "",
            gender: "",
            birth_year: "",
            nationality: "",
            political_status: "",
            phone: "",
            work_id: "",
            unit: "",
            ID_card: "",
            email: "",
            college: "",
            title_position: "",
            res_direction: ""
        })

        // 表单校验规则
        const rules = {
            name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
            gender: [{ required: true, message: "请选择性别", trigger: "change" }],
            birth_year: [
                { required: true, message: "请输入出生年", trigger: "blur" },
            ],
        };
        const handleAdd = ()=>{

        }
        const handleCancel = ()=>{
            props.onBack && props.onBack()
        }
        return () => (
            <div class={styles.formWrappers}>
                <div class={styles.formTitle}>
                    基本信息表
                </div>
                <ElForm model={form.value} rules={rules} labelWidth="100px">
                    {/* 基本信息两列 */}
                    <div class={styles.formRow}>
                        <div class={styles.formCol}>
                            <ElFormItem label="姓名" prop="name">
                                <ElInput v-model={form.value.name} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="性别" prop="gender">
                                <ElRadioGroup v-model={form.value.gender}>
                                    <ElRadio value="男">男</ElRadio>
                                    <ElRadio value="女">女</ElRadio>
                                </ElRadioGroup>
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="出生年" prop="birth_year">
                                <ElInput v-model={form.value.birth_year} />
                            </ElFormItem>
                        </div>
                    </div>
                    <div class={styles.formRow}>
                        <div class={styles.formCol}>
                            <ElFormItem label="国籍">
                                <ElInput v-model={form.value.nationality} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="政治面貌">
                                <ElSelect v-model={form.value.political_status} placeholder="请选择">
                                    <ElOption label="中共党员" value="中共党员" />
                                    <ElOption label="中共预备党员" value="中共预备党员" />
                                    <ElOption label="共青团员" value="共青团员" />
                                    <ElOption label="民革党员" value="民革党员" />
                                    <ElOption label="民盟盟员" value="民盟盟员" />
                                    <ElOption label="民建会员" value="民建会员" />
                                    <ElOption label="民进会员" value="民进会员" />
                                    <ElOption label="农工党党员" value="农工党党员" />
                                    <ElOption label="致公党党员" value="致公党党员" />
                                    <ElOption label="九三学社社员" value="九三学社社员" />
                                    <ElOption label="台盟盟员" value="台盟盟员" />
                                    <ElOption label="无党派人士" value="无党派人士" />
                                    <ElOption label="群众" value="群众" />
                                </ElSelect>
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="电话">
                                <ElInput v-model={form.value.phone} />
                            </ElFormItem>
                        </div>
                    </div>
                    <div class={styles.formRow}>
                        <div class={styles.formCol}>
                            <ElFormItem label="工号">
                                <ElInput v-model={form.value.work_id} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="单位">
                                <ElInput v-model={form.value.unit} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="证件号">
                                <ElInput v-model={form.value.ID_card} />
                            </ElFormItem>
                        </div>
                    </div>
                    <div class={styles.formRow}>
                        <div class={styles.formCol}>
                            <ElFormItem label="邮箱">
                                <ElInput v-model={form.value.email} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="所在学院">
                                <ElInput v-model={form.value.college} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="职务和职称">
                                <ElInput v-model={form.value.title_position} />
                            </ElFormItem>
                        </div>
                    </div>
                    <ElFormItem label="研究方向（从事专业关键词）">
                        <ElInput
                            v-model={form.value.res_direction}
                            type="textarea"
                            rows={2}
                        />
                    </ElFormItem>
                </ElForm>
                <div class={styles.btnGroup}>
                    <ElButton type="primary" onClick={handleAdd}>添加</ElButton>
                    <ElButton onClick={handleCancel}>取消</ElButton>
                </div>
            </div>

        )
    }
})