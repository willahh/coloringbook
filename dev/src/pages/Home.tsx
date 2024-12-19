// import { Link } from 'react-router';
import Layout from './layout';
import Button from '@components/Button';
import AnimatedText from '@/components/AnimatedText';

import {
  BookOpenIcon,
} from '@heroicons/react/24/solid';

const MainCard = () => {
  return (
    <div className="rounded-md text-center p-10 " style={{ width: '420px' }}>
      <div className="flex flex-col justify-between items-center gap-3">
        <img
          src="coloring-book-logo.svg"
          alt="Logo"
          className="w-80 inline-block"
        />
        {/* <AnimatedText enterClassName="delay-100">
      <h1 className="roboto-thin heading-1 text-white text-3xl">
        Welcome to <span className="roboto-light text-secondary-500">Coloringbook</span>
      </h1>
    </AnimatedText> */}
        <AnimatedText enterClassName="delay-200">
          <div className="">
            <div className="flex gap-2 items-center font-mono text-base justify-center">
              <span className="text-white">Create</span>
              <span className="text-primary-200 bg-primary-900 p-1 px-2 rounded-md shadow-xl border border-primary-800">
                color
              </span>
              <span className="text-white">share</span>
            </div>
          </div>
        </AnimatedText>
        <AnimatedText enterClassName="delay-300">
          <span className="heading-2 text-primary-400 text-white mb-0">
            Your coloring adventure begins here!
          </span>
        </AnimatedText>
        <AnimatedText enterClassName="delay-700">
          <div className="w-full mt-4">
            <Button className="flex justify-center w-full rounded-xl py-2 px-3">
              <BookOpenIcon aria-hidden="true" className="size-8" />
              <span>Create new book</span>
            </Button>
          </div>
        </AnimatedText>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <Layout className="p-10 items-center justify-center w-full">
      {/* <div className="grid grid-cols-7"> */}
      {/* <img src="/coloringbook/book_covers/book_cover_1.png" alt="" className='w-20 h-12'/>
        <img src="/coloringbook/book_covers/book_cover_2.png" alt="" className='w-20 h-12'/>
        <img src="/coloringbook/book_covers/book_cover_3.png" alt="" className='w-20 h-12'/>
        <img src="/coloringbook/book_covers/book_cover_4.png" alt="" className='w-20 h-12'/>
        <img src="/coloringbook/book_covers/book_cover_5.png" alt="" className='w-20 h-12'/>
        <img src="/coloringbook/book_covers/book_cover_6.png" alt="" className='w-20 h-12'/>
        <img src="/coloringbook/book_covers/book_cover_7.png" alt="" className='w-20 h-12'/> */}

      <div>
        {/* <img src="/coloringbook/book_covers/book_cover_6.png" alt="" className='w-20 h-12'/>
          <img src="/coloringbook/book_covers/book_cover_7.png" alt="" className='w-20 h-12'/> */}
        <MainCard />
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default HomePage;
