import { useState } from 'react';

import axios from 'axios';

import { ButtonMatcha } from '../ui/button-matcha';
import FileInput from './file-input';
import ImagePreviewer from './image-previewer';
import { compressFile } from './utils';

export default function ImageCompressor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<File | undefined>();
  const [isCompressing, setIsCompressing] = useState(false);

  const handleOnChange = (event: any) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleCompressFile = async () => {
    if (selectedImage) {
      setIsCompressing(true);
      try {
        const compressedImageFile = await compressFile(selectedImage);
        setCompressedImage(compressedImageFile);
      } catch (error) {
        console.log({ error });
      }
      setIsCompressing(false);
    }
  };

  return (
    <section className="">
      <FileInput handleOnChange={handleOnChange} />
      <article className="">
        <aside>
          <div className="">
            {selectedImage && (
              <ButtonMatcha onClick={handleCompressFile}>
                {' '}
                {isCompressing ? 'Compressing...' : ' Compress Image'}
              </ButtonMatcha>
            )}
            {compressedImage && <ImagePreviewer imageFile={compressedImage} />}
          </div>
        </aside>
      </article>
    </section>
  );
}
