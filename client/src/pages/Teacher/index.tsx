import { defineComponent, ref, onMounted } from 'vue';
import { ElContainer, ElHeader, ElButton, ElTable, ElTableColumn, ElRow, ElCol,ElMenu, ElMenuItem } from 'element-plus';
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
      { id: '1', workflow: '进站', initiator: '张三', status: '待处理', submitTime: '2025-09-01', action: '操作' }
    ]);
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
              <ElButton type="primary" plain style="background:#0033cc;color:#fff;">待处理</ElButton>
              <ElButton type="primary" plain style="background:#0033cc;color:#fff;">已处理</ElButton>
            </div>
            <ElTable data={tableData.value} border stripe style={{ width: '100%' }}>
              <ElTableColumn prop="id" label="序号" width="80" align="center"/>
              <ElTableColumn prop="workflow" label="工作流" align="center"/>
              <ElTableColumn prop="initiator" label="发起人" align="center"/>
              <ElTableColumn prop="status" label="流程状态" align="center"/>
              <ElTableColumn prop="submitTime" label="提交时间" align="center"/>
              <ElTableColumn prop="action" label="操作" align="center"/>
            </ElTable>
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