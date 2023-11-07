import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DaoFromDB =  {
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
}

export type DaoState = {
    daoFromDB: DaoFromDB,
    appAccountInformation?: any,
    proposals: any[],
    members: any[],
    loans: any[],
    onchainDAO: any[]
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
    onchainDAO: [{key: "count_member", value: 0}],
    loans: []
}

export const daoDetailSlice = createSlice({
    name: 'daoDetail',
    initialState: initialState,
    reducers: {
        setDaoDetailProps: (state: DaoState, action: PayloadAction<{daoFromDB: any, appAccountInformation: any, onchainDAO: any}>) => {
            state.daoFromDB = action.payload.daoFromDB;
            state.appAccountInformation = action.payload.appAccountInformation;
            state.onchainDAO = action.payload.onchainDAO;
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