// @/components/ProcessStatusDialog.tsx
import type { PropType } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
import { fetchProcessStatus, generateTimelineSteps } from './processUtils'
import { type TimelineStep, type TimelineStepStatus } from './processUtils'


export default defineComponent({
  name: 'ProcessStatusDialog',
  props: {
    modelValue: Boolean,
    processType: {
      type: String,
      required: true
    },
    studentId: {
      type: Number,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const steps = ref<TimelineStep[]>([])
    const loading = ref(false)
    // 获取流程状态并生成步骤
    const loadProcessStatus = async () => {
      loading.value = true
      try {
        console.log('获取流程状态 - 流程类型:', props.processType, '学生ID:', props.studentId)
        const { status, updatedAt } = await fetchProcessStatus(props.processType, props.studentId)
        console.log('获取到的状态:', status, '更新时间:', updatedAt)
        steps.value = generateTimelineSteps(
          props.processType,
          status,
          updatedAt ? new Date(updatedAt).toLocaleString('zh-CN') : '未提交'
        )
        console.log('生成的步骤:', steps.value)
      } catch (error) {
        console.error('加载流程状态失败:', error)
        steps.value = [
          { name: '博士后提交申请', status: 'wait', time: '' },
          { name: '合作导师审核', status: 'wait', time: '' },
          { name: '学院/管理员审核', status: 'wait', time: '' },
          { name: '审核结束', status: 'wait', time: '' }
        ]
      } finally {
        loading.value = false
      }
    }

    // 状态转换函数
    const stepStatusColor = (status: TimelineStepStatus) => {
      return status === 'finished' ? '#52c41a' :
        status === 'process' ? '#1890ff' :
          status === 'error' ? '#ff4d4f' : '#d9d9d9'
    }

    const statusText = (status: TimelineStepStatus) => {
      return status === 'finished' ? '已完成' :
        status === 'process' ? '进行中' :
          status === 'error' ? '已拒绝' : '等待中'
    }

    const statusBgColor = (status: TimelineStepStatus) => {
      return status === 'finished' ? '#f6ffed' :
        status === 'process' ? '#e6f7ff' :
          status === 'error' ? '#fff2f0' : '#f5f5f5'
    }

    const statusTextColor = (status: TimelineStepStatus) => {
      return status === 'finished' ? '#52c41a' :
        status === 'process' ? '#1890ff' :
          status === 'error' ? '#ff4d4f' : '#999'
    }

    // 刷新状态
    const refreshStatus = async () => {
      await loadProcessStatus()
    }

    // 监听 props.modelValue的变化当为 true 时刷新
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        refreshStatus()
      }
    })

    return () => (
      <ElDialog
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        title={`${props.processType}流程状态`}
        width="800px"
        destroyOnClose
      >
        <div style={{ padding: '20px' }}>
          {loading.value ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              加载中...
            </div>
          ) : (
            <>
              <div style={{ position: 'relative' }}>
                {steps.value.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: index === steps.value.length - 1 ? 0 : '30px',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginRight: '20px',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: stepStatusColor(step.status),
                        zIndex: 2,
                        position: 'relative'
                      }} />
                      {index < steps.value.length - 1 && (
                        <div style={{
                          width: '2px',
                          height: '40px',
                          backgroundColor: '#e8e8e8',
                          marginTop: '4px'
                        }} />
                      )}
                    </div>

                    <div style={{
                      flex: 1,
                      backgroundColor: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          {step.name}
                        </div>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: statusBgColor(step.status),
                          color: statusTextColor(step.status)
                        }}>
                          {statusText(step.status)}
                        </div>
                      </div>
                      {step.time && (
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <span style={{ marginRight: '8px' }}>⏰</span>
                          {step.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '30px',
                padding: '16px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    状态说明：
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#52c41a',
                        marginRight: '6px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>已完成</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        marginRight: '6px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>进行中</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#ff4d4f',
                        marginRight: '6px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>已拒绝</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#d9d9d9',
                        marginRight: '6px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>等待中</span>
                    </div>
                  </div>
                </div>
                <ElButton size="small" onClick={refreshStatus}>
                  刷新状态
                </ElButton>
              </div>
            </>
          )}
        </div>
      </ElDialog>
    )
  }
})