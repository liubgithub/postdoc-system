import { defineComponent, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import TeacherHeader from "../TeacherHeader.tsx";
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
} from "element-plus";

export default defineComponent({
  name: "OutManagePage",
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    const route = useRoute();
    // 示例数据
    const allTableData = [
      { id: 1, studentId: '20230001', name: '张三', teacherName: '李老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 2, studentId: '20230002', name: '李四', teacherName: '王老师', college: '园艺林学学院', major: '林学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 3, studentId: '20230003', name: '王五', teacherName: '赵老师', college: '园艺林学学院', major: '林学', inTime: '2021-09-01', isDelay: '是', isPass: '未通过' },
      { id: 4, studentId: '20230004', name: '赵六', teacherName: '钱老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 5, studentId: '20230005', name: '孙七', teacherName: '孙老师', college: '园艺林学学院', major: '林学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 6, studentId: '20230006', name: '周八', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '是', isPass: '未通过' },
      { id: 7, studentId: '20230007', name: '吴九', teacherName: '吴老师', college: '园艺林学学院', major: '林学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 8, studentId: '20230008', name: '郑十', teacherName: '郑老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 9, studentId: '20230009', name: '钱十一', teacherName: '钱老师', college: '园艺林学学院', major: '林学', inTime: '2021-09-01', isDelay: '是', isPass: '未通过' },
      { id: 10, studentId: '20230010', name: '周十二', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 11, studentId: '20230011', name: '周十三', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 12, studentId: '20230012', name: '周十四', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 13, studentId: '20230013', name: '周十五', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 14, studentId: '20230014', name: '周十六', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 15, studentId: '20230015', name: '周十七', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 16, studentId: '20230016', name: '周十八', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
      { id: 17, studentId: '20230017', name: '周十九', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', inTime: '2021-09-01', isDelay: '否', isPass: '通过' },
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

    // 左侧菜单
    const menuList = [
      { label: '出站考核', key: 'assessment' },
      { label: '延期管理', key: 'delay' },
      { label: '退站管理', key: 'out' },
    ];
    const activeMenu = ref('');
    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
      // 路由跳转
      if (key === 'assessment') {
        router.push('/teacher/outmanage/assessment');
      } else if (key === 'delay') {
        router.push('/teacher/outmanage/delay');
      } else if (key === 'out') {
        router.push('/teacher/outmanage/out');
      }
    };

    // 监听路由变化，切回 /teacher/outManage 时重置 activeMenu
    watch(
      () => route.fullPath,
      (newPath) => {
        if (newPath === "/teacher/outManage") {
          activeMenu.value = "";
        }
      },
      { immediate: true }
    );

    return () => (
      <ElContainer style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <ElContainer style={{ position: 'relative', flex: 1, height: '0' ,top:'8px'}}>
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
            {activeMenu.value === '' ? (
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
                        clearable
                        style={{ width: 220, height: 44, fontSize: 18 }}
                        onKeydown={(evt: Event | KeyboardEvent) => {
                          if (
                            "key" in evt &&
                            (evt.key === "Enter" || evt.keyCode === 13)
                          )
                            handleSearch();
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
                      <ElTableColumn
                        prop="teacherName"
                        label="合作导师姓名"
                        align="center"
                      />
                      <ElTableColumn prop="college" label="所在学院" align="center" />
                      <ElTableColumn prop="major" label="学科专业" align="center" />
                      <ElTableColumn prop="inTime" label="入站时间" align="center" />
                      <ElTableColumn prop="isDelay" label="是否延期" align="center" />
                      <ElTableColumn prop="isPass" label="考核状态" align="center" />
                    </ElTable>
                  </div>

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
                      total={tableData.value.length}
                      currentPage={currentPage.value}
                      onCurrentChange={(val: number) => (currentPage.value = val)}
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
                      onClick={() => router.push("/teacher")}
                    >
                      返回
                    </ElButton>
                  </div>
                </div>
              </div>
            ) : (
              <router-view />
            )}
          </ElMain>
        </ElContainer>
      </ElContainer>
    );
  },
});
