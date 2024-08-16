import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress, {

} from '@mui/material/CircularProgress';
import { Padding } from '@mui/icons-material';


function GradientCircularProgress({ size = 130 }) {
  return (
    <React.Fragment>
      <svg width={0} height={0} >
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%" >
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} size={size}/>
    </React.Fragment>
  );
}

export default function LoadingSpinner() {
  return (
<Stack spacing={2} sx={{ flexGrow: 1,  alignItems: 'center', position: 'relative' , top: '45%'}}>
  <GradientCircularProgress/>
  {/* <BorderLinearProgress variant="determinate" value={50} /> */}
</Stack>
  );
}
