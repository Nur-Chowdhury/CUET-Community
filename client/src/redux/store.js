import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
import themeReducer from './slices/themeSlice';
import commnetReducer from './slices/commentSlice';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  comment: commnetReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);