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

    // 列表数据
    const tableData = ref<AssessmentData[]>([]);
    const searchValue = ref("");

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

    const handleApprove = async () => {
      try {
        ElMessage.success("考核通过成功");
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          showDetail.value = false;
          studentInfo.value = null;
        }, 1500);
      } catch (error) {
        console.error("考核失败:", error);
        ElMessage.error("考核失败");
      }
    };

    const handleReject = async () => {
      try {
        ElMessage.warning("考核驳回成功");
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          showDetail.value = false;
          studentInfo.value = null;
        }, 1500);
      } catch (error) {
        console.error("考核失败:", error);
        ElMessage.error("考核失败");
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
          <div style={{ height: "100vh", overflowY: "auto", padding: "0 20px" }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>进站考核详情</h2>
            </div>

            {/* 考核申请内容 */}
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

                  {/* 第三部分 考核评估信息 */}
                  <div style={{ background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)', padding: '2em 4em', marginBottom: '20px' }}>
                    <div style={{ fontSize: "1.5em", fontWeight: 700, textAlign: "left", marginBottom: "1em", letterSpacing: "0.05em" }}>
                      三、考核评估
                    </div>
                    
                    {/* 基本状态信息 */}
                    <div style={{ padding: '20px', border: '1px solid #e4e7ed', borderRadius: '8px', background: '#f8f9fa', marginBottom: '20px' }}>
                      <div style={{ fontSize: '16px', marginBottom: '15px' }}>
                        <strong>考核状态：</strong>
                        <span style={{ color: '#409eff', fontWeight: 'bold' }}>{studentInfo.value?.workflow_status || '待考核'}</span>
                      </div>
                      <div style={{ fontSize: '16px', marginBottom: '15px' }}>
                        <strong>当前节点：</strong>{studentInfo.value?.node || '考核小组'}
                      </div>
                      <div style={{ fontSize: '16px', marginBottom: '15px' }}>
                        <strong>申请时间：</strong>{studentInfo.value?.applyTime || new Date().toLocaleDateString()}
                      </div>
                    </div>

                    {/* 考核评估标准 */}
                    <div style={{ marginBottom: '25px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>考核评估标准：</h3>
                      <div style={{ background: '#fff', border: '1px solid #e1e6eb', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                          <strong>1. 学术背景评估：</strong>
                          <ul style={{ margin: '5px 0', paddingLeft: '20px', color: '#666' }}>
                            <li>博士学位获得情况及学术水平</li>
                            <li>相关研究经历和学术成果</li>
                            <li>专业知识储备和研究能力</li>
                          </ul>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <strong>2. 研究计划评估：</strong>
                          <ul style={{ margin: '5px 0', paddingLeft: '20px', color: '#666' }}>
                            <li>研究目标的明确性和可行性</li>
                            <li>研究方法的科学性和创新性</li>
                            <li>预期成果的价值和意义</li>
                          </ul>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <strong>3. 综合素质评估：</strong>
                          <ul style={{ margin: '5px 0', paddingLeft: '20px', color: '#666' }}>
                            <li>学术道德和职业素养</li>
                            <li>团队协作和沟通能力</li>
                            <li>独立研究和创新潜力</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 管理员评估区域 */}
                    <div style={{ background: '#f0f9ff', border: '2px solid #3b82f6', borderRadius: '8px', padding: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1e40af' }}>
                        📋 管理员评估决策
                      </h3>
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                          请根据以上学生的基本信息、研究项目情况以及考核评估标准，对该学生的进站考核申请做出评估：
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ padding: '15px', background: '#ffffff', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                          <div style={{ fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>✅ 建议通过条件：</div>
                          <ul style={{ margin: 0, paddingLeft: '16px', color: '#4b5563', fontSize: '14px' }}>
                            <li>学术背景符合要求</li>
                            <li>研究计划可行且有价值</li>
                            <li>材料完整真实</li>
                            <li>具备独立研究能力</li>
                          </ul>
                        </div>
                        <div style={{ padding: '15px', background: '#ffffff', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                          <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '8px' }}>❌ 建议驳回条件：</div>
                          <ul style={{ margin: 0, paddingLeft: '16px', color: '#4b5563', fontSize: '14px' }}>
                            <li>学术背景不符合要求</li>
                            <li>研究计划不够完善</li>
                            <li>材料不完整或有问题</li>
                            <li>不具备相应研究能力</li>
                          </ul>
                        </div>
                      </div>

                      <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '6px', border: '1px solid #f59e0b' }}>
                        <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
                          💡 提示：请仔细审查学生提交的材料，确保信息的真实性和完整性，并根据本站的招收标准做出客观公正的评估。
                        </div>
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