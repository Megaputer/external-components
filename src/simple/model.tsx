import * as React from 'react';
import { createRoot } from 'react-dom/client';
import * as style from './styles.scss';

class SimpleWidget implements IWidget {
  constructor(private args: WidgetArgs) {}

  updateData(): void {}
  onUpdateAppearance() {}

  render(parent: HTMLElement) {
    parent.className = style.parent;
    createRoot(parent).render(<div className={style.simple}>This simple widget</div>);
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new SimpleWidget(args);
