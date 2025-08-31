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
} from "element-plus";

// 引入博士后的申请页面组件
import UserinfoRegister from "@/pages/EnterWorksation/form.tsx";
import ResearchForm from "@/pages/EnterWorksation/researchForm.tsx";

// 引入API
// 获取所有需要管理员处理的学生的信息
import fetch from "@/api";
// 获取特定学生id的信息
import { getUserProfileById } from "@/api/postdoctor/userinfoRegister/bs_user_profile";
import { approveApplication } from "@/api/enterWorkstation";

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
        console.log("Fetching students for admin...",fetch.raw.GET);
        const res = await fetch.raw.GET("/workflow/my-pending-tasks");
        console.log("学生列表数据:", res.data);
        
        // 先打印出完整的响应数据结构，方便调试
        console.log('完整的API响应:', JSON.stringify(res.data, null, 2));
        
        // 使用类型断言处理数据
        const responseData = res.data as any;
        
        // 尝试提取workflows数据，不管它在哪个层级
        let workflows: any[] = [];
        
        // 检查可能的数据结构
        if (responseData) {
          if (Array.isArray(responseData)) {
            workflows = responseData;
          } else if (responseData.pending_workflows && Array.isArray(responseData.pending_workflows)) {
            workflows = responseData.pending_workflows;
          } else if (responseData.pending_processes && Array.isArray(responseData.pending_processes)) {
            workflows = responseData.pending_processes;
          } else if (responseData.data && Array.isArray(responseData.data)) {
            workflows = responseData.data;
          }
        }
        
        // 只过滤出进站申请相关的数据
        workflows = workflows.filter(item => {
          // 检查process_type字段是否包含entry_application或entry字样
          return item.process_type === 'entry_application'
        });
        
        console.log('过滤后的进站申请数据:', workflows);
        
        // 转换数据格式
        const formattedData: StudentData[] = workflows.map((item: any, index: number) => {
          return {
            id: index + 1,
            studentId: String(item.student_id || ''),
            name: item.student_name || '',
            college: '',  // 这些字段在API中可能没有，先设置为空
            major: '',
            applyTime: new Date().toLocaleDateString(),  // 可能需要从其他字段获取
            status: item.current_status || '',
            node: item.description || '',
            currentApproval: item.current_status || '',
            steps: [],
            user_id: item.student_id || 0,
            subject: '',
            cotutor: '',
            allitutor: '',
            workflow_status: item.current_status || '',
          };
        });
        
        tableData.value = formattedData;
        
        if (formattedData.length === 0) {
          console.warn('未找到有效数据或数据格式不符合预期', res.data);
        }
      } catch (error) {
        console.error('获取学生列表失败:', error);
        ElMessage.error('获取学生列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 搜索功能
    const handleSearch = () => {
      // trim() 删除字符串的前导和尾随空格以及行终止符 
      // toLowerCase() 将字符串转换为小写
      const keyword = searchValue.value.trim().toLowerCase();
      if (!keyword) {
        fetchStudents(); // 重新获取所有数据
        return;
      }
      // 这里可以添加搜索逻辑，或者直接重新获取数据
      tableData.value = tableData.value.filter(item => {
        return item.studentId.includes(keyword) || item.name.includes(keyword);
      });

    };

    // 处理详情按钮点击
    const handleDetail = async (row: StudentData) => {
      console.log('查看详情:', row);
      
      try {
        loading.value = true;
        // 使用学生ID获取完整的学生信息
        const data = await getUserProfileById(row.user_id);
        studentInfo.value = data;
        console.log("加载的学生详细信息:", data);
        showDetail.value = true;
      } catch (error) {
        console.error("加载学生详细信息失败:", error);
        ElMessage.error("获取学生详细信息失败");
        // 如果获取失败，仍然显示基本信息
        studentInfo.value = row;
        showDetail.value = true;
      } finally {
        loading.value = false;
      }
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

    const handleBack = () => {
      if (showDetail.value) {
        showDetail.value = false;
        studentInfo.value = null;
      } else {
        router.push("/admin/entryManage");
      }
    };

    const handleApprove = async () => {
      const userIdToUse = userId || studentInfo.value?.user_id;
      if (!userIdToUse) {
        ElMessage.error("缺少用户ID");
        return;
      }

      try {
        const response = await approveApplication(parseInt(userIdToUse), true, "进站申请通过", "进站申请");
        if (response.data) {
          ElMessage.success("进站申请审核通过成功");
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            showDetail.value = false;
            studentInfo.value = null;
          }, 1500);
        } else {
          ElMessage.error("审核失败: " + (response.error as Error)?.message || "未知错误");
        }
      } catch (error) {
        console.error("审核失败:", error);
        ElMessage.error("审核失败");
      }
    };

    const handleReject = async () => {
      const userIdToUse = userId || studentInfo.value?.user_id;
      if (!userIdToUse) {
        ElMessage.error("缺少用户ID");
        return;
      }

      try {
        const response = await approveApplication(parseInt(userIdToUse), false, "进站申请不通过", "进站申请");
        if (response.data) {
          ElMessage.warning("进站申请审核驳回成功");
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            showDetail.value = false;
            studentInfo.value = null;
          }, 1500);
        } else {
          ElMessage.error("审核失败: " + (response.error as Error)?.message || "未知错误");
        }
      } catch (error) {
        console.error("审核失败:", error);
        ElMessage.error("审核失败");
      }
    };

    return () => (
      <div>
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
          <div style={{ height: "100vh", overflowY: "auto", padding: "0 20px" }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>进站申请详情</h2>
            </div>

            {/* 进站申请内容 */}
            <div style={{ paddingBottom: "40px" }}>
              {loading.value ? (
                <div style={{ textAlign: "center", padding: "20px" }}>加载中...</div>
              ) : (
                <>
                  {/* 第一部分 基本信息 */}
                  <div style={{ background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)', padding: '2em 4em', marginBottom: '20px' }}>
                    <div style={{ fontSize: "1.5em", fontWeight: 700, textAlign: "left", marginBottom: "1em", letterSpacing: "0.05em" }}>
                      一、基本信息
                    </div>
                    <UserinfoRegister 
                      showResult={false}
                      externalUserInfo={studentInfo.value}
                      userRole="admin"
                    />
                  </div>

                  {/* 第二部分 研究项目情况 */}
                  <div style={{ background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)', padding: '2em 4em', marginBottom: '20px' }}>
                    <div style={{ fontSize: "1.5em", fontWeight: 700, textAlign: "left", marginBottom: "1em", letterSpacing: "0.05em" }}>
                      二、博士后研究项目情况
                    </div>
                    <ResearchForm
                      onSubmitSuccess={() => {
                        // 这里不需要做任何操作，因为管理员只是查看
                      }}
                      onBack={() => {}}
                      showButtons={false}
                      externalUserId={userId ? parseInt(userId) : undefined}
                      userRole="admin"
                    />
                  </div>

                  {/* 操作按钮区域 */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px 0", borderTop: "1px solid #e4e7ed", marginTop: "20px", background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)' }}>
                    <ElButton onClick={handleBack} size="large">
                      返回列表
                    </ElButton>
                    <ElButton type="danger" onClick={handleReject} size="large">不通过</ElButton>
                    <ElButton type="primary" onClick={handleApprove} size="large">通过</ElButton>
                  </div>
                  
                  {/* 调试信息 */}
                  <div style={{ padding: "10px", background: "#f0f0f0", marginTop: "10px", fontSize: "12px", color: "#666" }}>
                    调试信息: showDetail={String(showDetail.value)}, loading={String(loading.value)}, userId={userId || '无'}, studentInfo.user_id={studentInfo.value?.user_id || '无'}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
});
