import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "学号", prop: "stuId", width: 100 },
  { label: "课题名称", prop: "subjectName", width: 120 },
  { label: "课题来源", prop: "subjectSource", width: 120 },
  { label: "开始时间", prop: "startDate", width: 100 },
  { label: "结束时间", prop: "endDate", width: 100 },
  { label: "课题负责人", prop: "leader", width: 120 },
  { label: "本人承担部分", prop: "myPart", width: 120 },
  { label: "课题级别", prop: "subjectLevel", width: 100 },
  { label: "操作", prop: "action", width: 100 }
];

export default defineComponent({
  name: "SubjectResearchForm",
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
      subjectName: "",
      subjectSource: "",
      startDate: "",
      endDate: "",
      leader: "",
      myPart: "",
      subjectLevel: "",
      file: null
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        stuId: "",
        subjectName: "",
        subjectSource: "",
        startDate: "",
        endDate: "",
        leader: "",
        myPart: "",
        subjectLevel: "",
        file: null
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
      editData.value.file = file.raw;
    };

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>课题研究信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="课题名称"><ElInput v-model={editData.value.subjectName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题来源"><ElInput v-model={editData.value.subjectSource} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="开始时间"><ElInput v-model={editData.value.startDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="结束时间"><ElInput v-model={editData.value.endDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题负责人"><ElInput v-model={editData.value.leader} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人承担部分"><ElInput v-model={editData.value.myPart} /></ElFormItem></ElCol>
                <ElCol span={24}><ElFormItem label="课题级别"><ElInput v-model={editData.value.subjectLevel} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传文件">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  {editData.value.file && <span style={{ marginLeft: 10 }}>{editData.value.file.name}</span>}
                </div>
              </ElFormItem>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
                <ElButton onClick={handleCancel} style={{ marginRight: '2em' }}>取消</ElButton>
                <ElButton type="primary" onClick={handleSave}>提交</ElButton>
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