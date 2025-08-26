import { ElForm, ElFormItem, ElInput, ElDatePicker, ElButton, ElSelect, ElOption } from 'element-plus'
import * as cls from '@/pages/EnterWorksation/coms/StationAssessment/styles.css.ts'
import SignaturePad from '@/units/Signature/index'
import fetch from '@/api/index'
export default defineComponent({
    name: 'AnnualAssessment',
    props: {
        onBack: {
            type: Function,
            required: true
        },
        showYearButtons: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const form = ref({
            signature: '',
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
        const onInput = async (val: any) => {
            form.value.signature = val
        }
        return () => (
            <div class={cls.formContainer}>
                <ElForm model={form.value} labelWidth="120px" style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                    {/* 顶部信息 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '12px' }}>
                        <ElFormItem label="单位">
                            <ElInput v-model={form.value.unit} />
                        </ElFormItem>
                        <ElFormItem label="流动站名称">
                            <ElInput v-model={form.value.station} />
                        </ElFormItem>
                        <ElFormItem label="填表日期">
                            <ElDatePicker v-model={form.value.fillDate} type="date" placeholder="选择日期" style={{ width: '160px' }} />
                        </ElFormItem>
                    </div>
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '8px' }}>
                            <ElFormItem label="姓名">
                                <ElInput v-model={form.value.name} />
                            </ElFormItem>
                            <ElFormItem label="性别">
                                <ElInput v-model={form.value.gender} />
                            </ElFormItem>
                            <ElFormItem label="政治面貌">
                                <ElSelect v-model={form.value.political} placeholder="请选择" style={{ width: '160px' }}>
                                    <ElOption label="中共党员" value="中共党员" />
                                    <ElOption label="中共预备党员" value="中共预备党员" />
                                    <ElOption label="共青团员" value="共青团员" />
                                    <ElOption label="民革党员" value="民革党员" />
                                    <ElOption label="民盟盟员" value="民盟盟员" />
                                    <ElOption label="民建会员" value="民建会员" />
                                    <ElOption label="民进会员" value="民进会员" />
                                    <ElOption label="农工党党员" value="农工党党员" />
                                    <ElOption label="致公党党员" value="致公党党员" />
                                    <ElOption label="九三学社社员" value="九三学社社员" />
                                    <ElOption label="台盟盟员" value="台盟盟员" />
                                    <ElOption label="无党派人士" value="无党派人士" />
                                    <ElOption label="群众" value="群众" />
                                </ElSelect>
                            </ElFormItem>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '12px' }}>
                            <ElFormItem label="合作导师">
                                <ElInput v-model={form.value.tutor} />
                            </ElFormItem>
                            <ElFormItem label="进站时间">
                                <ElDatePicker v-model={form.value.entryDate} type="date" placeholder="选择日期" style={{ width: '160px' }} />
                            </ElFormItem>
                            <ElFormItem label="专业技术职称">
                                <ElInput v-model={form.value.title} />
                            </ElFormItem>
                        </div>
                        {/* 表单大矩形边框 */}
                        <div style={{ border: '1px solid #333', borderRadius: '4px', background: '#fff', padding: 0 }}>
                            {/* 年度总结区块（第一个区块无横线） */}
                            <div style={{ padding: '16px' }}>
                                <ElFormItem label="个人年度工作总结">
                                    <ElInput v-model={form.value.summary} type="textarea" rows={6} autosize={{ minRows: 6 }} />
                                </ElFormItem>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px' }}>
                                    <ElFormItem label="自我鉴定档次">
                                        <ElSelect v-model={form.value.selfEval} placeholder='请选择' style={{ width: '160px' }}>
                                            <ElOption label="优秀" value="优秀" />
                                            <ElOption label="合格" value="合格" />
                                            <ElOption label="基本合格" value="基本合格" />
                                            <ElOption label="不合格" value="不合格" />
                                        </ElSelect>
                                    </ElFormItem>
                                    <ElFormItem label="本人签名" style={{ marginBottom: 0 }}>
                                        <SignaturePad mode="compact" onChange={val => onInput(val)} image={form.value.signature} />
                                    </ElFormItem>
                                </div>
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
                                <ElFormItem label="单位考核结果以及评语">
                                    <ElInput v-model={form.value.unitComment} type="textarea" rows={3} autosize={{ minRows: 3 }} disabled/>
                                </ElFormItem>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', justifyContent: 'flex-end' }}>
                                    <ElFormItem label="划分档次">
                                        <ElSelect v-model={form.value.unitGrade} placeholder='请选择' style={{ width: '160px' }} disabled>
                                            <ElOption label="优秀" value="优秀" />
                                            <ElOption label="合格" value="合格" />
                                            <ElOption label="基本合格" value="基本合格" />
                                            <ElOption label="不合格" value="不合格" />
                                        </ElSelect>
                                    </ElFormItem>
                                    <ElFormItem label="负责人签名日期">
                                        <ElDatePicker v-model={form.value.unitSignDate} type="date" placeholder="选择日期" style={{ width: '160px' }} disabled/>
                                    </ElFormItem>
                                    <ElFormItem label="负责人签名" style={{ marginBottom: 0 }}>
                                        <SignaturePad mode="compact" disabled/>
                                    </ElFormItem>
                                </div>
                            </div>
                            {/* 被考核人意见区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="被考核人意见">
                                    <ElInput v-model={form.value.assessedComment} type="textarea" rows={2} autosize={{ minRows: 2 }} />
                                </ElFormItem>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', justifyContent: 'flex-end' }}>
                                    <ElFormItem label="签名日期" >
                                        <ElDatePicker v-model={form.value.assessedSignDate} type="date" placeholder="选择日期" style={{ width: '160px' }} />
                                    </ElFormItem>
                                    <ElFormItem label="本人签名" style={{ marginBottom: 0 }}>
                                        <SignaturePad mode="compact" />
                                    </ElFormItem>
                                </div>
                            </div>
                            {/* 学校审核意见区块 */}
                            <div style={{ borderTop: '1px solid #333', padding: '16px' }}>
                                <ElFormItem label="学校审核意见" style={{ marginBottom: 0 }}>
                                    <ElInput v-model={form.value.schoolComment} type="textarea" rows={2} autosize={{ minRows: 2 }} disabled />
                                </ElFormItem>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px',justifyContent:'flex-end' }}>
                                    <span>盖章</span>
                                    <ElDatePicker v-model={form.value.schoolSignDate} type="date" placeholder="选择日期" style={{ width: '120px', marginLeft: '8px' }} disabled />
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
                    {props.showYearButtons && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                            <ElButton onClick={() => props.onBack()}>返回</ElButton>
                            <ElButton type="primary">申请</ElButton>
                        </div>
                    )}
                </ElForm>
            </div>
        )
    }
})