import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker ,ElMessageBox,ElMessage } from "element-plus";
import dayjs from 'dayjs';
import { Edit, Delete } from '@element-plus/icons-vue';
import { getMyPatents, getPatentById, createPatent, updatePatent, deletePatent } from "@/api/postdoctor/userinfoRegister/patent";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "专利类型", prop: "patentType", width: 100 },
  { label: "专利成果名称", prop: "patentName", width: 140 },
  { label: "专利编号", prop: "patentNumber", width: 120 },
  { label: "专利权人", prop: "patentee", width: 120 },
  { label: "授权公告日期", prop: "grantDate", width: 120 },
  { label: "申请编号", prop: "applicationNumber", width: 120 },
  { label: "专利证书编号", prop: "certificateNumber", width: 120 },
  { label: "授权公告号", prop: "grantAnnouncementNumber", width: 120 },
  { label: "批准日期", prop: "approvalDate", width: 120 },
  { label: "专利终止日期", prop: "terminationDate", width: 120 },
  { label: "提交日期", prop: "submitDate", width: 120 },
  { label: "备注", prop: "remark", width: 120 }
];

function db2form(item: any) {
  return {
    id: item.id,
    patentee: item["专利权人"] ?? "",
    patentNumber: item["专利成果编码"] ?? "",
    patentName: item["专利成果名称"] ?? "",
    patentType: item["专利类型"] ?? "",
    submitDate: item["提交时间"] ? dayjs(item["提交时间"]).format('YYYY-MM-DD') : "",
    approvalDate: item["批准日期"] ? dayjs(item["批准日期"]).format('YYYY-MM-DD') : "",
    grantDate: item["授权公告日期"] ? dayjs(item["授权公告日期"]).format('YYYY-MM-DD') : "",
    applicationNumber: item["申请编号"] ?? "",
    certificateNumber: item["专利证书编号"] ?? "",
    terminationDate: item["专利终止日期"] ? dayjs(item["专利终止日期"]).format('YYYY-MM-DD') : "",
    grantAnnouncementNumber: item["授权公告号"] ?? "",
    authorOrder: item["作者排名"] ?? "",
    certificateFile: item["专利证书文文件"] ?? null,
    remark: item["备注"] ?? ""
  };
}

function form2db(item: any) {
  return {
    "专利权人": item.patentee,
    "专利成果编码": item.patentNumber,
    "专利成果名称": item.patentName,
    "专利类型": item.patentType,
    "提交时间": item.submitDate ? new Date(item.submitDate).toISOString() : null,
    "批准日期": item.approvalDate ? new Date(item.approvalDate).toISOString() : null,
    "授权公告日期": item.grantDate ? new Date(item.grantDate).toISOString() : null,
    "申请编号": item.applicationNumber,
    "专利证书编号": item.certificateNumber,
    "专利终止日期": item.terminationDate ? new Date(item.terminationDate).toISOString() : null,
    "授权公告号": item.grantAnnouncementNumber,
    "作者排名": item.authorOrder,
    "专利证书文文件": item.certificateFile,
    "备注": item.remark
  };
}

export default defineComponent({
  name: "PatentForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editIndex = ref(-1); // -1: 新增, >=0: 编辑
    const editData = ref<any>({
      id: null,
      patentType: "",
      patentName: "",
      patentNumber: "",
      patentee: "",
      grantDate: "",
      applicationNumber: "",
      certificateNumber: "",
      grantAnnouncementNumber: "",
      approvalDate: "",
      terminationDate: "",
      submitDate: "",
      authorOrder: "",
      certificateFile: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: null,
        patentType: "",
        patentName: "",
        patentNumber: "",
        patentee: "",
        grantDate: "",
        applicationNumber: "",
        certificateNumber: "",
        grantAnnouncementNumber: "",
        approvalDate: "",
        terminationDate: "",
        submitDate: "",
        authorOrder: "",
        certificateFile: null,
        remark: ""
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getPatentById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createPatent(data);
        if (res) tableData.value.push(db2form(res));
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updatePatent(id, data);
        if (res) tableData.value[editIndex.value] = db2form(res);
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


    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deletePatent(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    onMounted(async () => {
      const data = await getMyPatents();
      tableData.value = (data ?? []).map(db2form);
    });

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>专利信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="专利权人"><ElInput v-model={editData.value.patentee} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利成果编号"><ElInput v-model={editData.value.patentNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利成果名称"><ElInput v-model={editData.value.patentName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利类型"><ElInput v-model={editData.value.patentType} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="提交日期"><ElDatePicker v-model={editData.value.submitDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="批准日期"><ElDatePicker v-model={editData.value.approvalDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="授权公告日期"><ElDatePicker v-model={editData.value.grantDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="申请编号"><ElInput v-model={editData.value.applicationNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利证书编号"><ElInput v-model={editData.value.certificateNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利终止日期"><ElDatePicker v-model={editData.value.terminationDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="授权公告号"><ElInput v-model={editData.value.grantAnnouncementNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者排名"><ElInput v-model={editData.value.authorOrder} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="专利证书文件">
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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
              <ElButton type="primary" size="small" onClick={handleAdd}>添加</ElButton>
            </div>
            <ElTable data={tableData.value} style={{ width: '100%' }} empty-text="暂无数据" header-cell-style={{ textAlign: 'center' }} cell-style={{ textAlign: 'center' }}>
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
                ) : ["submitDate", "approvalDate", "grantDate", "terminationDate"].includes(col.prop) ? (
                  <ElTableColumn
                    key={col.prop}
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) => row[col.prop] ? dayjs(row[col.prop]).format('YYYY-MM-DD') : ''
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
              <ElButton onClick={e => typeof props.onBack === 'function' && props.onBack(e)}>返回</ElButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}); 