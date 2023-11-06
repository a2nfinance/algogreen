import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ProposalItem = {
    _id: string,
    creator: string,
    loan_id: string,
    dao_id: string,
    project_id: string,
    proposal_app_id: number,
    status: number,
    start_time: number,
    end_time: number,
    allow_early_repay: number,
    allow_early_execution: number,
    executed: number,
    title: string,
    description: string,
    borrow_amount: number,
    created_at: string,
    interest_rate?: number,
    term: number
}

type state = {
    myProposals: ProposalItem[],
    daoProposals: ProposalItem[],
    proposal: ProposalItem,
    onchainProposal: any
}

const initialState: state = {
    myProposals: [],
    daoProposals: [],
    proposal: {
        _id: "",
        creator: "",
        loan_id: "",
        dao_id: "",
        project_id: "",
        proposal_app_id: 0,
        status: 1,
        start_time: new Date().getTime(),
        end_time: new Date().getTime(),
        allow_early_repay: 1,
        allow_early_execution: 1,
        executed: 0,
        title: "",
        description: "",
        borrow_amount: 1,
        created_at: new Date().toLocaleString(),
        interest_rate: 0,
        term: 0,

    },
    onchainProposal: [{key: "agree_counter", value: 0}, {key: "disagree_counter", value: 0} ]
}

export const proposalSlice = createSlice({
    name: 'proposal',
    initialState: initialState,
    reducers: {
        setProposalState: (state: state, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        },
    }
})

export const { setProposalState } = proposalSlice.actions;
export default proposalSlice.reducer;