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
        _id: string,
        creator: string,
        organization_name: string,
        owner: string,
        address: string,
        city: string,
        state: string,
        zipcode: string,
        country: string,
        email: string,
        phone_number: string,
        description: string,
        website: string,
        twitter: string,
        telegram: string,
        facebook: string,
        status: number,
        dao_app_id: number,
        token_id: number,
        dao_title: string,
        passing_threshold: number,
        quorum: number,
        submission_policy: number,
        token_name: string,
        token_supply: number,
    },
    appAccountInformation?: any,
    proposals: any[],
    members: any[],
    loans: any[]
}

const initialState: DaoState = {
    daoFromDB: {
        _id: "",
        creator: "",
        organization_name: "",
        owner: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        email: "",
        phone_number: "",
        description: "",
        website: "",
        twitter: "",
        telegram: "",
        facebook: "",
        status: 3,
        dao_app_id: 0,
        token_id: 0,
        dao_title: "",
        passing_threshold: 50,
        quorum: 20,
        submission_policy: 1,
        token_name: "",
        token_supply: 1000,
    },
    proposals: [],
    members: [],
    appAccountInformation: {},
    loans: []
}

export const daoDetailSlice = createSlice({
    name: 'daoDetail',
    initialState: initialState,
    reducers: {
        setDaoDetailProps: (state: DaoState, action: PayloadAction<{daoFromDB: any, appAccountInformation: any}>) => {
            state.daoFromDB = action.payload.daoFromDB;
            state.appAccountInformation = action.payload.appAccountInformation;
        },
        setProposals: (state: DaoState, action: PayloadAction<any>) => {
            state.proposals = action.payload
        },
        setMembers: (state: DaoState, action: PayloadAction<any[]>) => {
            state.members = action.payload
        },
        setAppAccountInformation: (state: DaoState, action: PayloadAction<any>) => {
            state.appAccountInformation = action.payload;
        },
        setLoans: (state: DaoState, action: PayloadAction<any[]>) => {
            state.loans = action.payload;
        },
    }
})
export const { setDaoDetailProps, setProposals, setMembers, setAppAccountInformation, setLoans } = daoDetailSlice.actions;
export default daoDetailSlice.reducer;