import UserinfoRegister from '@/pages/EnterWorksation/form.tsx'
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElDatePicker } from 'element-plus'
import * as styles from './styles.css.ts'

export default defineComponent({
    name:'OpenDetails',
    setup() {
        // 第二部分表单数据
        const projectForm = ref({
            projectName: '',
            projectSource: '',
            projectType: '',
            approvalTime: '',
            projectFee: '',
            projectTask: '',
            projectThought: ''
        })
        const form = reactive({
            guideGroupOpinion: '',
            guideGroupDate: '',
            guideGroupLeader: '',
            staff: [
                { name: '', org: '', job: '', major: '', sign: '' },
                { name: '', org: '', job: '', major: '', sign: '' },
                { name: '', org: '', job: '', major: '', sign: '' },
            ],
            recordCheck: '',
            assessmentOpinion: '',
            assessmentLeader: '',
            assessmentDate: '',
            vote: '',
            stationOpinion: '',
            stationLeader: '',
            stationDate: '',
        });
        const addStaff = () => {
            form.staff.push({ name: '', org: '', job: '', major: '', sign: '' });
        };
        const removeStaff = (index: number) => {
            if (form.staff.length > 1) form.staff.splice(index, 1);
        }
        return()=> (
            <div>
                <UserinfoRegister showOtherDescription={false} />
                {/* 第二部分 博士后研究项目情况 */}
                <div class={styles.formWrapper} style={{marginTop:'32px'}}>
                    <div style={{fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em'}}>二、博士后研究项目情况</div>
                    <ElForm model={projectForm.value} labelWidth="120px">
                        <ElFormItem label="研究项目名称">
                            <ElInput v-model={projectForm.value.projectName} />
                        </ElFormItem>
                        <div style={{display:'flex',gap:'16px'}}>
                            <ElFormItem label="项目来源" style={{flex:1}}>
                                <ElInput v-model={projectForm.value.projectSource} />
                            </ElFormItem>
                            <ElFormItem label="项目性质" style={{flex:1}}>
                                <ElInput v-model={projectForm.value.projectType} />
                            </ElFormItem>
                        </div>
                        <div style={{display:'flex',gap:'16px'}}>
                            <ElFormItem label="批准时间" style={{flex:1}}>
                                <ElInput v-model={projectForm.value.approvalTime} />
                            </ElFormItem>
                            <ElFormItem label="项目经费" style={{flex:1}}>
                                <ElInput v-model={projectForm.value.projectFee} />
                            </ElFormItem>
                        </div>
                        <ElFormItem label="研究项目任务">
                            <ElInput v-model={projectForm.value.projectTask} type="textarea" rows={4} />
                        </ElFormItem>
                        <ElFormItem label="申请者对研究项目思路">
                            <ElInput v-model={projectForm.value.projectThought} type="textarea" rows={4} />
                        </ElFormItem>
                    </ElForm>
                </div>
                {/* 第三部分 考核情况 */}
                <div class={styles.formWrapper} style={{marginTop:'32px'}}>
                    <div style={{fontWeight:'bold',fontSize:'18px',marginBottom:'16px'}}>三、考核情况</div>
                    <div style={{ padding: '16px', minHeight: '180px', borderBottom: '1px solid #666', position: 'relative' }}>
                            <ElFormItem label="指导小组意见" style={{ marginBottom: 0 }}>
                                <ElInput type="textarea" v-model={form.guideGroupOpinion} autosize={{ minRows: 5 }} />
                            </ElFormItem>
                            <div style={{ display: 'flex', gap: '16px', position: 'absolute', right: '20px', bottom: '5px' }}>
                                <ElFormItem label="指导小组负责人(合作导师)签字" prop="guideGroupLeader" labelWidth={300}>
                                    <ElInput v-model={form.guideGroupLeader} />
                                </ElFormItem>
                                <ElFormItem label="日期" prop="guideGroupDate">
                                    <ElDatePicker v-model={form.guideGroupDate} type="date" placeholder="选择日期" style={{ width: '100%' }} />
                                </ElFormItem>
                            </div>
                        </div>


                        <div style={{ borderTop: '1px solid #333', padding: '16px', display: 'flex' }}>
                            <ElFormItem label='考核组人员基本情况' style={{ marginBottom: 0 }}>

                            </ElFormItem>
                            <div>
                                <ElTable data={form.staff} border style={{ width: '100%', marginBottom: '8px' }}>
                                    <ElTableColumn prop="name" label="姓名" width="120">
                                        {{
                                            default: ({ row, $index }: { row: any; $index: number }) => <ElInput v-model={row.name} placeholder="姓名" />
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="org" label="工作单位" width="220">
                                        {{
                                            default: ({ row }: { row: any }) => <ElInput v-model={row.org} placeholder="工作单位" />
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="job" label="职务或职称" width="140">
                                        {{
                                            default: ({ row }: { row: any }) => <ElInput v-model={row.job} placeholder="职务或职称" />
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="major" label="专业及研究方向" width="240">
                                        {{
                                            default: ({ row }: { row: any }) => <ElInput v-model={row.major} placeholder="专业及研究方向" />
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn prop="sign" label="签字" width="150">
                                        {{
                                            default: ({ row }: { row: any }) => <ElInput v-model={row.sign} placeholder="签字" />
                                        }}
                                    </ElTableColumn>
                                    <ElTableColumn label="操作" width="100">
                                        {{
                                            default: ({ $index }: { $index: number }) => (
                                                <ElButton type="danger" size="small" onClick={() => removeStaff($index)} disabled={form.staff.length === 1}>删除</ElButton>
                                            )
                                        }}
                                    </ElTableColumn>
                                </ElTable>
                                <ElButton type="primary" plain onClick={addStaff} style={{ marginBottom: '16px' }}>添加人员</ElButton>
                            </div>
                        </div>
                    <div style={{display:'flex',justifyContent:'center',gap:'32px',marginTop:'24px'}}>
                        <ElButton>返回</ElButton>
                        <ElButton type="primary">导出</ElButton>
                    </div>
                </div>
            </div>
        )
    },
})