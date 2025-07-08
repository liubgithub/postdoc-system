import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton } from "element-plus";
import * as styles from "../styles.css.ts";
import { getAchievementStatistics } from "@/api/postdoctor/userinfoRegister/achievement";
import ConferenceForm from "./conferenceForm";
import PaperForm from "./paperForm";
import PatentForm from "./patentForm";
import BookForm from "./bookForm";
import ProjectForm from "./projectForm";
import CompetitionAwardForm from "./competitionAwardForm";
import SubjectResearchForm from "./subjectResearchForm";
import IndustryStandardForm from "./industryStandardForm";
import NewVarietyForm from "./newVarietyForm";

const categories = [
  "学术会议信息", "学术论文", "专利信息", "著作信息", "参与项目信息",
  "科技竞赛获奖信息", "课题研究信息", "行业标准信息", "新品种类型信息"
];

export default defineComponent({
  name: "AchievementTable",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const data = ref(categories.map(cat => ({
      category: cat,
      count: 0
    })));
    const showConference = ref(false);
    const showPaper = ref(false);
    const showPatent = ref(false);
    const showBook = ref(false);
    const showProject = ref(false);
    const showCompetitionAward = ref(false);
    const showSubjectResearch = ref(false);
    const showIndustryStandard = ref(false);
    const showNewVariety = ref(false);

    // 封装获取统计数据的函数
    const fetchStats = async () => {
      const stats = await getAchievementStatistics();
      if (Array.isArray(stats)) {
        data.value = categories.map(cat => {
          const found = stats.find((item: any) => item.category === cat);
          return { category: cat, count: found ? found.count : 0 };
        });
      }
    };

    // 页面挂载时获取一次
    onMounted(fetchStats);

    // 返回主表时刷新
    const handleBack = () => {
      showConference.value = false;
      showPaper.value = false;
      showPatent.value = false;
      showBook.value = false;
      showProject.value = false;
      showCompetitionAward.value = false;
      showSubjectResearch.value = false;
      showIndustryStandard.value = false;
      showNewVariety.value = false;
      fetchStats();
    };

    const handleAdd = (row: any) => {
      if (row.category === "学术会议信息") {
        showConference.value = true;
      } else if (row.category === "学术论文") {
        showPaper.value = true;
      } else if (row.category === "专利信息") {
        showPatent.value = true;
      } else if (row.category === "著作信息") {
        showBook.value = true;
      } else if (row.category === "参与项目信息") {
        showProject.value = true;
      } else if (row.category === "科技竞赛获奖信息") {
        showCompetitionAward.value = true;
      } else if (row.category === "课题研究信息") {
        showSubjectResearch.value = true;
      } else if (row.category === "行业标准信息") {
        showIndustryStandard.value = true;
      } else if (row.category === "新品种类型信息") {
        showNewVariety.value = true;
      }
    };

    return () => (
      showConference.value ? 
      (
        <ConferenceForm onBack={handleBack} />
      ) : showPaper.value ? (
        <PaperForm onBack={handleBack} />
      ) : showPatent.value ? (
        <PatentForm onBack={handleBack} />
      ) : showBook.value ? (
        <BookForm onBack={handleBack} />
      ) : showProject.value ? (
        <ProjectForm onBack={handleBack} />
      ) : showCompetitionAward.value ? (
        <CompetitionAwardForm onBack={handleBack} />
      ) : showSubjectResearch.value ? (
        <SubjectResearchForm onBack={handleBack} />
      ) : showIndustryStandard.value ? (
        <IndustryStandardForm onBack={handleBack} />
      ) : showNewVariety.value ? (
        <NewVarietyForm onBack={handleBack} />
      ) : (
        <div>
          <div style={{ fontSize: '1.3em', fontWeight: 700, textAlign: 'left', marginBottom: '1em' }}>入站前已有成果登记</div>
          <ElTable data={data.value} class={styles.table} style={{ width: "90%" }}>
            <ElTableColumn label="学术成果类型（点击跳转填报）" width='300'>
              {{
                default: ({ row }: any) => (
                  <span>{row.category}</span>
                )
              }}
            </ElTableColumn>
            <ElTableColumn label="数量" width="80">
              {{
                default: ({ row }: any) => (
                  <span>{row.count}</span>
                )
              }}
            </ElTableColumn>
            <ElTableColumn label="操作" width="200">
              {{
                default: ({ row }: any) => (
                  <ElButton type="primary" size="small" onClick={() => handleAdd(row)}>添加</ElButton>
                )
              }}
            </ElTableColumn>
          </ElTable>
          <div style={{ margin: '2em 0 1em 0', fontWeight: 700 }}>累计成果个数：{data.value.reduce((sum, item) => sum + Number(item.count || 0), 0)}</div>
          <div class={styles.btnGroup}>
            <ElButton v-show={!!props.onBack} onClick={evt => props.onBack && props.onBack(evt)}>返回</ElButton>
            <ElButton type="primary">提交</ElButton>
          </div>
        </div>
      )
    );
  }
}); 