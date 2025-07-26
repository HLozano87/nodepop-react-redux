import type { RootState } from "..";

export const getIsLogged = (state: RootState) => state.auth;
