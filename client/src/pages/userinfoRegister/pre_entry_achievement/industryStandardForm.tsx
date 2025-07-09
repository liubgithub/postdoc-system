import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import dayjs from 'dayjs';
import { Edit, Delete } from '@element-plus/icons-vue';
import { getMyIndustryStandards, getIndustryStandardById, createIndustryStandard, updateIndustryStandard, deleteIndustryStandard } from '@/api/postdoctor/userinfoRegister/industry_standard';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "标准名称", prop: "standardName", width: 120 },
  { label: "标准编号", prop: "standardNumber", width: 120 },
  { label: "发布日期", prop: "publishDate", width: 120 },
  { label: "实施日期", prop: "implementDate", width: 120 },
  { label: "归口单位", prop: "attributionUnit", width: 120 },
  { label: "起草单位", prop: "draftUnit", width: 120 },
  { label: "适用范围", prop: "scope", width: 120 },
  { label: "操作", prop: "action", width: 100 }
];

function db2form(item: any) {
  return {
    id: item.id,
    standardName: item["标准名称"] ?? "",
    standardNumber: item["标准编号"] ?? "",
    publishDate: item["发布日期"] ? dayjs(item["发布日期"]).format('YYYY-MM-DD') : "",
    implementDate: item["实施日期"] ? dayjs(item["实施日期"]).format('YYYY-MM-DD') : "",
    attributionUnit: item["归口单位"] ?? "",
    draftUnit: item["起草单位"] ?? "",
    scope: item["适用范围"] ?? "",
    file: item["上传文件"] ?? null,
    remark: item["备注"] ?? ""
  };
}

function form2db(item: any) {
  return {
    "标准名称": item.standardName,
    "标准编号": item.standardNumber,
    "发布日期": item.publishDate ? (item.publishDate instanceof Date ? item.publishDate.toISOString() : new Date(item.publishDate).toISOString()) : null,
    "实施日期": item.implementDate ? (item.implementDate instanceof Date ? item.implementDate.toISOString() : new Date(item.implementDate).toISOString()) : null,
    "归口单位": item.attributionUnit,
    "起草单位": item.draftUnit,
    "适用范围": item.scope,
    "上传文件": item.file && item.file.name ? item.file.name : null,
    "备注": item.remark
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
      standardName: "",
      standardNumber: "",
      publishDate: "",
      implementDate: "",
      attributionUnit: "",
      draftUnit: "",
      scope: "",
      file: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: null,
        standardName: "",
        standardNumber: "",
        publishDate: "",
        implementDate: "",
        attributionUnit: "",
        draftUnit: "",
        scope: "",
        file: null,
        remark: ""
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
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createIndustryStandard(data);
        if (res) tableData.value.push(db2form(res));
        ElMessage.success('提交成功');
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updateIndustryStandard(id, data);
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
      await deleteIndustryStandard(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (file: any) => {
      editData.value.file = file.raw;
    };

    onMounted(async () => {
      const data = await getMyIndustryStandards();
      tableData.value = (data ?? []).map(db2form);
    });

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>行业标准信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="标准名称"><ElInput v-model={editData.value.standardName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="标准编号"><ElInput v-model={editData.value.standardNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="发布日期"><ElDatePicker v-model={editData.value.publishDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="实施日期"><ElDatePicker v-model={editData.value.implementDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="归口单位"><ElInput v-model={editData.value.attributionUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="起草单位"><ElInput v-model={editData.value.draftUnit} /></ElFormItem></ElCol>
                <ElCol span={24}><ElFormItem label="适用范围"><ElInput v-model={editData.value.scope} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传文件">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  {editData.value.file && <span style={{ marginLeft: 10 }}>{editData.value.file.name}</span>}
                </div>
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.remark} />
              </ElFormItem>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
                <ElButton type="primary" onClick={handleSave} style={{ marginRight: '2em' }}>提交</ElButton>
                <ElButton onClick={handleCancel}>取消</ElButton>
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