import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { Tooltip } from './Tooltip';

interface Page {
  name: string;
  description?: string;
  href: string;
  current: boolean;
}
interface BreadCrumbProps {
  pages: Page[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = function ({ pages }) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Tooltip content="Accueil">
              <Link className="text-gray-400 hover:text-gray-500" to="/">
                <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                <span className="sr-only">Home</span>
              </Link>
            </Tooltip>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                aria-hidden="true"
                className="size-5 shrink-0 text-gray-400"
              />
              <Tooltip content={page.description}>
                <Link
                  to={page.href}
                  aria-current={page.current ? 'page' : undefined}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {page.name}
                </Link>
              </Tooltip>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
