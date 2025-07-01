import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "学号", prop: "stuId", width: 100 },
  { label: "专利类型", prop: "patentType", width: 100 },
  { label: "专利成果名称", prop: "patentName", width: 140 },
  { label: "专利编号", prop: "patentNumber", width: 120 },
  { label: "专利权人", prop: "patentee", width: 120 },
  { label: "授权公告日期", prop: "grantDate", width: 120 },
  { label: "申请编号", prop: "applicationNumber", width: 120 },
  { label: "专利证书编号", prop: "certificateNumber", width: 120 },
  { label: "授权公告号", prop: "grantAnnouncementNumber", width: 120 },
  { label: "批准日期", prop: "approvalDate", width: 120 },
  { label: "专利终止日期", prop: "terminationDate", width: 120 },
  { label: "提交日期", prop: "submitDate", width: 120 },
  { label: "备注", prop: "remark", width: 120 },
  { label: "操作", prop: "action", width: 100 }
];

export default defineComponent({
  name: "PatentForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editIndex = ref(-1); // -1: 新增, >=0: 编辑
    const editData = ref<any>({
      id: null,
      stuId: "",
      patentType: "",
      patentName: "",
      patentNumber: "",
      patentee: "",
      grantDate: "",
      applicationNumber: "",
      certificateNumber: "",
      grantAnnouncementNumber: "",
      approvalDate: "",
      terminationDate: "",
      submitDate: "",
      authorOrder: "",
      certificateFile: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        stuId: "",
        patentType: "",
        patentName: "",
        patentNumber: "",
        patentee: "",
        grantDate: "",
        applicationNumber: "",
        certificateNumber: "",
        grantAnnouncementNumber: "",
        approvalDate: "",
        terminationDate: "",
        submitDate: "",
        authorOrder: "",
        certificateFile: null,
        remark: ""
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = (row: any, index: number) => {
      editData.value = { ...row };
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = () => {
      if (editIndex.value === -1) {
        tableData.value.push({ ...editData.value });
      } else {
        tableData.value[editIndex.value] = { ...editData.value };
      }
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleCancel = () => {
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleFileChange = (file: any) => {
      editData.value.certificateFile = file.raw;
    };

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>专利信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="专利权人"><ElInput v-model={editData.value.patentee} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利成果编号"><ElInput v-model={editData.value.patentNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利成果名称"><ElInput v-model={editData.value.patentName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利类型"><ElInput v-model={editData.value.patentType} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="提交日期"><ElInput v-model={editData.value.submitDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="批准日期"><ElInput v-model={editData.value.approvalDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="授权公告日期"><ElInput v-model={editData.value.grantDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="申请编号"><ElInput v-model={editData.value.applicationNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利证书编号"><ElInput v-model={editData.value.certificateNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利终止日期"><ElInput v-model={editData.value.terminationDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="授权公告号"><ElInput v-model={editData.value.grantAnnouncementNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者排名"><ElInput v-model={editData.value.authorOrder} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="专利证书文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.certificateFile && <span style={{ marginLeft: 10 }}>{editData.value.certificateFile.name}</span>}
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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
              <ElButton type="primary" size="small" onClick={handleAdd}>添加</ElButton>
            </div>
            <ElTable data={tableData.value} style={{ width: '100%' }} empty-text="暂无数据" header-cell-style={{ textAlign: 'center' }} cell-style={{ textAlign: 'center' }}>
              {columns.map(col => (
                <ElTableColumn key={col.prop} label={col.label} prop={col.prop} width={col.width} />
              ))}
              <ElTableColumn label="操作" width="100">
                {{
                  default: ({ row, $index }: any) => (
                    <ElButton size="small" onClick={() => handleEdit(row, $index)}>编辑</ElButton>
                  )
                }}
              </ElTableColumn>
            </ElTable>
            <div style={{ textAlign: 'center', marginTop: '2em' }}>
              <ElButton onClick={e => typeof props.onBack === 'function' && props.onBack(e)}>返回</ElButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}); 