import React, { useMemo } from 'react';
import { Paper, Box } from '@mui/material';
import { FunctionDefinition } from './LeftPanel';

interface AxisLimits {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface GraphDisplayProps {
  axisLimits: AxisLimits;
  functions: FunctionDefinition[];
}

interface TickInfo {
  value: number;
  position: number;
  label: string;
}

const GraphDisplay: React.FC<GraphDisplayProps> = React.memo(
  ({ axisLimits, functions }) => {
    const { minX, maxX, minY, maxY } = axisLimits;
    const graphSize = 400;
    const margin = 50;
    const totalSize = graphSize + 2 * margin;

    const scaleX = useMemo(
      () => (x: number) => margin + ((x - minX) / (maxX - minX)) * graphSize,
      [minX, maxX, graphSize, margin]
    );

    const scaleY = useMemo(
      () => (y: number) =>
        totalSize - margin - ((y - minY) / (maxY - minY)) * graphSize,
      [minY, maxY, graphSize, margin, totalSize]
    );

    const createFunction = (
      definition: string,
      coefficients: Record<string, number>
    ): ((x: number) => number) | null => {
      try {
        if (!definition.trim()) return null;

        let cleanDef = definition.replace(/\s+/g, '');

        const validPattern = /^[x\d+\-*/().log,pow_a-zA-Z]*$/;
        if (!validPattern.test(cleanDef)) return null;

        // Extract coefficients
        const coefficientPattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
        const matches = cleanDef.match(coefficientPattern) || [];
        const reserved = ['x', 'log', 'pow', 'Math', 'return', 'function'];
        const foundCoefficients = Array.from(new Set(matches)).filter(
          (match) => !reserved.includes(match)
        );

        cleanDef = cleanDef.replace(/log\(/g, 'Math.log(');
        cleanDef = cleanDef.replace(/pow\(/g, 'Math.pow(');

        // Handle implicit multiplication
        cleanDef = cleanDef.replace(/(\d)x/g, '$1*x');
        cleanDef = cleanDef.replace(/x(\d)/g, 'x*$1');
        cleanDef = cleanDef.replace(/\)(\d)/g, ')*$1');
        cleanDef = cleanDef.replace(/(\d)\(/g, '$1*(');
        cleanDef = cleanDef.replace(/\)x/g, ')*x');
        cleanDef = cleanDef.replace(/x\(/g, 'x*(');

        // Handle coefficient implicit multiplication
        for (const coeff of foundCoefficients) {
          const coeffPattern = new RegExp(`(\\d)${coeff}\\b`, 'g');
          cleanDef = cleanDef.replace(coeffPattern, `$1*${coeff}`);

          const coeffPatternReverse = new RegExp(`\\b${coeff}(\\d)`, 'g');
          cleanDef = cleanDef.replace(coeffPatternReverse, `${coeff}*$1`);

          const coeffPatternX = new RegExp(`\\b${coeff}x\\b`, 'g');
          cleanDef = cleanDef.replace(coeffPatternX, `${coeff}*x`);

          const coeffPatternXReverse = new RegExp(`\\bx${coeff}\\b`, 'g');
          cleanDef = cleanDef.replace(coeffPatternXReverse, `x*${coeff}`);
        }

        // Create function with coefficients
        const coeffValues = { ...coefficients };
        foundCoefficients.forEach((coeff) => {
          if (!(coeff in coeffValues)) {
            coeffValues[coeff] = 0;
          }
        });

        const funcBody = `
        ${foundCoefficients.map((coeff) => `const ${coeff} = ${coeffValues[coeff]};`).join('\n')}
        return ${cleanDef};
      `;

        // eslint-disable-next-line no-new-func
        const func = new Function('x', funcBody);

        // Test the function
        func(1);

        return func as (x: number) => number;
      } catch (e) {
        return null;
      }
    };

    const generateFunctionPath = useMemo(
      () =>
        (func: (x: number) => number): string => {
          const points: string[] = [];
          const step = (maxX - minX) / 200;
          let isDrawing = false;

          for (let x = minX; x <= maxX; x += step) {
            try {
              const y = func(x);

              // Check if the point is within both x and y bounds
              const withinBounds =
                isFinite(y) && y >= minY && y <= maxY && x >= minX && x <= maxX;

              if (withinBounds) {
                const screenX = scaleX(x);
                const screenY = scaleY(y);

                if (!isDrawing) {
                  // Start a new path segment
                  points.push(`M ${screenX} ${screenY}`);
                  isDrawing = true;
                } else {
                  // Continue the current path segment
                  points.push(`L ${screenX} ${screenY}`);
                }
              } else {
                // Point is outside bounds, stop drawing
                isDrawing = false;
              }
            } catch (e) {
              // Invalid point, stop drawing
              isDrawing = false;
            }
          }

          return points.join(' ');
        },
      [minX, maxX, minY, maxY, scaleX, scaleY]
    );

    const generateTicks = useMemo(
      () =>
        (min: number, max: number, axis: 'x' | 'y'): TickInfo[] => {
          const range = max - min;
          let tickCount = 10;
          if (range <= 2) tickCount = range * 4;
          else if (range <= 10) tickCount = range;
          else if (range <= 50) tickCount = 10;
          else tickCount = 8;

          const ticks: TickInfo[] = [];
          for (let i = 0; i <= tickCount; i++) {
            const value = min + (range * i) / tickCount;
            ticks.push({
              value,
              position: axis === 'x' ? scaleX(value) : scaleY(value),
              label: Number.isInteger(value)
                ? value.toString()
                : value.toFixed(1),
            });
          }
          return ticks;
        },
      [scaleX, scaleY]
    );

    const xTicks = useMemo(
      () => generateTicks(minX, maxX, 'x'),
      [generateTicks, minX, maxX]
    );
    const yTicks = useMemo(
      () => generateTicks(minY, maxY, 'y'),
      [generateTicks, minY, maxY]
    );

    const zeroX = useMemo(() => scaleX(0), [scaleX]);
    const zeroY = useMemo(() => scaleY(0), [scaleY]);

    const functionPaths = useMemo(() => {
      return functions
        .map((funcDef) => {
          const func = createFunction(
            funcDef.definition,
            funcDef.coefficients || {}
          );
          if (!func) return null;

          const path = generateFunctionPath(func);
          if (!path) return null;

          const color = funcDef.color.startsWith('#')
            ? funcDef.color
            : `#${funcDef.color}`;

          return {
            id: funcDef.id,
            path,
            color,
          };
        })
        .filter(Boolean);
    }, [functions, generateFunctionPath]);

    const showZeroX = minX <= 0 && maxX >= 0;
    const showZeroY = minY <= 0 && maxY >= 0;

    return (
      <Paper
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          border: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ width: 'fit-content', height: 'fit-content' }}>
          <svg
            width={totalSize}
            height={totalSize}
            style={{ border: '1px solid #ddd' }}
            role="img"
            aria-label="Mathematical function graph"
          >
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            <rect
              x={margin}
              y={margin}
              width={graphSize}
              height={graphSize}
              fill="url(#grid)"
            />

            {xTicks.map((tick, i) => (
              <g key={`x-tick-${i}`}>
                <line
                  x1={tick.position}
                  y1={margin}
                  x2={tick.position}
                  y2={margin + graphSize}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
                <line
                  x1={tick.position}
                  y1={margin + graphSize - 5}
                  x2={tick.position}
                  y2={margin + graphSize + 5}
                  stroke="#333"
                  strokeWidth="2"
                />
                <text
                  x={tick.position}
                  y={margin + graphSize + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {yTicks.map((tick, i) => (
              <g key={`y-tick-${i}`}>
                <line
                  x1={margin}
                  y1={tick.position}
                  x2={margin + graphSize}
                  y2={tick.position}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
                <line
                  x1={margin - 5}
                  y1={tick.position}
                  x2={margin + 5}
                  y2={tick.position}
                  stroke="#333"
                  strokeWidth="2"
                />
                <text
                  x={margin - 10}
                  y={tick.position + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#666"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {showZeroX && (
              <line
                x1={zeroX}
                y1={margin}
                x2={zeroX}
                y2={margin + graphSize}
                stroke="#333"
                strokeWidth="2"
              />
            )}

            {showZeroY && (
              <line
                x1={margin}
                y1={zeroY}
                x2={margin + graphSize}
                y2={zeroY}
                stroke="#333"
                strokeWidth="2"
              />
            )}

            {functionPaths.map((pathData) => (
              <path
                key={pathData!.id}
                d={pathData!.path}
                stroke={pathData!.color}
                strokeWidth="2"
                fill="none"
              />
            ))}

            <rect
              x={margin}
              y={margin}
              width={graphSize}
              height={graphSize}
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
          </svg>
        </Box>
      </Paper>
    );
  }
);

GraphDisplay.displayName = 'GraphDisplay';

export default GraphDisplay;
