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

export const achievementcontainer = style({
  padding: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
})

export const filtersection = style({
  marginBottom: '25px',
  paddingBottom: '15px',
  borderBottom: '1px solid #ebeef5',
})

export const filtercontrols = style({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginTop: '15px',
})

export const tablecard =style({
  marginBottom: '25px',
  borderRadius: '8px',
})

export const tableheader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '10px',
  borderBottom: '1px solid #f0f0f0',
})

export const totalcount = style({
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginLeft: 'auto',
})

export const loading = style({
  textAlign: 'center',
  padding: '40px',
  fontSize: '16px',
  color: '#909399',
})