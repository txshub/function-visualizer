import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface FunctionIconProps extends Omit<BoxProps, 'children'> {}

const FunctionIcon: React.FC<FunctionIconProps> = (props) => {
  return (
    <Box
      {...props}
      sx={{
        fontFamily: 'serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '24px',
        minHeight: '24px',
        ...props.sx,
      }}
    >
      f(x)
    </Box>
  );
};

export default FunctionIcon;
