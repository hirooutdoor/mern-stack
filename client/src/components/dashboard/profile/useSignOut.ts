import { useAppDispatch } from '../../../app/store';
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from '../../../app/user/userSlice';

export const useSignOut = () => {
  const dispatch = useAppDispatch();

  const signOut = async () => {
    dispatch(signOutStart());
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signOutFailure(data.message));
      }
      dispatch(signOutSuccess());
    } catch (err) {
      const error = err as Error;
      dispatch(signOutFailure(error.message));
    }
  };

  return { handleSignOut: signOut };
};
