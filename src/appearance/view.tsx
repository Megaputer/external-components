import * as React from 'react';
import { Typography, Grid, Stack, Switch } from '@mui/material';
import { Clock } from './Clock';

interface Props {
  setAppearance: (appr: Record<string, any>) => void;
  getAppearance: () => Record<string, any>;
  isEditor: boolean;
}

export const Appearance: React.FC<Props> = ({ setAppearance, getAppearance, isEditor }) => {
  const [format, setFormat] = React.useState<string>('HH:mm:ss');

  React.useEffect(() => {
    const format = getAppearance().format;
    setFormat(format);
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, flag: boolean) => {
    const format = flag ? 'hh:mm:ss A' : 'HH:mm:ss';
    setFormat(format);
    setAppearance({ format });
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {isEditor && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>24 format</Typography>
            <Switch checked={format == 'hh:mm:ss A'} onChange={onChange} />
          <Typography>12 format</Typography>
        </Stack>
      )}
      <Clock format={format} />
    </Grid>
  );
}
