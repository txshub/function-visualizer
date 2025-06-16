import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import FunctionPanel from './FunctionPanel';

export interface FunctionDefinition {
  id: string;
  title: string;
  color: string;
  definition: string;
  coefficients: Record<string, number>;
}

interface LeftPanelProps {
  functions: FunctionDefinition[];
  onAddFunction: () => void;
  onUpdateFunction: (id: string, updates: Partial<FunctionDefinition>) => void;
  onRemoveFunction: (id: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  functions,
  onAddFunction,
  onUpdateFunction,
  onRemoveFunction,
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={2} sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
        {functions.map((func) => (
          <FunctionPanel
            key={func.id}
            function={func}
            onUpdate={onUpdateFunction}
            onRemove={onRemoveFunction}
          />
        ))}
      </Stack>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<Add />}
        onClick={onAddFunction}
        sx={{ mt: 2 }}
      >
        Add Function
      </Button>
    </Box>
  );
};

export default LeftPanel;
