export enum TabType {
  Personal,
  Element,
  Text,
  Shape,
  Background,
  Import,
  Current,
  Load,
  Parameters,
}

export interface Tab {
  id: TabType;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  active: boolean;
  content: JSX.Element;
  description?: string;
}
