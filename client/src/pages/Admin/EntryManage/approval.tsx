import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ElContainer,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElButton,
  ElMessage,
  ElRow,
  ElCol,
  ElInput,
  ElTable,
  ElTableColumn,
} from "element-plus";

// 引入博士后的申请页面组件
import UserinfoRegister from "../../../pages/EnterWorksation/form.tsx";
import ResearchForm from "../../../pages/EnterWorksation/researchForm.tsx";
import Audit from "../../../pages/EnterWorksation/audit.tsx";

// 引入API
import { getUserProfileById } from "@/api/postdoctor/userinfoRegister/bs_user_profile";

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

    // 列表数据
    const tableData = ref<StudentData[]>([]);
    const searchValue = ref("");

    // 搜索功能
    const handleSearch = () => {
      const keyword = searchValue.value.trim().toLowerCase();
      if (!keyword) {
        // 重新获取所有数据
        return;
      }
      // 这里可以添加搜索逻辑
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

    // 加载学生信息
    const loadStudentInfo = async () => {
      // 如果是从左侧导航点击进来的，总是显示详情页面结构
      const isFromNavigation = route.query.fromNavigation === 'true';
      
      if (!userId && !isFromNavigation) {
        // 只有在直接访问且没有userId时才加载学生列表
        return;
      }

      // 如果有userId或从导航点击进来，尝试加载学生信息
      if (userId && userId.trim() !== "") {
        try {
          loading.value = true;
          const data = await getUserProfileById(parseInt(userId));
          studentInfo.value = data;
          console.log("加载的学生信息:", data);
        } catch (error) {
          console.error("加载学生信息失败:", error);
          // 如果获取学生信息失败，保持页面结构，只是学生信息为空
          studentInfo.value = null;
          ElMessage.warning("未找到对应的学生信息，请检查用户ID是否正确");
        } finally {
          loading.value = false;
        }
      } else {
        // 没有userId但从导航点击进来，显示空表单
        studentInfo.value = null;
        loading.value = false;
      }
    };

    // 页面加载时获取学生信息
    onMounted(() => {
      loadStudentInfo();
    });

    const handleMenuClick = (key: string) => {
      // 根据当前路由和菜单项跳转到对应的详情页面
      if (key === 'assessment') {
        // 跳转到进站考核详情页面，传递当前的userId参数
        const query: any = {};
        if (userId) {
          query.userId = userId;
        }
        router.push({
          path: '/admin/entryManage/check-detail',
          query: query
        });
      } else if (key === 'apply') {
        // 跳转到进站申请详情页面
        router.push('/admin/entryManage/approval');
      }
    };

    // 根据当前路由路径确定菜单高亮
    const getActiveMenu = () => {
      const currentPath = route.path;
      if (currentPath.includes('/approval')) {
        return 'apply';
      } else if (currentPath.includes('/check-detail')) {
        return 'assessment';
      }
      return 'apply'; // 默认
    };

    const handleBack = () => {
      router.push("/admin/entryManage");
    };

    const handleApprove = async () => {
      try {
        ElMessage.success("审核通过成功");
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          router.push("/admin/entryManage");
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
          router.push("/admin/entryManage");
        }, 1500);
      } catch (error) {
        console.error("审核失败:", error);
        ElMessage.error("审核失败");
      }
    };

    return () => (
      <div style={{ height: '100%', padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>博士后进站申请</h2>
          </div>

          {/* 进站申请内容 */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {(userId && userId.trim() !== "") || route.query.fromNavigation === 'true' ? (
              // 显示单个用户详情（即使数据加载失败也显示页面结构）
              <>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>1. 基本信息</h3>
                {loading.value ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>加载中...</div>
                ) : (
                  <UserinfoRegister 
                    showResult={false}
                    externalUserInfo={studentInfo.value}
                    userRole="admin"
                  />
                )}
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
            ) : (
              // 显示学生列表（只有在直接访问且没有userId时才显示）
              <>
                <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", textAlign: "center" }}>进站申请管理</h2>
                
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
                      data={tableData.value}
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
              </>
            )}
          </div>

          {/* 操作按钮 */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px 0", borderTop: "1px solid #e4e7ed", marginTop: "auto" }}>
            <ElButton onClick={handleBack}>返回</ElButton>
            {userId && (
              <>
                <ElButton type="danger" onClick={handleReject}>不通过</ElButton>
                <ElButton type="primary" onClick={handleApprove}>通过</ElButton>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
});
