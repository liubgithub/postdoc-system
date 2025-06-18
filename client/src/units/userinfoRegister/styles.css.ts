import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  height: '100%',
  background: '#f5f7fa',
});

export const sidebar = style({
  width: '260px',
  background: '#0047ab',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '40px',
  minHeight: '100vh',
});

export const menuBtn = style({
  width: '180px',
  height: '100px',
  background: '#1ec3f7',
  color: '#222',
  fontSize: '1.3rem',
  fontWeight: 500,
  border: 'none',
  borderRadius: '6px',
  marginBottom: '40px',
  cursor: 'pointer',
  transition: 'background 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const menuBtnActive = style({
  background: '#fff',
  color: '#0047ab',
  border: '2px solid #1ec3f7',
});

export const main = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '40px 0',
  background: '#fff',
  overflowY: 'auto',
  maxHeight: '100vh',
});

export const formWrapper = style({
  width: '700px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
  padding: '32px 40px',
});

export const formRow = style({
  display: 'flex',
  gap: '24px',
});

export const formCol = style({
  flex: 1,
});

export const table = style({
  margin: '16px 0',
});

export const btnGroup = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '32px',
  marginTop: '32px',
}); 