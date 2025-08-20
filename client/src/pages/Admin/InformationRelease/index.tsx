import { ElButton, ElTable, ElInput } from "element-plus"
import * as cls from './style.css'
export default defineComponent({
    name:"InformationRelease",
    setup() {
        return()=>(
            <div>
                <div class={cls.searchPart}>
                    <ElButton>新增新闻</ElButton>
                    <ElButton>搜索</ElButton>
                    <ElInput></ElInput>
                    <ElButton>新增专栏</ElButton>
                </div>
            </div>
        )
    },
})