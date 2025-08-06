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

export default defineComponent({
  name: "MiddleCheckPage",
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    const loading = ref(false);
    
    // 从API获取的数据
    const allTableData = ref([]);
    const tableData = ref([]);

    // 获取学生列表
    const fetchStudents = async () => {
      loading.value = true;
      try {
        const response = await getTeacherApplications();
        console.log('API响应:', response);
        if (response.data) {
          console.log('API返回的数据:', response.data);
          console.log('第一条数据:', response.data[0]);
          allTableData.value = response.data;
          tableData.value = [...allTableData.value];
        } else if (response.error) {
          ElMessage.error('获取学生列表失败');
        }
      } catch (error) {
        console.error('获取学生列表失败:', error);
        ElMessage.error('获取学生列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 页面加载时获取数据
    onMounted(() => {
      fetchStudents();
    });
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

    // 流程状态弹窗逻辑
    const showProcessDialog = ref(false);
    const currentSteps = ref([]);
    const currentRow = ref<any>(null);
    const handleShowProcess = (row: any) => {
      console.log('点击查看流程，行数据:', row);
      currentSteps.value = row.steps;
      currentRow.value = row;
      showProcessDialog.value = true;
    };

    const menuList = [
      { label: '中期考核', key: 'middle' },
      { label: '年度考核', key: 'year' },
      { label: '延期考核', key: 'extension' },  
    ];
    const activeMenu = ref('middle');
    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
      if (key === 'year') {
        router.push('/teacher/inManage/year');
      } else if (key === 'extension') {
        router.push('/teacher/inManage/extension');
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
          </ElMain>
        </ElContainer>
        <ElDialog
          v-model={showProcessDialog.value}
          title="流程状态"
          width="600px"
          destroyOnClose
        >
                               {(() => {
                  console.log('当前行数据:', currentRow.value);
                  console.log('学生ID:', currentRow.value?.user_id);
                  return (
                                       <ProcessStatus
                      modelValue={showProcessDialog.value}
                      onUpdate:modelValue={(val) => showProcessDialog.value = val}
                      processType='进站申请'
                      studentId={currentRow.value?.user_id}
                    />
                 );
               })()}
        </ElDialog>
      </ElContainer>
    );
  },
});
