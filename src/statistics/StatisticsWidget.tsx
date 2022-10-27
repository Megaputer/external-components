import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { type ApiRequestor } from 'pa-typings';
import { Statistics } from 'statistics/Statistics';

import * as styles from 'statistics/styles.scss';

export class StatisticsWidget implements ExternalDSWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;

  constructor(private obj: WidgetArgs) {}

  updateData(requestor: ApiRequestor): void {
    this.requestor = requestor;
    this.updateContainer();
  }

  onUpdateAppearance() {
    this.updateContainer();
  }

  render(parent: HTMLElement) {
    parent.className = styles.parent;
    this.root = createRoot(parent);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(
        <Statistics requestor={this.requestor} isEditor={this.obj.isEditor} />);
  }

  dispose(): void {}
}
