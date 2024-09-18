import * as React from 'react';
import Moment from 'react-moment';

interface Props {
  format?: string;
  font?: string;
}

export const Clock: React.FC<Props> = (props) => {
  const { format = 'HH:mm:ss' } = props;
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    const tick = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [format]);

  const style: React.CSSProperties = {};
  if (props.font) {
    const font = props.font.split(',');
    const [color] = font.splice(-1);
    const [fontFamily, fontSize, fontStyle = ''] = font;
    style.fontFamily = fontFamily;
    style.fontSize = `${fontSize}px`;
    style.fontWeight = fontStyle.includes('Bold') ? 'bold' : undefined;
    style.fontStyle = fontStyle.includes('Italic') ? 'italic' : undefined;
    style.textDecoration = fontStyle.includes('Underline') ? 'underline' : undefined;
    style.color = color;
  }

  return (
    <Moment style={style} format={format}>{currentTime}</Moment>
  );
};
