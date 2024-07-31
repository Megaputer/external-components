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
  const getDate = () => {
    const date = getValue() as number;
    return date ? variantToDate(date) : null;
  }

  return (
    <MantineProvider>
      <Group position="center">
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
          hideOutsideDates
          onChange={(date: Date) => setValue(dateToVariant(date) as unknown as FormValueBasic[])}
          value={getDate()}
        />
      </Group>
    </MantineProvider>
  );
}
