// style.css.ts
import { style } from "@vanilla-extract/css";
import { globalStyle } from "@vanilla-extract/css";

export const container = style({
  minHeight: '100vh',
  padding: '20px',
  backgroundColor: '#f5f7fa',
});

export const page = style({
  maxWidth: '1200px',
  margin: '0 auto',
});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  padding: "16px 24px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
});

export const searchPart = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
  padding: "16px 24px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
});

export const tableBox = style({
  background: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
});

export const actions = style({
  display: "flex",
  gap: "8px",
});

export const buttonposition = style({
  display: "flex",
  justifyContent: "center",
  gap: "200px",
  marginTop: "1rem"
});

export const noData = style({
  textAlign: "center",
  padding: "40px 0",
  color: "#909399",
  fontSize: "14px",
});

// 为弹窗添加样式
globalStyle('.news-content-dialog', {
  width: '80%',
  maxWidth: '800px',
});

globalStyle('.news-content-dialog .el-message-box__message', {
  whiteSpace: 'pre-wrap',
  lineHeight: '1.6',
});