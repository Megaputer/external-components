import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab, ExternalWidgetFormatter } from 'pa-typings';

import { BarChartView } from './view';
import * as scss from './styles.scss';

class BarChartWidget implements IWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private condition?: TConditionNode;
  private formatter?: ExternalWidgetFormatter;

  constructor(private args: WidgetArgs) {}

  async updateData(requestor: ApiRequestor) {
    this.formatter = await this.args.getFormatter();
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

  hasSelection(): boolean {
    return !!this.condition;
  }

  setCondition = (cond: TConditionNode) => {
    this.condition = cond;
  };

  selectByDDExpression(cond?: TConditionNode) {
    this.condition = cond;
  }

  private updateContainer() {
    if (this.root && this.requestor && this.formatter)
      this.root.render(<BarChartView
        formatter={this.formatter}
        setCondition={this.setCondition}
        requestor={this.requestor}
        args={this.args}
      />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new BarChartWidget(args);
