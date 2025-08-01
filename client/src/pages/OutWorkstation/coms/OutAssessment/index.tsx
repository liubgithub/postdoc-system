
import CommonTable from "@/units/CommonTable/index.tsx"
import type { TableRow } from '@/types/common-table'
import { ElButton, ElDialog } from "element-plus"
import * as cls from '@/pages/EnterWorksation/coms/StationAssessment/styles.css.ts'
import CommonPart from "@/pages/OutWorkstation/commonPart"
import ProcessStatus from '@/units/ProcessStatus'
export default defineComponent({
    name: 'OutAssessment',
    setup() {
        const showDetails = ref(false)
        const showAssessment = ref(true)

        const showProcess = ref(false)
        const currentSteps = ref<any[]>([])
        const tableData = ref<TableRow[]>([{
            stuId: '',
            name: '',
            cotutor: '',
            college: '',
            subject: '',
            applyTime: '',
            processStatus: '已通过',
            nodeName: '',
            assessmentRes: '',
            processSteps: [
                { status: '发起', role: '学生申请', time: '' },
                { status: '通过', role: '导师审核', time: '' },
                { status: '结束', role: '学院审核', time: '' }
            ]
        }])
        const columns = [
            { prop: 'stuId', label: '学号' },
            { prop: 'name', label: '学生姓名' },
            { prop: 'cotutor', label: '导师' },
            { prop: 'college', label: '学院' },
            { prop: 'subject', label: '研究方向' },
            { prop: 'applyTime', label: '申请时间' },
            {
                prop: 'processStatus',
                label: '处理状态',
                render: ({ row }: { row: TableRow }) => (
                    <div>
                        <ElButton
                            type="primary"
                            size="small"
                            style="margin-left:8px"
                            onClick={() => {
                                currentSteps.value = row.processSteps || []
                                showProcess.value = true
                            }}
                        >
                            查看流程
                        </ElButton>
                    </div>
                )
            },
            {
                prop: 'nodeName',
                label: '节点名称',
                render: ({ row }: { row: TableRow }) => (
                    <span>{row.nodeName}</span>
                )
            },
            { prop: 'assessmentRes', label: '考核结果' }
        ]

        // const editableFields = ['stuId', 'name', 'cotutor', 'college', 'subject']

        const handleView = (row: TableRow) => {
            showDetails.value = true
        }

        const handleApply = () => {
            showAssessment.value = false
            showDetails.value = true
        }

        const handleBack = () => {
            showDetails.value = false
        }
        return () => (
            <div>
                {showDetails.value ? (
                    <CommonPart onBack={handleBack} showAssessment={showAssessment.value}/>
                ) : (
                    <>
                        <ElButton style={{ marginBottom: '20px' }} onClick={handleApply}>申请考核</ElButton>
                        <CommonTable
                            data={tableData.value}
                            columns={columns}
                            onView={handleView}
                            // editableFields={editableFields}
                            showAction={true}
                            tableClass={cls.tableWidth}
                        />
                                                <ElDialog
                            v-model={showProcess.value}
                            title="流程状态"
                            width="600px"
                            destroyOnClose
                        >
                            <ProcessStatus steps={currentSteps.value} />
                        </ElDialog>
                    </>
                )}
            </div>
        )
    }
})