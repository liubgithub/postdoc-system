import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyProjects,
  getProjectById,
  uploadProject,
  updateProject,
  deleteProject
} from '@/api/postdoctor/userinfoRegister/project';

const columns = [
  { label: "序号", prop: "id", width: 60 },

  { label: "项目编号", prop: "项目编号", width: 100 },
  { label: "项目名称", prop: "项目名称", width: 120 },
  { label: "项目类型", prop: "项目类型", width: 100 },
  { label: "是否和学位论文相关", prop: "是否和学位论文相关", width: 140 },
  { label: "项目标题", prop: "项目标题", width: 120 },
  { label: "立项日期", prop: "立项日期", width: 110 },
  { label: "项目层次", prop: "项目层次", width: 100 },
  { label: "是否结项", prop: "是否结项", width: 100 },
  { label: "验收或鉴定日期", prop: "验收或鉴定日期", width: 120 },
  { label: "项目执行状态", prop: "项目执行状态", width: 120 },
  { label: "本人角色", prop: "本人角色", width: 100 },
  { label: "参与者总数", prop: "参与者总数", width: 100 },
  { label: "参与者名单", prop: "参与者名单", width: 120 },
  { label: "承担任务", prop: "承担任务", width: 120 },
  { label: "项目经费说明", prop: "项目经费说明", width: 120 },
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
    项目编号: item["项目编号"] ?? "",
    项目名称: item["项目名称"] ?? "",
    项目类型: item["项目类型"] ?? "",
    是否和学位论文相关: item["是否和学位论文相关"] ?? "",
    项目标题: item["项目标题"] ?? "",
    立项日期: item["立项日期"] ? dayjs(item["立项日期"]).format('YYYY-MM-DD') : "",
    项目层次: item["项目层次"] ?? "",
    是否结项: item["是否结项"] ?? "",
    验收或鉴定日期: item["验收或鉴定日期"] ? dayjs(item["验收或鉴定日期"]).format('YYYY-MM-DD') : "",
    项目执行状态: item["项目执行状态"] ?? "",
    本人角色: item["本人角色"] ?? "",
    参与者总数: item["参与者总数"] ?? "",
    参与者名单: item["参与者名单"] ?? "",
    承担任务: item["承担任务"] ?? "",
    项目经费说明: item["项目经费说明"] ?? "",
    上传项目成果文件: item["上传项目成果文件"] ?? "",
    备注: item["备注"] ?? "",
    time: item["time"] ? dayjs(item["time"]).format('YYYY-MM-DD') : ""
  };
}

