module.exports = function ({ name, component }) {
  return (
`import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor } from 'pa-typings';

import { ${component.name} } from './${component.filename}';

class ${name} implements IWidget {
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

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<${component.name} requestor={this.requestor} />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new ${name}(args);`
);
}
