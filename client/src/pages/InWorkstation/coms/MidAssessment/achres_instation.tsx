import * as cls from './style.css'
import { 
  ElTable, 
  ElTableColumn, 
  ElCard, 
  ElTag, 
  ElEmpty,
  ElDatePicker,
  ElButton
} from 'element-plus'
import fetch from '@/api/index'

export default defineComponent({
  name: 'Achievement',
  setup() {
    const time = ref('1000-06-10')
    const tables = ref<any>({})
    const totalCount = ref(0)
    const loading = ref(true)
    const hasData = ref(false)

    // 获取数据函数
    const fetchData = async () => {
      try {
        loading.value = true
        const res = await fetch.raw.GET(`/time-filter/get-data-after-time`, {
          params: { query: { target_time: time.value } }
        })
        
        if (res.data) {
          tables.value = res.data.tables
          totalCount.value = res.data.total_count as any
          hasData.value = totalCount.value > 0
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchData)

    // 处理日期格式
    const formatDate = (dateString: string) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    }

    // 应该隐藏的字段
    const hiddenFields = ['id', 'user_id', 'created_at', 'updated_at']

    // 渲染动态表格列
    const renderDynamicColumns = (data: any[]) => {
      if (!data || data.length === 0) return null
      
      // 获取所有字段（排除需要隐藏的字段）
      const fields = Object.keys(data[0]).filter(
        key => !hiddenFields.includes(key)
      )
      
      return fields.map(field => {
        // 特殊处理 time 字段，显示为"时间"
        const label = field === 'time' ? '时间' : field
        
        // 日期类型字段格式化
        if (field === 'time' || field.includes('日期') || field.includes('时间')) {
          return (
            <ElTableColumn
              prop={field}
              label={label}
              width="150"
              formatter={(row: any) => formatDate(row[field])}
            />
          )
        }
        
        return <ElTableColumn 
                  prop={field} 
                  label={label} 
                  show-overflow-tooltip 
                  min-width="120"
                />
      })
    }

    return () => (
      <div class={cls.achievementcontainer}>
        <div class={cls.filtersection}>
          <h2>科研成果统计</h2>
          <div class={cls.filtercontrols}>
            <ElDatePicker
              v-model={time.value}
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
            />
            <ElButton type="primary" onClick={fetchData} loading={loading.value}>
              查询
            </ElButton>
            <div class={cls.totalcount}>
              总记录数: <ElTag type="success">{totalCount.value}</ElTag>
            </div>
          </div>
        </div>

        {loading.value ? (
          <div class={cls.loading}>加载中...</div>
        ) : hasData.value ? (
          Object.keys(tables.value)
            .filter(tableKey => tables.value[tableKey].count > 0)
            .map(tableKey => {
              const tableData = tables.value[tableKey]
              
              return (
                <ElCard class={cls.tablecard} shadow="hover">
                  <div class={cls.tableheader}>
                    <h3>{tableData.display_name}</h3>
                    <ElTag type="info">{tableData.count} 条记录</ElTag>
                  </div>
                  
                  <ElTable
                    data={tableData.data}
                    border
                    stripe
                    style={{ width: '100%', marginTop: '15px' }}
                    empty-text="该类别暂无数据"
                  >
                    {renderDynamicColumns(tableData.data)}
                  </ElTable>
                </ElCard>
              )
            })
        ) : (
          <ElEmpty description="没有找到相关数据" />
        )}
      </div>
    )
  }
})