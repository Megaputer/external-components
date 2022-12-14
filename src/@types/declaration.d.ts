declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

interface ExternalDSWidget {
  dispose?(): void;
  onUpdateAppearance();
  render(parent: HTMLElement): void;
  updateData(requestor: ApiRequestor);
}

interface WidgetArgs {
  isEditor: boolean;
  setAppearance(appr: Record<string, any>): void;
  getAppearance(): Record<string, any>;
  openDrillDown(condition: TConditionNode, optional?: { navigate?: boolean }): void;
}
