'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type { PutBlobResult } from '@vercel/blob';
import clsx from 'clsx';
import { CirclePlus, Trash2 } from 'lucide-react';

import { compressFile } from './utils';

import Spinner from '@/components/ui/spinner';
import useUserStore from '@/stores/user';
import { TUser } from '@/types/user';

const ImageUploader = ({ id }: { id?: string }) => {
  const t = useTranslations();
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const [file, setFile] = useState<string>();
  const [fileEnter, setFileEnter] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']; // Supported image types
  const [error, setError] = useState(t('no-file-selected'));
  const [successMessage, setSuccessMessage] = useState('');

  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleFileSelection = async (file: File) => {
    setError('');
    setSuccessMessage('');
    if (allowedMimeTypes.includes(file.type)) {
      setIsCompressing(true);
      setSuccessMessage(t('image-processing'));
      try {
        const compressedImage = await compressFile(file); // Compress the image
        if (compressedImage) {
          //const blobUrl = URL.createObjectURL(compressedImage);
          //setFile(blobUrl); // Set the compressed image file URL for preview

          const response = await fetch(`/api/avatar/upload?filename=${compressedImage.name}`, {
            method: 'POST',
            body: compressedImage,
          });

          const newBlob = (await response.json()) as PutBlobResult;
          setBlob(newBlob);

          // Save the compressed image to the user's profile
          const responseSQL = await fetch(`/api/avatar/save-url`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user?.id,
              url: newBlob?.url,
            }),
          });

          const result = await responseSQL.json();
          const updatedUserData: TUser = result.user;
          if (responseSQL.ok) {
            if (updatedUserData) {
              setUser({ ...user, ...updatedUserData });
            }
          } else {
            setError(t(result.error));
          }

          setSuccessMessage(t('image-processed-success'));
        } else {
          setSuccessMessage('');
          setError(t('image-compression-failed'));
        }
      } catch (error) {
        setSuccessMessage('');
        setError(t('image-upload-failed'));
      }
      setIsCompressing(false);
    } else {
      setSuccessMessage('');
      setError(t('only-image-files-allowed'));
    }
  };

  return (
    <div className="container flex max-w-3xl flex-row items-center justify-between gap-5 rounded-lg border py-1">
      <>
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setFileEnter(true);
            }}
            onDragLeave={() => {
              setFileEnter(false);
            }}
            onDragEnd={(e) => {
              e.preventDefault();
              setFileEnter(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setFileEnter(false);

              if (e.dataTransfer.items) {
                [...e.dataTransfer.items].forEach((item) => {
                  if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file) {
                      handleFileSelection(file); // Handle file compression and preview
                    }
                  }
                });
              } else {
                [...e.dataTransfer.files].forEach((file) => {
                  handleFileSelection(file); // Handle file compression and preview
                });
              }
            }}
            className={clsx(
              'flex h-20 w-20 max-w-xs flex-col items-center justify-center border-dashed bg-background',
              fileEnter ? 'border-4' : 'border-2'
            )}
          >
            <label
              htmlFor={`file{${id}}`}
              className="flex h-full flex-col justify-center text-center"
            >
              {isCompressing ? (
                <Spinner size={5} />
              ) : (
                <CirclePlus
                  size={21}
                  className="cursor-pointer smooth42transition hover:text-c42green"
                />
              )}
            </label>
            <input
              id={`file{${id}}`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  handleFileSelection(files[0]); // Handle file compression and preview
                }
              }}
            />
          </div>
        ) : (
          <div className="relative flex h-20 w-20 items-center justify-center">
            {/* PREVIEW SECTION */}
            <object
              className="h-full w-full rounded-md object-cover" // Adjusted to fit the parent container
              data={file}
              type="image/png" // Adjust this if needed
              style={{ objectFit: 'contain', objectPosition: 'center' }} // Ensures image fits and is centered
            />

            {/* REMOVE BUTTON */}
            <div
              className={
                'absolute right-1 top-1 flex rounded-full border bg-card/80 p-1 text-foreground smooth42transition hover:text-negative'
              }
            >
              <Trash2
                size={15}
                onClick={() => {
                  setFile('');
                  setSuccessMessage('');
                  setError(t('no-file-selected'));
                }}
              />
            </div>
          </div>
        )}
      </>
      <div className="w-52 ">
        {error && <div className="text-xs text-negative">{error}</div>}
        {successMessage && <div className="text-xs text-positive">{successMessage}</div>}
      </div>
    </div>
  );
};

export default ImageUploader;
