import fetch from '@/api/index'
import * as cls from './styles.css'
import { useRoute } from 'vue-router'

type InfoItem = {
  id: number
  newsName: string
  belongTo?: string | null
  content?: string | null
  created_at?: string | null
}

function formatDate(iso?: string | null) {
  const d = iso ? new Date(iso) : new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatContent(content?: string | null) {
  if (!content) return ''
  
  // 先处理超链接，将URL转换为可点击的链接
  let formattedContent = content.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #409EFF; text-decoration: underline;">$1</a>'
  )
  
  // 将换行符转换为 <br> 标签
  formattedContent = formattedContent.replace(/\n/g, '<br>')
  
  // 处理首行缩进（将多个空格转换为 &nbsp;）
  formattedContent = formattedContent.replace(/^(\s+)/gm, (match) => {
    // 将每行开头的空格转换为 &nbsp;
    return match.replace(/ /g, '&nbsp;')
  })
  
  return formattedContent
}

export default defineComponent({
  name: 'NewsDetail',
  setup() {
    const route = useRoute()
    const loading = ref<boolean>(false)
    const detail = ref<InfoItem | null>(null)
    const errorMessage = ref<string>('')

    const loadDetail = async () => {
      const id = Number(route.params.id)
      console.log(id, 'ww')
      if (!id) {
        errorMessage.value = '参数错误'
        return
      }
      loading.value = true
      errorMessage.value = ''
      try {
        const res = await fetch.raw.GET('/information/release/{info_id}', {
          params: { path: { info_id: id } }
        })
        if (res.response.ok) {
          detail.value = res.data as unknown as InfoItem
        } else {
          errorMessage.value = '加载失败'
        }
      } catch (e) {
        errorMessage.value = '加载失败'
      } finally {
        loading.value = false
      }
    }

    onMounted(loadDetail)

    return () => (
      <div class={cls.container}>
        {loading.value && <div class={cls.loading}>加载中...</div>}
        {!!errorMessage.value && <div class={cls.error}>{errorMessage.value}</div>}
        {(!loading.value && detail.value) && (
          <div class={cls.page}>
            <div class={cls.leftpart}>
              <div class={cls.leftop}>
                首页
              </div>
              <div class={cls.leftbottom}>
                通知快讯
              </div>
            </div>
            <div class={cls.news}>
              <h1 class={cls.title}>{detail.value.newsName}</h1>
              <div class={cls.date}>发布时间：{formatDate(detail.value.created_at)}</div>
              <div class={cls.content} v-html={formatContent(detail.value.content)}></div>
            </div>

          </div>
        )}
      </div>
    )
  }
})


