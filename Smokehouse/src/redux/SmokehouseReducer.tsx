import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";


export type SmokehouseState = {
    api_link: string,
    connected: boolean,
    target: number,
    temperature: number,
    enableHeater: boolean,
    enableSmoker: boolean
}

const initialState: SmokehouseState = {
    api_link: '192.168.1.102',
    connected: false,
    target: 0,
    temperature: 0,
    enableHeater: false,
    enableSmoker: false
}

export const update = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    'smokehouse/update',
    async (arg, thunkAPI) => {
        try {
            let api_link = thunkAPI.getState().smokehouse.api_link;
            let fetchAbort = new AbortController();
            let fetchTimeout = setTimeout(() => fetchAbort.abort(), 2000);
            let response = await fetch(`http://${api_link}/status`, { signal: fetchAbort.signal });
            clearTimeout(fetchTimeout);
            let json = await response.json();
            return json;
        } catch {
            return null
        }
    }
)

export const setTemperature = createAsyncThunk<
    void,
    number,
    { state: RootState }
>(
    'smokehouse/setTemperature',
    async (temperature, thunkAPI) => {
        let api_link = thunkAPI.getState().smokehouse.api_link;
        fetch(`http://${api_link}/set?target=${temperature}`)
    }
)

export const setHeater = createAsyncThunk<
    void,
    boolean,
    { state: RootState }
>(
    'smokehouse/setHeater',
    async (value, thunkAPI) => {
        let api_link = thunkAPI.getState().smokehouse.api_link;
        fetch(`http://${api_link}/set?enableheater=${value}`)
    }
)

export const setSmoker = createAsyncThunk<
    void,
    boolean,
    { state: RootState }
>(
    'smokehouse/setSmoker',
    async (value, thunkAPI) => {
        let api_link = thunkAPI.getState().smokehouse.api_link;
        fetch(`http://${api_link}/set?enablesmoker=${value}`)
    }
)

const SmokehouseReducer = createSlice({
    name: 'smokehouse',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(setTemperature.fulfilled, (state, action) => {
                state.target = action.meta.arg;
            })
            .addCase(setHeater.fulfilled, (state, action) => {
                state.enableHeater = action.meta.arg;
            })
            .addCase(setSmoker.fulfilled, (state, action) => {
                state.enableSmoker = action.meta.arg;
            })
            .addCase(update.fulfilled, (state, action) => {
                if (action.payload) {
                    state.temperature = action.payload.temperature;
                    state.target = action.payload.target;
                    state.enableHeater = action.payload.enable_heater;
                    state.enableSmoker = action.payload.enable_smoker;
                    state.connected = true;
                } else {
                    state.connected = false;
                }
            })
    }
});

export default SmokehouseReducer.reducer;