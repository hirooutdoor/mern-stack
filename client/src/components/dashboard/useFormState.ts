import { useState } from 'react';
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  User,
} from '../../app/user/userSlice';
import { useAppDispatch } from '../../app/store';

type Args = {
  currentUser: User | null;
};

export const useFormState = ({ currentUser }: Args) => {
  const [formState, setFormState] = useState({});
  const dispatch = useAppDispatch();

  const handleChangeFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.keys(formState).length === 0) {
      return;
    }

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
      } else {
        dispatch(updateUserSuccess(data));
      }
    } catch (err) {
      const error = err as Error;
      dispatch(updateUserFailure(error.message));
    }
  };

  return {
    handleChangeFormInput,
    handleSubmit,
    setFormState,
  };
};
