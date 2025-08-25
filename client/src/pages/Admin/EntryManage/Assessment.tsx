import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  ElMessage,
  ElRow,
  ElCol,
  ElPagination,
} from "element-plus";
import UserinfoRegister from "@/pages/EnterWorksation/form.tsx";
import ResearchForm from "@/pages/EnterWorksation/researchForm";
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
  name: "AdminEntryCheckDetail",
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 获取路由参数
    const userId = route.query.userId as string;

    const loading = ref(false);
    const studentInfo = ref<any>(null);
    const showDetail = ref(false);

    // 考核申请列表数据
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
        // 这里应该调用管理员的考核申请API接口
        // const response = await getAdminAssessmentList();
        // 暂时使用模拟数据
        const mockData: AssessmentData[] = [
          {
            id: 1,
            studentId: "20230001",
            name: "张三",
            college: "园艺林学学院",
            major: "园艺学",
            applyTime: "2025-09-01",
            status: "考核中",
            node: "考核小组",
            currentApproval: "考核小组（待处理）",
            steps: [
              { status: '发起' as const, role: '学生申请', time: '2025-09-01 10:00' },
              { status: '通过' as const, role: '合作导师', time: '2025-09-02 12:00' },
              { status: '考核中' as const, role: '考核小组' }
            ],
            user_id: 1,
            subject: "园艺学",
            cotutor: "李导师",
            allitutor: "王导师",
            workflow_status: "考核中"
          },
          {
            id: 2,
            studentId: "20230002",
            name: "李四",
            college: "园艺林学学院",
            major: "林学",
            applyTime: "2025-09-01",
            status: "考核中",
            node: "考核小组",
            currentApproval: "考核小组（待处理）",
            steps: [
              { status: '发起' as const, role: '学生申请', time: '2025-09-01 09:00' },
              { status: '通过' as const, role: '合作导师', time: '2025-09-01 10:00' },
              { status: '考核中' as const, role: '考核小组' }
            ],
            user_id: 2,
            subject: "林学",
            cotutor: "张导师",
            allitutor: "刘导师",
            workflow_status: "考核中"
          },
          {
            id: 3,
            studentId: "20230003",
            name: "王五",
            college: "园艺林学学院",
            major: "林学",
            applyTime: "2025-09-01",
            status: "考核中",
            node: "考核小组",
            currentApproval: "考核小组（待处理）",
            steps: [
              { status: '发起' as const, role: '学生申请', time: '2025-09-01 08:00' },
              { status: '通过' as const, role: '合作导师', time: '2025-09-01 09:00' },
              { status: '考核中' as const, role: '考核小组' }
            ],
            user_id: 3,
            subject: "林学",
            cotutor: "陈导师",
            allitutor: "赵导师",
            workflow_status: "考核中"
          }
        ];
        tableData.value = mockData;
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
    const handleDetail = (row: AssessmentData) => {
      console.log('查看考核详情:', row);
      studentInfo.value = row;
      showDetail.value = true;
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
    
    const form = ref({
      guideGroupOpinion: "",
      guideGroupDate: "",
      guideGroupLeader: "",
      staff: [
        { name: "", org: "", job: "", major: "", sign: "" },
        { name: "", org: "", job: "", major: "", sign: "" },
        { name: "", org: "", job: "", major: "", sign: "" },
      ],
      recordCheck: "",
      assessmentOpinion: "",
      assessmentLeader: "",
      assessmentDate: "",
      vote: "",
      stationOpinion: "",
      stationLeader: "",
      stationDate: "",
    });
    
    const addStaff = () => {
      form.value.staff.push({ name: "", org: "", job: "", major: "", sign: "" });
    };
    
    const removeStaff = (index: number) => {
      if (form.value.staff.length > 1) form.value.staff.splice(index, 1);
    };

    const handleSubmit = () => {
      ElMessage.success("提交成功");
      setTimeout(() => {
        showDetail.value = false;
        studentInfo.value = null;
      }, 1500);
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
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>进站考核详情</h2>
            </div>

            {/* 进站考核内容 */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading.value ? (
                <div style={{ textAlign: "center", padding: "20px" }}>加载中...</div>
              ) : (
                <UserinfoRegister 
                  showOtherDescription={false}
                  externalUserInfo={studentInfo.value}
                  userRole="admin"
                />
              )}

              {/* 第二部分 博士后研究项目情况 */}
              <div style={{ marginTop: "32px", background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)', padding: '2em 4em' }}>
                <div style={{ fontSize: "1.5em", fontWeight: 700, textAlign: "left", marginBottom: "1em", letterSpacing: "0.05em" }}>
                  二、博士后研究项目情况
                </div>
                <ElForm model={projectForm.value} labelWidth="120px">
                  <ElFormItem label="研究项目名称">
                    <ElInput v-model={projectForm.value.projectName} />
                  </ElFormItem>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <ElFormItem label="项目来源" style={{ flex: 1 }}>
                      <ElInput v-model={projectForm.value.projectSource} />
                    </ElFormItem>
                    <ElFormItem label="项目性质" style={{ flex: 1 }}>
                      <ElInput v-model={projectForm.value.projectType} />
                    </ElFormItem>
                  </div>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <ElFormItem label="批准时间" style={{ flex: 1 }}>
                      <ElInput v-model={projectForm.value.approvalTime} />
                    </ElFormItem>
                    <ElFormItem label="项目经费" style={{ flex: 1 }}>
                      <ElInput v-model={projectForm.value.projectFee} />
                    </ElFormItem>
                  </div>
                  <ElFormItem label="研究项目任务">
                    <ElInput v-model={projectForm.value.projectTask} type="textarea" rows={4} />
                  </ElFormItem>
                  <ElFormItem label="申请者对研究项目思路">
                    <ElInput v-model={projectForm.value.projectThought} type="textarea" rows={4} />
                  </ElFormItem>
                </ElForm>
              </div>

              {/* 第三部分 考核情况 */}
              <div style={{ marginTop: "32px", background: '#fff', borderRadius: '0.5em', boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)', padding: '2em 4em' }}>
                <div style={{ fontSize: "1.5em", fontWeight: 700, textAlign: "left", marginBottom: "1em", letterSpacing: "0.05em" }}>
                  三、考核情况
                </div>

                <div style={{ borderTop: "1px solid #333", padding: "16px", display: "flex" }}>
                  <ElFormItem label="考核组人员基本情况" style={{ marginBottom: 0 }}></ElFormItem>
                  <div>
                    <ElTable data={form.value.staff} border style={{ width: "100%", marginBottom: "8px" }}>
                      <ElTableColumn prop="name" label="姓名" width="120">
                        {{
                          default: ({ row, $index }: { row: any; $index: number }) => (
                            <ElInput v-model={row.name} placeholder="姓名" />
                          ),
                        }}
                      </ElTableColumn>
                      <ElTableColumn prop="org" label="工作单位" width="220">
                        {{
                          default: ({ row }: { row: any }) => (
                            <ElInput v-model={row.org} placeholder="工作单位" />
                          ),
                        }}
                      </ElTableColumn>
                      <ElTableColumn prop="job" label="职务或职称" width="140">
                        {{
                          default: ({ row }: { row: any }) => (
                            <ElInput v-model={row.job} placeholder="职务或职称" />
                          ),
                        }}
                      </ElTableColumn>
                      <ElTableColumn prop="major" label="专业及研究方向" width="240">
                        {{
                          default: ({ row }: { row: any }) => (
                            <ElInput v-model={row.major} placeholder="专业及研究方向" />
                          ),
                        }}
                      </ElTableColumn>
                      <ElTableColumn prop="sign" label="签字" width="150">
                        {{
                          default: ({ row }: { row: any }) => (
                            <ElInput v-model={row.sign} placeholder="签字" />
                          ),
                        }}
                      </ElTableColumn>
                      <ElTableColumn label="操作" width="100">
                        {{
                          default: ({ $index }: { $index: number }) => (
                            <ElButton
                              type="danger"
                              size="small"
                              onClick={() => removeStaff($index)}
                              disabled={form.value.staff.length === 1}
                            >
                              删除
                            </ElButton>
                          ),
                        }}
                      </ElTableColumn>
                    </ElTable>
                    <ElButton type="primary" plain onClick={addStaff} style={{ marginBottom: "16px" }}>
                      添加人员
                    </ElButton>
                  </div>
                </div>
                
                <div style={{ padding: "16px", minHeight: "180px", borderTop: "1px solid #333", borderBottom: "1px solid #333", position: "relative" }}>
                  <ElFormItem label="指导小组意见" style={{ marginBottom: 0 }}>
                    <ElInput type="textarea" v-model={form.value.guideGroupOpinion} autosize={{ minRows: 5 }} />
                  </ElFormItem>
                  <div style={{ display: "flex", gap: "16px", position: "absolute", right: "20px", bottom: "5px" }}>
                    <ElFormItem label="指导小组负责人(合作导师)签字" prop="guideGroupLeader" labelWidth={300}>
                      <ElInput v-model={form.value.guideGroupLeader} />
                    </ElFormItem>
                    <ElFormItem label="日期" prop="guideGroupDate">
                      <ElDatePicker
                        v-model={form.value.guideGroupDate}
                        type="date"
                        placeholder="选择日期"
                        style={{ width: "100%" }}
                      />
                    </ElFormItem>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
        }

        {/* 操作按钮 */}
        {/* <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px 0", borderTop: "1px solid #e4e7ed", marginTop: "auto" }}>
          <ElButton onClick={handleBack}>
            {showDetail.value ? '返回列表' : '返回'}
          </ElButton>
          {showDetail.value && (
            <>
              <ElButton onClick={handleSubmit} type="primary">提交</ElButton>
              <ElButton type="success">导出</ElButton>
            </>
          )}
        </div> */}
      </div>
    );
  },
});