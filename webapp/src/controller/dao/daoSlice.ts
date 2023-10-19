import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DAO = {
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
    twitter: string,
    github: string,
    discord: string,
    status: number,
    created_at?: any
}


type DaoState = {
    isLoadingDaos: boolean,
    isLoadingSubDaos: boolean,
    daos: DAO[],
    subDaos: DAO[],
    ownerDaos: DAO[],
    ownerSubDaos: DAO[],
    countOwnerProposal: number,
    countOwnerDaos: number,
}

const initialState: DaoState = {
    isLoadingDaos: false,
    isLoadingSubDaos: false,
    daos: [],
    subDaos: [],
    ownerDaos: [],
    ownerSubDaos: [],
    countOwnerProposal: 0,
    countOwnerDaos: 0,

}

export const daoSlice = createSlice({
    name: 'dao',
    initialState: initialState,
    reducers: {
        setDaoProps: (state: DaoState, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        }
    }
})
export const { setDaoProps } = daoSlice.actions;
export default daoSlice.reducer;