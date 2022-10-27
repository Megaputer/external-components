import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { type ApiRequestor } from 'pa-typings';
import { Typography, Grid, Stack, Switch } from '@mui/material';
import { Clock } from './Clock';

interface Props {
  setAppearance: (appr: Record<string, any>) => void;
  getAppearance: () => Record<string, any>;
  isEditor: boolean;
}

const WorkAppearance: React.FC<Props> = ({ setAppearance, getAppearance, isEditor }) => {
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

export class AppearanceWidget implements ExternalDSWidget {
  private root: Root | null = null;

  constructor(private args: WidgetArgs) {}

  updateData(requestor: ApiRequestor): void {
    this.updateContainer();
  }

  onUpdateAppearance() {
    this.updateContainer();
  }

  render(parent: HTMLElement) {
    this.root = createRoot(parent);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root)
      this.root.render(
        <WorkAppearance
          setAppearance={this.args.setAppearance}
          getAppearance={this.args.getAppearance}
          isEditor={this.args.isEditor}
        />
      );
  }

  dispose() {}
}
