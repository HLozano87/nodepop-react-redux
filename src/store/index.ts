import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "@redux-devtools/extension";
import * as reducers from "./reducer";
import { useDispatch, useSelector } from "react-redux";

const rootReducer = combineReducers(reducers);

export function configureStore(preloadedState: Partial<reducers.State>) {
  const store = createStore(
    rootReducer,
    preloadedState as never,
    devToolsEnhancer(),
  );
  return store;
}

export type AppStore = ReturnType<typeof configureStore>;
export type AppGetState = AppStore["getState"];
export type RootState = ReturnType<AppGetState>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
