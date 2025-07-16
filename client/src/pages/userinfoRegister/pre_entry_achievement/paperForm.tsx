import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker,ElMessageBox,ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import { getMyPapers, getPaperById, uploadPaper, updatePaper, deletePaper } from "@/api/postdoctor/userinfoRegister/paper";
import dayjs from 'dayjs';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "学号", prop: "stuId", width: 100 },
  { label: "是否确认", prop: "confirmed", width: 80 },
  { label: "论文名称", prop: "title", width: 160 },
  { label: "第几作者", prop: "authorOrder", width: 80 },
  { label: "是否和学位论文相关", prop: "relatedToThesis", width: 120 },
  { label: "通讯作者", prop: "correspondingAuthor", width: 100 },
  { label: "导师署名排序", prop: "supervisorOrder", width: 110 },
  { label: "本校是否第一署名单位", prop: "isFirstAffiliation", width: 120 },
  { label: "第一署名单位", prop: "firstAffiliation", width: 120 },
  { label: "刊物名称", prop: "journal", width: 120 },
  { label: "发表状态", prop: "status", width: 100 },
  { label: "发表日期", prop: "publishDate", width: 110 },
  { label: "论文收录检索号", prop: "indexNumber", width: 130 },
  { label: "他引/次数", prop: "citationCount", width: 90 },
  { label: "出版号", prop: "issn", width: 100 },
  { label: "刊物级别", prop: "journalLevel", width: 100 },
  { label: "影响因子", prop: "impactFactor", width: 80 }
];

const fileFields = [
  { label: "论文发表证书", prop: "paperScan", field: "论文发表证书" },
  { label: "论文接收函", prop: "acceptanceLetter", field: "论文接收函" },
  { label: "论文电子版", prop: "electronicVersion", field: "论文电子版" }
];

function db2form(item: any) {
  return {
    id: item.id,
    title: item["论文名称"] ?? "",
    journal: item["刊物名称"] ?? "",
    authorOrder: item["本人署名排序"] ?? "",
    publishDate: item["发表日期"] ? new Date(item["发表日期"]).toISOString().slice(0, 10) : "",
    startPage: item["起始页号"] ?? "",
    journalLevel: item["刊物级别"] ?? "",
    isCoFirstAuthor: item["是否共同第一"] ?? "",
    correspondingAuthor: item["通讯作者"] ?? "",
    journalType: item["论文类型"] ?? "",
    impactFactor: item["影响因子"] ?? "",
    authorName: item["作者名单"] ?? "",
    firstAuthor: item["第一作者"] ?? "",
    supervisorOrder: item["导师署名排序"] ?? "",
    isFirstAffiliation: item["本校是否第一"] ?? "",
    firstAffiliation: item["第一署名单位"] ?? "",
    status: item["发表状态"] ?? "",
    indexNumber: item["论文收录检索"] ?? "",
    citationCount: item["他引次数"] ?? "",
    relatedToThesis: item["是否和学位论文相关"] ?? "",
    issn: item["出版号"] ?? "",
    publisher: item["出版社"] ?? "",
    totalIssue: item["总期号"] ?? "",
    journalNumber: item["刊物编号"] ?? "",
    paperScan: item["论文发表证书"] ?? null,
    acceptanceLetter: item["论文接收函"] ?? null,
    electronicVersion: item["论文电子版"] ?? null,
    remark: item["备注"] ?? ""
  };
}

