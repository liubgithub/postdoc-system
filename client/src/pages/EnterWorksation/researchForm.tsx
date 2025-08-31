import { ElForm, ElFormItem, ElInput, ElButton, ElDatePicker, ElAlert, ElMessage } from "element-plus";
import * as styles from "./styles.css.ts";
import SignaturePad from '@/units/Signature/index'
import Audit from './audit.tsx'
import apiFetch from '@/api/index.ts'

// 引入用户store获取token
import useUser from '@/stores/user';

export default defineComponent({
  name: "ResearchForm",
  props: {
    onSubmitSuccess: {
      type: Function,
      required: false
    },
    onBack: {
      type: Function,
      required: true
    },
    showButtons: {
      type: Boolean,
      default: true
    },
    // 新增：外部传入的用户ID
    externalUserId: {
      type: Number,
      default: null
    },
    // 新增：当前用户角色
    userRole: {
      type: String,
      default: 'student' // student, teacher, etc.
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

    const handleSubmit = async () => {
      console.log(form.value, 'fffff')
      props.onSubmitSuccess && props.onSubmitSuccess()
      try {
        const res = await apiFetch.raw.POST('/enterRelation/', { body: form.value })
        if (res.response.ok) {
          ElMessage.success('提交成功')
        }
      } catch (error) {
        console.log(error)
      }
    };

    const handleBack = () => {
      props.onBack && props.onBack()
    }
    const onInput = async (val: any) => {
      console.log(val, 'signature')
      // 假设 externalUserId 作为 student_id，val 作为 image_base64
      const res = await apiFetch.raw.POST('/uploadSign/upload_image',
        {
          body: {
            sign_type: '进站申请',
            image_base64: val
          }
        }
      )
      console.log(res, 'sssss')

    }

    const fetchSignature = async () => {
      const res = await apiFetch.raw.GET('/uploadSign/get_image_base64', { params: { query: { sign_type: '进站申请' } } });
      const imgBase64 = (res.data as { image_base64: string }).image_base64;
      form.value.signature = imgBase64
    };

    onMounted(async () => {
      let res;
      const userStore = useUser();
      fetchSignature()
      try {
        // 如果有外部传入的用户ID，使用对应的接口
        if (props.externalUserId) {
          const response = await fetch(`/api/enterRelation/user/${props.externalUserId}`, {
            headers: {
              'Authorization': `Bearer ${userStore.info?.token || ''}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            res = await response.json();
          }
        } else {
          // 否则获取当前用户的数据
          const response = await apiFetch.raw.GET('/enterRelation/', {});
          res = response.data;
        }

        if (res) {
          Object.assign(form.value, res);
        }
        console.log(res, form.value, 'biao')
      } catch (error) {
        console.error('获取数据失败:', error);
      }
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
              disabled={props.userRole !== 'student'}
            />
          </ElFormItem>

          <ElFormItem label="2. 选题的必要性分析">
            <ElInput
              v-model={form.value.necessity_analysis}
              type="textarea"
              rows={4}
              placeholder="500字以内"
              disabled={props.userRole !== 'student'}
            />
          </ElFormItem>

          <ElFormItem label="3. 研究规划及预期成果">
            <ElInput
              v-model={form.value.resplan_expected}
              type="textarea"
              rows={4}
              placeholder="500字以内，论文需列出目标期刊名称，或注明为相当或更高水平期刊"
              disabled={props.userRole !== 'student'}
            />
          </ElFormItem>

          <ElFormItem label="4. 成果情况(请将近3年代表作列出；论文请注明题目、全部作者、发表年份、刊物、卷、页码、收录

及引用情况等，并按论文发表级别排序，共同第一作者用#标明，通讯作者用*标明；著作请注明所有作者姓名，书名，出版地，出版社)">
            <ElInput
              v-model={form.value.results}
              type="textarea"
              rows={6}
              placeholder="请将近3年代表作列出；论文请注明题目、全部作者、发表年份、刊物、卷、页码、收录及引用情况等，并按论文发表级别排序，共同第一作者用#标明，通讯作者用*标明；著作请注明所有作者姓名，书名，出版地，出版社"
              disabled={props.userRole !== 'student'}
            />
          </ElFormItem>

          <ElFormItem label="5. 其他代表性成果">
            <ElInput
              v-model={form.value.other_achievements}
              type="textarea"
              rows={4}
              disabled={props.userRole !== 'student'}
            />
          </ElFormItem>

          <ElFormItem label="6. 介绍本人学术理想与追求；对“科研人员要将学术道德、学术诚信视为生命线”的认识看法；接受相关学术诚信、学术规范培训的经历等">
            <ElInput
              v-model={form.value.academic_pursuits}
              type="textarea"
              rows={4}
              placeholder="介绍本人学术理想与追求；对科研人员要将学术道德、学术诚信视为生命线的认识看法；接受相关学术诚信、学术规范培训的经历等"
              disabled={props.userRole !== 'student'}
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
                  <SignaturePad disabled={props.userRole !== 'student'} onChange={val => onInput(val)} image={form.value.signature} />
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
          {props.showButtons && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ElButton type="primary" onClick={handleSubmit}>申请</ElButton>
                <ElButton onClick={handleBack}>返回</ElButton>
                <ElButton type="primary">导出</ElButton>
              </div>
            </>
          )}
          <Audit onBack={() => { }} userRole={props.userRole} />
        </ElForm>
      </div>
    );
  }
});