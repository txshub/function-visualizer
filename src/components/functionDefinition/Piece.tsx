import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface PieceProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Piece – represents a single branch (or "piece") of a piece-wise function.
 */
const Piece: React.FC<PieceProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
      <Typography variant="body1" sx={{ minWidth: 'fit-content' }}>
        f(x) =
      </Typography>
      <TextField
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        placeholder="Enter function definition"
        sx={{ flex: 1 }}
      />
    </Box>
  );
};

export default Piece;
