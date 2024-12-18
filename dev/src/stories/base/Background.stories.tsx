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
    <div
      className={`${className}`}
    >
      <div>
        <h1 className={headingCls}>Fonds</h1>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <code className="text-gray-500 text-xs">card-xs</code>
            <div className="bg-white rounded-md p-1 text-sm">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-s</code>
            <div className="bg-white rounded-md p-2 text-md">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-md</code>
            <div className="bg-white rounded-md p-3 text-lg">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-lg</code>
            <div className="bg-white rounded-md p-4 text-lg">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-xl</code>
            <div className="bg-white rounded-md p-5 text-lg">Carte</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <code className="text-gray-500 text-xs">card-xs</code>
            <div className="bg-white rounded-md p-xs text-sm">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-s</code>
            <div className="bg-white rounded-md p-s text-sm">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-md</code>
            <div className="bg-white rounded-md p-md text-md">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-lg</code>
            <div className="bg-white rounded-md p-lg text-lg">Carte</div>
          </div>
          <div>
            <code className="text-gray-500 text-xs">card-xl</code>
            <div className="bg-white rounded-md p-xl text-lg">Carte</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Fonds = () => {
  return (
    <div
      className={`overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-4`}
      style={{ height: '97vh' }}
    >
      <ContentHtml className="p-4"></ContentHtml>
      <ContentHtml className="dark bg-black p-4"></ContentHtml>
    </div>
  );
};
