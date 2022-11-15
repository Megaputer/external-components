import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { type ApiRequestor } from 'pa-typings';
import { SimpleBarChart } from 'barchart/SimpleBarChart';
import * as scss from './styles.scss';

export class BarChartWidget implements ExternalDSWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;

  constructor(private args: WidgetArgs) {}

  updateData(requestor: ApiRequestor): void {
    this.requestor = requestor;
    this.updateContainer();
  }

  onUpdateAppearance() {
    this.updateContainer();
  }

  render(parent: HTMLElement) {
    parent.className = scss.parent;
    this.root = createRoot(parent);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<SimpleBarChart requestor={this.requestor} args={this.args} />);
  }

  dispose(): void {}
}
