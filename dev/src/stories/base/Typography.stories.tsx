export default {
  title: 'Coloring book/base/Typographie',
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
      className={`${className} grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-8`}
    >
      <div>
        <h1 className={headingCls}>Titres</h1>
        <code className="text-gray-500 text-xs">head-1</code>
        <h1 className="heading-1">Titre de niveau 1</h1>

        <code className="text-gray-500 text-xs">head-2</code>
        <h1 className="heading-2">Titre de niveau 2</h1>

        <code className="text-gray-500 text-xs">head-3</code>
        <h1 className="heading-3">Titre de niveau 3</h1>

        <code className="text-gray-500 text-xs">head-4</code>
        <h1 className="heading-4">Titre de niveau 4</h1>
      </div>

      <div>
        <h1 className={headingCls}>Typographie de base</h1>
        <p className="text-lg mb-2 dark:text-white">Paragraphe normal</p>
        <p className="text-base italic mb-2 dark:text-white">
          Paragraphe en italique
        </p>
        <p className="text-sm font-bold mb-2 dark:text-white">Texte en gras</p>
        <p className="text-xs underline mb-2 dark:text-white">Texte souligné</p>
        <p className="text-xs line-through mb-2 dark:text-white">Texte barré</p>
      </div>

      <div>
        <h1 className={headingCls}>Couleurs</h1>

        <div className="grid grid-cols-2 gap-4 place-items-start">
          <p className="text-primary-500">Primary</p>
          <div className="bg-primary-500 p-2 rounded-md text-xs">Primary</div>

          <p className="text-secondary-500">Secondary</p>
          <div className="bg-secondary-500 p-2 rounded-md text-xs">
            Secondary
          </div>

          <p className="text-success-500">Success</p>
          <div className="bg-success-500 p-2 rounded-md text-xs">Success</div>

          <p className="text-warn-500">Warn</p>
          <div className="bg-warn-500 p-2 rounded-md text-xs">Warn</div>

          <p className="text-error-500">Error</p>
          <div className="bg-error-500 p-2 rounded-md text-xs">Error</div>
        </div>
      </div>

      <div>
        <h1 className={headingCls}>Tailles de police</h1>
        <p className="text-xs mb-1 dark:text-white">Texte très petit</p>
        <p className="text-sm mb-1 dark:text-white">Texte petit</p>
        <p className="text-base mb-1 dark:text-white">Texte de base</p>
        <p className="text-lg mb-1 dark:text-white">Texte grand</p>
        <p className="text-xl mb-1 dark:text-white">Texte très grand</p>
        <p className="text-2xl mb-1 dark:text-white">Texte encore plus grand</p>
        <p className="text-3xl mb-1 dark:text-white">Enorme</p>
        <p className="text-4xl mb-1 dark:text-white">Très énorme</p>
        <p className="text-5xl mb-1 dark:text-white">Monstrueux</p>
        <p className="text-6xl dark:text-white">Gigantesque</p>
      </div>
    </div>
  );
};

export const Typographie = () => {
  // const isDarkMode = useDarkMode();
  // const themeColor = isDarkMode ? 'dark' : '';
  // console.log('themeColor', themeColor)
  return (
    // <div className={`${themeColor} overflow-y-scroll`}>
    <div
      className={`overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-4`}
      style={{ height: '97vh' }}
    >
      <ContentHtml className="p-4"></ContentHtml>
      <ContentHtml className="dark bg-black p-4"></ContentHtml>
    </div>
  );
};

// Typographie.storyName = 'Tout sur la typographie';
