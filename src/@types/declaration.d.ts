declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

interface IWidget {
  dispose(): void;
  onUpdateAppearance();
  render(parent: HTMLElement): void;
  updateData(requestor: ApiRequestor);
  hasSelection?(): boolean;
  selectByDDExpression?(cond?: TConditionNode, isUserCond?: boolean);
}

interface WidgetArgs {
  isEditor: boolean;
  setAppearance(appr: Record<string, any>): void;
  getApprValue(key: string): ApprValue | undefined;
  openDrillDown(condition: TConditionNode, optional?: { navigate?: boolean }): void;
}

type ApprValue = string | number;

interface ApprCtrl {
  apprKey: string;
  label: string;
  defaultValue?: ApprValue;
  type: string;
  props?: Record<string, any>;
}

interface ApprTab {
  label: string;
  icon?: string;
  items: ApprCtrl[];
}
