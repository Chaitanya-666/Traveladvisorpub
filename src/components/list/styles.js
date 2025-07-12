import { styled } from '@mui/material/styles';
import { FormControl, Select, CircularProgress, Grid, Typography } from '@mui/material';

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
  marginBottom: '30px',
  width: '90%', // Makes form control take most of the width
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%', // Full width select
}));

export const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  height: '600px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', // Fixed alignment
  margin: 'auto',
}));

export const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: '30px',
  textAlign: 'center', // Center text
}));

export const StyledList = styled('div')(({ theme }) => ({
  height: '75vh',
  overflow: 'auto',
  padding: theme.spacing(2),
  marginRight: theme.spacing(1), // Add margin for scrollbar
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
  scrollbarWidth: 'thin', // For Firefox
  scrollbarColor: '#888 #f1f1f1', // For Firefox
}));