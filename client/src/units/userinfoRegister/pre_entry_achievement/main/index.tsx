import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElInput, ElIcon } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import fetch from '@/api';
import useUser from '@/stores/user';
import * as styles from "../../styles.css.ts";
import AchievementTable from "./achievement";

const categories = [
  "学术会议信息", "专利信息", "发表论文信息", "著作信息", "参与项目信息",
  "科技竞赛获奖信息", "课题研究信息", "行业标准信息", "新品种类型信息"
];

export default defineComponent({
  name: "PreEntryAchievementMain",
  setup() {
    const s_user = useUser();
    const data = ref(categories.map(cat => ({
      category: cat,
      count: 0,
      remark: ""
    })));
    const showDetail = ref(false);
    const currentCategory = ref("");

    // 加载已有数据
    onMounted(async () => {
      const token = s_user.info?.token || localStorage.getItem('token');
      const res: any = await fetch.raw.GET('/pre_entry_achievement/list' as any, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data) {
        data.value = categories.map(cat => {
          const found = (res.data as any[]).find((item: any) => item.category === cat);
          return found ? found : { category: cat, count: 0, remark: "" };
        });
      }
    });

    const handleAdd = (row: any) => {
      currentCategory.value = row.category;
      showDetail.value = true;
    };

    const handleBack = () => {
      showDetail.value = false;
    };

    return () => (
      <div class={styles.formWrapper} style={{ minWidth: '1100px', width: 'auto', margin: '0 auto' }}>
        {!showDetail.value ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
              <ElButton type="primary" size="small" style={{ marginRight: '1em', display: 'flex', alignItems: 'center' }} onClick={() => { currentCategory.value = ''; showDetail.value = true; }}>
                <ElIcon style={{ marginRight: '4px' }}><InfoFilled /></ElIcon>
                详细信息
              </ElButton>
            </div>
            <ElTable
              data={data.value}
              class={styles.table}
              style={{ width: "100%" }}
              empty-text="暂无数据"
              header-cell-style={{ textAlign: 'center' }}
              cell-style={{ textAlign: 'center' }}
            >
              <ElTableColumn label="序号" prop="id" />
              <ElTableColumn label="学号" prop="stuId" />
              <ElTableColumn label="姓名" prop="name" />
              <ElTableColumn label="流程状态" prop="status" />
              <ElTableColumn label="节点名称" prop="node" />
              <ElTableColumn label="最后审批结果" prop="finalResult" />
              <ElTableColumn label="所在学院" prop="college" />
              <ElTableColumn label="一级学科" prop="subject1" />
              <ElTableColumn label="学科专业" prop="subject2" />
              <ElTableColumn label="入站年份" prop="entryYear" />
              <ElTableColumn label="累计成果个数" prop="achievementCount" />
              <ElTableColumn label="添加时间" prop="createdAt" />
            </ElTable>
            <div style={{ textAlign: 'center', marginTop: '2em' }}>
              <ElButton>返回</ElButton>
            </div>
          </>
        ) : (
          <AchievementTable onBack={handleBack} />
        )}
      </div>
    );
  }
});
