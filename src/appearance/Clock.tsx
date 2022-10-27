import * as React from 'react';
import Moment from 'react-moment';

export const Clock: React.FC<{ format?: string }> = (props) => {
  const { format = 'HH:mm:ss' } = props;
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    const tick = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [format]);

  return (
    <Moment style={{ fontSize: '48px' }} format={format}>{currentTime}</Moment>
  );
}
