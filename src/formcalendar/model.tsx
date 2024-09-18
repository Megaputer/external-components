import { createRoot, Root } from 'react-dom/client';
import type { TConditionNode, ApiRequestor, IWidget, FormValue, WidgetArgs, FormValueBasic, ApprTab } from 'pa-typings';

import { FormCalendar } from './view';

class FormCalendarWidget implements IWidget {
  private requestor: ApiRequestor | null = null;
  private root: Root | null = null;
  private condition: TConditionNode | undefined = undefined;
  private formValue: FormValue;

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

  getValue = () => {
    return this.formValue ?? '';
  };

  setValue = (val: FormValueBasic[]) => {
    this.formValue = val;
    this.updateContainer();
  };

  reset = () => {
    this.formValue = '';
    this.updateContainer();
  };

  getFormHandler() {
    return {
      setValue: this.setValue,
      getValue: this.getValue,
      reset: this.reset,
    };
  }

  private updateContainer() {
    if (this.root && this.requestor)
      this.root.render(<FormCalendar
        getValue={this.getValue}
        setValue={this.setValue}
      />);
  }

  getApprSchema(): ApprTab[] | undefined {
    return undefined;
  }

  dispose(): void { }
}

export const create = (args: WidgetArgs) => new FormCalendarWidget(args);
