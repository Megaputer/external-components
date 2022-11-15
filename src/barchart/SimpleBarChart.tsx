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
import type { TConditionNode, ApiRequestor } from 'pa-typings';
import { Select, type Column } from 'Select';

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
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [colId, setColId] = React.useState(-1);
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const ref = React.useRef<HTMLDivElement>(null);
  const colorsRef = React.useRef<string[]>([]);

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
      const countColors = colorsRef.current.length;
      if (values.rowIDs.length > countColors) {
        values.rowIDs.forEach((_: unknown, i) => {
          const needIndex = countColors > i ? countColors + i : i;
          colorsRef.current[needIndex] = getRandomColor();
        });
      }

      setData(values.rowIDs.map((idx) => {
        const tableValue = values.table?.[idx]?.[0];
        const value = columns[colId].type == 'String' ? values.textIDs?.[0]?.[idx] : tableValue;
        const total = Number(values.table?.[idx][1]);
        return { name: tableValue!.toString(), total, value, color: colorsRef.current[idx] };
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
      args?.openDrillDown(condition, { navigate });
    }
  }

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
                  dataKey="total"
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
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
