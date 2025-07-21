import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyPatents,
  getPatentById,
  uploadPatent,
  updatePatent,
  deletePatent
} from '@/api/postdoctor/userinfoRegister/patent';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "专利名称", prop: "专利名称", width: 150 },
  { label: "专利类型", prop: "专利类型", width: 100 },
  { label: "申请日期", prop: "申请日期", width: 110 },
  { label: "授权日期", prop: "授权日期", width: 110 },
  { label: "专利号", prop: "专利号", width: 100 },
  { label: "申请号", prop: "申请号", width: 100 },
  { label: "发明人", prop: "发明人", width: 100 },
  { label: "专利权人", prop: "专利权人", width: 120 },
  { label: "专利状态", prop: "专利状态", width: 100 },
  { label: "上传文件", prop: "上传文件", width: 120 },
  { label: "备注", prop: "备注", width: 120 }
];

function db2form(item: any) {
  return {
    id: item.id,
    user_id: item.user_id,
    专利名称: item["专利成果名称"] ?? "",
    专利类型: item["专利类型"] ?? "",
    申请日期: item["提交时间"] ? dayjs(item["提交时间"]).format('YYYY-MM-DD') : "",
    授权日期: item["批准日期"] ? dayjs(item["批准日期"]).format('YYYY-MM-DD') : "",
    专利号: item["授权公告号"] ?? "",
    申请号: item["申请编号"] ?? "",
    发明人: item["作者排名"] ?? "",
    专利权人: item["专利权人"] ?? "",
    专利状态: item["专利成果编码"] ?? "",
    上传文件: item["专利证书文文件"] ?? null,
    备注: item["备注"] ?? "",
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
      "专利名称": "",
      "专利类型": "",
      "申请日期": "",
      "授权日期": "",
      "专利号": "",
      "申请号": "",
      "发明人": "",
      "专利权人": "",
      "专利状态": "",
      "上传文件": null,
      "备注": "",
    });

    const loadPatents = async () => {
      const data = await getMyPatents();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        "专利名称": "",
        "专利类型": "",
        "申请日期": "",
        "授权日期": "",
        "专利号": "",
        "申请号": "",
        "发明人": "",
        "专利权人": "",
        "专利状态": "",
        "上传文件": null,
        "备注": "",
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
      if (!editData.value["专利名称"]?.trim()) {
        ElMessage.error('专利名称不能为空');
        return;
      }
      
      const formData = new FormData();
      formData.append("专利成果名称", editData.value["专利名称"]);
      formData.append("专利类型", editData.value["专利类型"] || "");
      formData.append("提交时间", editData.value["申请日期"] || "");
      formData.append("批准日期", editData.value["授权日期"] || "");
      formData.append("授权公告号", editData.value["专利号"] || "");
      formData.append("申请编号", editData.value["申请号"] || "");
      formData.append("作者排名", editData.value["发明人"] || "");
      formData.append("专利权人", editData.value["专利权人"] || "");
      formData.append("专利成果编码", editData.value["专利状态"] || "");
      if (editData.value["上传文件"] instanceof File) {
        formData.append("专利证书文文件", editData.value["上传文件"]);
      }
      formData.append("备注", editData.value["备注"] || "");
      formData.append("achievement_type", "0");
      
      let res;
      if (editIndex.value === -1) {
        // 新增
        res = await uploadPatent(formData);
        if (res) {
          const data = await getMyPatents();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        // 编辑
        const id = editData.value.id;
        res = await updatePatent(id, formData);
        if (res) {
          const data = await getMyPatents();
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

    // 文件上传回调
    const handleFileChange = (file: any) => {
      editData.value["上传文件"] = file.raw;
    };

    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该专利吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deletePatent(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    onMounted(loadPatents);

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>专利信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="专利名称"><ElInput v-model={editData.value["专利名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利类型"><ElInput v-model={editData.value["专利类型"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="申请日期">
                  <ElDatePicker v-model={editData.value["申请日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="授权日期">
                  <ElDatePicker v-model={editData.value["授权日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利号"><ElInput v-model={editData.value["专利号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="申请号"><ElInput v-model={editData.value["申请号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="发明人"><ElInput v-model={editData.value["发明人"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利权人"><ElInput v-model={editData.value["专利权人"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="专利状态"><ElInput v-model={editData.value["专利状态"]} /></ElFormItem></ElCol>
              </ElRow>
              
              <ElFormItem label="上传文件">
                <ElUpload
                  show-file-list={false}
                  before-upload={() => false}
                  on-change={handleFileChange}
                >
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value["上传文件"] && <span style={{ marginLeft: 10 }}>{editData.value["上传文件"].name}</span>}
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
                ) : col.prop === '申请日期' || col.prop === '授权日期' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row[col.prop] ? dayjs(row[col.prop]).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : col.prop === '上传文件' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row["上传文件"] ? (
                          <a href={row["上传文件"]} target="_blank" style={{ color: '#409EFF', textDecoration: 'none' }}>
                            {row["上传文件"].split('/').pop()}
                          </a>
                        ) : ""
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