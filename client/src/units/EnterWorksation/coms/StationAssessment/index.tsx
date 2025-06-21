import { ElInput, ElTable, ElTableColumn, ElButton } from 'element-plus'
import OpenDetails from './openDetails'

interface TableRow {
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

        const handleView = (row: TableRow)=>{
            console.log('View data:', row)
            showDetails.value = true
        }

        const handleBack = () => {
            showDetails.value = false
        }

        return () => (
            <div>
                {showDetails.value ? (
                    <OpenDetails onBack={handleBack} />
                ) : (
                    <ElTable data={tableData.value}>
                        <ElTableColumn prop="id" label="序号" width="80">

                        </ElTableColumn>
                        <ElTableColumn prop="stuId" label="学号" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.stuId} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="name" label="姓名" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.name} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="cotutor" label="合作导师姓名" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.cotutor} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="college" label="所在学院" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.college} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="subject" label="学科专业" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.subject} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="applyTime" label="申请时间" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.applyTime} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="processStatus" label="流程状态" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.processStatus} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="nodeName" label="节点名称" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.nodeName} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop="assessmentRes" label="最后考核结果" width="80">
                            {{
                                default: () => (
                                    <ElInput v-model={formData.value.assessmentRes} />
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="操作" width="80">
                            {{
                                default: ({ row }: { row: TableRow }) => (
                                    <>
                                        <ElButton type="info" size="small" onClick={() => handleView(row)}>
                                            查看
                                        </ElButton>
                                    </>
                                )
                            }}
                        </ElTableColumn>
                    </ElTable>
                )}
            </div>
        )
    }
})