import { defineComponent, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElRadioGroup, ElRadio, ElDatePicker, ElMessage } from 'element-plus';


export default defineComponent({
    name: 'Assessment',
    setup() {
        // 表单数据
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


        const formRef = ref();

        // 添加/删除考核组人员
        const addStaff = () => {
            form.staff.push({ name: '', org: '', job: '', major: '', sign: '' });
        };
        const removeStaff = (index: number) => {
            if (form.staff.length > 1) form.staff.splice(index, 1);
        };

        // 提交
        const onSubmit = () => {
            formRef.value.validate((valid: boolean) => {
                if (valid) {
                    ElMessage.success('提交成功！');
                } else {
                    ElMessage.error('请检查表单内容');
                }
            });
        };

        // 返回
        const onBack = () => {
            
        };

        return () => (
            <div>
                <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>考核情况</div>
                <ElForm labelWidth="100px">
                    {/* 指导小组意见 */}
                    <div style={{ border: '1px solid #333', borderRadius: '4px', background: '#fff', padding: 0, position: 'relative', minHeight: '500px' }}>
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

                        {/* 记录本检查情况 */}
                        <div style={{ borderTop: '1px solid #333', padding: '16px' }}>


                            <ElFormItem label="须体现实验记录本或工作记录本检查情况" prop="recordCheck">
                                <ElInput type="textarea" v-model={form.recordCheck} autosize={{ minRows: 3 }} />
                            </ElFormItem>
                        </div>
                        {/* 考核组综合意见 */}
                        <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                            <ElFormItem label="考核组综合意见" prop="assessmentOpinion">
                                <ElInput type="textarea" v-model={form.assessmentOpinion} autosize={{ minRows: 4 }} />
                            </ElFormItem>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <ElFormItem label="考核组长签字(盖章)" prop="assessmentLeader">
                                    <ElInput v-model={form.assessmentLeader} />
                                </ElFormItem>
                                <ElFormItem label="日期" prop="assessmentDate">
                                    <ElDatePicker v-model={form.assessmentDate} type="date" placeholder="选择日期" style={{ width: '100%' }} />
                                </ElFormItem>
                            </div>
                            <ElFormItem label="投票情况" prop="vote">
                                <ElRadioGroup v-model={form.vote}>
                                                    <ElRadio value="优秀">优秀</ElRadio>
                <ElRadio value="良好">良好</ElRadio>
                <ElRadio value="合格">合格</ElRadio>
                <ElRadio value="不合格">不合格</ElRadio>
                                </ElRadioGroup>
                            </ElFormItem>
                        </div>

                        {/* 设站单位意见 */}
                        <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                            <ElFormItem label="设站单位意见" prop="stationOpinion">
                                <ElInput type="textarea" v-model={form.stationOpinion} autosize={{ minRows: 4 }} />
                            </ElFormItem>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <ElFormItem label="负责人签字(公章)" prop="stationLeader">
                                    <ElInput v-model={form.stationLeader} />
                                </ElFormItem>
                                <ElFormItem label="日期" prop="stationDate">
                                    <ElDatePicker v-model={form.stationDate} type="date" placeholder="选择日期" style={{ width: '100%' }} />
                                </ElFormItem>
                            </div>
                        </div>
                        {/* 操作按钮 */}
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <ElButton type="primary" onClick={onSubmit}>提交</ElButton>
                            <ElButton style={{ marginLeft: '16px' }} onClick={onBack}>返回</ElButton>
                        </div>
                    </div>
                </ElForm>
            </div>
        )
    }
})