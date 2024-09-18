import * as React from 'react';
import type { TConditionNode, ApiRequestor, Table, ColumnInfo, WidgetArgs } from 'pa-typings';
import { Group, MantineProvider } from '@mantine/core';
import { DatePicker, DayProps } from '@mantine/dates';
import { dateToVariant, variantToDate } from 'helper';

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
  condition?: TConditionNode;
  setCondition: (cond: TConditionNode) => void;
}

export const Calendar: React.FC<Props> = ({ requestor, args, setCondition, condition }) => {
  const wrapperGuidRef = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [map, setMap] = React.useState<Map<number, number>>(new Map());
  const [date, setDate] = React.useState<Date>(new Date());
  const [value, setValue] = React.useState<Date | undefined>();
  const [column, setColumn] = React.useState<ColumnInfo | undefined>();

  const getData = (values: Table) => {
    const map = new Map();
    values.rowIDs.forEach((_, idx) => {
      const value = values.table?.[idx]?.[0];
      const count = map.get(value) || 0;
      map.set(value, count + 1);
    });
    return map;
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuidRef.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);

      if (!dsInfo.rowCount)
        return;

      const columns = dsInfo.columns.filter(c => c.type === 'DateTime');
      if (!columns.length)
        return;

      setColumn(columns[0]);
      const values = await requestor.values({
        columnIndexes: columns.map(c => c.id),
        offset: 0,
        rowCount: 1,
        wrapperGuid: guid.wrapperGuid
      });
      const startDate = Array.from(getData(values), ([v, _]) => v)[0];
      const date = variantToDate(startDate);
      setDate(date);
    };
    fetchData();
  }, [requestor]);

  const filter = (action: number, columnId: number, day: number, month: number, year: number, wrapperGuid: string) => {
    return requestor.filter({
      action,
      columnId,
      day,
      delta: 0,
      howsearch: 0,
      matchCase: false,
      month,
      strValue: '',
      usePDL: false,
      useRegEx: false,
      value: 0,
      wrapperGuid,
      year,
      columnName: '',
      columnType: ''
    });
  };

  React.useEffect(() => {
    if (!wrapperGuidRef.current.wrapperGuid) {
      return;
    }

    const fetchData = async () => {
      const { wrapperGuid } = wrapperGuidRef.current;

      if (column == undefined)
        return;

      const filterOnFirstToInf = await filter(5, column.id, 1, date.getMonth() + 1, date.getFullYear(), wrapperGuid);

      const day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
      const year = date.getMonth() >= 11 ? date.getFullYear() + 1 : date.getFullYear();
      const month = date.getMonth() >= 11 ? 1 : date.getMonth() + 2;
      const filterOnLastToFirst = await filter(
        3,
        column.id,
        day,
        month,
        year,
        filterOnFirstToInf.wrapperGuid
      );

      const dsInfo = await requestor.info(filterOnLastToFirst);

      const values = dsInfo.rowCount > 0
        ? await requestor.values({
          offset: 0,
          columnIndexes: [column.id],
          rowCount: dsInfo.rowCount,
          wrapperGuid: filterOnLastToFirst.wrapperGuid
        })
        : { rowIDs: [] };

      const data = getData(values);
      setMap(data);
    };
    if (!isNaN(date.getTime()))
      fetchData();
  }, [date]);

  const onDrillDown = (date: Date | null) => {
    if (!date || !column)
      return;

    const value = dateToVariant(date);
    const condition: TConditionNode = {
      borderCond: 1,
      dVal: value,
      dVal2: value + 1,
      columnName: column.title
    };

    setValue(date);
    setCondition(condition);
    args?.openDrillDown(condition);
  };

  const getDayProps = (date: Date): Partial<DayProps> => {
    const data = dateToVariant(date);
    if (!map.has(data))
      return {};

    const count = map.get(data) || 0;
    return {
      sx: (theme) => ({
        backgroundColor: theme.colors.indigo[count > 9 ? 9 : count],
        color: count > 3 ? theme.white : theme.black,
        ...theme.fn.hover({ backgroundColor: theme.colors.blue[4] }),
      }),
    };
  };

  if (isNaN(date.getTime()))
    return <div>The value for the calendar is incorrect.</div>;

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
          date={date}
          onDateChange={setDate}
          onChange={onDrillDown}
          numberOfColumns={1}
          hideOutsideDates
          getDayProps={getDayProps}
          value={condition ? value : null}
        />
      </Group>
    </MantineProvider>
  );
};
