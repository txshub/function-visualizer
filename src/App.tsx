import React, { useState, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import FunctionIcon from './components/FunctionIcon';
import LeftPanel, { FunctionDefinition } from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  const [functions, setFunctions] = useState<FunctionDefinition[]>([
    {
      id: '1',
      title: 'Function 1',
      color: '1976d2',
      definition: 'x',
      coefficients: {},
    },
  ]);

  const addFunction = useCallback(() => {
    const newFunction: FunctionDefinition = {
      id: Date.now().toString(),
      title: `Function ${functions.length + 1}`,
      color: '1976d2',
      definition: 'x',
      coefficients: {},
    };
    setFunctions((prev) => [...prev, newFunction]);
  }, [functions.length]);

  const removeFunction = useCallback((id: string) => {
    setFunctions((prev) => prev.filter((func) => func.id !== id));
  }, []);

  const updateFunction = useCallback(
    (id: string, updates: Partial<FunctionDefinition>) => {
      setFunctions((prev) =>
        prev.map((func) => (func.id === id ? { ...func, ...updates } : func))
      );
    },
    []
  );

  return (
    <div className="App">
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <FunctionIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Function Visualizer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{ mt: 2, mb: 2, height: 'calc(100vh - 100px)' }}
      >
        <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LeftPanel
              functions={functions}
              onAddFunction={addFunction}
              onUpdateFunction={updateFunction}
              onRemoveFunction={removeFunction}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <RightPanel functions={functions} />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;
