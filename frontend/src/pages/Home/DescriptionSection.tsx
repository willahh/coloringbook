import React from 'react';
import { motion } from 'motion/react';
import AnimatedText from '@/components/AnimatedText';
import Button from '@components/Button';
import { BookOpenIcon } from '@heroicons/react/24/solid';

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
        <AnimatedText enterClassName="delay-500">
          <p className="text-base mb-4 text-primary-700 dark:text-primary-300">
            Lancez-vous dès aujourd'hui :
          </p>
        </AnimatedText>
        <AnimatedText enterClassName="delay-1000">
          <div>
            <Button
              className="flex justify-center w-full rounded-xl py-1 px-2"
              autoFocus={true}
              onClick={onClick}
            >
              <BookOpenIcon aria-hidden="true" className="size-8" />
              <span className="whitespace-nowrap">Créer un nouveau livre</span>
            </Button>
          </div>
        </AnimatedText>
      </div>
    </motion.div>
  );
};

export default DescriptionSection;
