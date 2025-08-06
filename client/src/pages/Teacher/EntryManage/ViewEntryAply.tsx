import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import TeacherHeader from "../TeacherHeader";
import * as styles from "../../UserInfo/styles.css.ts";
import {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElButton,
  ElMessage,
} from "element-plus";

// 引入博士后的申请页面组件
import UserinfoRegister from "../../../pages/EnterWorksation/form.tsx";
import ResearchForm from "../../../pages/EnterWorksation/researchForm.tsx";
import Audit from "../../../pages/EnterWorksation/audit.tsx";

// 引入API
import { getUserProfileById } from "@/api/postdoctor/userinfoRegister/bs_user_profile";
import { approveApplication } from "@/api/enterWorkstation";

const menuList = [
  { label: "进站申请", key: "application" },
  { label: "进站考核", key: "assessment" },
];

export default defineComponent({
  name: "ViewEntryAply",
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 获取路由参数
    const userId = route.query.userId as string;

    // 菜单状态
    const activeMenu = ref("application");

    // 学生信息
    const studentInfo = ref<any>(null);
    const loading = ref(false);

    // 加载学生信息
    const loadStudentInfo = async () => {
      if (!userId) {
        ElMessage.error("缺少用户ID参数");
        return;
      }

      try {
        loading.value = true;
        const data = await getUserProfileById(parseInt(userId));
        studentInfo.value = data;
        console.log("加载的学生信息:", data);
      } catch (error) {
        console.error("加载学生信息失败:", error);
        ElMessage.error("加载学生信息失败");
      } finally {
        loading.value = false;
      }
    };

    // 页面加载时获取学生信息
    onMounted(() => {
      loadStudentInfo();
    });

    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
    };

    const handleBack = () => {
      router.push("/teacher");
    };

    const handleApprove = async () => {
      try {
        const response = await approveApplication(parseInt(userId), true, "审核通过");
        if (response.data) {
          ElMessage.success("审核通过成功");
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
        const response = await approveApplication(parseInt(userId), false, "审核不通过");
        if (response.data) {
          ElMessage.warning("审核驳回成功");
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

    return () => (
      <ElContainer style={{ minHeight: "100vh" }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <ElContainer>
          <ElAside width="15vw">
            <ElMenu
              defaultActive={activeMenu.value}
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
              class={styles.contentArea}
              style={{ padding: " 0px 24px 24px 24px" }}
            >
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
                {/* 进站申请 */}
                {activeMenu.value === "application" && (
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "20px",
                        textAlign: "center",
                      }}
                    >
                      博士后进站申请
                    </h2>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "16px",
                      }}
                    >
                      1. 基本信息
                    </h3>
                    {loading.value ? (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        加载中...
                      </div>
                    ) : (
                      <UserinfoRegister
                        externalUserInfo={studentInfo.value}
                        userRole="teacher"
                      />
                    )}
                    <ResearchForm
                      onSubmitSuccess={() => {
                        // 这里不需要做任何操作，因为导师只是查看
                      }}
                      onBack={() => {}}
                      showButtons={false}
                      externalUserId={parseInt(userId)}
                      userRole="teacher"
                    />
                  </div>
                )}

                {/* 进站考核 */}
                {activeMenu.value === "assessment" && (
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
                    <Audit onBack={() => {}} userRole="teacher" />
                  </div>
                )}

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
                  <ElButton type="danger" onClick={handleReject}>
                    不通过
                  </ElButton>
                  <ElButton type="primary" onClick={handleApprove}>
                    通过
                  </ElButton>
                </div>
              </div>
            </div>
          </ElMain>
        </ElContainer>
      </ElContainer>
    );
  },
});
