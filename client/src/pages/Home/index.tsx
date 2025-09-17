import { defineComponent } from "vue"

// import NewsInfo from "./coms/NewsInfo"
import Carousel from "./Carousel"
import Tongzhi from "./coms/Tongzhi"
import BoshiZq from "./coms/BoshiZq"
import Zhaopin from "./coms/Zhaopin"
import BoshiFC from "./coms/Fengcai"
import CommonProblem from "./coms/CommonProblem"


import * as cls from "./styles.css"

export default defineComponent({
  name: "Home",
  setup() {
    const carouselImages = Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      imageUrl: `${import.meta.env.BASE_URL}images/${index + 1}.jpg`,
      title: `华农 ${index + 1}`,
      description: `这是第 ${index + 1} 张华农相关信息`
    }))
    return () => (
      <div class={cls.page}>
        <div>
          <Carousel items={carouselImages} autoplay={true} />
        </div>
        <div class={cls.part}>
          <Tongzhi />
          <BoshiZq />
        </div>
        <div class={cls.part2}>
          <Zhaopin />
        </div>
        <div class={cls.part3}>
          <div class={cls.part3left}>
            <BoshiFC />
          </div>
          <div class={cls.part3right}>
            <CommonProblem />
          </div>
        </div>

        {/* <div class={cls.news}>
          <div class={cls.jobs_title}>新闻动态</div>
          <div class={cls.jobs_title_line}></div>
          <div class={cls.news_cards}>
            {news.map(news => (
              <ElCard shadow="hover">
                {{
                  header: () => (
                    <>{news.标题}</>
                  ),
                  default: () => (
                    <NewsInfo news={news} />
                  ),
                }}
              </ElCard>
            ))}
          </div>
        </div> */}

      </div>
    )
  }
})