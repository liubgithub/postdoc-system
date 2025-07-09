import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMySubjectResearches,
  getSubjectResearchById,
  createSubjectResearch,
  updateSubjectResearch,
  deleteSubjectResearch
} from '@/api/postdoctor/userinfoRegister/subject_research';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "课题名称", prop: "subjectName", width: 120 },
  { label: "课题来源", prop: "subjectSource", width: 120 },
  { label: "开始时间", prop: "startDate", width: 110 },
  { label: "结束时间", prop: "endDate", width: 110 },
  { label: "课题负责人", prop: "leader", width: 120 },
  { label: "本人承担部分", prop: "myPart", width: 120 },
  { label: "课题级别", prop: "subjectLevel", width: 100 }
];

function db2form(item: any) {
  return {
    id: item.id,
    subjectName: item["课题名称"] ?? "",
    subjectSource: item["课题来源"] ?? "",
    startDate: item["开始时间"] ? dayjs(item["开始时间"]).format('YYYY-MM-DD') : "",
    endDate: item["结束时间"] ? dayjs(item["结束时间"]).format('YYYY-MM-DD') : "",
    leader: item["课题负责人"] ?? "",
    myPart: item["本人承担部分"] ?? "",
    subjectLevel: item["课题级别"] ?? "",
    file: item["上传文件"] ?? null,
    remark: item["备注"] ?? ""
  };
}

function form2db(item: any) {
  return {
    "课题名称": item.subjectName,
    "课题来源": item.subjectSource,
    "开始时间": item.startDate ? dayjs(item.startDate).toISOString() : null,
    "结束时间": item.endDate ? dayjs(item.endDate).toISOString() : null,
    "课题负责人": item.leader,
    "本人承担部分": item.myPart,
    "课题级别": item.subjectLevel,
    "上传文件": item.file,
    "备注": item.remark
  };
}

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
      subjectName: "",
      subjectSource: "",
      startDate: "",
      endDate: "",
      leader: "",
      myPart: "",
      subjectLevel: "",
      file: null,
      remark: ""
    });

    const loadSubjects = async () => {
      const data = await getMySubjectResearches();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        subjectName: "",
        subjectSource: "",
        startDate: "",
        endDate: "",
        leader: "",
        myPart: "",
        subjectLevel: "",
        file: null,
        remark: ""
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getSubjectResearchById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createSubjectResearch(data);
        if (res) tableData.value.push(db2form(res));
        ElMessage.success('新增成功');
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updateSubjectResearch(id, data);
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
      await ElMessageBox.confirm('确定要删除该课题研究信息吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteSubjectResearch(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (event: any) => {
      const file = event.file;
      if (file) {
        editData.value.file = file;
      }
    };

    onMounted(loadSubjects);

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>课题研究信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="课题名称"><ElInput v-model={editData.value.subjectName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题来源"><ElInput v-model={editData.value.subjectSource} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="开始时间">
                  <ElDatePicker v-model={editData.value.startDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="结束时间">
                  <ElDatePicker v-model={editData.value.endDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题负责人"><ElInput v-model={editData.value.leader} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人承担部分"><ElInput v-model={editData.value.myPart} /></ElFormItem></ElCol>
                <ElCol span={24}><ElFormItem label="课题级别"><ElInput v-model={editData.value.subjectLevel} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.file && <span style={{ marginLeft: 10 }}>{editData.value.file.name}</span>}
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
                ) : col.prop === 'startDate' || col.prop === 'endDate' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row[col.prop] ? dayjs(row[col.prop]).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) => row[col.prop] ?? ""
                    }}
                  />
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