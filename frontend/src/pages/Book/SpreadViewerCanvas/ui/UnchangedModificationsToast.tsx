import React, { useEffect, useState } from 'react';
import ButtonLink from '@components/ButtonLink';
import Toast from '@components/Toast';

interface UnsavedChangesToastProps {
  isVisible: boolean;
  onSave: () => void;
}

const UnsavedChangesToast: React.FC<UnsavedChangesToastProps> = ({
  isVisible,
  onSave,
}) => {
  const [show, setIsShow] = useState(isVisible);
  useEffect(() => {
    setIsShow(isVisible);
  }, [isVisible]);

  const onDontShowAgain = () => {
    console.log('onDontShowAgain');
  };

  if (!isVisible) return null;

  return (
    <Toast
      autoClose={false}
      message={
        <div>
          <div>Les modifications ne sont pas enregistrées</div>
          <div className="flex gap-2">
            <ButtonLink onClick={onSave}>Enregistrer</ButtonLink>
            <ButtonLink onClick={onDontShowAgain} color="gray">
              Ne plus afficher
            </ButtonLink>
          </div>
        </div>
      }
      type="info"
      show={show}
      // onClose={handleClose}
    />
  );
};

export default UnsavedChangesToast;
