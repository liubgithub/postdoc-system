import { defineComponent, ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from "element-plus";
import * as styles from "./styles.css.ts";

export default defineComponent({
  name: "ResearchForm",
  setup() {
    const form = ref({
      previousWork: "",
      necessityAnalysis: "",
      researchPlan: "",
      achievements: "",
      otherAchievements: "",
      academicIdeals: "",
      commitment: "本人基于对学术理想的向往和追求来申请本岗位，承诺对所有提供有关应聘材料的真实性、有效性负责，愿意承担相应的学术道德、法律责任及后果。",
      signature: "",
      date: ""
    });

    const handleSubmit = () => {
      // Handle form submission
    };

    return () => (
      <div class={styles.formWrapper}>
        <ElForm model={form.value} labelWidth="200px">
          <h3>2. 相关科研情况填写</h3>
          
          <ElFormItem label="1. 前期工作基础">
            <ElInput
              v-model={form.value.previousWork}
              type="textarea"
              rows={4}
              placeholder="入站前的科研训练、相关进展，获得资助的情况等"
            />
          </ElFormItem>

          <ElFormItem label="2. 选题的必要性分析">
            <ElInput
              v-model={form.value.necessityAnalysis}
              type="textarea"
              rows={4}
              placeholder="500字以内"
            />
          </ElFormItem>

          <ElFormItem label="3. 研究规划及预期成果">
            <ElInput
              v-model={form.value.researchPlan}
              type="textarea"
              rows={4}
              placeholder="500字以内，论文需列出目标期刊名称，或注明为相当或更高水平期刊"
            />
          </ElFormItem>

          <ElFormItem label="4. 成果情况">
            <ElInput
              v-model={form.value.achievements}
              type="textarea"
              rows={6}
              placeholder="请将近3年代表作列出；论文请注明题目、全部作者、发表年份、刊物、卷、页码、收录及引用情况等，并按论文发表级别排序，共同第一作者用#标明，通讯作者用*标明；著作请注明所有作者姓名，书名，出版地，出版社"
            />
          </ElFormItem>

          <ElFormItem label="5. 其他代表性成果">
            <ElInput
              v-model={form.value.otherAchievements}
              type="textarea"
              rows={4}
            />
          </ElFormItem>

          <ElFormItem label="6. 学术理想与追求">
            <ElInput
              v-model={form.value.academicIdeals}
              type="textarea"
              rows={4}
              placeholder="介绍本人学术理想与追求；对科研人员要将学术道德、学术诚信视为生命线的认识看法；接受相关学术诚信、学术规范培训的经历等"
            />
          </ElFormItem>

          <h3>3. 本人承诺</h3>
          <ElFormItem label="承诺内容">
            <ElInput
              v-model={form.value.commitment}
              type="textarea"
              rows={3}
              disabled
            />
          </ElFormItem>

          <ElFormItem label="签名">
            <ElInput
              v-model={form.value.signature}
              placeholder="请在此处签名"
              style={{ width: "200px" }}
            />
          </ElFormItem>

          <ElFormItem label="日期">
            <ElDatePicker
              v-model={form.value.date}
              type="date"
              placeholder="选择日期"
            />
          </ElFormItem>

          <div class={styles.btnGroup}>
            <ElButton type="primary" onClick={handleSubmit}>提交</ElButton>
          </div>
        </ElForm>
      </div>
    );
  }
});