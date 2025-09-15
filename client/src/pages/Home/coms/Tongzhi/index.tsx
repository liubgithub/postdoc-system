import fetch from '@/api/index'
import { ElCard } from 'element-plus'

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
    name:'tongzhi',
    setup() {
        const list = ref<InfoItem[]>([])

        const fetchData = async () => {
            const res = await fetch.raw.GET('/information/release')
            if(res.response.ok){
                const data = (res.data as unknown as InfoItem[]) || []
                // 可忽略 belongTo 字段的值，但若存在则只取“通知快讯”
                const filtered = data.filter(item => !item.belongTo || item.belongTo === '通知快讯')
                filtered.sort((a,b)=>{
                    const ta = new Date(a.created_at || 0).getTime()
                    const tb = new Date(b.created_at || 0).getTime()
                    return tb - ta
                })
                list.value = filtered
            }
        }

        onMounted(fetchData)

        return()=>(
            <div style={{marginTop:'16px'}}>
                <div style={{fontSize:'28px',fontWeight:700,marginBottom:'8px'}}>通知快讯</div>
                <div style={{width:'50px',height:'4px',background:'#0d6efd',marginBottom:'16px'}}></div>
                {/* 第一行：最新一条 */}
                {list.value.length>0 && (()=>{
                    const first = list.value[0]
                    const dt = formatDateParts(first.created_at)
                    return (
                        <ElCard shadow="hover" style={{marginBottom:'16px'}}>
                            <div style={{display:'flex',alignItems:'stretch'}}>
                                <div style={{width:'140px',background:'#165DFF',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'16px 0'}}>
                                    <div style={{fontSize:'56px',fontWeight:800,lineHeight:1}}>{dt.day}</div>
                                    <div style={{marginTop:'8px',opacity:0.9}}>{dt.ym}</div>
                                </div>
                                <div style={{flex:1,padding:'16px 20px'}}>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <div style={{fontSize:'22px',fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{first.newsName}</div>
                                        <div style={{color:'#909399'}}>{dt.ymd}</div>
                                    </div>
                                    <div style={{marginTop:'12px',color:'#606266'}}>{first.content}</div>
                                </div>
                            </div>
                        </ElCard>
                    )
                })()}
                {/* 第二行：后面三条 */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
                    {list.value.slice(1,4).map(item=>{
                        const dt = formatDateParts(item.created_at)
                        return (
                            <ElCard shadow="hover">
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px',fontWeight:700}}>{item.newsName}<span style={{color:'#909399',fontWeight:400}}>{dt.ymd}</span></div>
                                <div style={{color:'#606266'}}>{item.content}</div>
                            </ElCard>
                        )
                    })}
                </div>
            </div>
        )
    },
})