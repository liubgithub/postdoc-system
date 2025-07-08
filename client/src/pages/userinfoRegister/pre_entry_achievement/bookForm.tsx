import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker } from "element-plus";
import dayjs from 'dayjs';
import { Edit, Delete } from '@element-plus/icons-vue';
import { getMyBooks, getBookById, createBook, updateBook, deleteBook } from "@/api/postdoctor/userinfoRegister/book";

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "著作中文名称", prop: "bookName", width: 140 },
  { label: "作者名单", prop: "authors", width: 140 },
  { label: "著作类别", prop: "bookType", width: 100 },
  { label: "出版社", prop: "publisher", width: 120 },
  { label: "出版日期", prop: "publishDate", width: 120 },
  { label: "著作字数", prop: "wordCount", width: 100 },
  { label: "出版号", prop: "publishNumber", width: 100 },
  { label: "ISBN号", prop: "isbn", width: 100 }
];

function db2form(item: any) {
  return {
    id: item.id,
    bookName: item["著作中文名"] ?? "",
    authors: item["作者名单"] ?? "",
    bookType: item["著作类别"] ?? "",
    publisher: item["出版社"] ?? "",
    publishDate: item["出版日期"] ? dayjs(item["出版日期"]).format('YYYY-MM-DD') : "",
    wordCount: item["著作字数"] ?? "",
    publishNumber: item["出版号"] ?? "",
    isbn: item["isbn"] ?? "",
    authorOrder: item["作者排名"] ?? "",
    edition: item["第几作者"] ?? "",
    bookNumber: item["著作编号"] ?? "",
    file: item["上传文件"] ?? null,
    remark: item["备注"] ?? ""
  };
}

function form2db(item: any) {
  return {
    "著作中文名": item.bookName,
    "作者名单": item.authors,
    "著作类别": item.bookType,
    "出版社": item.publisher,
    "出版日期": item.publishDate ? (item.publishDate instanceof Date ? item.publishDate.toISOString() : new Date(item.publishDate).toISOString()) : null,
    "著作字数": item.wordCount,
    "出版号": item.publishNumber,
    "isbn": item.isbn,
    "作者排名": item.authorOrder,
    "第几作者": item.edition,
    "著作编号": item.bookNumber,
    "上传文件": item.file && item.file.name ? item.file.name : null,
    "备注": item.remark
  };
}

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
        id: null,
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

    const handleEdit = async (row: any, index: number) => {
      const res = await getBookById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    const handleSave = async () => {
      const data = form2db(editData.value);
      if (editIndex.value === -1) {
        const res = await createBook(data);
        if (res) tableData.value.push(db2form(res));
      } else {
        const id = tableData.value[editIndex.value].id;
        const res = await updateBook(id, data);
        if (res) tableData.value[editIndex.value] = db2form(res);
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

    const handleDelete = async (row: any, index: number) => {
      await deleteBook(row.id);
      tableData.value.splice(index, 1);
    };

    onMounted(async () => {
      const data = await getMyBooks();
      tableData.value = (data ?? []).map(db2form);
    });

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
                <ElCol span={12}><ElFormItem label="出版日期"><ElDatePicker v-model={editData.value.publishDate} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} /></ElFormItem></ElCol>
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
                <ElButton type="primary" onClick={handleSave} style={{ marginRight: '2em' }}>提交</ElButton>
                <ElButton onClick={handleCancel}>取消</ElButton>
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
                col.prop === 'publishDate' ? (
                  <ElTableColumn
                    key={col.prop}
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) => row.publishDate ? dayjs(row.publishDate).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : (
                  <ElTableColumn key={col.prop} label={col.label} prop={col.prop} width={col.width} />
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
              <ElButton onClick={e => typeof props.onBack === 'function' && props.onBack(e)}>返回</ElButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}); 