import { defineComponent } from "vue"
import { ElButton, ElCard } from "element-plus"

import { jobs, news } from "./demo"

import JobInfo from "./coms/JobInfo"
import NewsInfo from "./coms/NewsInfo"
import * as cls from "./styles.css"

export default defineComponent({
  name: "Home",
  setup() {
    return () => (
      <div class={cls.page}>
        <div class={cls.jobs}>
          <div class={cls.jobs_title}>招聘信息</div>
          <div class={cls.jobs_title_line}></div>
          <div class={cls.job_cards}>
            {jobs.map(job => (
              <ElCard shadow="hover" class={cls.job_card}>
                {{
                  header: () => (
                    <strong>{job.课题组简介.平台}</strong>
                  ),
                  default: () => (
                    <JobInfo job={job} />
                  ),
                }}
              </ElCard>
            ))}
          </div>
        </div>
        <div class={cls.news}>
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
        </div>
      </div>
    )
  }
})