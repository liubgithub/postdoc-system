import { ElForm, ElFormItem, ElInput } from 'element-plus'
import * as styles from './style.css'

export default defineComponent({
    name: 'Achievement',
    props: {
        model: {
            type: Object,
            required: true
        }
    },
    emits: ['update:model'],
    setup(props, { emit }) {
        const onInput = (key: string, value: any) => {
            emit('update:model', { ...props.model, [key]: value })
        }
        return () => (
            <div>
                <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>博士后在站期间取得的科研成果</div>
                <ElForm labelWidth="100px" labelPosition="top">
                    <div class={styles.achievementRow}>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="发表论文名称">
                                <ElInput modelValue={props.model.paper_title} onInput={val => onInput('paper_title', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="刊物名称">
                                <ElInput modelValue={props.model.journal_name} onInput={val => onInput('journal_name', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="刊物类别">
                                <ElInput modelValue={props.model.journal_type} onInput={val => onInput('journal_type', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="第一署名单位">
                                <ElInput modelValue={props.model.first_author_unit} onInput={val => onInput('first_author_unit', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="发表时间">
                                <ElInput modelValue={props.model.publish_time} onInput={val => onInput('publish_time', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="排名">
                                <ElInput modelValue={props.model.paper_rank} onInput={val => onInput('paper_rank', val)} />
                            </ElFormItem>
                        </div>
                    </div>
                    <div class={styles.achievementRow}>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="获得基金项目名称">
                                <ElInput modelValue={props.model.project_title} onInput={val => onInput('project_title', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="基金名称">
                                <ElInput modelValue={props.model.fund_name} onInput={val => onInput('fund_name', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="经费">
                                <ElInput modelValue={props.model.fund_amount} onInput={val => onInput('fund_amount', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="项目依托单位">
                                <ElInput modelValue={props.model.project_unit} onInput={val => onInput('project_unit', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="批准时间">
                                <ElInput modelValue={props.model.approval_time} onInput={val => onInput('approval_time', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="排名">
                                <ElInput modelValue={props.model.project_rank} onInput={val => onInput('project_rank', val)} />
                            </ElFormItem>
                        </div>
                    </div>
                    <div class={styles.achievementRow}>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="专利成果名称">
                                <ElInput modelValue={props.model.patent_title} onInput={val => onInput('patent_title', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="专利类型及编号">
                                <ElInput modelValue={props.model.patent_type_number} onInput={val => onInput('patent_type_number', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="产权单位">
                                <ElInput modelValue={props.model.patent_unit} onInput={val => onInput('patent_unit', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem>
                                <ElInput modelValue={props.model.patent_other} onInput={val => onInput('patent_other', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label='申报时间'>
                                <ElInput modelValue={props.model.patent_apply_time} onInput={val => onInput('patent_apply_time', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label='排名'>
                                <ElInput modelValue={props.model.patent_rank} onInput={val => onInput('patent_rank', val)} />
                            </ElFormItem>
                        </div>
                    </div>
                    <div class={styles.achievementRow}>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="获奖成果名称">
                                <ElInput modelValue={props.model.award_title} onInput={val => onInput('award_title', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label="奖励部门及等级">
                                <ElInput modelValue={props.model.award_dept_level} onInput={val => onInput('award_dept_level', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem>
                                <ElInput modelValue={props.model.award_other} onInput={val => onInput('award_other', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem>
                                <ElInput modelValue={props.model.award_other2} onInput={val => onInput('award_other2', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label='获奖时间'>
                                <ElInput modelValue={props.model.award_time} onInput={val => onInput('award_time', val)} />
                            </ElFormItem>
                        </div>
                        <div class={styles.achievementCell}>
                            <ElFormItem label='排名'>
                                <ElInput modelValue={props.model.award_rank} onInput={val => onInput('award_rank', val)} />
                            </ElFormItem>
                        </div>
                    </div>
                </ElForm>
            </div>
        )
    }
})