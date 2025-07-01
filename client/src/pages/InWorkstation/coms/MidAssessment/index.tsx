import * as cls from '@/units/EnterWorksation/coms/StationAssessment/styles.css.ts'
import Midform from "./midform.tsx"
import CommonTable from "@/units/CommonTable/index.tsx"
import type { TableRow } from '@/types/common-table'
export default defineComponent({
    name: "MidAssessment",
    setup() {
        const showDetails = ref(false)

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
            { prop: 'stuId', label: '学生ID' },
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
            console.log('View data:', row)
            showDetails.value = true
        }

        const handleBack = () => {
            showDetails.value = false
        }

        return () => (
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {showDetails.value ? (
                    <Midform onBack={handleBack} />
                ) : (
                    <CommonTable 
                    data={tableData.value} 
                    columns={columns} 
                    onView={handleView}
                    editableFields={editableFields}
                    showAction={true}
                    tableClass={cls.tableWidth}
                    />
                )}
            </div>
        )
    }
})