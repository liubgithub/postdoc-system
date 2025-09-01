import { defineComponent, ref, onMounted, computed, reactive } from "vue";
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
import UserinfoRegister from "@/pages/EnterWorksation/form.tsx";
import ResearchForm from "@/pages/EnterWorksation/researchForm.tsx";

// 引入API
// 获取所有需要管理员处理的学生的信息
import fetch from "@/api";
// 获取特定学生id的信息
import { getUserProfileById } from "@/api/postdoctor/userinfoRegister/bs_user_profile";
import { getStudentEnterAssessment, adminApproveApplication } from "@/api/enterWorkstation";

// 定义考核申请数据类型
interface AssessmentData {
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
  name: "AdminEntryAssessment",
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 获取路由参数
    const userId = route.query.userId as string;

    // 学生信息
    const studentInfo = ref<any>(null);
    const loading = ref(false);
    const showDetail = ref(false);
    const assessmentData = ref<any>(null);

    // 列表数据
    const tableData = ref<AssessmentData[]>([]);
    const searchValue = ref("");

    // 第二部分表单数据
    const projectForm = ref({
      projectName: "", //研究项目名称
      projectSource: "", //项目来源
      projectType: "", //项目性质
      approvalTime: "", //批准时间
      projectFee: "", //项目经费
      projectTask: "", //研究项目任务
      projectThought: "", //申请者对研究项目思路
    });

    // 考核情况表单数据
    const form = reactive({
      guideGroupOpinion: "",
      guideGroupDate: "",
      guideGroupLeader: "",
      staff: [
        { name: "", org: "", job: "", major: "", sign: "" },
        { name: "", org: "", job: "", major: "", sign: "" },
        { name: "", org: "", job: "", major: "", sign: "" },
      ],
    });

    // 考核组人员管理函数
    const addStaff = () => {
      form.staff.push({ name: "", org: "", job: "", major: "", sign: "" });
    };

