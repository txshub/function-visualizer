import React, { useMemo } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';

interface ParseResult {
  success: boolean;
  code: string;
  error?: string;
}

interface InfoTooltipProps {
  result: ParseResult;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ result }) => {
  const tooltipContent = useMemo(
    () => (
      <div style={{ maxWidth: 300 }}>
        {result.success ? (
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>Generated Code:</strong>
            </div>
            <pre
              style={{
                color: '#2e7d32',
                fontFamily: 'monospace',
                fontSize: '11px',
                margin: 0,
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: 8,
                borderRadius: 4,
              }}
            >
              {result.code}
            </pre>
          </div>
        ) : (
          <div style={{ color: '#d32f2f' }}>
            <strong>Error:</strong> {result.error}
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <div>
            <strong>Supported operations:</strong>
          </div>
          <div>• Basic: +, -, *, /</div>
          <div>• Parentheses: ()</div>
          <div>• log(x) - natural logarithm</div>
          <div>• pow(x, 2) - power function</div>
          <div>• Coefficients: a, b, alpha_1, etc.</div>
          <div>
            <strong>Examples:</strong>
          </div>
          <div>• a*x + b</div>
          <div>• x*x + 3*x + c</div>
          <div>• a*log(x) + b</div>
        </div>
      </div>
    ),
    [result]
  );

  return (
    <Tooltip title={tooltipContent} arrow>
      <IconButton size="small" aria-label="Function help">
        <Info
          fontSize="small"
          sx={{ color: result.success ? '#2e7d32' : '#d32f2f' }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default InfoTooltip;
