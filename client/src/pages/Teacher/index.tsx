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
} from "element-plus";
import * as styles from "../UserInfo/styles.css.ts";
import useUser from "@/stores/user";
import { useRouter, useRoute, RouterView } from "vue-router";
import TeacherHeader from "./TeacherHeader";
import ProcessStatus from "@/units/ProcessStatus";

const menuList = [
  { label: "进站管理", path: "/teacher/entryManage" },
  { label: "在站管理", path: "/teacher/inManage" },
  { label: "出站管理", path: "/teacher/outManage" },
  { label: "账号审批", path: "/teacher/accountApproval" },
];

export default defineComponent({
  name: "TeacherPage",
  setup() {
    const showProcessDialog = ref(false);
    const currentSteps = ref([
      { status: '发起' as const, role: '学生申请', time: '2025-09-01 10:00' },
      { status: '审核中' as const, role: '导师审核', time: '2025-09-02 12:00' },
      { status: '结束' as const, role: '学院审核' }
    ]);
    // 处理状态过滤
    const filterStatus = ref("待处理");
    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);
    const filteredData = computed(() =>
      tableData.value.filter((row) => row.status === filterStatus.value)
    );
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredData.value.slice(start, start + pageSize);
    });
    const summary = ref({ postdocCount: 125, latestAchievement: 78, outCount: 32, delayCount: 7 }); // 新增出站人数和延期人数

    // onMounted(async () => {
    //   // 这里用fetch，实际可用axios等
    //   const res = await fetch('/api/teacher/summary');
    //   const data = await res.json();
    //   summary.value = data;
    // });

    // 在setup中添加按钮事件处理函数
    const handleDetail = (row: any) => {
      // 这里写详情逻辑
      console.log("详情", row);
    };
    const handleView = (row: any) => {
      // 这里可以根据row.steps设置currentSteps.value，示例写死
      currentSteps.value = row.steps || [
        { status: '发起' as const, role: '学生申请', time: '2025-09-01 10:00' },
        { status: '审核中' as const, role: '导师审核', time: '2025-09-02 12:00' },
        { status: '结束' as const, role: '学院审核' }
      ];
      showProcessDialog.value = true;
    };

    // 修改表格数据，添加steps字段（示例）
    const tableData = ref([
      {
        id: "1",
        businessType: "进站申请",
        initiator: "张三",
        submitTime: "2025-09-01",
        status: "待处理",
        action: "操作",
        steps: [
          { status: '发起', role: '学生申请', time: '2025-09-01 10:00' },
          { status: '审核中', role: '导师审核', time: '2025-09-02 12:00' },
          { status: '结束', role: '学院审核' }
        ]
      },
      {
        id: "2",
        businessType: "进站考核",
        initiator: "张三",
        submitTime: "2025-09-01",
        status: "已处理",
        steps: [
          { status: '发起', role: '学生申请', time: '2025-09-01 10:00' },
          { status: '通过', role: '导师审核', time: '2025-09-02 12:00' },
          { status: '结束', role: '学院审核', time: '2025-09-03 09:00' }
        ]
      },
      {
        id: "3",
        businessType: "中期考核",
        initiator: "张三",
        submitTime: "2025-09-01",
        status: "待处理",
        steps: [
          { status: '发起', role: '学生申请', time: '2025-09-01 10:00' },
          { status: '审核中', role: '导师审核' },
          { status: '结束', role: '学院审核' }
        ]
      },
    ]);

    return () => (
      <ElContainer style={{ minHeight: "100vh" }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <div class={styles.contentArea}>
          <div
            style={{ background: "#fff", borderRadius: "8px", padding: "24px" }}
          >
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <ElButton
                type="primary"
                plain={filterStatus.value !== "待处理"}
                style={{
                  background:
                    filterStatus.value === "待处理" ? "#0033cc" : "#fff",
                  color: filterStatus.value === "待处理" ? "#fff" : "#0033cc",
                  borderColor: "#0033cc",
                }}
                onClick={() => {
                  filterStatus.value = "待处理";
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
                prop="businessType"
                label="业务类型"
                align="center"
              />
              <ElTableColumn prop="initiator" label="发起人" align="center" />
              <ElTableColumn
                prop="submitTime"
                label="提交时间"
                align="center"
              />
              <ElTableColumn prop="status" label="流程状态" align="center" />
              <ElTableColumn
                label="操作"
                align="center"
                v-slots={{
                  default: (scope: { row: any }) => (
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
                currentPage={currentPage.value}
                vOn:current-change={(val: number) => (currentPage.value = val)}
                hideOnSinglePage={false}
              />
            </div>
            {/* 新增统计卡片 */}
            <div style={{ marginTop: "40px", marginBottom: "16px", textAlign: "center" }}>
              <span style={{ fontSize: "2rem", fontWeight: 600, letterSpacing: 2 }}>数据统计</span>
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
                marginRight: "auto"
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
                    height: "170px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: 2 }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 900,
                      marginTop: "24px",
                      color: "#0033cc"
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ElDialog
          v-model={showProcessDialog.value}
          title="流程状态"
          width="600px"
          destroyOnClose
        >
          <ProcessStatus steps={currentSteps.value} />
        </ElDialog>
      </ElContainer>
    );
  },
});
