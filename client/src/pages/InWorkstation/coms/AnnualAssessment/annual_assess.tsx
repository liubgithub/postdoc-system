import { ElForm, ElFormItem, ElInput, ElDatePicker, ElButton } from 'element-plus'
import * as cls from '@/pages/EnterWorksation/coms/StationAssessment/styles.css.ts'
import SignaturePad from '@/units/Signature/index'
import { signature } from '@/pages/EnterWorksation/styles.css'
export default defineComponent({
    name: 'AnnualAssessment',
    props: {
        onBack: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const form = ref({
            signature:'',
            unit: '',
            station: '',
            fillDate: '',
            name: '',
            gender: '',
            political: '',
            tutor: '',
            entryDate: '',
            title: '',
            summary: '',
            selfEval: '',
            mainWork: '',
            papers: '',
            attendance: {
                sick: '',
                personal: '',
                absenteeism: '',
                leave: '',
                other: ''
            },
            unitComment: '',
            unitGrade: '',
            unitSign: '',
            unitSignDate: '',
            assessedComment: '',
            assessedSign: '',
            assessedSignDate: '',
            schoolComment: '',
            schoolSign: '',
            schoolSignDate: '',
            remark: ''
        })
        const onInput = async(val:any)=>{
            console.log
        }
        return () => (
            <div class={cls.formContainer}>
                <ElForm model={form.value} labelWidth="120px" style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                    {/* 顶部信息 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>单位：<ElInput v-model={form.value.unit} style={{ width: '120px', border: 'none' }} inputStyle={{ border: 'none', background: 'transparent' }} /></div>
                        <div>流动站名称：<ElInput v-model={form.value.station} style={{ width: '120px', border: 'none' }} inputStyle={{ border: 'none', background: 'transparent' }} /></div>
                        <div>填表日期：<ElDatePicker v-model={form.value.fillDate} type="date" placeholder="选择日期" style={{ width: '120px' }} /></div>
                    </div>
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ minWidth: '64px' }}>姓名</span>
                                <ElInput v-model={form.value.name} style={{ flex: 1, border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ minWidth: '64px' }}>性别</span>
                                <ElInput v-model={form.value.gender} style={{ flex: 1, border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ minWidth: '64px' }}>政治面貌</span>
                                <ElInput v-model={form.value.political} style={{ flex: 1, border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ minWidth: '64px' }}>合作导师</span>
                                <ElInput v-model={form.value.tutor} style={{ flex: 1, border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ minWidth: '64px' }}>进站时间</span>
                                <ElDatePicker v-model={form.value.entryDate} type="date" placeholder="选择日期" style={{ flex: 1, marginLeft: '8px' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ minWidth: '96px' }}>专业技术职称</span>
                                <ElInput v-model={form.value.title} style={{ flex: 1, border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} />
                            </div>
                        </div>
                        {/* 表单大矩形边框 */}
                        <div style={{ border: '1px solid #333', borderRadius: '4px', background: '#fff', padding: 0 }}>
                            {/* 年度总结区块（第一个区块无横线） */}
                            <div style={{ padding: '16px' }}>
                                <ElFormItem label="个人年度工作总结" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.summary} type="textarea" rows={6} autosize={{ minRows: 6 }} />
                                </ElFormItem>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                    <span>自我鉴定档次：<ElInput v-model={form.value.selfEval} style={{ width: '120px', border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} /></span>
                                    <SignaturePad onChange={val=>onInput(val)} image={form.value.signature}/>                                </div>
                            </div>
                            {/* 主要工作区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="主要工作、创造发明、成果登记" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.mainWork} type="textarea" rows={4} autosize={{ minRows: 4 }} />
                                </ElFormItem>
                            </div>
                            {/* 著作区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="著作、论文、重要技术报告及起草文件登记" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.papers} type="textarea" rows={4} autosize={{ minRows: 4 }} />
                                </ElFormItem>
                            </div>
                            {/* 出勤情况区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <span>出勤情况</span>
                                    <span>病假<ElInput v-model={form.value.attendance.sick} style={{ width: '60px', border: 'none', marginLeft: '4px' }} inputStyle={{ border: 'none', background: 'transparent' }} />天</span>
                                    <span>事假<ElInput v-model={form.value.attendance.personal} style={{ width: '60px', border: 'none', marginLeft: '4px' }} inputStyle={{ border: 'none', background: 'transparent' }} />天</span>
                                    <span>旷职<ElInput v-model={form.value.attendance.absenteeism} style={{ width: '60px', border: 'none', marginLeft: '4px' }} inputStyle={{ border: 'none', background: 'transparent' }} />天</span>
                                    <span>事假<ElInput v-model={form.value.attendance.leave} style={{ width: '60px', border: 'none', marginLeft: '4px' }} inputStyle={{ border: 'none', background: 'transparent' }} />天</span>
                                    <span>其他<ElInput v-model={form.value.attendance.other} style={{ width: '60px', border: 'none', marginLeft: '4px' }} inputStyle={{ border: 'none', background: 'transparent' }} /></span>
                                </div>
                            </div>
                            {/* 单位考核区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="单位考核结果以及评语" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.unitComment} type="textarea" rows={3} autosize={{ minRows: 3 }} />
                                </ElFormItem>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                    <span>划分档次<ElInput v-model={form.value.unitGrade} style={{ width: '120px', border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} /></span>
                                    <span>负责人签名</span>
                                    <SignaturePad />
                                    <span><ElDatePicker v-model={form.value.unitSignDate} type="date" placeholder="选择日期" style={{ width: '120px', marginLeft: '8px' }} /></span>
                                </div>
                            </div>
                            {/* 被考核人意见区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="被考核人意见" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.assessedComment} type="textarea" rows={2} autosize={{ minRows: 2 }} />
                                </ElFormItem>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                    <span>本人签名<ElInput v-model={form.value.assessedSign} style={{ width: '120px', border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} /></span>
                                    <span><ElDatePicker v-model={form.value.assessedSignDate} type="date" placeholder="选择日期" style={{ width: '120px', marginLeft: '8px' }} /></span>
                                </div>
                            </div>
                            {/* 学校审核意见区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="学校审核意见" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.schoolComment} type="textarea" rows={2} autosize={{ minRows: 2 }} />
                                </ElFormItem>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                    <span>盖章<ElInput v-model={form.value.schoolSign} style={{ width: '120px', border: 'none', marginLeft: '8px' }} inputStyle={{ border: 'none', background: 'transparent' }} /></span>
                                    <span><ElDatePicker v-model={form.value.schoolSignDate} type="date" placeholder="选择日期" style={{ width: '120px', marginLeft: '8px' }} /></span>
                                </div>
                            </div>
                            {/* 备注区块（最后一个区块） */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="备注" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.remark} type="textarea" rows={2} autosize={{ minRows: 2 }} />
                                </ElFormItem>
                            </div>
                        </div>
                    </div>
                    {/* 说明 */}
                    <div style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
                        说明：考核档次分为优秀、合格、基本合格、不合格
                    </div>
                    {/* 按钮 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                        <ElButton onClick={() => props.onBack()}>返回</ElButton>
                        <ElButton type="primary">申请</ElButton>
                    </div>
                </ElForm>
            </div>
        )
    }
})