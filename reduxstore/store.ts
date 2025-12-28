import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import { authSlice } from "./slices/isAuthSlice";
import { createWrapper } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";


const rootPersistConfig = {
    key: 'root',
    version: 1,
    storage: storage,
}

const authPersistConfig = {
    key: 'auth',
    version: 1,
    storage: storage,
    blacklist:['userSlice']
}


export const rootReducer = combineReducers({
   auth : authSlice.reducer
})


const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const storeMiddleWare = (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                FLUSH as string,
                PAUSE as string,
                PERSIST as string,
                PURGE as string,
                REGISTER as string,
                REHYDRATE as string
            ]
        }
    })


export const store = configureStore({
    reducer: persistedReducer, 
    middleware: storeMiddleWare
})

const makeStore = () => store

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>

export const wrapper = createWrapper<AppStore>(makeStore)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export interface THUNKAPI {
    state: RootState
    dispatch: AppDispatch
}

export const persistor = persistStore(store)

export default store 
