import { ElInput, ElTable, ElTableColumn, ElButton } from 'element-plus'
import * as cls from './styles.css'
import OpenDetails from './openDetails'

interface TableRow {
    id: number,
    stuId: string,
    name: string,
    cotutor: string,
    college: string,
    subject: string,
    applyTime: string,
    processStatus: string,
    nodeName: string,
    assessmentRes: string
}

export default defineComponent({
    name: "StationAssessment",
    setup() {
        const showDetails = ref(false)
        const formData = ref({
            id: 1,
            stuId: '',
            name: '',
            cotutor: '',
            college: '',
            subject: '',
            applyTime: '',
            processStatus: '',
            nodeName: '',
            assessmentRes: ''
        })

        const tableData = ref<TableRow[]>([{
            id: 1,
            stuId: '',
            name: '',
            cotutor: '',
            college: '',
            subject: '',
            applyTime: '',
            processStatus: '',
            nodeName: '',
            assessmentRes: ''
        }])

        const handleView = (row: TableRow) => {
            console.log('View data:', row)
            showDetails.value = true
        }

        const handleBack = () => {
            showDetails.value = false
        }

        return () => (
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {showDetails.value ? (
                    <OpenDetails onBack={handleBack} />
                ) : (
                    <ElTable data={tableData.value} class={cls.tableWidth}>
                        <ElTableColumn prop="id" label="序号" width="60">
                            {{
                                default: ({ row }: { row: TableRow }) => (
                                    <span style={{ display: 'flex', justifyContent: 'center' }}>{row.id}</span>
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="stuId" label="学号">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.stuId} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="name" label="姓名">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.name} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="cotutor" label="合作导师姓名">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.cotutor} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="college" label="所在学院">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.college} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="subject" label="学科专业">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.subject} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="applyTime" label="申请时间">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.applyTime} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="processStatus" label="流程状态">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.processStatus} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="nodeName" label="节点名称">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.nodeName} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="assessmentRes" label="最后考核结果">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.assessmentRes} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="操作">
                            {{
                                default: ({ row }: { row: TableRow }) => (
                                    <div style={{display: 'flex', justifyContent: 'center' }}>
                                        <ElButton type="primary" size="small" onClick={() => handleView(row)}>
                                            查看
                                        </ElButton>
                                    </div>
                                )
                            }}
                        </ElTableColumn>
                    </ElTable>
                )}
            </div>
        )
    }
})