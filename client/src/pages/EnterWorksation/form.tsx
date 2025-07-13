import { defineComponent, ref, onMounted } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElRadioGroup, ElRadio, ElTable, ElTableColumn, ElMessage, ElDatePicker } from "element-plus";
import * as styles from "@/pages/userinfoRegister/styles.css";
import { getUserProfile, submitUserProfile, deleteUserProfile } from '@/api/postdoctor/userinfoRegister/bs_user_profile';

export default defineComponent({
  name: "UserInfoForm",
  setup() {
    // 表单数据
    const form = ref({
      name: "",
      gender: "",
      birth_year: "",
      nationality: "",
      political_status: "",
      phone: "",
      religion: "",
      id_number: "",
      is_religious_staff: "",
      research_direction: "",
      education_experience: [
        { start: "", end: "", school: "", major: "", supervisor: "" }
      ],
      work_experience: [
        { start: "", end: "", company: "", position: "" }
      ],
      other: ""
    });

    // 表单校验规则
    const rules = {
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      gender: [{ required: true, message: "请选择性别", trigger: "change" }],
      birth_year: [{ required: true, message: "请输入出生年", trigger: "blur" }],
    };

    // 加载用户信息
    const fetchProfile = async () => {
      try {
        
        const data = await getUserProfile();
        console.log('111');
        if (data) {
          form.value = {
            ...form.value,
            ...data,
            name: data.name ?? "",
            gender: data.gender ?? "",
            birth_year: data.birth_year ? String(data.birth_year) : "",
            nationality: data.nationality ?? "",
            political_status: data.political_status ?? "",
            phone: data.phone ?? "",
            religion: data.religion ?? "",
            id_number: data.id_number ?? "",
            is_religious_staff: data.is_religious_staff ? "是" : "否",
            research_direction: data.research_direction ?? "",
            other: data.other ?? "",
            education_experience: (data.education_experience || []).map((e: any) => {
              // 匹配两个日期（YYYY-MM-DD-YYYY-MM-DD）
              const match = (e.start_end || "").match(/^(.{10})-(.{10})$/);
              return {
                start: match ? match[1] : "",
                end: match ? match[2] : "",
                school: e.school_major ?? "",
                major: "",
                supervisor: e.supervisor ?? ""
              };
            }),
            work_experience: (data.work_experience || []).map((w: any) => {
              const match = (w.start_end || "").match(/^(.{10})-(.{10})$/);
              return {
                start: match ? match[1] : "",
                end: match ? match[2] : "",
                company: w.company_position ?? "",
                position: ""
              };
            })
          };
        }
      } catch (e: any) {
        // 未查到信息时不报错
      }
    };

    onMounted(fetchProfile);

 
    return () => (
      <div class={styles.formWrapper}>
        <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>基本信息表</div>
        <ElForm model={form.value} rules={rules} labelWidth="100px">
          {/* 基本信息两列 */}
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="姓名" prop="name">
                <ElInput v-model={form.value.name} disabled/>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="性别" prop="gender">
                <ElRadioGroup v-model={form.value.gender} disabled>
                  <ElRadio label="男">男</ElRadio>
                  <ElRadio label="女">女</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="出生年" prop="birth_year">
                <ElInput v-model={form.value.birth_year} disabled/>
              </ElFormItem>
            </div>
          </div>
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="国籍">
                <ElInput v-model={form.value.nationality} disabled/>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="政治面貌">
                <ElInput v-model={form.value.political_status} disabled/>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="电话">
                <ElInput v-model={form.value.phone} disabled/>
              </ElFormItem>
            </div>
          </div>
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="宗教信仰">
                <ElInput v-model={form.value.religion} disabled/>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="证件号">
                <ElInput v-model={form.value.id_number} disabled/>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="宗教教职人员">
                <ElRadioGroup v-model={form.value.is_religious_staff} disabled>
                  <ElRadio label="是">是</ElRadio>
                  <ElRadio label="否">否</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
            </div>
          </div>
          <ElFormItem label="博士期间研究方向">
            <ElInput v-model={form.value.research_direction} type="textarea" rows={2} disabled/>
          </ElFormItem>
          {/* 教育经历表格 */}
          <div style={{ fontWeight: 700, fontSize: '1.1em', margin: '1.5em 0 0.5em 0' }}>
            教育经历 <span style={{ fontWeight: 400, fontSize: '0.95em' }}>(从高中填起，请勿间断)</span>
          </div>
          <ElFormItem label=" ">
            <ElTable data={form.value.education_experience} class={styles.table} style={{ width: "100%" }} >
              <ElTableColumn label="起止时间">
                {{
                  default: ({ row }: any) => (
                    <>
                      <ElDatePicker
                        v-model={row.start}
                        type="date"
                        placeholder="起"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        disabled
                      />
                      <span> - </span>
                      <ElDatePicker
                        v-model={row.end}
                        type="date"
                        placeholder="止"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        disabled
                      />
                    </>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="毕业学校、专业及单位">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.school} placeholder="毕业学校、专业及单位" style={{ width: "220px" }} disabled/>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="导师">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.supervisor} placeholder="导师" style={{ width: "100px" }} disabled/>
                  )
                }}
              </ElTableColumn>
            </ElTable>
          </ElFormItem>
          {/* 工作经历表格 */}
          <div style={{ fontWeight: 700, fontSize: '1.1em', margin: '1.5em 0 0.5em 0' }}>
            工作经历 <span style={{ fontWeight: 400, fontSize: '0.95em' }}>(含博士后经历，请勿间断)</span>
          </div>
          <ElFormItem label=" ">
            <ElTable data={form.value.work_experience} class={styles.table} style={{ width: "100%" }}>
              <ElTableColumn label="起止时间">
                {{
                  default: ({ row }: any) => (
                    <>
                      <ElDatePicker
                        v-model={row.start}
                        type="date"
                        placeholder="起"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        disabled
                      />
                      <span> - </span>
                      <ElDatePicker
                        v-model={row.end}
                        type="date"
                        placeholder="止"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        disabled
                      />
                    </>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="工作单位及职务">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.company} placeholder="工作单位及职务" style={{ width: "220px" }} disabled/>
                  )
                }}
              </ElTableColumn>
            </ElTable>
          </ElFormItem>
          {/* 其他说明 */}
          <ElFormItem label="其他说明">
            <ElInput v-model={form.value.other} type="textarea" rows={2} placeholder="是否有亲属在本工作（姓名和亲属关系），何时何地受过何种处分或者被追究刑事责任" disabled/>
          </ElFormItem>
        </ElForm>
      </div>
    );
  }
});
