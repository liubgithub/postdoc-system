import { ElButton, ElTable, ElInput, ElTableColumn, ElMessageBox, ElMessage, ElPagination } from "element-plus";
import AddNews from './addNews';
import AddColumn from './addColumn';
import * as cls from './style.css';
import fetch from '@/api/index'

interface TableRow {
  id: number;
  newsName: string;
  belongTo: string
  content: string
  created_at?: string | null
}

export default defineComponent({
  name: "InformationRelease",
  setup() {
    const currentView = ref<'main' | 'addNews' | 'addColumn' | 'editNews'>('main');
    const editingNews = ref<TableRow | null>(null);
    const searchKeyword = ref('');
    
    // 表格数据
    const tableData = ref<TableRow[]>([]);
    
    // 分页相关状态
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    // 格式化日期，只取年月日
    const formatDate = (dateString: string | null | undefined) => {
      if (!dateString) return '-';
      
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // 只返回年月日部分
      } catch (error) {
        console.error('日期格式化错误:', error);
        return '-';
      }
    };

    // 过滤后的数据
    const filteredData = computed(() => {
      if (!searchKeyword.value) {
        return tableData.value;
      }
      
      return tableData.value.filter(item => 
        item.newsName.includes(searchKeyword.value) || 
        item.belongTo.includes(searchKeyword.value)
      );
    });

    // 分页后的数据
    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredData.value.slice(start, end);
    });

    // 处理搜索
    const handleSearch = () => {
      currentPage.value = 1; // 搜索时重置到第一页
      total.value = filteredData.value.length;
    };

    // 处理页码变化
    const handleCurrentChange = (page: number) => {
      currentPage.value = page;
    };

    // 处理每页条数变化
    const handleSizeChange = (size: number) => {
      pageSize.value = size;
      currentPage.value = 1;
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
    const handleDelete = async(row: TableRow) => {
      ElMessageBox.confirm(`确定要删除"${row.newsName}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        try {
          // 使用从API获取的真实id
          await fetch.raw.DELETE('/information/release/{info_id}', {
            params: {
              path: {
                info_id: row.id // 使用真实的id
              }
            }
          });
          
          // 从本地数据中删除
          const index = tableData.value.findIndex(item => item.id === row.id);
          if (index !== -1) {
            tableData.value.splice(index, 1);
            total.value = tableData.value.length;
            ElMessage.success('删除成功');
          }
        } catch (error) {
          console.error('删除失败:', error);
          ElMessage.error('删除失败');
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
    const handleSaveNews = async(newsData: any) => {
      try {
        if (editingNews.value) {
          // 编辑现有新闻
          const index = tableData.value.findIndex(item => item.id === editingNews.value!.id);
          if (index !== -1) {
            tableData.value[index] = { ...newsData, id: editingNews.value.id };
          }
          ElMessage.success('新闻更新成功');
        } else {
          // 新增新闻
          const res = await fetch.raw.POST('/information/release', { body: newsData });
          if (res.response.ok) {
            // 重新获取数据以确保数据最新
            const fetchRes = await fetch.raw.GET('/information/release');
            if (fetchRes.response.ok && fetchRes.data) {
              // 按照id倒序排列
              tableData.value = fetchRes.data.sort((a: TableRow, b: TableRow) => 
                Number(b.id) - Number(a.id)
              );
              total.value = tableData.value.length;
            }
            ElMessage.success('新闻添加成功');
          }
        }
        handleBack();
      } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败');
      }
    };

    // 保存专栏
    const handleSaveColumn = (columnData: any) => {
      ElMessage.success(`专栏"${columnData.name}"添加成功`);
      handleBack();
    };

    onMounted(async() => {
      try {
        const res = await fetch.raw.GET('/information/release');
        if (res.response.ok && res.data) {
          // 按照id倒序排列
          tableData.value = res.data.sort((a: TableRow, b: TableRow) => 
            Number(b.id) - Number(a.id)
          );
          total.value = tableData.value.length;

        }
      } catch (error) {
        console.error('获取数据失败:', error);
        ElMessage.error('获取数据失败');
      }
    });

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
          <ElTable data={pagedData.value} style={{width: '100%', padding:'10px 0'}}>
            <ElTableColumn type="index" label="序号" width="60" align="center" />
            <ElTableColumn prop="newsName" label="新闻名称" minWidth="120" />
            <ElTableColumn 
              prop="created_at" 
              label="发布时间" 
              width="160" 
              formatter={(row: TableRow) => formatDate(row.created_at)}
            />
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
          {/* 分页器 - 使用正确的事件绑定 */}
          <ElPagination
            currentPage={currentPage.value}
            pageSize={pageSize.value}
            pageSizes={[1,5,10, 20, 50, 100]}
            layout="total, sizes, prev, pager, next, jumper"
            total={total.value}
            {...{
              'onCurrent-change': handleCurrentChange,
              'onSize-change': handleSizeChange
            }}
            style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}
          />
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