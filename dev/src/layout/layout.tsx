import './layout.css';

interface LayoutProps {
  header: React.ReactNode;
  main: React.ReactNode;
  side: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, main, side }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {side}
        {main}
      </div>
      {header}
    </div>
  );
};

export default Layout;
