interface PageProps {
  pageNumber: number;
}

const Page: React.FC<PageProps> = ({ pageNumber }) => {
  return (
    <div
      className="flex flex-col w-10 h-16 rounded-xs border-2 border-violet-500 focus:outline-dashed focus:outline-2 focus:-outline-offset-4"
      tabIndex={0}
      onFocus={() => {
        console.log('on focus');
      }}
    >
      <div className="flex flex-1"></div>
      <div className="bg-violet-500 text-xs p-0.5 text-right">{pageNumber}</div>
    </div>
  );
};

const Pages = () => {
  return (
    <aside className="grid grid-cols-2 gap-2">
      <Page pageNumber={1} />
      <Page pageNumber={2} />
      <Page pageNumber={3} />
      <Page pageNumber={4} />
      <Page pageNumber={5} />
      <Page pageNumber={6} />
    </aside>
  );
};

export default Pages;
