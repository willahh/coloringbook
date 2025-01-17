import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../layout';
import Logo from '@assets/coloring-book-logo-wide.svg?react';
import AnimatedText from '@/components/AnimatedText';
import BookCreationForm from './BookCreationForm';
import DescriptionSection from './DescriptionSection';
import UserBooks from './UserBooks';

const ContentDiv: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const handleCreateBookClick = () => {
    setShowForm(true);
  };
  const handleCancelClick = () => {
    setShowForm(false);
  };

  return (
    <div className=" text-white">
      <Logo className="mb-4 md:-ml-16 max-w-xs" />
      <AnimatedText enterClassName="delay-200">
        <div className="flex mb-4 gap-2 items-center text-md font-extralight">
          <span className="">Create</span>
          <span className="text-primary-200 bg-primary-900 p-1 px-2 rounded-md shadow-xl border border-primary-800">
            color
          </span>
          <span className="">share</span>
        </div>
      </AnimatedText>
      <BookCreationForm
        isVisible={showForm}
        onCancelClick={handleCancelClick}
      />
      <DescriptionSection
        isVisible={!showForm}
        onClick={handleCreateBookClick}
      />
    </div>
  );
};

const HomePage: React.FC = () => {
  console.log('HomePage');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const gridDebug = params.get('griddebug') === '1';
  const gridBorderDebugCls =
    'border-4 sm:border-green-500 md:border-red-500 xl:border-yellow-500';

  return (
    <Layout showHeader={false}>
      <div
        className="w-full h-screen items-center"
        style={{
          background: 'url(assets/home_background.svg) bottom right no-repeat',
        }}
      >
        <div className="flex items-center h-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-16 md:px-0 w-full">
            <div
              className={`md:col-span-3 xl:col-span-3  ${
                gridDebug ? gridBorderDebugCls : ''
              }`}
            ></div>
            <div
              className={`md:col-span-6 xl:col-span-6 w-full flex items-center  ${
                gridDebug ? gridBorderDebugCls : ''
              }`}
            >
              <div
                className="grid grid-cols-1 
              md:grid-cols-6 md:grid-rows-3 
              xl:grid-cols-6 xl:grid-rows-3 gap-4 w-full"
              >
                <UserBooks
                  minItems={20}
                  itemClassName={`col-span-1 bg-cover bg-center w-full aspect-[1/1.414] hidden md:block px-2
      ${gridDebug ? 'border border-primary-500' : ''}`}
                />
                <div
                  className="xl:col-span-2 xl:row-span-2 xl:row-start-2 xl:col-start-3 
                             md:col-span-4 md:row-span-3 md:row-start-2 md:col-start-2"
                >
                  <ContentDiv />
                </div>
              </div>
            </div>
            <div
              className={`md:col-span-3 xl:col-span-3 w-full ${
                gridDebug ? gridBorderDebugCls : ''
              }`}
            ></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
