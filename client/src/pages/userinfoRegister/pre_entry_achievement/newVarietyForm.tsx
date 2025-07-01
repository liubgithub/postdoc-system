import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "学号", prop: "stuId", width: 100 },
  { label: "姓名", prop: "name", width: 100 },
  { label: "动植物名称", prop: "animalPlantName", width: 120 },
  { label: "品种名称", prop: "varietyName", width: 120 },
  { label: "选育单位", prop: "breedingUnit", width: 120 },
  { label: "本校是否第一完成单位", prop: "isFirstUnit", width: 140 },
  { label: "署名排序", prop: "authorOrder", width: 100 },
  { label: "第一完成单位", prop: "firstUnit", width: 120 },
  { label: "公示年份", prop: "publicYear", width: 100 },
  { label: "公告号", prop: "announcementNumber", width: 120 },
  { label: "审定编号", prop: "approvalNumber", width: 120 },
  { label: "审定单位", prop: "approvalUnit", width: 120 },
  { label: "操作", prop: "action", width: 100 }
];

export default defineComponent({
  name: "NewVarietyForm",
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
      name: "",
      animalPlantName: "",
      varietyName: "",
      breedingUnit: "",
      isFirstUnit: "",
      authorOrder: "",
      firstUnit: "",
      publicYear: "",
      announcementNumber: "",
      approvalNumber: "",
      approvalUnit: "",
      authorList: "",
      file: null
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        stuId: "",
        name: "",
        animalPlantName: "",
        varietyName: "",
        breedingUnit: "",
        isFirstUnit: "",
        authorOrder: "",
        firstUnit: "",
        publicYear: "",
        announcementNumber: "",
        approvalNumber: "",
        approvalUnit: "",
        authorList: "",
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
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>新品种类型信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="署名排序"><ElInput v-model={editData.value.authorOrder} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本校是否第一完成单位"><ElInput v-model={editData.value.isFirstUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一完成单位"><ElInput v-model={editData.value.firstUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="公示年份"><ElInput v-model={editData.value.publicYear} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="动植物名称"><ElInput v-model={editData.value.animalPlantName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="品种名称"><ElInput v-model={editData.value.varietyName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="选育单位"><ElInput v-model={editData.value.breedingUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="公告号"><ElInput v-model={editData.value.announcementNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="审定编号"><ElInput v-model={editData.value.approvalNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="审定单位"><ElInput v-model={editData.value.approvalUnit} /></ElFormItem></ElCol>
                <ElCol span={24}><ElFormItem label="作者名单"><ElInput v-model={editData.value.authorList} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传新品种证明文件">
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