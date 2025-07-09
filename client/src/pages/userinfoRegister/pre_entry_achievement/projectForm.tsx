import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '@/api/postdoctor/userinfoRegister/project';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "项目编号", prop: "projectNumber", width: 100 },
  { label: "项目名称", prop: "projectName", width: 120 },
  { label: "项目标题", prop: "projectTitle", width: 120 },
  { label: "承担任务", prop: "taskDetail", width: 120 },
  { label: "项目类别", prop: "projectType", width: 100 },
  { label: "本人角色", prop: "role", width: 100 },
  { label: "是否和学位论文相关", prop: "relatedToThesis", width: 140 },
  { label: "项目层次", prop: "projectLevel", width: 100 },
  { label: "立项日期", prop: "startDate", width: 110 },
  { label: "是否结项", prop: "isCompleted", width: 100 },
  { label: "到款或验收日期", prop: "acceptDate", width: 120 },
  { label: "项目执行状态", prop: "status", width: 120 },
  { label: "参与者总数", prop: "participantCount", width: 100 },
  { label: "参与者名单", prop: "participants", width: 120 }
];

function db2form(item: any) {
  return {
    id: item.id,
    projectNumber: item["项目编号"] ?? "",
    projectName: item["项目名称"] ?? "",
    projectType: item["项目类型"] ?? "",
    relatedToThesis: item["是否和学位论文相关"] ?? "",
    projectTitle: item["项目标题"] ?? "",
    startDate: item["立项日期"] ? dayjs(item["立项日期"]).format('YYYY-MM-DD') : "",
    projectLevel: item["项目层次"] ?? "",
    isCompleted: item["是否结项"] ?? "",
    acceptDate: item["验收或鉴定日期"] ? dayjs(item["验收或鉴定日期"]).format('YYYY-MM-DD') : "",
    status: item["项目执行状态"] ?? "",
    role: item["本人角色"] ?? "",
    participantCount: item["参与者总数"] ?? "",
    participants: item["参与者名单"] ?? "",
    taskDetail: item["承担任务"] ?? "",
    projectDesc: item["项目经费说明"] ?? "",
    achievementFile: item["上传项目成果文件"] ?? null,
    remark: item["备注"] ?? ""
  };
}

function form2db(item: any) {
  return {
    "项目编号": item.projectNumber,
    "项目名称": item.projectName,
    "项目类型": item.projectType,
    "是否和学位论文相关": item.relatedToThesis,
    "项目标题": item.projectTitle,
    "立项日期": item.startDate ? dayjs(item.startDate).toISOString() : null,
    "项目层次": item.projectLevel,
    "是否结项": item.isCompleted,
    "验收或鉴定日期": item.acceptDate ? dayjs(item.acceptDate).toISOString() : null,
    "项目执行状态": item.status,
    "本人角色": item.role,
    "参与者总数": item.participantCount,
    "参与者名单": item.participants,
    "承担任务": item.taskDetail,
    "项目经费说明": item.projectDesc,
    "上传项目成果文件": item.achievementFile,
    "备注": item.remark
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
      projectNumber: "",
      projectName: "",
      projectType: "",
      relatedToThesis: "",
      projectTitle: "",
      startDate: "",
      projectLevel: "",
      isCompleted: "",
      acceptDate: "",
      status: "",
      role: "",
      participantCount: "",
      participants: "",
      taskDetail: "",
      projectDesc: "",
      achievementFile: null,
      remark: ""
    });

    const loadProjects = async () => {
      const data = await getMyProjects();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        projectNumber: "",
        projectName: "",
        projectType: "",
        relatedToThesis: "",
        projectTitle: "",
        startDate: "",
        projectLevel: "",
        isCompleted: "",
        acceptDate: "",
        status: "",
        role: "",
        participantCount: "",
        participants: "",
        taskDetail: "",
        projectDesc: "",
        achievementFile: null,
        remark: ""
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
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createProject(data);
        if (res) tableData.value.push(db2form(res));
        ElMessage.success('新增成功');
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updateProject(id, data);
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
      await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteProject(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (event: any) => {
      const file = event.file;
      if (file) {
        editData.value.achievementFile = file;
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
                <ElCol span={12}><ElFormItem label="项目编号"><ElInput v-model={editData.value.projectNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目名称"><ElInput v-model={editData.value.projectName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目类型"><ElInput v-model={editData.value.projectType} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否和学位论文相关"><ElInput v-model={editData.value.relatedToThesis} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目标题"><ElInput v-model={editData.value.projectTitle} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="立项日期">
                  <ElDatePicker v-model={editData.value.startDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目层次"><ElInput v-model={editData.value.projectLevel} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否结项"><ElInput v-model={editData.value.isCompleted} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="到款或验收日期">
                  <ElDatePicker v-model={editData.value.acceptDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目执行状态"><ElInput v-model={editData.value.status} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人角色"><ElInput v-model={editData.value.role} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="参与者总数"><ElInput v-model={editData.value.participantCount} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="参与者名单"><ElInput v-model={editData.value.participants} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="承担任务">
                <ElInput type="textarea" rows={4} v-model={editData.value.taskDetail} />
              </ElFormItem>
              <ElFormItem label="项目经费说明">
                <ElInput type="textarea" rows={4} v-model={editData.value.projectDesc} />
              </ElFormItem>
              <ElFormItem label="上传项目成果文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.achievementFile && <span style={{ marginLeft: 10 }}>{editData.value.achievementFile.name}</span>}
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