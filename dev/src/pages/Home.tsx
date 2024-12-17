// import { Link } from 'react-router';
import Layout from './layout';
import Button from '@components/Button';
// import AddIcon from '@assets/icons/add.svg?react';

const HomePage: React.FC = () => {
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
        <p>TODO: Add lodash</p>

        <Button>
          {/* <AddIcon /> */}
          <span>Create new book</span>
          {/* <AddIcon /> */}
        </Button>
      </div>
    </Layout>
  );
};

export default HomePage;
