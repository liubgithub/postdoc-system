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
  overflow: 'hidden',
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: 0,
  padding: 0,
});

export const formWrapper = style({
  background: '#fff',
  borderRadius: '0.5em',
  boxShadow: '0 0.125em 0.75em 0 rgba(0,0,0,0.08)',
  padding: '2em 4em',
  boxSizing: 'border-box',
  maxHeight: '80vh',
  overflowY: 'auto',
  margin: 0,
  selectors: {
    '&::-webkit-scrollbar': {
      width: '8px',
      background: 'rgba(0,0,0,0.03)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#90caf9',
      borderRadius: '8px',
      minHeight: '24px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#42a5f5',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0,0,0,0.01)',
      borderRadius: '8px',
    },
  },
});

export const formRow = style({
  display: 'flex',
  gap: '2vw',
});

export const formCol = style({
  flex: 1,
});

export const table = style({
  margin: '1em 0',
});

export const btnGroup = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '2em',
  marginTop: '2em',
}); 