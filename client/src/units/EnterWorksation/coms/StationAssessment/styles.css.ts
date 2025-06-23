import { style, globalStyle } from '@vanilla-extract/css'

export const formContainer = style({
    padding: '20px',
    border: '1px solid #dcdfe6',
    fontFamily: '"SimSun", "STSong", "serif"',
    backgroundColor: '#f5f7fa',
})

export const header = style({
    textAlign: 'center',
    marginBottom: '20px',
})

globalStyle(`${header} h1`, {
    fontSize: '24px',
    fontWeight: 'bold',
})

export const formSection = style({
    marginBottom: '20px',
});

export const cardHeader = style({
    fontWeight: 'bold',
    fontSize: '16px',
});

export const cardContent = style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '120px',
    lineHeight: 1.6,
})

export const para = style({
    marginBottom: '20px',
})

export const signatureWrapper = style({
    alignSelf: 'flex-end',
    textAlign: 'right'
})

export const signature = style({
    marginTop: '10px'
})

export const voteInput = style({
    width: '60px',
    margin: '0 10px',
}) 