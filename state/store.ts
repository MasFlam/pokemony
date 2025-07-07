import { pokeApi } from "@/api/pokeApi";
import favPokeReducer from "@/state/slices/favPokeSlice";
import pokePinsReducer from "@/state/slices/pokePinsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import hardSet from "redux-persist/es/stateReconciler/hardSet";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [pokeApi.reducerPath],
  stateReconsiler: hardSet,
};

export const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      [pokeApi.reducerPath]: pokeApi.reducer,
      favPoke: favPokeReducer,
      pokePins: pokePinsReducer,
    })
  ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(pokeApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
