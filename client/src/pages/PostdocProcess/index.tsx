import { defineComponent, ref, computed, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElTag, ElMessage,ElDialog } from 'element-plus'
import ProcessStatus from '@/units/ProcessStatus'
import fetch from '@/api'

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
    statuses: {
        application: string  // 申请状态
        supervisor: string   // 导师状态
        college: string      // 学院状态
    }
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

        // 获取业务数据
        const fetchData = async () => {
            loading.value = true
            try {
                // TODO: 替换为你的实际接口
                // const res = await fetch.raw.GET('/your/api/path')
                // data.value = res.data
                setTimeout(() => {
                    data.value = [
                        // 示例数据
                        // { id: 1, type: '进站申请', initiator: '张三', status: '处理中', submitTime: '2024-06-01 10:00', detailId: '1' },
                    ]
                    loading.value = false
                }, 500)
            } catch (error) {
                ElMessage.error('获取数据失败')
                loading.value = false
            }
        }

        // 获取流程状态数据
        const fetchProcessSteps = async () => {
            processLoading.value = true
            try {
                // TODO: 从后端获取流程状态数据
                // const res = await fetch.raw.GET('/assessment/process/status', {})
                // if (res.data) {
                //     processSteps.value = res.data as ProcessStep[]
                // } else {
                // 使用默认数据
                processSteps.value = [
                    { 
                        process: '进站申请', 
                        statuses: {
                            application: '申请已提交',
                            supervisor: '导师已通过',
                            college: '学院已通过'
                        }
                    },
                    { 
                        process: '进站考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '进站协议', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '中期考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '年度考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '延期考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '出站考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    }
                ]
                // }
            } catch (error) {
                // 如果接口不存在，使用默认数据
                processSteps.value = [
                    { 
                        process: '进站申请', 
                        statuses: {
                            application: '申请已提交',
                            supervisor: '导师已通过',
                            college: '学院已通过'
                        }
                    },
                    { 
                        process: '进站考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '进站协议', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '中期考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '年度考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '延期考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
                    },
                    { 
                        process: '出站考核', 
                        statuses: {
                            application: '申请未提交',
                            supervisor: '导师未通过',
                            college: '学院未通过'
                        }
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
                                            gap: '8px'
                                        }}>
                                            <div style={{ 
                                                flex: 1,
                                                padding: '8px', 
                                                borderRadius: '4px',
                                                backgroundColor: step.statuses.application.includes('已') ? '#f6ffed' : '#fff2f0',
                                                color: step.statuses.application.includes('已') ? '#52c41a' : '#ff4d4f',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}>
                                                {step.statuses.application}
                                            </div>
                                            <div style={{ 
                                                flex: 1,
                                                padding: '8px', 
                                                borderRadius: '4px',
                                                backgroundColor: step.statuses.supervisor.includes('已') ? '#f6ffed' : '#fff2f0',
                                                color: step.statuses.supervisor.includes('已') ? '#52c41a' : '#ff4d4f',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}>
                                                {step.statuses.supervisor}
                                            </div>
                                            <div style={{ 
                                                flex: 1,
                                                padding: '8px',                                             
                                                borderRadius: '4px',
                                                backgroundColor: step.statuses.college.includes('已') ? '#f6ffed' : '#fff2f0',
                                                color: step.statuses.college.includes('已') ? '#52c41a' : '#ff4d4f',
                                                fontSize: '12px',
                                                textAlign: 'center'
                                            }}>
                                                {step.statuses.college}
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
