interface PageProps {
  pageNumber: number;
}

const Page: React.FC<PageProps> = ({ pageNumber }) => {
  return (
    <div
      className="flex flex-col 
      w-10 h-16 w-14 h-20
      focus:outline-dashed focus:outline-2 focus:-outline-offset-4
     border-2 border-violet-500  rounded-md overflow-hidden shadow-md shadow-black
      
      
      transition duration-150 ease-in-out
      "
      tabIndex={0}
      onFocus={() => {
        console.log('on focus');
      }}
    >
      <div className="flex flex-1 bg-white"></div>
      <div className="bg-violet-500 text-xs p-0.5 text-right">{pageNumber}</div>
    </div>
  );
};

interface PagesProps {
  className?: string;
}
const Pages: React.FC<PagesProps> = ({ className }) => {
  return (
    <div>
      <aside className={`grid grid-cols-2 gap-4 p-4 ${className}`}>
        <Page pageNumber={1} />
        <Page pageNumber={2} />
        <Page pageNumber={3} />
        <Page pageNumber={4} />
        <Page pageNumber={5} />
        <Page pageNumber={6} />
      </aside>
    </div>
  );
};

export default Pages;
