import { createRoot, Root } from 'react-dom/client';
import type { ApiRequestor, IWidget, WidgetArgs, ApprTab } from 'pa-typings';

import { Statistics } from './view';

import * as styles from './styles.scss';

class StatisticsWidget implements IWidget {
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
    parent.className = styles.parent;
    this.root = createRoot(parent);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<Statistics requestor={this.requestor} />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new StatisticsWidget(args);
