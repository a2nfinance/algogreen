import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type CreditItem = {
    _id: string,
    app_id?: number,
    project_id: string,
    creator: string,
    title: string,
    proof_document: string,
    description: string,
    asset_id?: number,
    total_credits: number,
    origin_price?: number,
    allow_auction?: number,
    max_auction_number?: number,
    status: number,
    created_at: string,
}

type state = {
    allCredits: CreditItem[],
    credit: CreditItem
}

const initialState: state = {
    allCredits: [],
    credit: {
        _id: "",
        project_id: "",
        creator: "",
        title: "",
        proof_document: "",
        description: "",
        total_credits: 0,
        status: 0,
        created_at: null,
    }
}

export const creditSlice = createSlice({
    name: 'credit',
    initialState: initialState,
    reducers: {
        setCreditState: (state: state, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        },
    }
})

export const { setCreditState } = creditSlice.actions;
export default creditSlice.reducer;