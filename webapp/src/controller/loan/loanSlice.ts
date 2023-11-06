import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoanState = {
    loanDetail: any
}
const initialState: LoanState = {
    loanDetail: {}
}

export const loanSlice = createSlice({
    name: 'loan',
    initialState: initialState,
    reducers: {
        setCurrentLoan: (state: LoanState, action: PayloadAction<any>) => {
            state.loanDetail = action.payload
        }
    }
})
export const { setCurrentLoan } = loanSlice.actions;
export default loanSlice.reducer;