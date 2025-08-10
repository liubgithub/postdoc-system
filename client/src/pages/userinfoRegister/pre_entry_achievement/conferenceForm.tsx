import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import {
  getConferenceById,
  uploadConference,
  updateConference,
  deleteConference,
  getMyConferences
} from "@/api/postdoctor/userinfoRegister/conference";
import { Edit, Delete, Download } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "会议编号", prop: "会议编号", width: 100 },
  { label: "会议名称", prop: "会议名称", width: 120 },
  { label: "会议英文名", prop: "会议英文名", width: 140 },
  { label: "主办单位", prop: "主办单位", width: 120 },
  { label: "会议举办形式", prop: "会议举办形式", width: 110 },
  { label: "会议等级", prop: "会议等级", width: 100 },
  { label: "国家或地区", prop: "国家或地区", width: 100 },
  { label: "是否境外", prop: "是否境外", width: 80 },
  { label: "会议起始日", prop: "会议起始日", width: 110 },
  { label: "会议终止日", prop: "会议终止日", width: 110 },
  { label: "举办单位", prop: "举办单位", width: 120 },
  { label: "会议人数", prop: "会议人数", width: 90 },
  { label: "联系人电话", prop: "联系人电话", width: 120 },
  { label: "会议地点", prop: "会议地点", width: 120 },
  { label: "会议报告", prop: "会议报告", width: 120 },
  { label: "会议报告文件", prop: "会议报告文件", width: 200 },
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
    会议编号: item["会议编号"] ?? "",
    会议名称: item["会议名称"] ?? "",
    会议英文名: item["会议英文名"] ?? "",
    主办单位: item["主办单位"] ?? "",
    会议举办形式: item["会议举办形式"] ?? "",
    会议等级: item["会议等级"] ?? "",
    国家或地区: item["国家或地区"] ?? "",
    是否境外: item["是否境外"] ?? "",
    会议起始日: item["会议起始日"] ? dayjs(item["会议起始日"]).format('YYYY-MM-DD') : "",
    会议终止日: item["会议终止日"] ? dayjs(item["会议终止日"]).format('YYYY-MM-DD') : "",
    举办单位: item["举办单位"] ?? "",
    会议人数: item["会议人数"] ?? "",
    联系人电话: item["联系人电话"] ?? "",
    会议地点: item["会议地点"] ?? "",
    会议报告: item["会议报告"] ?? "",
    会议报告文件: item["会议报告文件"] ?? null,
    备注: item["备注"] ?? "",
    time: item["time"] ? dayjs(item["time"]).format('YYYY-MM-DD') : ""
  };
}

