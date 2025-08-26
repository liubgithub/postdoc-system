import { defineComponent, ref, onMounted } from "vue";
import { computed } from "vue";
import {
  ElContainer,
  ElHeader,
  ElButton,
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElDialog,
  ElMessage,
} from "element-plus";
import * as styles from "../UserInfo/styles.css.ts";
import useUser from "@/stores/user";
import { useRouter, useRoute, RouterView } from "vue-router";
import TeacherHeader from "./TeacherHeader";
import ProcessStatus from "@/units/ProcessStatus";
import {
  getTeacherApplications,
  approveApplication,
} from "@/api/enterWorkstation";

// 定义申请数据的类型 - 适配后端返回的数据结构
interface ApplicationData {
  id: number;
  studentId: string; // 学号
  name: string; // 姓名（对应发起人）
  college: string; // 学院
  major: string; // 专业
  applyTime: string; // 申请时间（对应提交时间）
  status: string; // 状态
  node: string; // 当前节点
  currentApproval: string; // 当前审核
  steps: any[]; // 流程步骤
  user_id: number;
  subject: string;
  cotutor: string;
  allitutor: string; // 联合导师
  workflow_status: string;
  business_type: string; // 业务类型：进站申请 或 进站考核
}


export default defineComponent({
  name: "TeacherPage",
  setup() {
    const router = useRouter();
    const showProcessDialog = ref(false);
    const currentSelectedRow = ref<ApplicationData | null>(null);

    // 处理状态过滤
    const filterStatus = ref("审核中");
    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);

    // 真实数据
    const tableData = ref<ApplicationData[]>([]);
    const loading = ref(false);

    const filteredData = computed(() => {
      if (filterStatus.value === "审核中") {
        // 显示待处理的项目：状态为"审核中"或"未提交"
        return tableData.value.filter(
          (row) => row.status === "审核中" || row.status === "未提交"
        );
      } else if (filterStatus.value === "已处理") {
        // 显示已处理的项目：状态为"审核通过"或"审核不通过"
        return tableData.value.filter((row) => row.status === "审核通过" || row.status === "审核不通过");
      }
      return tableData.value;
    });
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredData.value.slice(start, start + pageSize);
    });
    const summary = ref({
      postdocCount: 125,
      latestAchievement: 78,
      outCount: 32,
      delayCount: 7,
    });

    // 获取申请列表
    const fetchApplications = async () => {
      loading.value = true;
      try {
        const response = await getTeacherApplications();
        console.log("API响应:", response);
        if (response.data) {
          tableData.value = response.data as ApplicationData[];
        } else if (response.error) {
          ElMessage.error("获取申请列表失败");
        }
      } catch (error) {
        console.error("获取申请列表失败:", error);
        ElMessage.error("获取申请列表失败");
      } finally {
        loading.value = false;
      }
    };

    // 处理详情按钮点击
    const handleDetail = (row: ApplicationData) => {
      console.log("查看详情:", row);

      // 根据业务类型跳转到不同的详情页面
      if (row.business_type === "进站申请") {
        // 跳转到进站申请详情页面
        router.push({
          path: "/teacher/entryManage/approval",
          query: {
            userId: row.user_id.toString(),
            type: "detail",
          },
        });
      } else if (row.business_type === "进站考核") {
        // 跳转到进站考核详情页面
        router.push({
          path: "/teacher/entryManage/check-detail",
          query: {
            userId: row.user_id.toString(),
            type: "detail",
            business_type: "进站考核",
          },
        });
      } else if (row.business_type === "中期考核") {
        // 跳转到中期考核详情页面
        router.push({
          path: "/teacher/inManage/viewMiddleCheck",
          query: {
            userId: row.user_id.toString(),
            studentId: row.studentId,
            name: row.name,
            college: row.college || "",
            major: row.major || "",
            applyTime: row.applyTime,
          },
        });
      } else if (row.business_type === "年度考核") {
        // 跳转到年度考核详情页面
        router.push({
          path: "/teacher/inManage/viewYearCheck",
          query: {
            userId: row.user_id.toString(),
            studentId: row.studentId,
            name: row.name,
            college: row.college || "",
            major: row.major || "",
            applyTime: row.applyTime,
          },
        });
      } else if (row.business_type === "延期考核") {
        // 跳转到延期考核详情页面
        router.push({
          path: "/teacher/inManage/viewExtensionCheck",
          query: {
            userId: row.user_id.toString(),
            studentId: row.studentId,
            name: row.name,
            college: row.college || "",
            major: row.major || "",
            applyTime: row.applyTime,
          },
        });
      } else {
        ElMessage.warning("未知的业务类型");
      }
    };

    const handleView = (row: ApplicationData) => {
      // 保存当前选中的行数据
      currentSelectedRow.value = row;
      // 设置流程状态，确保类型匹配
      showProcessDialog.value = true;
    };

    // 页面加载时获取数据
    onMounted(() => {
      fetchApplications();
    });

    return () => (
      <ElContainer style={{ minHeight: "100vh" }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <div class={styles.contentArea}>
          <div
            style={{
              background: "#fff",
              padding: "24px",
              height: "calc(100vh - 20vh - 40px)", // 减去头部高度和contentArea的padding
              overflow: "hidden", // 防止外层容器出现滚动条
            }}
          >
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <ElButton
                type="primary"
                plain={filterStatus.value !== "审核中"}
                style={{
                  background:
                    filterStatus.value === "审核中" ? "#0033cc" : "#fff",
                  color: filterStatus.value === "审核中" ? "#fff" : "#0033cc",
                  borderColor: "#0033cc",
                }}
                onClick={() => {
                  filterStatus.value = "审核中";
                  currentPage.value = 1;
                }}
              >
                待处理
              </ElButton>
              <ElButton
                type="primary"
                plain={filterStatus.value !== "已处理"}
                style={{
                  background:
                    filterStatus.value === "已处理" ? "#0033cc" : "#fff",
                  color: filterStatus.value === "已处理" ? "#fff" : "#0033cc",
                  borderColor: "#0033cc",
                }}
                onClick={() => {
                  filterStatus.value = "已处理";
                  currentPage.value = 1;
                }}
              >
                已处理
              </ElButton>
            </div>
            {loading.value && (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#666" }}
              >
                加载中...
              </div>
            )}
            <div
              style={{
                height: "calc(100% - 60px)", // 减去按钮区域的高度
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              <ElTable
                data={pagedData.value}
                border
                stripe
                style={{ width: "100%" }}
              >
                <ElTableColumn
                  label="序号"
                  width="80"
                  align="center"
                  v-slots={{
                    default: (scope: { $index: number }) =>
                      (currentPage.value - 1) * pageSize + scope.$index + 1,
                  }}
                />
                <ElTableColumn
                  label="业务类型"
                  align="center"
                  v-slots={{
                    default: (scope: { row: ApplicationData }) => scope.row.business_type || "进站申请",
                  }}
                />
                <ElTableColumn prop="name" label="发起人" align="center" />
                <ElTableColumn
                  prop="applyTime"
                  label="提交时间"
                  align="center"
                />
                <ElTableColumn prop="status" label="流程状态" align="center" />
                <ElTableColumn
                  label="操作"
                  align="center"
                  v-slots={{
                    default: (scope: { row: ApplicationData }) => (
                      <>
                        <ElButton
                          size="small"
                          onClick={() => handleDetail(scope.row)}
                        >
                          详情
                        </ElButton>
                        <ElButton
                          size="small"
                          type="primary"
                          onClick={() => handleView(scope.row)}
                        >
                          查看
                        </ElButton>
                      </>
                    ),
                  }}
                />
              </ElTable>
              {/* 分页器 */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <ElPagination
                  background
                  layout="prev, pager, next"
                  pageSize={pageSize}
                  total={filteredData.value.length}
                  v-model:current-page={currentPage.value}
                  hideOnSinglePage={false}
                />
              </div>
              {/* 新增统计卡片 */}
              <div
                style={{
                  marginTop: "40px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    letterSpacing: 2,
                  }}
                >
                  数据统计
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "40px",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "0px",
                  maxWidth: "600px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {[
                  { label: "在站人数", value: summary.value.postdocCount },
                  { label: "科研成果", value: summary.value.latestAchievement },
                  { label: "出站人数", value: summary.value.outCount },
                  { label: "延期人数", value: summary.value.delayCount },
                ].map((item) => (
                  <div
                    style={{
                      border: "1px solid #aaa",
                      borderRadius: "16px",
                      width: "260px",
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        letterSpacing: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "3.5rem",
                        fontWeight: 900,
                        marginTop: "24px",
                        color: "#0033cc",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ProcessStatus
          modelValue={showProcessDialog.value}
          onUpdate:modelValue={(val) => (showProcessDialog.value = val)}
          processType={currentSelectedRow.value?.business_type || "进站申请"}
          studentId={currentSelectedRow.value?.user_id}
        />
      </ElContainer>
    );
  },
});
