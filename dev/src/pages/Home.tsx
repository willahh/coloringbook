// import { Link } from 'react-router';
import Layout from './layout';
import Button from '@/components/Button';

const Home: React.FC = () => {
  return (
    <Layout className="p-10 items-center justify-center w-full">
      <div className="w-96 bg-white rounded-md text-center p-10">
        <img src="coloring-book-logo.svg" alt="Logo" className="w-20 mb-4" />
        <h1 className="text-xl font-bold text-center mb-2">
          Welcome to ColoringBook
        </h1>
        <p className="text-center text-gray-600">
          Create, color, share: your coloring adventure begins here!
        </p>

        <Button>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Create new book</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Button>
      </div>
    </Layout>
  );
};

export default Home;
