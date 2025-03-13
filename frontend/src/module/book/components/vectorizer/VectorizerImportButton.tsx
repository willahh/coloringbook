import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';

interface VectorizerImportButtonProps {
  setImageSrc: React.Dispatch<React.SetStateAction<string | null>>;
}

const VectorizerImportButton: React.FC<VectorizerImportButtonProps> = ({ setImageSrc }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const handleFileSelect = async () => {
  //   try {
  //     const [fileHandle] = await window.showOpenFilePicker({
  //       types: [
  //         {
  //           description: 'Images',
  //           accept: {
  //             'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'],
  //           },
  //         },
  //       ],
  //       excludeAcceptAllOption: true,
  //       multiple: false,
  //     });

  //     const file = await fileHandle.getFile();
  //     const url = URL.createObjectURL(file);
  //     setImageSrc(url);
  //   } catch (error) {
  //     console.error('Erreur lors de la sélection du fichier :', error);
  //   }
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  return (
    <label className="cursor-pointer">
      <button className="btn" onClick={() => fileInputRef.current?.click()}>
        <DocumentArrowDownIcon />
        <span>Importer</span>
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </label>
  );
};

export default VectorizerImportButton;
