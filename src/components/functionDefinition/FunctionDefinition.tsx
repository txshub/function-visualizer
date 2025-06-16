import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import Piece from './Piece';
import InfoTooltip from './InfoTooltip';
import Coefficients from './Coefficients';

interface FunctionDefinitionProps {
  value: string;
  onChange: (value: string) => void;
  coefficients?: Record<string, number>;
  onCoefficientsChange?: (coefficients: Record<string, number>) => void;
}

interface ParseResult {
  success: boolean;
  code: string;
  error?: string;
  coefficients: string[];
}

const FunctionDefinition: React.FC<FunctionDefinitionProps> = React.memo(
  ({ value, onChange, coefficients = {}, onCoefficientsChange }) => {
    const [localCoefficients, setLocalCoefficients] =
      useState<Record<string, number>>(coefficients);

    useEffect(() => {
      setLocalCoefficients(coefficients);
    }, [coefficients]);

    const extractCoefficients = (definition: string): string[] => {
      const coefficientPattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
      const matches = definition.match(coefficientPattern) || [];

      // Filter out reserved words and 'x'
      const reserved = ['x', 'log', 'pow', 'Math', 'return', 'function'];
      const unique = Array.from(new Set(matches)).filter(
        (match) => !reserved.includes(match)
      );

      return unique.sort();
    };

    const parseFunction = (
      definition: string,
      coeffs: Record<string, number>
    ): ParseResult => {
      try {
        if (!definition.trim()) {
          return {
            success: false,
            code: '',
            error: 'Empty function definition',
            coefficients: [],
          };
        }

        let cleanDef = definition.replace(/\s+/g, '');

        // Extract coefficients from definition
        const foundCoefficients = extractCoefficients(cleanDef);

        // Check for valid characters (including coefficient names)
        const validPattern = /^[x\d+\-*/().log,pow_a-zA-Z]*$/;
        if (!validPattern.test(cleanDef)) {
          return {
            success: false,
            code: '',
            error: 'Invalid characters in function',
            coefficients: foundCoefficients,
          };
        }

        // Replace function names
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

        // Test the function with actual coefficient values
        try {
          const testCoeffs = { ...coeffs };
          // Initialize missing coefficients to 0
          foundCoefficients.forEach((coeff) => {
            if (!(coeff in testCoeffs)) {
              testCoeffs[coeff] = 0;
            }
          });

          const funcBody = `
          ${foundCoefficients.map((coeff) => `const ${coeff} = ${testCoeffs[coeff]};`).join('\n')}
          return ${cleanDef};
        `;

          // eslint-disable-next-line no-new-func
          const testFunc = new Function('x', funcBody);
          testFunc(1);
        } catch (e) {
          return {
            success: false,
            code: '',
            error: 'Invalid mathematical expression',
            coefficients: foundCoefficients,
          };
        }

        // Generate TypeScript code
        const coeffArgs =
          foundCoefficients.length > 0
            ? `, ${foundCoefficients.join(': number, ')}: number`
            : '';

        const tsCode =
          foundCoefficients.length > 0
            ? `function(x: number${coeffArgs}): number {\n  return ${cleanDef};\n}`
            : `function(x: number): number {\n  return ${cleanDef};\n}`;

        return { success: true, code: tsCode, coefficients: foundCoefficients };
      } catch (e) {
        return {
          success: false,
          code: '',
          error: 'Cannot interpret function',
          coefficients: [],
        };
      }
    };

    const result = useMemo(
      () => parseFunction(value, localCoefficients),
      [value, localCoefficients]
    );

    // Update coefficients when they change in the function
    useEffect(() => {
      if (result.coefficients.length > 0) {
        const newCoeffs = { ...localCoefficients };
        let hasChanges = false;

        // Add new coefficients with default value 0
        result.coefficients.forEach((coeff) => {
          if (!(coeff in newCoeffs)) {
            newCoeffs[coeff] = 0;
            hasChanges = true;
          }
        });

        // Remove coefficients no longer in use
        Object.keys(newCoeffs).forEach((coeff) => {
          if (!result.coefficients.includes(coeff)) {
            delete newCoeffs[coeff];
            hasChanges = true;
          }
        });

        if (hasChanges) {
          setLocalCoefficients(newCoeffs);
          onCoefficientsChange?.(newCoeffs);
        }
      } else if (Object.keys(localCoefficients).length > 0) {
        setLocalCoefficients({});
        onCoefficientsChange?.({});
      }
    }, [result.coefficients.join(','), value, onCoefficientsChange]);

    const handleCoefficientChange = useCallback(
      (coeff: string, inputValue: string) => {
        try {
          const numValue = parseFloat(inputValue);
          const finalValue =
            inputValue === '' || isNaN(numValue) ? 0 : numValue;

          const newCoeffs = { ...localCoefficients, [coeff]: finalValue };
          setLocalCoefficients(newCoeffs);
          onCoefficientsChange?.(newCoeffs);
        } catch (e) {
          // If parsing fails, just use 0
          const newCoeffs = { ...localCoefficients, [coeff]: 0 };
          setLocalCoefficients(newCoeffs);
          onCoefficientsChange?.(newCoeffs);
        }
      },
      [localCoefficients, onCoefficientsChange]
    );

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Piece value={value} onChange={onChange} />
          <InfoTooltip result={result} />
        </Box>
        <Coefficients
          coefficientNames={result.coefficients}
          values={localCoefficients}
          onChange={handleCoefficientChange}
        />
      </Box>
    );
  }
);

FunctionDefinition.displayName = 'FunctionDefinition';

export default FunctionDefinition;
