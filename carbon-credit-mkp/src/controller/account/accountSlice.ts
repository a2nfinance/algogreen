import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AccountState = {
    account: string
}

const initialState: AccountState = {
    account: ""
}
export const accountSlice = createSlice({
    name: 'account',
    initialState: initialState,
    reducers: {
        setAccountProps: (state: AccountState, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        }
    }
})
export const { setAccountProps } = accountSlice.actions;
export default accountSlice.reducer;