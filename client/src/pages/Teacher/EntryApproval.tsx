import { defineComponent, ref, watch, computed, h } from "vue";
import { useRouter } from "vue-router";
import TeacherHeader from "./TeacherHeader";
import * as styles from "../UserInfo/styles.css.ts";
import {
  ElContainer,
  ElHeader,
  ElRow,
  ElCol,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElForm,
  ElFormItem,
  ElDialog,
  ElCard,
  ElUpload,
} from "element-plus";

export default defineComponent({
  name: "EntryApprovalPage",
  setup() {
    // 电子签名弹窗
    const signDialogVisible = ref(false);
    const signatureUrl = ref<string | null>(null);
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    const openSignDialog = () => {
      signDialogVisible.value = true;
      setTimeout(() => {
        const canvas = canvasRef.value;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 100);
    };
    const handleMouseDown = (e: MouseEvent) => {
      drawing = true;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#333";
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    };
    const handleMouseUp = () => {
      drawing = false;
    };
    const saveSignature = () => {
      const canvas = canvasRef.value;
      if (canvas) {
        signatureUrl.value = canvas.toDataURL();
        signDialogVisible.value = false;
      }
    };
    const clearSignature = () => {
      const canvas = canvasRef.value;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      signatureUrl.value = null;
    };
    // 上传签名图片
    const uploadUrl = ref<string | null>(null);
    const handleUpload = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      return false; // 阻止自动上传
    };
    return () => (
      <ElContainer style={{ minHeight: "100vh" }}>
        <ElHeader height="15vh" style={{ padding: 0, background: "none" }}>
          <TeacherHeader />
        </ElHeader>
        <div class={styles.contentArea}>
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "50px 150px 0px 150px",
            }}
          >
            {/* 申请人信息 */}
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "24px",
              }}
            >
              申请人信息
            </div>
            <ElForm
              labelPosition="left"
              labelWidth="90px"
              size="large"
              style={{ maxWidth: 800, marginBottom: 24 }}
            >
              <ElRow gutter={24}>
                <ElCol span={12}>
                  <ElFormItem label="登录账号">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="登录密码">
                    <ElInput type="password" readonly disabled />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow gutter={24}>
                <ElCol span={12}>
                  <ElFormItem label="姓名">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="国别（地区）">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow gutter={24}>
                <ElCol span={12}>
                  <ElFormItem label="证件号码">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="证件类型">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow gutter={24}>
                <ElCol span={12}>
                  <ElFormItem label="出生日期">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
                <ElCol span={12}>
                  <ElFormItem label="电子邮件">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow gutter={24}>
                <ElCol span={12}>
                  <ElFormItem label="手机号码">
                    <ElInput readonly disabled />
                  </ElFormItem>
                </ElCol>
              </ElRow>
            </ElForm>

            {/* 导师签字 */}
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                margin: "40px 0 24px 0",
              }}
            >
              导师签字
            </div>
            <ElRow gutter={12}>
              <ElCol span={5}>
                <div
                  style={{
                    position: "relative",
                    width: "260px",
                    height: "120px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{ width: "100%", height: "100%" }}
                    onClick={openSignDialog}
                  >
                    <ElCard
                      style={{ width: "100%", height: "100%" }}
                      bodyStyle={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                      shadow="never"
                    >
                      {signatureUrl.value ? (
                        <img
                          src={signatureUrl.value}
                          alt="签名"
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      ) : (
                        <span style={{ color: "#888", fontSize: 16 }}>
                          点击此处电子签名
                        </span>
                      )}
                    </ElCard>
                  </div>
                  {signatureUrl.value && (
                    <ElButton
                      size="small"
                      style={{
                        position: "absolute",
                        right: "-50px",
                        bottom: "-30px",
                        zIndex: 2,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSignature();
                      }}
                    >
                      清空
                    </ElButton>
                  )}
                </div>
              </ElCol>
              <ElCol span={5}>
                <div
                  style={{
                    position: "relative",
                    width: "260px",
                    height: "120px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ElUpload
                    show-file-list={false}
                    accept="image/*"
                    beforeUpload={handleUpload}
                    style={{ width: "260px", height: "120px" }}
                  >
                    <div
                      style={{
                        width: "260px",
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ElCard
                        style={{ width: "100%", height: "100%" }}
                        bodyStyle={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                        shadow="never"
                      >
                        {uploadUrl.value ? (
                          <img
                            src={uploadUrl.value}
                            alt="签名图片"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        ) : (
                          <span
                            style={{
                              color: "#bbb",
                              fontSize: 48,
                              fontWeight: 700,
                              userSelect: "none",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            +
                          </span>
                        )}
                      </ElCard>
                    </div>
                  </ElUpload>
                  {uploadUrl.value && (
                    <ElButton
                      size="small"
                      style={{
                        position: "absolute",
                        right: "-50px",
                        bottom: "-30px",
                        zIndex: 2,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        uploadUrl.value = null;
                      }}
                    >
                      清空
                    </ElButton>
                  )}
                </div>
              </ElCol>
            </ElRow>

            {/* 按钮区 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                margin: "60px 0 0 0",
              }}
            >
              <ElButton style={{ width: "160px" }}>取消</ElButton>
              <ElButton type="primary" style={{ width: "160px" }}>
                通过
              </ElButton>
              <ElButton type="danger" style={{ width: "160px" }}>
                不通过
              </ElButton>
            </div>
          </div>
        </div>
        {/* 电子签名弹窗 */}
        <ElDialog
          v-model={signDialogVisible.value}
          title="电子签名"
          width="400px"
          closeOnClickModal={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <canvas
              ref={canvasRef}
              width={320}
              height={150}
              style={{
                border: "1px solid #888",
                borderRadius: 6,
                background: "#fff",
                cursor: "crosshair",
                marginBottom: 16,
              }}
              onMousedown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onMouseleave={handleMouseUp}
            />
            <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
              <ElButton onClick={clearSignature}>清空</ElButton>
              <ElButton type="primary" onClick={saveSignature}>
                保存
              </ElButton>
            </div>
          </div>
        </ElDialog>
      </ElContainer>
    );
  },
});
