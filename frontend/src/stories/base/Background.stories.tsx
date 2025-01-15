export default {
  title: 'Coloring book/base/Fonds',
  parameters: {
    darkMode: {
      stylePreview: true,
    },
    options: {
      showPanel: false,
    },
  },
};

const ContentHtml = ({ className }: { className?: string }) => {
  const headingCls = 'text-4xl font-bold dark:text-white';
  return (
    <div className={`${className}`}>
      <div>
        <h1 className={headingCls}>Couleurs</h1>

        <div>
          <code className="text-gray-500 text-xs">primary color</code>
          <div className="flex gap-1">
            <div className="w-10 h-10 bg-primary-50 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-100 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-200 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-300 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-400 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-500 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-600 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-700 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-800 rounded-sm"></div>
            <div className="w-10 h-10 bg-primary-900 rounded-sm"></div>
          </div>
        </div>

        <div>
          <code className="text-gray-500 text-xs">secondary color</code>
          <div className="flex gap-1">
            <div className="w-10 h-10 bg-secondary-50 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-100 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-200 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-300 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-400 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-500 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-600 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-700 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-800 rounded-sm"></div>
            <div className="w-10 h-10 bg-secondary-900 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* <div>
        <h1 className={headingCls}>Dégradés</h1>

        <div>
          <code className="text-gray-500 text-xs">primary color</code>
          <div className="flex gap-1">
            <div className="w-full h-10 bg-primary-500 rounded-sm"></div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export const Fonds = () => {
  return (
    <div
      className={`overflow-y-scroll grid grid-cols-1 md:grid-cols-2`}
      style={{ height: '97vh' }}
    >
      <ContentHtml className="p-4"></ContentHtml>
      <ContentHtml className="dark bg-black p-4"></ContentHtml>
      <ContentHtml className="dark bg-primary-900 p-4"></ContentHtml>
    </div>
  );
};
