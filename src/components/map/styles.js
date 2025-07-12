import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './mapStyles.css';
export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '20vw', // 20% of viewport width
  maxWidth: '300px', // Maximum width
  minWidth: '200px', // Minimum width
  '& img': {
    width: '100%',
    height: '15vh', // 15% of viewport height
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiTypography-h3': {
    fontSize: '1.2rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    width: '60vw', // 60% of viewport width on mobile
    minWidth: '150px',
    padding: theme.spacing(1),
    '& img': {
      height: '10vh', // 10% of viewport height on mobile
    },
    '& .MuiTypography-h3': {
      fontSize: '1rem',
    }
  }
}));

export const MapContainer = styled(Box)(({ theme }) => ({
  height: '85vh',
  width: '100%',
}));

export const MarkerContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  '&:hover': {
    zIndex: 2,
  },
}));

export const Pointer = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
}));