import { ElButton, ElInput, ElTable, ElTableColumn, ElDialog, ElMessage, ElSelect, ElOption, ElPagination } from "element-plus"
import fetch from '@/api/index'

interface TableRow {
    id: number | string
    username: string
    name: string
    applicatetime: string
    role: string
}

export default defineComponent({
    name: 'PermissionManage',

    setup() {

        const tableData = ref<TableRow[]>([])
        const loading = ref(false)

        // 角色显示映射
        const roleLabelMap: Record<string, string> = {
            user: '博士后',
            teacher: '合作导师',
            leader: '分管领导',
        }
        const toLabel = (role?: string) => role ? (roleLabelMap[role] ?? role) : '无数据'
        const roleOptions = [
            { value: 'user', label: roleLabelMap.user },
            { value: 'teacher', label: roleLabelMap.teacher },
            { value: 'leader', label: roleLabelMap.leader },
        ]

        // 编辑状态
        const editingUsername = ref<string | null>(null)
        const editingRole = ref<string>('user')

        const formatDate = (iso: string | null | undefined): string => {
            if (!iso) return '无数据'
            const splitIndex = iso.indexOf('T')
            return splitIndex > 0 ? iso.slice(0, splitIndex) : iso
        }

        const handleEdit = (row: TableRow) => {
            editingUsername.value = row.username
            editingRole.value = row.role || 'user'
        }

        const handleCancel = (row: TableRow) => {
            // 还原选择值并退出编辑
            editingRole.value = row.role || 'user'
            editingUsername.value = null
        }

        const handleConfirm = async (row: TableRow) => {
            await putPremission(row.username, editingRole.value)
        }

        const putPremission = async (username: string, role: string) => {
            try {
                const res = await fetch.raw.PUT('/users/{username}', {
                    params: {
                        path: {
                            username
                        }
                    },
                    body: {
                        role
                    }
                })
                // 本地数据同步
                const idx = tableData.value.findIndex(i => i.username === username)
                if (idx >= 0) tableData.value[idx].role = role
                ElMessage.success('权限已更新')
            } catch (error) {
                ElMessage.warning('修改失败')
                throw error
            } finally {
                editingUsername.value = null
            }
        }

        onMounted(async () => {
            try {
                loading.value = true
                const res = await fetch.raw.GET('/users/')
                const list = Array.isArray(res.data) ? res.data : []
                tableData.value = list
                    .filter(u => u?.role !== 'admin')
                    .map(u => ({
                        id: (u as any)?.id ?? '无数据',
                        username: (u as any)?.username ?? '无数据',
                        name: (u as any)?.name ?? '无数据',
                        applicatetime: formatDate((u as any)?.created_at as string),
                        // 保留后端真实值，显示时再映射
                        role: (u as any)?.role ?? ''
                    }))
            } catch (error) {
                console.log(error)
                tableData.value = []
            } finally {
                loading.value = false
            }
        })
        return () => (
            <div>
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                    <ElButton>搜索</ElButton>
                    <ElInput placeholder="请输入关键词" style={{ maxWidth: '260px' }}></ElInput>
                </div>
                <div>
                    <ElTable data={tableData.value} height="60vh" v-loading={loading.value}>
                        <ElTableColumn type="index" label="序号" width={60} />
                        <ElTableColumn prop='username' label="账号">
                            {{
                                default: ({ row }: { row: TableRow }) => row.username || '无数据'
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop='name' label="姓名">
                            {{
                                default: ({ row }: { row: TableRow }) => row.name || '无数据'
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop='applicatetime' label="账号申请时间">
                            {{
                                default: ({ row }: { row: TableRow }) => row.applicatetime || '无数据'
                            }}
                        </ElTableColumn>
                        <ElTableColumn prop='role' label="权限" minWidth={160}>
                            {{
                                default: ({ row }: { row: TableRow }) => (
                                    editingUsername.value === row.username ? (
                                        <ElSelect
                                            v-model={editingRole.value}
                                            placeholder="请选择角色"
                                            style={{ width: '140px' }}
                                        >
                                            {roleOptions.map(opt => (
                                                <ElOption label={opt.label} value={opt.value} />
                                            ))}
                                        </ElSelect>
                                    ) : (
                                        toLabel(row.role)
                                    )
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="操作" align="center" width={200}>
                            {{
                                default: ({ row }: { row: TableRow }) => (
                                    editingUsername.value === row.username ? (
                                        <>
                                            <ElButton type="primary" onClick={() => handleConfirm(row)} style={{ marginRight: '8px' }}>
                                                确认
                                            </ElButton>
                                            <ElButton onClick={() => handleCancel(row)}>
                                                取消
                                            </ElButton>
                                        </>
                                    ) : (
                                        <ElButton type="primary" onClick={() => handleEdit(row)}>
                                            编辑
                                        </ElButton>
                                    )
                                )
                            }}
                        </ElTableColumn>
                    </ElTable>
                </div>
            </div>
        )
    },
})