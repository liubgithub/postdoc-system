import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem, ElButton, ElDialog } from 'element-plus'
import * as cls from '@/pages/EnterWorksation/coms/StationAssessment/styles.css.ts'
import CommonTable from "@/units/CommonTable/index.tsx"
import type { TableRow } from '@/types/common-table'
import CommonPart from './commonPart'
import OutAssessment from './coms/OutAssessment/index.tsx'
import ExtensionRequest from './coms/ExtensionRequest/index.tsx'
import ProcessStatus from '@/units/ProcessStatus'

const menuList = [
    { label: "出站申请", key: "outrequest" },
]

export default defineComponent({
    name: "OutStation",
    setup() {
        const activeMenu = ref('outrequest')
        const handleMenuClick = (key: string) => {
            activeMenu.value = key
        }

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
            console.log('View data:', row)
            showDetails.value = true
            showAssessment.value = true
        }
        const handleEidt = () => {
            showAssessment.value = false
            showDetails.value = true
        }

        const handleApply = () => {
            showDetails.value = true
            showAssessment.value = false
        }

        const handleBack = () => {
            showDetails.value = false
        }
        return () => (
            <ElContainer>
                <ElAside width="15vw">
                    <ElMenu
                        defaultActive={activeMenu.value}
                        class="el-menu-vertical"
                        onSelect={handleMenuClick}
                    >
                        {menuList.map(item => (
                            <ElMenuItem index={item.key}>
                                {item.label}
                            </ElMenuItem>
                        ))}
                    </ElMenu>
                </ElAside>
                <ElMain style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    {activeMenu.value === 'outrequest' && (
                        showDetails.value ? (
                            <CommonPart onBack={handleBack} showAssessment={showAssessment.value} />
                        ) : (
                            <>
                                <ElButton style={{ marginBottom: '20px' }} onClick={handleApply}>新增申请</ElButton>
                                <CommonTable
                                    data={tableData.value}
                                    columns={columns}
                                    onView={handleView}
                                    onEdit={handleEidt}
                                    // editableFields={editableFields}
                                    showAction={true}
                                    tableClass={cls.tableWidth}
                                />

                                <ProcessStatus
                                    modelValue={showProcess.value}
                                    onUpdate:modelValue={(val) => showProcess.value = val}
                                    processType='出站考核'
                                />
                            </>
                        )
                    )}
                    {activeMenu.value === 'outassessment' && <OutAssessment />}
                    {activeMenu.value === 'extensionrequest' && <ExtensionRequest />}
                </ElMain>
            </ElContainer>
        )
    }
})