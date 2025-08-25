import UserinfoRegister from "@/pages/EnterWorksation/form.tsx";
import { defineComponent, ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import TeacherHeader from "../TeacherHeader";
import {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  ElMessage,
} from "element-plus";
import * as styles from "./styles.css";
import ResearchForm from "@/pages/EnterWorksation/researchForm";
import { getUserProfileById } from "@/api/postdoctor/userinfoRegister/bs_user_profile";
import { getStudentEnterAssessment, approveApplication } from "@/api/enterWorkstation";

const menuList = [
  { label: "进站申请", key: "apply" },
  { label: "进站考核", key: "assessment" },
];

export default defineComponent({
  name: "ViewEntryCheck",
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 获取路由参数
    const userId = route.query.userId as string;



    const loading = ref(false);
    const studentInfo = ref<any>(null);
    const assessmentData = ref<any>(null);

    // 加载学生信息
    const loadStudentInfo = async () => {
      if (!userId) {
        // 如果没有userId，直接显示考核表单
        return;
      }

      try {
        loading.value = true;
        const data = await getUserProfileById(parseInt(userId));
        studentInfo.value = data;
        console.log("加载的学生信息:", data);
      } catch (error) {
        console.error("加载学生信息失败:", error);
        // 如果获取学生信息失败，显示提示但不影响页面展示
        ElMessage.warning("未找到对应的学生信息，请检查用户ID是否正确");
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

    // 页面加载时获取学生信息和进站考核数据
    onMounted(() => {
      loadStudentInfo();
      loadAssessmentData();
    });

    const handleMenuClick = async (key: string) => {
      // 根据当前路由和菜单项跳转到对应的详情页面
      if (key === 'apply') {
        // 跳转到进站申请详情页面，传递当前的userId参数
        const query: any = {
          fromNavigation: 'true' // 标识这是从导航点击进来的
        };
        if (userId) {
          query.userId = userId;
        }
        router.push({
          path: '/teacher/entryManage/approval',
          query: query
        });
      } else if (key === 'assessment') {
        // 检查用户是否提交了进站考核
        if (userId) {
          try {
            const response = await getStudentEnterAssessment(parseInt(userId));
            if (!response.data) {
              // 用户没有提交进站考核，显示警告消息
              ElMessage.warning("此学生还未提交进站考核");
              return;
            }
          } catch (error) {
            console.error('检查进站考核数据失败:', error);
            // 如果检查失败，也显示警告消息
            ElMessage.warning("此学生还未提交进站考核");
            return;
          }
        }
        // 跳转到进站考核详情页面
        router.push('/teacher/entryManage/check-detail');
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
      return 'assessment'; // 默认
    };

    const handleBack = () => {
      router.push("/teacher");
    };

    const handleApprove = async () => {
      try {
        const response = await approveApplication(parseInt(userId), true, "进站考核通过", "进站考核");
        if (response.data) {
          ElMessage.success("进站考核审核通过成功");
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            router.push("/teacher");
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
      try {
        const response = await approveApplication(parseInt(userId), false, "进站考核不通过", "进站考核");
        if (response.data) {
          ElMessage.warning("进站考核审核驳回成功");
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            router.push("/teacher");
          }, 1500);
        } else {
          ElMessage.error("审核失败: " + (response.error as Error)?.message || "未知错误");
        }
      } catch (error) {
        console.error("审核失败:", error);
        ElMessage.error("审核失败");
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
    const form = reactive({
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
      form.staff.push({ name: "", org: "", job: "", major: "", sign: "" });
    };
    const removeStaff = (index: number) => {
      if (form.staff.length > 1) form.staff.splice(index, 1);
    };

    return () => (
      <ElContainer style={{ minHeight: "100vh" }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <ElContainer>
          <ElAside width="15vw">
            <ElMenu
              defaultActive={getActiveMenu()}
              class="el-menu-vertical"
              onSelect={handleMenuClick}
            >
              {menuList.map((item) => (
                <ElMenuItem index={item.key}>{item.label}</ElMenuItem>
              ))}
            </ElMenu>
          </ElAside>
          <ElMain style={{ padding: " 0px 24px 24px 24px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "24px",
                height: "calc(100vh - 200px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 进站考核内容 */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  进站考核
                </h2>
                {loading.value ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    加载中...
                  </div>
                ) : (
                  <UserinfoRegister 
                    showOtherDescription={false}
                    externalUserInfo={studentInfo.value}
                    userRole="teacher"
                  />
                )}

                {/* 第二部分 博士后研究项目情况 */}
                <div class={styles.formWrapper} style={{ marginTop: "32px" }}>
                  <div
                    style={{
                      fontSize: "1.5em",
                      fontWeight: 700,
                      textAlign: "left",
                      marginBottom: "1em",
                      letterSpacing: "0.05em",
                    }}
                  >
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
                <div class={styles.formWrapper} style={{ marginTop: "32px" }}>
                  <div
                    style={{
                      fontSize: "1.5em",
                      fontWeight: 700,
                      textAlign: "left",
                      marginBottom: "1em",
                      letterSpacing: "0.05em",
                    }}
                  >
                    三、考核情况
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #333",
                      padding: "16px",
                      display: "flex",
                    }}
                  >
                    <ElFormItem
                      label="考核组人员基本情况"
                      style={{ marginBottom: 0 }}
                    ></ElFormItem>
                    <div>
                      <ElTable
                        data={form.staff}
                        border
                        style={{ width: "100%", marginBottom: "8px" }}
                      >
                        <ElTableColumn prop="name" label="姓名" width="120">
                          {{
                            default: ({
                              row,
                              $index,
                            }: {
                              row: any;
                              $index: number;
                            }) => (
                              <ElInput
                                v-model={row.name}
                                placeholder="姓名"
                              />
                            ),
                          }}
                        </ElTableColumn>
                        <ElTableColumn
                          prop="org"
                          label="工作单位"
                          width="220"
                        >
                          {{
                            default: ({ row }: { row: any }) => (
                              <ElInput
                                v-model={row.org}
                                placeholder="工作单位"
                              />
                            ),
                          }}
                        </ElTableColumn>
                        <ElTableColumn
                          prop="job"
                          label="职务或职称"
                          width="140"
                        >
                          {{
                            default: ({ row }: { row: any }) => (
                              <ElInput
                                v-model={row.job}
                                placeholder="职务或职称"
                              />
                            ),
                          }}
                        </ElTableColumn>
                        <ElTableColumn
                          prop="major"
                          label="专业及研究方向"
                          width="240"
                        >
                          {{
                            default: ({ row }: { row: any }) => (
                              <ElInput
                                v-model={row.major}
                                placeholder="专业及研究方向"
                              />
                            ),
                          }}
                        </ElTableColumn>
                        <ElTableColumn prop="sign" label="签字" width="150">
                          {{
                            default: ({ row }: { row: any }) => (
                              <ElInput
                                v-model={row.sign}
                                placeholder="签字"
                              />
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
                                disabled={form.staff.length === 1}
                              >
                                删除
                              </ElButton>
                            ),
                          }}
                        </ElTableColumn>
                      </ElTable>
                      <ElButton
                        type="primary"
                        plain
                        onClick={addStaff}
                        style={{ marginBottom: "16px" }}
                      >
                        添加人员
                      </ElButton>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      minHeight: "180px",
                      borderTop: "1px solid #333",
                      borderBottom: "1px solid #333",
                      position: "relative",
                    }}
                  >
                    <ElFormItem
                      label="指导小组意见"
                      style={{ marginBottom: 0 }}
                    >
                      <ElInput
                        type="textarea"
                        v-model={form.guideGroupOpinion}
                        autosize={{ minRows: 5 }}
                      />
                    </ElFormItem>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        position: "absolute",
                        right: "20px",
                        bottom: "5px",
                      }}
                    >
                      <ElFormItem
                        label="指导小组负责人(合作导师)签字"
                        prop="guideGroupLeader"
                        labelWidth={300}
                      >
                        <ElInput v-model={form.guideGroupLeader} />
                      </ElFormItem>
                      <ElFormItem label="日期" prop="guideGroupDate">
                        <ElDatePicker
                          v-model={form.guideGroupDate}
                          type="date"
                          placeholder="选择日期"
                          style={{ width: "100%" }}
                        />
                      </ElFormItem>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  padding: "20px 0",
                  borderTop: "1px solid #e4e7ed",
                  marginTop: "auto",
                }}
              >
                <ElButton onClick={handleBack}>返回</ElButton>
                {userId && (
                  <>
                    <ElButton type="danger" onClick={handleReject}>
                      不通过
                    </ElButton>
                    <ElButton type="primary" onClick={handleApprove}>
                      通过
                    </ElButton>
                  </>
                )}
              </div>
            </div>
          </ElMain>
        </ElContainer>
      </ElContainer>
    );
  },
});
