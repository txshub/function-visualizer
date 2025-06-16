import React, { useCallback, useMemo } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface ColorOption {
  name: string;
  value: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Blue', value: '1976d2' },
  { name: 'Red', value: 'd32f2f' },
  { name: 'Green', value: '388e3c' },
  { name: 'Orange', value: 'f57c00' },
  { name: 'Purple', value: '7b1fa2' },
  { name: 'Teal', value: '00796b' },
  { name: 'Pink', value: 'c2185b' },
  { name: 'Brown', value: '5d4037' },
  { name: 'Indigo', value: '303f9f' },
  { name: 'Lime', value: '689f38' },
];

interface ColorSelectorProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = React.memo(
  ({ value, onChange }) => {
    const handleChange = useCallback(
      (event: SelectChangeEvent) => {
        onChange(event.target.value);
      },
      [onChange]
    );

    const colorValue = useMemo(() => {
      return value.startsWith('#') ? value : `#${value}`;
    }, [value]);

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select value={value} onChange={handleChange} displayEmpty>
            {colorOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: colorValue,
            border: '1px solid #ccc',
          }}
          aria-label={`Color preview: ${colorValue}`}
        />
      </Box>
    );
  }
);

ColorSelector.displayName = 'ColorSelector';

export default ColorSelector;
