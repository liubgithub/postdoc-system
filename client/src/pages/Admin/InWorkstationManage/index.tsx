import { defineComponent, ref, onMounted } from 'vue'
import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem, ElButton, ElTable, ElTableColumn, ElTag, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElMessage } from 'element-plus'
import { getInWorkstationAssessments, searchAssessments, approveAssessment, getAssessmentDetail, getAssessmentProcess, exportAssessments } from '@/api/inWorkstationManage'
import type { TableRow } from '@/types/common-table'
import * as styles from './styles.css.ts'

const menuList = [
    { label: "中期考核管理", key: "midterm_assessment" },
    { label: "年度考核管理", key: "annual_assessment" },
    { label: "延期考核管理", key: "extension_assessment"}
]

export default defineComponent({
    name: "AdminInWorkstationManage",
    setup() {
        const activeMenu = ref('midterm_assessment')
        const tableData = ref<TableRow[]>([])
        const loading = ref(false)
        const showDetailDialog = ref(false)
        const showProcessDialog = ref(false)
        const currentRow = ref<TableRow | null>(null)
        const searchForm = ref({
            name: '',
            studentId: '',
            status: ''
        })

        // 获取考核数据
        const fetchAssessmentData = async (assessmentType: string) => {
            loading.value = true
            try {
                const { data, error } = await getInWorkstationAssessments(assessmentType)
                if (error) {
                    ElMessage.error('获取数据失败')
                    return
                }
                tableData.value = data || []
            } catch (error) {
                ElMessage.error('获取数据失败')
            } finally {
                loading.value = false
            }
        }

        // 菜单点击处理
        const handleMenuClick = (key: string) => {
            activeMenu.value = key
            const assessmentTypeMap = {
                'midterm_assessment': '中期考核',
                'annual_assessment': '年度考核', 
                'extension_assessment': '延期考核'
            }
            fetchAssessmentData(assessmentTypeMap[key as keyof typeof assessmentTypeMap])
        }

        // 查看详情
        const handleView = (row: TableRow) => {
            currentRow.value = row
            showDetailDialog.value = true
        }

        // 查看流程
        const handleViewProcess = (row: TableRow) => {
            currentRow.value = row
            showProcessDialog.value = true
        }

        // 审核操作
        const handleApprove = async (row: TableRow, approved: boolean) => {
            try {
                const { error } = await approveAssessment(row.id || 0, approved)
                if (error) {
                    ElMessage.error('操作失败')
                    return
                }
                ElMessage.success(approved ? '审核通过' : '审核不通过')
                // 刷新数据
                const assessmentTypeMap = {
                    'midterm_assessment': '中期考核',
                    'annual_assessment': '年度考核',
                    'extension_assessment': '延期考核'
                }
                await fetchAssessmentData(assessmentTypeMap[activeMenu.value as keyof typeof assessmentTypeMap])
            } catch (error) {
                ElMessage.error('操作失败')
            }
        }

        // 搜索
        const handleSearch = async () => {
            loading.value = true
            try {
                const assessmentTypeMap = {
                    'midterm_assessment': '中期考核',
                    'annual_assessment': '年度考核',
                    'extension_assessment': '延期考核'
                }
                
                const { data, error } = await searchAssessments({
                    type: assessmentTypeMap[activeMenu.value as keyof typeof assessmentTypeMap],
                    name: searchForm.value.name,
                    studentId: searchForm.value.studentId,
                    status: searchForm.value.status
                })
                
                if (error) {
                    ElMessage.error('搜索失败')
                    return
                }
                
                tableData.value = data || []
            } catch (error) {
                ElMessage.error('搜索失败')
            } finally {
                loading.value = false
            }
        }

        // 重置搜索
        const handleReset = () => {
            searchForm.value = {
                name: '',
                studentId: '',
                status: ''
            }
            // 重置后重新加载数据
            const assessmentTypeMap = {
                'midterm_assessment': '中期考核',
                'annual_assessment': '年度考核',
                'extension_assessment': '延期考核'
            }
            fetchAssessmentData(assessmentTypeMap[activeMenu.value as keyof typeof assessmentTypeMap])
        }

        // 导出数据
        const handleExport = async () => {
            try {
                const assessmentTypeMap = {
                    'midterm_assessment': '中期考核',
                    'annual_assessment': '年度考核',
                    'extension_assessment': '延期考核'
                }
                
                const { error } = await exportAssessments(assessmentTypeMap[activeMenu.value as keyof typeof assessmentTypeMap])
                if (error) {
                    ElMessage.error('导出失败')
                    return
                }
                ElMessage.success('导出成功')
            } catch (error) {
                ElMessage.error('导出失败')
            }
        }

        // 表格列配置
        const getColumns = () => [
            { prop: 'stuId', label: '学号', width: 120 },
            { prop: 'name', label: '学生姓名', width: 120 },
            { prop: 'cotutor', label: '导师', width: 120 },
            { prop: 'college', label: '学院', width: 150 },
            { prop: 'subject', label: '研究方向', width: 200 },
            { prop: 'applyTime', label: '申请时间', width: 150 },
            {
                prop: 'processStatus',
                label: '处理状态',
                width: 120,
                render: ({ row }: { row: TableRow }) => {
                    const statusMap = {
                        '已通过': 'success',
                        '待审核': 'warning',
                        '已驳回': 'danger'
                    }
                    return (
                        <ElTag type={statusMap[row.processStatus as keyof typeof statusMap] || 'info'}>
                            {row.processStatus}
                        </ElTag>
                    )
                }
            },
            {
                prop: 'actions',
                label: '操作',
                width: 200,
                render: ({ row }: { row: TableRow }) => (
                    <div>
                        <ElButton
                            type="primary"
                            size="small"
                            onClick={() => handleView(row)}
                        >
                            查看详情
                        </ElButton>
                        <ElButton
                            type="info"
                            size="small"
                            style="margin-left: 8px"
                            onClick={() => handleViewProcess(row)}
                        >
                            查看流程
                        </ElButton>
                        {row.processStatus === '待审核' && (
                            <>
                                <ElButton
                                    type="success"
                                    size="small"
                                    style="margin-left: 8px"
                                    onClick={() => handleApprove(row, true)}
                                >
                                    通过
                                </ElButton>
                                <ElButton
                                    type="danger"
                                    size="small"
                                    style="margin-left: 8px"
                                    onClick={() => handleApprove(row, false)}
                                >
                                    驳回
                                </ElButton>
                            </>
                        )}
                    </div>
                )
            }
        ]

        onMounted(() => {
            // 默认加载中期考核数据
            fetchAssessmentData('中期考核')
        })

        return () => (
            <ElContainer>
                <ElAside width="15vw">
                    <ElMenu
                        defaultActive={activeMenu.value}
                        class={styles.sidebarMenu}
                        onSelect={handleMenuClick}
                    >
                        {menuList.map(item => (
                            <ElMenuItem
                                key={item.key}
                                index={item.key}
                                class={activeMenu.value === item.key ? styles.sidebarMenuItemActive : styles.sidebarMenuItem}
                            >
                                {item.label}
                            </ElMenuItem>
                        ))}
                    </ElMenu>
                </ElAside>
                <ElMain>
                    <div class={styles.contentContainer}>
                        {/* 搜索区域 */}
                        <div class={styles.searchContainer}>
                            <ElForm inline>
                                <ElFormItem label="学生姓名">
                                    <ElInput
                                        v-model={searchForm.value.name}
                                        placeholder="请输入学生姓名"
                                        clearable
                                    />
                                </ElFormItem>
                                <ElFormItem label="学号">
                                    <ElInput
                                        v-model={searchForm.value.studentId}
                                        placeholder="请输入学号"
                                        clearable
                                    />
                                </ElFormItem>
                                <ElFormItem label="状态">
                                    <ElSelect
                                        v-model={searchForm.value.status}
                                        placeholder="请选择状态"
                                        clearable
                                    >
                                        <ElOption label="待审核" value="待审核" />
                                        <ElOption label="已通过" value="已通过" />
                                        <ElOption label="已驳回" value="已驳回" />
                                    </ElSelect>
                                </ElFormItem>
                                <ElFormItem>
                                    <ElButton type="primary" onClick={handleSearch}>
                                        搜索
                                    </ElButton>
                                    <ElButton onClick={handleReset}>
                                        重置
                                    </ElButton>
                                    <ElButton type="success" onClick={handleExport}>
                                        导出
                                    </ElButton>
                                </ElFormItem>
                            </ElForm>
                        </div>

                        {/* 表格区域 */}
                        <div class={styles.tableContainer}>
                            <ElTable
                                data={tableData.value}
                                loading={loading.value}
                                stripe
                                border
                                style="width: 100%"
                            >
                                {getColumns().map(column => (
                                    <ElTableColumn
                                        key={column.prop}
                                        prop={column.prop}
                                        label={column.label}
                                        width={column.width}
                                        v-slots={column.render ? { default: column.render } : undefined}
                                    />
                                ))}
                            </ElTable>
                        </div>
                    </div>

                    {/* 详情对话框 */}
                    <ElDialog
                        v-model={showDetailDialog.value}
                        title="考核详情"
                        width="60%"
                        destroy-on-close
                    >
                        {currentRow.value && (
                            <div>
                                <p><strong>学号：</strong>{currentRow.value.stuId}</p>
                                <p><strong>姓名：</strong>{currentRow.value.name}</p>
                                <p><strong>导师：</strong>{currentRow.value.cotutor}</p>
                                <p><strong>学院：</strong>{currentRow.value.college}</p>
                                <p><strong>研究方向：</strong>{currentRow.value.subject}</p>
                                <p><strong>申请时间：</strong>{currentRow.value.applyTime}</p>
                                <p><strong>处理状态：</strong>{currentRow.value.processStatus}</p>
                                <p><strong>考核结果：</strong>{currentRow.value.assessmentRes}</p>
                            </div>
                        )}
                    </ElDialog>

                    {/* 流程查看对话框 */}
                    <ElDialog
                        v-model={showProcessDialog.value}
                        title="流程状态"
                        width="50%"
                        destroy-on-close
                    >
                        {currentRow.value && (
                            <div>
                                <h4>流程步骤：</h4>
                                {currentRow.value.processSteps?.map((step, index) => (
                                    <div key={index} style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                                        <p><strong>步骤：</strong>{step.status}</p>
                                        <p><strong>角色：</strong>{step.role}</p>
                                        <p><strong>时间：</strong>{step.time}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ElDialog>
                </ElMain>
            </ElContainer>
        )
    }
})
