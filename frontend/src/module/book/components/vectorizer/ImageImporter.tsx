interface ImageImporterProps {
  setImageSrc: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageImporter: React.FC<ImageImporterProps> = ({ setImageSrc }) => {
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

  const handleFileSelectFallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  return (
    <div>
      {/* <button onClick={handleFileSelect}>Importer une image</button> */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelectFallback}
        style={{ display: 'block', marginTop: '10px' }}
      />
      ;
    </div>
  );
};

export default ImageImporter;
