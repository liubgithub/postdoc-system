import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "学号", prop: "stuId", width: 100 },
  { label: "项目编号", prop: "projectNumber", width: 100 },
  { label: "项目名称", prop: "projectName", width: 120 },
  { label: "项目标题", prop: "projectTitle", width: 120 },
  { label: "承担任务", prop: "task", width: 120 },
  { label: "项目类别", prop: "projectType", width: 100 },
  { label: "本人角色", prop: "role", width: 100 },
  { label: "是否和学位论文相关", prop: "relatedToThesis", width: 140 },
  { label: "项目层次", prop: "projectLevel", width: 100 },
  { label: "立项日期", prop: "startDate", width: 100 },
  { label: "是否结项", prop: "isCompleted", width: 100 },
  { label: "到款或验收日期", prop: "acceptDate", width: 120 },
  { label: "项目执行状态", prop: "status", width: 120 },
  { label: "项目负责人", prop: "leader", width: 100 },
  { label: "项目联系人", prop: "contact", width: 100 },
  { label: "参与者总数", prop: "participantCount", width: 100 },
  { label: "参与者名单", prop: "participants", width: 120 },
  { label: "操作", prop: "action", width: 100 }
];

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
      stuId: "",
      projectNumber: "",
      projectName: "",
      projectTitle: "",
      task: "",
      projectType: "",
      role: "",
      relatedToThesis: "",
      projectLevel: "",
      startDate: "",
      isCompleted: "",
      acceptDate: "",
      status: "",
      leader: "",
      contact: "",
      participantCount: "",
      participants: "",
      achievementFile: null,
      remark: "",
      taskDetail: "",
      projectDesc: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        stuId: "",
        projectNumber: "",
        projectName: "",
        projectTitle: "",
        task: "",
        projectType: "",
        role: "",
        relatedToThesis: "",
        projectLevel: "",
        startDate: "",
        isCompleted: "",
        acceptDate: "",
        status: "",
        leader: "",
        contact: "",
        participantCount: "",
        participants: "",
        achievementFile: null,
        remark: "",
        taskDetail: "",
        projectDesc: ""
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
      editData.value.achievementFile = file.raw;
    };

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
                <ElCol span={12}><ElFormItem label="立项日期"><ElInput v-model={editData.value.startDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目层次"><ElInput v-model={editData.value.projectLevel} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否结项"><ElInput v-model={editData.value.isCompleted} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="到款或验收日期"><ElInput v-model={editData.value.acceptDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目执行状态"><ElInput v-model={editData.value.status} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目负责人"><ElInput v-model={editData.value.leader} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="项目联系人"><ElInput v-model={editData.value.contact} /></ElFormItem></ElCol>
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  {editData.value.achievementFile && <span style={{ marginLeft: 10 }}>{editData.value.achievementFile.name}</span>}
                </div>
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.remark} />
              </ElFormItem>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
                <ElButton onClick={handleCancel} style={{ marginRight: '2em' }}>取消</ElButton>
                <ElButton type="primary" onClick={handleSave}>保存</ElButton>
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