import * as React from 'react';

interface Props {
  isEditor: boolean;
}

export const EditorPublication: React.FC<Props> = ({ isEditor = false }) => (
  <div>
    Report mode:
    {isEditor ? 'Editor' : 'Publication'}
  </div>
);
