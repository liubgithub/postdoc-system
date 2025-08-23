import { defineComponent, ref, watch, computed, onMounted } from "vue";
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
  ElAside,
  ElMenu,
  ElMenuItem,
  ElMain,
  ElDialog,
  ElMessage,
} from "element-plus";
import ProcessStatus from "@/units/ProcessStatus";
import { getTeacherApplications } from "@/api/enterWorkstation";

// 定义进站考核数据的类型
interface AssessmentData {
  id: number;
  studentId: string; // 学号
  name: string; // 姓名
  college: string; // 学院
  major: string; // 专业
  applyTime: string; // 申请时间
  status: string; // 状态
  node: string; // 当前节点
  currentApproval: string; // 当前审核
  steps: any[]; // 流程步骤
  user_id: number;
  workflow_status: string;
  business_type: string; // 业务类型：进站考核
}

export default defineComponent({
  name: "EntryCheckPage",
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    const loading = ref(false);
    
    // 真实数据
    const allTableData = ref<AssessmentData[]>([]);
    const tableData = ref<AssessmentData[]>([]);
    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return tableData.value.slice(start, start + pageSize);
    });

    // 获取进站考核列表
    const fetchAssessmentData = async () => {
      loading.value = true;
      try {
        const response = await getTeacherApplications();
        console.log("API响应:", response);
        if (response.data) {
          // 过滤出进站考核数据
          const assessmentData = response.data.filter((item: any) => item.business_type === "进站考核");
          allTableData.value = assessmentData;
          tableData.value = assessmentData;
          console.log("进站考核数据:", assessmentData);
        } else if (response.error) {
          ElMessage.error("获取进站考核列表失败");
        }
      } catch (error) {
        console.error("获取进站考核列表失败:", error);
        ElMessage.error("获取进站考核列表失败");
      } finally {
        loading.value = false;
      }
    };

    // 搜索功能
    const handleSearch = () => {
      const keyword = searchValue.value.trim().toLowerCase();
      if (!keyword) {
        tableData.value = [...allTableData.value];
        return;
      }
      tableData.value = allTableData.value.filter(
        (row) =>
          row.studentId.toLowerCase().includes(keyword) ||
          row.name.toLowerCase().includes(keyword)
      );
    };

    watch(searchValue, (val) => {
      if (val === "") {
        tableData.value = [...allTableData.value];
      }
    });

    // 页面加载时获取数据
    onMounted(() => {
      fetchAssessmentData();
    });

    // 处理详情按钮点击
    const handleDetail = (row: AssessmentData) => {
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
      } else {
        ElMessage.warning("未知的业务类型");
      }
    };

    // 流程状态弹窗逻辑
    const showProcessDialog = ref(false);
    const currentSelectedRow = ref<AssessmentData | null>(null);
    const handleShowProcess = (row: AssessmentData) => {
      currentSelectedRow.value = row;
      showProcessDialog.value = true;
    };

    const menuList = [
      { label: '进站申请', key: 'apply' },
      { label: '进站考核', key: 'assessment' },  
    ];
    const activeMenu = ref('assessment');
    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
      if (key === 'apply') {
        router.push('/teacher/entryManage/apply');
      }
    };

    return () => (
      <ElContainer style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <ElContainer style={{ position: 'relative', flex: 1, height: '0', top: '8px' }}>
          <ElAside width="200px" style={{ background: '#fff', height: '100%' }}>
            <ElMenu
              defaultActive={activeMenu.value}
              class="el-menu-vertical"
              onSelect={handleMenuClick}
            >
              {menuList.map(item => (
                <ElMenuItem index={item.key}>{item.label}</ElMenuItem>
              ))}
            </ElMenu>
          </ElAside>
          <ElMain style={{ padding: 0 }}>
            {/* 主内容区 */}
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
                  {loading.value && (
                    <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                      加载中...
                    </div>
                  )}
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
                      label="序号"
                      width={80}
                      align="center"
                      v-slots={{
                        default: (scope: { $index: number }) =>
                          (currentPage.value - 1) * pageSize + scope.$index + 1,
                      }}
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
                      label="当前考核结果"
                      align="center"
                    />
                    <ElTableColumn
                      prop="business_type"
                      label="业务类型"
                      align="center"
                    />
                                         <ElTableColumn
                       label="操作"
                       width={150}
                       align="center"
                       v-slots={{
                         default: (scope: { row: AssessmentData }) => (
                           <ElButton 
                             type="primary" 
                             size="small" 
                             onClick={() => handleDetail(scope.row)}
                           >
                             详情
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
          </ElMain>
        </ElContainer>
        <ProcessStatus
          modelValue={showProcessDialog.value}
          onUpdate:modelValue={(val) => showProcessDialog.value = val}
          processType={currentSelectedRow.value?.business_type || "进站考核"}
          studentId={currentSelectedRow.value?.user_id}
        />
      </ElContainer>
    );
  },
});
