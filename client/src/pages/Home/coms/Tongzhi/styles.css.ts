import { style, globalStyle } from "@vanilla-extract/css";

export const title = style({
    position: 'relative',
    fontSize: '30px',
    color: '#313131',
    fontWeight: 'bold',
    lineHeight: '80px',
    marginBottom: '50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
})

globalStyle(`${title}::before`, {
    content: '',
    display: 'block',
    width: '30px',
    height: '2px',
    background: '#004ea1',
    position: 'absolute',
    left: '0',
    bottom: '2px',
});

globalStyle(`${title}::after`, {
    content: '',
    display: 'block',
    width: '12px',
    height: '2px',
    background: '#f19149',
    position: 'absolute',
    left: '36px',
    bottom: '1px',
});

export const btn = style({
    width: '110px',
    fontSize: '16px',
    color: '#fff',
    lineHeight: '40px',
    fontWeight: 'normal',
    textAlign: 'center',
    background: '#004ea1',
    position: 'relative',
    marginTop: '40px',
    border: 'none',
    borderRadius: '0',
})

globalStyle(`${btn}::before`, {
    content: '',
    display: 'block',
    width: '2px',
    height: '26px',
    background: '#fff',
    position: 'absolute',
    right: '6px',
    bottom: '-4px',
    transform: 'rotate(45deg)',
});

globalStyle(`${btn}:hover`, {
    background: '#ff9e21',
});


export const first = style({
    width: '100%',
    marginBottom: '25px',
    padding: '0',
});

globalStyle(`${first} a`, {
    borderRight: 'none',
    padding: '0',
    display: 'flex',
});


export const time = style({
    float: 'left',
    width: '118px',
    height: '220px',
    background: '#004ea1',
    borderRadius: '0 8px 0 8px',
    padding: '8px',
    boxSizing: 'border-box',
    fontSize: '20px',
    lineHeight: '30px',
    color: '#fff',
    textAlign: 'center',
    flexShrink: '0',
});

globalStyle(`${time} p`,{
    fontSize:'36px',
    fontWeight:'bold'
})


export const con = style({
    float: 'right',
    width: 'calc(100% - 130px)',
    background: '#fafafa',
    padding: '30px 20px',
    boxSizing: 'border-box',
    marginLeft: '12px',
  });
  
  export const tit = style({
    fontSize: '24px',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '46px',
    marginTop: '0',
    display: 'block',
  });
  
  export const sj = style({
    textAlign: 'right',
    fontSize: '20px',
    lineHeight: '24px',
    height: '24px',
    color: '#b2b2b2',
    position: 'relative',
    margin: '15px 0',
  });
  
  globalStyle(`${sj}::after`, {
    content: '',
    display: 'block',
    width: '100%',
    height: '1px',
    background: '#e7e7e7',
    position: 'absolute',
    left: '0',
    top: '0',
    bottom: '0',
    margin: 'auto',
    zIndex: '5',
  });
  
  globalStyle(`${sj} font`, {
    display: 'block',
    width: '125px',
    background: '#fafafa',
    zIndex: '10',
    position: 'absolute',
    right: '0',
  });
  
  export const txt = style({
    fontSize: '15px',
    color: '#808080',
    lineHeight: '30px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '2',
    overflow: 'hidden',
    textIndent: '2em',
    marginTop: '0',
  });
  
  globalStyle(`${first} a:hover ${tit}`, {
    color: '#004ea1',
  });