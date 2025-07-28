import { useAppDispatch, useAppSelector } from "..";
import type { CredentialUser } from "../../pages/auth/types-auth";
import { authLogin, authLogout } from "./actions";
import { getIsLogged } from "./selectors";

export const useAuth = () => {
  return useAppSelector(getIsLogged);
};

export const useLoginAction = () => {
  const dispatch = useAppDispatch();
  return async (credentials: CredentialUser) => {
    return dispatch(authLogin(credentials));
  };
};

export const useLogoutAction = () => {
  const dispatch = useAppDispatch();
  return () => dispatch(authLogout());
};
