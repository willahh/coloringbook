import React, { useEffect, useState } from 'react';
import ButtonLink from '@components/ButtonLink';
import Toast from '@components/Toast';
import KeyboardShortcut from '@components/KeyboardShortcut';

interface UnsavedChangesToastProps {
  isModified: boolean;
  onSave: () => void;
  onDontShowAgain?: () => void;
}

export const UnsavedChangesComponent: React.FC<UnsavedChangesToastProps> = ({
  onDontShowAgain,
  onSave,
}) => {
  return (
    <div>
      <div>Les modifications ne sont pas enregistrées</div>
      <div className="flex gap-4">
        <ButtonLink className="flex items-center gap-1" onClick={onSave}>
          <span>Enregistrer</span>
          <KeyboardShortcut keys={['Ctrl', 'S']} />
        </ButtonLink>
        <ButtonLink onClick={onDontShowAgain} color="gray">
          Ne plus afficher
        </ButtonLink>
      </div>
    </div>
  );
};

const UnsavedChangesToast: React.FC<UnsavedChangesToastProps> = ({
  isModified,
  onSave,
}) => {
  const [show, setIsShow] = useState(isModified);
  const [isClosed, setIsClosed] = useState(false);
  useEffect(() => {
    setIsShow(isModified);
    if (show) {
      setIsClosed(false);
    }
  }, [isModified, show]);

  const onDontShowAgain = () => {
    console.log('onDontShowAgain');
  };

  return (
    <Toast
      autoClose={false}
      message={
        <UnsavedChangesComponent
          isModified={isModified}
          onDontShowAgain={onDontShowAgain}
          onSave={onSave}
        />
      }
      type="info"
      // show={!isClosed && show}
      show={!isClosed && show}
      onClose={() => {
        setIsClosed(true);
        setIsShow(true);
      }}
    />
  );
};

export default UnsavedChangesToast;
