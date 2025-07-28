import { defineComponent, ref, computed, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElTag, ElMessage } from 'element-plus'

interface BusinessStatus {
  id: number
  type: string
  initiator: string
  status: string
  submitTime: string
  detailId: string
}

const STATUS_PROCESSING = '处理中'
const STATUS_DONE = '已处理'

export default defineComponent({
  name: 'StatusPage',
  setup() {
    const activeTab = ref<'processing' | 'done'>('processing')
    const data = ref<BusinessStatus[]>([])
    const loading = ref(false)

    // 获取数据
    const fetchData = async () => {
      loading.value = true
      // TODO: 替换为你的实际接口
      // const res = await fetch.raw.GET('/your/api/path')
      // data.value = res.data
      setTimeout(() => {
        data.value = [
          // 示例数据
          // { id: 1, type: '进站申请', initiator: '张三', status: '处理中', submitTime: '2024-06-01 10:00', detailId: '1' },
        ]
        loading.value = false
      }, 500)
    }

    onMounted(fetchData)

    const filteredData = computed(() =>
      data.value.filter(item =>
        activeTab.value === 'processing'
          ? item.status === STATUS_PROCESSING
          : item.status === STATUS_DONE
      )
    )

    const handleDetail = (id: string) => {
      ElMessage.info('详情: ' + id)
    }
    const handleView = (id: string) => {
      ElMessage.info('查看: ' + id)
    }

    return () => (
      <div style={{ background: '#f5f5f5', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <ElButton
            type={activeTab.value === 'processing' ? 'primary' : 'default'}
            style={{ fontSize: '20px', padding: '10px 40px' }}
            onClick={() => (activeTab.value = 'processing')}
          >
            处理中
          </ElButton>
          <ElButton
            type={activeTab.value === 'done' ? 'primary' : 'default'}
            style={{ fontSize: '20px', padding: '10px 40px' }}
            onClick={() => (activeTab.value = 'done')}
          >
            已处理
          </ElButton>
        </div>
        <div style={{ background: '#fff', padding: '16px' }}>
          <ElTable
            data={filteredData.value}
            border
            style={{ width: '100%' }}
            v-loading={loading.value}
          >
            <ElTableColumn type="index" label="序号" width={60} />
            <ElTableColumn prop="type" label="业务类型" minWidth={120} />
            <ElTableColumn prop="initiator" label="发起人" minWidth={100} />
            <ElTableColumn prop="status" label="流程状态" minWidth={100}>
              {{
                default: ({ row }: { row: BusinessStatus }) => (
                  <ElTag type={row.status === STATUS_PROCESSING ? 'info' : 'success'}>
                    {row.status}
                  </ElTag>
                )
              }}
            </ElTableColumn>
            <ElTableColumn prop="submitTime" label="提交时间" minWidth={160} />
            <ElTableColumn label="操作" minWidth={180} align="center">
              {{
                default: ({ row }: { row: BusinessStatus }) => (
                  <>
                    <ElButton size="small" onClick={() => handleDetail(row.detailId)}>
                      详情
                    </ElButton>
                    <ElButton size="small" type="info" onClick={() => handleView(row.detailId)}>
                      查看
                    </ElButton>
                  </>
                )
              }}
            </ElTableColumn>
          </ElTable>
          {!loading.value && filteredData.value.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
              暂无数据
            </div>
          )}
        </div>
      </div>
    )
  }
})
