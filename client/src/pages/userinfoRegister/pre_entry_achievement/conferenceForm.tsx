import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker ,ElMessageBox,ElMessage } from "element-plus";
import {
  getConferenceById,
  createConference,
  updateConference,
  deleteConference,
  getMyConferences
} from "@/api/postdoctor/userinfoRegister/conference";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "会议编号", prop: "confId", width: 100 },
  { label: "会议名称", prop: "confName", width: 120 },
  { label: "会议英文名称", prop: "confNameEn", width: 140 },
  { label: "主办单位", prop: "hostOrg", width: 120 },
  { label: "会议举办形式", prop: "form", width: 110 },
  { label: "会议等级", prop: "level", width: 100 },
  { label: "国家或地区", prop: "country", width: 100 },
  { label: "是否境外", prop: "isAbroad", width: 80 },
  { label: "会议起始日期", prop: "startDate", width: 110 },
  { label: "会议终止日期", prop: "endDate", width: 110 },
  { label: "举办单位", prop: "org", width: 120 },
  { label: "会议人数", prop: "attendeeNum", width: 90 },
  { label: "联系人电话", prop: "contact", width: 120 },
  { label: "会议地点", prop: "location", width: 120 },
  { label: "备注", prop: "remark", width: 120 },
];

function db2form(item: any) {
  return {
    id: item.id,
    confId: item["会议编号"] ?? "",
    confName: item["会议名称"] ?? "",
    confNameEn: item["会议英文名"] ?? "",
    hostOrg: item["主办单位"] ?? "",
    form: item["会议举办形式"] ?? "",
    level: item["会议等级"] ?? "",
    country: item["国家或地区"] ?? "",
    isAbroad: item["是否境外"] ?? "",
    startDate: item["会议起始日"] ?? "",
    endDate: item["会议终止日"] ?? "",
    org: item["举办单位"] ?? "",
    attendeeNum: item["会议人数"] ?? "",
    contact: item["联系人电话"] ?? "",
    location: item["会议地点"] ?? "",
    report: item["会议报告"] ?? "",
    remark: item["备注"] ?? "",
  };
}

function form2db(item: any) {
  return {
    "会议编号": item.confId,
    "会议名称": item.confName,
    "会议英文名": item.confNameEn,
    "主办单位": item.hostOrg,
    "会议举办形式": item.form,
    "会议等级": item.level,
    "国家或地区": item.country,
    "是否境外": item.isAbroad,
    "会议起始日": item.startDate ? new Date(item.startDate).toISOString() : null,
    "会议终止日": item.endDate ? new Date(item.endDate).toISOString() : null,
    "举办单位": item.org,
    "会议人数": item.attendeeNum,
    "联系人电话": item.contact,
    "会议地点": item.location,
    "会议报告": item.report,
    "备注": item.remark,
  };
}

export default defineComponent({
  name: "ConferenceForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editIndex = ref(-1); // -1: 新增, >=0: 编辑
    const editData = ref<any>({
      id: null,
      confId: "",
      confName: "",
      confNameEn: "",
      hostOrg: "",
      form: "",
      level: "",
      country: "",
      isAbroad: "",
      startDate: "",
      endDate: "",
      org: "",
      attendeeNum: "",
      contact: "",
      location: "",
      report: "",
      reportFile: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        confId: "",
        confName: "",
        confNameEn: "",
        hostOrg: "",
        form: "",
        level: "",
        country: "",
        isAbroad: "",
        startDate: "",
        endDate: "",
        org: "",
        attendeeNum: "",
        contact: "",
        location: "",
        report: "",
        reportFile: null,
        remark: ""
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getConferenceById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        // 新增
        const res = await createConference(data);
        if (res) tableData.value.push(db2form(res));
      } else {
        // 编辑
        const id = tableData.value[editIndex.value].id;
        const res = await updateConference(id, data);
        if (res) tableData.value[editIndex.value] = db2form(res);
      }
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleCancel = () => {
      showForm.value = false;
      editIndex.value = -1;
    };

    // 文件上传回调
    const handleFileChange = (file: any) => {
      editData.value.reportFile = file.raw;
    };

    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteConference(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    onMounted(async () => {
      const data = await getMyConferences();
      tableData.value = (data ?? []).map(db2form);
    });

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>学术会议信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}>
                  <ElFormItem label="会议编号">
                    <ElInput v-model={editData.value.confId} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议名称">
                    <ElInput v-model={editData.value.confName} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议英文名称">
                    <ElInput v-model={editData.value.confNameEn} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="主办单位">
                    <ElInput v-model={editData.value.hostOrg} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议举办形式">
                    <ElInput v-model={editData.value.form} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议等级">
                    <ElInput v-model={editData.value.level} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="国家或地区">
                    <ElInput v-model={editData.value.country} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="是否境外">
                    <ElInput v-model={editData.value.isAbroad} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议起始日期">
                    <ElDatePicker
                      v-model={editData.value.startDate}
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="选择日期"
                      style={{ width: '100%' }}
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议终止日期">
                    <ElDatePicker
                      v-model={editData.value.endDate}
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="选择日期"
                      style={{ width: '100%' }}
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="举办单位">
                    <ElInput v-model={editData.value.org} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议人数">
                    <ElInput v-model={editData.value.attendeeNum} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="联系人电话">
                    <ElInput v-model={editData.value.contact} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议地点">
                    <ElInput v-model={editData.value.location} />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElFormItem label="会议报告">
                <ElInput type="textarea" rows={4} v-model={editData.value.report} />
              </ElFormItem>
              <ElFormItem label="会议报告文件">
                <ElUpload
                  show-file-list={false}
                  before-upload={() => false}
                  on-change={handleFileChange}
                >
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.reportFile && <span style={{ marginLeft: 10 }}>{editData.value.reportFile.name}</span>}
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
                ) : col.prop === 'startDate' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row.startDate ? dayjs(row.startDate).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : col.prop === 'endDate' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD') : ''
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