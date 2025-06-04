import type { News } from "../../demo"

export default defineComponent({
  name: "NewsInfo",
  props: ["news"],
  setup(p: { news: News }) {
    return () => (
      <>
        <strong>发布时间：</strong>{p.news.发布时间}<br />
        <strong>来源：</strong>{p.news.来源}<br />
        {p.news.内容摘要}
      </>
    )
  }
})