// 文件下载函数
const downloadFile = async (id: number, filename: string) => {
  try {
    // raw.GET 是 openapi-fetch 的客户端，它会自动尝试将响应内容解析为JSON。但是PDF文件是二进制数据，不是JSON格式，所以会抛出 "Unexpected token '%', "%PDF-1.4..." is not valid JSON" 错误。
    // 使用标准的 fetch API 而不是 raw.GET，避免JSON解析问题
    const response = await fetch(`/api/pre_entry_conference/download/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      ElMessage.success('下载成功');
    } else {
      ElMessage.error('下载失败');
    }
  } catch (error) {
    console.error('下载错误:', error);
    ElMessage.error('下载失败');
  }
};

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
      "会议编号": "",
      "会议名称": "",
      "会议英文名": "",
      "主办单位": "",
      "会议举办形式": "",
      "会议等级": "",
      "国家或地区": "",
      "是否境外": "",
      "会议起始日": "",
      "会议终止日": "",
      "举办单位": "",
      "会议人数": "",
      "联系人电话": "",
      "会议地点": "",
      "会议报告": "",
      "会议报告文件": null,
      "备注": "",
      "time": ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        "会议编号": "",
        "会议名称": "",
        "会议英文名": "",
        "主办单位": "",
        "会议举办形式": "",
        "会议等级": "",
        "国家或地区": "",
        "是否境外": "",
        "会议起始日": "",
        "会议终止日": "",
        "举办单位": "",
        "会议人数": "",
        "联系人电话": "",
        "会议地点": "",
        "会议报告": "",
        "会议报告文件": null,
        "备注": "",
        "time": ""
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
      if (!editData.value.会议名称?.trim()) {
        ElMessage.error('会议名称不能为空');
        return;
      }

      const formData = new FormData();
      formData.append("会议编号", editData.value.会议编号 || "");
      formData.append("会议名称", editData.value.会议名称);
      formData.append("会议英文名", editData.value.会议名称 || "");
      formData.append("主办单位", editData.value.主办单位 || "");
      formData.append("会议举办形式", editData.value.会议举办形式 || "");
      formData.append("会议等级", editData.value.会议等级 || "");
      formData.append("国家或地区", editData.value.国家或地区 || "");
      formData.append("是否境外", editData.value.是否境外 || "");
      formData.append("会议起始日", editData.value.会议起始日 || "");
      formData.append("会议终止日", editData.value.会议终止日 || "");
      formData.append("举办单位", editData.value.举办单位 || "");
      formData.append("会议人数", editData.value.会议人数 || "");
      formData.append("联系人电话", editData.value.联系人电话 || "");
      formData.append("会议地点", editData.value.会议地点 || "");
      formData.append("会议报告", editData.value.会议报告 || "");
      if (editData.value.会议报告文件 instanceof File) {
        formData.append("会议报告文件", editData.value.会议报告文件);
      }
      formData.append("备注", editData.value.备注 || "");
      formData.append("time", editData.value.time ? dayjs(editData.value.time).format("YYYY-MM-DD") : "");

      let res;
      if (editIndex.value === -1) {
        // 新增
        res = await uploadConference(formData);
        if (res) {
          const data = await getMyConferences();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        // 编辑
        const id = editData.value.id;
        res = await updateConference(id, formData);
        if (res) {
          const data = await getMyConferences();
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
      editData.value.会议报告文件 = file.raw;
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
                    <ElInput v-model={editData.value.会议编号} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议名称">
                    <ElInput v-model={editData.value.会议名称} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议英文名">
                    <ElInput v-model={editData.value.会议英文名} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="主办单位">
                    <ElInput v-model={editData.value.主办单位} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议举办形式">
                    <ElInput v-model={editData.value.会议举办形式} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议等级">
                    <ElInput v-model={editData.value.会议等级} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="国家或地区">
                    <ElInput v-model={editData.value.国家或地区} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="是否境外">
                    <ElInput v-model={editData.value.是否境外} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议起始日">
                    <ElDatePicker
                      v-model={editData.value.会议起始日}
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="选择日期"
                      style={{ width: '100%' }}
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议终止日">
                    <ElDatePicker
                      v-model={editData.value.会议终止日}
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="选择日期"
                      style={{ width: '100%' }}
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="举办单位">
                    <ElInput v-model={editData.value.举办单位} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议人数">
                    <ElInput v-model={editData.value.会议人数} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="联系人电话">
                    <ElInput v-model={editData.value.联系人电话} />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议地点">
                    <ElInput v-model={editData.value.会议地点} />
                  </ElFormItem>
                </ElCol>

              </ElRow>
              <ElFormItem label="会议报告">
                <ElInput type="textarea" rows={4} v-model={editData.value.会议报告} />
              </ElFormItem>
              <ElCol span={12}>
                <ElFormItem label="成果提交时间">
                  <ElDatePicker
                    v-model={editData.value.time}
                    type="datetime"
                    value-format="YYYY-MM-DD"
                    placeholder="选择时间"
                    style={{ width: '100%' }}
                  />
                </ElFormItem>
              </ElCol>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.备注} />
              </ElFormItem>
              <ElFormItem label="会议报告文件">
                <ElUpload
                  show-file-list={false}
                  before-upload={() => false}
                  on-change={handleFileChange}
                >
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.会议报告文件 && <span style={{ marginLeft: 10 }}>{editData.value.会议报告文件.name}</span>}
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
                ) : col.prop === '会议起始日' || col.prop === '会议终止日' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row[col.prop] ? dayjs(row[col.prop]).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : col.prop === '会议报告' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) => row[col.prop] ?? ""
                    }}
                  />
                ) : col.prop === '会议报告文件' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row["会议报告文件"] ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <span>{row["会议报告文件"].split('/').pop()}</span>
                            <ElButton
                              type="primary"
                              size="small"
                              icon={<Download />}
                              onClick={() => downloadFile(row.id, row["会议报告文件"].split('/').pop())}
                            >
                              下载
                            </ElButton>
                          </div>
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