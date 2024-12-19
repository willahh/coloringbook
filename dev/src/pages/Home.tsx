// import { Link } from 'react-router';
import Layout from './layout';
import Button from '@components/Button';
// import AddIcon from '@assets/icons/add.svg?react';

const HomePage: React.FC = () => {
  return (
    <Layout className="p-10 items-center justify-center w-full">
      <div
        className="rounded-md text-center p-10 
       
        
        "
        style={{ width: '467px' }}
      >
        <img
          src="coloring-book-logo.svg"
          alt="Logo"
          className="w-44 inline-block"
        />
        <div className="flex flex-col justify-between items-center p-6">
          <h1 className="roboto-thin heading-1 text-white text-3xl">
            Welcome to <span className="roboto-light">ColoringBook</span>
          </h1>
          <h2 className="heading-2 text-primary-400 text-xl">
            <span className="text-primary-400">Create</span>,{' '}
            <span className="text-pink-400">color</span>, <span className='text-'>share: <span className='text-white'>your coloring
            adventure begins here!</span></span>
          </h2>
        </div>
        <p className="card">TODO: Add lodash</p>
        <Button className="flex justify-center w-full mt-4 rounded-xl">
          {' '}
          {/* TODO: Use Link from react-router, maybe generate a <a> </a>*/}
          {/* <AddIcon /> */}
          <span>Create new book</span>
          {/* <AddIcon /> */}
        </Button>

        <form></form>
      </div>
    </Layout>
  );
};

export default HomePage;
