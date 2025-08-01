import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import {
  getCompetitionAwardById,
  uploadCompetitionAward,
  updateCompetitionAward,
  deleteCompetitionAward,
  getMyCompetitionAwards
} from "@/api/postdoctor/userinfoRegister/competition_award";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "竞赛名称", prop: "竞赛名称", width: 120 },
  { label: "获奖类别", prop: "获奖类别", width: 100 },
  { label: "获奖等级", prop: "获奖等级", width: 100 },
  { label: "获奖时间", prop: "获奖时间", width: 110 },
  { label: "本人署名", prop: "本人署名", width: 100 },
  { label: "获奖级别", prop: "获奖级别", width: 100 },
  { label: "颁奖单位", prop: "颁奖单位", width: 120 },
  { label: "第一完成单位", prop: "第一完成单位", width: 120 },
  { label: "完成单位排名", prop: "完成单位排名", width: 120 },
  { label: "是否和学位论文相关", prop: "是否和学位论文相关", width: 140 },
  { label: "奖项名称", prop: "奖项名称", width: 120 },
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

  { label: "上传获奖证书文件", prop: "上传获奖证书文件", width: 160 }
];

function db2form(item: any) {
  return {
    id: item.id,
    user_id: item.user_id,
    "time": item.time ? dayjs(item.time).format('YYYY-MM-DD') : "",
    "竞赛名称": item["竞赛名称"] ?? "",
    "获奖类别": item["获奖类别"] ?? "",
    "获奖等级": item["获奖等级"] ?? "",
    "获奖时间": item["获奖时间"] ? dayjs(item["获奖时间"]).format('YYYY-MM-DD') : "",
    "本人署名": item["本人署名"] ?? "",
    "获奖级别": item["获奖级别"] ?? "",
    "颁奖单位": item["颁奖单位"] ?? "",
    "第一完成单位": item["第一完成单位"] ?? "",
    "完成单位排名": item["完成单位排名"] ?? "",
    "是否和学位论文相关": item["是否和学位论文相关"] ?? "",
    "奖项名称": item["奖项名称"] ?? "",
    "作者名单": item["作者名单"] ?? "",
    "上传获奖证书文件": item["上传获奖证书文件"] ?? null,
    "备注": item["备注"] ?? "",
  };
}


export default defineComponent({
  name: "CompetitionAwardForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editIndex = ref(-1); // -1: 新增, >=0: 编辑
    const editData = ref<any>({
      id: null,
      "time": "",
      "竞赛名称": "",
      "获奖类别": "",
      "获奖等级": "",
      "获奖时间": "",
      "本人署名": "",
      "获奖级别": "",
      "颁奖单位": "",
      "第一完成单位": "",
      "完成单位排名": "",
      "是否和学位论文相关": "",
      "奖项名称": "",
      "作者名单": "",
      "上传获奖证书文件": null,
      "备注": "",
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        "time": "",
        "竞赛名称": "",
        "获奖类别": "",
        "获奖等级": "",
        "获奖时间": "",
        "本人署名": "",
        "获奖级别": "",
        "颁奖单位": "",
        "第一完成单位": "",
        "完成单位排名": "",
        "是否和学位论文相关": "",
        "奖项名称": "",
        "作者名单": "",
        "上传获奖证书文件": null,
        "备注": "",
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getCompetitionAwardById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      if (!editData.value["竞赛名称"]?.trim()) {
        ElMessage.error('竞赛名称不能为空');
        return;
      }

      const formData = new FormData();
      formData.append("竞赛名称", editData.value["竞赛名称"]);
      formData.append("获奖类别", editData.value["获奖类别"] || "");
      formData.append("获奖等级", editData.value["获奖等级"] || "");
      formData.append("获奖时间", editData.value["获奖时间"] || "");
      formData.append("本人署名", editData.value["本人署名"] || "");
      formData.append("获奖级别", editData.value["获奖级别"] || "");
      formData.append("颁奖单位", editData.value["颁奖单位"] || "");
      formData.append("第一完成单位", editData.value["第一完成单位"] || "");
      formData.append("完成单位排名", editData.value["完成单位排名"] || "");
      formData.append("是否和学位论文相关", editData.value["是否和学位论文相关"] || "");
      formData.append("奖项名称", editData.value["奖项名称"] || "");
      formData.append("作者名单", editData.value["作者名单"] || "");
      if (editData.value["上传获奖证书文件"] instanceof File) {
        formData.append("上传获奖证书文件", editData.value["上传获奖证书文件"]);
      }
      formData.append("备注", editData.value["备注"] || "");
      formData.append("time", editData.value["time"] || "");

      let res;
      if (editIndex.value === -1) {
        // 新增
        res = await uploadCompetitionAward(formData);
        if (res) {
          const data = await getMyCompetitionAwards();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        // 编辑
        const id = editData.value.id;
        res = await updateCompetitionAward(id, formData);
        if (res) {
          const data = await getMyCompetitionAwards();
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
      editData.value["上传获奖证书文件"] = file.raw;
    };

    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该获奖信息吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteCompetitionAward(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    onMounted(async () => {
      const data = await getMyCompetitionAwards();
      tableData.value = (data ?? []).map(db2form);
    });

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>科技竞赛获奖信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}>
                  <ElFormItem label="成果时间">
                    <ElDatePicker
                      v-model={editData.value["time"]}
                      type="date"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      placeholder="选择成果时间"
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="竞赛名称">
                    <ElInput v-model={editData.value["竞赛名称"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="获奖类别">
                    <ElInput v-model={editData.value["获奖类别"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="获奖等级">
                    <ElInput v-model={editData.value["获奖等级"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="获奖时间">
                    <ElDatePicker
                      v-model={editData.value["获奖时间"]}
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="选择日期"
                      style={{ width: '100%' }}
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="本人署名">
                    <ElInput v-model={editData.value["本人署名"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="获奖级别">
                    <ElInput v-model={editData.value["获奖级别"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="颁奖单位">
                    <ElInput v-model={editData.value["颁奖单位"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="第一完成单位">
                    <ElInput v-model={editData.value["第一完成单位"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="完成单位排名">
                    <ElInput v-model={editData.value["完成单位排名"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="是否和学位论文相关">
                    <ElInput v-model={editData.value["是否和学位论文相关"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="奖项名称">
                    <ElInput v-model={editData.value["奖项名称"]} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="作者名单">
                    <ElInput v-model={editData.value["作者名单"]} />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElFormItem label="上传获奖证书文件">
                <ElUpload
                  show-file-list={false}
                  before-upload={() => false}
                  on-change={handleFileChange}
                >
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value["上传获奖证书文件"] && <span style={{ marginLeft: 10 }}>{editData.value["上传获奖证书文件"].name}</span>}
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
                ) : col.prop === '获奖时间' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row[col.prop] ? dayjs(row[col.prop]).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : col.prop === '上传获奖证书文件' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row["上传获奖证书文件"] ? (
                          <a href={row["上传获奖证书文件"]} target="_blank" style={{ color: '#409EFF', textDecoration: 'none' }}>
                            {row["上传获奖证书文件"].split('/').pop()}
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