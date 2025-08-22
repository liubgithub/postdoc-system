import { ElButton, ElInput, ElTable, ElTableColumn } from 'element-plus'
import * as cls from '../InformationRelease/style.css'
import CotutorInfor from './cotutorInfor'

interface TableRow {
    id: number
    work_id: number
    name: string
    college: string
}
export default defineComponent({
    name: 'CotutorAccount',

    setup() {

        const showCotutorInfor = ref(false)
        const keyword = ref('')
        const tableData = ref<TableRow[]>([])

        const handleAddCototur = () => {
            showCotutorInfor.value = true
        }

        const handleEdit = (row: any) => {
            showCotutorInfor.value = true
        }
        return () => (
            <div class={cls.page}>
                {!showCotutorInfor.value && (
                    <div>
                        <div class={cls.searchPart}>
                            <ElInput v-model={keyword.value} placeholder="请输入姓名/工号" />
                            <ElButton>搜索</ElButton>
                            <ElButton type="primary" onClick={handleAddCototur}>添加</ElButton>
                        </div>
                        <div class={cls.tableBox}>
                            <ElTable data={tableData.value}>
                                <ElTableColumn type="index" label="序号" width={60} />
                                <ElTableColumn prop='username' label="工号">
                                    {{
                                        default: ({ row }: { row: TableRow }) => row.work_id || '无数据'
                                    }}
                                </ElTableColumn>
                                <ElTableColumn prop='username' label="姓名">
                                    {{
                                        default: ({ row }: { row: TableRow }) => row.name || '无数据'
                                    }}
                                </ElTableColumn>
                                <ElTableColumn prop='username' label="所在学院">
                                    {{
                                        default: ({ row }: { row: TableRow }) => row.college || '无数据'
                                    }}
                                </ElTableColumn>
                                <ElTableColumn label="操作" align="center">
                                    {{
                                        default: ({ row }: { row: TableRow }) => (
                                            <ElButton type="primary" onClick={() => handleEdit(row)}>
                                                编辑
                                            </ElButton>
                                        )
                                    }}
                                </ElTableColumn>
                            </ElTable>
                        </div>
                    </div>
                )}
                {showCotutorInfor.value && (
                    <div>
                        <CotutorInfor onBack={() => showCotutorInfor.value = false} />
                    </div>
                )}
            </div>

        )
    },
})