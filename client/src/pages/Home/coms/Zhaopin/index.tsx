import { defineComponent } from 'vue';
import * as cls from '../Tongzhi/styles.css';
import { jobs, type JobInfo } from '../../demo';
import fetch from '@/api/index'

type InfoItem = {
  id: number
  newsName: string
  belongTo?: string | null
  content?: string | null
  created_at?: string | null
}
export default defineComponent({
  name: 'Zhaopin',
  setup() {
    const openNews = () => {
      // 查看更多功能实现
      console.log('查看更多招聘信息');
    };
    function formatDateParts(iso?: string | null) {
      const d = iso ? new Date(iso) : new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return { year, month, day, ym: `${year}-${month}`, ymd: `${year}-${month}-${day}` }
    }
    // 格式化研究方向为一行两个
    // const formatResearchDirections = (directions: string) => {
    //   return directions.map((direction, index) => (
    //     <span key={index}>
    //       {direction}
    //       {index % 2 === 0 && index !== directions.length - 1 ? '；' : ''}
    //       {index % 2 === 1 && index !== directions.length - 1 ? <br /> : ''}
    //     </span>
    //   ));
    // };
    const list = ref<InfoItem[]>([])

    const fetchData = async () => {
      const res = await fetch.raw.GET('/information/release')
      if (res.response.ok) {
        const data = (res.data as unknown as InfoItem[]) || []
        // 可忽略 belongTo 字段的值，但若存在则只取“通知快讯”
        const filtered = data.filter(item => !item.belongTo || item.belongTo === '招聘信息')
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
    // 只取前两个招聘信息


    return () => (
      <div>
        <div class={cls.title}>
          <div>招聘信息</div>
          <a class={cls.btn} onClick={openNews}>查看更多+</a>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {list.value.slice(0, 2).map((item, index) => {
            const dt = formatDateParts(item.created_at)
            return (
              <div class={cls.first} style={{ width: '50%' }} key={index}>
                <a href={`${base}news/${item.id}`} target="_blank">
                  <div class={cls.time}>
                    <p>{dt.day}</p>
                    <span>{dt.ym}</span>
                  </div>
                  <div class={cls.con}>
                    <span class={cls.tit}>{item.newsName}</span>
                    <div class={cls.sj}>
                      <font>{dt.ym}</font>
                    </div>
                    <div class={cls.txt}>
                      {item.content}
                    </div>
                  </div>
                </a>
              </div>
            )

          })}
        </div>
      </div>
    );
  },
});