import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor } from 'pa-typings';

import { SimpleTable } from 'table/SimpleTable';
import * as styles from './styles.scss';

export class DSWidgetTable implements ExternalDSWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private condition: TConditionNode | undefined = undefined;

  constructor(private args: WidgetArgs) {}

  updateData(requestor: ApiRequestor): void {
    this.requestor = requestor;
    this.updateContainer();
  }

  onUpdateAppearance() {}

  render(parent: HTMLElement) {
    this.updateContainer();
    parent.className = styles.parent;
    this.root = createRoot(parent);
    this.updateContainer();
  }

  hasSelection(): boolean {
    return !!this.condition;
  }

  setCondition = (cond: TConditionNode) => {
    this.condition = cond;
  }

  selectByDDExpression(cond?: TConditionNode) {
    this.condition = cond;
  }

  private updateContainer() {
    if (this.root)
      this.root.render(<SimpleTable setCondition={this.setCondition}  requestor={this.requestor!} args={this.args} />);
  }

  dispose(): void {
  }
}
