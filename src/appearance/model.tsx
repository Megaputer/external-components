import { createRoot, Root } from 'react-dom/client';
import type { ApiRequestor, IWidget, WidgetArgs, ApprTab } from 'pa-typings';

import { Appearance } from './view';

class AppearanceWidget implements IWidget {
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
    this.root = createRoot(parent);
    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<Appearance
        setAppearance={this.args.setAppearance}
        getApprValue={this.args.getApprValue}
        isEditor={this.args.isEditor}
      />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new AppearanceWidget(args);
