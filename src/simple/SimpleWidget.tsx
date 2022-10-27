import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { type ApiRequestor } from 'pa-typings';

import * as style from 'simple/styles.scss';

export class SimpleWidget implements ExternalDSWidget {
  updateData(requestor: ApiRequestor): void {}
  onUpdateAppearance() {}

  render(parent: HTMLElement) {
    parent.className = style.parent;
    createRoot(parent).render(<div className={style.simple}>This simple widget</div>);
  }

  dispose() {
    console.log('Call dispose: ', this.constructor.name);
  }
}
