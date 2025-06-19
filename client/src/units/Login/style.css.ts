import { style } from '@vanilla-extract/css'

export const loginPage = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '0 50px',
  backgroundColor: '#f5f7fa',
})

export const leftSection = style({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const leftImage = style({
  maxWidth: '100%',
  height: 'auto',
})

export const loginForm = style({
  width: '400px',
  padding: '10px 20px',
  marginLeft: '50px',
  border: '1px solid #e4e7ed',
  borderRadius: '8px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
})

export const title = style({
  textAlign: 'center',
  marginBottom: '10px',
})

export const submitButton = style({
  width: '100%',
  marginTop: '10px',
})

export const registerLink = style({
  textAlign: 'center',
  marginTop: '20px',
})
