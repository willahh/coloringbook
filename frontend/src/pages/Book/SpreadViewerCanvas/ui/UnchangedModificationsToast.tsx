import React from 'react';
import ButtonLink from '@components/ButtonLink';
import Toast from '@components/Toast';

interface UnsavedChangesToastProps {
  isVisible: boolean;
  onSave: () => void;
  onClose: () => void;
}

const UnsavedChangesToast: React.FC<UnsavedChangesToastProps> = ({
  isVisible,
  onSave,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <Toast
      autoClose={false}
      message={
        <div>
          <div>Les modifications ne sont pas enregistrées</div>
          <div>
            <ButtonLink onClick={onSave}>Enregistrer</ButtonLink>
          </div>
        </div>
      }
      type="info"
      show={true}
      onClose={onClose}
    />
  );
};

export default UnsavedChangesToast;
