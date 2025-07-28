import { defineComponent, ref, onMounted } from 'vue';
import { computed } from 'vue';
import { ElContainer, ElHeader, ElButton, ElTable, ElTableColumn, ElRow, ElCol, ElMenu, ElMenuItem, ElPagination } from 'element-plus';
import * as styles from '../UserInfo/styles.css.ts';
import useUser from '@/stores/user';
import { useRouter, useRoute, RouterView } from "vue-router";
import TeacherHeader from './TeacherHeader';

const menuList = [
  { label: "进站管理", path: "/teacher/entryManage" },
  { label: "出站管理", path: "/outManage" },
];

export default defineComponent({
  name: 'TeacherPage',
  setup() {
    const tableData = ref([
      { id: '1', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '2', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '3', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '4', workflow: '进站', initiator: '张三', status: '已处理', submitTime: '2025-09-01', action: '操作' },
      { id: '5', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '6', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '7', workflow: '进站', initiator: '张三', status: '已处理', submitTime: '2025-09-01', action: '操作' },
      { id: '8', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '9', workflow: '进站', initiator: '张三', status: '已处理', submitTime: '2025-09-01', action: '操作' },
      { id: '10', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '11', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '12', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '13', workflow: '进站', initiator: '张三', status: '已处理', submitTime: '2025-09-01', action: '操作' },
      { id: '14', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' },
      { id: '15', workflow: '进站', initiator: '张三', status: '已处理', submitTime: '2025-09-01', action: '操作' },
    ]);
    // 处理状态过滤
    const filterStatus = ref('待处理');
    // 分页相关
    const pageSize = 10;
    const currentPage = ref(1);
    const filteredData = computed(() =>
      tableData.value.filter(row => row.status === filterStatus.value)
    );
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredData.value.slice(start, start + pageSize);
    });
    const summary = ref({ postdocCount: 125, latestAchievement: 78 }); // 先写死数据，后续可通过接口获取

    // onMounted(async () => {
    //   // 这里用fetch，实际可用axios等
    //   const res = await fetch('/api/teacher/summary');
    //   const data = await res.json();
    //   summary.value = data;
    // });

    return () => (
      <ElContainer style={{ minHeight: '100vh' }}>
        <ElHeader height="15vh" style={{ padding: 0, background: 'none' }}>
          <TeacherHeader />
        </ElHeader>
        <div class={styles.contentArea}>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <ElButton
                type="primary"
                plain={filterStatus.value !== '待处理'}
                style={{
                  background: filterStatus.value === '待处理' ? '#0033cc' : '#fff',
                  color: filterStatus.value === '待处理' ? '#fff' : '#0033cc',
                  borderColor: '#0033cc',
                }}
                onClick={() => { filterStatus.value = '待处理'; currentPage.value = 1; }}
              >
                待处理
              </ElButton>
              <ElButton
                type="primary"
                plain={filterStatus.value !== '已处理'}
                style={{
                  background: filterStatus.value === '已处理' ? '#0033cc' : '#fff',
                  color: filterStatus.value === '已处理' ? '#fff' : '#0033cc',
                  borderColor: '#0033cc',
                }}
                onClick={() => { filterStatus.value = '已处理'; currentPage.value = 1; }}
              >
                已处理
              </ElButton>
            </div>
            <ElTable data={pagedData.value} border stripe style={{ width: '100%' }}>
              <ElTableColumn
                label="序号"
                width="80"
                align="center"
                v-slots={{
                  default: (scope: { $index: number }) => (currentPage.value - 1) * pageSize + scope.$index + 1
                }}
              />
              <ElTableColumn prop="workflow" label="工作流" align="center"/>
              <ElTableColumn prop="initiator" label="发起人" align="center"/>
              <ElTableColumn prop="status" label="流程状态" align="center"/>
              <ElTableColumn prop="submitTime" label="提交时间" align="center"/>
              <ElTableColumn prop="action" label="操作" align="center"/>
            </ElTable>
            {/* 分页器 */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
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
            <div style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              marginTop: '32px'
            }}>
              {[
                { label: '在站博士后', value: summary.value.postdocCount },
                { label: '最新成果', value: summary.value.latestAchievement }
              ].map(item => (
                <div style={{
                  border: '1px solid #aaa',
                  borderRadius: '6px',
                  width: '150px',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 400 }}>{item.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ElContainer>
    );
  }
}); 