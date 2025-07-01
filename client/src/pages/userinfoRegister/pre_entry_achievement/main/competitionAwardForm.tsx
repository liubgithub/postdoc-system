import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "学号", prop: "stuId", width: 100 },
  { label: "竞赛名称", prop: "competitionName", width: 120 },
  { label: "获奖级别", prop: "awardLevel", width: 100 },
  { label: "获奖类别", prop: "awardCategory", width: 100 },
  { label: "获奖等级", prop: "awardGrade", width: 100 },
  { label: "奖项名称", prop: "awardName", width: 120 },
  { label: "获奖时间", prop: "awardDate", width: 100 },
  { label: "主办单位", prop: "organizer", width: 120 },
  { label: "获奖证书编号", prop: "certificateNumber", width: 120 },
  { label: "第一完成单位", prop: "firstUnit", width: 120 },
  { label: "完成单位", prop: "unit", width: 120 },
  { label: "完成单位排名", prop: "unitRank", width: 120 },
  { label: "本人署名", prop: "author", width: 100 },
  { label: "是否和学位论文相关", prop: "relatedToThesis", width: 140 },
  { label: "备注", prop: "remark", width: 120 },
  { label: "操作", prop: "action", width: 100 }
];

export default defineComponent({
  name: "CompetitionAwardForm",
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
      competitionName: "",
      awardLevel: "",
      awardCategory: "",
      awardGrade: "",
      awardName: "",
      awardDate: "",
      organizer: "",
      certificateNumber: "",
      firstUnit: "",
      unit: "",
      unitRank: "",
      author: "",
      relatedToThesis: "",
      remark: "",
      certificateFile: null,
      authorList: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        stuId: "",
        competitionName: "",
        awardLevel: "",
        awardCategory: "",
        awardGrade: "",
        awardName: "",
        awardDate: "",
        organizer: "",
        certificateNumber: "",
        firstUnit: "",
        unit: "",
        unitRank: "",
        author: "",
        relatedToThesis: "",
        remark: "",
        certificateFile: null,
        authorList: ""
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
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>科技竞赛获奖信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="竞赛名称"><ElInput v-model={editData.value.competitionName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="获奖类别"><ElInput v-model={editData.value.awardCategory} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="获奖级别"><ElInput v-model={editData.value.awardLevel} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="获奖时间"><ElInput v-model={editData.value.awardDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="获奖等级"><ElInput v-model={editData.value.awardGrade} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人署名"><ElInput v-model={editData.value.author} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="主办单位"><ElInput v-model={editData.value.organizer} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="获奖证书编号"><ElInput v-model={editData.value.certificateNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一完成单位"><ElInput v-model={editData.value.firstUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="完成单位"><ElInput v-model={editData.value.unit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="完成单位排名"><ElInput v-model={editData.value.unitRank} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否和学位论文相关"><ElInput v-model={editData.value.relatedToThesis} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="奖项名称"><ElInput v-model={editData.value.awardName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者名单"><ElInput v-model={editData.value.authorList} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传获奖证书文件">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  {editData.value.certificateFile && <span style={{ marginLeft: 10 }}>{editData.value.certificateFile.name}</span>}
                </div>
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.remark} />
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