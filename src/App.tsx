import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
} from '@mui/material';
import { Functions as FunctionsIcon } from '@mui/icons-material';

function App() {
  const [functionInput, setFunctionInput] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleVisualize = () => {
    // Placeholder function - will be implemented later
    setResults([
      `Function: ${functionInput}`,
      'Analysis: Ready for implementation',
      'Visualization: Coming soon...',
    ]);
  };

  return (
    <div className="App">
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <FunctionsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Function Visualizer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Stack spacing={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Function Input
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Enter your function here"
                placeholder="e.g., function add(a, b) { return a + b; }"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleVisualize}
                disabled={!functionInput.trim()}
                startIcon={<FunctionsIcon />}
              >
                Visualize Function
              </Button>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Analysis Results
              </Typography>
              {results.map((result, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    {result}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}

          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Welcome to Function Visualizer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This tool helps you visualize and analyze functions. Enter a
                function in the input area above to get started. More features
                will be added as the project develops.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </div>
  );
}

export default App;
