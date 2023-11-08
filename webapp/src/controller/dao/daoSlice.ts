import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DaoFromDB } from './daoDetailSlice';



type DaoState = {
    isLoadingDaos: boolean,
    isLoadingSubDaos: boolean,
    daos: DaoFromDB[],
    subDaos: DaoFromDB[],
    ownerDaos: DaoFromDB[],
    ownerSubDaos: DaoFromDB[],
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