import { defineComponent, ref, computed, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElTag, ElMessage,ElDialog } from 'element-plus'
import ProcessStatus from '@/units/ProcessStatus'
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
        const activeTab = ref<'processing' | 'done'>('processing')
        const data = ref<BusinessStatus[]>([])
        const loading = ref(false)
        const showProcess = ref(false)
        const currentSteps = ref<any[]>([])
        const processSteps = ref<ProcessStep[]>([])
        const processLoading = ref(false)

        // 获取业务数据 - 从待处理任务接口获取
        const fetchData = async () => {
            loading.value = true
            try {
                // 直接使用原生fetch调用工作流程接口
                const response = await window.fetch('/api/workflow/my-pending-tasks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                })
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const res = await response.json()
                
                if (res) {
                    const pendingTasks = res as PendingTasksResponse
                    // 将后端数据转换为前端格式
                    data.value = pendingTasks.pending_processes.map((task, index) => ({
                        id: index + 1,
                        type: task.description,
                        initiator: '当前用户', // 学生看到的都是自己发起的
                        status: task.current_status === '未提交' ? '待提交' : STATUS_PROCESSING,
                        submitTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        detailId: task.process_type
                    }))
                }
            } catch (error) {
                console.error('获取待处理任务失败:', error)
                ElMessage.error('获取数据失败')
                data.value = []
            } finally {
                loading.value = false
            }
        }

        // 获取流程状态数据
        const fetchProcessSteps = async () => {
            processLoading.value = true
            try {
                // 调用后端获取工作流程状态
                const response = await window.fetch('/api/workflow/status', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                })
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const workflowData = await response.json() as WorkflowResponse
                
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

        const filteredData = computed(() =>
            data.value.filter(item =>
                activeTab.value === 'processing'
                    ? item.status === STATUS_PROCESSING
                    : item.status === STATUS_DONE
            )
        )

        const handleDetail = (id: string) => {
            // 跳转到具体的申请详情页面
            console.log('查看详情:', id)
        }
        
        const handleView = (id: string) => {
            showProcess.value = true
        }

        return () => (
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                <div style={{ background: '#f5f5f5', padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                        <ElButton
                            type={activeTab.value === 'processing' ? 'primary' : 'default'}
                            style={{ fontSize: '20px', padding: '10px 40px' }}
                            onClick={() => (activeTab.value = 'processing')}
                        >
                            处理中
                        </ElButton>
                        <ElButton
                            type={activeTab.value === 'done' ? 'primary' : 'default'}
                            style={{ fontSize: '20px', padding: '10px 40px' }}
                            onClick={() => (activeTab.value = 'done')}
                        >
                            已处理
                        </ElButton>
                    </div>
                    <div style={{ background: '#fff', padding: '16px' }}>
                        <ElTable
                            data={filteredData.value}
                            border
                            style={{ width: '100%' }}
                            v-loading={loading.value}
                        >
                            <ElTableColumn type="index" label="序号" width={60} align='center'/>
                            <ElTableColumn prop="type" label="业务类型" minWidth={120} align='center'/>
                            <ElTableColumn prop="initiator" label="发起人" minWidth={100} align='center'/>
                            <ElTableColumn prop="status" label="流程状态" minWidth={100} align='center'>
                                {{
                                    default: ({ row }: { row: BusinessStatus }) => (
                                        <ElTag type={row.status === STATUS_PROCESSING ? 'info' : 'success'}>
                                            {row.status}
                                        </ElTag>
                                    )
                                }}
                            </ElTableColumn>
                            <ElTableColumn prop="submitTime" label="提交时间" minWidth={160} align='center'/>
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
                           <ElDialog
                            v-model={showProcess.value}
                            title="流程状态"
                            width="600px"
                            destroyOnClose
                        >
                            <ProcessStatus steps={currentSteps.value} />
                        </ElDialog>
                    </div>
                </div>
                <div style={{ background: '#f5f5f5', marginTop: '2rem', padding: '24px' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                            轨迹
                        </div>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                                    流程
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {processSteps.value.map((step, index) => (
                                        <div key={index} style={{ 
                                            padding: '17px', 
                                            border: '1px solid #e8e8e8', 
                                            borderRadius: '4px',
                                            backgroundColor: '#fafafa'
                                        }}>
                                            {step.process}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                                    状态
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
                                                backgroundColor: step.status === '结束' ? '#f6ffed' : '#fff2f0',
                                                color: step.status === '结束' ? '#52c41a' : '#ff4d4f',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}>
                                                {step.status}
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
