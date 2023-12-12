import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor } from 'pa-typings';
import { Calendar } from './Calendar';


export class CalendarWidget implements ExternalDSWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private condition: TConditionNode | undefined = undefined;

  constructor(private args: WidgetArgs) {}

  updateData(requestor: ApiRequestor): void {
    this.requestor = requestor;
    this.updateContainer();
  }

  onUpdateAppearance() {
    this.updateContainer();
  }

  render(parent: HTMLElement) {
    this.root = createRoot(parent);
    this.updateContainer();
  }

  setCondition = (cond: TConditionNode) => {
    this.condition = cond;
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(
        <Calendar setCondition={this.setCondition} requestor={this.requestor} args={this.args} />);
  }

  dispose(): void { }
}
