import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { grey, deepPurple } from '@mui/material/colors';

const LitSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: grey[900],
        '&:hover': {
          backgroundColor: alpha(grey[900], theme.palette.action.hoverOpacity),
        },
      },
      '& .MuiSwitch-switchBase + .MuiSwitch-track': {
        backgroundColor: grey[400],
      },
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: deepPurple[600],
      '&:hover': {
        backgroundColor: alpha(deepPurple[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: deepPurple[600],
    },
  }));

export default LitSwitch;