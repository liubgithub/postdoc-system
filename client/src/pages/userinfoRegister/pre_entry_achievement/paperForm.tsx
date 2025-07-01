import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

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

    const handleEdit = (row: any, index: number) => {
      editData.value = { ...row };
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = () => {
      if (editIndex.value === -1) {
        tableData.value.push({ ...editData.value });
      } else {
        tableData.value[editIndex.value] = { ...editData.value };
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
                <ElCol span={12}><ElFormItem label="发表日期"><ElInput v-model={editData.value.publishDate} /></ElFormItem></ElCol>
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
                <ElTableColumn
                  label={col.label}
                  prop={col.prop}
                  width={col.width}
                  v-slots={{
                    default: ({ row }: any) => row[col.prop] ?? ""
                  }}
                />
              ))}
              <ElTableColumn label="操作" width="100">
                {{
                  default: ({ row, $index }: any) => (
                    <ElButton type="primary" size="small" onClick={() => handleEdit(row, $index)}>编辑</ElButton>
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