
import { defineComponent, ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadio, ElRadioGroup, ElCheckbox, ElCheckboxGroup, ElButton, ElTable, ElTableColumn, ElDatePicker, ElUpload } from 'element-plus'
import * as cls from './style.css'
import fetch from '@/api/index'
import SignaturePad from '@/units/Signature/index'

export default defineComponent({
    name: 'ExtensionAssessment',
    props: {
        onBack: {
            type: Function as () => any,
            required: true,
        },
        externalData: {
            type: Object as () => any,
            default: () => ({})
        },
        showExtensionButtons: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        // 基础信息表单数据
        const basicInfo = ref({
            name: '',
            nationality: '',
            gender: '',
            birthDate: '',
            researchDirection: '',
            entryDate: '',
            doctoralSupervisor: '',
            postdocSupervisor: '',
            agreementDate: '',
            hasExtensionBefore: false,
            extensionTimes: 0,
            extensionFunding:'',
            extensionDuration: [] as string[],
            applicationContent: ''
        })

        // 延期信息表单数据
        const extensionInfo = ref({
            researchProgress: '',//主持或参与科研项目情况
            academicAchievements: '',//发表学术成果情况
            patents: '',//授权专利、科技成果转让情况
            consultationReports: '',//咨询报告采纳与批示情况
            researchBrief: '',//科研工作简述
            extensionPlan: '',//延期工作内容，预期研究成果
        })

        // 如果有外部数据，使用外部数据初始化表单
        if (props.externalData && Object.keys(props.externalData).length > 0) {
            if (props.externalData.basicInfo) {
                basicInfo.value = { ...basicInfo.value, ...props.externalData.basicInfo };
            }
            if (props.externalData.extensionInfo) {
                extensionInfo.value = { ...extensionInfo.value, ...props.externalData.extensionInfo };
            }
        }

        // 延期时间选项
        const extensionOptions = [
            { label: '半年', value: '0.5' },
            { label: '1年', value: '1' },
            { label: '1.5年', value: '1.5' },
            { label: '2年', value: '2' }
        ]

        // 提交表单
        const submitForm = () => {
            console.log('提交延期申请', { basicInfo: basicInfo.value, extensionInfo: extensionInfo.value })
        }

        return () => (
            <div class={cls.extensionAssessmentContainer}>
                <div class={cls.pageHeader}>
                    <h2 class={cls.pageTitle}>延期申请评估</h2>
                </div>

                {/* 基础信息表格 */}
                <div class={cls.section}>
                    <h3 class={cls.sectionTitle}>基础信息</h3>
                    <ElForm model={basicInfo.value} labelWidth="120px" class={cls.basicInfoForm}>
                        <div class={cls.formRow}>
                            <ElFormItem label="姓名">
                                <ElInput v-model={basicInfo.value.name} placeholder="请输入姓名" />
                            </ElFormItem>
                            <ElFormItem label="国籍">
                                <ElInput v-model={basicInfo.value.nationality} placeholder="请输入国籍" />
                            </ElFormItem>
                            <ElFormItem label="研究方向">
                                <ElInput v-model={basicInfo.value.researchDirection} placeholder="请输入研究方向" />
                            </ElFormItem>
                        </div>

                        <div class={cls.formRow}>
                            <ElFormItem label="性别">
                                <ElRadioGroup v-model={basicInfo.value.gender}>
                                    <ElRadio value="男">男</ElRadio>
                                    <ElRadio value="女">女</ElRadio>
                                </ElRadioGroup>
                            </ElFormItem>
                            <ElFormItem label="出生年月">
                                <ElDatePicker
                                    v-model={basicInfo.value.birthDate}
                                    type="date"
                                    placeholder="选择出生日期"
                                    format="YYYY-MM-DD"
                                    valueFormat="YYYY-MM-DD"
                                />
                            </ElFormItem>
                            <ElFormItem label="进站时间">
                                <ElDatePicker
                                    v-model={basicInfo.value.entryDate}
                                    type="date"
                                    placeholder="选择进站时间"
                                    format="YYYY-MM-DD"
                                    valueFormat="YYYY-MM-DD"
                                />
                            </ElFormItem>
                        </div>

                        <div class={cls.formRow}>
                            <ElFormItem label="博士导师">
                                <ElInput v-model={basicInfo.value.doctoralSupervisor} placeholder="请输入博士导师姓名" />
                            </ElFormItem>
                            <ElFormItem label="博士后合作导师">
                                <ElInput v-model={basicInfo.value.postdocSupervisor} placeholder="请输入博士后合作导师姓名" />
                            </ElFormItem>
                            <ElFormItem label="协议时间">
                                <ElDatePicker
                                    v-model={basicInfo.value.agreementDate}
                                    type="date"
                                    placeholder="选择协议时间"
                                    format="YYYY-MM-DD"
                                    valueFormat="YYYY-MM-DD"
                                />
                            </ElFormItem>
                        </div>

                        <div class={cls.formRow}>
                            <ElFormItem label="之前是否获批延期资助">
                                <ElRadioGroup v-model={basicInfo.value.hasExtensionBefore}>
                                    <ElRadio value={true}>
                                        是 (已延期 {basicInfo.value.extensionTimes} 次)
                                    </ElRadio>
                                    <ElRadio value={false}>否</ElRadio>
                                </ElRadioGroup>
                            </ElFormItem>
                            <ElFormItem label="延期资助时间">
                                <ElInput v-model={basicInfo.value.extensionFunding} placeholder="请输入延期资助时间" />
                            </ElFormItem>
                            <ElFormItem label="申请内容">
                                <ElInput v-model={basicInfo.value.applicationContent} placeholder="请输入申请内容" />
                            </ElFormItem>
                        </div>

                        <div>
                            <ElFormItem label="延期时间">
                                <ElCheckboxGroup v-model={basicInfo.value.extensionDuration}>
                                    {extensionOptions.map(option => (
                                        <ElCheckbox value={option.value} key={option.value}>
                                            {option.label}
                                        </ElCheckbox>
                                    ))}
                                </ElCheckboxGroup>
                            </ElFormItem>
                        </div>
                    </ElForm>
                </div>

                {/* 延期信息表单 */}
                <div class={cls.section}>
                    <h3 class={cls.sectionTitle}>延期信息</h3>
                    <ElForm model={extensionInfo.value} labelWidth="120px" class={cls.extensionInfoForm}>
                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>一、科研工作进展</h4>

                            <div class={cls.subsection}>
                                <h5 class={cls.subsectionTitle}>(一) 主持或参与科研项目情况</h5>
                                <ElFormItem>
                                    <ElInput
                                        type="textarea"
                                        v-model={extensionInfo.value.researchProgress}
                                        rows={4}
                                        placeholder="请填写主持或参与的科研项目情况"
                                    />
                                </ElFormItem>
                            </div>

                            <div class={cls.subsection}>
                                <h5 class={cls.subsectionTitle}>(二) 发表学术成果情况</h5>
                                <p class={cls.instruction}>
                                    请按重要性顺序填写期间发表的学术成果，分类填写：论文请说明题目、全部作者、发表年份、期刊、卷期、页码等。共同第一作者用#标记；通讯作者用*标记。专著请说明作者姓名、书名、出版地、出版社、出版时间等。国际学术会议报告、特邀报告请说明题目、会议名称、时间、报告类型等。
                                </p>
                                <ElFormItem>
                                    <ElInput
                                        type="textarea"
                                        v-model={extensionInfo.value.academicAchievements}
                                        rows={6}
                                        placeholder="请填写学术成果情况"
                                    />
                                </ElFormItem>
                            </div>

                            <div class={cls.subsection}>
                                <h5 class={cls.subsectionTitle}>(三) 授权专利、科技成果转让情况</h5>
                                <p class={cls.instruction}>
                                    专利请说明名称、专利号、专利类型、批准时间、授权国家、本人作为专利权人排序、转让情况等。新品种、新产品、新技术请说明名称、本人作为贡献者排序、转让情况等。
                                </p>
                                <ElFormItem>
                                    <ElInput
                                        type="textarea"
                                        v-model={extensionInfo.value.patents}
                                        rows={4}
                                        placeholder="请填写专利和科技成果转让情况"
                                    />
                                </ElFormItem>
                            </div>

                            <div class={cls.subsection}>
                                <h5 class={cls.subsectionTitle}>(四) 咨询报告采纳与批示情况</h5>
                                <p class={cls.instruction}>
                                    请说明报告题目、采纳单位/批示人、批示人职务、采纳/批示时间、本人作为贡献者排序等。
                                </p>
                                <ElFormItem>
                                    <ElInput
                                        type="textarea"
                                        v-model={extensionInfo.value.consultationReports}
                                        rows={4}
                                        placeholder="请填写咨询报告采纳与批示情况"
                                    />
                                </ElFormItem>
                            </div>
                        </div>

                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>二、其他科研成果、科研获奖、社会服务情况等</h4>
                            <div class={cls.subsection}>
                                <h5 class={cls.subsectionTitle}>科研工作简述 (不超过500字)</h5>
                                <p class={cls.instruction}>本人博后期间的科研工作内容主要包括：</p>
                                <ElFormItem>
                                    <ElInput
                                        type="textarea"
                                        v-model={extensionInfo.value.researchBrief}
                                        rows={6}
                                        maxlength={500}
                                        showWordLimit={true}
                                        placeholder="请简述科研工作内容"
                                    />
                                </ElFormItem>
                            </div>
                        </div>

                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>三、延期工作设想 (申请延期者填写)</h4>
                            <div class={cls.subsection}>
                                <h5 class={cls.subsectionTitle}>延期工作内容，预期研究成果</h5>
                                <ElFormItem>
                                    <ElInput
                                        type="textarea"
                                        v-model={extensionInfo.value.extensionPlan}
                                        rows={6}
                                        placeholder="请填写延期工作内容和预期研究成果"
                                    />
                                </ElFormItem>
                            </div>
                        </div>

                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>四、本人确认</h4>
                            <div class={cls.confirmationSection}>
                                <p class={cls.confirmationText}>
                                    本人确认本报告填写的所有内容均客观真实，符合学术道德与行为规范要求，如有任何虚假情况，本人愿意承担相应后果。
                                </p>
                                <div class={cls.signatureSection}>
                                    <ElFormItem label="姓名(签名)">
                                        <SignaturePad />
                                    </ElFormItem>
                                </div>
                            </div>
                        </div>
                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>五、合作导师意见</h4>
                            <div class={cls.confirmationSection}>
                                <p class={cls.confirmationText}>
                                    是否同意博士后申请内容，如同意博士后申请延期资助，承诺在站时长不超过4年的延期资助期内，提供不低于6万/年的资助额度；若在站时长超过4年，则原有学校负责薪酬部分由导师全额承担（如有挂名导师，挂名导师和实际导师均需签字）。同意学校从*****（项目负责人）的经费账号********划拨**万资助额度。
                                </p>
                                <div class={cls.signatureSection}>
                                    <ElFormItem label="姓名(签名)">
                                        <SignaturePad />
                                    </ElFormItem>
                                </div>
                            </div>
                        </div>
                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>六、考核小组意见</h4>
                            <div class={cls.confirmationSection}>
                                <div class={cls.kaohe}>
                                    <p>考核小组成员名单</p>
                                    <ElInput></ElInput>
                                </div>
                                <div>
                                    <p class={cls.confirmationText}>
                                        考核组意见：须体现实验记录本或工作记录本检查情况，研究进展情况和发展潜力情况。
                                    </p>
                                    <ElInput
                                        type="textarea"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                <p class={cls.confirmationText}>
                                        建议结果：按实际票数填写。
                                </p>
                                </div>
                            </div>
                        </div>
                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>七、学院（流动站）审核意见</h4>
                            <div class={cls.confirmationSection}>
                                <p class={cls.confirmationText}>
                                是否同意博士后申请延期资助，承诺在资助期内提供包括相应支持措施。
                                </p>
                                <div class={cls.signatureSection}>
                                    <ElFormItem label="学院（流动站）负责人(签名)">
                                        <SignaturePad />
                                    </ElFormItem>
                                </div>
                            </div>
                        </div>
                        <div class={cls.formSection}>
                            <h4 class={cls.formSectionTitle}>八、学校意见</h4>
                            <div class={cls.confirmationSection}>
            
                            </div>
                        </div>
                    </ElForm>
                </div>

                {/* 底部按钮 */}
                {props.showExtensionButtons && (
                    <div class={cls.bottomButtons}>
                        <ElButton onClick={props.onBack}>返回</ElButton>
                        <ElButton type="primary" onClick={submitForm}>申请</ElButton>
                    </div>
                )}
            </div>
        )
    },
})