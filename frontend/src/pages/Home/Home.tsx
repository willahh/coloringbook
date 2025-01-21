import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../layout';
import Logo from '@assets/coloring-book-logo-wide.svg?react';
import AnimatedText from '@/components/AnimatedText';
import BookCreationForm from './BookCreationForm';
import DescriptionSection from './DescriptionSection';
import UserBooks from './UserBooks';
import Toast from '@/components/Toast';
import { IBook } from '@/domain/book';
import { getBooksUrl } from '@/utils/api';

interface ContentDivProps {
  onBookCreationSuccess: (book: IBook) => void;
}

const ContentDiv: React.FC<ContentDivProps> = ({ onBookCreationSuccess }) => {
  console.log('ContentDiv');
  const [showForm, setShowForm] = useState(false);
  const handleCreateBookClick = () => {
    setShowForm(true);
  };
  const handleCancelClick = () => {
    console.log('handleCancelClick');
    setShowForm(false);
  };

  // toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    console.log('handleShowToast', message, type);
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  console.log('showForm', showForm);

  return (
    <div className=" text-white">
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Logo className="mb-4 md:-ml-16 max-w-xs" />
      <AnimatedText enterClassName="delay-200">
        <div className="flex mb-4 gap-2 items-center text-md font-extralight select-none">
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
        showToast={handleShowToast}
        onBookCreationSuccess={onBookCreationSuccess}
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
    console.log('onBookCreationSuccess', book);
    setHighlightBookId(book.id);
    fetchBooks();
  };

  return (
    <Layout showHeader={false}>
      <div
        className="w-full h-screen items-center"
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
                  books={books}
                  loading={loading}
                  minItems={20}
                  highlightBookId={highlightBookId}
                  itemClassName={`col-span-1 bg-cover bg-center w-full aspect-[1/1.414] hidden md:block px-2
      ${gridDebug ? 'border border-primary-500' : ''}`}
                />
                <div
                  className="xl:col-span-2 xl:row-span-2 xl:row-start-2 xl:col-start-3 
                             md:col-span-4 md:row-span-3 md:row-start-2 md:col-start-2"
                >
                  <ContentDiv onBookCreationSuccess={onBookCreationSuccess} />
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
