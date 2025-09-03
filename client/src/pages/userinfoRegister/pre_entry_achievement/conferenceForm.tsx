import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage, ElSelect, ElOption } from "element-plus";
import {
  getConferenceById,
  uploadConference,
  updateConference,
  deleteConference,
  getMyConferences
} from "@/api/postdoctor/userinfoRegister/conference";
import { Edit, Delete, Download } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

// 导入文件下载函数
import { downloadFile } from '@/utils/DownloadFiles';

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
  { label: "会议报告文件", prop: "会议报告文件", width: 200 },
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
                    <ElSelect v-model={editData.value.会议举办形式} placeholder="请选择会议举办形式" style={{ width: '100%' }} clearable>
                      <ElOption label="本校独立举办" value="本校独立举办" />
                      <ElOption label="与外单位合办" value="与外单位合办" />
                      <ElOption label="主办" value="主办" />
                      <ElOption label="协办" value="协办" />
                      <ElOption label="承办" value="承办" />
                      <ElOption label="其他" value="其他" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="会议等级">
                    <ElSelect v-model={editData.value.会议等级} placeholder="请选择会议等级" style={{ width: '100%' }} clearable>
                      <ElOption label="世界性、区域性、国际间学术会议" value="世界性、区域性、国际间学术会议" />
                      <ElOption label="两国间双边学习会议" value="两国间双边学习会议" />
                      <ElOption label="全国、地区性学术会议" value="全国、地区性学术会议" />
                      <ElOption label="省内学术会议" value="省内学术会议" />
                      <ElOption label="港、澳、台学术会议" value="港、澳、台学术会议" />
                      <ElOption label="校内学术会议" value="校内学术会议" />
                      <ElOption label="其他" value="其他" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="国家或地区">
                    <ElSelect v-model={editData.value.国家或地区} placeholder="请选择国家或地区" style={{ width: '100%' }} clearable>
                      <ElOption label="中国" value="中国" />
                      <ElOption label="美国" value="美国" />
                      <ElOption label="英国" value="英国" />
                      <ElOption label="法国" value="法国" />
                      <ElOption label="德国" value="德国" />
                      <ElOption label="日本" value="日本" />
                      <ElOption label="韩国" value="韩国" />
                      <ElOption label="俄罗斯" value="俄罗斯" />
                      <ElOption label="加拿大" value="加拿大" />
                      <ElOption label="澳大利亚" value="澳大利亚" />
                      <ElOption label="新西兰" value="新西兰" />
                      <ElOption label="新加坡" value="新加坡" />
                      <ElOption label="马来西亚" value="马来西亚" />
                      <ElOption label="泰国" value="泰国" />
                      <ElOption label="印度" value="印度" />
                      <ElOption label="巴西" value="巴西" />
                      <ElOption label="阿根廷" value="阿根廷" />
                      <ElOption label="意大利" value="意大利" />
                      <ElOption label="西班牙" value="西班牙" />
                      <ElOption label="荷兰" value="荷兰" />
                      <ElOption label="瑞典" value="瑞典" />
                      <ElOption label="挪威" value="挪威" />
                      <ElOption label="丹麦" value="丹麦" />
                      <ElOption label="芬兰" value="芬兰" />
                      <ElOption label="瑞士" value="瑞士" />
                      <ElOption label="奥地利" value="奥地利" />
                      <ElOption label="比利时" value="比利时" />
                      <ElOption label="葡萄牙" value="葡萄牙" />
                      <ElOption label="希腊" value="希腊" />
                      <ElOption label="土耳其" value="土耳其" />
                      <ElOption label="以色列" value="以色列" />
                      <ElOption label="南非" value="南非" />
                      <ElOption label="埃及" value="埃及" />
                      <ElOption label="尼日利亚" value="尼日利亚" />
                      <ElOption label="肯尼亚" value="肯尼亚" />
                      <ElOption label="香港" value="香港" />
                      <ElOption label="澳门" value="澳门" />
                      <ElOption label="台湾" value="台湾" />
                      <ElOption label="其他" value="其他" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="是否境外">
                    <ElSelect v-model={editData.value.是否境外} placeholder="请选择是否境外" style={{ width: '100%' }} clearable>
                      <ElOption label="是" value="是" />
                      <ElOption label="否" value="否" />
                    </ElSelect>
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
                {/* 新文件名 */}
                {editData.value.会议报告文件 && editData.value.会议报告文件 instanceof File && (
                  <div style={{ marginBottom: '8px', marginRight: '10px', color: '#409EFF' }}>{editData.value.会议报告文件.name}</div>
                )}
                {/* 原文件名 */}
                {editData.value.会议报告文件 && typeof editData.value.会议报告文件 === 'string' && (
                  <div style={{ marginBottom: '8px', marginRight: '10px', color: '#666' }}>{editData.value.会议报告文件.split('/').pop()}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ElUpload
                    show-file-list={false}
                    before-upload={() => false}
                    on-change={handleFileChange}
                  >
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
                    <span>ℹ️</span>
                    <span>允许上传PDF、DOC、DOCX、TXT、JPG、PNG、GIF格式的文件</span>
                  </div>
                </div>
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
                              onClick={() => downloadFile("pre_entry_conference", row.id, row["会议报告文件"].split('/').pop())}
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