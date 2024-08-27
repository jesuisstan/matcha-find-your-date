import imageCompression from 'browser-image-compression';

const defaultOptions = {
  maxSizeMB: 0.09, // Max size in MB (90 KB = 0.09 MB)
  maxWidthOrHeight: 800, // Max width or height, adjust as needed
  useWebWorker: true, // Use web workers for faster compression
  initialQuality: 1, // Initial quality level, can adjust for higher/lower quality
};

export async function compressFile(imageFile: any, options = defaultOptions) {
  try {
    const compressedFile = await imageCompression(imageFile, options);
    //console.log('Compressed file:', compressedFile); // debug
    return compressedFile;
  } catch (error) {
    //console.error('Error compressing image:', error); // debug
    throw new Error('image-compression-failed');
  }
}
