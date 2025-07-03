
import CommonTable from "@/units/CommonTable/index.tsx"
import type { TableRow } from '@/types/common-table'
import { ElButton } from "element-plus"
import * as cls from '@/pages/EnterWorksation/coms/StationAssessment/styles.css.ts'
import CommonPart from "@/pages/OutWorkstation/commonPart"
export default defineComponent({
    name: 'OutAssessment',
    setup() {
        const showDetails = ref(false)
        const showAssessment = ref(true)

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
        const columns = [
            { prop: 'stuId', label: '学号' },
            { prop: 'name', label: '学生姓名' },
            { prop: 'cotutor', label: '导师' },
            { prop: 'college', label: '学院' },
            { prop: 'subject', label: '研究方向' },
            { prop: 'applyTime', label: '申请时间' },
            { prop: 'processStatus', label: '处理状态' },
            { prop: 'nodeName', label: '节点名称' },
            { prop: 'assessmentRes', label: '考核结果' }
        ]

        const editableFields = ['stuId', 'name', 'cotutor', 'college', 'subject']

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
                        <ElButton style={{ marginBottom: '20px' }} onClick={handleApply}>新增申请</ElButton>
                        <CommonTable
                            data={tableData.value}
                            columns={columns}
                            onView={handleView}
                            editableFields={editableFields}
                            showAction={true}
                            tableClass={cls.tableWidth}
                        />
                    </>
                )}
            </div>
        )
    }
})