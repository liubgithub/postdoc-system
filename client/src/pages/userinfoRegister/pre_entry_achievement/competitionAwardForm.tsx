import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyCompetitionAwards,
  getCompetitionAwardById,
  createCompetitionAward,
  updateCompetitionAward,
  deleteCompetitionAward
} from '@/api/postdoctor/userinfoRegister/competition_award';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "竞赛名称", prop: "competitionName", width: 120 },
  { label: "获奖级别", prop: "awardLevel", width: 100 },
  { label: "获奖类别", prop: "awardCategory", width: 100 },
  { label: "获奖等级", prop: "awardGrade", width: 100 },
  { label: "奖项名称", prop: "awardName", width: 120 },
  { label: "获奖时间", prop: "awardDate", width: 110 },
  { label: "颁奖单位", prop: "organizer", width: 120 },
  { label: "第一完成单位", prop: "firstUnit", width: 120 },
  { label: "完成单位排名", prop: "unitRank", width: 120 },
  { label: "本人署名", prop: "author", width: 100 },
  { label: "是否和学位论文相关", prop: "relatedToThesis", width: 140 },
  { label: "作者名单", prop: "authorList", width: 120 },
  { label: "备注", prop: "remark", width: 120 }
];

function db2form(item: any) {
  return {
    id: item.id,
    competitionName: item["竞赛名称"] ?? "",
    awardLevel: item["获奖级别"] ?? "",
    awardCategory: item["获奖类别"] ?? "",
    awardGrade: item["获奖等级"] ?? "",
    awardName: item["奖项名称"] ?? "",
    awardDate: item["获奖时间"] ? dayjs(item["获奖时间"]).format('YYYY-MM-DD') : "",
    organizer: item["颁奖单位"] ?? "",
    firstUnit: item["第一完成单位"] ?? "",
    unitRank: item["完成单位排名"] ?? "",
    author: item["本人署名"] ?? "",
    relatedToThesis: item["是否和学位论文相关"] ?? "",
    authorList: item["作者名单"] ?? "",
    remark: item["备注"] ?? "",
    certificateFile: item["上传获奖证书文件"] ?? null
  };
}

function form2db(item: any) {
  return {
    "竞赛名称": item.competitionName,
    "获奖级别": item.awardLevel,
    "获奖类别": item.awardCategory,
    "获奖等级": item.awardGrade,
    "奖项名称": item.awardName,
    "获奖时间": item.awardDate ? dayjs(item.awardDate).toISOString() : null,
    "颁奖单位": item.organizer,
    "第一完成单位": item.firstUnit,
    "完成单位排名": item.unitRank,
    "本人署名": item.author,
    "是否和学位论文相关": item.relatedToThesis,
    "作者名单": item.authorList,
    "备注": item.remark,
    "上传获奖证书文件": item.certificateFile
  };
}

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
      competitionName: "",
      awardLevel: "",
      awardCategory: "",
      awardGrade: "",
      awardName: "",
      awardDate: "",
      organizer: "",
      firstUnit: "",
      unitRank: "",
      author: "",
      relatedToThesis: "",
      authorList: "",
      remark: "",
      certificateFile: null
    });

    const loadAwards = async () => {
      const data = await getMyCompetitionAwards();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        competitionName: "",
        awardLevel: "",
        awardCategory: "",
        awardGrade: "",
        awardName: "",
        awardDate: "",
        organizer: "",
        firstUnit: "",
        unitRank: "",
        author: "",
        relatedToThesis: "",
        authorList: "",
        remark: "",
        certificateFile: null
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getCompetitionAwardById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createCompetitionAward(data);
        if (res) tableData.value.push(db2form(res));
        ElMessage.success('新增成功');
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updateCompetitionAward(id, data);
        if (res) tableData.value[editIndex.value] = db2form(res);
        ElMessage.success('修改成功');
      }
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleCancel = () => {
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该获奖信息吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteCompetitionAward(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (event: any) => {
      const file = event.file;
      if (file) {
        editData.value.certificateFile = file;
      }
    };

    onMounted(loadAwards);

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
                <ElCol span={12}><ElFormItem label="获奖时间">
                  <ElDatePicker v-model={editData.value.awardDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="获奖等级"><ElInput v-model={editData.value.awardGrade} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人署名"><ElInput v-model={editData.value.author} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="颁奖单位"><ElInput v-model={editData.value.organizer} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一完成单位"><ElInput v-model={editData.value.firstUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="完成单位排名"><ElInput v-model={editData.value.unitRank} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否和学位论文相关"><ElInput v-model={editData.value.relatedToThesis} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="奖项名称"><ElInput v-model={editData.value.awardName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者名单"><ElInput v-model={editData.value.authorList} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传获奖证书文件">
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
            <div style={{ marginBottom: '1em' }}>
              <ElButton type="primary" size="small" onClick={handleAdd}>添加</ElButton>
            </div>
            <ElTable data={tableData.value} style={{ width: '100%' }} header-cell-style={{ textAlign: 'center' }} cell-style={{ textAlign: 'center' }}>
              {columns.map(col => (
                col.prop === 'id' ? (
                  <ElTableColumn
                    key={col.prop}
                    label={col.label}
                    width={col.width}
                    v-slots={{
                      default: ({ $index }: any) => $index + 1
                    }}
                  />
                ) : (
                  <ElTableColumn key={col.prop} label={col.label} prop={col.prop} width={col.width} />
                )
              ))}
              <ElTableColumn label="操作" width="160" align="center">
                {{
                  default: ({ row, $index }: any) => (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <ElButton type="primary" size="small" icon={<Edit />} onClick={() => handleEdit(row, $index)}>编辑</ElButton>
                      <ElButton type="danger" size="small" icon={<Delete />} onClick={() => handleDelete(row, $index)}>删除</ElButton>
                    </div>
                  )
                }}
              </ElTableColumn>
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