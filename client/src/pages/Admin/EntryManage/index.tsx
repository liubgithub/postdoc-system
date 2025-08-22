import { defineComponent, ref, watch, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import {
  ElContainer,
  ElHeader,
  ElRow,
  ElCol,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElAside,
  ElMenu,
  ElMenuItem,
  ElMain,
} from "element-plus";
import ProcessStatus from "@/units/ProcessStatus";
import { ElMessage } from "element-plus";

// 定义数据类型
interface StudentData {
  id: number;
  studentId: string;
  name: string;
  college: string;
  major: string;
  applyTime: string;
  status: string;
  node: string;
  currentApproval: string;
  steps: any[];
  user_id: number;
  subject: string;
  cotutor: string;
  allitutor: string;
  workflow_status: string;
}

export default defineComponent({
  name: "AdminEntryManagePage",
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    const loading = ref(false);
    
    // 从API获取的数据
    const tableData = ref<StudentData[]>([]);

    // 获取学生列表
    const fetchStudents = async () => {
      loading.value = true;
      try {
        // 这里应该调用管理员的API接口
        // const response = await getAdminApplications();
        // 暂时使用模拟数据
        const mockData: StudentData[] = [
          {
            id: 1,
            studentId: "20230001",
            name: "张三",
            college: "园艺林学学院",
            major: "园艺学",
            applyTime: "2025-09-01",
            status: "审核中",
            node: "学院管理员",
            currentApproval: "学院管理员（待处理）",
            steps: [
              { status: '发起' as const, role: '学生申请', time: '2025-09-01 10:00' },
              { status: '通过' as const, role: '合作导师', time: '2025-09-02 12:00' },
              { status: '通过' as const, role: '分管领导', time: '2025-09-03 09:30' },
              { status: '审核中' as const, role: '学院管理员' }
            ],
            user_id: 1,
            subject: "园艺学",
            cotutor: "李导师",
            allitutor: "王导师",
            workflow_status: "审核中"
          },
          {
            id: 2,
            studentId: "20230002",
            name: "李四",
            college: "园艺林学学院",
            major: "林学",
            applyTime: "2025-09-01",
            status: "审核中",
            node: "学院管理员",
            currentApproval: "学院管理员（待处理）",
            steps: [
              { status: '发起' as const, role: '学生申请', time: '2025-09-01 09:00' },
              { status: '通过' as const, role: '合作导师', time: '2025-09-01 10:00' },
              { status: '通过' as const, role: '分管领导', time: '2025-09-02 11:00' },
              { status: '审核中' as const, role: '学院管理员' }
            ],
            user_id: 2,
            subject: "林学",
            cotutor: "张导师",
            allitutor: "刘导师",
            workflow_status: "审核中"
          },
          {
            id: 3,
            studentId: "20230003",
            name: "王五",
            college: "园艺林学学院",
            major: "林学",
            applyTime: "2025-09-01",
            status: "审核中",
            node: "学院管理员",
            currentApproval: "学院管理员（待处理）",
            steps: [
              { status: '发起' as const, role: '学生申请', time: '2025-09-01 08:00' },
              { status: '通过' as const, role: '合作导师', time: '2025-09-01 09:00' },
              { status: '通过' as const, role: '分管领导', time: '2025-09-01 10:00' },
              { status: '审核中' as const, role: '学院管理员' }
            ],
            user_id: 3,
            subject: "林学",
            cotutor: "陈导师",
            allitutor: "赵导师",
            workflow_status: "审核中"
          }
        ];
        tableData.value = mockData;
      } catch (error) {
        console.error('获取学生列表失败:', error);
        ElMessage.error('获取学生列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 页面加载时获取数据
    onMounted(() => {
      fetchStudents();
    });

    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return tableData.value.slice(start, start + pageSize);
    });

    // 搜索功能
    const handleSearch = () => {
      const keyword = searchValue.value.trim().toLowerCase();
      if (!keyword) {
        fetchStudents(); // 重新获取所有数据
        return;
      }
      // 这里可以添加搜索逻辑，或者直接重新获取数据
      fetchStudents();
    };

    watch(searchValue, (val) => {
      if (val === "") {
        fetchStudents(); // 重新获取所有数据
      }
    });

    // 流程状态弹窗逻辑
    const showProcessDialog = ref(false);
    const currentSteps = ref<any[]>([]);
    const currentSelectedRow = ref<any>(null);
    const handleShowProcess = (row: any) => {
      currentSelectedRow.value = row;
      currentSteps.value = row.steps;
      showProcessDialog.value = true;
    };

    // 处理详情按钮点击
    const handleDetail = (row: StudentData) => {
      console.log('查看详情:', row);
      router.push({
        path: '/admin/entryManage/approval',
        query: {
          studentId: row.id.toString(),
          userId: row.user_id.toString(),
          type: 'detail'
        }
      });
    };

    const menuList = [
      { label: '进站申请', key: 'apply' },
      { label: '进站考核', key: 'assessment' },  
    ];
    const activeMenu = ref('apply');
    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
      if (key === 'assessment') {
        router.push('/admin/entryManage/assessment');
      }
    };

    return () => (
      <ElContainer style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
        <ElContainer style={{ position: 'relative', flex: 1, height: '0' }}>
          <ElAside width="200px" style={{ background: '#fff', height: '100%', borderRight: '1px solid #e4e7ed' }}>
            <ElMenu
              defaultActive={activeMenu.value}
              class="el-menu-vertical"
              onSelect={handleMenuClick}
              style={{ borderRight: 'none' }}
            >
              {menuList.map(item => (
                <ElMenuItem index={item.key} style={{ fontSize: '16px', height: '50px', lineHeight: '50px' }}>
                  {item.label}
                </ElMenuItem>
              ))}
            </ElMenu>
          </ElAside>
          <ElMain style={{ padding: '20px', background: '#f5f7fa' }}>
            {/* 主内容区 */}
            <div style={{ background: "#fff", borderRadius: "8px", padding: "24px", boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600' }}>进站管理</h2>
              </div>

              <ElRow gutter={12} style={{ marginBottom: "24px" }}>
                <ElCol span={2}>
                  <ElButton
                    type="primary"
                    style={{
                      width: "100px",
                      height: 44,
                      fontWeight: 500,
                      fontSize: 16,
                    }}
                    onClick={handleSearch}
                  >
                    搜索
                  </ElButton>
                </ElCol>
                <ElCol span={7}>
                  <ElInput
                    v-model={searchValue.value}
                    placeholder="请输入账号/姓名"
                    clearable
                    style={{ width: 220, height: 44, fontSize: 16 }}
                    onKeydown={(evt: Event | KeyboardEvent) => {
                      if ('key' in evt && (evt.key === 'Enter' || (evt as any).keyCode === 13)) handleSearch();
                    }}
                  />
                </ElCol>
                <ElCol span={12}></ElCol>
              </ElRow>

              <div style={{ marginTop: 24, width: "100%" }}>
                {loading.value ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    加载中...
                  </div>
                ) : (
                  <ElTable
                    data={pagedData.value}
                    border
                    style={{ width: "100%", background: "#fff", borderRadius: 8 }}
                    headerCellStyle={{
                      textAlign: "center",
                      background: "#f7f8fa",
                      fontWeight: 600,
                      color: "#666",
                      fontSize: 16,
                    }}
                    cellStyle={{ textAlign: "center", fontSize: 15, color: "#222" }}
                  >
                    <ElTableColumn
                      prop="id"
                      label="序号"
                      width={80}
                      align="center"
                    />
                    <ElTableColumn prop="studentId" label="学号" align="center" />
                    <ElTableColumn prop="name" label="姓名" align="center" />
                    <ElTableColumn prop="college" label="所在学院" align="center" />
                    <ElTableColumn prop="major" label="学科专业" align="center" />
                    <ElTableColumn
                      prop="applyTime"
                      label="申请时间"
                      align="center"
                    />
                    <ElTableColumn
                      prop="status"
                      label="流程状态"
                      align="center"
                      v-slots={{
                        default: (scope: { row: any }) => (
                          <ElButton type="primary" size="small" onClick={() => handleShowProcess(scope.row)}>
                            查看流程
                          </ElButton>
                        )
                      }}
                    />
                    <ElTableColumn
                      prop="node"
                      label="节点名称"
                      align="center"
                    />
                    <ElTableColumn
                      prop="currentApproval"
                      label="当前审批结果"
                      align="center"
                    />
                    <ElTableColumn
                      label="操作"
                      width={150}
                      align="center"
                      v-slots={{
                        default: (scope: { row: StudentData }) => (
                          <ElButton 
                            type="primary" 
                            size="small" 
                            onClick={() => handleDetail(scope.row)}
                          >
                            查看
                          </ElButton>
                        ),
                      }}
                    />
                  </ElTable>
                )}
              </div>

              {/* 分页器 */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <ElPagination
                  background
                  layout="prev, pager, next"
                  pageSize={pageSize}
                  total={tableData.value.length}
                  v-model:current-page={currentPage.value}
                  hideOnSinglePage={false}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {/* 实际返回按钮事件绑定 */}
                <ElButton
                  style={{ width: 120 }}
                  plain
                  onClick={() => router.push('/admin')}
                >
                  返回
                </ElButton>
              </div>
            </div>
          </ElMain>
        </ElContainer>

        <ProcessStatus
          modelValue={showProcessDialog.value}
          onUpdate:modelValue={(val) => showProcessDialog.value = val}
          processType='进站管理'
          studentId={currentSelectedRow.value?.user_id}
        />
      </ElContainer>
    );
  },
});
