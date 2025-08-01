import { defineComponent, ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElUpload, ElDatePicker, ElMessageBox, ElMessage } from "element-plus";
import { Edit, Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import {
  getMyBooks,
  getBookById,
  uploadBook,
  updateBook,
  deleteBook
} from '@/api/postdoctor/userinfoRegister/book';

const columns = [
  { label: "序号", prop: "id", width: 60 },
  { label: "著作中文名", prop: "著作中文名", width: 150 },
  { label: "出版社", prop: "出版社", width: 120 },
  { label: "出版日期", prop: "出版日期", width: 110 },
  { label: "第几作者", prop: "第几作者", width: 100 },
  { label: "著作编号", prop: "著作编号", width: 100 },
  { label: "著作类别", prop: "著作类别", width: 100 },
  { label: "作者名单", prop: "作者名单", width: 120 },
  { label: "著作字数", prop: "著作字数", width: 100 },
  { label: "出版号", prop: "出版号", width: 100 },
  { label: "ISBN", prop: "isbn", width: 100 },
  { label: "作者排名", prop: "作者排名", width: 100 },
  { label: "上传文件", prop: "上传文件", width: 120 },
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
    著作中文名: item["著作中文名"] ?? "",
    出版社: item["出版社"] ?? "",
    出版日期: item["出版日期"] ? dayjs(item["出版日期"]).format('YYYY-MM-DD') : "",
    第几作者: item["第几作者"] ?? "",
    著作编号: item["著作编号"] ?? "",
    著作类别: item["著作类别"] ?? "",
    作者名单: item["作者名单"] ?? "",
    著作字数: item["著作字数"] ?? "",
    出版号: item["出版号"] ?? "",
    isbn: item["isbn"] ?? "",
    作者排名: item["作者排名"] ?? "",
    上传文件: item["上传文件"] ?? null,
    备注: item["备注"] ?? "",
    time: item["time"] ? dayjs(item["time"]).format('YYYY-MM-DD') : "",
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
      "著作中文名": "",
      "出版社": "",
      "出版日期": "",
      "第几作者": "",
      "著作编号": "",
      "著作类别": "",
      "作者名单": "",
      "著作字数": "",
      "出版号": "",
      "isbn": "",
      "作者排名": "",
      "上传文件": null,
      "备注": "",
      "time": "",
    });

    const loadBooks = async () => {
      const data = await getMyBooks();
      tableData.value = (data ?? []).map(db2form);
    };

    const handleAdd = () => {
      editData.value = {
        id: tableData.value.length + 1,
        "著作中文名": "",
        "出版社": "",
        "出版日期": "",
        "第几作者": "",
        "著作编号": "",
        "著作类别": "",
        "作者名单": "",
        "著作字数": "",
        "出版号": "",
        "isbn": "",
        "作者排名": "",
        "上传文件": null,
        "备注": "",
        "time": "",
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
      if (!editData.value["著作中文名"]?.trim()) {
        ElMessage.error('著作中文名不能为空');
        return;
      }
      if (!editData.value["出版社"]?.trim()) {
        ElMessage.error('出版社不能为空');
        return;
      }
      if (!editData.value["出版日期"]?.trim()) {
        ElMessage.error('出版日期不能为空');
        return;
      }

      const formData = new FormData();
      formData.append("著作中文名", editData.value["著作中文名"]);
      formData.append("出版社", editData.value["出版社"]);
      formData.append("出版日期", editData.value["出版日期"]);
      formData.append("第几作者", editData.value["第几作者"] || "");
      formData.append("著作编号", editData.value["著作编号"] || "");
      formData.append("著作类别", editData.value["著作类别"] || "");
      formData.append("作者名单", editData.value["作者名单"] || "");
      formData.append("著作字数", editData.value["著作字数"] || "");
      formData.append("出版号", editData.value["出版号"] || "");
      formData.append("isbn", editData.value["isbn"] || "");
      formData.append("作者排名", editData.value["作者排名"] || "");
      formData.append("time", editData.value["time"] ? dayjs(editData.value["time"]).format('YYYY-MM-DD HH:mm:ss') : "");
      if (editData.value["上传文件"] instanceof File) {
        formData.append("file", editData.value["上传文件"]);
      }
      formData.append("备注", editData.value["备注"] || "");

      let res;
      if (editIndex.value === -1) {
        // 新增
        res = await uploadBook(formData);
        if (res) {
          const data = await getMyBooks();
          tableData.value = (data ?? []).map(db2form);
        }
      } else {
        // 编辑
        const id = editData.value.id;
        res = await updateBook(id, formData);
        if (res) {
          const data = await getMyBooks();
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
      await ElMessageBox.confirm('确定要删除该著作吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      await deleteBook(row.id);
      tableData.value.splice(index, 1);
      ElMessage.success('删除成功');
    };

    // 文件上传回调
    const handleFileChange = (file: any) => {
      editData.value["上传文件"] = file.raw;
    };

    onMounted(loadBooks);

    return () => (
      <div>
        {showForm.value ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2em' }}>著作信息登记</h2>
            <ElForm model={editData.value} label-width="120px">
              <ElRow gutter={20}>
                <ElCol span={12}><ElFormItem label="著作中文名"><ElInput v-model={editData.value["著作中文名"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版社"><ElInput v-model={editData.value["出版社"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版日期">
                  <ElDatePicker v-model={editData.value["出版日期"]} type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="第几作者"><ElInput v-model={editData.value["第几作者"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="著作编号"><ElInput v-model={editData.value["著作编号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="著作类别"><ElInput v-model={editData.value["著作类别"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者名单"><ElInput v-model={editData.value["作者名单"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="著作字数"><ElInput v-model={editData.value["著作字数"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="出版号"><ElInput v-model={editData.value["出版号"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="ISBN"><ElInput v-model={editData.value["isbn"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="作者排名"><ElInput v-model={editData.value["作者排名"]} /></ElFormItem></ElCol>
                <ElCol span={12}><ElFormItem label="时间">
                  <ElDatePicker v-model={editData.value["time"]} type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="选择成果时间" style={{ width: '100%' }} />
                </ElFormItem></ElCol>
              </ElRow>

              <ElFormItem label="上传文件">
                <ElUpload
                  show-file-list={false}
                  before-upload={() => false}
                  on-change={handleFileChange}
                >
                  <ElButton>选择文件</ElButton>
                </ElUpload>
                {editData.value["上传文件"] && <span style={{ marginLeft: 10 }}>{editData.value["上传文件"].name}</span>}
              </ElFormItem>

              <ElFormItem label="备注">
                <ElInput type="textarea" rows={4} v-model={editData.value["备注"]} />
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
                ) : col.prop === '出版日期' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row[col.prop] ? dayjs(row[col.prop]).format('YYYY-MM-DD') : ''
                    }}
                  />
                ) : col.prop === '上传文件' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={col.width}
                    v-slots={{
                      default: ({ row }: any) =>
                        row["上传文件"] ? (
                          <a href={row["上传文件"]} target="_blank" style={{ color: '#409EFF', textDecoration: 'none' }}>
                            {row["上传文件"].split('/').pop()}
                          </a>
                        ) : ""
                    }}
                  />
                ) : col.prop === 'time' ? (
                  <ElTableColumn
                    label={col.label}
                    prop={col.prop}
                    width={120}
                    v-slots={{
                      default: ({ row }: any) =>
                        row["time"] ? dayjs(row["time"]).format('YYYY-MM-DD HH:mm:ss') : ""
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