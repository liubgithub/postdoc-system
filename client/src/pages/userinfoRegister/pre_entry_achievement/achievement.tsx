import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElInput, ElButton } from "element-plus";
import * as styles from "../styles.css.ts";
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
      count: 0,
      remark: ""
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

    // 可在此处 onMounted 加载后端数据

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
        <ConferenceForm onBack={() => { showConference.value = false; }} />
      ) : showPaper.value ? (
        <PaperForm onBack={() => { showPaper.value = false; }} />
      ) : showPatent.value ? (
        <PatentForm onBack={() => { showPatent.value = false; }} />
      ) : showBook.value ? (
        <BookForm onBack={() => { showBook.value = false; }} />
      ) : showProject.value ? (
        <ProjectForm onBack={() => { showProject.value = false; }} />
      ) : showCompetitionAward.value ? (
        <CompetitionAwardForm onBack={() => { showCompetitionAward.value = false; }} />
      ) : showSubjectResearch.value ? (
        <SubjectResearchForm onBack={() => { showSubjectResearch.value = false; }} />
      ) : showIndustryStandard.value ? (
        <IndustryStandardForm onBack={() => { showIndustryStandard.value = false; }} />
      ) : showNewVariety.value ? (
        <NewVarietyForm onBack={() => { showNewVariety.value = false; }} />
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
                  <ElInput v-model={row.count} type="number" style={{ width: "60px" }} />
                )
              }}
            </ElTableColumn>
            <ElTableColumn label="操作" width="100">
              {{
                default: ({ row }: any) => (
                  <ElButton type="primary" size="small" onClick={() => handleAdd(row)}>添加</ElButton>
                )
              }}
            </ElTableColumn>
            <ElTableColumn label="备注">
              {{
                default: ({ row }: any) => (
                  <ElInput v-model={row.remark} placeholder="备注" />
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