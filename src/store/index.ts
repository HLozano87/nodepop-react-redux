import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { auth } from "./auth/reducer";
import { adverts } from "./adverts/reducer";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import * as thunk from "redux-thunk";
import type { AuthActions } from "./auth/actions";
import type { AdvertActions } from "./adverts/actions";

const rootReducer = combineReducers({ auth, adverts });
export type RootAction = AuthActions | AdvertActions;
export type RootState = ReturnType<typeof rootReducer>;

export function configureStore(preloadedState: Partial<RootState>) {
  const store = createStore(
    rootReducer,
    preloadedState as RootState as never,
    composeWithDevTools(
      applyMiddleware(thunk.withExtraArgument<RootState, RootAction>()),
    ),
  );
  return store;
}

export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore["dispatch"];

// NEW method to create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = thunk.ThunkAction<
  ReturnType,
  RootState,
  undefined,
  RootAction
>;
