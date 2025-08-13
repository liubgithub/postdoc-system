import { ElInput, ElCheckboxGroup, ElCheckbox, ElCard, ElDatePicker } from 'element-plus'
import * as cls from './styles.css'
import SignaturePad from '@/units/Signature/index'
export default defineComponent({
    name: "Audit",
    props: {
        onBack: {
            type: Function,
            required: true
        },
        // 新增：当前用户角色
        userRole: {
            type: String,
            default: 'student' // student, teacher, secretary, dean, etc.
        }
    },
    setup(props) {
        const assessmentResult = ref([])
        const teacherOpinion = ref('同意招收，承诺已对申请人的思想政治、道德品质和学术性进行了考察，在资助期内提供不低于4万/年的工作津贴。')

        // 签名相关数据
        const actualTeacherSignature = ref('')
        const actualTeacherDate = ref('')
        const nominalTeacherSignature = ref('')
        const nominalTeacherDate = ref('')
        const secretaryDate = ref('')
        const deanDate = ref('')
        const stationDate = ref('')
        const hrDate = ref('')


        // 检查用户是否有编辑权限
        const canEdit = (section: string) => {
            switch (section) {
                case 'teacher':
                    return props.userRole === 'teacher';
                case 'secretary':
                    return props.userRole === 'secretary';
                case 'dean':
                    return props.userRole === 'dean';
                case 'station':
                    return props.userRole === 'station';
                case 'hr':
                    return props.userRole === 'hr';
                default:
                    return false; // 学生不能编辑任何考核意见部分
            }
        };

        const renderCard = (header: string, content: any, section: string = '') => (
            <ElCard
                class={cls.formSection}
                v-slots={{
                    header: () => <div class={cls.cardHeader}>{header}</div>,
                }}
            >
                <div class={cls.cardContent}>
                    {section === 'teacher' && canEdit('teacher') ? (
                        <>
                            <ElInput
                                v-model={teacherOpinion.value}
                                type="textarea"
                                rows={4}
                                placeholder="请输入合作导师意见"
                            />
                            {content}
                        </>
                    ) : (
                        content
                    )}
                </div>
            </ElCard>
        );

        return () => (
            <div class={cls.formContainer}>
                <div class={cls.header}>
                    <h1>博士后进站考核意见表</h1>
                </div>

                {renderCard('合作导师意见 (如有挂名导师，挂名导师和实际导师均需签字)', <>
                    {!canEdit('teacher') && <p class={cls.para}>{teacherOpinion.value}</p>}
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>实际导师签名：</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                                <div>
                                    <SignaturePad onChange={val => actualTeacherSignature.value = val} disabled={!canEdit('teacher')} />
                                    <ElDatePicker
                                        v-model={actualTeacherDate.value}
                                        type="date"
                                        placeholder="选择日期"
                                        disabled={!canEdit('teacher')}
                                        style={{ width: '300px' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class={cls.signature}>
                            <p>挂名导师签名：</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                                <div>
                                    <SignaturePad onChange={val => nominalTeacherSignature.value = val} disabled={!canEdit('teacher')} />
                                    <ElDatePicker
                                        v-model={nominalTeacherDate.value}

                                        type="date"
                                        placeholder="选择日期"
                                        style={{ width: '300px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>, 'teacher')}

                {renderCard('博士后工作秘书审核', <>
                    <p class={cls.para}>同意招收，承诺已对申请人的思想政治、道德品质和学术性进行了考察，在资助期内提供不低于4万/年的工作津贴。</p>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>审核人签名：</p>
                            <SignaturePad onChange={val => console.log(val)} disabled={!canEdit('secretary')} />
                            <ElDatePicker
                                v-model={secretaryDate.value}
                                type="date"
                                placeholder="选择日期"
                                disabled={!canEdit('secretary')}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                </>)}

                {renderCard('思想政治与道德品质、学术性考察意见 (由实际所在学院填写)', <>
                    <p class={cls.para}>思想政治与道德品质、学术性书面考察报告、海外引进人才风险评估排查表另附。</p>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>党委盖章：</p>
                            <p>党委（党总支）书记签名：</p>
                            <SignaturePad onChange={val => console.log(val)} disabled={!canEdit('dean')} />
                            <ElDatePicker
                                v-model={deanDate.value}
                                type="date"
                                placeholder="选择日期"
                                disabled={!canEdit('dean')}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                </>)}

                {renderCard('现场答辩考核组意见 (由实际所在学院填写)', <>
                    <p>考核组成员名单：</p>
                    <p>考核组意见：须体现实验记录本或工作记录本检查情况</p>
                    <p>投票结果： 同意票数<ElInput class={cls.voteInput} /> 不同意票数<ElInput class={cls.voteInput} /> 弃权票数<ElInput class={cls.voteInput} /></p>
                    <p>考核结果 (请在相应栏打"√")：
                        <ElCheckboxGroup v-model={assessmentResult.value}>
                            <ElCheckbox value="pass">通过</ElCheckbox>
                            <ElCheckbox value="fail">不通过</ElCheckbox>
                        </ElCheckboxGroup>
                    </p>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>考核组组长签字：</p>
                            <SignaturePad onChange={val => console.log(val)} disabled={!canEdit('station')} />
                            <ElDatePicker
                                v-model={deanDate.value}
                                type="date"
                                placeholder="选择日期"
                                disabled={!canEdit('dean')}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                </>)}

                {renderCard('学院党政联席会意见 (由实际所在学院填写)', <>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>院长签名：</p>
                            <SignaturePad onChange={val => console.log(val)} disabled={!canEdit('dean')} />
                            <p>党委盖章：</p>
                            <p>党委（党总支）书记签名：</p>
                            <SignaturePad onChange={val => console.log(val)} disabled={!canEdit('dean')} />
                        </div>
                    </div>
                </>)}

                {renderCard('流动站意见', <>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>流动站所在学校盖章：</p>
                            <p>负责人签名：</p>
                            <SignaturePad onChange={val => console.log(val)} disabled={!canEdit('station')} />
                            <ElDatePicker
                                v-model={stationDate.value}
                                type="date"
                                placeholder="选择日期"
                                disabled={!canEdit('station')}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                </>)}

                {renderCard('人力资源部意见', <>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>盖章：</p>
                            <SignaturePad onChange={val => console.log(val)} disabled={!canEdit('hr')} />
                            <ElDatePicker
                                v-model={hrDate.value}
                                type="date"
                                placeholder="选择日期"
                                disabled={!canEdit('hr')}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                </>)}
            </div>
        )
    }
})