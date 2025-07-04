import { defineComponent, ref, onMounted } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElRadioGroup, ElRadio, ElTable, ElTableColumn, ElMessage, ElDatePicker } from "element-plus";
import * as styles from "./styles.css.ts";
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

    // 教育经历操作
    const addEducation = () => {
      form.value.education_experience.push({ start: "", end: "", school: "", major: "", supervisor: "" });
    };
    const removeEducation = (index: number) => {
      form.value.education_experience.splice(index, 1);
    };
    // 工作经历操作
    const addWork = () => {
      form.value.work_experience.push({ start: "", end: "", company: "", position: "" });
    };
    const removeWork = (index: number) => {
      form.value.work_experience.splice(index, 1);
    };
    // 提交
    const handleSubmit = async () => {
      // 数据格式转换
      const payload = {
        ...form.value,
        birth_year: form.value.birth_year ? Number(form.value.birth_year) : undefined,
        is_religious_staff: form.value.is_religious_staff === '是',
        education_experience: form.value.education_experience.map(e => ({
          start_end: `${e.start}-${e.end}`,
          school_major: e.school,
          supervisor: e.supervisor || ""
        })),
        work_experience: form.value.work_experience.map(w => ({
          start_end: `${w.start}-${w.end}`,
          company_position: w.company
        }))
      };
      try {
        await submitUserProfile(payload);
        ElMessage.success('保存成功！');
        fetchProfile();
      } catch (e: any) {
        ElMessage.error(e?.message || '保存失败');
      }
    };

    // 重置（删除）
    const handleReset = async () => {
      try {
        await deleteUserProfile();
        ElMessage.success('已重置！');
        // 清空表单
        form.value = {
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
        };
      } catch (e: any) {
        ElMessage.error(e?.message || '重置失败');
      }
    };

    return () => (
      <div class={styles.formWrapper}>
        <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>基本信息表</div>
        <ElForm model={form.value} rules={rules} labelWidth="100px">
          {/* 基本信息两列 */}
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="姓名" prop="name">
                <ElInput v-model={form.value.name} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="性别" prop="gender">
                <ElRadioGroup v-model={form.value.gender}>
                  <ElRadio label="男">男</ElRadio>
                  <ElRadio label="女">女</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="出生年" prop="birth_year">
                <ElInput v-model={form.value.birth_year} />
              </ElFormItem>
            </div>
          </div>
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="国籍">
                <ElInput v-model={form.value.nationality} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="政治面貌">
                <ElInput v-model={form.value.political_status} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="电话">
                <ElInput v-model={form.value.phone} />
              </ElFormItem>
            </div>
          </div>
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="宗教信仰">
                <ElInput v-model={form.value.religion} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="证件号">
                <ElInput v-model={form.value.id_number} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="宗教教职人员">
                <ElRadioGroup v-model={form.value.is_religious_staff}>
                  <ElRadio label="是">是</ElRadio>
                  <ElRadio label="否">否</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
            </div>
          </div>
          <ElFormItem label="博士期间研究方向">
            <ElInput v-model={form.value.research_direction} type="textarea" rows={2} />
          </ElFormItem>
          {/* 教育经历表格 */}
          <div style={{ fontWeight: 700, fontSize: '1.1em', margin: '1.5em 0 0.5em 0' }}>
            教育经历 <span style={{ fontWeight: 400, fontSize: '0.95em' }}>(从高中填起，请勿间断)</span>
          </div>
          <ElFormItem label=" ">
            <ElTable data={form.value.education_experience} class={styles.table} style={{ width: "100%" }}>
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
                      />
                      <span> - </span>
                      <ElDatePicker
                        v-model={row.end}
                        type="date"
                        placeholder="止"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                    </>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="毕业学校、专业及单位">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.school} placeholder="毕业学校、专业及单位" style={{ width: "220px" }} />
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="导师">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.supervisor} placeholder="导师" style={{ width: "100px" }} />
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="操作">
                {{
                  default: ({ $index }: any) => (
                    <ElButton type="danger" size="small" onClick={() => removeEducation($index)}>删除</ElButton>
                  )
                }}
              </ElTableColumn>
            </ElTable>
            <ElButton type="primary" size="small" onClick={addEducation} style={{ marginTop: "8px" }}>添加教育经历</ElButton>
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
                      />
                      <span> - </span>
                      <ElDatePicker
                        v-model={row.end}
                        type="date"
                        placeholder="止"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                    </>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="工作单位及职务">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.company} placeholder="工作单位及职务" style={{ width: "220px" }} />
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="操作">
                {{
                  default: ({ $index }: any) => (
                    <ElButton type="danger" size="small" onClick={() => removeWork($index)}>删除</ElButton>
                  )
                }}
              </ElTableColumn>
            </ElTable>
            <ElButton type="primary" size="small" onClick={addWork} style={{ marginTop: "8px" }}>添加工作经历</ElButton>
          </ElFormItem>
          {/* 其他说明 */}
          <ElFormItem label="其他说明">
            <ElInput v-model={form.value.other} type="textarea" rows={2} placeholder="是否有亲属在本工作（姓名和亲属关系），何时何地受过何种处分或者被追究刑事责任" />
          </ElFormItem>
          {/* 按钮组 */}
          <div class={styles.btnGroup}>
            <ElButton type="primary" onClick={handleSubmit}>提交</ElButton>
            <ElButton type="warning" onClick={handleReset}>重置</ElButton>
          </div>
        </ElForm>
      </div>
    );
  }
});
