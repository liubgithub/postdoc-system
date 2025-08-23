import { ElButton, ElTable, ElInput, ElTableColumn } from "element-plus"
import * as cls from './style.css'

interface TableRow {
    id: number | string
    newsName: string
    releaseTime: string
    belongTo: string
}
export default defineComponent({
    name: "InformationRelease",
    setup() {
        const tableData = ref<TableRow[]>([])

        const handleAddNews = ()=>{
            
        }
        const handleAddColumn = ()=>{

        }

        const handleEdit=(row:any)=>{
            console.log(row)
        }
        const handleView=(row:any)=>{
            console.log(row)
        }
        return () => (
            <div>
                <div class={cls.searchPart}>
                    <ElButton onClick={handleAddNews}>新增新闻</ElButton>
                    <ElButton>搜索</ElButton>
                    <ElInput></ElInput>
                    <ElButton onClick={handleAddColumn}>新增专栏</ElButton>
                </div>
                <div>
                    <ElTable data={tableData.value}>
                        <ElTableColumn type="index" label="序号" width={60} />
                        <ElTableColumn prop='username' label="新闻名称">
                            {{
                                default: ({ row }: { row: TableRow }) => row.newsName || '无数据'
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop='username' label="发布时间">
                            {{
                                default: ({ row }: { row: TableRow }) => row.releaseTime || '无数据'
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop='username' label="专栏">
                            {{
                                default: ({ row }: { row: TableRow }) => row.belongTo || '无数据'
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="操作" align="center">
                            {{
                                default: ({ row }: {row: TableRow }) =>(
                                   <>
                                    <ElButton type="primary" onClick={()=>handleEdit(row)}>
                                        编辑
                                    </ElButton>
                                    <ElButton type="success" onClick={()=>handleView(row)}>
                                        查看
                                    </ElButton>
                                   </>
                                )
                            }}
                        </ElTableColumn>
                    </ElTable>
                </div>
            </div>
        )
    },
})