import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

export const actionNames = {
    connectWalletAction: "connectWalletAction",
    deployMkpAction: "deployMkpAction",
    changeStatusAction: "changeStatusAction",
    
}

export const processKeys = {
    processing: "processing"
}

type Processes = {
    [key: string]: {
        processing: boolean
    }
}

const initialState: Processes = {
    connectWalletAction: {
        processing: false
    },
    deployMkpAction: {
        processing: false
    },
    changeStatusAction: {
        processing: false
    }
}

export const processesSlice = createSlice({
    name: 'process',
    initialState,
    reducers: {
        updateProcessStatus: (state, action: PayloadAction<{ actionName: string, att: string, value: boolean }>) => {
            state[action.payload.actionName][action.payload.att] = action.payload.value;
        },
    }
})

export const { updateProcessStatus } = processesSlice.actions;
export default processesSlice.reducer;