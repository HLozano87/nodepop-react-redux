import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { auth } from "./auth/reducer";
import { adverts } from "./adverts/reducer";
import { useDispatch, useSelector } from "react-redux";
import * as thunk from "redux-thunk";
import type { AuthActions } from "./auth/actions";
import type { AdvertActions } from "./adverts/actions";

const rootReducer = combineReducers({ auth, adverts });
export type RootAction = AuthActions | AdvertActions

export function configureStore(preloadedState: Partial<RootState>) {
  const store = createStore(
    rootReducer,
    preloadedState as never,
    composeWithDevTools(
      applyMiddleware(thunk.withExtraArgument<RootState, RootAction>()),
    ),
  );
  return store;
}

export type AppStore = ReturnType<typeof configureStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export type AppThunk<ReturnType = void> = thunk.ThunkAction<
  ReturnType,
  RootState,
  undefined,
  RootAction
>;
