import * as React from 'react';
import { FormControl, MenuItem, Select as MuiSelect } from '@mui/material';

export type Column = { name: string; id: number; type?: string };

interface Props {
  colId: number;
  columns: Column[];
  setColId: (id: number) => void;
}

export const Select = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { columns, colId, setColId } = props;
  return (
    <div style={{ marginRight: 'auto' }} ref={ref}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <MuiSelect
          displayEmpty
          value={colId}
          onChange={(event) => setColId(event.target.value as number)}
        >
          {columns.map(c => (<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>))}
        </MuiSelect>
      </FormControl>
    </div>
  );
});
