// @/utils/processUtils.ts
import { ElMessage } from 'element-plus'

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

export type TimelineStepStatus = 'wait' | 'process' | 'finished' | 'error'

export interface TimelineStep {
  name: string
  status: TimelineStepStatus
  time: string
}

// 流程类型映射
const PROCESS_MAP: Record<string, keyof WorkflowResponse> = {
  '进站申请': 'entry_application',
  '进站考核': 'entry_assessment',
  '进站协议': 'entry_agreement',
  '中期考核': 'midterm_assessment',
  '年度考核': 'annual_assessment',
  '延期考核': 'extension_assessment',
  '出站考核': 'leave_assessment'
}

// 状态转换函数
export const getProcessStatus = (status: string) => {
  switch (status) {
    case '未提交': return '未提交'
    case '导师审核中': return '合作导师审核中'
    case '管理员审核中': return '管理员审核中'
    case '学院审核中': return '学院审核中'
    case '学院未审核':
    case '等待学院审核': return '等待学院审核'
    case '导师未审核':
    case '等待导师审核': return '等待导师审核'
    case '等待管理员审核': return '等待管理员审核'
    case '导师审核通过': return '合作导师审核通过'
    case '导师审核不通过': return '合作导师审核不通过'
    case '导师驳回': return '合作导师审核不通过'
    case '学院审核通过': return '学院审核通过'
    case '学院审核不通过': return '学院审核不通过'
    case '学院驳回': return '学院审核不通过'
    case '管理员审核通过': return '管理员审核通过'
    case '管理员审核不通过': return '管理员审核不通过'
    case '审核结束':
    case '结束':
    case '已审核': return '审核结束'
    default: return status
  }
}

// 获取特定流程状态
export const fetchProcessStatus = async (processType: string, studentId?: number) => {
  try {
    const url = studentId 
      ? `/api/workflow/status?student_id=${studentId}`
      : '/api/workflow/status';
    
    const response = await window.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const responseData = await response.json()
    
    // 处理导师角色的情况：返回的是workflows数组
    let workflowData: WorkflowResponse
    if (responseData.workflows && Array.isArray(responseData.workflows)) {
      // 导师角色：从workflows数组中找到指定学生的数据
      if (!studentId) {
        // 如果没有提供学生ID，返回默认状态而不是抛出错误
        console.warn('导师角色未提供学生ID，返回默认状态')
        return {
          status: '未提交',
          updatedAt: new Date().toISOString()
        }
      }
      const targetWorkflow = responseData.workflows.find((w: any) => w.student_id === studentId)
      if (!targetWorkflow) {
        console.warn(`未找到学生ID ${studentId} 的workflow数据，返回默认状态`)
        return {
          status: '未提交',
          updatedAt: new Date().toISOString()
        }
      }
      workflowData = targetWorkflow
    } else {
      // 学生或管理员角色：直接返回单个workflow
      workflowData = responseData as WorkflowResponse
    }
    
    const field = PROCESS_MAP[processType]
    
    if (!field) {
      throw new Error(`未知的流程类型: ${processType}`)
    }
    
    return {
      status: workflowData[field] as string,
      updatedAt: workflowData.updated_at
    }
  } catch (error) {
    console.error('获取流程状态失败:', error)
    ElMessage.error('获取流程状态失败')
    return {
      status: '未提交',
      updatedAt: new Date().toISOString()
    }
  }
}

// 生成时间轴步骤
export const generateTimelineSteps = (processType: string, status: string, submitTime: string):TimelineStep[] => {
  const baseSteps: TimelineStep[] = [
    { name: '博士后提交申请', status: 'wait', time: '' },
    { name: '合作导师审核', status: 'wait', time: '' },
    { name: '学院/管理员审核', status: 'wait', time: '' },
    { name: '审核结束', status: 'wait', time: '' }
  ]
  
  // 设置提交时间
  baseSteps[0].time = submitTime || '未提交'
  
  // 根据状态更新步骤状态
  const processedStatus = getProcessStatus(status)
  
  // 调试信息
  console.log('原始状态:', status)
  console.log('处理后状态:', processedStatus)
  
  if (processedStatus === '未提交') {
    baseSteps[0].status = 'wait'
    return baseSteps
  }
  
  baseSteps[0].status = 'finished'
  
  switch (processedStatus) {
    case '等待导师审核':
    case '合作导师审核中':
    case '导师未审核':
      baseSteps[1].status = 'process'
      baseSteps[1].time = new Date().toLocaleString('zh-CN')
      break
    case '等待学院审核':
    case '学院审核中':
    case '管理员审核中':
    case '等待管理员审核':
    case '学院未审核':
      baseSteps[1].status = 'finished'
      baseSteps[1].time = submitTime || new Date().toLocaleString('zh-CN')
      baseSteps[2].status = 'process'
      baseSteps[2].time = new Date().toLocaleString('zh-CN')
      break
    case '合作导师审核通过':
    case '导师驳回':
      baseSteps[1].status = 'finished'
      baseSteps[1].time = new Date().toLocaleString('zh-CN')
      break
    case '学院审核通过':
    case '管理员审核通过':
    case '审核结束':
    case '已审核':
      baseSteps[1].status = 'finished'
      baseSteps[1].time = new Date().toLocaleString('zh-CN')
      baseSteps[2].status = 'finished'
      baseSteps[2].time = new Date().toLocaleString('zh-CN')
      baseSteps[3].status = 'finished'
      baseSteps[3].time = new Date().toLocaleString('zh-CN')
      break
    case '合作导师审核不通过':
      baseSteps[1].status = 'error'
      baseSteps[1].time = new Date().toLocaleString('zh-CN')
      break
    case '学院审核不通过':
    case '管理员审核不通过':
    case '学院驳回':
      baseSteps[1].status = 'finished'
      baseSteps[1].time = new Date().toLocaleString('zh-CN')
      baseSteps[2].status = 'error'
      baseSteps[2].time = new Date().toLocaleString('zh-CN')
      break
  }
  
  return baseSteps
}