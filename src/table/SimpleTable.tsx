import * as React from 'react';
import type { TConditionNode, ApiRequestor, ColumnInfo } from 'pa-typings';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';

import { joinAnd, joinOr } from 'helper';

interface Props {
  requestor: ApiRequestor;
  args?: WidgetArgs;
  setCondition: (cond: TConditionNode) => void;
}

export const SimpleTable: React.FC<Props> = ({ requestor, args, setCondition }) => {
  const [columns, setColumns] = React.useState<ColumnInfo[]>([]);
  const [rows, setRows] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [wrapperGuid, setWrapperGuid] = React.useState<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const rowsCount = React.useRef(0);

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);
      rowsCount.current = dsInfo.rowCount;
      setWrapperGuid(guid);
      setColumns(dsInfo.columns);
    };
    fetchData();
  }, [requestor]);

  React.useEffect(() => {
    const getValues = async () => {
      const offset = page * rowsPerPage;
      const rowCount = rowsCount.current < offset + rowsPerPage
        ? rowsCount.current - offset
        : rowsPerPage;
      const values = await requestor.values({
        columnIndexes: columns.map((c) => c.id),
        wrapperGuid: wrapperGuid.wrapperGuid,
        offset,
        rowCount
      });
      setRows(values.table);
    };
    if (wrapperGuid.wrapperGuid != '' && rowsCount.current)
      getValues();
  }, [wrapperGuid, page]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onDrillDown = async (selectedRow: number, navigate?: boolean ) => {
    const data = await requestor.values({
      wrapperGuid: wrapperGuid.wrapperGuid,
      columnIndexes: columns.map((c) => c.id),
      rowIDs: [selectedRow],
      rowCount: 100,
      offset: 0
    });

    const condition = joinOr(data.rowIDs.map((rowID: string, i: number) => {
      return joinAnd(columns.map((col, idx) => {
        const dVal = data.textIDs?.[idx]?.[rowID] || data.table?.[i]?.[idx];
        return { columnName: col.title, dVal };
      }));
    }));
    setCondition(condition);
    args?.openDrillDown(condition, { navigate });
  }

  return (
    <Paper square>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(c => <TableCell key={c.id}>{c.title}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .map((row: string[], i: number) => (
              <TableRow
                key={i}
                hover
                role='checkbox'
                tabIndex={-1}
                onClick={() => onDrillDown(i)}
                onDoubleClick={() => onDrillDown(i, true)}
              >
                {row.map((r: string, i: number) => <TableCell key={i} align="right">{r}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, 500]}
        component="div"
        count={rowsCount.current}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_: unknown, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
