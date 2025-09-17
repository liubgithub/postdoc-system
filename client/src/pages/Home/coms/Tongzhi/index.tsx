import fetch from '@/api/index'
import { ElCard } from 'element-plus'
import * as cls from './styles.css'
import { useRouter } from 'vue-router'
type InfoItem = {
    id: number
    newsName: string
    belongTo?: string | null
    content?: string | null
    created_at?: string | null
}

function formatDateParts(iso?: string | null) {
    const d = iso ? new Date(iso) : new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return { year, month, day, ym: `${year}-${month}`, ymd: `${year}-${month}-${day}` }
}

export default defineComponent({
    name: 'tongzhi',
    setup() {
        const list = ref<InfoItem[]>([])

        const fetchData = async () => {
            const res = await fetch.raw.GET('/information/release')
            if (res.response.ok) {
                const data = (res.data as unknown as InfoItem[]) || []
                // 可忽略 belongTo 字段的值，但若存在则只取“通知快讯”
                const filtered = data.filter(item => !item.belongTo || item.belongTo === '通知快讯')
                filtered.sort((a, b) => {
                    const ta = new Date(a.created_at || 0).getTime()
                    const tb = new Date(b.created_at || 0).getTime()
                    return tb - ta
                })
                list.value = filtered
            }
        }

        onMounted(fetchData)

        const base = import.meta.env.BASE_URL || '/'
        const openNews = () => {
       
        }
  
        return () => (
            <div style={{ marginTop: '16px', maxWidth: '1100px' }}>
                <div class={cls.title}>
                    <div>通知快讯</div>
                    <a class={cls.btn} onClick={openNews}>查看更多+</a>
                </div>

                {/* 第一行：最新一条 */}
                {list.value.length > 0 && (() => {
                    const first = list.value[0]
                    const dt = formatDateParts(first.created_at)
                    return (
                        <div class={cls.first}>
                            <a href={`${base}news/${first.id}`} target="_blank">
                                <div class={cls.time}>
                                    <p>{dt.day}</p>
                                    <span>{dt.ym}</span>
                                </div>
                                <div class={cls.con}>
                                    <span class={cls.tit}>{first.newsName}</span>
                                    <div class={cls.sj}>
                                        <font>{dt.ymd}</font>
                                    </div>
                                    <div class={cls.txt}>{first.content}</div>
                                </div>
                            </a>
                        </div>
                    )
                })()}
                {/* 第二行：后面三条 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', minWidth: '900px' }}>
                    {list.value.slice(1, 4).map(item => {
                        const dt = formatDateParts(item.created_at)
                        return (
                            <a href={`${base}news/${item.id}`} target="_blank" style={{ textDecoration: 'none' }}>
                                <ElCard shadow="hover" style={{ overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            marginBottom: '8px',
                                            fontWeight: 500,
                                            maxWidth:'300px'
                                        }}
                                    >{item.newsName}</div>
                                    <span style={{ color: '#909399', fontWeight: 400 }}>{dt.ymd}</span>
                                </ElCard>
                            </a>
                        )
                    })}
                </div>
            </div >
        )
    },
})