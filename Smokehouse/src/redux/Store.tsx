import { configureStore } from '@reduxjs/toolkit'

import SmokehouseReducer from './SmokehouseReducer'

const store = configureStore({
    reducer: {
        smokehouse: SmokehouseReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;