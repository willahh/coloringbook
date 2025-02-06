import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AnimatedText from '@/components/AnimatedText';
import Button from '@components/Button';
import {
  QueueListIcon,
  // BookOpenIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/Tooltip';
import { Book } from '@/types/book';

interface DescriptionSectionProps {
  onClick: () => void;
  className?: string;
  isVisible: boolean;
  books: Book[];
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  onClick,
  isVisible,
  books,
}) => {
  const hiddenStyle = { y: -100, opacity: 0, height: 0 };
  const visibleStyle = { y: 0, opacity: 1, height: 'auto' };
  const animateStyle = isVisible ? { ...visibleStyle } : { ...hiddenStyle };
  console.log('#4 books.length', books.length);
  return (
    <motion.div
      initial={isVisible ? hiddenStyle : visibleStyle}
      animate={animateStyle}
      transition={{
        delay: 0,
        duration: 0.3,
        type: 'tween',
      }}
    >
      <div className={`${isVisible ? '' : 'pointer-events-none'}`}>
        <AnimatedText enterClassName="delay-300">
          <p className="text-base mb-4 text-justify">
            <strong>Plongez dans un univers créatif et coloré</strong> où vous
            pouvez concevoir des motifs originaux, laisser libre cours à votre
            personnalité à travers le coloriage et partager vos créations avec
            notre communauté.
          </p>
        </AnimatedText>
        <AnimatedText enterClassName="delay-1000">
          <div>
            {books.length > 0 ? (
              <div className="isolate flex rounded-md">
                <Link autoFocus={true} to={`/library`}>
                  <Button
                    tabIndex={-1}
                    className="rounded-tr-none rounded-br-none"
                  >
                    <span className="text-md">Bibliothèque</span>
                    <QueueListIcon aria-hidden="true" className="size-6" />
                  </Button>
                </Link>
                <Tooltip content="Ajouter un nouveau livre">
                  <div>
                    <Button
                      autoFocus={true}
                      onClick={onClick}
                      variant="secondary"
                      className="border-l-0 rounded-tl-none rounded-bl-none"
                    >
                      <PlusIcon aria-hidden="true" className="size-6" />
                    </Button>
                  </div>
                </Tooltip>
              </div>
            ) : (
                <Button
                  autoFocus={true}
                  onClick={onClick}
                  variant="secondary"
                  className="w-full justify-center text-nowrap"
                >
                  <span>Ajouter un nouveau livre</span>
                  <PlusIcon aria-hidden="true" className="size-6" />
                </Button>
            )}
          </div>
        </AnimatedText>
      </div>
    </motion.div>
  );
};

export default DescriptionSection;