    const removeStaff = (index: number) => {
      if (form.staff.length > 1) form.staff.splice(index, 1);
    };

    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return tableData.value.slice(start, start + pageSize);
    });

    // 获取考核申请列表
    const fetchAssessmentList = async () => {
      loading.value = true;
      try {
        console.log("Fetching assessment data for admin...", fetch.raw.GET);
        const res = await fetch.raw.GET("/workflow/my-pending-tasks");
        console.log("考核列表数据:", res.data);
        
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
        
        // 只过滤出进站考核相关的数据
        workflows = workflows.filter(item => {
          // 检查process_type字段是否包含entry_assessment或assessment字样
          return item.process_type === 'entry_assessment'
        });
        
        console.log('过滤后的进站考核数据:', workflows);
        
        // 转换数据格式
        const formattedData: AssessmentData[] = workflows.map((item: any, index: number) => {
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
        console.error('获取考核申请列表失败:', error);
        ElMessage.error('获取考核申请列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 搜索功能
    const handleSearch = () => {
      const keyword = searchValue.value.trim().toLowerCase();
      if (!keyword) {
        fetchAssessmentList(); // 重新获取所有数据
        return;
      }
      // 这里可以添加搜索逻辑，或者直接重新获取数据
      fetchAssessmentList();
    };

    // 处理详情按钮点击
    const handleDetail = async (row: AssessmentData) => {
      console.log('查看考核详情:', row);
      
      try {
        loading.value = true;
        // 使用学生ID获取完整的学生信息
        const data = await getUserProfileById(row.user_id);
        studentInfo.value = data;
        console.log("加载的学生详细信息:", data);
        showDetail.value = true;
        // 同时加载考核数据
        await loadAssessmentData();
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

    // 加载学生进站考核数据
    const loadAssessmentData = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await getStudentEnterAssessment(parseInt(userId));
        if (response.data) {
          assessmentData.value = response.data;
          console.log("加载的进站考核数据:", response.data);
          
          // 将后端数据映射到表单字段
          projectForm.value.projectName = response.data.project_name || "";
          projectForm.value.projectSource = response.data.project_source || "";
          projectForm.value.projectType = response.data.project_type || "";
          projectForm.value.approvalTime = response.data.approval_time || "";
          projectForm.value.projectFee = response.data.project_fee || "";
          projectForm.value.projectTask = response.data.project_task || "";
          projectForm.value.projectThought = response.data.project_thought || "";
        } else if (response.error) {
          console.error("获取进站考核数据失败:", response.error);
          ElMessage.warning("未找到对应的进站考核数据");
        }
      } catch (error) {
        console.error("加载进站考核数据失败:", error);
        ElMessage.warning("获取进站考核数据失败");
      }
    };

    // 加载学生信息
    const loadStudentInfo = async () => {
      if (!userId) {
        // 如果没有userId，显示考核申请列表
        fetchAssessmentList();
        return;
      }

      try {
        loading.value = true;
        const data = await getUserProfileById(parseInt(userId));
        studentInfo.value = data;
        console.log("加载的学生信息:", data);
        showDetail.value = true;
        // 同时加载考核数据
        await loadAssessmentData();
      } catch (error) {
        console.error("加载学生信息失败:", error);
        ElMessage.warning("未找到对应的学生信息，请检查用户ID是否正确");
        // 如果获取学生信息失败，显示考核申请列表
        fetchAssessmentList();
      } finally {
        loading.value = false;
      }
    };

    // 页面加载时获取数据
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

    // 管理员审批通过
    const handleApprove = async () => {
      if (!userId && !studentInfo.value?.user_id) {
        ElMessage.error("缺少用户ID");
        return;
      }

      const userIdToUse = userId ? parseInt(userId) : studentInfo.value.user_id;

      try {
        loading.value = true;
        // 使用管理员审批接口，更新进站考核状态为"通过"
        const response = await adminApproveApplication("entry_assessment", "通过", userIdToUse, "进站考核通过");
        if (response.data) {
          ElMessage.success("进站考核审核通过成功");
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            showDetail.value = false;
            studentInfo.value = null;
            // 重新获取列表数据
            fetchAssessmentList();
          }, 1500);
        } else if (response.error) {
          console.error("考核失败:", response.error);
          ElMessage.error("考核失败: " + (response.error as Error)?.message || "未知错误");
        }
      } catch (error) {
        console.error("考核失败:", error);
        ElMessage.error("考核失败: " + (error as Error)?.message || "未知错误");
      } finally {
        loading.value = false;
      }
    };

    // 管理员审批不通过
    const handleReject = async () => {
      if (!userId && !studentInfo.value?.user_id) {
        ElMessage.error("缺少用户ID");
        return;
      }

      const userIdToUse = userId ? parseInt(userId) : studentInfo.value.user_id;

      try {
        loading.value = true;
        // 使用管理员审批接口，更新进站考核状态为"不通过"
        const response = await adminApproveApplication("entry_assessment", "不通过", userIdToUse, "进站考核不通过");
        if (response.data) {
          ElMessage.warning("进站考核审核驳回成功");
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            showDetail.value = false;
            studentInfo.value = null;
            // 重新获取列表数据
            fetchAssessmentList();
          }, 1500);
        } else if (response.error) {
          console.error("考核失败:", response.error);
          ElMessage.error("考核失败: " + (response.error as Error)?.message || "未知错误");
        }
      } catch (error) {
        console.error("考核失败:", error);
        ElMessage.error("考核失败: " + (error as Error)?.message || "未知错误");
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <div>
        {!showDetail.value ? (
          // 显示考核申请列表
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>进站考核管理</h2>
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
                    default: (scope: { row: AssessmentData }) => (
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
          // 显示考核详情表单
          <div style={{ height: "80vh", display: "flex", flexDirection: "column", padding: "0 20px" }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>进站考核详情</h2>
            </div>

            {/* 考核申请内容 - 可滚动区域 */}
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
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
                    <ElForm model={projectForm.value} labelWidth="120px">
                      <ElFormItem label="研究项目名称">
                        <ElInput 
                          v-model={projectForm.value.projectName} 
                          readonly 
                          disabled
                          style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                        />
                      </ElFormItem>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <ElFormItem label="项目来源" style={{ flex: 1 }}>
                          <ElInput 
                            v-model={projectForm.value.projectSource} 
                            readonly 
                            disabled
                            style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                          />
                        </ElFormItem>
                        <ElFormItem label="项目性质" style={{ flex: 1 }}>
                          <ElInput 
                            v-model={projectForm.value.projectType} 
                            readonly 
                            disabled
                            style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                          />
                        </ElFormItem>
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <ElFormItem label="批准时间" style={{ flex: 1 }}>
                          <ElInput 
                            v-model={projectForm.value.approvalTime} 
                            readonly 
                            disabled
                            style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                          />
                        </ElFormItem>
                        <ElFormItem label="项目经费" style={{ flex: 1 }}>
                          <ElInput 
                            v-model={projectForm.value.projectFee} 
                            readonly 
                            disabled
                            style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                          />
                        </ElFormItem>
                      </div>
                      <ElFormItem label="研究项目任务">
                        <ElInput
                          v-model={projectForm.value.projectTask}
                          type="textarea"
                          rows={4}
                          readonly
                          disabled
                          style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                        />
                      </ElFormItem>
                      <ElFormItem label="申请者对研究项目思路">
                        <ElInput
                          v-model={projectForm.value.projectThought}
                          type="textarea"
                          rows={4}
                          readonly
                          disabled
                          style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                        />
                      </ElFormItem>
                    </ElForm>
                  </div>

                  {/* 第三部分 考核情况 */}
                  <div style={{ background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)', padding: '2em 4em', marginBottom: '20px' }}>
                    <div style={{ fontSize: "1.5em", fontWeight: 700, textAlign: "left", marginBottom: "1em", letterSpacing: "0.05em" }}>
                      三、考核情况
                    </div>
                    
                    {/* 考核组人员基本情况 */}
                    <div style={{ borderTop: "1px solid #333", padding: "16px", display: "flex" }}>
                      <ElFormItem label="考核组人员基本情况" style={{ marginBottom: 0 }}></ElFormItem>
                      <div>
                        <ElTable
                          data={form.staff}
                          border
                          style={{ width: "100%", marginBottom: "8px" }}
                        >
                          <ElTableColumn prop="name" label="姓名" width="120">
                            {{
                              default: ({ row, $index }: { row: any; $index: number }) => (
                                <ElInput
                                  v-model={row.name}
                                  placeholder="姓名"
                                  readonly={true}
                                  style={{ backgroundColor: "#f5f5f5" }}
                                />
                              )
                            }}
                          </ElTableColumn>
                          <ElTableColumn prop="org" label="工作单位" width="220">
                            {{
                              default: ({ row }: { row: any }) => (
                                <ElInput
                                  v-model={row.org}
                                  placeholder="工作单位"
                                  readonly={true}
                                  style={{ backgroundColor: "#f5f5f5" }}
                                />
                              )
                            }}
                          </ElTableColumn>
                          <ElTableColumn prop="job" label="职务或职称" width="140">
                            {{
                              default: ({ row }: { row: any }) => (
                                <ElInput
                                  v-model={row.job}
                                  placeholder="职务或职称"
                                  readonly={true}
                                  style={{ backgroundColor: "#f5f5f5" }}
                                />
                              )
                            }}
                          </ElTableColumn>
                          <ElTableColumn prop="major" label="专业及研究方向" width="240">
                            {{
                              default: ({ row }: { row: any }) => (
                                <ElInput
                                  v-model={row.major}
                                  placeholder="专业及研究方向"
                                  readonly={true}
                                  style={{ backgroundColor: "#f5f5f5" }}
                                />
                              )
                            }}
                          </ElTableColumn>
                          <ElTableColumn prop="sign" label="签字" width="150">
                            {{
                              default: ({ row }: { row: any }) => (
                                <ElInput
                                  v-model={row.sign}
                                  placeholder="签字"
                                  readonly={true}
                                  style={{ backgroundColor: "#f5f5f5" }}
                                />
                              )
                            }}
                          </ElTableColumn>
                        </ElTable>
                        <div style={{ marginBottom: "16px", color: "#999", fontSize: "14px" }}>
                          注：管理员查看模式，考核组信息由老师填写
                        </div>
                      </div>
                    </div>

                    {/* 指导小组意见 */}
                    <div style={{ padding: "16px", minHeight: "180px", borderTop: "1px solid #333", borderBottom: "1px solid #333", position: "relative" }}>
                      <ElFormItem label="指导小组意见" style={{ marginBottom: 0 }}>
                        <ElInput
                          type="textarea"
                          v-model={form.guideGroupOpinion}
                          autosize={{ minRows: 5 }}
                          readonly={true}
                          style={{ backgroundColor: "#f5f5f5" }}
                        />
                      </ElFormItem>
                      <div style={{ display: "flex", gap: "16px", position: "absolute", right: "20px", bottom: "5px" }}>
                        <ElFormItem label="指导小组负责人(合作导师)签字" prop="guideGroupLeader" labelWidth={300}>
                          <ElInput 
                            v-model={form.guideGroupLeader} 
                            readonly={true}
                            style={{ backgroundColor: "#f5f5f5" }}
                          />
                        </ElFormItem>
                        <ElFormItem label="日期" prop="guideGroupDate">
                          <ElDatePicker
                            v-model={form.guideGroupDate}
                            type="date"
                            placeholder="选择日期"
                            disabled={true}
                            style={{ width: "100%" }}
                          />
                        </ElFormItem>
                      </div>
                    </div>
                  </div>
                  {/* 操作按钮区域 */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px 0", borderTop: "1px solid #e4e7ed", marginTop: "20px", background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)' }}>
                    <ElButton onClick={handleBack} size="large">
                返回列表
              </ElButton>
              <ElButton type="danger" onClick={handleReject} size="large">不通过</ElButton>
              <ElButton type="primary" onClick={handleApprove} size="large">通过</ElButton>
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