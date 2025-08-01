import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyIndustryStandards,
  getIndustryStandardById,
  uploadIndustryStandard,
  updateIndustryStandard,
  deleteIndustryStandard
} from '@/api/postdoctor/userinfoRegister/industry_standard';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "标准名称", prop: "标准名称", width: 140 },
  { label: "标准编号", prop: "标准编号", width: 120 },
  { label: "发布日期", prop: "发布日期", width: 110 },
  { label: "实施日期", prop: "实施日期", width: 110 },
  { label: "归口单位", prop: "归口单位", width: 120 },
  { label: "起草单位", prop: "起草单位", width: 120 },
  { label: "适用范围", prop: "适用范围", width: 120 },
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
  { label: "备注", prop: "备注", width: 120 }
];

function db2form(item: any) {
  return {
    id: item.id,
    user_id: item.user_id,
    time: item.time ? dayjs(item.time).format('YYYY-MM-DD') : "",
    标准名称: item["标准名称"] ?? "",
    标准编号: item["标准编号"] ?? "",
    发布日期: item["发布日期"] ? dayjs(item["发布日期"]).format('YYYY-MM-DD') : "",
    实施日期: item["实施日期"] ? dayjs(item["实施日期"]).format('YYYY-MM-DD') : "",
    归口单位: item["归口单位"] ?? "",
    起草单位: item["起草单位"] ?? "",
    适用范围: item["适用范围"] ?? "",
    上传文件: item["上传文件"] ?? "",
    备注: item["备注"] ?? "",
  };
}

export default defineComponent({
  name: "IndustryStandardForm",
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
      "标准名称": "",
      "标准编号": "",
      "发布日期": "",
      "实施日期": "",
      "归口单位": "",
      "起草单位": "",
      "适用范围": "",
      "备注": "",
      "上传文件": null,
    });

    const loadStandards = async () => {
      const data = await getMyIndustryStandards();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        time: "",
        "标准名称": "",
        "标准编号": "",
        "发布日期": "",
        "实施日期": "",
        "归口单位": "",
        "起草单位": "",
        "适用范围": "",
        "备注": "",
        "上传文件": null,
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getIndustryStandardById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      if (!editData.value["标准名称"]?.trim()) {
        ElMessage.error('标准名称不能为空');
        return;
      }
      const formData = new FormData();
      formData.append("标准名称", editData.value["标准名称"]);
      formData.append("标准编号", editData.value["标准编号"] || "");
      formData.append("发布日期", editData.value["发布日期"] || "");
      formData.append("实施日期", editData.value["实施日期"] || "");
      formData.append("归口单位", editData.value["归口单位"] || "");
      formData.append("起草单位", editData.value["起草单位"] || "");
      formData.append("适用范围", editData.value["适用范围"] || "");
      if (editData.value["上传文件"] instanceof File) {
        formData.append("上传文件", editData.value["上传文件"]);
      }
      formData.append("备注", editData.value["备注"] || "");
      formData.append("time", editData.value["time"] || "");

      let res;
      if (editIndex.value === -1) {
        res = await uploadIndustryStandard(formData);
        if (res) {
          const data = await getMyIndustryStandards();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        const id = editData.value.id;
        res = await updateIndustryStandard(id, formData);
        if (res) {
          const data = await getMyIndustryStandards();
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
      await ElMessageBox.confirm('确定要删除该行业标准吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteIndustryStandard(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value["上传文件"] = fileObj.raw;
      }
    };

    onMounted(loadStandards);

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>行业标准信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="标准名称"><ElInput v-model={editData.value["标准名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="标准编号"><ElInput v-model={editData.value["标准编号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="发布日期">
                  <ElDatePicker v-model={editData.value["发布日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="实施日期">
                  <ElDatePicker v-model={editData.value["实施日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="归口单位"><ElInput v-model={editData.value["归口单位"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="起草单位"><ElInput v-model={editData.value["起草单位"]} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="适用范围">
                <ElInput type="textarea" rows={4} v-model={editData.value["适用范围"]} />
              </ElFormItem>
              <ElCol span={12}><ElFormItem label="成果提交时间">
                <ElDatePicker
                  v-model={editData.value["time"]}
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="选择成果时间"
                  style={{ width: '100%' }}
                />
              </ElFormItem>
              </ElCol>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value["备注"]} />
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