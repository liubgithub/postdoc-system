import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import dayjs from 'dayjs';
import { Edit, Delete } from '@element-plus/icons-vue';
import { getMyNewVarieties, getNewVarietyById, createNewVariety, updateNewVariety, deleteNewVariety } from '@/api/postdoctor/userinfoRegister/new_variety';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "动植物名称", prop: "animalPlantName", width: 120 },
  { label: "品种名称", prop: "varietyName", width: 120 },
  { label: "选育单位", prop: "breedingUnit", width: 120 },
  { label: "本校是否第一完成单位", prop: "isFirstUnit", width: 140 },
  { label: "署名排序", prop: "authorOrder", width: 100 },
  { label: "第一完成单位", prop: "firstUnit", width: 120 },
  { label: "公示年份", prop: "publicYear", width: 100 },
  { label: "公告号", prop: "announcementNumber", width: 120 },
  { label: "审定编号", prop: "approvalNumber", width: 120 },
  { label: "审定单位", prop: "approvalUnit", width: 120 },
  { label: "作者名单", prop: "authorList", width: 120 },
  { label: "操作", prop: "action", width: 100 }
];

function db2form(item: any) {
  return {
    id: item.id,
    animalPlantName: item["动植物名称"] ?? "",
    varietyName: item["品种名称"] ?? "",
    breedingUnit: item["选育单位"] ?? "",
    isFirstUnit: item["本校是否第一完成单位"] ?? "",
    authorOrder: item["署名排序"] ?? "",
    firstUnit: item["第一完成单位"] ?? "",
    publicYear: item["公示年份"] ? dayjs(item["公示年份"]).format('YYYY-MM-DD') : "",
    announcementNumber: item["公告号"] ?? "",
    approvalNumber: item["审定编号"] ?? "",
    approvalUnit: item["审定单位"] ?? "",
    authorList: item["作者名单"] ?? "",
    file: item["上传新品种证明文件"] ?? null,
    remark: item["备注"] ?? ""
  };
}

function form2db(item: any) {
  return {
    "动植物名称": item.animalPlantName,
    "品种名称": item.varietyName,
    "选育单位": item.breedingUnit,
    "本校是否第一完成单位": item.isFirstUnit,
    "署名排序": item.authorOrder,
    "第一完成单位": item.firstUnit,
    "公示年份": item.publicYear ? (item.publicYear instanceof Date ? item.publicYear.toISOString() : new Date(item.publicYear).toISOString()) : null,
    "公告号": item.announcementNumber,
    "审定编号": item.approvalNumber,
    "审定单位": item.approvalUnit,
    "作者名单": item.authorList,
    "上传新品种证明文件": item.file && item.file.name ? item.file.name : null,
    "备注": item.remark
  };
}

export default defineComponent({
  name: "NewVarietyForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editIndex = ref(-1); // -1: 新增, >=0: 编辑
    const editData = ref<any>({
      id: null,
      animalPlantName: "",
      varietyName: "",
      breedingUnit: "",
      isFirstUnit: "",
      authorOrder: "",
      firstUnit: "",
      publicYear: "",
      announcementNumber: "",
      approvalNumber: "",
      approvalUnit: "",
      authorList: "",
      file: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: null,
        animalPlantName: "",
        varietyName: "",
        breedingUnit: "",
        isFirstUnit: "",
        authorOrder: "",
        firstUnit: "",
        publicYear: "",
        announcementNumber: "",
        approvalNumber: "",
        approvalUnit: "",
        authorList: "",
        file: null,
        remark: ""
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getNewVarietyById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createNewVariety(data);
        if (res) tableData.value.push(db2form(res));
        ElMessage.success('提交成功');
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updateNewVariety(id, data);
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
      await deleteNewVariety(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (file: any) => {
      editData.value.file = file.raw;
    };

    onMounted(async () => {
      const data = await getMyNewVarieties();
      tableData.value = (data ?? []).map(db2form);
    });

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>新品种类型信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="署名排序"><ElInput v-model={editData.value.authorOrder} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本校是否第一完成单位"><ElInput v-model={editData.value.isFirstUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一完成单位"><ElInput v-model={editData.value.firstUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="公示年份"><ElDatePicker v-model={editData.value.publicYear} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="动植物名称"><ElInput v-model={editData.value.animalPlantName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="品种名称"><ElInput v-model={editData.value.varietyName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="选育单位"><ElInput v-model={editData.value.breedingUnit} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="公告号"><ElInput v-model={editData.value.announcementNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="审定编号"><ElInput v-model={editData.value.approvalNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="审定单位"><ElInput v-model={editData.value.approvalUnit} /></ElFormItem></ElCol>
                <ElCol span={24}><ElFormItem label="作者名单"><ElInput v-model={editData.value.authorList} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传新品种证明文件">
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