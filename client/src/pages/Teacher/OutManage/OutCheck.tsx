import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from 'vue-router';
import TeacherHeader from "../TeacherHeader";
import * as styles from "../../UserInfo/styles.css.ts";
import {
  ElContainer,
  ElHeader,
  ElRow,
  ElCol,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDialog,
} from "element-plus";
import ProcessStatus from "@/units/ProcessStatus";

export default defineComponent({
  name: "OutCheckPage",
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    // 示例数据
    const allTableData = [
      {
        id: 1,
        studentId: "20230001",
        name: "张三",
        college: "园艺林学学院",
        major: "园艺学",
        applyTime: "2025-09-01",
        status: "审核中",
        node: "合作导师",
        currentApproval: "考核小组负责人（通过）",
        steps: [
          { status: '发起' as const, role: '学生申请', time: '2025-09-01 10:00' },
          { status: '审核中' as const, role: '合作导师', time: '2025-09-02 12:00' },
          { status: '审核中' as const, role: '分管领导' },
          { status: '审核中' as const, role: '学院管理员' }
        ]
      },
      {
        id: 2,
        studentId: "20230002",
        name: "李四",
        college: "园艺林学学院",
        major: "林学",
        applyTime: "2025-09-01",
        status: "审核中",
        node: "分管领导",
        currentApproval: "设站单位负责人（不通过）",
        steps: [
          { status: '发起' as const, role: '学生申请', time: '2025-09-01 09:00' },
          { status: '通过' as const, role: '合作导师', time: '2025-09-01 10:00' },
          { status: '拒绝' as const, role: '分管领导', time: '2025-09-02 11:00' },
          { status: '审核中' as const, role: '学院管理员' }
        ]
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
        currentApproval: "学院管理员审核（通过）",
        steps: [
          { status: '发起' as const, role: '学生申请', time: '2025-09-01 08:00' },
          { status: '通过' as const, role: '合作导师', time: '2025-09-01 09:00' },
          { status: '通过' as const, role: '分管领导', time: '2025-09-01 10:00' },
          { status: '通过' as const, role: '学院管理员', time: '2025-09-01 11:00' }
        ]
      },
    ];
    const tableData = ref([...allTableData]);
    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return tableData.value.slice(start, start + pageSize);
    });

    // 搜索功能
    const handleSearch = () => {
      const keyword = searchValue.value.trim().toLowerCase();
      if (!keyword) {
        tableData.value = [...allTableData];
        return;
      }
      tableData.value = allTableData.filter(
        (row) =>
          row.studentId.toLowerCase().includes(keyword) ||
          row.name.toLowerCase().includes(keyword)
      );
    };

    watch(searchValue, (val) => {
      if (val === "") {
        tableData.value = [...allTableData];
      }
    });

    // 流程状态弹窗逻辑
    const showProcessDialog = ref(false);
    const currentSteps = ref([]);
    const handleShowProcess = (row: any) => {
      currentSteps.value = row.steps;
      showProcessDialog.value = true;
    };

    return () => (
      <ElContainer style={{ minHeight: "100vh" }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <div class={styles.contentArea}>
          <div
            style={{ background: "#fff", borderRadius: "8px", padding: "24px" }}
          >
            <ElRow gutter={12} style={{ marginBottom: "24px" }}>
              <ElCol span={2}>
                <ElButton
                  type="primary"
                  style={{
                    width: "100px",
                    height: 44,
                    fontWeight: 500,
                    fontSize: 18,
                  }}
                  onClick={handleSearch}
                >
                  搜索
                </ElButton>
              </ElCol>
              <ElCol span={7}>
                <ElInput
                  v-model={searchValue.value}
                  placeholder="请输入账号/姓名"
                  clearable
                  style={{ width: 220, height: 44, fontSize: 18 }}
                  onKeydown={(evt: Event | KeyboardEvent) => {
                    if ('key' in evt && (evt.key === 'Enter' || evt.keyCode === 13)) handleSearch();
                  }}
                />
              </ElCol>
              <ElCol span={12}></ElCol>
            </ElRow>

            <div style={{ marginTop: 24, width: "100%" }}>
              <ElTable
                data={pagedData.value}
                border
                style={{ width: "100%", background: "#fff", borderRadius: 8 }}
                headerCellStyle={{
                  textAlign: "center",
                  background: "#f7f8fa",
                  fontWeight: 600,
                  color: "#666",
                  fontSize: 16,
                }}
                cellStyle={{ textAlign: "center", fontSize: 15, color: "#222" }}
              >
                <ElTableColumn
                  prop="id"
                  label="序号"
                  width={80}
                  align="center"
                />
                <ElTableColumn prop="studentId" label="学号" align="center" />
                <ElTableColumn prop="name" label="姓名" align="center" />
                <ElTableColumn prop="college" label="所在学院" align="center" />
                <ElTableColumn prop="major" label="学科专业" align="center" />
                <ElTableColumn
                  prop="applyTime"
                  label="申请时间"
                  align="center"
                />
                <ElTableColumn
                  prop="status"
                  label="流程状态"
                  align="center"
                  v-slots={{
                    default: (scope: { row: any }) => (
                      <ElButton type="primary" size="small" onClick={() => handleShowProcess(scope.row)}>
                        查看流程
                      </ElButton>
                    )
                  }}
                />
                <ElTableColumn
                  prop="node"
                  label="节点名称"
                  align="center"
                />
                <ElTableColumn
                  prop="currentApproval"
                  label="当前审批结果"
                  align="center"
                />
                <ElTableColumn
                  label="操作"
                  width={150}
                  align="center"
                  v-slots={{
                    default: () => (
                      <ElButton type="primary" size="small" onClick={() => router.push('/teacher/entryManage/check-detail')}>
                        查看
                      </ElButton>
                    ),
                  }}
                />
              </ElTable>
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

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {/* 实际返回按钮事件绑定 */}
              <ElButton
                style={{ width: 120 }}
                plain
                onClick={() => router.push('/teacher')}
              >
                返回
              </ElButton>
            </div>
          </div>
        </div>
        <ProcessStatus
                            modelValue={showProcessDialog.value}
                            onUpdate:modelValue={(val) => showProcessDialog.value = val}
                            processType='出站考核'
                        />
      </ElContainer>
    );
  },
});
