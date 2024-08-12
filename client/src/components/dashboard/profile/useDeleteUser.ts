import { useState } from 'react';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from '../../../app/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../../app/store';

export const useDeleteUser = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());

    try {
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
      setShowModal(false);
    } catch (err) {
      const error = err as Error;
      dispatch(deleteUserFailure(error.message));
    }
  };
  return {
    showModal,
    setShowModal,
    handleDeleteUser,
  };
};
