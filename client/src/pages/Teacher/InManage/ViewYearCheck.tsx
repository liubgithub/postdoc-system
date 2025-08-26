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
import AnnualAssessment from '@/pages/InWorkstation/coms/AnnualAssessment/annual_assess';
import { getUserProfile } from "@/api/postdoctor/userinfoRegister/bs_user_profile";
import { getStudentDetail, approveApplication } from "@/api/enterWorkstation";
import { getProcessTypesByUserId } from "@/api/enterWorkstation";



export default defineComponent({
  name: "ViewYearCheckPage",
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

    // 年度考核表单数据
    const annualForm = ref({
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
    });

    // 用户信息
    const userInfo = ref<any>(null);
    // 年度考核数据
    const annualData = ref<any>(null);
    const loading = ref(false);

    // 获取学生年度考核数据
    const fetchStudentAnnualData = async () => {
      if (!studentInfo.value.userId) {
        return;
      }

      try {
        loading.value = true;
        const response = await getStudentDetail(parseInt(studentInfo.value.userId), "年度考核");
        
        if (response.data) {
          annualData.value = response.data;
          console.log("获取的年度考核数据:", response.data);
          
          // 如果有用户信息，设置到userInfo中
          if (response.data.user_info) {
            userInfo.value = response.data.user_info;
          }
          
          // 如果有年度考核数据，设置到annualForm中
          if (response.data.annual_assessment_data) {
            console.log("获取的年度考核数据:", response.data.annual_assessment_data);
            annualForm.value = { ...annualForm.value, ...response.data.annual_assessment_data };
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
          console.error("获取年度考核数据失败:", response.error);
          ElMessage.warning("未找到对应的年度考核数据");
        }
      } catch (error) {
        console.error("获取年度考核数据失败:", error);
        ElMessage.warning("获取年度考核数据失败");
      } finally {
        loading.value = false;
      }
    };

    // 页面加载时获取学生数据
    onMounted(() => {
      fetchStudentAnnualData();
    });

    // 返回按钮处理
    const handleBack = () => {
      router.push('/teacher/inManage/year');
    };

    // 审核通过处理
    const handleApprove = async () => {
      if (!studentInfo.value.userId) {
        ElMessage.warning('缺少用户ID参数');
        return;
      }

      try {
        const response = await approveApplication(
          parseInt(studentInfo.value.userId),
          true,
          '导师审核通过',
          '年度考核'
        );
        
        if (response.data) {
          ElMessage.success('审核通过成功');
          // 重新获取数据以更新状态
          await fetchStudentAnnualData();
        } else if (response.error) {
          ElMessage.error('审核失败: ' + (response.error as Error).message);
        }
      } catch (error) {
        console.error('审核失败:', error);
        ElMessage.error('审核失败');
      }
    };

    // 审核不通过处理
    const handleReject = async () => {
      if (!studentInfo.value.userId) {
        ElMessage.warning('缺少用户ID参数');
        return;
      }

      try {
        const response = await approveApplication(
          parseInt(studentInfo.value.userId),
          false,
          '导师审核不通过',
          '年度考核'
        );
        
        if (response.data) {
          ElMessage.success('审核不通过成功');
          // 重新获取数据以更新状态
          await fetchStudentAnnualData();
        } else if (response.error) {
          ElMessage.error('审核失败: ' + (response.error as Error).message);
        }
      } catch (error) {
        console.error('审核失败:', error);
        ElMessage.error('审核失败');
      }
    };

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
    const activeMenu = ref('year');
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
              {/* 年度考核内容 */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  年度考核
                </h2>
                {/* 年度考核表单内容 */}
                {loading.value ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    加载中...
                  </div>
                ) : (
                  <div>
                    {/* 年度考核表单 */}
                    <AnnualAssessment onBack={handleBack} showYearButtons={false} />
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  padding: "20px 0",
                  borderTop: "1px solid #e4e7ed",
                  marginTop: "auto",
                }}
              >
                <ElButton onClick={handleBack}>返回</ElButton>
                {studentInfo.value.userId && (
                  <>
                    <ElButton type="danger" onClick={handleReject}>
                      不通过
                    </ElButton>
                    <ElButton type="primary" onClick={handleApprove}>
                      通过
                    </ElButton>
                  </>
                )}
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
                      processType='年度考核'
                      studentId={currentRow.value?.user_id}
                    />
                 );
               })()}
        </ElDialog>
      </ElContainer>
    );
  },
});
