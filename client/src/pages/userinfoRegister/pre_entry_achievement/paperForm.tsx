import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker,ElMessageBox,ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import { getMyPapers, getPaperById, createPaper, updatePaper, deletePaper } from "@/api/postdoctor/userinfoRegister/paper";
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
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createPaper(data);
        if (res) tableData.value.push(db2form(res));
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updatePaper(id, data);
        if (res) tableData.value[editIndex.value] = db2form(res);
      }
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleCancel = () => {
      showForm.value = false;
      editIndex.value = -1;
    };

    const handleFileChange1 = (event: any) => {
      const file = event.file;
      if (file) {
        editData.value.paperScan = file;
      }
    };

    const handleFileChange2 = (event: any) => {
      const file = event.file;
      if (file) {
        editData.value.acceptanceLetter = file;
      }
    };

    const handleFileChange3 = (event: any) => {
      const file = event.file;
      if (file) {
        editData.value.electronicVersion = file;
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
      tableData.value = (data ?? []).map(db2form);
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
              <ElFormItem label="论文发表扫描件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange1}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.paperScan && <span style={{ marginLeft: 10 }}>{editData.value.paperScan.name}</span>}
              </ElFormItem>
              <ElFormItem label="论文接收函">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange2}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.acceptanceLetter && <span style={{ marginLeft: 10 }}>{editData.value.acceptanceLetter.name}</span>}
              </ElFormItem>
              <ElFormItem label="论文电子版地址">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange3}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.electronicVersion && <span style={{ marginLeft: 10 }}>{editData.value.electronicVersion.name}</span>}
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