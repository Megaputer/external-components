import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab } from 'pa-typings';

import { Calendar } from './view';

class CalendarWidget implements IWidget {
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
    this.updateContainer();
  };

  selectByDDExpression(cond?: TConditionNode) {
    this.condition = cond;
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<Calendar
        setCondition={this.setCondition}
        condition={this.condition}
        requestor={this.requestor}
        args={this.args}
      />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new CalendarWidget(args);
