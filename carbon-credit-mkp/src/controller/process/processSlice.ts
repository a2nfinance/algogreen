import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

export const actionNames = {
    connectWalletAction: "connectWalletAction",
    newAuctionAction: "newAuctionAction",
    acceptAuctionAction: "acceptAuctionAction",
    buyCreditAction: "buyCreditAction"
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
    newAuctionAction: {
        processing: false
    },
    acceptAuctionAction: {
        processing: false
    },
    buyCreditAction: {
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