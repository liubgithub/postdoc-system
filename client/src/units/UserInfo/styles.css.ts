import { style } from '@vanilla-extract/css'

export const headerBar = style({
  background: '#0a47b1',
  padding: '24px 0 0 0',
  textAlign: 'center',
  height: '20vh',
});

export const welcome = style({
  color: '#fff',
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '24px',
});

export const menuRow = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '32px',
  marginBottom: '16px',
});

export const menuBtn = style({
  background: '#0033cc',
  color: '#fff',
  padding: '16px 48px',
  fontSize: '1.2rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background 0.2s',
});

export const menuBtnActive = style({
  background: '#1ec3f7',
  color: '#222',
});

export const contentArea = style({
  background: '#fff',
  padding: '32px',
  height: 'calc(100vh - 20vh)',
  overflow: 'auto',
});

export const formWrapper = style({
  width: '700px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
  padding: '32px 40px',
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 80px)',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}); 