import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ElButton,
  ElMessage,
  ElRow,
  ElCol,
  ElInput,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElForm,
  ElFormItem,
  ElDatePicker,
} from "element-plus";

// 引入博士后的申请页面组件
import UserinfoRegister from "../../../pages/EnterWorksation/form.tsx";
import ResearchForm from "../../../pages/EnterWorksation/researchForm.tsx";
import Audit from "../../../pages/EnterWorksation/audit.tsx";

// 引入API
import { getUserProfileById } from "@/api/postdoctor/userinfoRegister/bs_user_profile";

// 引入样式
import * as styles from "./styles.css.ts";

const menuList = [
  { label: "进站申请", key: "apply" },
  { label: "进站考核", key: "assessment" },
];

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
  name: "AdminEntryApproval",
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 获取路由参数
    const userId = route.query.userId as string;

    // 学生信息
    const studentInfo = ref<any>(null);
    const loading = ref(false);
    const showDetail = ref(false);

    // 列表数据
    const tableData = ref<StudentData[]>([]);
    const searchValue = ref("");

    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return tableData.value.slice(start, start + pageSize);
    });

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

    // 处理详情按钮点击
    const handleDetail = (row: StudentData) => {
      console.log('查看详情:', row);
      studentInfo.value = row;
      showDetail.value = true;
    };

    // 加载学生信息
    const loadStudentInfo = async () => {
      if (!userId) {
        // 如果没有userId，显示申请列表
        fetchStudents();
        return;
      }

      try {
        loading.value = true;
        const data = await getUserProfileById(parseInt(userId));
        studentInfo.value = data;
        console.log("加载的学生信息:", data);
        showDetail.value = true;
      } catch (error) {
        console.error("加载学生信息失败:", error);
        ElMessage.warning("未找到对应的学生信息，请检查用户ID是否正确");
        // 如果获取学生信息失败，显示申请列表
        fetchStudents();
      } finally {
        loading.value = false;
      }
    };

    // 页面加载时获取学生信息
    onMounted(() => {
      loadStudentInfo();
    });

    const handleMenuClick = (key: string) => {
      // 根据当前路由和菜单项跳转到对应的详情页面
      if (key === 'check-detail') {
        // 跳转到进站考核详情页面，传递当前的userId参数
        const query: any = {};
        if (userId) {
          query.userId = userId;
        }
        router.push({
          path: '/admin/entryManage/check-detail',
          query: query
        });
      } else if (key === 'approval') {
        // 跳转到进站申请详情页面
        router.push('/admin/entryManage/approval');
      }
    };

    // 根据当前路由路径确定菜单高亮
    const getActiveMenu = () => {
      const currentPath = route.path;
      if (currentPath.includes('/approval')) {
        return 'approval';
      } else if (currentPath.includes('/check-detail')) {
        return 'check-detail';
      }
      return 'approval'; // 默认
    };

    const handleBack = () => {
      if (showDetail.value) {
        showDetail.value = false;
        studentInfo.value = null;
      } else {
        router.push("/admin/entryManage");
      }
    };

    const handleApprove = async () => {
      try {
        ElMessage.success("审核通过成功");
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          showDetail.value = false;
          studentInfo.value = null;
        }, 1500);
      } catch (error) {
        console.error("审核失败:", error);
        ElMessage.error("审核失败");
      }
    };

    const handleReject = async () => {
      try {
        ElMessage.warning("审核驳回成功");
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          showDetail.value = false;
          studentInfo.value = null;
        }, 1500);
      } catch (error) {
        console.error("审核失败:", error);
        ElMessage.error("审核失败");
      }
    };

    return () => (
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        {!showDetail.value ? (
          // 显示申请列表
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>进站申请管理</h2>
            </div>

            <ElRow gutter={12} style={{ marginBottom: "24px" }}>
              <ElCol span={2}>
                <ElButton type="primary" style={{ width: "100px", height: 44, fontWeight: 500, fontSize: 18 }} onClick={handleSearch}>搜索</ElButton>
              </ElCol>
              <ElCol span={6}>
                <ElInput v-model={searchValue.value} placeholder="请输入学号或姓名" style={{ height: 44 }} />
              </ElCol>
            </ElRow>

            <div style={{ marginTop: 24, width: "100%" }}>
              {loading.value ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
              ) : (
                <ElTable
                  data={pagedData.value}
                  border
                  style={{ width: "100%", background: "#fff", borderRadius: 8 }}
                  headerCellStyle={{ textAlign: "center", background: "#f7f8fa", fontWeight: 600, color: "#666", fontSize: 16 }}
                  cellStyle={{ textAlign: "center", fontSize: 15, color: "#222" }}
                >
                  <ElTableColumn prop="id" label="序号" width={80} align="center" />
                  <ElTableColumn prop="studentId" label="学号" align="center" />
                  <ElTableColumn prop="name" label="姓名" align="center" />
                  <ElTableColumn prop="college" label="所在学院" align="center" />
                  <ElTableColumn prop="major" label="学科专业" align="center" />
                  <ElTableColumn prop="applyTime" label="申请时间" align="center" />
                  <ElTableColumn prop="status" label="流程状态" align="center" />
                  <ElTableColumn prop="node" label="节点名称" align="center" />
                  <ElTableColumn prop="currentApproval" label="当前审批结果" align="center" />
                  <ElTableColumn label="操作" width={150} align="center" v-slots={{
                    default: (scope: { row: StudentData }) => (
                      <ElButton type="primary" size="small" onClick={() => handleDetail(scope.row)}>查看</ElButton>
                    ),
                  }} />
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
          </>
        ) : (
          // 显示申请详情表单
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>进站申请详情</h2>
            </div>

            {/* 进站申请内容 */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading.value ? (
                <div style={{ textAlign: "center", padding: "20px" }}>加载中...</div>
              ) : (
                <>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>1. 基本信息</h3>
                  <UserinfoRegister 
                    showResult={false}
                    externalUserInfo={studentInfo.value}
                    userRole="admin"
                  />
                  <ResearchForm
                    onSubmitSuccess={() => {
                      // 这里不需要做任何操作，因为管理员只是查看
                    }}
                    onBack={() => {}}
                    showButtons={false}
                    externalUserId={userId ? parseInt(userId) : undefined}
                    userRole="admin"
                  />
                </>
              )}
            </div>
          </>
        )}

        {/* 操作按钮 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px 0", borderTop: "1px solid #e4e7ed", marginTop: "auto" }}>
          <ElButton onClick={handleBack}>
            {showDetail.value ? '返回列表' : '返回'}
          </ElButton>
          {showDetail.value && (
            <>
              <ElButton type="danger" onClick={handleReject}>不通过</ElButton>
              <ElButton type="primary" onClick={handleApprove}>通过</ElButton>
            </>
          )}
        </div>
      </div>
    );
  },
});
