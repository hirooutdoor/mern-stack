import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useCallback, useRef, useState } from 'react';
import { app } from '../../firebase';

type Args = {
  setFormState: React.Dispatch<React.SetStateAction<object>>;
};

export const useUploadProfileImage = ({ setFormState }: Args) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const uploadImage = useCallback(async () => {
    if (!imageFile) return;

    const storage = getStorage(app);
    const fileName = new Date().toISOString() + imageFile?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setUploadError(null);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Number(progress.toFixed()));
      },
      (error) => {
        console.error(error);
        setUploadError(
          'Failed to upload image. Upload image size is too large. Please try again with less than 2MB.'
        );
        setUploadProgress(0);
        setImageFile(null);
        setImageUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          console.log('File available at', downloadURL);
          setFormState((prev) => ({ ...prev, profilePicture: downloadURL }));
        });
        setUploadProgress(0);
      }
    );
  }, [setFormState, imageFile]);

  return {
    uploadImage,
    setImageFile,
    setImageUrl,
    handleImageChange,
    imageFile,
    imageUrl,
    inputImageRef,
    uploadProgress,
    uploadError,
  };
};
