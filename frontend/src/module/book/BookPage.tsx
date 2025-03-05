import React from 'react';
import { useMediaQuery } from 'react-responsive';

import BookPageMobile from './BookPageMobile';
import BookPageDesktop from './BookPageDesktop';

const BookPage: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Breakpoint md - 1 (767px)

  if (isMobile) {
    return <BookPageMobile />;
  } else {
    return <BookPageDesktop />;
  }
};

export default BookPage;
