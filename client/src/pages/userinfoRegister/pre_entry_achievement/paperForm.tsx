import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete, Download } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyPapers,
  getPaperById,
  uploadPaper,
  updatePaper,
  deletePaper
} from '@/api/postdoctor/userinfoRegister/paper';

// 导入文件下载函数
import { downloadPaper } from '@/utils/DownloadFiles';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "论文名称", prop: "论文名称", width: 150 },
  { label: "刊物名称", prop: "刊物名称", width: 120 },
  { label: "发表日期", prop: "发表日期", width: 110 },
  { label: "本人署名排序", prop: "本人署名排序", width: 120 },
  { label: "起始页号", prop: "起始页号", width: 100 },
  { label: "刊物级别", prop: "刊物级别", width: 100 },
  { label: "是否共同第一", prop: "是否共同第一", width: 120 },
  { label: "通讯作者", prop: "通讯作者", width: 100 },
  { label: "论文类型", prop: "论文类型", width: 100 },
  { label: "影响因子", prop: "影响因子", width: 100 },
  { label: "作者名单", prop: "作者名单", width: 120 },
  { label: "第一作者", prop: "第一作者", width: 100 },
  { label: "导师署名排序", prop: "导师署名排序", width: 120 },
  { label: "本校是否第一", prop: "本校是否第一", width: 120 },
  { label: "第一署名单位", prop: "第一署名单位", width: 120 },
  { label: "发表状态", prop: "发表状态", width: 100 },
  { label: "论文收录检索", prop: "论文收录检索", width: 120 },
  { label: "他引次数", prop: "他引次数", width: 100 },
  { label: "是否和学位论文相关", prop: "是否和学位论文相关", width: 140 },
  { label: "出版号", prop: "出版号", width: 100 },
  { label: "出版社", prop: "出版社", width: 100 },
  { label: "总期号", prop: "总期号", width: 100 },
  { label: "刊物编号", prop: "刊物编号", width: 100 },
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
    论文名称: item["论文名称"] ?? "",
    刊物名称: item["刊物名称"] ?? "",
    发表日期: item["发表日期"] ? dayjs(item["发表日期"]).format('YYYY-MM-DD') : "",
    本人署名排序: item["本人署名排序"] ?? "",
    起始页号: item["起始页号"] ?? "",
    刊物级别: item["刊物级别"] ?? "",
    是否共同第一: item["是否共同第一"] ?? "",
    通讯作者: item["通讯作者"] ?? "",
    论文类型: item["论文类型"] ?? "",
    影响因子: item["影响因子"] ?? "",
    作者名单: item["作者名单"] ?? "",
    第一作者: item["第一作者"] ?? "",
    导师署名排序: item["导师署名排序"] ?? "",
    本校是否第一: item["本校是否第一"] ?? "",
    第一署名单位: item["第一署名单位"] ?? "",
    发表状态: item["发表状态"] ?? "",
    论文收录检索: item["论文收录检索"] ?? "",
    他引次数: item["他引次数"] ?? "",
    是否和学位论文相关: item["是否和学位论文相关"] ?? "",
    出版号: item["出版号"] ?? "",
    出版社: item["出版社"] ?? "",
    总期号: item["总期号"] ?? "",
    刊物编号: item["刊物编号"] ?? "",
    论文发表证书: item["论文发表证书"] ?? "",
    论文接收函: item["论文接收函"] ?? "",
    论文电子版: item["论文电子版"] ?? "",
    time: item["time"] || "",
    备注: item["备注"] ?? "",
  };
}

