import { TextInput, Button, Alert } from 'flowbite-react';
import { useAppSelector } from '../../../app/store';
import { useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useUploadProfileImage } from './useUploadProfileImage';
import { useFormState } from './useFormState';

export const DashProfile = () => {
  const { currentUser, loading, error } = useAppSelector((state) => state.user);
  const { handleChangeFormInput, handleSubmit, setFormState, updateStatus } =
    useFormState({
      currentUser,
    });
  const {
    uploadImage,
    handleImageChange,
    imageUrl,
    inputImageRef,
    uploadProgress,
    uploadError,
    uploadImageCompleted,
  } = useUploadProfileImage({ setFormState });

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
          {uploadProgress > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <CircularProgressbar
                strokeWidth={5}
                value={uploadProgress}
                text={`${uploadProgress}%`}
                styles={{
                  path: {
                    stroke: `rgba(62, 152, 199 ${uploadProgress / 100})`,
                  },
                }}
              />
            </div>
          ) : null}
          <img
            src={imageUrl ?? currentUser?.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${uploadProgress && uploadProgress < 100 && 'opacity-50'}`}
          />
        </div>
        {uploadError ? <Alert color="failure">{uploadError}</Alert> : null}
        <TextInput
          type="text"
          id="name"
          placeholder="name"
          defaultValue={currentUser?.name}
          onChange={handleChangeFormInput}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={handleChangeFormInput}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChangeFormInput}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={!uploadImageCompleted}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateStatus === 'success' ? (
        <Alert color="success" className="mt-5">
          Profile updated successfully.
        </Alert>
      ) : null}
      {updateStatus === 'failure' ? (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      ) : null}
    </div>
  );
};
