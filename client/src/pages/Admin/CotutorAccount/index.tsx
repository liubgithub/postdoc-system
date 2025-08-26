import { ElButton, ElInput, ElTable, ElTableColumn } from 'element-plus'
import { ref, onMounted, defineComponent } from 'vue'
import * as cls from '../InformationRelease/style.css'
import CotutorInfor from './cotutorInfor'
import fetch from '@/api/index'

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
        const editData = ref<any>(null) // 存储编辑数据

        const handleAddCototur = () => {
            editData.value = null // 清空编辑数据
            showCotutorInfor.value = true
        }

        const handleEdit = async(row: TableRow) => {
            try{
                const res = await fetch.raw.GET('/teacherinfo/{teacher_id}',{
                    params:{
                        path:{
                            teacher_id: row.id
                        }
                    }
                })
                console.log('编辑数据:', res.data)
                editData.value = res.data // 保存编辑数据
                showCotutorInfor.value = true
            }catch(error){
                console.error('获取教师信息失败:', error)
            }
        }

        onMounted(async()=>{
            try{
                const res = await fetch.raw.GET('/teacherinfo/')
                if(res.data){
                    console.log(res.data,'www')
                    // 提取需要的字段：id、work_id、name、college
                    tableData.value = res.data.map((item: any) => ({
                        id: item.id,
                        work_id: item.work_id,
                        name: item.name,
                        college: item.college
                    }))
                }
            }catch(error){
                console.error('获取教师列表失败:', error)
            }
        })

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
                                <ElTableColumn prop='work_id' label="工号">
                                    {{
                                        default: ({ row }: { row: TableRow }) => row.work_id || '无数据'
                                    }}
                                </ElTableColumn>
                                <ElTableColumn prop='name' label="姓名">
                                    {{
                                        default: ({ row }: { row: TableRow }) => row.name || '无数据'
                                    }}
                                </ElTableColumn>
                                <ElTableColumn prop='college' label="所在学院">
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
                        <CotutorInfor 
                            onBack={() => showCotutorInfor.value = false} 
                            editData={editData.value}
                        />
                    </div>
                )}
            </div>

        )
    },
})