import { style } from '@vanilla-extract/css'

export const carouselContainer = style({
  position: 'relative',
  width: '100%',
  margin: '0 auto',
  overflow: 'hidden',
})

export const carouselItem = style({
  position: 'relative',
  width: '100%',
  height: '100%',
})

export const carouselImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const carouselContent = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px',
  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
  color: '#fff',
})

export const carouselTitle = style({
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
})

export const carouselDescription = style({
  fontSize: '16px',
  margin: 0,
})

export const customIndicators = style({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '10px',
  zIndex: 10,
})

export const indicator = style({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  }
})

export const activeIndicator = style({
  backgroundColor: '#fff',
  transform: 'scale(1.2)',
})

export const customNavigation = style({
  position: 'absolute',
  top: '50%',
  left: '0',
  right: '0',
  display: 'flex',
  justifyContent: 'space-between',
  transform: 'translateY(-50%)',
  padding: '0 20px',
  zIndex: 10,
})

export const navButton = style({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }
})