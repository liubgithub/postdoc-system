import { ElCard } from "element-plus"

import { jobs, news } from "./demo"

import * as cls from "./styles.css"

export default defineComponent({
  name: "Home",
  setup() {
    return () => (
      <div class={cls.page}>
        <ElCard class={cls.card}>
          {{
            header: () => (
              <strong>招聘信息</strong>
            ),
            default: () => (
              <div class={cls.card_content}>
                {jobs.map(job => (
                  <ElCard shadow="hover">
                    {{
                      header: () => (
                        <>{job.课题组简介.平台}</>
                      ),
                      default: () => (
                        <>
                          <strong>研究方向：</strong><br/>
                          {job.课题组简介.研究方向.map(v => (<>{v}<br/></>))}
                          <br/>
                          <strong>应聘条件：</strong><br/>
                          学历：{job.应聘条件.学历}<br/>
                          专业：{job.应聘条件.专业.join(" ")}<br/>
                          年龄：{job.应聘条件.年龄}<br/>
                          要求：
                          <ul>
                          {job.应聘条件.要求.map(v => (<li>{v}</li>))}
                          </ul>
                          <br/>
                          <a href={job.课题组简介.详情链接}>了解详情</a>
                        </>
                      ),
                    }}
                  </ElCard>
                ))}
              </div>
            ),
          }}
        </ElCard>
        <ElCard class={cls.card}>
          {{
            header: () => (
              <strong>新闻动态</strong>
            ),
            default: () => (
              <div class={cls.card_content}>
                {news.map(news => (
                  <ElCard shadow="hover">
                    {{
                      header: () => (
                        <>{news.标题}</>
                      ),
                      default: () => (
                        <>
                          <strong>发布时间：</strong>{news.发布时间}<br/>
                          <strong>来源：</strong>{news.来源}<br/>
                          {news.内容摘要}
                        </>
                      ),
                    }}
                  </ElCard>
                ))}
              </div>
            ),
          }}
        </ElCard>
      </div>
    )
  }
})