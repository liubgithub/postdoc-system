import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyNewVarieties,
  getNewVarietyById,
  uploadNewVariety,
  updateNewVariety,
  deleteNewVariety
} from '@/api/postdoctor/userinfoRegister/new_variety';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "品种名称", prop: "品种名称", width: 140 },
  { label: "动植物名称", prop: "动植物名称", width: 120 },
  { label: "选育单位", prop: "选育单位", width: 120 },
  { label: "审定单位", prop: "审定单位", width: 120 },
  { label: "审定编号", prop: "审定编号", width: 120 },
  { label: "公告号", prop: "公告号", width: 120 },
  { label: "公示年份", prop: "公示年份", width: 110 },
  { label: "第一完成单位", prop: "第一完成单位", width: 120 },
  { label: "本校是否第一完成单位", prop: "本校是否第一完成单位", width: 140 },
  { label: "署名排序", prop: "署名排序", width: 100 },
  { label: "作者名单", prop: "作者名单", width: 120 },
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
    署名排序: item["署名排序"] ?? "",
    本校是否第一完成单位: item["本校是否第一完成单位"] ?? "",
    公示年份: item["公示年份"] ? dayjs(item["公示年份"]).format('YYYY-MM-DD') : "",
    第一完成单位: item["第一完成单位"] ?? "",
    动植物名称: item["动植物名称"] ?? "",
    品种名称: item["品种名称"] ?? "",
    选育单位: item["选育单位"] ?? "",
    公告号: item["公告号"] ?? "",
    审定编号: item["审定编号"] ?? "",
    审定单位: item["审定单位"] ?? "",
    作者名单: item["作者名单"] ?? "",
    上传新品种证明文件: item["上传新品种证明文件"] ?? "",
    备注: item["备注"] ?? "",
    time: item["time"] || "",
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
      "署名排序": "",
      "本校是否第一完成单位": "",
      "公示年份": "",
      "第一完成单位": "",
      "动植物名称": "",
      "品种名称": "",
      "选育单位": "",
      "公告号": "",
      "审定编号": "",
      "审定单位": "",
      "作者名单": "",
      "备注": "",
      "上传新品种证明文件": null,
      time: "",
    });

    const loadVarieties = async () => {
      const data = await getMyNewVarieties();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        "署名排序": "",
        "本校是否第一完成单位": "",
        "公示年份": "",
        "第一完成单位": "",
        "动植物名称": "",
        "品种名称": "",
        "选育单位": "",
        "公告号": "",
        "审定编号": "",
        "审定单位": "",
        "作者名单": "",
        "备注": "",
        "上传新品种证明文件": null,
        time: "",
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
      if (!editData.value["品种名称"]?.trim()) {
        ElMessage.error('品种名称不能为空');
        return;
      }
      const formData = new FormData();
      formData.append("署名排序", editData.value["署名排序"] || "");
      formData.append("本校是否第一完成单位", editData.value["本校是否第一完成单位"] || "");
      formData.append("公示年份", editData.value["公示年份"] || "");
      formData.append("第一完成单位", editData.value["第一完成单位"] || "");
      formData.append("动植物名称", editData.value["动植物名称"] || "");
      formData.append("品种名称", editData.value["品种名称"]);
      formData.append("选育单位", editData.value["选育单位"] || "");
      formData.append("公告号", editData.value["公告号"] || "");
      formData.append("审定编号", editData.value["审定编号"] || "");
      formData.append("审定单位", editData.value["审定单位"] || "");
      formData.append("作者名单", editData.value["作者名单"] || "");
      if (editData.value["上传新品种证明文件"] instanceof File) {
        formData.append("上传新品种证明文件", editData.value["上传新品种证明文件"]);
      }
      formData.append("备注", editData.value["备注"] || "");
      formData.append("time", editData.value["time"] || "");

      let res;
      if (editIndex.value === -1) {
        res = await uploadNewVariety(formData);
        if (res) {
          const data = await getMyNewVarieties();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        const id = editData.value.id;
        res = await updateNewVariety(id, formData);
        if (res) {
          const data = await getMyNewVarieties();
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
      await ElMessageBox.confirm('确定要删除该新品种吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteNewVariety(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value["上传新品种证明文件"] = fileObj.raw;
      }
    };

    onMounted(loadVarieties);

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>新品种信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="品种名称"><ElInput v-model={editData.value["品种名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="动植物名称"><ElInput v-model={editData.value["动植物名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="选育单位"><ElInput v-model={editData.value["选育单位"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="审定单位"><ElInput v-model={editData.value["审定单位"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="审定编号"><ElInput v-model={editData.value["审定编号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="公告号"><ElInput v-model={editData.value["公告号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="公示年份">
                  <ElDatePicker v-model={editData.value["公示年份"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一完成单位"><ElInput v-model={editData.value["第一完成单位"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本校是否第一完成单位"><ElInput v-model={editData.value["本校是否第一完成单位"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="署名排序"><ElInput v-model={editData.value["署名排序"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者名单"><ElInput v-model={editData.value["作者名单"]} /></ElFormItem></ElCol>
              </ElRow>
              <ElCol span={12}><ElFormItem label="成果提交时间">
                <ElDatePicker v-model={editData.value["time"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
              </ElFormItem></ElCol>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value["备注"]} />
              </ElFormItem>
              <ElFormItem label="上传新品种证明文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value["上传新品种证明文件"] && editData.value["上传新品种证明文件"] instanceof File && (
                  <span style={{ marginLeft: 10, color: '#409EFF' }}>{editData.value["上传新品种证明文件"].name}</span>
                )}
                {/* 原文件名 */}
                {editData.value["上传新品种证明文件"] && typeof editData.value["上传新品种证明文件"] === 'string' && (
                  <span style={{ marginLeft: 10, color: '#666' }}>{editData.value["上传新品种证明文件"].split('/').pop()}</span>
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
              <ElTableColumn label="新品种证明文件" width="150">
                {{
                  default: ({ row }: any) => (
                    <div>
                      {row["上传新品种证明文件"] && (
                        <a href={row["上传新品种证明文件"]} target="_blank" style={{ color: '#409EFF', textDecoration: 'none' }}>
                          {row["上传新品种证明文件"].split('/').pop()}
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