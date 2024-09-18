import * as React from 'react';
import type { ApprValue } from 'pa-typings';
import { Typography, Grid, Stack, Switch } from '@mui/material';
import { Clock } from './Clock';

interface Props {
  setAppearance: (appr: Record<string, any>) => void;
  getApprValue(key: string): ApprValue | undefined;
  isEditor: boolean;
}

export const Appearance: React.FC<Props> = ({ setAppearance, getApprValue, isEditor }) => {
  const [format, setFormat] = React.useState<string>(getApprValue('format') as string || 'HH:mm:ss');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, flag: boolean) => {
    const format = flag ? 'hh:mm:ss A' : 'HH:mm:ss';
    setFormat(format);
    setAppearance({ format });
  };

  const font = getApprValue('font') as string;
  return (
    <Grid
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      {isEditor && (
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography>24 format</Typography>
          <Switch checked={format == 'hh:mm:ss A'} onChange={onChange} />
          <Typography>12 format</Typography>
        </Stack>
      )}
      <Clock format={format} font={font} />
    </Grid>
  );
};
