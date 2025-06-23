import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn, ElInput, ElButton, ElDatePicker } from "element-plus";
import * as styles from "../../styles.css.ts";

const columns = [
  { label: "序号", prop: "id" },
  { label: "学号", prop: "stuId" },
  { label: "会议编号", prop: "confId" },
  { label: "会议名称", prop: "confName" },
  { label: "是否境外", prop: "isAbroad" },
  { label: "会议地点", prop: "location" },
  { label: "会议起始日期", prop: "startDate" },
  { label: "会议终止日期", prop: "endDate" },
  { label: "会议等级", prop: "level" },
  { label: "会议举办形式", prop: "form" },
  { label: "主办单位", prop: "hostOrg" },
  { label: "举办单位", prop: "org" },
  { label: "会议人数", prop: "attendeeNum" },
  { label: "联系人电话", prop: "contact" },
  { label: "会议报告", prop: "report" },
  { label: "备注", prop: "remark" },
];

export default defineComponent({
  name: "ConferenceForm",
  props: {
    onBack: { type: Function, required: false }
  },
  setup(props) {
    const tableData = ref([
      {
        id: 1,
        stuId: "",
        confId: "",
        confName: "",
        isAbroad: "",
        location: "",
        startDate: "",
        endDate: "",
        level: "",
        form: "",
        hostOrg: "",
        org: "",
        attendeeNum: "",
        contact: "",
        report: "",
        remark: ""
      }
    ]);

    const handleAdd = () => {
      tableData.value.push({
        id: tableData.value.length + 1,
        stuId: "",
        confId: "",
        confName: "",
        isAbroad: "",
        location: "",
        startDate: "",
        endDate: "",
        level: "",
        form: "",
        hostOrg: "",
        org: "",
        attendeeNum: "",
        contact: "",
        report: "",
        remark: ""
      });
    };

    return () => (
      <div>
        <div style={{ marginBottom: '1em' }}>
          <ElButton type="primary" size="small" onClick={handleAdd}>添加</ElButton>
        </div>
        <ElTable data={tableData.value} style={{ width: '100%' }} header-cell-style={{ textAlign: 'center' }} cell-style={{ textAlign: 'center' }}>
          {columns.map(col => (
            <ElTableColumn
              label={col.label}
              prop={col.prop}
              v-slots={col.prop === 'startDate' || col.prop === 'endDate' ? {
                default: ({ row }: any) => (
                  <ElDatePicker v-model={row[col.prop]} type="date" placeholder={col.label} style={{ width: '120px' }} />
                )
              } : {
                default: ({ row }: any) => (
                  <ElInput v-model={row[col.prop]} placeholder={col.label} />
                )
              }}
            />
          ))}
          <ElTableColumn label="操作" width="100">
            {{
              default: ({ row }: any) => (
                <ElButton type="primary" size="small">编辑</ElButton>
              )
            }}
          </ElTableColumn>
        </ElTable>
        <div style={{ textAlign: 'center', marginTop: '2em' }}>
          <ElButton style={{ marginRight: '2em' }} onClick={evt => props.onBack && props.onBack(evt)}>返回</ElButton>
          <ElButton type="primary">提交</ElButton>
        </div>
      </div>
    );
  }
}); 