function form2db(item: any) {
  return {
    "论文名称": item.title,
    "刊物名称": item.journal,
    "本人署名排序": item.authorOrder,
    "发表日期": item.publishDate ? new Date(item.publishDate).toISOString() : null,
    "起始页号": item.startPage,
    "刊物级别": item.journalLevel,
    "是否共同第一": item.isCoFirstAuthor,
    "通讯作者": item.correspondingAuthor,
    "论文类型": item.journalType,
    "影响因子": item.impactFactor,
    "作者名单": item.authorName,
    "第一作者": item.firstAuthor,
    "导师署名排序": item.supervisorOrder,
    "本校是否第一": item.isFirstAffiliation,
    "第一署名单位": item.firstAffiliation,
    "发表状态": item.status,
    "论文收录检索": item.indexNumber,
    "他引次数": item.citationCount,
    "是否和学位论文相关": item.relatedToThesis,
    "出版号": item.issn,
    "出版社": item.publisher,
    "总期号": item.totalIssue,
    "刊物编号": item.journalNumber,
    "论文发表证书": item.paperScan,
    "论文接收函": item.acceptanceLetter,
    "论文电子版": item.electronicVersion,
    "备注": item.remark
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
      stuId: "",
      confirmed: "",
      title: "",
      authorOrder: "",
      relatedToThesis: "",
      correspondingAuthor: "",
      supervisorOrder: "",
      isFirstAffiliation: "",
      firstAffiliation: "",
      journal: "",
      status: "",
      publishDate: "",
      indexNumber: "",
      citationCount: "",
      issn: "",
      journalLevel: "",
      impactFactor: "",
      startPage: "",
      isCoFirstAuthor: "",
      journalType: "",
      authorName: "",
      firstAuthor: "",
      publisher: "",
      totalIssue: "",
      journalNumber: "",
      paperScan: null,
      acceptanceLetter: null,
      electronicVersion: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        stuId: "",
        confirmed: "",
        title: "",
        authorOrder: "",
        relatedToThesis: "",
        correspondingAuthor: "",
        supervisorOrder: "",
        isFirstAffiliation: "",
        firstAffiliation: "",
        journal: "",
        status: "",
        publishDate: "",
        indexNumber: "",
        citationCount: "",
        issn: "",
        journalLevel: "",
        impactFactor: "",
        startPage: "",
        isCoFirstAuthor: "",
        journalType: "",
        authorName: "",
        firstAuthor: "",
        publisher: "",
        totalIssue: "",
        journalNumber: "",
        paperScan: null,
        acceptanceLetter: null,
        electronicVersion: null,
        remark: ""
      };
      editIndex.value = -1;
      showForm.value = true;
    };

    const handleEdit = async (row: any, index: number) => {
      const res = await getPaperById(row.id);
      // 兼容文件字段：如果是字符串（URL），保留；否则为 null
      const form = db2form(res);
      form.paperScan = form.paperScan || null;
      form.acceptanceLetter = form.acceptanceLetter || null;
      form.electronicVersion = form.electronicVersion || null;
      editData.value = form;
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      // 校验发表日期格式
      if (!editData.value.publishDate || !/^\d{4}-\d{2}-\d{2}$/.test(editData.value.publishDate)) {
        ElMessage.error('发表日期格式应为 YYYY-MM-DD');
        return;
      }
      // 构造 FormData
      const formData = new FormData();
      formData.append("论文名称", editData.value.title);
      formData.append("刊物名称", editData.value.journal);
      formData.append("本人署名排序", editData.value.authorOrder);
      formData.append("发表日期", editData.value.publishDate);
      formData.append("起始页号", editData.value.startPage);
      formData.append("刊物级别", editData.value.journalLevel);
      formData.append("是否共同第一", editData.value.isCoFirstAuthor);
      formData.append("通讯作者", editData.value.correspondingAuthor);
      formData.append("论文类型", editData.value.journalType);
      formData.append("影响因子", editData.value.impactFactor);
      formData.append("作者名单", editData.value.authorName);
      formData.append("第一作者", editData.value.firstAuthor);
      formData.append("导师署名排序", editData.value.supervisorOrder);
      formData.append("本校是否第一", editData.value.isFirstAffiliation);
      formData.append("第一署名单位", editData.value.firstAffiliation);
      formData.append("发表状态", editData.value.status);
      formData.append("论文收录检索", editData.value.indexNumber);
      formData.append("他引次数", editData.value.citationCount);
      formData.append("是否和学位论文相关", editData.value.relatedToThesis);
      formData.append("出版号", editData.value.issn);
      formData.append("出版社", editData.value.publisher);
      formData.append("总期号", editData.value.totalIssue);
      formData.append("刊物编号", editData.value.journalNumber);
      formData.append("备注", editData.value.remark ?? "");
      // 多文件字段
      if (editData.value.paperScan instanceof File) {
        formData.append("论文发表证书", editData.value.paperScan);
      }
      if (editData.value.acceptanceLetter instanceof File) {
        formData.append("论文接收函", editData.value.acceptanceLetter);
      }
      if (editData.value.electronicVersion instanceof File) {
        formData.append("论文电子版", editData.value.electronicVersion);
      }
      let res;
      if (editIndex.value === -1) {
        // 新增
        res = await uploadPaper(formData);
        if (res) {
          const data = await getMyPapers();
          tableData.value = Array.isArray(data) ? data.map(db2form) : [];
        }
      } else {
        // 编辑（无论是否有新文件）
        const id = editData.value.id;
        res = await updatePaper(id, formData);
        if (res) {
          const data = await getMyPapers();
          tableData.value = Array.isArray(data) ? data.map(db2form) : [];
        }
      }
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleCancel = () => {
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleFileChange1 = (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value.paperScan = fileObj.raw;
      }
    };

    const handleFileChange2 = (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value.acceptanceLetter = fileObj.raw;
      }
    };

    const handleFileChange3 = (fileObj: any) => {
      if (fileObj && fileObj.raw) {
        editData.value.electronicVersion = fileObj.raw;
      }
    };

    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deletePaper(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    onMounted(async () => {
      const data = await getMyPapers();
      tableData.value = Array.isArray(data) ? data.map(db2form) : [];
    });

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>学术论文信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="论文名称"><ElInput v-model={editData.value.title} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物名称"><ElInput v-model={editData.value.journal} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本人署名排序"><ElInput v-model={editData.value.authorOrder} /></ElFormItem></ElCol>
                <ElCol span={12}>
                  <ElFormItem label="发表日期">
                    <ElDatePicker
                      v-model={editData.value.publishDate}
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="选择日期"
                      style={{ width: '100%' }}
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}><ElFormItem label="起始页码"><ElInput v-model={editData.value.startPage} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物级别"><ElInput v-model={editData.value.journalLevel} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否共同第一作者"><ElInput v-model={editData.value.isCoFirstAuthor} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="通讯作者"><ElInput v-model={editData.value.correspondingAuthor} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物类型"><ElInput v-model={editData.value.journalType} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="影响因子"><ElInput v-model={editData.value.impactFactor} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者名称"><ElInput v-model={editData.value.authorName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一作者"><ElInput v-model={editData.value.firstAuthor} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="导师署名排序"><ElInput v-model={editData.value.supervisorOrder} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="本校是否第一署名单位"><ElInput v-model={editData.value.isFirstAffiliation} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第一署名单位"><ElInput v-model={editData.value.firstAffiliation} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="发表状态"><ElInput v-model={editData.value.status} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="论文收录检索号"><ElInput v-model={editData.value.indexNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="他引/次数"><ElInput v-model={editData.value.citationCount} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="是否和学位论文相关"><ElInput v-model={editData.value.relatedToThesis} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版号"><ElInput v-model={editData.value.issn} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版社"><ElInput v-model={editData.value.publisher} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="总期号"><ElInput v-model={editData.value.totalIssue} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="刊物编号"><ElInput v-model={editData.value.journalNumber} /></ElFormItem></ElCol>
              </ElRow>
              {/* 文件上传表单项，风格与 bookForm 一致 */}
              <ElFormItem label="论文发表证书">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange1}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value.paperScan && typeof editData.value.paperScan === 'object' && editData.value.paperScan.name && (
                  <span style={{ marginLeft: 10 }}>{editData.value.paperScan.name}</span>
                )}
                {/* 原文件名 */}
                {typeof editData.value.paperScan === 'string' && editData.value.paperScan && (
                  <span style={{ marginLeft: 10 }}>{editData.value.paperScan.split('/').pop()}</span>
                )}
              </ElFormItem>
              <ElFormItem label="论文接收函">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange2}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.acceptanceLetter && typeof editData.value.acceptanceLetter === 'object' && editData.value.acceptanceLetter.name && (
                  <span style={{ marginLeft: 10 }}>{editData.value.acceptanceLetter.name}</span>
                )}
                {typeof editData.value.acceptanceLetter === 'string' && editData.value.acceptanceLetter && (
                  <span style={{ marginLeft: 10 }}>{editData.value.acceptanceLetter.split('/').pop()}</span>
                )}
              </ElFormItem>
              <ElFormItem label="论文电子版">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange3}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.electronicVersion && typeof editData.value.electronicVersion === 'object' && editData.value.electronicVersion.name && (
                  <span style={{ marginLeft: 10 }}>{editData.value.electronicVersion.name}</span>
                )}
                {typeof editData.value.electronicVersion === 'string' && editData.value.electronicVersion && (
                  <span style={{ marginLeft: 10 }}>{editData.value.electronicVersion.split('/').pop()}</span>
                )}
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.remark} />
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
                ) : col.prop === 'publishDate' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) => row.publishDate ? dayjs(row.publishDate).format('YYYY-MM-DD') : ''
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
              {/* 文件字段专用列 */}
              {fileFields.map(f => (
                <ElTableColumn
                  key={f.prop}
                  label={f.label}
                  width={180}
                  v-slots={{
                    default: ({ row }: any) =>
                      row[f.prop] ? (
                        <span>
                          <a href={row[f.prop]} target="_blank" rel="noopener noreferrer">{row[f.prop].split('/').pop()}</a>
                          <ElButton size="small" style={{ marginLeft: 8 }} onClick={() => window.open(row[f.prop])}>预览</ElButton>
                        </span>
                      ) : <span style={{ color: '#aaa' }}>无</span>
                  }}
                />
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