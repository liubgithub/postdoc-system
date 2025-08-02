import { defineComponent, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import * as styles from "../../UserInfo/styles.css.ts";
import {
  ElRow,
  ElCol,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElMain,
} from "element-plus";

export default defineComponent({
  name: 'OutManageAssessment',
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    const route = useRoute();
    // 示例数据
    const allTableData = [
      { id: 1, studentId: '20230001', name: '张三', teacherName: '李老师', college: '园艺林学学院', major: '园艺学', applyTime: '2024-06-01', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 2, studentId: '20230002', name: '李四', teacherName: '王老师', college: '园艺林学学院', major: '林学', applyTime: '2024-06-02', processStatus: '已审核', nodeName: '学院审核', currentResult: '通过' },
      { id: 3, studentId: '20230003', name: '王五', teacherName: '赵老师', college: '园艺林学学院', major: '林学', applyTime: '2024-06-03', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 4, studentId: '20230004', name: '赵六', teacherName: '钱老师', college: '园艺林学学院', major: '园艺学', applyTime: '2024-06-04', processStatus: '已审核', nodeName: '学院审核', currentResult: '通过' },
      { id: 5, studentId: '20230005', name: '孙七', teacherName: '孙老师', college: '园艺林学学院', major: '林学', applyTime: '2024-06-05', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 6, studentId: '20230006', name: '周八', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', applyTime: '2024-06-06', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 7, studentId: '20230007', name: '吴九', teacherName: '吴老师', college: '园艺林学学院', major: '林学', applyTime: '2024-06-07', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 8, studentId: '20230008', name: '郑十', teacherName: '郑老师', college: '园艺林学学院', major: '园艺学', applyTime: '2024-06-08', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 9, studentId: '20230009', name: '钱十一', teacherName: '钱老师', college: '园艺林学学院', major: '林学', applyTime: '2024-06-09', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 10, studentId: '20230010', name: '周十二', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', applyTime: '2024-06-10', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 11, studentId: '20230011', name: '周十三', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', applyTime: '2024-06-11', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
      { id: 12, studentId: '20230012', name: '周十四', teacherName: '周老师', college: '园艺林学学院', major: '园艺学', applyTime: '2024-06-12', processStatus: '待审核', nodeName: '导师审核', currentResult: '未通过' },
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
    return () => (
      <ElMain style={{ padding: 0 }}>
          
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
                      <ElTableColumn prop="id" label="序号" width={80} align="center" />
                      <ElTableColumn prop="studentId" label="学号" align="center" />
                      <ElTableColumn prop="name" label="姓名" align="center" />
                      <ElTableColumn prop="teacherName" label="合作导师姓名" align="center" />
                      <ElTableColumn prop="college" label="所在学院" align="center" />
                      <ElTableColumn prop="major" label="学科专业" align="center" />
                      <ElTableColumn prop="applyTime" label="申请时间" align="center" />
                      <ElTableColumn prop="processStatus" label="流程状态" align="center" />
                      <ElTableColumn prop="nodeName" label="节点名称" align="center" />
                      <ElTableColumn prop="currentResult" label="当前考核结果" align="center" />
                      <ElTableColumn
                        label="操作"
                        align="center"
                        width={100}
                        v-slots={{ default: (scope: any) => (
                          <ElButton type="primary" size="small" onClick={() => router.push(`/teacher/outManage/assessment/${scope.row.id}`)}>审核</ElButton>
                        )}}
                      />
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
                      onClick={() => router.push("/teacher")}
                    >
                      返回
                    </ElButton>
                  </div>
                </div>
              </div>   
          </ElMain>
    );
  }
}); 