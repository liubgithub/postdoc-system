import { ElButton,ElSelect,ElInput,ElOption } from "element-plus"


export default defineComponent({
    name:'addNews',
    setup() {
        return()=>(
            <div>
                <div>
                    <div>标题</div>
                    <ElInput></ElInput>
                </div>
                <div>
                    <div>专栏</div>
                    <ElSelect>
                
                    </ElSelect>
                </div>
                <div>
                    <div>编辑内容</div>
                    <ElInput>

                    </ElInput>
                </div>
            </div>
        )
    },
})