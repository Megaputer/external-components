import * as React from 'react';
import { type ApiRequestor } from 'pa-typings';
import { Gauge } from '@ant-design/plots';
import { Select, type Column } from 'Select';
import * as scss from './styles.scss';

interface Props {
  requestor: ApiRequestor;
}

export const Statistics: React.FC<Props> = ({ requestor }) => {
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [colId, setColId] = React.useState(-1);
  const [wrapperGuid, setWrapperGuid] = React.useState('');
  const [range, setRange] = React.useState<number[]>([0, 0]);
  const [mean, setMean] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);

      const columns = dsInfo.columns
        .filter(c => c.type != 'String')
        .map((c) => ({ name: c.title, id: c.id }));

      if (columns.length) {
        setColId(columns[0].id);
        setColumns(columns);
      }
      setWrapperGuid(guid.wrapperGuid);
    };
    fetchData();
  }, [requestor]);

  React.useEffect(() => {
    const fetchMinMax = async () => {
      const stat = await requestor.statistics!({ wrapperGuid, columnId: colId });
      const range = [0, 0];
      for (const s of stat.basicStatistics) {
        if (s.value == undefined)
          continue;
        if (s.type == 'MINIMUM')
          range[0] = +s.value;
        if (s.type == 'MAXIMUM')
          range[1] = +s.value;
      }
      setRange(range);
    };
    if (wrapperGuid && colId != -1) {
      fetchMinMax();
    }
  }, [colId]);

  React.useEffect(() => {
    const fetchMean = async () => {
      const stat = await requestor.statistics!({ wrapperGuid, columnId: colId });
      let mean = 0;
      for (const s of stat.basicStatistics) {
        if (s.value != undefined && s.type == 'MEAN')
          mean = +s.value;
      }
      setMean(mean);
    };
    if (wrapperGuid && colId != -1) {
      fetchMean();
    }
  }, [colId, wrapperGuid]);

  const Normalizer = (min: number, max: number) => ({
    normalize: (x: number) => min + x * (max - min),
    denormalize: (x: number) => (x - min) / (max - min)
  });
  const gaugeNormalizer = Normalizer(range[0], range[1]);

  const config = {
    percent: gaugeNormalizer.denormalize(mean),
    range: {
      color: '#30BF78',
      width: 12,
    },
    meta: {
      percent: {
        tickInterval: 0.1,
        formatter: (x: string) => {
          const num = gaugeNormalizer.normalize(+x);
          return num.toFixed(2);
        }
      }
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        formatter: () => {
          return `Mean: ${mean.toFixed(2)}`;
        },
      },
      style: {
        fontSize: 60,
      },
    },
    gaugeStyle: {
      lineCap: 'round',
    }
  };

  return (
    <div className={scss.fullSize}>
      <Select
        ref={ref}
        colId={colId}
        setColId={setColId}
        columns={columns}
      />
      { ref.current && (
        <div style={{ width: '100%', height: `calc(100% - ${ref.current.clientHeight}px)` }}>
          <Gauge {...config} />
        </div>
      )}
    </div>
  );
};