export default defineComponent({
  name: "ProjectForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editIndex = ref(-1); // -1: 新增, >=0: 编辑
    const editData = ref<any>({
      id: null,
      "项目编号": "",
      "项目名称": "",
      "项目类型": "",
      "是否和学位论文相关": "",
      "项目标题": "",
      "立项日期": "",
      "项目层次": "",
      "是否结项": "",
      "验收或鉴定日期": "",
      "项目执行状态": "",
      "本人角色": "",
      "参与者总数": "",
      "参与者名单": "",
      "承担任务": "",
      "项目经费说明": "",
      "备注": "",
      "上传项目成果文件": null,
      time: 0,
    });

    const loadProjects = async () => {
      const data = await getMyProjects();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        "项目编号": "",
        "项目名称": "",
        "项目类型": "",
        "是否和学位论文相关": "",
        "项目标题": "",
        "立项日期": "",
        "项目层次": "",
        "是否结项": "",
        "验收或鉴定日期": "",
        "项目执行状态": "",
        "本人角色": "",
        "参与者总数": "",
        "参与者名单": "",
        "承担任务": "",
        "项目经费说明": "",
        "备注": "",
        "上传项目成果文件": null,
        time: 0,
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getProjectById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      if (!editData.value["项目名称"]?.trim()) {
        ElMessage.error('项目名称不能为空');
        return;
      }
      const formData = new FormData();
      formData.append("项目编号", editData.value["项目编号"] || "");
      formData.append("项目名称", editData.value["项目名称"]);
      formData.append("项目类型", editData.value["项目类型"] || "");
      formData.append("是否和学位论文相关", editData.value["是否和学位论文相关"] || "");
      formData.append("项目标题", editData.value["项目标题"] || "");
      formData.append("立项日期", editData.value["立项日期"] || "");
      formData.append("项目层次", editData.value["项目层次"] || "");
      formData.append("是否结项", editData.value["是否结项"] || "");
      formData.append("验收或鉴定日期", editData.value["验收或鉴定日期"] || "");
      formData.append("项目执行状态", editData.value["项目执行状态"] || "");
      formData.append("本人角色", editData.value["本人角色"] || "");
      formData.append("参与者总数", editData.value["参与者总数"] || "");
      formData.append("参与者名单", editData.value["参与者名单"] || "");
      formData.append("承担任务", editData.value["承担任务"] || "");
      formData.append("项目经费说明", editData.value["项目经费说明"] || "");
      if (editData.value["上传项目成果文件"] instanceof File) {
        formData.append("上传项目成果文件", editData.value["上传项目成果文件"]);
      }
      formData.append("备注", editData.value["备注"] || "");
      formData.append("time", editData.value["time"] || 0);
      let res;
      if (editIndex.value === -1) {
        res = await uploadProject(formData);
        if (res) {
          const data = await getMyProjects();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        const id = editData.value.id;
        res = await updateProject(id, formData);
        if (res) {
          const data = await getMyProjects();
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
      await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteProject(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value["上传项目成果文件"] = fileObj.raw;
      }
    };

    onMounted(loadProjects);

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>参与项目信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="项目编号"><ElInput v-model={editData.value["项目编号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目名称"><ElInput v-model={editData.value["项目名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目类型"><ElInput v-model={editData.value["项目类型"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否和学位论文相关"><ElInput v-model={editData.value["是否和学位论文相关"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目标题"><ElInput v-model={editData.value["项目标题"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="立项日期">
                  <ElDatePicker v-model={editData.value["立项日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目层次"><ElInput v-model={editData.value["项目层次"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否结项"><ElInput v-model={editData.value["是否结项"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="到款或验收日期">
                  <ElDatePicker v-model={editData.value["验收或鉴定日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目执行状态"><ElInput v-model={editData.value["项目执行状态"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人角色"><ElInput v-model={editData.value["本人角色"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="参与者总数"><ElInput v-model={editData.value["参与者总数"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="参与者名单"><ElInput v-model={editData.value["参与者名单"]} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="承担任务">
                <ElInput type="textarea" rows={4} v-model={editData.value["承担任务"]} />
              </ElFormItem>
              <ElFormItem label="项目经费说明">
                <ElInput type="textarea" rows={4} v-model={editData.value["项目经费说明"]} />
              </ElFormItem>
              <ElCol span={12}>
                <ElFormItem label="成果提交时间">
                  <ElDatePicker
                   v-model={editData.value["time"]}
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="选择日期"
                    style={{ width: '100%' }}
                  />
                </ElFormItem>
              </ElCol>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value["备注"]} />
              </ElFormItem>
              <ElFormItem label="上传项目成果文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value["上传项目成果文件"] && editData.value["上传项目成果文件"] instanceof File && (
                  <span style={{ marginLeft: 10, color: '#409EFF' }}>{editData.value["上传项目成果文件"].name}</span>
                )}
                {/* 原文件名 */}
                {editData.value["上传项目成果文件"] && typeof editData.value["上传项目成果文件"] === 'string' && (
                  <span style={{ marginLeft: 10, color: '#666' }}>{editData.value["上传项目成果文件"].split('/').pop()}</span>
                )}
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
              <ElTableColumn label="上传项目成果文件" width="180">
                {{
                  default: ({ row }: any) => (
                    <div>
                      {row["上传项目成果文件"] && (
                        <a href={row["上传项目成果文件"]} target="_blank" style={{ color: '#409EFF', textDecoration: 'none' }}>
                          {row["上传项目成果文件"].split('/').pop()}
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