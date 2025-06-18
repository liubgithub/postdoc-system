import { defineComponent, ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElRadioGroup, ElRadio, ElTable, ElTableColumn, ElMessage } from "element-plus";
import * as styles from "./styles.css.ts";

const menuList = [
  { label: "个人信息登记", key: "userinfo" },
  { label: "入站前已有成果登记", key: "preEntryAchievements" },
];

export default defineComponent({
  name: "userinfoRegister",
  setup() {
    const activeMenu = ref("userinfo");
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
    const handleSubmit = () => {
      ElMessage.success("保存成功！");
    };

    return () => (
      <div class={styles.container}>
        {/* 左侧菜单栏 */}
        <div class={styles.sidebar}>
          {menuList.map(item => (
            <button
              class={[styles.menuBtn, activeMenu.value === item.key ? styles.menuBtnActive : ""]}
              onClick={() => (activeMenu.value = item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* 右侧表单内容 */}
        <div class={styles.main}>
          <div class={styles.formWrapper}>
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
              <ElFormItem label="教育经历">
                <ElTable data={form.value.education_experience} class={styles.table} style={{ width: "100%" }}>
                  <ElTableColumn label="起止时间">
                    {{
                      default: ({ row }: any) => (
                        <>
                          <ElInput v-model={row.start} placeholder="起" style={{ width: "80px" }} />
                          <span> - </span>
                          <ElInput v-model={row.end} placeholder="止" style={{ width: "80px" }} />
                        </>
                      )
                    }}
                  </ElTableColumn>
                  <ElTableColumn label="毕业学校、专业及单位">
                    {{
                      default: ({ row }: any) => (
                        <>
                          <ElInput v-model={row.school} placeholder="学校" style={{ width: "120px" }} />
                          <ElInput v-model={row.major} placeholder="专业" style={{ width: "80px" }} />
                        </>
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
              <ElFormItem label="工作经历">
                <ElTable data={form.value.work_experience} class={styles.table} style={{ width: "100%" }}>
                  <ElTableColumn label="起止时间">
                    {{
                      default: ({ row }: any) => (
                        <>
                          <ElInput v-model={row.start} placeholder="起" style={{ width: "80px" }} />
                          <span> - </span>
                          <ElInput v-model={row.end} placeholder="止" style={{ width: "80px" }} />
                        </>
                      )
                    }}
                  </ElTableColumn>
                  <ElTableColumn label="工作单位及职务">
                    {{
                      default: ({ row }: any) => (
                        <>
                          <ElInput v-model={row.company} placeholder="单位" style={{ width: "120px" }} />
                          <ElInput v-model={row.position} placeholder="职务" style={{ width: "80px" }} />
                        </>
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
              </div>
            </ElForm>
          </div>
        </div>
      </div>
    );
  }
});