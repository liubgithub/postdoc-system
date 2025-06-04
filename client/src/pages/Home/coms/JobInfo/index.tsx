import type { JobInfo } from "../../demo"

import * as cls from "./styles.css"

export default defineComponent({
  name: "JobInfo",
  props: ["job"],
  setup(p: { job: JobInfo }) {
    return () => (
      <div class={cls.info}>
        <strong>研究方向：</strong><br />
        {p.job.课题组简介.研究方向.map(v => (<>{v}<br /></>))}
        <br />
        <strong>应聘条件：</strong><br />
        学历：{p.job.应聘条件.学历}<br />
        专业：{p.job.应聘条件.专业.join(" ")}<br />
        年龄：{p.job.应聘条件.年龄}<br />
        要求：
        <ul>
          {p.job.应聘条件.要求.map(v => (<li>{v}</li>))}
        </ul>
        <br />
        <a href={p.job.课题组简介.详情链接}>了解详情</a>
      </div>
    )
  }
})