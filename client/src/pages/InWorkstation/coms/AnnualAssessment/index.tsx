import * as cls from '@/pages/EnterWorksation/coms/StationAssessment/styles.css.ts'
import AnnualAssessment from './annual_assess'
import CommonTable from "@/units/CommonTable/index.tsx"
import type { TableRow } from '@/types/common-table'
import { ElButton } from 'element-plus'
import ProcessStatus from '@/units/ProcessStatus'
export default defineComponent({
    name: "AnnualAssessment",
    setup() {
        const showDetails = ref(false)
        const isViewMode = ref(false)

        const showProcess = ref(false)

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
            console.log('View data:', row)
            isViewMode.value = true
            showDetails.value = true
        }

        const handleBack = () => {
            showDetails.value = false
            isViewMode.value = false
        }

        const handleApply = () => {
            isViewMode.value = false
            showDetails.value = true
        }

        return () => (
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {showDetails.value ? (
                    <AnnualAssessment onBack={handleBack} isViewMode={isViewMode.value} />
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

                        <ProcessStatus
                            modelValue={showProcess.value}
                            onUpdate:modelValue={(val) => showProcess.value = val}
                            processType='年终考核'
                        />
                    </>

                )}
            </div>
        )
    }
})