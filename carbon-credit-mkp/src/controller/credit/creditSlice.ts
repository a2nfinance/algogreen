import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProjectItem } from "../project/projectSlice";

type CreditItem = {
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
type CreditAuction = {
    _id: string,
    buyer: string,
    quantity: number,
    price: number,
    credit_app_id: number,
    auction_index: number,
    status: number,
    created_at: string,
}
type state = {
    projectCredits: CreditItem[],
    featuredCredits: CreditItem[],
    allCredits: CreditItem[],
    credit: CreditItem,
    project: ProjectItem,
    creditAuctions: CreditAuction[],
    creditAppInfo?: any
}

const initialState: state = {
    projectCredits: [],
    featuredCredits: [],
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
    },
    project: {
        _id: "",
        creator: "",
        project_name: "",
        short_description: "",
        project_leader: "",
        contact_email: "",
        project_location: "",
        start_date: null,
        end_date: null,
        detail_document: "",
        video: "",
        twitter: "",
        telegram: "",
        github: "",
        description: "",
        status: 0,
        is_eco_project: 1,
        created_at: null,
    },
    creditAuctions: [],
    creditAppInfo: null
}

export const creditSlice = createSlice({
    name: 'credit',
    initialState: initialState,
    reducers: {
        setCreditState: (state: state, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        },
        setCreditAndProject: (state: state, action: PayloadAction<{ credit: CreditItem, project: ProjectItem, creditAppInfo: any }>) => {
            state.credit = action.payload.credit;
            state.project = action.payload.project;
            state.creditAppInfo = action.payload.creditAppInfo;
        }
    }
})

export const { setCreditState, setCreditAndProject } = creditSlice.actions;
export default creditSlice.reducer;