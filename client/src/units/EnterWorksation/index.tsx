import { ref } from 'vue'
import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem, ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import * as cls from "./styles.css"
import Application from "./apply"


interface TableRow {
    id: string;
    subject: string;
    postname: string;
    posttask: string;
    postqualification: string;
    cotutor: string;
    allitutor: string;
    remark: string;
}

export default defineComponent({
    name: "EnterWS",
    setup() {
        const activeMenu = ref('application')
        const showApplication = ref(true)
        const formData = ref({
            subject: '',
            id: '',
            postname: '',
            posttask: '',
            postqualification: '',
            cotutor: '',
            allitutor: '',
            remark: ''
        })
        const tableData = ref<TableRow[]>([{
            id: '',
            subject: '',
            postname: '',
            posttask: '',
            postqualification: '',
            cotutor: '',
            allitutor: '',
            remark: ''
        }])

        const handleView = (row: TableRow) => {
            // TODO: Implement view functionality
            console.log('View data:', row)
        }

        const handleApply = (row: TableRow) => {
            // TODO: Implement apply functionality
            showApplication.value = false
        }

        return () => (
            <ElContainer>
                <ElAside width="200px">
                    <ElMenu
                        defaultActive={activeMenu.value}
                        class="el-menu-vertical"
                    >
                        <ElMenuItem index="application">
                            进站申请
                        </ElMenuItem>
                        <ElMenuItem index="assessment">
                            进站考核
                        </ElMenuItem>
                        <ElMenuItem index="agreement">
                            进站协议和成果考核
                        </ElMenuItem>
                    </ElMenu>
                </ElAside>
                <ElMain>
                    {showApplication.value ? (
                        <ElTable data={tableData.value} class={cls.tableWidth}>
                            <ElTableColumn prop="subject" label="一级学科" width="80">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.subject} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="id" label="序号" width="60">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.id} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="postname" label="岗位名称" width="120">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.postname} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="posttask" label="岗位目标任务（拟解决的科学问题）" width="280">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.posttask} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="postqualification" label="岗位资格条件" width="180">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.postqualification} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="cotutor" label="合作导师" width="80">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.cotutor} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="allitutor" label="挂靠导师" width="80">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.allitutor} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="remark" label="备注" width="180">
                                {{
                                    default: () => (
                                        <ElInput v-model={formData.value.remark} />
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn label="操作" width="160" class={cls.opreateBtn}>
                                {{
                                    default: ({ row }: { row: TableRow }) => (
                                        <>
                                            <ElButton type="primary" size="small" onClick={() => handleApply(row)}>
                                                申请
                                            </ElButton>
                                            <ElButton type="info" size="small" onClick={() => handleView(row)}>
                                                查看
                                            </ElButton>
                                        </>
                                    )
                                }}
                            </ElTableColumn>
                        </ElTable>
                    ) : (

                        <Application />
                    )}



                </ElMain>
            </ElContainer>
        )
    }
})