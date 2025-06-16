import React, { useCallback } from 'react';
import { Paper, TextField, IconButton, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { FunctionDefinition } from './LeftPanel';
import ColorSelector from './ColorSelector';
import FunctionDefinitionComponent from './functionDefinition/FunctionDefinition';

interface FunctionPanelProps {
  function: FunctionDefinition;
  onUpdate: (id: string, updates: Partial<FunctionDefinition>) => void;
  onRemove: (id: string) => void;
}

const FunctionPanel: React.FC<FunctionPanelProps> = React.memo(
  ({ function: func, onUpdate, onRemove }) => {
    const handleTitleChange = useCallback(
      (value: string) => {
        onUpdate(func.id, { title: value });
      },
      [func.id, onUpdate]
    );

    const handleColorChange = useCallback(
      (color: string) => {
        onUpdate(func.id, { color });
      },
      [func.id, onUpdate]
    );

    const handleDefinitionChange = useCallback(
      (value: string) => {
        onUpdate(func.id, { definition: value });
      },
      [func.id, onUpdate]
    );

    const handleCoefficientsChange = useCallback(
      (coefficients: Record<string, number>) => {
        onUpdate(func.id, { coefficients });
      },
      [func.id, onUpdate]
    );

    const handleRemove = useCallback(() => {
      onRemove(func.id);
    }, [func.id, onRemove]);

    return (
      <Paper
        elevation={4}
        sx={{
          p: 2,
          border: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            value={func.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            variant="outlined"
            sx={{ flex: 1 }}
            placeholder="Function Title"
          />
          <ColorSelector value={func.color} onChange={handleColorChange} />
          <IconButton
            size="small"
            onClick={handleRemove}
            color="error"
            aria-label={`Delete ${func.title}`}
          >
            <Delete />
          </IconButton>
        </Box>

        <FunctionDefinitionComponent
          value={func.definition}
          onChange={handleDefinitionChange}
          coefficients={func.coefficients}
          onCoefficientsChange={handleCoefficientsChange}
        />
      </Paper>
    );
  }
);

FunctionPanel.displayName = 'FunctionPanel';

export default FunctionPanel;
