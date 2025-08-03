import { defineComponent, ref } from 'vue'
import * as cls from './styles.css'
import OpenDetails from './openDetails'
import CommonTable from '@/units/CommonTable'
import type { TableRow } from '@/types/common-table'
import { ElButton, ElDialog } from 'element-plus'
import ProcessStatus from '@/units/ProcessStatus'
import fetch from '@/api/index.ts'

export default defineComponent({
    name: "StationAssessment",
    setup() {
        const showDetails = ref(false)
        const showProcess = ref(false)
        const currentSteps = ref<any[]>([
            { name: '博士后提交申请', status: 'finished', time: '2025-03-12 19:59:28' },
            { name: '合作导师审核', status: 'process', time: '2025-03-31 20:44:48' },
            { name: '学院/管理员审核', status: 'wait', time: '' },
            { name: '审核结束', status: 'wait', time: '' }
        ])
        const isAssessmentMode = ref(false)

        // 示例数据，实际应从后端获取
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


        const handleView = (row: TableRow) => {
            console.log('View data:', row)
            isAssessmentMode.value = true
            showDetails.value = true
        }

        const handleApply = () => {
            isAssessmentMode.value = false
            showDetails.value = true
        }

        const handleBack = () => {
            showDetails.value = false
            isAssessmentMode.value = false
        }

        onMounted(async () => {
            const res = await fetch.raw.GET('/assessment/student/')
        })
        return () => (
            <div style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                {showDetails.value ? (
                    <OpenDetails onBack={handleBack} showAssessment={isAssessmentMode.value} />
                ) : (
                    <>
                        <ElButton style={{ marginBottom: '20px' }} onClick={handleApply}>申请考核</ElButton>
                        <CommonTable
                            data={tableData.value}
                            columns={columns}
                            onView={handleView}
                            showAction={true}
                            tableClass={cls.tableWidth}
                        />
                        <ProcessStatus
                            modelValue={showProcess.value}
                            onUpdate:modelValue={(val) => showProcess.value = val}
                            processType='进站考核' 
                            />
                    </>
                )}
            </div>
        )
    }
})