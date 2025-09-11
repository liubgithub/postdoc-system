import { defineComponent, ref, onMounted } from "vue";
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElButton,
  ElMessage,
  ElRow,
  ElCol,
  ElTag,
  ElSpace,
  ElLoading,
  ElEmpty,
  ElStatistic,
  ElIcon
} from "element-plus";
import { 
  User, 
  Document, 
  Clock, 
  Check,
  Warning
} from '@element-plus/icons-vue';
import fetch from "@/api";

// 定义待处理任务的数据类型
interface PendingTask {
  process_type: string;
  description: string;
  current_status: string;
  student_id: number;
  student_name: string;
}

interface PendingTasksResponse {
  role: string;
  pending_count: number;
  pending_workflows: PendingTask[];
}

// 流程类型映射
const processTypeMap: Record<string, string> = {
  'entry_application': '进站申请',
  'entry_assessment': '进站考核',
  'entry_agreement': '进站协议',
  'midterm_assessment': '中期考核',
  'annual_assessment': '年度考核',
  'extension_assessment': '延期考核',
  'leave_assessment': '出站考核'
};

// 状态颜色映射
const statusColorMap: Record<string, string> = {
  'pending': 'warning',
  'in_progress': 'primary',
  'approved': 'success',
  'rejected': 'danger',
  'completed': 'success'
};

export default defineComponent({
  name: "AdminDashboard",
  components: {
    ElCard,
    ElTable,
    ElTableColumn,
    ElButton,
    ElRow,
    ElCol,
    ElTag,
    ElSpace,
    ElEmpty,
    ElStatistic,
    ElIcon,
    User,
    Document,
    Clock,
    Check,
    Warning
  },
  setup() {
    const loading = ref(false);
    const pendingTasks = ref<PendingTask[]>([]);
    const stats = ref({
      totalPending: 0,
      entryApplications: 0,
      assessments: 0,
      agreements: 0
    });

    // 获取待处理任务数据
    const fetchPendingTasks = async () => {
      loading.value = true;
      try {
        const res = await fetch.raw.GET("/workflow/my-pending-tasks");
        console.log("管理员待处理任务数据:", res.data);
        
        const responseData = res.data as PendingTasksResponse;
        
        if (responseData && responseData.pending_workflows) {
          pendingTasks.value = responseData.pending_workflows;
          
          // 计算统计数据
          const totalPending = responseData.pending_count;
          const entryApplications = responseData.pending_workflows.filter(
            task => task.process_type === 'entry_application'
          ).length;
          const assessments = responseData.pending_workflows.filter(
            task => task.process_type.includes('assessment')
          ).length;
          const agreements = responseData.pending_workflows.filter(
            task => task.process_type === 'entry_agreement'
          ).length;
          
          stats.value = {
            totalPending,
            entryApplications,
            assessments,
            agreements
          };
        }
      } catch (error) {
        console.error("获取待处理任务失败:", error);
        ElMessage.error("获取待处理任务失败");
      } finally {
        loading.value = false;
      }
    };

    // 处理任务
    const handleProcessTask = (task: PendingTask) => {
      ElMessage.info(`处理任务: ${task.student_name} - ${processTypeMap[task.process_type]}`);
      // TODO: 实现具体的处理逻辑，跳转到对应的处理页面
    };

    // 查看详情
    const handleViewDetail = (task: PendingTask) => {
      ElMessage.info(`查看详情: ${task.student_name} - ${processTypeMap[task.process_type]}`);
      // TODO: 实现查看详情的逻辑
    };

    onMounted(() => {
      fetchPendingTasks();
    });

    return () => (
      <div style={{ padding: '24px' }}>
        <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
          管理员后台首页
        </h1>
        
        {/* 统计卡片 */}
        <ElRow gutter={16} style={{ marginBottom: '24px' }}>
          <ElCol xs={24} sm={12} md={6}>
            <ElCard>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16', marginBottom: '8px' }}>
                  {stats.value.totalPending}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  <ElIcon><Warning /></ElIcon> 待处理总数
                </div>
              </div>
            </ElCard>
          </ElCol>
          <ElCol xs={24} sm={12} md={6}>
            <ElCard>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
                  {stats.value.entryApplications}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  <ElIcon><Document /></ElIcon> 进站申请
                </div>
              </div>
            </ElCard>
          </ElCol>
          <ElCol xs={24} sm={12} md={6}>
            <ElCard>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
                  {stats.value.assessments}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  <ElIcon><Check /></ElIcon> 考核任务
                </div>
              </div>
            </ElCard>
          </ElCol>
          <ElCol xs={24} sm={12} md={6}>
            <ElCard>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1', marginBottom: '8px' }}>
                  {stats.value.agreements}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  <ElIcon><Clock /></ElIcon> 协议任务
                </div>
              </div>
            </ElCard>
          </ElCol>
        </ElRow>

        {/* 待处理任务表格 */}
        <ElCard
          v-slots={{
            header: () => (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>待处理任务列表</span>
                <ElButton 
                  type="primary" 
                  onClick={fetchPendingTasks}
                  loading={loading.value}
                >
                  刷新
                </ElButton>
              </div>
            )
          }}
        >
          
          {loading.value ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
          ) : pendingTasks.value.length > 0 ? (
            <ElTable
              data={pendingTasks.value}
              style={{ width: '100%' }}
              border
            >
              <ElTableColumn
                label="学生姓名"
                prop="student_name"
                width="120"
                v-slots={{
                  default: ({ row }: { row: PendingTask }) => (
                    <ElSpace>
                      <ElIcon><User /></ElIcon>
                      {row.student_name}
                    </ElSpace>
                  )
                }}
              />
              <ElTableColumn
                label="流程类型"
                prop="process_type"
                width="150"
                v-slots={{
                  default: ({ row }: { row: PendingTask }) => (
                    <ElTag type="primary">
                      {processTypeMap[row.process_type] || row.process_type}
                    </ElTag>
                  )
                }}
              />
              <ElTableColumn
                label="流程描述"
                prop="description"
                showOverflowTooltip
              />
              <ElTableColumn
                label="当前状态"
                prop="current_status"
                width="120"
                v-slots={{
                  default: ({ row }: { row: PendingTask }) => (
                    <ElTag type={statusColorMap[row.current_status] as any || 'info'}>
                      {row.current_status}
                    </ElTag>
                  )
                }}
              />
              <ElTableColumn
                label="学生ID"
                prop="student_id"
                width="100"
              />
              <ElTableColumn
                label="操作"
                width="150"
                v-slots={{
                  default: ({ row }: { row: PendingTask }) => (
                    <ElSpace size="small">
                      <ElButton 
                        type="primary" 
                        size="small"
                        onClick={() => handleProcessTask(row)}
                      >
                        处理
                      </ElButton>
                      <ElButton 
                        size="small"
                        onClick={() => handleViewDetail(row)}
                      >
                        详情
                      </ElButton>
                    </ElSpace>
                  )
                }}
              />
            </ElTable>
          ) : (
            <ElEmpty description="暂无待处理任务" />
          )}
        </ElCard>
      </div>
    );
  }
});
