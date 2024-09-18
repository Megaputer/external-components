import * as React from 'react';
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
import type { TConditionNode, ApiRequestor, WidgetArgs } from 'pa-typings';
import { Select, type Column } from 'Select';

import { variantToDate } from 'helper';

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
  condition?: TConditionNode;
  setCondition: (cond: TConditionNode) => void;
}

type DataType = {
  name: string;
  total: number;
  value: string | number;
  color: string;
};

export const BarChartView: React.FC<Props> = ({ requestor, args, setCondition }) => {
  const [data, setData] = React.useState<DataType[]>([]);
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [colId, setColId] = React.useState(-1);
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const ref = React.useRef<HTMLDivElement>(null);
  const colorsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);

      const columns = dsInfo.columns
        .filter(c => c.type != 'Text')
        .map((c) => ({ name: c.title, id: c.id, type: c.type }));
      if (columns.length) {
        colId == -1 && setColId(columns[0].id);
        setColumns(columns);
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
      const countColors = colorsRef.current.length;
      if (values.rowIDs.length > countColors) {
        values.rowIDs.forEach((_: unknown, i) => {
          const needIndex = countColors > i ? countColors + i : i;
          colorsRef.current[needIndex] = getRandomColor();
        });
      }

      setData(values.rowIDs.map((idx) => {
        let tableValue = values.table?.[+idx]?.[0] || 'missing';
        let value = tableValue;
        if (columns[colId].type == 'DateTime')
          tableValue = variantToDate(+tableValue).toLocaleDateString('ru-RU');
        if (columns[colId].type == 'String')
          value = values.textIDs![0]?.[idx];
        const total = Number(values.table?.[+idx][1]);
        return { name: tableValue.toString(), total, value, color: colorsRef.current[+idx] };
      }));
    };
    if (wrapperGuid.current && colId != -1)
      getValues();
  }, [colId, wrapperGuid.current]);

  const onDrillDown = (data: any, navigate?: boolean) => {
    if (data?.payload && colId != -1) {
      const value = data.payload.value;
      const condition: TConditionNode = {
        borderCond: 1,
        dVal: value,
        dVal2: value + 1,
        columnName: columns[colId].name
      };
      if (data?.payload?.name == 'missing') {
        condition.dVal2 = undefined;
        condition.borderCond = undefined;
      }
      setCondition(condition);
      args?.openDrillDown(condition, { navigate });
    }
  };

  return (
    <>
      <Select
        ref={ref}
        colId={colId}
        setColId={setColId}
        columns={columns}
      />
      { ref.current && (
        <div style={{ width: '100%', height: `calc(100% - ${ref.current.clientHeight}px)` }}>
          <ResponsiveContainer debounce={100}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey='total'
                fill={'#00a0fc'}
                label='Total'
                onClick={(data) => onDrillDown(data)}
                onDoubleClick={(data) => onDrillDown(data, true)}
              >
                {data.map((d: DataType) => <Cell key={`cell-${d.name}`} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
