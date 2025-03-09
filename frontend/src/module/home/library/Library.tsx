import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { Book } from '@apptypes/book';

import UserBooks from './../UserBooks';
import { ToolbarButton } from '../../book/components/ToolbarButton';
import APIService from '@/services/APIService';
import LoadingScreen from '@/common/components/LoadingScreen';
import LayoutMobile from '@/common/components/LayoutMobile';
import HeaderMobile from '@/common/components/header/HeaderMobile';

const Library: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const gridDebug = params.get('griddebug') === '1';

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightBookId] = useState(0);

  const fetchBooks = async () => {
    try {
      const books = await APIService.fetchBooks();
      setBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <LayoutMobile header={<HeaderMobile />} className='h-screen overflow-y-auto'>
      {isLoading ? (
        <LoadingScreen isLoading={isLoading} />
      ) : (
        <div className="w-full p-10 md:mt-10 md:max-w-300 md:mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 xl:grid-cols-8 gap-4 items-end">
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
              pageName={'library'}
              books={books}
              loading={isLoading}
              minItems={23}
              highlightBookId={highlightBookId}
              itemClassName={`bg-cover bg-center w-full aspect-[1/1.414]  px-2 items-end flex
${gridDebug ? 'border border-primary-500' : ''}`}
            />
          </div>
        </div>
      )}
    </LayoutMobile>
  );
};

export default Library;
