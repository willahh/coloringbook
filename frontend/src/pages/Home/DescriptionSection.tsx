import React from 'react';
import { motion } from 'motion/react';
import AnimatedText from '@/components/AnimatedText';
import Button from '@components/Button';
import {
  QueueListIcon,
  // BookOpenIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/Tooltip';

interface DescriptionSectionProps {
  onClick: () => void;
  className?: string;
  isVisible: boolean;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  onClick,
  isVisible,
}) => {
  const hiddenStyle = { y: -100, opacity: 0, height: 0 };
  const visibleStyle = { y: 0, opacity: 1, height: 'auto' };
  const animateStyle = isVisible ? { ...visibleStyle } : { ...hiddenStyle };

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
          <div className="isolate flex rounded-md">
            <Button
              autoFocus={true}
              onClick={onClick}
              className="flex-1 rounded-tr-none rounded-br-none justify-center"
            >
              <span className="text-xs">Bibliothèque</span>
              <QueueListIcon aria-hidden="true" className="size-6" />
            </Button>
            <Tooltip content="Ajouter un nouveau livre">
              <div>
                <Button
                  autoFocus={true}
                  onClick={onClick}
                  className=" border-l-0 rounded-tl-none rounded-bl-none"
                >
                  {/* <span className="text-xs">Nouveau livre</span> */}
                  <PlusIcon aria-hidden="true" className="size-6" />
                </Button>
              </div>
            </Tooltip>
          </div>
        </AnimatedText>
      </div>
    </motion.div>
  );
};

export default DescriptionSection;
