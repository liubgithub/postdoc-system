import { ElForm, ElFormItem, ElInput, ElButton, ElDatePicker, ElAlert } from "element-plus";
import * as styles from "./styles.css.ts";
import SignaturePad from '@/units/Signature/index'
import Audit from './audit.tsx'
import fetch from '@/api/index.ts'

export default defineComponent({
  name: "ResearchForm",
  props: {
    onSubmitSuccess: {
      type: Function,
      required: false
    }
  },
  setup(props) {
    const form = ref({
      base_work: "",
      necessity_analysis: "",
      resplan_expected: "",
      results: "",
      other_achievements: "",
      academic_pursuits: "",
      commitment: "本人基于对学术理想的向往和追求来申请本岗位，承诺对所有提供有关应聘材料的真实性、有效性负责，愿意承担相应的学术道德、法律责任及后果。",
      signature: "",
      date: ""
    });

    const handleSubmit = () => {
      console.log(form.value, 'fffff')

    };
    const onInput = (val: any) => {
      console.log(val, 'signature')
      form.value.signature = val
    }

    onMounted(async () => {
      const res = await fetch.raw.GET('/enterRelation/');
      if (res && res.data) {
        Object.assign(form.value, res.data);
      }
      console.log(res.data, form.value, 'biao')
    });
    return () => (
      <div class={styles.formWrapper}>
        <ElForm model={form.value} labelPosition="top">
          <h3>2. 相关科研情况填写</h3>
          <ElFormItem label="1. 前期工作基础">
            <ElInput
              v-model={form.value.base_work}
              type="textarea"
              rows={4}
              placeholder="入站前的科研训练、相关进展，获得资助的情况等"
            />
          </ElFormItem>

          <ElFormItem label="2. 选题的必要性分析">
            <ElInput
              v-model={form.value.necessity_analysis}
              type="textarea"
              rows={4}
              placeholder="500字以内"
            />
          </ElFormItem>

          <ElFormItem label="3. 研究规划及预期成果">
            <ElInput
              v-model={form.value.resplan_expected}
              type="textarea"
              rows={4}
              placeholder="500字以内，论文需列出目标期刊名称，或注明为相当或更高水平期刊"
            />
          </ElFormItem>

          <ElFormItem label="4. 成果情况(请将近3年代表作列出；论文请注明题目、全部作者、发表年份、刊物、卷、页码、收录

及引用情况等，并按论文发表级别排序，共同第一作者用#标明，通讯作者用*标明；著作请注明所有作者姓名，书名，出版地，出版社)">
            <ElInput
              v-model={form.value.results}
              type="textarea"
              rows={6}
              placeholder="请将近3年代表作列出；论文请注明题目、全部作者、发表年份、刊物、卷、页码、收录及引用情况等，并按论文发表级别排序，共同第一作者用#标明，通讯作者用*标明；著作请注明所有作者姓名，书名，出版地，出版社"
            />
          </ElFormItem>

          <ElFormItem label="5. 其他代表性成果">
            <ElInput
              v-model={form.value.other_achievements}
              type="textarea"
              rows={4}
            />
          </ElFormItem>

          <ElFormItem label="6. 介绍本人学术理想与追求；对“科研人员要将学术道德、学术诚信视为生命线”的认识看法；接受相关学术诚信、学术规范培训的经历等">
            <ElInput
              v-model={form.value.academic_pursuits}
              type="textarea"
              rows={4}
              placeholder="介绍本人学术理想与追求；对科研人员要将学术道德、学术诚信视为生命线的认识看法；接受相关学术诚信、学术规范培训的经历等"
            />
          </ElFormItem>

          <h3>3. 本人承诺</h3>
          <ElFormItem>
            <div
              style={{
                width: '100%',
                border: '1px solid #e4e7ed',
                borderRadius: '6px',
                padding: '16px',
                background: '#fafbfc',
                boxSizing: 'border-box',
              }}
            >
              <ElAlert type="info" show-icon closable={false} style={{ marginBottom: '16px' }}>
                <div>{form.value.commitment}</div>
              </ElAlert>
              <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                <div>
                  <SignaturePad onChange={val => onInput(val)} />
                  <ElDatePicker
                    v-model={form.value.date}
                    type="date"
                    placeholder="选择日期"
                    style={{ width: '300px' }}
                  />
                </div>
              </div>
            </div>
          </ElFormItem>
          <div style={{ display: 'flex', justifyContent: 'center'}}>          
            <ElButton type="primary" onClick={handleSubmit}>申请</ElButton>
            <ElButton>返回</ElButton>
          </div>
          <Audit onBack={() => { }} />
            <div style={{ display: 'flex', justifyContent: 'center',marginTop:'5px'}}>
              <ElButton type="primary">导出</ElButton>
              <ElButton>返回</ElButton>
            </div>
        </ElForm>
      </div>
    );
  }
});