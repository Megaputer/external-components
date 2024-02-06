module.exports = function (options) {
  return (
`import * as React from 'react';
import type { ApiRequestor, Table } from 'pa-typings';
import './styles.css';

interface Props {
  requestor: ApiRequestor;
}

export const ${options.name}: React.FC<Props> = ({ requestor }) => {
  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [rowCount, setRowCount] = React.useState(0);
  const [rowColumn, setColumnCount] = React.useState(0);
  const [values, setValues] = React.useState<Table>({ rowIDs: [] });

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      let dsInfo = await requestor.info(guid);

      setColumnCount(dsInfo.columns.length);
      setRowCount(dsInfo.rowCount);

      const values = await requestor.values({
        offset: 0,
        rowCount: dsInfo.rowCount,
        wrapperGuid: guid.wrapperGuid
      });
      setValues(values);
    };
    fetchData();

  }, [requestor]);

  return (
    <div className='main'>
      <div className='column'>Data: {rowColumn} column(s)</div>
      <div className='row'>Data: {rowCount} row(s)</div>
    </div>
  );
}
`);
}
