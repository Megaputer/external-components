import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { type ApiRequestor } from 'pa-typings';

interface Props {
  isEditor: boolean;
}

const EditorPublication: React.FC<Props> = ({ isEditor = false }) => (
  <div>Report mode: {isEditor ? 'Editor' : 'Publication'}</div>
);

export class EditorPublicationWidget implements ExternalDSWidget {
  constructor(private obj: WidgetArgs) {}

  render(parent: HTMLElement) {
    createRoot(parent).render(<EditorPublication isEditor={this.obj.isEditor} />);
  }

  updateData(requestor: ApiRequestor): void {}
  onUpdateAppearance() {}
  dispose() {}
}
