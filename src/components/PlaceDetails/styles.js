import { styled } from '@mui/material/styles';
import { Chip, Typography } from '@mui/material';

// Styled Chip component
export const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

// Subtitle Typography
export const Subtitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
}));

// Spacing Typography
export const Spacing = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));
