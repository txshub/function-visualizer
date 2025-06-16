import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface CoefficientsProps {
  coefficientNames: string[];
  values: Record<string, number>;
  onChange: (coeff: string, value: string) => void;
}

/**
 * Coefficients – renders the list of coefficient input fields.
 */
const Coefficients: React.FC<CoefficientsProps> = ({
  coefficientNames,
  values,
  onChange,
}) => {
  if (coefficientNames.length === 0) return null;

  return (
    <Box sx={{ mt: 1 }}>
      {coefficientNames.map((coeff) => (
        <Box
          key={coeff}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
        >
          <Typography
            variant="body2"
            sx={{ minWidth: 'fit-content', fontSize: '0.9rem' }}
          >
            {coeff} =
          </Typography>
          <TextField
            size="small"
            value={values[coeff]?.toString() || ''}
            onChange={(e) => onChange(coeff, e.target.value)}
            variant="outlined"
            sx={{ width: 100 }}
            inputProps={{ 'aria-label': `Coefficient ${coeff}` }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Coefficients;
