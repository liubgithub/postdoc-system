import UserinfoRegister from '@/pages/EnterWorksation/form.tsx'
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElDatePicker, ElMessage } from 'element-plus'
import * as styles from './styles.css.ts'
import fetch from '@/api/index.ts'

export default defineComponent({
    name: 'OpenDetails',
    props: {
        onBack: {
            type: Function,
            required: true,
        },
        showAssessment: {
            type: Boolean,
            default: true,
        }
    },
    setup(props) {
        // 第二部分表单数据
        const projectForm = ref({
            project_name: '',//研究项目名称
            project_source: '',//项目来源
            project_type: '',//项目性质
            approval_time: '',//批准时间
            project_fee: '',//项目经费
            project_task: '',//研究项目任务
            project_thought: ''//申请者对研究项目思路
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
        const handleBack = () => {
            props.onBack && props.onBack()
        }

        const handleSubmit = async() => {
            console.log(projectForm.value,'sssss1')
            try {
                await fetch.raw.POST('/enterAssessment/assessment',{body:projectForm.value})
            }catch(error){
                ElMessage.error('提交失败，请稍后重试')
            }
        }
        return () => (
            <div>
                <UserinfoRegister showOtherDescription={false} showResult={false} />
                {/* 第二部分 博士后研究项目情况 */}
                <div class={styles.formWrapper} style={{ marginTop: '32px' }}>
                    <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>二、博士后研究项目情况</div>
                    <ElForm model={projectForm.value} labelWidth="120px">
                        <ElFormItem label="研究项目名称">
                            <ElInput v-model={projectForm.value.project_name} />
                        </ElFormItem>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <ElFormItem label="项目来源" style={{ flex: 1 }}>
                                <ElInput v-model={projectForm.value.project_source} />
                            </ElFormItem>
                            <ElFormItem label="项目性质" style={{ flex: 1 }}>
                                <ElInput v-model={projectForm.value.project_type} />
                            </ElFormItem>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <ElFormItem label="批准时间" style={{ flex: 1 }}>
                                <ElInput v-model={projectForm.value.approval_time} />
                            </ElFormItem>
                            <ElFormItem label="项目经费" style={{ flex: 1 }}>
                                <ElInput v-model={projectForm.value.project_fee} />
                            </ElFormItem>
                        </div>
                        <ElFormItem label="研究项目任务">
                            <ElInput v-model={projectForm.value.project_task} type="textarea" rows={4} />
                        </ElFormItem>
                        <ElFormItem label="申请者对研究项目思路">
                            <ElInput v-model={projectForm.value.project_thought} type="textarea" rows={4} />
                        </ElFormItem>
                    </ElForm>
                </div>
                {/* 第三部分 考核情况 */}
                {props.showAssessment && (
                    <div class={styles.formWrapper} style={{ marginTop: '32px' }}>
                        <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>三、考核情况</div>

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
                        <div style={{ padding: '16px', minHeight: '180px', borderTop: '1px solid #333', borderBottom: '1px solid #333', position: 'relative' }}>
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




                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '6px' }}>
                    <ElButton onClick={handleSubmit} type="primary">提交</ElButton>
                    <ElButton onClick={handleBack}>返回</ElButton>
                    <ElButton type="success">导出</ElButton>
                </div>
            </div>
        )
    },
})