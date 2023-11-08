import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoanState = {
    loanDetail: any,
    allLoans: any[]
}
const initialState: LoanState = {
    loanDetail: {},
    allLoans: []
}

export const loanSlice = createSlice({
    name: 'loan',
    initialState: initialState,
    reducers: {
        setCurrentLoan: (state: LoanState, action: PayloadAction<any>) => {
            state.loanDetail = action.payload
        },
        setAllLoans: (state: LoanState, action: PayloadAction<any>) => {
            state.allLoans = action.payload
        }
    }
})
export const { setCurrentLoan, setAllLoans } = loanSlice.actions;
export default loanSlice.reducer;