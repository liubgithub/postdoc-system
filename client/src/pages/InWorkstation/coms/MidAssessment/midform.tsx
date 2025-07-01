import { ElForm, ElFormItem, ElInput, ElDatePicker, ElButton, ElTable, ElTableColumn, ElRadioGroup, ElRadio } from 'element-plus'
import * as styles from '@/pages/userinfoRegister/styles.css'
import Achievement from './achres_instation'
export default defineComponent({
    name: "MidForm",
    props: {
        onBack: {
            type: Function,
            required: true
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
            religion: "",
            id_number: "",
            is_religious_staff: "",
            research_direction: "",
            education_experience: [
                { start: "", end: "", school: "", major: "", supervisor: "" }
            ],
            work_experience: [
                { start: "", end: "", company: "", position: "" }
            ],
            other: "",
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
        });

        const rules = {
            name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
            gender: [{ required: true, message: "请选择性别", trigger: "change" }],
            birth_year: [{ required: true, message: "请输入出生年", trigger: "blur" }],
        };

        // 教育经历操作
        const addEducation = () => {
            form.value.education_experience.push({ start: "", end: "", school: "", major: "", supervisor: "" });
        };
        const removeEducation = (index: number) => {
            form.value.education_experience.splice(index, 1);
        };
        // 工作经历操作
        const addWork = () => {
            form.value.work_experience.push({ start: "", end: "", company: "", position: "" });
        };
        const removeWork = (index: number) => {
            form.value.work_experience.splice(index, 1);
        };

        const handleSubmit = async () => {
            // 提交form.value，包括form.value.achievement
            // await api.submitForm(form.value)
        }
        return () => (
            <div class={styles.formWrapper}>
                <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>基本信息表</div>
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
                                    <ElRadio label="男">男</ElRadio>
                                    <ElRadio label="女">女</ElRadio>
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
                                <ElInput v-model={form.value.political_status} />
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
                            <ElFormItem label="宗教信仰">
                                <ElInput v-model={form.value.religion} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="证件号">
                                <ElInput v-model={form.value.id_number} />
                            </ElFormItem>
                        </div>
                        <div class={styles.formCol}>
                            <ElFormItem label="宗教教职人员">
                                <ElRadioGroup v-model={form.value.is_religious_staff}>
                                    <ElRadio label="是">是</ElRadio>
                                    <ElRadio label="否">否</ElRadio>
                                </ElRadioGroup>
                            </ElFormItem>
                        </div>
                    </div>
                    <ElFormItem label="博士期间研究方向">
                        <ElInput v-model={form.value.research_direction} type="textarea" rows={2} />
                    </ElFormItem>
                    {/* 教育经历表格 */}
                    <div style={{ fontWeight: 700, fontSize: '1.1em', margin: '1.5em 0 0.5em 0' }}>
                        教育经历 <span style={{ fontWeight: 400, fontSize: '0.95em' }}>(从高中填起，请勿间断)</span>
                    </div>
                    <ElFormItem label=" ">
                        <ElTable data={form.value.education_experience} class={styles.table} style={{ width: "100%" }}>
                            <ElTableColumn label="起止时间">
                                {{
                                    default: ({ row }: any) => (
                                        <>
                                            <ElDatePicker
                                                v-model={row.start}
                                                type="date"
                                                placeholder="起"
                                                style={{ width: '120px' }}
                                                format="YYYY-MM-DD"
                                                value-format="YYYY-MM-DD"
                                            />
                                            <span> - </span>
                                            <ElDatePicker
                                                v-model={row.end}
                                                type="date"
                                                placeholder="止"
                                                style={{ width: '120px' }}
                                                format="YYYY-MM-DD"
                                                value-format="YYYY-MM-DD"
                                            />
                                        </>
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn label="毕业学校、专业及单位">
                                {{
                                    default: ({ row }: any) => (
                                        <ElInput v-model={row.school} placeholder="毕业学校、专业及单位" style={{ width: "220px" }} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn label="导师"> 
                                {{
                                    default: ({ row }: any) => (
                                        <ElInput v-model={row.supervisor} placeholder="导师" style={{ width: "100px" }} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn label="操作">
                                {{
                                    default: ({ $index }: any) => (
                                        <ElButton type="danger" size="small" onClick={() => removeEducation($index)}>删除</ElButton>
                                    )
                                }}
                            </ElTableColumn>
                        </ElTable>
                        <ElButton type="primary" size="small" onClick={addEducation} style={{ marginTop: "8px" }}>添加教育经历</ElButton>
                    </ElFormItem>
                    {/* 工作经历表格 */}
                    <div style={{ fontWeight: 700, fontSize: '1.1em', margin: '1.5em 0 0.5em 0' }}>
                        工作经历 <span style={{ fontWeight: 400, fontSize: '0.95em' }}>(含博士后经历，请勿间断)</span>
                    </div>
                    <ElFormItem label=" ">
                        <ElTable data={form.value.work_experience} class={styles.table} style={{ width: "100%" }}>
                            <ElTableColumn label="起止时间">
                                {{
                                    default: ({ row }: any) => (
                                        <>
                                            <ElDatePicker
                                                v-model={row.start}
                                                type="date"
                                                placeholder="起"
                                                style={{ width: '120px' }}
                                                format="YYYY-MM-DD"
                                                value-format="YYYY-MM-DD"
                                            />
                                            <span> - </span>
                                            <ElDatePicker
                                                v-model={row.end}
                                                type="date"
                                                placeholder="止"
                                                style={{ width: '120px' }}
                                                format="YYYY-MM-DD"
                                                value-format="YYYY-MM-DD"
                                            />
                                        </>
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn label="工作单位及职务">
                                {{
                                    default: ({ row }: any) => (
                                        <ElInput v-model={row.company} placeholder="工作单位及职务" style={{ width: "220px" }} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn label="操作">
                                {{
                                    default: ({ $index }: any) => (
                                        <ElButton type="danger" size="small" onClick={() => removeWork($index)}>删除</ElButton>
                                    )
                                }}
                            </ElTableColumn>
                        </ElTable>
                        <ElButton type="primary" size="small" onClick={addWork} style={{ marginTop: "8px" }}>添加工作经历</ElButton>
                    </ElFormItem>
                    {/* 其他说明 */}
                    <ElFormItem label="其他说明">
                        <ElInput v-model={form.value.other} type="textarea" rows={2} placeholder="是否有亲属在本工作（姓名和亲属关系），何时何地受过何种处分或者被追究刑事责任" />
                    </ElFormItem>
                    {/* 科研成果表单 */}
                    <Achievement model={form.value.achievement} onUpdate:model={val => form.value.achievement = val} />
                    {/* 按钮组 */}
                    <div class={styles.btnGroup}>
                        <ElButton type="primary" onClick={handleSubmit}>提交</ElButton>
                    </div>
                </ElForm>
            </div>
        )
    }
})