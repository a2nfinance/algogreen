import {
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";

export const actionNames = {
    connectWallet: "connectWallet",
    createDao: "createDao",
    deployDao: "deployDao",
    initializeDao: "initializeDao",
    createProposal: "createProposal",
    vote: "vote",
    executeProposal: "executeProposal",
    addMember: "addMember",
    removeMember: "removeMember",
    join: "join",
    leave: "leave",
    addContributor: "addContributor",
    getDaos: "getDaos",
    getSubDaos: "getSubDaos",
    getProposalsOf: "getProposals",
    getSubDaosOf: "getSubDaosOf",
    addFund: "addFund",
    createName: "createName",
    createBatchPayment: "createBatchPayment",
    createStream: "createStream",
    cancelStream: "cancelStream",
    transferStream: "transferStream",
    createChannel: "createChannel",
    createClaim: "createClaim",
    fundStream: "fundStream",
    fundChannel: "fundChannel",
    closeChannel: "closeChannel",
    withdrawStream: "withdrawStream",
    acceptClaim: "acceptClaim",
    rejectClaim: "rejectClaim",
    saveAddressGroup: "saveAddressGroup",
    saveAddress: "saveAddress",
    createInvoice: "createInvoice",
    newOpenTask: "newOpenTask"
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
    connectWallet: {
        processing: false
    },
    createDao: {
        processing: false
    },
    deployDao: {
        processing: false
    },
    initializeDao: {
        processing: false
    },
    createProposal: {
        processing: false
    },
    vote: {
        processing: false
    },
    executeProposal: {
        processing: false
    },
    addMember: {
        processing: false
    },
    removeMember: {
        processing: false
    },
    join: {
        processing: false
    },
    leave: {
        processing: false
    },
    addContributor: {
        processing: false
    },
    getDaos: {
        processing: false
    },
    getSubDaos: {
        processing: false
    },
    getProposalsOf: {
        processing: false
    },
    getSubDaosOf: {
        processing: false
    },
    addFund: {
        processing: false
    },
    createName: {
        processing: false
    },
    createBatchPayment: {
        processing: false
    },
    createStream: {
        processing: false
    },
    cancelStream: {
        processing: false
    },
    transferStream: {
        processing: false
    },
    createChannel: {
        processing: false
    },
    createClaim: {
        processing: false
    },
    fundStream: {
        processing: false
    },
    fundChannel: {
        processing: false
    },
    closeChannel: {
        processing: false
    },
    withdrawStream: {
        processing: false
    },
    acceptClaim: {
        processing: false
    },
    rejectClaim: {
        processing: false
    },
    saveAddressGroup: {
        processing: false
    },
    saveAddress: {
        processing: false
    },
    createInvoice: {
        processing: false
    },
    newOpenTask: {
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