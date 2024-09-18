import { createRoot } from 'react-dom/client';
import * as style from './styles.scss';

import type { IWidget, WidgetArgs, ApprTab } from 'pa-typings';

class SimpleWidget implements IWidget {
  constructor(private args: WidgetArgs) {}

  updateData(): void {}
  onUpdateAppearance() {}

  render(parent: HTMLElement) {
    parent.className = style.parent;
    createRoot(parent).render(<div className={style.simple}>This simple widget</div>);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new SimpleWidget(args);
