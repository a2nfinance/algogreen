import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist';
import accountReducer from "./account/accountSlice";
import projectReducer from "./project/projectSlice";
import creditReducer from "./credit/creditSlice";
import processReducer from "./process/processSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            account: accountReducer,
            project: projectReducer,
            credit: creditReducer,
            process: processReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    })
}

export const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
    >

export const persistor  = persistStore(store)    