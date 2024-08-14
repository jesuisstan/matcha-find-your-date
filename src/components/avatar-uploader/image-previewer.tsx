import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ImagePreviewer({
  imageFile,
  children,
}: {
  imageFile: any;
  children?: any;
}) {
  const [imageURL, setImageURL] = useState<string | undefined>();

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImageURL(url);
    //return () => url && URL.revokeObjectURL(url);
  }, [imageFile]);

  return imageFile ? (
    <>
      {/*<div className="">
        <img src={imageURL} alt="" />
      </div>*/}
      {imageURL && (
        <Image
          src={imageURL!}
          alt="avatar-preview"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-44"
        />
      )}
      <p>{`${imageFile.size.toFixed(2)} KB`}</p>
    </>
  ) : null;
}
