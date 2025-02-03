import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import Logo from '@assets/coloring-book-logo-wide.svg?react';
import LogoLight from '@assets/coloring-book-logo-wide-light.svg?react';
import AnimatedText from '@/components/AnimatedText';
import Toast from '@/components/Toast';
import { IBook } from '@/domain/book';
import { getBooksUrl } from '@/utils/api';
import { useTheme } from '@/contexts/ThemeContext';

import Layout from '../layout';
import BookCreationForm from './BookCreationForm';
import DescriptionSection from './DescriptionSection';
import UserBooks from './UserBooks';
import { useToast } from '@/hooks/useToast';
import { ToolbarButton } from '../Book/SpreadViewerCanvas/ui/ToolbarButton';

interface ContentDivProps {
  onBookCreationSuccess: (book: IBook) => void;
}

const ContentDiv: React.FC<ContentDivProps> = ({ onBookCreationSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const { showToast, toastMessage, toastType, showToastFunc, hideToast } =
    useToast();
  const { appearance } = useTheme();

  const handleCreateBookClick = () => {
    setShowForm(true);
  };
  const handleCancelClick = () => {
    setShowForm(false);
  };

  return (
    <div className="flex items-center justify-center items-center w-full">
      <div className="dark:text-white max-w-80">
        <Toast
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={hideToast}
        />
        {appearance === 'dark' ? (
          <Logo className="mb-4 md:-ml-16 max-w-xs" />
        ) : (
          <LogoLight className="mb-4 md:-ml-16 max-w-xs" />
        )}
        <AnimatedText enterClassName="delay-200">
          <div className="flex mb-4 gap-2 items-center text-md font-extralight select-none">
            <span className="">Create</span>
            <span className="text-primary-800 dark:text-primary-200 bg-secondary-100 dark:bg-secondary-900 border-primary-200 dark:border-primary-800 p-1 px-2 rounded-md dark:shadow-xl border ">
              color
            </span>
            <span className="">share</span>
          </div>
        </AnimatedText>
        <BookCreationForm
          isVisible={showForm}
          onCancelClick={handleCancelClick}
          showToast={showToastFunc}
          onBookCreationSuccess={onBookCreationSuccess}
        />
        <DescriptionSection
          isVisible={!showForm}
          onClick={handleCreateBookClick}
        />
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const location = useLocation();
  console.log('location', location);
  const params = new URLSearchParams(location.search);
  const gridDebug = params.get('griddebug') === '1';
  const gridBorderDebugCls =
    'border-4 sm:border-green-500 md:border-red-500 xl:border-yellow-500';

  const pageName = location.pathname === '/' ? 'home' : 'library';

  // Books data
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightBookId, setHighlightBookId] = useState(0);
  const fetchBooks = async () => {
    try {
      const response = await fetch(getBooksUrl());
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onBookCreationSuccess = (book: IBook) => {
    setHighlightBookId(book.id);
    fetchBooks();
  };

  return (
    <Layout>
      <div className="w-full h-screen items-center">
        <div className="flex items-center h-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-16 md:px-0 w-full">
            <div
              className={`md:col-span-2 xl:col-span-3  ${
                gridDebug ? gridBorderDebugCls : ''
              }`}
            ></div>
            <div
              className={`md:col-span-8 xl:col-span-6 w-full flex items-center  ${
                gridDebug ? gridBorderDebugCls : ''
              }`}
            >
              <div
                className="grid grid-cols-1 
              md:grid-cols-8 md:grid-rows-2
              xl:grid-cols-6 xl:grid-rows-3 gap-4 w-full"
              >
                {pageName === 'home' && (
                  <>
                    <UserBooks
                      pageName={pageName}
                      books={books}
                      loading={loading}
                      minItems={20}
                      highlightBookId={highlightBookId}
                      itemClassName={`col-span-1 bg-cover bg-center w-full aspect-[1/1.414] px-2
      ${gridDebug ? 'border border-primary-500' : ''}`}
                    />

                    <div
                      className="xl:col-span-2 xl:row-span-2 xl:row-start-2 xl:col-start-3 
                             md:col-span-4 md:row-span-4 md:row-start-1 md:col-start-3 md:flex md:self-center"
                    >
                      <ContentDiv
                        onBookCreationSuccess={onBookCreationSuccess}
                      />
                    </div>
                  </>
                )}
                {pageName === 'library' && (
                  <>
                    <Link
                      to={`/`}
                      tabIndex={-1}
                      className="flex items-center justify-center w-full h-full "
                    >
                      <ToolbarButton className="w-full h-full ">
                        <ArrowLeftIcon className="w-8" />
                      </ToolbarButton>
                    </Link>
                    <UserBooks
                      pageName={pageName}
                      books={books}
                      loading={loading}
                      minItems={23}
                      highlightBookId={highlightBookId}
                      itemClassName={`flex justify-center items-center col-span-1 bg-cover bg-center w-full aspect-[1/1.414]  px-2
                        
  ${gridDebug ? 'border border-primary-500' : ''}`}
                    />
                  </>
                )}
              </div>
            </div>
            <div
              className={`md:col-span-2 xl:col-span-3 w-full ${
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
