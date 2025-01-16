import React, { useState } from 'react';
import Layout from '../layout';
import Logo from '@assets/coloring-book-logo-wide.svg?react';
import AnimatedText from '@/components/AnimatedText';
import BookCreationForm from './BookCreationForm';
import DescriptionSection from './DescriptionSection';
import UserBooks from './UserBooks';

const HomePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const handleCreateBookClick = () => {
    setShowForm(true);
  };
  const handleCancelClick = () => {
    setShowForm(false);
  };

  return (
    <Layout showHeader={false}>
      <div
        className="flex w-full h-screen items-center"
        style={{
          background: 'url(assets/home_background.svg) bottom right no-repeat',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-16 md:px-0">
          <div className="xl:col-span-4"></div>
          <div className="md:col-start-3 md:col-span-4 xl:col-start-5 xl:col-span-2 text-white">
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
          <div className="md:col-span-4 xl:col-span-3">
            <UserBooks />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
