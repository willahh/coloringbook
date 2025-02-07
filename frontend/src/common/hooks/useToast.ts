import { useState, useCallback } from 'react';

export const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToastFunc = useCallback(
    (message: string, type: 'success' | 'error') => {
      setToastMessage(message);
      setToastType(type);
      setShowToast(true);
    },
    []
  );

  const hideToast = useCallback(() => {
    setShowToast(false);
  }, []);

  return { showToast, toastMessage, toastType, showToastFunc, hideToast };
};
