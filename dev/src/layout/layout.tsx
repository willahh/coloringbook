import './layout.css';

interface LayoutProps {
  header: React.ReactNode;
  main: React.ReactNode;
  side: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, main, side }) => {
  return (
    <>
      <div className="min-h-screen grid container">
        {side}
        {main}
        {header}
      </div>
    </>
  );
};

export default Layout;