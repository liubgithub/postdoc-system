import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from 'vue-router';
import TeacherHeader from "./TeacherHeader";
import * as styles from "../UserInfo/styles.css.ts";
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
} from "element-plus";

export default defineComponent({
  name: "EntryManagePage",
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    // 示例数据
    const allTableData = [
      { id: 1, account: "testuser", name: "张三", applyTime: "2025-09-01" },
      { id: 2, account: "testuser2", name: "李四", applyTime: "2025-09-01" },
      { id: 3, account: "testuser3", name: "王五", applyTime: "2025-09-01" },
      { id: 4, account: "testuser4", name: "赵六", applyTime: "2025-09-01" },
      { id: 5, account: "testuser5", name: "孙七", applyTime: "2025-09-01" },
      { id: 6, account: "testuser6", name: "周八", applyTime: "2025-09-01" },
      { id: 7, account: "testuser7", name: "吴九", applyTime: "2025-09-01" },
      { id: 8, account: "testuser8", name: "郑十", applyTime: "2025-09-01" },
      { id: 9, account: "testuser9", name: "张三", applyTime: "2025-09-01" },
      { id: 10, account: "testuser10", name: "李四", applyTime: "2025-09-01" },
      { id: 11, account: "testuser11", name: "王五", applyTime: "2025-09-01" },
      { id: 12, account: "testuser12", name: "赵六", applyTime: "2025-09-01" },
      { id: 13, account: "testuser13", name: "孙七", applyTime: "2025-09-01" },
      { id: 14, account: "testuser14", name: "周八", applyTime: "2025-09-01" },
      { id: 15, account: "testuser15", name: "吴九", applyTime: "2025-09-01" },
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
          row.account.toLowerCase().includes(keyword) ||
          row.name.toLowerCase().includes(keyword)
      );
    };

    watch(searchValue, (val) => {
      if (val === "") {
        tableData.value = [...allTableData];
      }
    });
    return () => (
      <ElContainer style={{ minHeight: "100vh" }}>
        <ElHeader height="15vh" style={{ padding: 0, background: "none" }}>
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
                <ElTableColumn prop="account" label="账号" align="center" />
                <ElTableColumn prop="name" label="姓名" align="center" />
                <ElTableColumn
                  prop="applyTime"
                  label="账号申请时间"
                  align="center"
                />
                <ElTableColumn
                  label="操作"
                  width={120}
                  align="center"
                  v-slots={{
                    default: () => (
                      <ElButton type="primary" size="small" onClick={() => router.push('/teacher/entryManage/approval')}>
                        审批
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
                currentPage={currentPage.value}
                vOn:current-change={(val: number) => (currentPage.value = val)}
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
      </ElContainer>
    );
  },
});
