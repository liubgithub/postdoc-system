import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage, ElSelect, ElOption } from "element-plus";
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
      "备注": "",
      "论文发表证书": null,
      "论文接收函": null,
      "论文电子版": null,
      "time": "",
    });

    // 作者名单管理
    const authorList = ref<string[]>([]);
    const newAuthor = ref("");

    const addAuthor = (name?: string) => {
      if (name) {
        authorList.value.push(name);
        editData.value["作者名单"] = authorList.value.join("、");
      }
    };

    const removeAuthor = (index: number) => {
      authorList.value.splice(index, 1);
      editData.value["作者名单"] = authorList.value.join("、");
    };

    const loadPapers = async () => {
      const data = await getMyPapers();
      console.log('API response data:', data);
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
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
        "备注": "",
        "论文发表证书": null,
        "论文接收函": null,
        "论文电子版": null,
        "time": ""
      };
      
      // 清空作者列表
      authorList.value = [];
      
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getPaperById(row.id);
      editData.value = db2form(res);
      
      // 解析作者名单并设置到authorList中
      if (editData.value["作者名单"]) {
        authorList.value = editData.value["作者名单"].split("、").filter((name: string) => name.trim());
      } else {
        authorList.value = [];
      }
      
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
                <ElCol span={12}>
                  <ElFormItem label="本人署名排序">
                    <ElSelect v-model={editData.value["本人署名排序"]} placeholder="请选择署名排序" style={{ width: '100%' }} clearable>
                      <ElOption label="独立作者" value="独立作者" />
                      <ElOption label="专著或书籍参与者" value="专著或书籍参与者" />
                      <ElOption label="共同第一作者" value="共同第一作者" />
                      <ElOption label="1" value="1" />
                      <ElOption label="2" value="2" />
                      <ElOption label="3" value="3" />
                      <ElOption label="4" value="4" />
                      <ElOption label="5" value="5" />
                      <ElOption label="6" value="6" />
                      <ElOption label="7" value="7" />
                      <ElOption label="8" value="8" />
                      <ElOption label="9" value="9" />
                      <ElOption label="10" value="10" />
                      <ElOption label="11" value="11" />
                      <ElOption label="12" value="12" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}><ElFormItem label="起始页号"><ElInput v-model={editData.value["起始页号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物级别"><ElInput v-model={editData.value["刊物级别"]} /></ElFormItem></ElCol>
                <ElCol span={12}>
                  <ElFormItem label="是否共同第一作者">
                    <ElSelect v-model={editData.value["是否共同第一"]} placeholder="请选择" style={{ width: '100%' }} clearable>
                      <ElOption label="是" value="是" />
                      <ElOption label="否" value="否" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="通讯作者">
                    <ElInput 
                      v-model={editData.value["通讯作者"]} 
                      placeholder="有中文姓名，请填写中文，不要填写拼音！多个通讯作者，中间用顿号"
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="论文类型">
                    <ElSelect v-model={editData.value["论文类型"]} placeholder="请选择论文类型" style={{ width: '100%' }} clearable>
                      <ElOption label="SCI" value="SCI" />
                      <ElOption label="SSCI" value="SSCI" />
                      <ElOption label="EI" value="EI" />
                      <ElOption label="CSCD" value="CSCD" />
                      <ElOption label="CSSCI" value="CSSCI" />
                      <ElOption label="中文核心" value="中文核心" />
                      <ElOption label="一级期刊" value="一级期刊" />
                      <ElOption label="二级期刊" value="二级期刊" />
                      <ElOption label="三级期刊" value="三级期刊" />
                      <ElOption label="会议论文" value="会议论文" />
                      <ElOption label="其他" value="其他" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}><ElFormItem label="影响因子"><ElInput v-model={editData.value["影响因子"]} /></ElFormItem></ElCol>
                <ElCol span={24}>
                  <ElFormItem label="作者名单">
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                      {authorList.value.map((author, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          background: '#20B2AA', 
                          color: 'white',
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}>
                          <span style={{ marginRight: '6px' }}>{author}</span>
                          <span 
                            style={{ 
                              cursor: 'pointer', 
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            onClick={() => removeAuthor(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          background: '#20B2AA', 
                          color: 'white',
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        onClick={() => {
                          const name = prompt('请输入作者姓名:');
                          if (name && name.trim()) {
                            addAuthor(name.trim());
                          }
                        }}
                      >
                        <span style={{ marginRight: '4px' }}>+</span>
                        <span>添加</span>
                      </div>
                    </div>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}><ElFormItem label="第一作者"><ElInput v-model={editData.value["第一作者"]} /></ElFormItem></ElCol>
                <ElCol span={12}>
                  <ElFormItem label="导师署名排序">
                    <ElSelect v-model={editData.value["导师署名排序"]} placeholder="请选择署名排序" style={{ width: '100%' }} clearable>
                      <ElOption label="独立作者" value="独立作者" />
                      <ElOption label="专著或书籍参与者" value="专著或书籍参与者" />
                      <ElOption label="共同第一作者" value="共同第一作者" />
                      <ElOption label="1" value="1" />
                      <ElOption label="2" value="2" />
                      <ElOption label="3" value="3" />
                      <ElOption label="4" value="4" />
                      <ElOption label="5" value="5" />
                      <ElOption label="6" value="6" />
                      <ElOption label="7" value="7" />
                      <ElOption label="8" value="8" />
                      <ElOption label="9" value="9" />
                      <ElOption label="10" value="10" />
                      <ElOption label="11" value="11" />
                      <ElOption label="12" value="12" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="本校是否第一署名单位">
                    <ElSelect v-model={editData.value["本校是否第一"]} placeholder="请选择" style={{ width: '100%' }} clearable>
                      <ElOption label="是" value="是" />
                      <ElOption label="否" value="否" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}><ElFormItem label="第一署名单位"><ElInput v-model={editData.value["第一署名单位"]} /></ElFormItem></ElCol>
                <ElCol span={12}>
                  <ElFormItem label="发表状态">
                    <ElSelect v-model={editData.value["发表状态"]} placeholder="请选择发表状态" style={{ width: '100%' }} clearable>
                      <ElOption label="已收录" value="已收录" />
                      <ElOption label="已公开发表" value="已公开发表" />
                      <ElOption label="未发表提供录用通知" value="未发表提供录用通知" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}><ElFormItem label="论文收录检索"><ElInput v-model={editData.value["论文收录检索"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="他引次数"><ElInput v-model={editData.value["他引次数"]} /></ElFormItem></ElCol>
                <ElCol span={12}>
                  <ElFormItem label="是否和学位论文相关">
                    <ElSelect v-model={editData.value["是否和学位论文相关"]} placeholder="请选择" style={{ width: '100%' }} clearable>
                      <ElOption label="是" value="是" />
                      <ElOption label="否" value="否" />
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
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

              <ElFormItem label="论文发表扫描件">
                {/* 新文件名 */}
                {editData.value["论文发表证书"] && editData.value["论文发表证书"] instanceof File && (
                  <div style={{ marginBottom: '8px', color: '#409EFF' }}>{editData.value["论文发表证书"].name}</div>
                )}
                {/* 原文件名 */}
                {editData.value["论文发表证书"] && typeof editData.value["论文发表证书"] === 'string' && (
                  <div style={{ marginBottom: '8px', marginRight: '10px', color: '#666' }}>{editData.value["论文发表证书"].split('/').pop()}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange("论文发表证书")}>
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
                    <span>ℹ️</span>
                    <span>允许上传zip,pdf,doc,docx格式的文件*</span>
                  </div>
                </div>
              </ElFormItem>

              <ElFormItem label="论文接收函">
                {/* 新文件名 */}
                {editData.value["论文接收函"] && editData.value["论文接收函"] instanceof File && (
                  <div style={{ marginBottom: '8px', marginRight: '10px', color: '#409EFF' }}>{editData.value["论文接收函"].name}</div>
                )}
                {/* 原文件名 */}
                {editData.value["论文接收函"] && typeof editData.value["论文接收函"] === 'string' && (
                  <div style={{ marginBottom: '8px', marginRight: '10px', color: '#666' }}>{editData.value["论文接收函"].split('/').pop()}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange("论文接收函")}>
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
                    <span>ℹ️</span>
                    <span>允许上传zip,pdf,doc,docx格式的文件*</span>
                  </div>
                </div>
              </ElFormItem>

              <ElFormItem label="论文电子版">
                {/* 新文件名 */}
                {editData.value["论文电子版"] && editData.value["论文电子版"] instanceof File && (
                  <div style={{ marginBottom: '8px', marginRight: '10px', color: '#409EFF' }}>{editData.value["论文电子版"].name}</div>
                )}
                {/* 原文件名 */}
                {editData.value["论文电子版"] && typeof editData.value["论文电子版"] === 'string' && (
                  <div style={{ marginBottom: '8px', marginRight: '10px', color: '#666' }}>{editData.value["论文电子版"].split('/').pop()}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange("论文电子版")}>
                    <ElButton>选择文件</ElButton>
                  </ElUpload>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
                    <span>ℹ️</span>
                    <span>允许上传zip,pdf,doc,docx格式的文件*</span>
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