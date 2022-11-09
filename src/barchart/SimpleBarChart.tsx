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

type DataType = {
  name: string,
  total: number,
  value: string | number,
  color: string
};

export const SimpleBarChart: React.FC<Props> = ({ requestor, args }) => {
  const [data, setData] = React.useState<DataType[]>([]);
  const [columns, setColumns] = React.useState<{ name: string, id: number, type: string }[]>([]);
  const [colId, setColId] = React.useState(-1);
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      let dsInfo = await requestor.info(guid);

      const columns = dsInfo.columns.map((c: any) => ({ name: c.title, id: c.id }));
      if (columns.length) {
        colId == -1 && setColId(columns[0].id);
        setColumns(dsInfo.columns.map((c: any) => ({ name: c.title, id: c.id, type: c.type })));
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
      setData(values.rowIDs.map((idx) => {
        const tableValue = values.table?.[idx]?.[0];
        const value = columns[colId].type == 'String' ? values.textIDs?.[0]?.[idx] : tableValue;
        const total = Number(values.table?.[idx][1]);
        return { name: tableValue!.toString(), total, value, color: getRandomColor() };
      }));
    };
    if (wrapperGuid.current && colId != -1)
      getValues();
  }, [colId, wrapperGuid.current]);

  const onClick = (data: CategoricalChartState) => {
    if (data?.activePayload && colId != -1) {
      const value = data.activePayload[0].payload.value;
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
              {data.map((d: DataType) => <Cell key={`cell-${d.name}`} fill={d.color} />)}
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
