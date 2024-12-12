import './App.css';
import Pages from './components/pages/pages';

function App() {
  return (
    <>
      <h1 className="text-red-500">Coloring book</h1>
      <Pages />
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
