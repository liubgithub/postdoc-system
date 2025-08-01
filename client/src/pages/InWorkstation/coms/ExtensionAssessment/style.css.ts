import { style } from '@vanilla-extract/css';

export const extensionAssessmentContainer = style({
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  background: '#fff',
  minHeight: '100vh',
});

export const pageHeader = style({
  textAlign: 'center',
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '2px solid #409eff',
});

export const pageTitle = style({
  color: '#303133',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
});

export const section = style({
  marginBottom: '40px',
  background: '#fafafa',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
});

export const sectionTitle = style({
  color: '#409eff',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '20px',
  paddingBottom: '10px',
  borderBottom: '1px solid #e4e7ed',
});

export const formRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '20px',
  marginBottom: '20px',
});

export const basicInfoForm = style({
  background: '#fff',
  padding: '20px',
  borderRadius: '6px',
  border: '1px solid #e4e7ed',
});

export const extensionInfoForm = style({
  background: '#fff',
  padding: '20px',
  borderRadius: '6px',
  border: '1px solid #e4e7ed',
});

export const formSection = style({
  marginBottom: '30px',
  padding: '20px',
  background: '#f8f9fa',
  borderRadius: '6px',
  borderLeft: '4px solid #409eff',
});

export const formSectionTitle = style({
  color: '#303133',
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '15px',
  paddingBottom: '8px',
  borderBottom: '1px solid #dcdfe6',
});

export const subsection = style({
  marginBottom: '20px',
  padding: '15px',
  background: '#fff',
  borderRadius: '4px',
  border: '1px solid #ebeef5',
});

export const subsectionTitle = style({
  color: '#606266',
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '10px',
});

export const instruction = style({
  color: '#909399',
  fontSize: '12px',
  lineHeight: '1.6',
  marginBottom: '10px',
  padding: '10px',
  background: '#f5f7fa',
  borderRadius: '4px',
  borderLeft: '3px solid #909399',
});

export const confirmationSection = style({
  background: '#fff',
  padding: '20px',
  borderRadius: '6px',
  border: '2px solid #67c23a',
});

export const confirmationText = style({
  color: '#606266',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '20px',
  padding: '15px',
  background: '#f0f9ff',
  borderRadius: '4px',
  borderLeft: '3px solid #67c23a',
});

export const signatureSection = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  alignItems: 'end',
});

export const bottomButtons = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '40px',
  paddingTop: '20px',
  borderTop: '1px solid #e4e7ed',
}); 