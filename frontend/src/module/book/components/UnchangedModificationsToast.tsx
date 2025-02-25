import React, { useEffect, useState } from 'react';
import ButtonLink from '@components/ButtonLink';
import Toast from '@components/Toast';
import KeyboardShortcut from '@components/KeyboardShortcut';
import CloudSavedIcon from '@assets/icons/icon_cloud_saved.svg?react';
import CloudNotSavedIcon from '@assets/icons/icon_cloud_notsaved.svg?react';

interface UnsavedChangesToastProps {
  areLocalUpdatesSaved: boolean;
  onSave: () => void;
  onDontShowAgain?: () => void;
}

export const UnsavedChangesComponent: React.FC<UnsavedChangesToastProps> = ({
  areLocalUpdatesSaved,
  // onDontShowAgain,
  onSave,
}) => {
  // areLocalUpdatesSaved = !areLocalUpdatesSaved;
  return (
    <div className="shadow-md z-30 rounded-2xl m-2 max-w-md transition-all text-lg border-2 border-secondary-500 overflow-hidden">
      <div className="flex items-center gap-4 bg-secondary-100 dark:bg-secondary-500 text-secondary-500 dark:text-white p-4">
        {areLocalUpdatesSaved ? (
          <>
            <CloudSavedIcon className="w-12 h-12 text-md font-semibold fill-secondary-500 dark:fill-white" />
            <div>
              Les modifications ont bien étés synchronisées dans le Cloud
            </div>
          </>
        ) : (
          <>
            <CloudNotSavedIcon className="w-12 h-12 text-md font-semibold fill-secondary-500 dark:fill-white" />
            <span>
              Modifications non synchronisées
            </span>
          </>
        )}
      </div>
      <div className="bg-white dark:bg-gray-900 text-sm p-4 space-y-4 text-gray-700 dark:text-gray-300">
        {areLocalUpdatesSaved ? (
          <>
          <p className=''><strong>Vos modifications ont été enregistrées avec succès dans le cloud.</strong></p>
            <p className="">
              
              Tout votre travail est maintenant sécurisé et accessible depuis
              n’importe quel appareil. Vous pouvez continuer à travailler en
              toute tranquillité !
            </p>
          </>
        ) : (
          <>
            <p className="">
              Vos dernières modifications n’ont pas encore été enregistrées dans
              le cloud. Pour éviter de perdre votre travail, synchronisez-les
              maintenant ou choisissez de masquer cette alerte si vous préférez
              gérer cela plus tard.
            </p>
            <p className="">
              Vous pouvez aussi utiliser le raccourcis clavier CTRL+S.
            </p>
            <div className="flex gap-4">
              <ButtonLink className="flex items-center gap-1" onClick={onSave}>
                <span>Synchroniser maintenant</span>
                <KeyboardShortcut keys={['Ctrl', 'S']} />
              </ButtonLink>
            </div>
          </>
        )}
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
