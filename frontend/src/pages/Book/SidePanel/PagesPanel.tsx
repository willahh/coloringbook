import Pages from "@/components/pages/Pages";
import { PanelHeader } from './PanelHeader';

export const PagesPanel: React.FC<{ className?: string }> = ({ className }) => {
    return (
      <div className={`${className}`}>
        <PanelHeader>[icon] PagesPanel</PanelHeader>
        <Pages />
      </div>
    );
  };