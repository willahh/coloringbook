import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

export const VerticalSeparator: React.FC<{ className?: string }> = ({ className }) => {
    return (
      <div
        className={`${
          className || ' flex items-center justify-center cursor-grabbing'
        } bg-primary-950 border-t border-b border-t-primary-800 border-b-primary-800 h-3`}
      >
        <EllipsisHorizontalIcon className="w-4 h-4 text-primary-400" />
      </div>
    );
  };