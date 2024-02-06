import * as React from 'react';
import type { TConditionNode, ApiRequestor, Table } from 'pa-typings';
import { Group, MantineProvider } from '@mantine/core';
import { DatePicker, DayProps } from '@mantine/dates';
import { dateToVariant, variantToDate } from 'helper';

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
  condition?: TConditionNode;
  setCondition: (cond: TConditionNode) => void;
}

export const Calendar: React.FC<Props> = ({ requestor, args, setCondition }) => {
  const wrapperGuidRef = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [map, setMap] = React.useState<Map<number, number>>(new Map());
  const [date, setDate] = React.useState<Date>(new Date());

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

      if(!dsInfo.rowCount)
        return;

      const columnIndexes = dsInfo.columns.filter(c => c.type === 'DateTime').map(c => c.id);
      const values = await requestor.values({
        columnIndexes,
        offset: 0,
        rowCount: 1,
        wrapperGuid: guid.wrapperGuid
      });
      const startDate = Array.from(getData(values), ([v, _]) => v)[0];
      const date = variantToDate(startDate);
      setDate(date);
    }
    fetchData();
  }, [requestor]);

  const filter = (action: number, month: number, year: number, wrapperGuid: string) => requestor.filter({
    action,
    columnId: 0,
    day: 1,
    delta: 0.000001,
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

  React.useEffect(() => {
    if(!wrapperGuidRef.current.wrapperGuid) {
      return;
    }

    const fetchData = async () => {
      const { wrapperGuid } = wrapperGuidRef.current;

      const filterOnFirstToInf = await filter(5, date.getMonth() + 1, date.getFullYear(), wrapperGuid);
      const filterOnLastToFirst = await filter(
        3,
        date.getMonth() >= 11 ? 1 : date.getMonth() + 2,
        date.getMonth() >= 11 ? date.getFullYear() + 1 : date.getFullYear(),
        filterOnFirstToInf.wrapperGuid
      );

      const dsInfo = await requestor.info(filterOnLastToFirst);

      const values = dsInfo.rowCount > 0
        ? await requestor.values({
            offset: 0,
            rowCount: dsInfo.rowCount,
            wrapperGuid: filterOnLastToFirst.wrapperGuid
        })
        : { rowIDs: [] };

      const data = getData(values);
      setMap(data);
    };
    fetchData();
  }, [date.getMonth(), date.getFullYear()]);

  const onDrillDown = (date: Date | null) => {
    if (!date)
      return;

    const value = dateToVariant(date);
    const condition: TConditionNode = {
      borderCond: 1,
      dVal: value,
      dVal2: value + 1,
      columnName: 'Date'
    };

    setCondition(condition);
    args?.openDrillDown(condition);
  }

  const getDayProps = (date: Date): Partial<DayProps> => {
    const data = dateToVariant(date);
    if (!map.has(data))
      return {};

    const count = map.get(data) || 0;
    return {
      sx: (theme) => ({
        backgroundColor: theme.colors.blue[count > 10 ? 10 : count],
        color: count > 3 ? theme.white : theme.black,
        ...theme.fn.hover({ backgroundColor: theme.colors.red[7] }),
      }),
    };
  }

  return (
    <MantineProvider>
      <Group position="center">
        <DatePicker
          date={date}
          onDateChange={setDate}
          onChange={onDrillDown}
          numberOfColumns={1}
          hideOutsideDates
          getDayProps={getDayProps}
        />
      </Group>
    </MantineProvider>
  );
}
