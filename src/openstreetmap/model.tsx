import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, WidgetArgs, ApprTab } from 'pa-typings';

import { OpenStreetMap } from './view';

class OpenStreetMapWidget implements IWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private condition: TConditionNode | undefined = undefined;
  private height = 0;
  private width = 0;
  private observer: ResizeObserver | null = null;

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
    this.height = parent.parentElement?.clientHeight || 0;
    this.width = parent.parentElement?.clientWidth || 0;
    this.observer = new ResizeObserver((entry) => {
      entry.forEach(e => {
        if (e.contentBoxSize) {
          this.height = e.contentRect.height;
          this.width = e.contentRect.width;
          this.updateContainer();
        }
      })
    });
    this.observer.observe(parent.parentElement!);

    this.updateContainer();
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(
        <OpenStreetMap
          requestor={this.requestor}
          height={this.height}
          width={this.width}
          isEditor={this.args.isEditor}
          setAppearance={this.args.setAppearance}
          getApprValue={this.args.getApprValue}
        />
      );
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new OpenStreetMapWidget(args);
