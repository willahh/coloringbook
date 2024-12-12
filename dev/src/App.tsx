import Layout from './layout/layout';
import Pages from './components/pages/pages';
import Header from './components/header';


function App() {
  return (
    <Layout
      header={<Header />}
      main={
        <main className="bg-gray-300">
          <p>Content</p>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </main>
      }
      side={<Pages />}
    />
  );
}

export default App;
