import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DAOFormsState = {
    currentStep: number,
    generalForm: {
        _id?: string,
        creator?: string,
        organization_name: string,
        owner: string,
        address: string,
        city?: string,
        state?: string,
        zipcode?: string,
        country?: string,
        email: string,
        phone_number: string,
        description: string,
        website?: string,
        twitter?: string,
        telegram?: string,
        facebook?: string,
        status?: number,
        dao_app_id?: number,
        token_id?: number
    },
    tokenGovernanceForm: {
        name: string,
        supply: number,
    }
    votingSettingForm: {
        dao_title: string,
        passing_threshold: number,
        quorum: number,
        submission_policy: number
    }
}


const initialState: DAOFormsState = {
    currentStep: 0,
    generalForm: {
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
        status: 0,
    },
    tokenGovernanceForm: {
        name: "",
        supply: 10000
    },
    votingSettingForm: {
        dao_title: "",
        passing_threshold: 50,
        quorum: 20,
        submission_policy: 1
    }
}

export const daoFormSlice = createSlice({
    name: 'daoForm',
    initialState: initialState,
    reducers: {
        setDaoFormProps: (state: DAOFormsState, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        },
        updateDaoFormState: (state: DAOFormsState, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        }
    }
})
export const { setDaoFormProps, updateDaoFormState } = daoFormSlice.actions;
export default daoFormSlice.reducer;