import { style } from '@vanilla-extract/css';

export const processStatusContainer = style({
  display: 'flex',
  alignItems: 'flex-start',
  background: '#f8f8f8',
  padding: '24px',
});

export const processStatusLeft = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: '24px',
  position: 'relative',
});

export const processStep = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const stepDot = style({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#bdbdbd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  color: '#fff',
  fontSize: '16px',
  marginBottom: '4px',
});

export const stepDot_发起 = style({ background: '#1e90ff' });
export const stepDot_通过 = style({ background: '#4caf50' });
export const stepDot_审核中 = style({ background: '#ff9800' });
export const stepDot_拒绝 = style({ background: '#f44336' });
export const stepDot_结束 = style({ background: '#bdbdbd' });

export const stepLine = style({
  width: '4px',
  height: '60px',
  background: '#e0e0e0',
  marginBottom: '4px',
});

export const processStatusRight = style({
  flex: 1,
});

export const processCard = style({
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  padding: '16px',
  position: 'relative',
});

export const avatar = style({
  width: '48px',
  height: '48px',
  background: '#e0e0e0',
  borderRadius: '50%',
  marginRight: '16px',
});

export const info = style({
  flex: 1,
});

export const namePlaceholder = style({
  width: '80px',
  height: '20px',
  background: '#f0f0f0',
  borderRadius: '4px',
  marginBottom: '4px',
});

export const role = style({
  color: '#888',
  fontSize: '14px',
  marginBottom: '8px',
});

export const opinionBtn = style({
  background: '#3f51b5',
  color: '#fff',
  border: 'none',
  borderRadius: '16px',
  padding: '4px 12px',
  fontSize: '12px',
  cursor: 'pointer',
});

export const time = style({
  color: '#bbb',
  fontSize: '13px',
  position: 'absolute',
  right: '16px',
  bottom: '16px',
}); 