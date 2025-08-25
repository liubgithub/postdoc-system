import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import TeacherHeader from "../TeacherHeader.tsx";
import * as styles from "../../UserInfo/styles.css.ts";
import {
  ElContainer,
  ElHeader,
  ElRow,
  ElCol,
  ElButton,
  ElAside,
  ElMenu,
  ElMenuItem,
  ElMain,
  ElDialog,
  ElMessage,
} from "element-plus";
import ProcessStatus from "@/units/ProcessStatus";
import UserinfoRegister from '@/pages/EnterWorksation/form.tsx';
import Achievement from '@/pages/InWorkstation/coms/MidAssessment/achres_instation';
import Achievement_1 from '@/pages/InWorkstation/coms/MidAssessment/achres_1';
import Assessment from '@/pages/InWorkstation/coms/MidAssessment/assessment';
import { getUserProfile } from "@/api/postdoctor/userinfoRegister/bs_user_profile";
import { getStudentDetail } from "@/api/enterWorkstation";
import { getProcessTypesByUserId } from "@/api/enterWorkstation";



export default defineComponent({
  name: "ViewMiddleCheckPage",
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // 从路由参数获取学生信息
    const studentInfo = ref({
      studentId: route.query.studentId as string || '',
      name: route.query.name as string || '',
      college: route.query.college as string || '',
      major: route.query.major as string || '',
      applyTime: route.query.applyTime as string || '',
      userId: route.query.userId as string || ''
    });

    // 表单数据
    const form = ref({
      achievement: {
        paper_title: '',
        journal_name: '',
        journal_type: '',
        first_author_unit: '',
        publish_time: '',
        paper_rank: '',
        project_title: '',
        fund_name: '',
        fund_amount: '',
        project_unit: '',
        approval_time: '',
        project_rank: '',
        patent_title: '',
        patent_type_number: '',
        patent_unit: '',
        patent_other: '',
        patent_apply_time: '',
        patent_rank: '',
        award_title: '',
        award_dept_level: '',
        award_other: '',
        award_other2: '',
        award_time: '',
        award_rank: ''
      }
    });

    // 用户信息
    const userInfo = ref<any>(null);
    // 中期考核数据
    const midtermData = ref<any>(null);
    const loading = ref(false);

    // 获取学生中期考核数据
    const fetchStudentMidtermData = async () => {
      if (!studentInfo.value.userId) {
        return;
      }

      try {
        loading.value = true;
        const response = await getStudentDetail(parseInt(studentInfo.value.userId), "中期考核");
        
        if (response.data) {
          midtermData.value = response.data;
          console.log("获取的中期考核数据:", response.data);
          
          // 如果有用户信息，设置到userInfo中
          if (response.data.user_info) {
            userInfo.value = response.data.user_info;
          }
          
          // 如果有科研成果数据，设置到form中
          if (response.data.achievement_data) {
            console.log("获取的科研成果数据:", response.data.achievement_data);
            // 将科研成果数据传递给Achievement组件
            form.value.achievement = response.data.achievement_data;
          }
          
          // 如果有教育经历和工作经历数据，设置到userInfo中
          if (response.data.user_info) {
            console.log("获取的用户信息:", response.data.user_info);
            if (response.data.user_info.education_experience) {
              console.log("教育经历数据:", response.data.user_info.education_experience);
            }
            if (response.data.user_info.work_experience) {
              console.log("工作经历数据:", response.data.user_info.work_experience);
            }
          }
        } else if (response.error) {
          console.error("获取中期考核数据失败:", response.error);
          ElMessage.warning("未找到对应的中期考核数据");
        }
      } catch (error) {
        console.error("获取中期考核数据失败:", error);
        ElMessage.warning("获取中期考核数据失败");
      } finally {
        loading.value = false;
      }
    };

    // 页面加载时获取学生数据
    onMounted(() => {
      fetchStudentMidtermData();
    });

    // 流程状态弹窗逻辑
    const showProcessDialog = ref(false);
    const currentSteps = ref([]);
    const currentRow = ref<any>(null);
    const handleShowProcess = (row: any) => {
      console.log('点击查看流程，行数据:', row);
      currentSteps.value = row.steps;
      currentRow.value = row;
      showProcessDialog.value = true;
    };

    const menuList = [
      { label: '中期考核', key: 'middle' },
      { label: '年度考核', key: 'year' },
      { label: '延期考核', key: 'extension' },  
    ];
    const activeMenu = ref('middle');
    const handleMenuClick = (key: string) => {
      activeMenu.value = key;
      if (key === 'year') {
        router.push('/teacher/inManage/year');
      } else if (key === 'extension') {
        router.push('/teacher/inManage/extension');
      }
    };

    return () => (
      <ElContainer style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
        <ElHeader height="20vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <ElContainer style={{ position: 'relative', flex: 1, height: '0', top: '8px' }}>
          <ElAside width="200px" style={{ background: '#fff', height: '100%' }}>
            <ElMenu
              defaultActive={activeMenu.value}
              class="el-menu-vertical"
              onSelect={handleMenuClick}
            >
              {menuList.map(item => (
                <ElMenuItem index={item.key}>{item.label}</ElMenuItem>
              ))}
            </ElMenu>
          </ElAside>
          <ElMain style={{ padding: " 0px 24px 24px 24px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "24px",
                height: "calc(100vh - 200px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 中期考核内容 */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  中期考核
                </h2>
                {/* 中期考核表单内容 */}
                {loading.value ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    加载中...
                  </div>
                ) : (
                  <div>
                    <UserinfoRegister 
                      showResult={false} 
                      externalUserInfo={userInfo.value}
                      userRole="teacher"
                    />
                    {/* 科研成果表单 */}
                    <Achievement externalData={form.value.achievement} />
                    <Achievement_1 model={form.value.achievement} onUpdate:model={val => form.value.achievement = val} />
                    <Assessment />
                  </div>
                )}
              </div>

              {/* 返回按钮 */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <ElButton
                  style={{ width: 120 }}
                  plain
                  onClick={() => router.push('/teacher/inManage/middle')}
                >
                  返回
                </ElButton>
              </div>
            </div>
          </ElMain>
        </ElContainer>
        <ElDialog
          v-model={showProcessDialog.value}
          title="流程状态"
          width="600px"
          destroyOnClose
        >
                               {(() => {
                  console.log('当前行数据:', currentRow.value);
                  console.log('学生ID:', currentRow.value?.user_id);
                  return (
                                       <ProcessStatus
                      modelValue={showProcessDialog.value}
                      onUpdate:modelValue={(val) => showProcessDialog.value = val}
                      processType='中期考核'
                      studentId={currentRow.value?.user_id}
                    />
                 );
               })()}
        </ElDialog>
      </ElContainer>
    );
  },
});
