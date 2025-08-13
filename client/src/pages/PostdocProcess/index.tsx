import { defineComponent, ref, computed, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElTag, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import ProcessStatus from '@/units/ProcessStatus'
import fetch_postdoctor from '@/api/postdoctor'
interface BusinessStatus {
    id: number
    type: string
    initiator: string
    status: string
    submitTime: string
    detailId: string
}

interface ProcessStep {
    process: string
    status: string  // 只保留一个状态字段
}

// 后端接口数据结构
interface WorkflowResponse {
    id: number
    student_id: number
    entry_application: string
    entry_assessment: string
    entry_agreement: string
    midterm_assessment: string
    annual_assessment: string
    extension_assessment: string
    leave_assessment: string
    created_at: string
    updated_at: string
}

interface PendingTask {
    process_type: string
    description: string
    current_status: string
}

interface PendingTasksResponse {
    role: string
    pending_count: number
    pending_processes: PendingTask[]
}

const STATUS_PROCESSING = '处理中'
const STATUS_DONE = '已处理'

export default defineComponent({
    name: 'StatusPage',
    setup() {
        const router = useRouter()
        const activeTab = ref<'processing' | 'done'>('processing')
        const data = ref<BusinessStatus[]>([])
        const loading = ref(false)
        const showProcess = ref(false)
        const currentSteps = ref<any[]>([])
        const processSteps = ref<ProcessStep[]>([])
        const processLoading = ref(false)

        // 获取所有流程状态数据
        const fetchData = async () => {
            loading.value = true
            try {
                const { raw } = fetch_postdoctor('/api');
                const res = await raw.GET('/workflow/status');
                console.log('获取工作流程状态:', res)

                if (!res.response.ok) {
                    throw new Error(`HTTP error! status: ${res.response.status}`)
                }

                const workflowData = res.data as WorkflowResponse

                if (workflowData) {
                    // 将工作流程状态转换为业务数据格式
                    const processes = [
                        { type: '进站申请', status: workflowData.entry_application, detailId: 'entry_application' },
                        { type: '进站考核', status: workflowData.entry_assessment, detailId: 'entry_assessment' },
                        { type: '进站协议', status: workflowData.entry_agreement, detailId: 'entry_agreement' },
                        { type: '中期考核', status: workflowData.midterm_assessment, detailId: 'midterm_assessment' },
                        { type: '年度考核', status: workflowData.annual_assessment, detailId: 'annual_assessment' },
                        { type: '延期考核', status: workflowData.extension_assessment, detailId: 'extension_assessment' },
                        { type: '出站考核', status: workflowData.leave_assessment, detailId: 'leave_assessment' }
                    ]

                    data.value = processes.map((process, index) => ({
                        id: index + 1,
                        type: process.type,
                        initiator: '博士后', // 博士后发起的业务
                        status: getProcessStatus(process.status),
                        submitTime: workflowData.updated_at ? new Date(workflowData.updated_at).toLocaleString('zh-CN') : '未提交',
                        detailId: process.detailId
                    }))
                }
            } catch (error) {
                console.error('获取流程状态失败:', error)
                ElMessage.error('获取数据失败')
                data.value = []
            } finally {
                loading.value = false
            }
        }

        // 根据后端状态转换为流程状态显示
        const getProcessStatus = (status: string) => {
            switch (status) {
                case '未提交':
                    return '未提交'
                case '导师未审核':
                    return '等待导师审核'
                case '导师驳回':
                    return '导师审核不通过'
                case '学院未审核':
                    return '等待学院审核'
                case '学院驳回':
                    return '学院审核不通过'
                case '已审核':
                    return '审核结束'
                case '导师审核中':
                    return '合作导师审核中'
                case '管理员审核中':
                    return '管理员审核中'
                case '学院审核中':
                    return '学院审核中'
                case '学院未审核':
                case '等待学院审核':
                    return '等待学院审核'
                case '导师未审核':
                case '等待导师审核':
                    return '等待导师审核'
                case '等待管理员审核':
                    return '等待管理员审核'
                case '导师审核通过':
                    return '合作导师审核通过'
                case '导师审核不通过':
                    return '合作导师审核不通过'
                case '学院审核通过':
                    return '学院审核通过'
                case '学院审核不通过':
                    return '学院审核不通过'
                case '管理员审核通过':
                    return '管理员审核通过'
                case '管理员审核不通过':
                    return '管理员审核不通过'
                case '审核结束':
                case '结束':
                    return '审核结束'
                default:
                    return status
            }
        }

        // 获取状态背景色
        const getStatusBgColor = (status: string) => {
            const processedStatus = getProcessStatus(status)
            if (processedStatus === '未提交') return '#f0f0f0'
            if (processedStatus.includes('审核中') || processedStatus.includes('等待')) return '#fff7e6'
            if (processedStatus.includes('通过') || processedStatus === '审核结束') return '#f6ffed'
            if (processedStatus.includes('不通过')) return '#fff2f0'
            return '#f0f0f0'
        }

        // 获取状态文字颜色
        const getStatusTextColor = (status: string) => {
            const processedStatus = getProcessStatus(status)
            if (processedStatus === '未提交') return '#666'
            if (processedStatus.includes('审核中') || processedStatus.includes('等待')) return '#fa8c16'
            if (processedStatus.includes('通过') || processedStatus === '审核结束') return '#52c41a'
            if (processedStatus.includes('不通过')) return '#ff4d4f'
            return '#666'
        }

        // 获取流程状态数据
        const fetchProcessSteps = async () => {
            processLoading.value = true
            try {
                const { raw } = fetch_postdoctor('/api');
                const res = await raw.GET('/workflow/status');
                console.log('获取工作流程状态:', res)

                if (!res.response.ok) {
                    throw new Error(`HTTP error! status: ${res.response.status}`)
                }

                const workflowData = res.data as WorkflowResponse

                // 将后端数据转换为前端显示格式
                if (workflowData) {
                    processSteps.value = [
                        {
                            process: '进站申请',
                            status: workflowData.entry_application
                        },
                        {
                            process: '进站考核',
                            status: workflowData.entry_assessment
                        },
                        {
                            process: '进站协议',
                            status: workflowData.entry_agreement
                        },
                        {
                            process: '中期考核',
                            status: workflowData.midterm_assessment
                        },
                        {
                            process: '年度考核',
                            status: workflowData.annual_assessment
                        },
                        {
                            process: '延期考核',
                            status: workflowData.extension_assessment
                        },
                        {
                            process: '出站考核',
                            status: workflowData.leave_assessment
                        }
                    ]
                }
            } catch (error) {
                console.error('获取流程状态失败:', error)
                ElMessage.error('获取流程状态失败')
                // 使用默认数据作为fallback
                processSteps.value = [
                    {
                        process: '进站申请',
                        status: '未提交'
                    },
                    {
                        process: '进站考核',
                        status: '未提交'
                    },
                    {
                        process: '进站协议',
                        status: '未提交'
                    },
                    {
                        process: '中期考核',
                        status: '未提交'
                    },
                    {
                        process: '年度考核',
                        status: '未提交'
                    },
                    {
                        process: '延期考核',
                        status: '未提交'
                    },
                    {
                        process: '出站考核',
                        status: '未提交'
                    }
                ]
            } finally {
                processLoading.value = false
            }
        }

        onMounted(() => {
            fetchData()
            fetchProcessSteps()
        })

        const filteredData = computed(() => {
            if (activeTab.value === 'processing') {
                // 处理中：包含审核中状态和等待状态
                return data.value.filter(item =>
                    item.status.includes('审核中') ||
                    item.status.includes('等待') ||
                    item.status === '未提交'
                )
            } else {
                // 已处理：包含审核通过、审核不通过、审核结束状态
                return data.value.filter(item =>
                    item.status.includes('通过') ||
                    item.status.includes('不通过') ||
                    item.status === '审核结束'
                )
            }
        })

        const handleDetail = (detailId: string) => {
            // 根据业务类型跳转到对应的详情页面
            const routeMap: Record<string, string> = {
                'entry_application': '/UserInfo/entry',
                'entry_assessment': '/UserInfo/entry',
                'entry_agreement': '/UserInfo/entry',
                'midterm_assessment': '/UserInfo/in-station',
                'annual_assessment': '/UserInfo/in-station',
                'extension_assessment': '/UserInfo/in-station',
                'leave_assessment': '/UserInfo/out-station'
            }

            const route = routeMap[detailId]
            if (route) {
                // 使用vue-router进行跳转
                router.push(route)
                console.log('跳转到详情页面:', route)
            } else {
                ElMessage.warning('页面开发中')
            }
        }
        const currentProcessType = ref('')
        const handleView = (detailId: string) => {
            // 根据detailId获取对应流程的当前状态
            const currentProcess = data.value.find(item => item.detailId === detailId)
            if (!currentProcess) return
            currentProcessType.value = currentProcess.type
            // 根据实际状态生成时间轴数据
            showProcess.value = true

            
        }

        return () => (
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                <div style={{ background: '#f5f5f5', padding: '24px' }}>
                    <div style={{ background: '#fff', padding: '16px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
                            博士后业务流程管理
                        </div>

                        {/* 标签页切换 */}
                        <div style={{ marginBottom: '16px', display: 'flex', gap: '0' }}>
                            <ElButton
                                type={activeTab.value === 'processing' ? 'primary' : 'default'}
                                onClick={() => activeTab.value = 'processing'}
                                style={{ borderRadius: '4px 0 0 4px' }}
                            >
                                处理中
                            </ElButton>
                            <ElButton
                                type={activeTab.value === 'done' ? 'primary' : 'default'}
                                onClick={() => activeTab.value = 'done'}
                                style={{ borderRadius: '0 4px 4px 0', marginLeft: '-1px' }}
                            >
                                已处理
                            </ElButton>
                        </div>

                        <ElTable
                            data={filteredData.value}
                            border
                            style={{ width: '100%' }}
                            v-loading={loading.value}
                        >
                            <ElTableColumn type="index" label="序号" width={60} align='center' />
                            <ElTableColumn prop="type" label="业务类型" minWidth={120} align='center' />
                            <ElTableColumn prop="initiator" label="发起人" minWidth={100} align='center' />
                            <ElTableColumn prop="status" label="流程状态" minWidth={120} align='center'>
                                {{
                                    default: ({ row }: { row: BusinessStatus }) => {
                                        const getTagType = (status: string) => {
                                            if (status === '未提交') return 'info'
                                            if (status.includes('审核中') || status.includes('等待')) return 'warning'
                                            if (status.includes('通过') || status === '审核结束') return 'success'
                                            if (status.includes('不通过')) return 'danger'
                                            return 'info'
                                        }

                                        return (
                                            <ElTag type={getTagType(row.status)}>
                                                {row.status}
                                            </ElTag>
                                        )
                                    }
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="submitTime" label="提交时间" minWidth={160} align='center' />
                            <ElTableColumn label="操作" minWidth={180} align="center" >
                                {{
                                    default: ({ row }: { row: BusinessStatus }) => (
                                        <>
                                            <ElButton size="small" onClick={() => handleDetail(row.detailId)}>
                                                详情
                                            </ElButton>
                                            <ElButton size="small" type="info" onClick={() => handleView(row.detailId)}>
                                                查看
                                            </ElButton>
                                        </>
                                    )
                                }}
                            </ElTableColumn>
                        </ElTable>
                        {!loading.value && filteredData.value.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                                暂无数据
                            </div>
                        )}
                        <ProcessStatus

                            modelValue={showProcess.value}
                            onUpdate:modelValue={(val) => showProcess.value = val}
                            processType={currentProcessType.value}
                        />
                    </div>
                </div>
                <div style={{ background: '#f5f5f5', marginTop: '2rem', padding: '24px' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                            全流程轨迹总览
                        </div>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                                    业务类型
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {processSteps.value.map((step, index) => (
                                        <div key={index} style={{
                                            padding: '17px',
                                            border: '1px solid #e8e8e8',
                                            borderRadius: '4px',
                                            backgroundColor: '#fafafa',
                                            fontWeight: '500'
                                        }}>
                                            {step.process}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                                    当前状态
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {processSteps.value.map((step, index) => (
                                        <div key={index} style={{
                                            padding: '12px',
                                            border: '1px solid #e8e8e8',
                                            borderRadius: '4px',
                                            backgroundColor: '#fafafa',
                                            display: 'flex',
                                            gap: '8px',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{
                                                flex: 1,
                                                padding: '8px',
                                                borderRadius: '4px',
                                                backgroundColor: getStatusBgColor(step.status),
                                                color: getStatusTextColor(step.status),
                                                fontSize: '12px',
                                                textAlign: 'center',
                                                fontWeight: '500'
                                            }}>
                                                {getProcessStatus(step.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})
