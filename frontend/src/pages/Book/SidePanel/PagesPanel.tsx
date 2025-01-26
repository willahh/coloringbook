import Pages from '@/components/pages/Pages';
import { PanelHeader } from './PanelHeader';
import { Page } from '@/domain/book';

export const PagesPanel: React.FC<{ className?: string; pages: Page[] }> = ({
  className, pages
}) => {
  return (
    <div className={`${className}`}>
      <PanelHeader>[icon] PagesPanel</PanelHeader>
      <Pages pages={pages} />
    </div>
  );
};
