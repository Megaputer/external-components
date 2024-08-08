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

  private async getColumnOptions() {
    const { wrapperGuid } = await this.requestor!.wrapperGuid();

    if (!this.requestor)
      return [];

    const { columns = [] } = await this.requestor.info({ wrapperGuid })
    return columns.map(c => ({ label: c.title, value: c.id })) as unknown as { label: string; value: string; }[];
  }

  async updateApprSchema(schema: ApprTab[]): Promise<ApprTab[]> {
    schema = structuredClone(schema);

    const options = await this.getColumnOptions();
    if ('coordinates' == this.args.getApprValue('mode')) {
      const longitude = schema[0].items.find(i => i.apprKey === 'longitude');
      if (longitude?.props?.options)
        longitude.props.options = [...longitude.props.options, ...options];

      const latitude = schema[0].items.find(i => i.apprKey === 'latitude');
      if (latitude?.props?.options)
        latitude.props.options = [...latitude.props.options, ...options];

      schema[0].items = schema[0].items.filter(i => i.apprKey !== 'address');
    } else {
      const address = schema[0].items.find(i => i.apprKey === 'address');
      if (address?.props?.options)
        address.props.options = [...address.props.options, ...options];

      schema[0].items = schema[0].items.filter(i => !['longitude', 'latitude'].includes(i.apprKey));
    }
    return schema;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new OpenStreetMapWidget(args);
