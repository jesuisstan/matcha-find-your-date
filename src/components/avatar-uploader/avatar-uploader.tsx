'use client';

import { useRef, useState } from 'react';

import type { PutBlobResult } from '@vercel/blob';

import ImageCompressor from './image-compressor';
import ImagePreviewer from './image-previewer';

const AvatarUploader = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }

          const file = inputFileRef.current.files[0];

          const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
            method: 'POST',
            body: file,
          });

          const newBlob = (await response.json()) as PutBlobResult;

          setBlob(newBlob);
        }}
      >
				<div className='flex flex-col'>

        <input name="file" ref={inputFileRef} type="file" required />
        <input name="file" ref={inputFileRef} type="file"  />
        <input name="file" ref={inputFileRef} type="file"  />
        <input name="file" ref={inputFileRef} type="file"  />
        <input name="file" ref={inputFileRef} type="file"  />

        <button type="submit">Upload</button>
				</div>
      </form>
      <ImageCompressor />
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
};

export default AvatarUploader;
