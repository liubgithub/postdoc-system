import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload } from "element-plus";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "学号", prop: "stuId", width: 100 },
  { label: "著作中文名称", prop: "bookName", width: 140 },
  { label: "作者名单", prop: "authors", width: 140 },
  { label: "著作类别", prop: "bookType", width: 100 },
  { label: "出版社", prop: "publisher", width: 120 },
  { label: "出版日期", prop: "publishDate", width: 120 },
  { label: "著作字数", prop: "wordCount", width: 100 },
  { label: "出版号", prop: "publishNumber", width: 100 },
  { label: "ISBN号", prop: "isbn", width: 100 },
  { label: "操作", prop: "action", width: 100 }
];

export default defineComponent({
  name: "BookForm",
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
      bookName: "",
      authors: "",
      bookType: "",
      publisher: "",
      publishDate: "",
      wordCount: "",
      publishNumber: "",
      isbn: "",
      authorOrder: "",
      edition: "",
      bookNumber: "",
      file: null,
      remark: ""
    });

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        stuId: "",
        bookName: "",
        authors: "",
        bookType: "",
        publisher: "",
        publishDate: "",
        wordCount: "",
        publishNumber: "",
        isbn: "",
        authorOrder: "",
        edition: "",
        bookNumber: "",
        file: null,
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

    const handleFileChange = (file: any) => {
      editData.value.file = file.raw;
    };

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>著作信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="著作中文名称"><ElInput v-model={editData.value.bookName} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版社"><ElInput v-model={editData.value.publisher} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第几作者"><ElInput v-model={editData.value.edition} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版日期"><ElInput v-model={editData.value.publishDate} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="著作编号"><ElInput v-model={editData.value.bookNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="著作类别"><ElInput v-model={editData.value.bookType} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者名单"><ElInput v-model={editData.value.authors} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="著作字数"><ElInput v-model={editData.value.wordCount} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版号"><ElInput v-model={editData.value.publishNumber} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="ISBN"><ElInput v-model={editData.value.isbn} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者排名"><ElInput v-model={editData.value.authorOrder} /></ElFormItem></ElCol>
              </ElRow>
              <ElFormItem label="上传文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value.file && <span style={{ marginLeft: 10 }}>{editData.value.file.name}</span>}
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.remark} />
              </ElFormItem>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
                <ElButton onClick={handleCancel} style={{ marginRight: '2em' }}>取消</ElButton>
                <ElButton type="primary" onClick={handleSave}>提交</ElButton>
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
                <ElTableColumn key={col.prop} label={col.label} prop={col.prop} width={col.width} />
              ))}
              <ElTableColumn label="操作" width="100">
                {{
                  default: ({ row, $index }: any) => (
                    <ElButton size="small" onClick={() => handleEdit(row, $index)}>编辑</ElButton>
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