import { ElInput, ElCheckboxGroup, ElCheckbox, ElCard,ElDatePicker } from 'element-plus'
import * as cls from './styles.css'
import SignaturePad from '@/units/Signature/index'
export default defineComponent({
    name: "OpenDetails",
    props: {
        onBack: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const assessmentResult = ref('')
        const renderCard = (header: string, content: any) => (
            <ElCard
                class={cls.formSection}
                v-slots={{
                    header: () => <div class={cls.cardHeader}>{header}</div>,
                }}
            >
                <div class={cls.cardContent}>{content}</div>
            </ElCard>
        );

        return () => (
            <div class={cls.formContainer}>
                <div class={cls.header}>
                    <h1>博士后进站考核意见表</h1>
                </div>

                {renderCard('合作导师意见 (如有挂名导师，挂名导师和实际导师均需签字)', <>
                    <p class={cls.para}>同意招收，承诺已对申请人的思想政治、道德品质和学术性进行了考察，在资助期内提供不低于4万/年的工作津贴。</p>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>实际导师签名：</p>
                            
                        </div>
                        <div class={cls.signature}>
                            <p>挂名导师签名：</p>
                            
                        </div>
                    </div>
                </>)}

                {renderCard('博士后工作秘书审核', <>
                    <p class={cls.para}>同意招收，承诺已对申请人的思想政治、道德品质和学术性进行了考察，在资助期内提供不低于4万/年的工作津贴。</p>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>审核人签名：</p>
                            
                        </div>
                    </div>
                </>)}

                {renderCard('思想政治与道德品质、学术性考察意见 (由实际所在学院填写)', <>
                    <p class={cls.para}>思想政治与道德品质、学术性书面考察报告、海外引进人才风险评估排查表另附。</p>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>党委盖章：</p>
                            <p>党委（党总支）书记签名：</p>
                           
                        </div>
                    </div>
                </>)}

                {renderCard('现场答辩考核组意见 (由实际所在学院填写)', <>
                    <p>考核组成员名单：</p>
                    <p>考核组意见：须体现实验记录本或工作记录本检查情况</p>
                    <p>投票结果： 同意票数<ElInput class={cls.voteInput} /> 不同意票数<ElInput class={cls.voteInput} /> 弃权票数<ElInput class={cls.voteInput} /></p>
                    <p>考核结果 (请在相应栏打"√")：
                        <ElCheckboxGroup v-model={assessmentResult.value}>
                            <ElCheckbox label="pass">通过</ElCheckbox>
                            <ElCheckbox label="fail">不通过</ElCheckbox>
                        </ElCheckboxGroup>
                    </p>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>考核组组长签字：</p>
                            
                        </div>
                    </div>
                </>)}

                {renderCard('学院党政联席会意见 (由实际所在学院填写)', <>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>院长签名：</p>
                           
                            <p>党委盖章：</p>
                            <p>党委（党总支）书记签名：</p>
                            
                        </div>
                    </div>
                </>)}

                {renderCard('流动站意见', <>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>流动站所在学校盖章：</p>
                            <p>负责人签名：</p>
                            <p>年 月 日</p>
                        </div>
                    </div>
                </>)}

                {renderCard('人力资源部意见', <>
                    <div class={cls.signatureWrapper}>
                        <div class={cls.signature}>
                            <p>盖章：</p>
                            <p>年 月 日</p>
                        </div>
                    </div>
                </>)}
            </div>
        )
    }
})