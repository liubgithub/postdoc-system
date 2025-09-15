import { ElCard } from "element-plus"
export default defineComponent({
    name: 'BoshiZq',
    setup(props, ctx) {
        const img1 = `${import.meta.env.BASE_URL}logos/1.png`
        const img2 = `${import.meta.env.BASE_URL}logos/2.png`
        const img3 = `${import.meta.env.BASE_URL}logos/3.png`
        const img4 = `${import.meta.env.BASE_URL}logos/4.png`
        const items = [
            { img: img1, text: '中国博士后进出站系统' },
            { img: img2, text: '中国博士后科学基金' },
            { img: img3, text: '人力资源部' },
            { img: img4, text: '博士后管理系统' },
        ]
        const hoverIdx = ref<number | null>(null)
        const link = 'https://www.chinapostdoctor.org.cn/auth/login.html'
        const link2 = 'https://www.chinapostdoctor.org.cn/home'
        const link3 = 'https://rsc.hzau.edu.cn/'
        return()=>(
            <div>
                <div style={{fontSize:'28px',fontWeight:700,marginBottom:'8px'}}>博士后专区</div>
                <div style={{width:'50px',height:'4px',background:'#0d6efd',marginBottom:'16px'}}></div>
                <div>
                    {items.map((it, idx)=>{
                        const isHover = hoverIdx.value===idx
                        return (
                            <a href={link} target="_blank" rel="noopener noreferrer" 
                               onMouseenter={()=>hoverIdx.value=idx} 
                               onMouseleave={()=>hoverIdx.value=null}
                               style={{textDecoration:'none'}}>
                                <ElCard shadow="hover" style={{marginBottom:'20px',borderColor:isHover?'#165DFF':'#e4e7ed',background:'#fff'}}>
                                    <div style={{display:'flex',alignItems:'center'}}>
                                        <img src={it.img} alt={it.text} style={{marginRight:'16px'}} />
                                        <div style={{width:'1px',height:'28px',background:'#e4e7ed',marginRight:'16px'}}></div>
                                        <div style={{fontSize:'20px',fontWeight:600,color:isHover?'#165DFF':'#303133'}}>{it.text}</div>
                                    </div>
                                </ElCard>
                            </a>
                        )
                    })}
                </div>
            </div>
        )
    },
})