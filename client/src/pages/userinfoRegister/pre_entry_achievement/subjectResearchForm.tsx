import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMySubjectResearches,
  getSubjectResearchById,
  uploadSubjectResearch,
  updateSubjectResearch,
  deleteSubjectResearch
} from '@/api/postdoctor/userinfoRegister/subject_research';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "课题名称", prop: "课题名称", width: 120 },
  { label: "课题来源", prop: "课题来源", width: 120 },
  { label: "开始时间", prop: "开始时间", width: 110 },
  { label: "结束时间", prop: "结束时间", width: 110 },
  { label: "课题负责人", prop: "课题负责人", width: 120 },
  { label: "本人承担部分", prop: "本人承担部分", width: 120 },
  { label: "课题级别", prop: "课题级别", width: 100 },
  {
    label: "成果提交时间",
    prop: "time",
    width: 150,
    formatter: ({ row }: any) => {
      if (!row.time) return "";
      try {
        return dayjs(row.time).format('YYYY-MM-DD');
      } catch (e) {
        console.error('时间格式化错误:', e);
        return row.time;
      }
    }
  },
  { label: "备注", prop: "备注", width: 120 },
];

function db2form(item: any) {
  return {
    id: item.id,
    user_id: item.user_id,
    time: item.time ? dayjs(item.time).format('YYYY-MM-DD') : "",
    课题名称: item["课题名称"] ?? "",
    课题来源: item["课题来源"] ?? "",
    开始时间: item["开始时间"] ? dayjs(item["开始时间"]).format('YYYY-MM-DD') : "",
    结束时间: item["结束时间"] ? dayjs(item["结束时间"]).format('YYYY-MM-DD') : "",
    课题负责人: item["课题负责人"] ?? "",
    本人承担部分: item["本人承担部分"] ?? "",
    课题级别: item["课题级别"] ?? "",
    上传文件: item["上传文件"] ?? "",
    备注: item["备注"] ?? "",
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
      time: "",
      "课题名称": "",
      "课题来源": "",
      "开始时间": "",
      "结束时间": "",
      "课题负责人": "",
      "本人承担部分": "",
      "课题级别": "",
      "备注": "",
      "上传文件": null,
    });

    const loadSubjects = async () => {
      const data = await getMySubjectResearches();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        time: "",
        "课题名称": "",
        "课题来源": "",
        "开始时间": "",
        "结束时间": "",
        "课题负责人": "",
        "本人承担部分": "",
        "课题级别": "",
        "备注": "",
        "上传文件": null,
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
      if (!editData.value["课题名称"]?.trim()) {
        ElMessage.error('课题名称不能为空');
        return;
      }
      const formData = new FormData();
      formData.append("课题名称", editData.value["课题名称"]);
      formData.append("课题来源", editData.value["课题来源"] || "");
      formData.append("开始时间", editData.value["开始时间"] || "");
      formData.append("结束时间", editData.value["结束时间"] || "");
      formData.append("课题负责人", editData.value["课题负责人"] || "");
      formData.append("本人承担部分", editData.value["本人承担部分"] || "");
      formData.append("课题级别", editData.value["课题级别"] || "");
      if (editData.value["上传文件"] instanceof File) {
        formData.append("上传文件", editData.value["上传文件"]);
      }
      formData.append("备注", editData.value["备注"] || "");
      formData.append("time", editData.value["time"] || "");

      let res;
      if (editIndex.value === -1) {
        res = await uploadSubjectResearch(formData);
        if (res) {
          const data = await getMySubjectResearches();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        const id = editData.value.id;
        res = await updateSubjectResearch(id, formData);
        if (res) {
          const data = await getMySubjectResearches();
          tableData.value = (data ?? []).map(db2form);
        }
      }
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleCancel = () => {
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该课题吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteSubjectResearch(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value["上传文件"] = fileObj.raw;
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
                <ElCol span={12}><ElFormItem label="成果时间">
                  <ElDatePicker
                    v-model={editData.value["time"]}
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    placeholder="选择成果时间"
                    style={{ width: '100%' }}
                  />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题名称"><ElInput v-model={editData.value["课题名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题来源"><ElInput v-model={editData.value["课题来源"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="开始时间">
                  <ElDatePicker v-model={editData.value["开始时间"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="结束时间">
                  <ElDatePicker v-model={editData.value["结束时间"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题负责人"><ElInput v-model={editData.value["课题负责人"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="课题级别"><ElInput v-model={editData.value["课题级别"]} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="本人承担部分">
                <ElInput type="textarea" rows={4} v-model={editData.value["本人承担部分"]} />
              </ElFormItem>
              <ElFormItem label="上传文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value["上传文件"] && editData.value["上传文件"] instanceof File && (
                  <span style={{ marginLeft: 10, color: '#409EFF' }}>{editData.value["上传文件"].name}</span>
                )}
                {/* 原文件名 */}
                {editData.value["上传文件"] && typeof editData.value["上传文件"] === 'string' && (
                  <span style={{ marginLeft: 10, color: '#666' }}>{editData.value["上传文件"].split('/').pop()}</span>
                )}
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value["备注"]} />
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
              <ElTableColumn label="上传文件" width="150">
                {{
                  default: ({ row }: any) => (
                    <div>
                      {row["上传文件"] && (
                        <a href={row["上传文件"]} target="_blank" style={{ color: '#409EFF', textDecoration: 'none' }}>
                          {row["上传文件"].split('/').pop()}
                        </a>
                      )}
                    </div>
                  )
                }}
              </ElTableColumn>
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