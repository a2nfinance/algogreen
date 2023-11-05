import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

export const actionNames = {
    connectWalletAction: "connectWalletAction",
    createDaoAction: "createDaoAction",
    deployDaoAction: "deployDaoAction",
    initializeDaoAction: "initializeDaoAction",
    createProposalAction: "createProposalAction",
    voteAction: "voteAction",
    executeProposalAction: "executeProposalAction",
    addMemberAction: "addMemberAction",
    getDaosAction: "getDaosAction",
    getProposalsOfAction: "getProposalsOfAction",
    addFundAction: "addFundAction",
}

export const processKeys = {
    processing: "processing",
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
    createDaoAction: {
        processing: false
    },
    deployDaoAction: {
        processing: false
    },
    initializeDaoAction: {
        processing: false
    },
    createProposalAction: {
        processing: false
    },
    voteAction: {
        processing: false
    },
    executeProposalAction: {
        processing: false
    },
    addMemberAction: {
        processing: false
    },
    getDaosAction: {
        processing: false
    },
    getProposalsOfAction: {
        processing: false
    },
    addFundAction: {
        processing: false
    },
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