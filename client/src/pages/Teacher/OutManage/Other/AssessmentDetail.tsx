import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import {
  ElCard,
  ElDivider,
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElInput,
  ElForm,
  ElFormItem,
} from "element-plus";

export default defineComponent({
  name: "AssessmentDetail",
  setup() {
    const route = useRoute();
    const id = route.params.id;
    // 示例数据
    const baseInfo = [
      { label: "博士后姓名", value: "张三" },
      { label: "性别", value: "男" },
      { label: "国籍", value: "中国" },
      { label: "民族", value: "汉族" },
      { label: "出生地", value: "湖北武汉" },
      { label: "出生年月", value: "1990-01" },
      { label: "政治面貌", value: "中共党员" },
      { label: "进站时间", value: "2022-09-01" },
      { label: "进站专业", value: "园艺学" },
      { label: "合作导师", value: "李老师" },
    ];
    const studyColumns = [
      { prop: "start", label: "起止时间" },
      { prop: "school", label: "在何学校学习" },
      { prop: "major", label: "学习专业" },
      { prop: "degree", label: "获得学位" },
      { prop: "tutor", label: "指导老师" },
    ];
    const studyData = [
      { start: "", school: "", major: "", degree: "", tutor: "" },
      { start: "", school: "", major: "", degree: "", tutor: "" },
      { start: "", school: "", major: "", degree: "", tutor: "" },
    ];
    const workColumns = [
      { prop: "start", label: "起止时间" },
      { prop: "company", label: "工作单位及职务" },
      { prop: "major", label: "学习专业" },
      { prop: "degree", label: "获得学位" },
      { prop: "tutor", label: "指导老师" },
    ];
    const workData = [
      { start: "", company: "", major: "", degree: "", tutor: "" },
      { start: "", company: "", major: "", degree: "", tutor: "" },
      { start: "", company: "", major: "", degree: "", tutor: "" },
    ];
    return () => (
      <div
        style={{
          background: "#fff",
          padding: "20px 150px 0px 80px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "24px",
          }}
        >
          博士后基本情况
        </div>
        <ElForm
          labelPosition="right"
          labelWidth="90px"
          style={{ width: "100%" }}
        >
          <ElRow gutter={24}>
            {baseInfo.map((item, idx) => (
              <ElCol span={6} key={idx} style={{ marginBottom: "20px" }}>
                <ElFormItem label={item.label} style={{ marginBottom: 0 }} >
                  <ElInput
                    modelValue={item.value}
                    disabled
                    size="large"
                    style={{
                      width: "180px",
                      fontSize: 18,
                      background: "#f5f5f5",
                    }}
                  />
                </ElFormItem>
              </ElCol>
            ))}
          </ElRow>
        </ElForm>
       
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "24px",
          }}
        >
          主要学习经历
        </div>
        <ElTable 
          data={studyData} 
          border 
          style={{ marginBottom: 32, color: '#000' }}
          row-style={() => ({ height: '48px' })}
        >
          {studyColumns.map((col) => (
            <ElTableColumn prop={col.prop} label={col.label} align="center" />
          ))}
        </ElTable>
        
        <div
         style={{
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "24px",
        }}
        >
          主要工作经历
        </div>
        <ElTable 
          data={workData} 
          border 
          style={{ color: '#000' }}
          row-style={() => ({ height: '48px' })}
        >
          {workColumns.map((col) => (
            <ElTableColumn prop={col.prop} label={col.label} align="center" />
          ))}
        </ElTable>
      </div>
    );
  },
});
