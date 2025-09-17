import { style } from '@vanilla-extract/css'

export const container = style({
  maxWidth: '1100px',
  margin: '24px auto',
  padding: '0 12px'
})

export const page = style({
  display: 'flex'
})

export const leftpart = style({
  width:'260px',
  height:'100px'
})

export const leftop = style({
  background:'#004ea1',
  textAlign:'center',
  color:'#fff',
  fontSize:'30px',
  fontWeight:'bold',
  padding:'20px 0'
})

export const leftbottom = style({
  background:'#e7e7e7',
  padding:'30px',
  color:'#004ea1',
  fontSize:'22px',
  fontWeight:'500'
})

export const news = style({
  padding:'0 20px',
  width:'800px'
})
export const loading = style({})

export const error = style({
  color: '#f56c6c'
})

export const title = style({
  textAlign:'center',
  fontSize: '26px',
  marginBottom: '12px'
})

export const date = style({
  textAlign:'center',
  color: '#909399',
  marginBottom: '20px'
})

export const content = style({
  fontSize: '16px',
  lineHeight: '28px',
  color: '#303133'
})


