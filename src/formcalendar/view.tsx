import * as React from 'react';
import type { FormValue, FormValueBasic } from 'pa-typings';
import { Group, MantineProvider } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

import { dateToVariant, variantToDate } from 'helper';

interface Props {
  getValue(): FormValue;
  setValue(val: FormValueBasic[]): Promise<void> | void;
}

export const FormCalendar: React.FC<Props> = ({ getValue, setValue }) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const value = getValue() as string;

  React.useEffect(() => {
    setDate(value ? new Date(value) : undefined);
  }, [value]);

  return (
    <MantineProvider>
      <Group position='center'>
        <DatePicker
          styles={(theme) => ({
            day: {
              '&[data-selected]': {
                backgroundColor: theme.colors.blue[4],
              },
              '&[data-selected]:hover': {
                backgroundColor: theme.colors.blue[4],
              },
              '&[data-weekend]': {
                fontWeight: 'bold'
              }
            },
          })}
          numberOfColumns={1}
          allowDeselect
          hideOutsideDates
          date={date}
          onDateChange={setDate}
          onChange={(date: Date) => {
            setValue(date?.toLocaleString('en-US') as unknown as FormValueBasic[]);
            setDate(date);
          }}
          value={value ? new Date(value) : null}
        />
      </Group>
    </MantineProvider>
  );
};
