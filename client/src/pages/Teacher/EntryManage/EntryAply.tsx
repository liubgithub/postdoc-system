import { defineComponent, ref, watch, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import TeacherHeader from "../TeacherHeader.tsx";
import * as styles from "../../UserInfo/styles.css.ts";
import { getTeacherApplications } from "@/api/enterWorkstation";
import { ElMessage } from "element-plus";
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
  ElDialog,
} from "element-plus";
import ProcessStatus from "@/units/ProcessStatus";

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
  allitutor: string;  // 添加allitutor字段
  workflow_status: string;
}

export default defineComponent({
  name: "EntryApplyPage",
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
        const response = await getTeacherApplications();
        console.log('API响应:', response);
        if (response.data) {
          tableData.value = response.data as StudentData[];
        } else if (response.error) {
          ElMessage.error('获取学生列表失败');
        }
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
    const currentSteps = ref([]);
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
        path: '/teacher/entryManage/approval',
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
        router.push('/teacher/entryManage/assessment');
      }
    };

    return () => (
      <ElContainer style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <ElContainer style={{ position: 'relative', flex: 1, height: '0', top: '8px' }}>
          <ElAside width="200px" style={{ background: '#fff', height: '100%' }}>
            <ElMenu
              defaultActive={activeMenu.value}
              class="el-menu-vertical"
              onSelect={handleMenuClick}
            >
              {menuList.map(item => (
                <ElMenuItem index={item.key}>{item.label}</ElMenuItem>
              ))}
            </ElMenu>
          </ElAside>
          <ElMain style={{ padding: 0 }}>
            {/* 主内容区 */}
            <div class={styles.contentArea}>
              <div
                style={{ background: "#fff", borderRadius: "8px", padding: "24px" }}
              >
                <ElRow gutter={12} style={{ marginBottom: "24px" }}>
                  <ElCol span={2}>
                    <ElButton
                      type="primary"
                      style={{
                        width: "100px",
                        height: 44,
                        fontWeight: 500,
                        fontSize: 18,
                      }}
                      onClick={handleSearch}
                    >
                      搜索
                    </ElButton>
                  </ElCol>
                  <ElCol span={6}>
                    <ElInput
                      v-model={searchValue.value}
                      placeholder="请输入学号或姓名"
                      style={{ height: 44 }}
                    />
                  </ElCol>
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
                    onClick={() => router.push('/teacher')}
                  >
                    返回
                  </ElButton>
                </div>
              </div>
            </div>
          </ElMain>
        </ElContainer>
        <ProcessStatus
                            modelValue={showProcessDialog.value}
                            onUpdate:modelValue={(val) => showProcessDialog.value = val}
                            processType='进站申请'
                            studentId={currentSelectedRow.value?.user_id}
                        />
      </ElContainer>
    );
  },
});
