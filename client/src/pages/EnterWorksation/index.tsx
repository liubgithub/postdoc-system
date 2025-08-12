import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem, ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElDialog, ElMessage } from 'element-plus'
import * as cls from "./styles.css"
import Application from "./apply"
import StationAssessment from './coms/StationAssessment'
import StationProtocol from './coms/StationProtocol'
import fetch from '@/api/index'
import { getMyProcessTypes } from '@/api/enterWorkstation'

interface TableRow {
    subject: string;
    postname: string;
    posttask: string;
    postqualification: string;
    cotutor: string;
    allitutor: string;
    remark: string;
}

// 默认菜单列表（作为fallback）
const defaultMenuList = [
    { label: "进站申请", key: "entry_application" },
    { label: "进站考核", key: "entry_assessment" },
    { label: "进站协议", key: "entry_agreement" },
]

export default defineComponent({
    name: "EnterWS",
    setup() {

        const activeMenu = ref('entry_application')
        const showApplication = ref(true)
        const menuList = ref(defaultMenuList)
        const loading = ref(false)
        
        const formData = ref({
            subject: '',
            postname: '',
            posttask: '',
            postqualification: '',
            cotutor: '',
            allitutor: '',
            remark: ''
        })
        const tableData = ref<TableRow[]>([{
            subject: '',
            postname: '',
            posttask: '',
            postqualification: '',
            cotutor: '',
            allitutor: '',
            remark: ''
        }])
        const dialogVisible = ref(false)
        const viewRow = ref<TableRow | null>(null)

        // 获取用户的process_types
        const fetchProcessTypes = async () => {
            loading.value = true
            try {
                const response = await getMyProcessTypes()
                if (response.data && response.data.process_types) {
                    // 将process_types转换为菜单格式
                    const dynamicMenuList = Object.entries(response.data.process_types).map(([key, label]) => ({
                        label: label as string,
                        key: key
                    }))
                    menuList.value = dynamicMenuList
                    
                    // 如果当前选中的菜单不在新的菜单列表中，选择第一个
                    if (!dynamicMenuList.find(item => item.key === activeMenu.value)) {
                        activeMenu.value = dynamicMenuList[0]?.key || 'entry_application'
                    }
                }
            } catch (error) {
                console.error('获取process_types失败:', error)
                ElMessage.warning('获取菜单失败，使用默认菜单')
            } finally {
                loading.value = false
            }
        }

        const handleView = (row: TableRow) => {
            viewRow.value = { ...row }
            dialogVisible.value = true
        }

        const handleApply = (row: TableRow) => {
            // TODO: Implement apply functionality
            showApplication.value = false
        }

        const handleMenuClick = (key: string) => {
            activeMenu.value = key
            console.log('选中的菜单:', key)
        }

        const handleSubmit = async () => {
            try {
                await fetch.raw.POST('/enterWorkstation/apply', { body: formData.value });
                ElMessage.success('修改成功！');
                dialogVisible.value = false;
            } catch (error) {
                ElMessage.error('提交失败！');
            }
        };

        onMounted(async () => {
            // 获取process_types
            await fetchProcessTypes()
            
            // 获取进站申请数据
            try {
                const res = await fetch.raw.GET('/enterWorkstation/apply');
                formData.value = res.data as any;
            } catch (error) {
                console.error('获取进站申请数据失败:', error)
            }
        });
        
        return () => (
            <ElContainer>
                <ElAside width="15vw">
                    <ElMenu
                        defaultActive={activeMenu.value}
                        class="el-menu-vertical"
                        onSelect={handleMenuClick}
                    >
                        {menuList.value.map(item => (
                            <ElMenuItem index={item.key}>
                                {item.label}
                            </ElMenuItem>
                        ))}
                    </ElMenu>
                </ElAside>
                <ElMain v-loading={loading.value}>
                    {activeMenu.value === 'entry_application' && (
                        showApplication.value ? (
                            <>
                                <ElTable data={tableData.value} class={cls.tableWidth}>
                                    <ElTableColumn prop="subject" label="一级学科">
                                        {{
                                            default: () => (
                                                <ElInput v-model={formData.value.subject} />
                                            )
                                        }}
                                    </ElTableColumn>

                                    <ElTableColumn prop="postname" label="岗位名称">
                                        {{
                                            default: () => (
                                                <ElInput v-model={formData.value.postname} />
                                            )
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="posttask" minWidth={120} label="岗位目标任务（拟解决的科学问题）">
                                        {{
                                            default: () => (
                                                <ElInput v-model={formData.value.posttask} />
                                            )
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="postqualification" label="岗位资格条件">
                                        {{
                                            default: () => (
                                                <ElInput v-model={formData.value.postqualification} />
                                            )
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="cotutor" label="合作导师">
                                        {{
                                            default: () => (
                                                <ElInput v-model={formData.value.cotutor} />
                                            )
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="allitutor" label="挂靠导师">
                                        {{
                                            default: () => (
                                                <ElInput v-model={formData.value.allitutor} />
                                            )
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="remark" label="备注">
                                        {{
                                            default: () => (
                                                <ElInput v-model={formData.value.remark} />
                                            )
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn label="操作" align="center">
                                        {{
                                            default: ({ row }: { row: TableRow }) => (
                                                <>
                                                    <ElButton type="primary" size="small" onClick={() => handleApply(row)}>
                                                        申请
                                                    </ElButton>
                                                    <ElButton type="info" size="small" onClick={() => handleView(row)}>
                                                        查看
                                                    </ElButton>
                                                </>
                                            )
                                        }}
                                    </ElTableColumn>
                                </ElTable>
                                <ElDialog
                                    v-model={dialogVisible.value}
                                    title="查看详情"
                                    width="90%"
                                    style={{ maxWidth: '70vw', maxHeight: '80vh' }}
                                    onClose={() => (dialogVisible.value = false)}
                                >
                                    {viewRow.value && (
                                        <ElTable data={[formData.value]} class={cls.tableWidth} style={{ marginBottom: '24px' }}>
                                            <ElTableColumn prop="subject" label="一级学科">
                                                {{
                                                    default: ({ row }: { row: TableRow }) => (
                                                        <ElInput modelValue={row.subject} readonly style={{ height: '338px', fontSize: '16px' }} />
                                                    )
                                                }}
                                            </ElTableColumn>
                                            <ElTableColumn prop="postname" label="岗位名称">
                                                {{
                                                    default: ({ row }: { row: TableRow }) => (
                                                        <ElInput modelValue={row.postname} readonly style={{ height: '338px', fontSize: '16px' }} />
                                                    )
                                                }}
                                            </ElTableColumn>
                                            <ElTableColumn prop="posttask" label="岗位目标任务（拟解决的科学问题）" minWidth={120}>
                                                {{
                                                    default: ({ row }: { row: TableRow }) => (
                                                        <ElInput modelValue={row.posttask} readonly style={{ height: '338px', fontSize: '16px' }} />
                                                    )
                                                }}
                                            </ElTableColumn>
                                            <ElTableColumn prop="postqualification" label="岗位资格条件">
                                                {{
                                                    default: ({ row }: { row: TableRow }) => (
                                                        <ElInput modelValue={row.postqualification} readonly style={{ height: '338px', fontSize: '16px' }} />
                                                    )
                                                }}
                                            </ElTableColumn>
                                            <ElTableColumn prop="cotutor" label="合作导师">
                                                {{
                                                    default: ({ row }: { row: TableRow }) => (
                                                        <ElInput modelValue={row.cotutor} readonly style={{ height: '338px', fontSize: '16px' }} />
                                                    )
                                                }}
                                            </ElTableColumn>
                                            <ElTableColumn prop="allitutor" label="挂靠导师">
                                                {{
                                                    default: ({ row }: { row: TableRow }) => (
                                                        <ElInput modelValue={row.allitutor} readonly style={{ height: '338px', fontSize: '16px' }} />
                                                    )
                                                }}
                                            </ElTableColumn>
                                            <ElTableColumn prop="remark" label="备注">
                                                {{
                                                    default: ({ row }: { row: TableRow }) => (
                                                        <ElInput modelValue={row.remark} readonly style={{ height: '338px', fontSize: '16px' }} />
                                                    )
                                                }}
                                            </ElTableColumn>
                                        </ElTable>
                                    )}
                                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                        <ElButton type="primary" size="large" style={{ fontSize: '20px', padding: '12px 48px' }} onClick={handleSubmit}>
                                            确认提交
                                        </ElButton>
                                    </div>
                                </ElDialog>
                            </>
                        ) : (
                            <Application onBack={() => { showApplication.value = true }} onSubmitSuccess={() => { showApplication.value = true }} />
                        )
                    )}
                    {activeMenu.value === 'entry_assessment' && <StationAssessment />}
                    {activeMenu.value === 'entry_agreement' && <StationProtocol />}
                </ElMain>

            </ElContainer>
        )
    }
})