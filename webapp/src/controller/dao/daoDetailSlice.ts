import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DAO } from './daoSlice';
type Fund = {
    funder: string,
    dao_address: string,
    treasury_address: string,
    token_hash: string,
    token_symbol: string,
    amount: string,
    created_at: string
}
type DaoState = {
    daoFromDB: {
        _id?: string,
        title: string,
        description: string,
        contract_name: string,
        owner: string,
        quorum: number,
        passing_threshold: number,
        dao_type: number,
        submission_policy: number,
        dao_address: string,
        treasury_address: string,
        token_address?: string,
        twitter: string,
        github: string,
        discord: string,
        status: number,
        created_at?: any
    },
    daoOnchain: {
        // quorum: number,
        // submission_policy: boolean,
        // dao_type: number,
        // owner: string,
        // status: number,
        count_proposal: number,
        count_member: number,
        balance: number,
        // created_date: string,
        whitelistedTokens: {hash: string, decimals: number, symbol: string}[],
        funders: string[]
        
    },
    proposals: any[],
    members: any[],
    treasury: Fund[],
    openTasks: any[],
    initialPayoutValues: any
}

const initialState: DaoState = {
    daoFromDB: {
        title: "",
        description: "",
        contract_name: "",
        owner: "",
        quorum: 2000,
        passing_threshold: 5000,
        dao_type: 1,
        submission_policy: 0,
        dao_address: "",
        treasury_address: "",
        twitter: "",
        github: "",
        discord: "",
        status: 1
    },
    daoOnchain:  {
        // quorum: 0,
        // submission_policy: false,
        // dao_type: 1,
        // owner: "",
        // status: 1,
        count_proposal: 0,
        count_member: 0,
        balance: 0,
        // created_date: "",
        whitelistedTokens: [],
        funders: []
    },
    proposals: [],
    members: [],
    treasury: [],
    openTasks: [],
    initialPayoutValues: null
}

export const daoDetailSlice = createSlice({
    name: 'daoDetail',
    initialState: initialState,
    reducers: {
        setDaoDetailProps: (state: DaoState, action: PayloadAction<{ daoFromDB: any, daoOnChain: any }>) => {
            state.daoFromDB = action.payload.daoFromDB;
            state.daoOnchain = action.payload.daoOnChain;
        },
        setProposals: (state: DaoState, action: PayloadAction<any>) => {
            state.proposals = action.payload
        },
        setMembers: (state: DaoState, action: PayloadAction<any[]>) => {
            state.members = action.payload
        },
        setTreasury: (state: DaoState, action: PayloadAction<Fund[]>) => {
            state.treasury = action.payload
        },
        setFunders: (state: DaoState, action: PayloadAction<string[]>) => {
            state.daoOnchain.funders = action.payload
        },
        setOpenTasks: (state: DaoState, action: PayloadAction<any[]>) => {
            state.openTasks = action.payload
        },
        setInitialPayoutValues: (state: DaoState, action: PayloadAction<any>) => {
            state.initialPayoutValues = action.payload
        },
    }
})
export const { setDaoDetailProps, setProposals, setMembers, setTreasury, setFunders, setOpenTasks, setInitialPayoutValues } = daoDetailSlice.actions;
export default daoDetailSlice.reducer;