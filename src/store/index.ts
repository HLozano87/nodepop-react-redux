import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import * as reducers from "./auth/reducer";
import { useDispatch, useSelector } from "react-redux";
import * as thunk from "redux-thunk";
import type { Actions } from "./auth/actions";

const rootReducer = combineReducers(reducers);

export function configureStore(preloadedState: Partial<reducers.State>) {
  const store = createStore(
    rootReducer,
    preloadedState as never,
    composeWithDevTools(
      applyMiddleware(thunk.withExtraArgument<reducers.State, Actions>()),
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
  Actions
>;
