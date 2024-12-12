import Layout from './layout/layout';
import Pages from './components/pages/pages';
import Header from './components/header';

function App() {
  return (
    <Layout
      header={<Header />}
      main={
        <main className="flex-1 bg-gray-300">
          <p>Content</p>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </main>
      }
      side={<Pages className={``} />}
    />
  );
}

export default App;
