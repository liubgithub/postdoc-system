import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker , ElMessageBox, ElMessage } from "element-plus";
import dayjs from 'dayjs';
import { Edit, Delete } from '@element-plus/icons-vue';
import { getMyBooks, getBookById, updateBook, deleteBook, uploadBook } from "@/api/postdoctor/userinfoRegister/book";

// 表格列定义
const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "著作中文名称", prop: "bookName", width: 140 },
  { label: "作者名单", prop: "authors", width: 140 },
  { label: "著作类别", prop: "bookType", width: 100 },
  { label: "出版社", prop: "publisher", width: 120 },
  { label: "出版日期", prop: "publishDate", width: 120 },
  { label: "著作字数", prop: "wordCount", width: 100 },
  { label: "出版号", prop: "publishNumber", width: 100 },
  { label: "ISBN号", prop: "isbn", width: 100 },
  // 新增上传文件列
  { label: "上传文件", prop: "file", width: 160 },
  { label: "备注", prop: "remark", width: 120 }
];

// 数据库对象转为表单对象（用于编辑/展示）
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
    // 上传文件字段：回显为文件名（从 URL 截取）或空
    file: item["上传文件"] ? item["上传文件"].split("/").pop() : null,
    fileUrl: item["上传文件"] ?? null,
    remark: item["备注"] ?? ""
  };
}

// 表单对象转为数据库对象（用于提交）
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
    // 上传文件字段：如果是文件对象则取文件名，否则取字符串
    "上传文件": item.file && item.file.name ? item.file.name : (typeof item.file === 'string' ? item.file : null),
    "备注": item.remark
  };
}

export default defineComponent({
  name: "BookForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    // 表格数据
    const tableData = ref<any[]>([]);
    // 控制表单显示/隐藏
    const showForm = ref(false);
    // 当前编辑的行索引，-1 表示新增
    const editIndex = ref(-1);
    // 当前编辑的表单数据
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

    // 新增按钮点击，重置表单
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

    // 编辑按钮点击，加载数据到表单
    const handleEdit = async (row: any, index: number) => {
      const res = await getBookById(row.id);
      editData.value = db2form(res);
      editIndex.value = index;
      showForm.value = true;
    };

    // 保存（新增或编辑）逻辑
    const handleSave = async () => {
      const formData = new FormData();
      formData.append("著作中文名", editData.value.bookName);
      formData.append("出版社", editData.value.publisher);
      formData.append("第几作者", editData.value.edition);
      formData.append("出版日期", editData.value.publishDate);
      formData.append("著作编号", editData.value.bookNumber);
      formData.append("著作类别", editData.value.bookType);
      formData.append("作者名单", editData.value.authors);
      formData.append("著作字数", editData.value.wordCount);
      formData.append("出版号", editData.value.publishNumber);
      formData.append("isbn", editData.value.isbn);
      formData.append("作者排名", editData.value.authorOrder);
      formData.append("备注", editData.value.remark ?? "");
      // 只有有新文件时才 append
      if (editData.value.file && editData.value.file instanceof File) {
        formData.append("file", editData.value.file);
      }

      // 新增
      if (editIndex.value === -1) {
        const res = await uploadBook(formData);
        if (res) {
          // 方式1：直接 push
          // tableData.value.push(db2form(res));
          // 方式2：推荐，重新拉取一次列表，保证和后端一致
          const data = await getMyBooks();
          tableData.value = (data ?? []).map(db2form);
          showForm.value = false;
          editIndex.value = -1;
          ElMessage.success('新增成功');
        }
      } else {
        // 编辑
        const id = editData.value.id;
        const res = await updateBook(id, formData);
        if (res) {
          const data = await getMyBooks();
          tableData.value = (data ?? []).map(db2form);
          showForm.value = false;
          editIndex.value = -1;
          ElMessage.success('编辑成功');
        }
      }
    };

    // 取消编辑
    const handleCancel = () => {
      showForm.value = false;
      editIndex.value = -1;
    };

    // 文件选择变化时触发，保存文件对象到 editData
    const handleFileChange = (file: any) => {
      editData.value.file = file.raw;
      editData.value.fileUrl = null; // 新文件时清空原文件URL
    };

    // 删除操作
    const handleDelete = async (row: any, index: number) => {
      await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteBook(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    // 下载文件
    const handleDownload = (bookId: number) => {
      // 直接打开后端下载接口
      window.open(`/api/pre_entry_book/download/${bookId}`);
    };

    // 移除已上传文件
    const handleRemoveFile = (idx: number) => {
      editData.value.files.splice(idx, 1);
    };

    // 移除新选文件
    const handleRemoveNewFile = (name: string) => {
      editData.value.files = editData.value.files.filter((f: any) => f.name !== name);
    };

    // 组件挂载时加载数据
    onMounted(async () => {
      const data = await getMyBooks();
      tableData.value = (data ?? []).map(db2form);
    });

    // 渲染函数
    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>著作信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                {/* 各种表单项 */}
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
              {/* 文件上传表单项 */}
              <ElFormItem label="上传文件">
                <ElUpload show-file-list={false} before-upload={() => false} on-change={handleFileChange}>
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {/* 新文件名 */}
                {editData.value.file && editData.value.file.name && (
                  <span style={{ marginLeft: 10 }}>{editData.value.file.name}</span>
                )}
                {/* 原文件名 */}
                {!editData.value.file && editData.value.fileUrl && (
                  <span style={{ marginLeft: 10 }}>{editData.value.fileUrl.split('/').pop()}</span>
                )}
                {/* 预览按钮 */}
                {editData.value.fileUrl && (
                  <ElButton
                    type="success"
                    size="small"
                    style={{ marginLeft: '10px' }}
                    onClick={() => window.open(editData.value.fileUrl, '_blank')}
                  >
                    预览
                  </ElButton>
                )}
              </ElFormItem>
              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value.remark} />
              </ElFormItem>
              {/* 提交/取消按钮 */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
                <ElButton type="primary" onClick={handleSave} style={{ marginRight: '2em' }}>提交</ElButton>
                <ElButton onClick={handleCancel}>取消</ElButton>
              </div>
            </ElForm>
          </div>
        ) : (
          <div>
            {/* 新增按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
              <ElButton type="primary" size="small" onClick={handleAdd}>添加</ElButton>
            </div>
            {/* 数据表格 */}
            <ElTable data={tableData.value} style={{ width: '100%' }} empty-text="暂无数据" header-cell-style={{ textAlign: 'center' }} cell-style={{ textAlign: 'center' }}>
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
                    key={col.prop}
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) => row.publishDate ? dayjs(row.publishDate).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : col.prop === 'file' ? (
                  <ElTableColumn
                    key="file"
                    label="上传文件"
                    prop="file"
                    width="160"
                    v-slots={{
                      default: ({ row }: any) =>
                        row.fileUrl ? (
                          <a href={row.fileUrl} target="_blank" rel="noopener noreferrer">{row.file}</a>
                        ) : (
                          <span>-</span>
                        )
                    }}
                  />
                ) : (
                  <ElTableColumn key={col.prop} label={col.label} prop={col.prop} width={col.width} />
                )
              ))}
              {/* 操作列 */}
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
            {/* 返回按钮 */}
            <div style={{ textAlign: 'center', marginTop: '2em' }}>
              <ElButton onClick={e => typeof props.onBack === 'function' && props.onBack(e)}>返回</ElButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}); 