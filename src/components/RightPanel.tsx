import React, { useState, useCallback } from 'react';
import { Box, TextField, Paper, Grid2 } from '@mui/material';
import GraphDisplay from './GraphDisplay';
import { FunctionDefinition } from './LeftPanel';

interface RightPanelProps {
  functions: FunctionDefinition[];
}

const RightPanel: React.FC<RightPanelProps> = React.memo(({ functions }) => {
  const [axisLimits, setAxisLimits] = useState({
    minX: 0,
    maxX: 10,
    minY: 0,
    maxY: 10,
  });

  const handleLimitChange = useCallback(
    (axis: keyof typeof axisLimits, value: string) => {
      try {
        const numValue = parseFloat(value);
        const finalValue = value === '' || isNaN(numValue) ? 0 : numValue;

        setAxisLimits((prev) => ({
          ...prev,
          [axis]: finalValue,
        }));
      } catch (e) {
        // If parsing fails, just use 0
        setAxisLimits((prev) => ({
          ...prev,
          [axis]: 0,
        }));
      }
    },
    []
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, mb: 2 }}>
        <GraphDisplay axisLimits={axisLimits} functions={functions} />
      </Box>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={3}>
            <TextField
              size="small"
              label="Min X"
              value={axisLimits.minX.toString()}
              onChange={(e) => handleLimitChange('minX', e.target.value)}
              fullWidth
              inputProps={{ 'aria-label': 'Minimum X value' }}
            />
          </Grid2>
          <Grid2 size={3}>
            <TextField
              size="small"
              label="Max X"
              value={axisLimits.maxX.toString()}
              onChange={(e) => handleLimitChange('maxX', e.target.value)}
              fullWidth
              inputProps={{ 'aria-label': 'Maximum X value' }}
            />
          </Grid2>
          <Grid2 size={3}>
            <TextField
              size="small"
              label="Min Y"
              value={axisLimits.minY.toString()}
              onChange={(e) => handleLimitChange('minY', e.target.value)}
              fullWidth
              inputProps={{ 'aria-label': 'Minimum Y value' }}
            />
          </Grid2>
          <Grid2 size={3}>
            <TextField
              size="small"
              label="Max Y"
              value={axisLimits.maxY.toString()}
              onChange={(e) => handleLimitChange('maxY', e.target.value)}
              fullWidth
              inputProps={{ 'aria-label': 'Maximum Y value' }}
            />
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  );
});

RightPanel.displayName = 'RightPanel';

export default RightPanel;
