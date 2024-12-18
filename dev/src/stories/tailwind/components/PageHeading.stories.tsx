import '../../../../public/tailwind.full.css'; // Importing the full tailwind css
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

export default {
  title: 'Coloring book/tailwind/PageHeading',
  parameters: {
    darkMode: {
      stylePreview: true,
    },
    options: {
      showPanel: false,
    },
  },
};

// https://tailwindui.com/components/application-ui/headings/page-headings#component-b137f49e14ad16c5709517f148fff270
const PageHeading = ({ className }: { className?: string }) => {
  return (
    <div className={`${className}`}>
      <div>
        <div>
          <nav aria-label="Back" className="sm:hidden">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <ChevronLeftIcon
                aria-hidden="true"
                className="-ml-1 mr-1 size-5 shrink-0 text-gray-500"
              />
              Back
            </a>
          </nav>
          <nav aria-label="Breadcrumb" className="hidden sm:flex">
            <ol role="list" className="flex items-center space-x-4">
              <li>
                <div className="flex">
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Jobs
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 text-gray-500"
                  />
                  <a
                    href="#"
                    className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Engineering
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 text-gray-500"
                  />
                  <a
                    href="#"
                    aria-current="page"
                    className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Back End Developer
                  </a>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Back End Developer
            </h2>
          </div>
          <div className="mt-4 flex shrink-0 md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
            >
              Edit
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageHeadingStory = () => {
  return (
    <div
      className={`overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-4`}
      style={{ height: '97vh' }}
    >
      <PageHeading className="p-4"></PageHeading>
      <PageHeading className="dark bg-black p-4"></PageHeading>
    </div>
  );
};

PageHeadingStory.storyName = 'PageHeading';
