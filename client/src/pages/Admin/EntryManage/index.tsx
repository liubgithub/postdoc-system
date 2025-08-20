import { defineComponent, ref, watch, computed } from "vue";
import { useRouter } from 'vue-router';
import {
  ElRow,
  ElCol,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
} from "element-plus";
import ProcessStatus from "@/units/ProcessStatus";

export default defineComponent({
  name: "AdminEntryManagePage",
  setup() {
    const searchValue = ref("");
    const router = useRouter();
    
    // 示例数据（后续替换为接口返回）
    const allTableData = [
      {
        id: 1,
        studentId: "20230001",
        name: "张三",
        college: "园艺林学学院",
        major: "园艺学",
        applyTime: "2025-09-01",
        status: "审核中",
        node: "学院管理员",
        currentApproval: "学院管理员（待处理）",
        steps: [
          { status: '发起' as const, role: '学生申请', time: '2025-09-01 10:00' },
          { status: '通过' as const, role: '合作导师', time: '2025-09-02 12:00' },
          { status: '通过' as const, role: '分管领导', time: '2025-09-03 09:30' },
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
        node: "学院管理员",
        currentApproval: "学院管理员（待处理）",
        steps: [
          { status: '发起' as const, role: '学生申请', time: '2025-09-01 09:00' },
          { status: '通过' as const, role: '合作导师', time: '2025-09-01 10:00' },
          { status: '通过' as const, role: '分管领导', time: '2025-09-02 11:00' },
          { status: '审核中' as const, role: '学院管理员' }
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
    const currentSteps = ref<any[]>([]);
    const currentSelectedRow = ref<any>(null);
    const handleShowProcess = (row: any) => {
      currentSelectedRow.value = row;
      currentSteps.value = row.steps;
      showProcessDialog.value = true;
    };

    return () => (
      <div style={{ height: '100%', padding: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '600' }}>进站管理</h2>
          </div>

          <ElRow gutter={12} style={{ marginBottom: '24px' }}>
            <ElCol span={2}>
              <ElButton type="primary" style={{ width: '100px', height: 44, fontWeight: 500, fontSize: 16 }} onClick={handleSearch}>搜索</ElButton>
            </ElCol>
            <ElCol span={7}>
              <ElInput
                v-model={searchValue.value}
                placeholder="请输入账号/姓名"
                clearable
                style={{ width: 220, height: 44, fontSize: 16 }}
                onKeydown={(evt: Event | KeyboardEvent) => {
                  if ('key' in evt && (evt.key === 'Enter' || (evt as any).keyCode === 13)) handleSearch();
                }}
              />
            </ElCol>
            <ElCol span={12}></ElCol>
          </ElRow>

          <div style={{ marginTop: 24, width: '100%' }}>
            <ElTable
              data={pagedData.value}
              border
              style={{ width: '100%', background: '#fff', borderRadius: 8 }}
              headerCellStyle={{ textAlign: 'center', background: '#f7f8fa', fontWeight: 600, color: '#666', fontSize: 16 }}
              cellStyle={{ textAlign: 'center', fontSize: 15, color: '#222' }}
            >
              <ElTableColumn prop="id" label="序号" width={80} align="center" />
              <ElTableColumn prop="studentId" label="学号" align="center" />
              <ElTableColumn prop="name" label="姓名" align="center" />
              <ElTableColumn prop="college" label="所在学院" align="center" />
              <ElTableColumn prop="major" label="学科专业" align="center" />
              <ElTableColumn prop="applyTime" label="申请时间" align="center" />
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
              <ElTableColumn prop="node" label="节点名称" align="center" />
              <ElTableColumn prop="currentApproval" label="当前审批结果" align="center" />
              <ElTableColumn
                label="操作"
                width={150}
                align="center"
                v-slots={{
                  default: () => (
                    <ElButton type="primary" size="small" onClick={() => router.push('/admin/entryManage/approval')}>
                      查看
                    </ElButton>
                  ),
                }}
              />
            </ElTable>
          </div>

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
        </div>

        <ProcessStatus
          modelValue={showProcessDialog.value}
          onUpdate:modelValue={(val) => showProcessDialog.value = val}
          processType='进站管理'
          studentId={currentSelectedRow.value?.user_id}
        />
      </div>
    );
  },
});
