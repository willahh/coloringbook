import ThumbnailItem from './ThumbnailItem';

const ElementItem: React.FC<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick, className }) => {
  return (
    <ThumbnailItem
      className={`${
        className || ''
      } flex justify-center w-full aspect-square object-cover p-2
          dark:fill-white
          bg-primary-100 dark:bg-primary-700/50`}
      onClick={onClick}
    >
      {children}
    </ThumbnailItem>
  );
};

export default ElementItem;
