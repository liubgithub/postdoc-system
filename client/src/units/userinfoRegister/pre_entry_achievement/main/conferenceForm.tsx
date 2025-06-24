import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

const columns = [
  { label: "序号", prop: "id" },
  { label: "会议编号", prop: "confId" },
  { label: "会议名称", prop: "confName" },
  { label: "会议英文名称", prop: "confNameEn" },
  { label: "主办单位", prop: "hostOrg" },
  { label: "会议举办形式", prop: "form" },
  { label: "会议等级", prop: "level" },
  { label: "国家或地区", prop: "country" },
  { label: "是否境外", prop: "isAbroad" },
  { label: "会议起始日期", prop: "startDate" },
  { label: "会议终止日期", prop: "endDate" },
  { label: "举办单位", prop: "org" },
  { label: "会议人数", prop: "attendeeNum" },
  { label: "联系人电话", prop: "contact" },
  { label: "会议地点", prop: "location" },
  { label: "备注", prop: "remark" },
];

export default defineComponent({
  name: "ConferenceForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editData = ref<any>({
      id: null,
      confId: "",
      confName: "",
      confNameEn: "",
      hostOrg: "",
      form: "",
      level: "",
      country: "",
      isAbroad: "",
      startDate: "",
      endDate: "",
      org: "",
      attendeeNum: "",
      contact: "",
      location: "",
      report: "",
      reportFile: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        confId: "",
        confName: "",
        confNameEn: "",
        hostOrg: "",
        form: "",
        level: "",
        country: "",
        isAbroad: "",
        startDate: "",
        endDate: "",
        org: "",
        attendeeNum: "",
        contact: "",
        location: "",
        report: "",
        reportFile: null,
        remark: ""
      };
      showForm.value = true;
    };

    const handleSave = () => {
      tableData.value.push({ ...editData.value });
      showForm.value = false;
    };

    const handleCancel = () => {
      showForm.value = false;
    };

    // 文件上传回调
    const handleFileChange = (file: any) => {
      editData.value.reportFile = file.raw;
    };

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>学术会议信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}>
                  <ElFormItem label="会议编号">
                    <ElInput v-model={editData.value.confId} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议名称">
                    <ElInput v-model={editData.value.confName} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议英文名称">
                    <ElInput v-model={editData.value.confNameEn} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="主办单位">
                    <ElInput v-model={editData.value.hostOrg} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议举办形式">
                    <ElInput v-model={editData.value.form} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议等级">
                    <ElInput v-model={editData.value.level} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="国家或地区">
                    <ElInput v-model={editData.value.country} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="是否境外">
                    <ElInput v-model={editData.value.isAbroad} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议起始日期">
                    <ElInput v-model={editData.value.startDate} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议终止日期">
                    <ElInput v-model={editData.value.endDate} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="举办单位">
                    <ElInput v-model={editData.value.org} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议人数">
                    <ElInput v-model={editData.value.attendeeNum} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="联系人电话">
                    <ElInput v-model={editData.value.contact} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议地点">
                    <ElInput v-model={editData.value.location} />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElFormItem label="会议报告">
                <ElInput type="textarea" rows={4} v-model={editData.value.report} />
              </ElFormItem>
              <ElFormItem label="会议报告文件">
                <ElUpload
                  show-file-list={false}
                  before-upload={() => false}
                  on-change={handleFileChange}
                >
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.reportFile && <span style={{ marginLeft: 10 }}>{editData.value.reportFile.name}</span>}
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.remark} />
              </ElFormItem>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
                <ElButton type="primary" onClick={handleSave} style={{ marginRight: '2em' }}>提交</ElButton>
                <ElButton onClick={handleCancel}>返回</ElButton>
              </div>
            </ElForm>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1em' }}>
              <ElButton type="primary" size="small" onClick={handleAdd}>添加</ElButton>
            </div>
            <ElTable data={tableData.value} style={{ width: '100%' }} header-cell-style={{ textAlign: 'center' }} cell-style={{ textAlign: 'center' }}>
              {columns.map(col => (
                <ElTableColumn
                  label={col.label}
                  prop={col.prop}
                  v-slots={{
                    default: ({ row }: any) => row[col.prop] ?? ""
                  }}
                />
              ))}
            </ElTable>
            <div style={{ textAlign: 'center', marginTop: '2em' }}>
              <ElButton style={{ marginRight: '2em' }} onClick={evt => props.onBack && props.onBack(evt)}>返回</ElButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}); 