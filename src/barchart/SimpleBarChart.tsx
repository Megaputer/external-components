import * as React from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';
import type { TConditionNode, ApiRequestor } from 'pa-typings';

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
}

export const SimpleBarChart: React.FC<Props> = ({ requestor, args }) => {
  const [data, setData] = React.useState<{ name: string, total: number }[]>([]);
  const [columns, setColumns] = React.useState<{ name: string, id: number }[]>([]);
  const [colId, setColId] = React.useState(-1);
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      let dsInfo = await requestor.info(guid);

      const columns = dsInfo.columns.map((c: any) => ({ name: c.title, id: c.id }));
      if (columns.length) {
        setColId(columns[0].id);
        setColumns(dsInfo.columns.map((c: any) => ({ name: c.title, id: c.id })));
      }
    };
    fetchData();
  }, [requestor]);

  React.useEffect(() => {
    const getValues = async () => {
      const distinctWrapperGuid = await requestor
        .distinct({ wrapperGuid: wrapperGuid.current.wrapperGuid, columnId: colId })
        .wrapperGuid();

      const dsInfo = await requestor.info(distinctWrapperGuid);
      const values = await requestor.values({
        offset: 0,
        rowCount: dsInfo.rowCount,
        wrapperGuid: distinctWrapperGuid.wrapperGuid
      });
      setData(values.table!.map((v: any) => ({ name: v[0], total: v[1] })));
    };
    if (wrapperGuid.current && colId != -1)
      getValues();
  }, [colId]);

  const onClick = ({ activePayload }: CategoricalChartState) => {
    if (activePayload && colId != -1) {
      const value = activePayload[0].payload.name;
      const condition: TConditionNode = {
        borderCond: 1,
        dVal: value,
        dVal2: value + 1,
        columnName: columns[colId].name
      };
      args?.openDrillDown(condition, {});
    }
  }

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
          displayEmpty
          value={colId}
          onChange={(event) => setColId(event.target.value as number)}
        >
          {columns.map(c => (<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>))}
        </Select>
      </FormControl>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            onClick={onClick}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill={'#00a0fc'} label='Total'>
              {data.map((_: any, i: number) => <Cell key={`cell-${i}`} fill={getRandomColor()} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