export default defineComponent({
  name: "PaperForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref<any[]>([]);
    const showForm = ref(false);
    const editIndex = ref(-1); // -1: 新增, >=0: 编辑
    const editData = ref<any>({
      id: null,
      "论文名称": "",
      "刊物名称": "",
      "发表日期": "",
      "本人署名排序": "",
      "起始页号": "",
      "刊物级别": "",
      "是否共同第一": "",
      "通讯作者": "",
      "论文类型": "",
      "影响因子": "",
      "作者名单": "",
      "第一作者": "",
      "导师署名排序": "",
      "本校是否第一": "",
      "第一署名单位": "",
      "发表状态": "",
      "论文收录检索": "",
      "他引次数": "",
      "是否和学位论文相关": "",
      "出版号": "",
      "出版社": "",
      "总期号": "",
      "刊物编号": "",
      "论文发表证书": null,
      "论文接收函": null,
      "论文电子版": null,
      "备注": "",
      time: "",
    });

    const loadPapers = async () => {
      const data = await getMyPapers();
      console.log('API response data:', data);
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: null,
        "论文名称": "",
        "刊物名称": "",
        "发表日期": "",
        "本人署名排序": "",
        "起始页号": "",
        "刊物级别": "",
        "是否共同第一": "",
        "通讯作者": "",
        "论文类型": "",
        "影响因子": "",
        "作者名单": "",
        "第一作者": "",
        "导师署名排序": "",
        "本校是否第一": "",
        "第一署名单位": "",
        "发表状态": "",
        "论文收录检索": "",
        "他引次数": "",
        "是否和学位论文相关": "",
        "出版号": "",
        "出版社": "",
        "总期号": "",
        "刊物编号": "",
        "论文发表证书": null,
        "论文接收函": null,
        "论文电子版": null,
        "备注": "",
        time: "",
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      console.log('Edit row:', row);
      const res = await getPaperById(row.id);
      console.log('API response:', res);
      editData.value = db2form(res);
      console.log('Transformed data:', editData.value);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      if (!editData.value["论文名称"]?.trim()) {
        ElMessage.error('论文名称不能为空');
        return;
      }
      if (!editData.value["刊物名称"]?.trim()) {
        ElMessage.error('刊物名称不能为空');
        return;
      }
      if (!editData.value["发表日期"]) {
        ElMessage.error('发表日期不能为空');
        return;
      }

      const formData = new FormData();
      // 必填字段
      formData.append("论文名称", editData.value["论文名称"]);
      formData.append("刊物名称", editData.value["刊物名称"]);
      formData.append("发表日期", editData.value["发表日期"]);

      // 可选字段
      formData.append("本人署名排序", editData.value["本人署名排序"] || "");
      formData.append("起始页号", editData.value["起始页号"] || "");
      formData.append("刊物级别", editData.value["刊物级别"] || "");
      formData.append("是否共同第一", editData.value["是否共同第一"] || "");
      formData.append("通讯作者", editData.value["通讯作者"] || "");
      formData.append("论文类型", editData.value["论文类型"] || "");
      formData.append("影响因子", editData.value["影响因子"] || "");
      formData.append("作者名单", editData.value["作者名单"] || "");
      formData.append("第一作者", editData.value["第一作者"] || "");
      formData.append("导师署名排序", editData.value["导师署名排序"] || "");
      formData.append("本校是否第一", editData.value["本校是否第一"] || "");
      formData.append("第一署名单位", editData.value["第一署名单位"] || "");
      formData.append("发表状态", editData.value["发表状态"] || "");
      formData.append("论文收录检索", editData.value["论文收录检索"] || "");
      formData.append("他引次数", editData.value["他引次数"] || "");
      formData.append("是否和学位论文相关", editData.value["是否和学位论文相关"] || "");
      formData.append("出版号", editData.value["出版号"] || "");
      formData.append("出版社", editData.value["出版社"] || "");
      formData.append("总期号", editData.value["总期号"] || "");
      formData.append("刊物编号", editData.value["刊物编号"] || "");
      formData.append("time", editData.value["time"] || "");
      formData.append("备注", editData.value["备注"]);

      // 处理文件字段
      ["论文发表证书", "论文接收函", "论文电子版"].forEach(field => {
        if (editData.value[field] instanceof File) {
          formData.append(field, editData.value[field]);
        }
      });

      let res;
      if (editIndex.value === -1) {
        res = await uploadPaper(formData);
        if (res) {
          const data = await getMyPapers();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        const id = editData.value.id;
        res = await updatePaper(id, formData);
        if (res) {
          const data = await getMyPapers();
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
      await ElMessageBox.confirm('确定要删除该论文吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deletePaper(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    const handleFileChange = (fieldName: string) => (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value[fieldName] = fileObj.raw;
        ElMessage.success(`${fieldName}上传成功`);
      }
    };

    const getFileName = (field: string, value: any) => {
      if (!value) return '';
      if (value instanceof File) return value.name;
      if (typeof value === 'string') return value.split('/').pop() || '';
      return '';
    };

    onMounted(loadPapers);

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>学术论文信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="论文名称"><ElInput v-model={editData.value["论文名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物名称"><ElInput v-model={editData.value["刊物名称"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="发表日期">
                  <ElDatePicker v-model={editData.value["发表日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人署名排序"><ElInput v-model={editData.value["本人署名排序"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="起始页号"><ElInput v-model={editData.value["起始页号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物级别"><ElInput v-model={editData.value["刊物级别"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否共同第一"><ElInput v-model={editData.value["是否共同第一"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="通讯作者"><ElInput v-model={editData.value["通讯作者"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="论文类型"><ElInput v-model={editData.value["论文类型"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="影响因子"><ElInput v-model={editData.value["影响因子"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者名单"><ElInput v-model={editData.value["作者名单"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一作者"><ElInput v-model={editData.value["第一作者"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="导师署名排序"><ElInput v-model={editData.value["导师署名排序"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本校是否第一"><ElInput v-model={editData.value["本校是否第一"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一署名单位"><ElInput v-model={editData.value["第一署名单位"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="发表状态"><ElInput v-model={editData.value["发表状态"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="论文收录检索"><ElInput v-model={editData.value["论文收录检索"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="他引次数"><ElInput v-model={editData.value["他引次数"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否和学位论文相关"><ElInput v-model={editData.value["是否和学位论文相关"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版号"><ElInput v-model={editData.value["出版号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版社"><ElInput v-model={editData.value["出版社"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="总期号"><ElInput v-model={editData.value["总期号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物编号"><ElInput v-model={editData.value["刊物编号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="成果提交时间">
                  <ElDatePicker v-model={editData.value["time"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="备注">
                  <ElInput type="textarea" rows={4} v-model={editData.value["备注"]} />
                </ElFormItem></ElCol>
              </ElRow>

              <ElFormItem label="论文发表证书">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange("论文发表证书")}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value["论文发表证书"] && editData.value["论文发表证书"] instanceof File && (
                  <span style={{ marginLeft: 10, color: '#409EFF' }}>{editData.value["论文发表证书"].name}</span>
                )}
                {/* 原文件名 */}
                {editData.value["论文发表证书"] && typeof editData.value["论文发表证书"] === 'string' && (
                  <span style={{ marginLeft: 10, color: '#666' }}>{editData.value["论文发表证书"].split('/').pop()}</span>
                )}
              </ElFormItem>

              <ElFormItem label="论文接收函">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange("论文接收函")}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value["论文接收函"] && editData.value["论文接收函"] instanceof File && (
                  <span style={{ marginLeft: 10, color: '#409EFF' }}>{editData.value["论文接收函"].name}</span>
                )}
                {/* 原文件名 */}
                {editData.value["论文接收函"] && typeof editData.value["论文接收函"] === 'string' && (
                  <span style={{ marginLeft: 10, color: '#666' }}>{editData.value["论文接收函"].split('/').pop()}</span>
                )}
              </ElFormItem>

              <ElFormItem label="论文电子版">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange("论文电子版")}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value["论文电子版"] && editData.value["论文电子版"] instanceof File && (
                  <span style={{ marginLeft: 10, color: '#409EFF' }}>{editData.value["论文电子版"].name}</span>
                )}
                {/* 原文件名 */}
                {editData.value["论文电子版"] && typeof editData.value["论文电子版"] === 'string' && (
                  <span style={{ marginLeft: 10, color: '#666' }}>{editData.value["论文电子版"].split('/').pop()}</span>
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
              <ElTableColumn label="论文发表证书" width="150">
                {{
                  default: ({ row }: any) => (
                    <div>
                      {row["论文发表证书"] && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span>{row["论文发表证书"].split('/').pop()}</span>
                          <ElButton
                            type="primary"
                            size="small"
                            icon={<Download />}
                            onClick={() => downloadPaper(row.id, "论文发表证书", row["论文发表证书"].split('/').pop())}
                          >
                            下载
                          </ElButton>
                        </div>
                      )}
                    </div>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="论文接收函" width="150">
                {{
                  default: ({ row }: any) => (
                    <div>
                      {row["论文接收函"] && (
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span>{row["论文接收函"].split('/').pop()}</span>
                          <ElButton
                            type="primary"
                            size="small"
                            icon={<Download />}
                            onClick={() => downloadPaper( row.id, "论文接收函", row["论文接收函"].split('/').pop())}
                          >
                            下载
                          </ElButton>
                        </div>
                      )}
                    </div>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="论文电子版" width="150">
                {{
                  default: ({ row }: any) => (
                    <div>
                      {row["论文电子版"] && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span>{row["论文电子版"].split('/').pop()}</span>
                          <ElButton
                            type="primary"
                            size="small"
                            icon={<Download />}
                            onClick={() => downloadPaper(row.id, "论文电子版", row["论文电子版"].split('/').pop())}
                          >
                            下载
                          </ElButton>
                        </div>
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