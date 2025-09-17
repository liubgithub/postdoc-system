import { ElCard } from "element-plus"
import * as cls from '../Tongzhi/styles.css'
export default defineComponent({
    name: 'BoshiZq',
    setup(props, ctx) {
        const img1 = `${import.meta.env.BASE_URL}logos/1.png`
        const img2 = `${import.meta.env.BASE_URL}logos/2.png`
        const img3 = `${import.meta.env.BASE_URL}logos/3.png`
        const img4 = `${import.meta.env.BASE_URL}logos/4.png`
        const imga1 = `${import.meta.env.BASE_URL}logos/a1.png`
        const imga2 = `${import.meta.env.BASE_URL}logos/a2.png`
        const imga3 = `${import.meta.env.BASE_URL}logos/a3.png`
        const imga4 = `${import.meta.env.BASE_URL}logos/a4.png`

        const hoverIdx = ref<number | null>(null)
        const link1 = 'https://www.chinapostdoctor.org.cn/auth/login.html'
        const link2 = 'https://www.chinapostdoctor.org.cn/home'
        const link3 = 'https://rsc.hzau.edu.cn/'
        const link4 = `${window.location.origin}/auth/login`
        const items = [
            { link: link1, img1: img1, img2: imga1, text: '中国博士后进出站系统' },
            { link: link2, img1: img2, img2: imga2, text: '中国博士后科学基金' },
            { link: link3, img1: img3, img2: imga3, text: '人力资源部' },
            { link: link4, img1: img4, img2: imga4, text: '博士后管理系统' },
        ]
        return () => (
            <div style={{minWidth:'320px'}}>
                <div class={cls.title}>
                    <div>博士后专区</div>
                </div>
                <div>
                    {items.map((it, idx) => {
                        const isHover = hoverIdx.value === idx
                        return (
                            <a href={it.link} target="_blank" rel="noopener noreferrer"
                                onMouseenter={() => hoverIdx.value = idx}
                                onMouseleave={() => hoverIdx.value = null}
                                style={{ textDecoration: 'none' }}>
                                <ElCard shadow="hover" style={{
                                    marginBottom: '20px',
                                    borderColor: isHover ? '#165DFF' : '#e4e7ed',
                                    background: isHover ? '#004EA1' : '#fff'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={isHover ? it.img2 : it.img1} alt={it.text} style={{ marginRight: '16px' }} />
                                        <div style={{ width: '1px', height: '28px', background: '#e4e7ed', marginRight: '16px' }}></div>
                                        <div style={{ fontSize: '20px', fontWeight: 600, color: isHover ? '#FFF7FC' : '#0061A7' }}>{it.text}</div>
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