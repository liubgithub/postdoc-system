import { style } from '@vanilla-extract/css';

export const achievementRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: '0',
  borderBottom: '1px solid #ccc',
  minHeight: '60px',
});

export const achievementCell = style({
  borderRight: '1px solid #ccc',
  borderLeft: '1px solid #ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 4px',
  minHeight: '60px',
  fontSize: '1em',
  background: '#fff',
  boxSizing: 'border-box',
});

// 去除最后一行和最后一列的边框
export const lastRow = style({
  borderBottom: 'none',
});
export const lastCell = style({
  borderRight: 'none',
});
