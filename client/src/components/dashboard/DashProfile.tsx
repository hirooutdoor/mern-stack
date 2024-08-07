import { TextInput, Button, Alert } from 'flowbite-react';
import { useAppSelector } from '../../app/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { app } from '../../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

export const DashProfile = () => {
  const { currentUser, loading } = useAppSelector((state) => state.user);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
    // TODO: URL.revokeObjectURL(imageUrl)をやってメモリを解放する
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  const uploadImage = useCallback(async () => {
    if (!imageFile) return;

    const storage = getStorage(app);
    const fileName = new Date().toISOString() + imageFile?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Number(progress.toFixed()));
        console.log(`Upload is ${uploadProgress}% done`);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error: Error) => {
        console.log(error);
        setUploadError(
          'Failed to upload image. Upload image size is too large. Please try again with less than 2MB.'
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          console.log('File available at', downloadURL);
        });
      }
    );
  }, [imageFile]);

  useEffect(() => {
    uploadImage();
  }, [uploadImage]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={inputImageRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => inputImageRef.current?.click()}
        >
          <img
            src={imageUrl ?? currentUser?.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
          />
        </div>
        {uploadError ? <Alert color="failure">{uploadError}</Alert> : null}
        <TextInput
          type="text"
          id="name"
          placeholder="name"
          defaultValue={currentUser?.name}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          {loading ? 'Loading...' : 'Update'}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};
