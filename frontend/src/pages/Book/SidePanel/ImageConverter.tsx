import React, { useContext, useState } from 'react';
import axios from 'axios';
import { getAPIURL } from '@/utils/api';
import { Tooltip } from '@/components/Tooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { BookPageContext } from '../BookPageContext';

const ImageConverter: React.FC = () => {
  const { setRefreshGraphics } = useContext(BookPageContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [, setConvertedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setConvertedImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(
        getAPIURL() + '/image/convert',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const svg = await fetch(response.data.svgPath).then((res) => res.text());
      setConvertedImage(svg);
      console.log('#3 call setRefreshGraphics')
      setRefreshGraphics(true);
    } catch (error) {
      console.error('Conversion error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 text-sm">
      <p className="mb-4">
        <span className="flex items-center gap-2">
          <span>Convertir une image</span>
          <Tooltip content="Convertir une image JPG / PNG au format vectoriel SVG">
            <InformationCircleIcon className="w-4 h-4" />
          </Tooltip>
        </span>
      </p>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2"
          accept="image/*"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Convertir
        </button>
      </form>

      {previewImage && (
        <div>
          <div className="">Aperçu de l'image originale:</div>
          <img
            src={previewImage}
            alt="Original Image"
            className="max-w-full h-auto mb-4 overflow-hidden rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
