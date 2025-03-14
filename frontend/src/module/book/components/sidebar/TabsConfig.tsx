import {
  FaImages,
  FaShapes,
  FaFont,
  FaPencilAlt,
  FaUpload,
} from 'react-icons/fa';
import { IoColorPalette } from 'react-icons/io5';

import ShapesPanel from './ShapesPanel';
import PersonnelPanel from './PersonnelPanel';
import IllustrationsPanel from './IllustrationsPanel';

export enum TabType {
  Illustrations,
  Elements,
  Textes,
  Formes,
  Dessiner,
  Colorier,
  Personnel,

  // Personal,
  // Element,
  // Text,
  // Shape,
  // Background,
  // Import,
  // Current,
  // Load,
  // Parameters,
  // Draw,
}

export interface Tab {
  id: TabType;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const iconClassName = 'w-6 h-6';

export const TabsConfig: Tab[] = [
  {
    id: TabType.Illustrations,
    label: 'Illustrations',
    icon: <FaImages className={iconClassName} />,
    active: true,
    content: <IllustrationsPanel />,
  },
  {
    id: TabType.Personnel,
    label: 'Personnel',
    icon: <FaUpload className={iconClassName} />,
    active: false,
    content: <PersonnelPanel />,
  },
  // {
  //   id: TabType.Elements,
  //   label: 'Elements',
  //   icon: <FaShapes className={iconClassName} />,
  //   active: false,
  //   content: <ShapesPanel />,
  // },
  {
    id: TabType.Textes,
    label: 'Textes',
    icon: <FaFont className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
  {
    id: TabType.Formes,
    label: 'Formes',
    icon: <FaShapes className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
  {
    id: TabType.Dessiner,
    label: 'Dessiner',
    icon: <FaPencilAlt className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
  {
    id: TabType.Colorier,
    label: 'Colorier',
    icon: <IoColorPalette className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
];

export const TabsConfigDesktop: Tab[] = [
  {
    id: TabType.Illustrations,
    label: 'Illustrations',
    icon: <FaImages className={iconClassName} />,
    active: true,
    content: <IllustrationsPanel />,
  },
  {
    id: TabType.Personnel,
    label: 'Personnel',
    icon: <FaUpload className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
  // {
  //   id: TabType.Elements,
  //   label: 'Elements',
  //   icon: <FaShapes className={iconClassName} />,
  //   active: false,
  //   content: <ShapesPanel />,
  // },
  {
    id: TabType.Textes,
    label: 'Textes',
    icon: <FaFont className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
  {
    id: TabType.Formes,
    label: 'Formes',
    icon: <FaShapes className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
  {
    id: TabType.Dessiner,
    label: 'Dessiner',
    icon: <FaPencilAlt className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
  {
    id: TabType.Colorier,
    label: 'Colorier',
    icon: <IoColorPalette className={iconClassName} />,
    active: false,
    content: <ShapesPanel />,
  },
];
