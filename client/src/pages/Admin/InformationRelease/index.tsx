
import { ElButton, ElTable, ElInput, ElTableColumn, ElMessageBox, ElMessage } from "element-plus";
import AddNews from './addNews';
import AddColumn from './addColumn';
import * as cls from './style.css';

interface TableRow {
  id: number | string;
  newsName: string;
  releaseTime: string;
  belongTo: string;
  content: string;
}

export default defineComponent({
  name: "InformationRelease",
  setup() {
    const currentView = ref<'main' | 'addNews' | 'addColumn' | 'editNews'>('main');
    const editingNews = ref<TableRow | null>(null);
    const searchKeyword = ref('');
    
    // 模拟数据
    const tableData = ref<TableRow[]>([
      { id: 1, newsName: '系统升级通知', releaseTime: '2023-10-15 09:30', belongTo: '通知快讯', content: '系统将于本周六凌晨进行升级维护...' },
      { id: 2, newsName: '前端开发工程师招聘', releaseTime: '2023-10-10 14:20', belongTo: '招聘信息', content: '我司现招聘前端开发工程师，要求3年以上经验...' },
      { id: 3, newsName: '人工智能研讨会', releaseTime: '2023-10-05 16:45', belongTo: '学术新闻', content: '本周五将举办人工智能前沿技术研讨会...' },
      { id: 4, newsName: '国庆节放假安排', releaseTime: '2023-09-28 11:10', belongTo: '通知快讯', content: '根据国家规定，国庆节放假安排如下...' },
      { id: 5, newsName: '后端开发工程师招聘', releaseTime: '2023-09-25 10:30', belongTo: '招聘信息', content: '招聘高级后端开发工程师，精通Java或Go...' },
    ]);

    // 过滤后的数据
    const filteredData = ref<TableRow[]>(tableData.value);

    // 处理搜索
    const handleSearch = () => {
      if (!searchKeyword.value) {
        filteredData.value = tableData.value;
        return;
      }
      
      filteredData.value = tableData.value.filter(item => 
        item.newsName.includes(searchKeyword.value) || 
        item.belongTo.includes(searchKeyword.value)
      );
    };

    // 切换到新增新闻
    const handleAddNews = () => {
      currentView.value = 'addNews';
      editingNews.value = null;
    };

    // 切换到新增专栏
    const handleAddColumn = () => {
      currentView.value = 'addColumn';
    };

    // 编辑新闻
    const handleEdit = (row: TableRow) => {
      currentView.value = 'editNews';
      editingNews.value = { ...row };
    };

    // 查看新闻
    const handleView = (row: TableRow) => {
      ElMessageBox.alert(row.content, row.newsName, {
        confirmButtonText: '关闭',
        customClass: 'news-content-dialog'
      });
    };

    // 删除新闻
    const handleDelete = (row: TableRow) => {
      ElMessageBox.confirm(`确定要删除"${row.newsName}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const index = tableData.value.findIndex(item => item.id === row.id);
        if (index !== -1) {
          tableData.value.splice(index, 1);
          handleSearch(); // 刷新搜索
          ElMessage.success('删除成功');
        }
      }).catch(() => {
        // 取消删除
      });
    };

    // 返回主页面
    const handleBack = () => {
      currentView.value = 'main';
      editingNews.value = null;
    };

    // 保存新闻
    const handleSaveNews = (newsData: any) => {
      if (editingNews.value) {
        // 编辑现有新闻
        const index = tableData.value.findIndex(item => item.id === editingNews.value!.id);
        if (index !== -1) {
          tableData.value[index] = { ...newsData, id: editingNews.value.id };
        }
        ElMessage.success('新闻更新成功');
      } else {
        // 新增新闻
        const newNews = {
          ...newsData,
          id: Date.now(),
          releaseTime: new Date().toLocaleString()
        };
        tableData.value.unshift(newNews);
        ElMessage.success('新闻添加成功');
      }
      handleSearch();
      handleBack();
    };

    // 保存专栏
    const handleSaveColumn = (columnData: any) => {
      ElMessage.success(`专栏"${columnData.name}"添加成功`);
      handleBack();
    };

    // 渲染主页面
    const renderMainView = () => (
      <div class={cls.page}>
        <div class={cls.header}>
          <h2>信息发布管理</h2>
          <div class={cls.actions}>
            <ElButton type="primary" onClick={handleAddNews}>新增新闻</ElButton>
            <ElButton type="success" onClick={handleAddColumn}>新增专栏</ElButton>
          </div>
        </div>
        
        <div class={cls.searchPart}>
          <ElInput 
            v-model={searchKeyword.value}
            placeholder="请输入关键词搜索"
            clearable
            style="width: 300px; margin-right: 12px;"
            onClear={handleSearch}
          />
          <ElButton type="primary" onClick={handleSearch}>搜索</ElButton>
        </div>
        
        <div class={cls.tableBox}>
          <ElTable data={filteredData.value} style={{width: '100%'}}>
            <ElTableColumn type="index" label="序号" width="60" align="center" />
            <ElTableColumn prop="newsName" label="新闻名称" minWidth="120" />
            <ElTableColumn prop="releaseTime" label="发布时间" width="160" />
            <ElTableColumn prop="belongTo" label="专栏" width="120" />
            <ElTableColumn label="操作" width="220" align="center" fixed="right">
              {{
                default: ({ row }: { row: TableRow }) => (
                  <div class={cls.actions}>
                    <ElButton size="small" type="primary" onClick={() => handleEdit(row)}>
                      编辑
                    </ElButton>
                    <ElButton size="small" type="success" onClick={() => handleView(row)}>
                      查看
                    </ElButton>
                    <ElButton size="small" type="danger" onClick={() => handleDelete(row)}>
                      删除
                    </ElButton>
                  </div>
                )
              }}
            </ElTableColumn>
          </ElTable>
        </div>
        
        {filteredData.value.length === 0 && (
          <div class={cls.noData}>暂无数据</div>
        )}
      </div>
    );

    return () => (
      <div class={cls.container}>
        {currentView.value === 'main' && renderMainView()}
        {currentView.value === 'addNews' && (
          <AddNews onBack={handleBack} onSave={handleSaveNews} />
        )}
        {currentView.value === 'editNews' && (
          <AddNews onBack={handleBack} onSave={handleSaveNews} editData={editingNews.value || undefined} />
        )}
        {currentView.value === 'addColumn' && (
          <AddColumn onBack={handleBack} onSave={handleSaveColumn} />
        )}
      </div>
    );
  },
});