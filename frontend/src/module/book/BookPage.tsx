import React from 'react';

import useIsMobile from '@/common/hooks/useIsMobile';
import BookPageMobile from './BookPageMobile';
import BookPageDesktop from './BookPageDesktop';

const BookPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <BookPageMobile />;
  } else {
    return <BookPageDesktop />;
  }
};

export default BookPage;
